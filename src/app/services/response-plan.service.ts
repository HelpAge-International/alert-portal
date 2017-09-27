import {Injectable} from "@angular/core";
import {AngularFire} from "angularfire2";
import {UserService} from "./user.service";
import {ApprovalStatus, UserType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Subject} from "rxjs/Subject";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {TranslateService} from "@ngx-translate/core";
import {NotificationService} from "./notification.service";
import {MessageModel} from "../model/message.model";
import {User} from "firebase/app";
import * as moment from "moment";

@Injectable()
export class ResponsePlanService {
  private responsePlan: any;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private validPartnerMap = new Map<string, boolean>();

  constructor(private af: AngularFire,
              private userService: UserService,
              private router: Router,
              private translate: TranslateService,
              private notificationService: NotificationService) {

  }

  submitForPartnerValidation(plan, countryId) {
    console.log("submitForPartnerValidation");
    this.updatePartnerValidation(plan, countryId);
  }

  needShowWaringBypassValidation(plan) {
    console.log(plan);
    if (!plan.partnerOrganisations) {
      return false;
    }
    if (plan.partnerOrganisations && plan.approval && plan.approval["partner"]) {
      return false;
    }
    return true;
  }

  private updatePartnerValidation(plan: any, passedCountryId: string) {
    console.log(plan.$key);
    const orgUserMap = new Map<string, string>();
    const needValidResponsePlanId = plan.$key;

    let partnerOrgIds = [];
    plan.partnerOrganisations.forEach(partnerOrg => {
      partnerOrgIds.push(partnerOrg);
    });

    let noPartnerUserOrg;

    Observable.from(partnerOrgIds)
      .flatMap(partnerOrgId => {
        return this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + partnerOrgId, {preserveSnapshot: true});
      })
      .do(snap => {
        if (snap && snap.val()) {
          noPartnerUserOrg = snap.val();
          noPartnerUserOrg["key"] = snap.key;
          this.validPartnerMap.set(snap.key, snap.val().isApproved);
        }
      })
      .flatMap(snap => {
        if (snap && snap.val()) {
          orgUserMap.set(snap.key, "");
          return this.af.database.object(Constants.APP_STATUS + "/partner/" + snap.val().validationPartnerUserId, {preserveSnapshot: true})
            .map(snap => {
              if (snap && snap.val()) {
                snap.val()["orgId"] = snap.key;
                return snap;
              }
            });
        }
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snap => {
        console.log(snap);
        if (snap && snap.val()) {
          console.log(snap.val());
          orgUserMap.set(snap.val().partnerOrganisationId, snap.key);

          let updateData = {};
          updateData["/responsePlan/" + passedCountryId + "/" + needValidResponsePlanId + "/approval/partner/" + snap.key] = ApprovalStatus.WaitingApproval;
          console.log(updateData);
          this.af.database.object(Constants.APP_STATUS).update(updateData).then(() => {
            console.log("update success")
          }, error => {
            console.log(error.message);
          });
        } else {
          console.log("no partner user found!!!!!!!")
          console.log(noPartnerUserOrg);
          console.log(orgUserMap);
          let updateData = {};
          orgUserMap.forEach((v, k) => {
            if (!v) {
              updateData["/responsePlan/" + passedCountryId + "/" + needValidResponsePlanId + "/approval/partner/" + k] = ApprovalStatus.WaitingApproval;
            }
          });
          console.log(updateData);
          this.af.database.object(Constants.APP_STATUS).update(updateData).then(() => {
            console.log("update success")
          }, error => {
            console.log(error.message);
          });
        }

        //update response plan status
        if (orgUserMap.size === partnerOrgIds.length) {
          this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + passedCountryId + "/" + plan.$key + "/status").set(ApprovalStatus.WaitingApproval);
        }

      });
  }

  getResponsePlan(countryId, responsePlanId) {
    return this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + responsePlanId);
  }

  updateResponsePlanApproval(userType, uid, countryId, responsePlanId, isApproved, rejectNoteContent, isDirector, responsePlanName, agencyId, hasToken) {
    let approvalName = this.getUserTypeName(userType);
    console.log("USER TYPE ---- " + Constants.USER_PATHS[userType]);
    if (approvalName) {
      let updateData = {};
      updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/approval/" + approvalName + "/" + uid] = isApproved ? ApprovalStatus.Approved : ApprovalStatus.NeedsReviewing;

      // Updating status if the plan is rejected
      if (!isApproved) {
        updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/status"] = ApprovalStatus.NeedsReviewing;
      }

      this.af.database.object(Constants.APP_STATUS).update(updateData).then(() => {


        this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + responsePlanId + "/approval/")
          .take(1)
          .subscribe(result => {
            if (result) {
              let hasCountryDirector = Object.keys(result).includes("countryDirector");
              let approvePair = Object.keys(result).filter(key => !(key.indexOf("$") > -1)).map(key => result[key]);
              let waitingApprovalList = [];
              approvePair.forEach(item => {
                let waiting = Object.keys(item).map(key => item[key]).filter(value => value == ApprovalStatus.WaitingApproval);
                waitingApprovalList = waitingApprovalList.concat(waiting);
              });

              if (waitingApprovalList.length == 0 && hasCountryDirector) {
                // updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/status"] = ApprovalStatus.Approved;
                let approveUpdateData = {};
                approveUpdateData["/responsePlan/" + countryId + "/" + responsePlanId + "/status"] = ApprovalStatus.Approved;
                approveUpdateData["/responsePlan/" + countryId + "/" + responsePlanId + "/timeUpdated"] = moment().utc().valueOf();
                this.af.database.object(Constants.APP_STATUS).update(approveUpdateData);
                // this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + responsePlanId + "/status").set(ApprovalStatus.Approved);
              }

              if (!isApproved && agencyId) {
                // Send notification to users with Response plan rejected
                const responsePlanRejectedNotificationSetting = 5;

                let notification = new MessageModel();
                notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_REJECTED_TITLE", {responsePlan: responsePlanName});
                notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_REJECTED_CONTENT", {responsePlan: responsePlanName});
                notification.time = new Date().getTime();

                this.notificationService.saveUserNotificationBasedOnNotificationSetting(notification, responsePlanRejectedNotificationSetting, agencyId, countryId);
              }

              if (rejectNoteContent) {
                this.addResponsePlanRejectNote(uid, responsePlanId, rejectNoteContent, isDirector, hasToken);
              } else {
                if (hasToken) {
                  this.router.navigate(["/after-validation", {"plan": true}], {skipLocationChange: true});
                } else {
                  isDirector ? this.router.navigateByUrl("/director") : this.router.navigateByUrl("/dashboard");
                }
              }
            }
          });
      }, error => {
        console.log(error.message);
      });


    } else {
      console.log("user type returned data is empty");
    }
  }

  private addResponsePlanRejectNote(uid, responsePlanId, content, isDirector, hasToken) {
    let note = {};
    note["content"] = content;
    note["time"] = Date.now();
    note["uploadBy"] = uid;
    this.af.database.list(Constants.APP_STATUS + "/note/" + responsePlanId).push(note).then(() => {
      if (hasToken) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      } else {
        isDirector ? this.router.navigateByUrl("/director") : this.router.navigateByUrl("/dashboard");
      }
    }, error => {
      console.log(error.message)
    });
  }

  private getUserTypeName(userType: number): string {
    if (userType == UserType.CountryDirector) {
      return "countryDirector";
    } else if (userType == UserType.RegionalDirector) {
      return "regionDirector";
    } else if (userType == UserType.GlobalDirector) {
      return "globalDirector";
    } else if (userType == UserType.PartnerUser) {
      return "partner"
    } else if (userType == UserType.PartnerOrganisation) {
      return "partnerOrganisation"
    } else {
      return "";
    }
  }

  getPartnerOrgnisation(id) {
    return this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + id);
  }

  getPartnerBasedOnOrgId(orgId) {
    return this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + orgId)
      .flatMap(partnerOrg => {
        let partnerIds = [];
        if (partnerOrg.partners) {
          partnerIds = Object.keys(partnerOrg.partners);
        }
        return Observable.from(partnerIds);
      })
      .flatMap(partnerId => {
        return this.af.database.object(Constants.APP_STATUS + "/partner/" + partnerId)
      })
      .map(partner => {
        if (partner.hasValidationPermission) {
          return partner.$key;
        }
        return "";
      });
  }

  getDirectors(countryId, agencyId): Observable<any> {
    console.log(countryId + "/" + agencyId);
    let directorCountry = this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + countryId);
    let directorRegion = this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + countryId);
    let directorGlobal = this.af.database.list(Constants.APP_STATUS + "/globalDirector", {
      query: {
        orderByChild: "agencyAdmin/" + agencyId,
        equalTo: true
      }
    });
    return Observable.merge(directorCountry, directorRegion, directorGlobal);
  }

  serviceDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * network response plan methods here
   */
  getNetworkPlanSetting(networkId) {
    return this.af.database.list(Constants.APP_STATUS + '/network/' + networkId + '/responsePlanSettings/sections')
      .map(sections => {
        let obj = {};
        let totalSections = 0;
        let responsePlanSettings = {};
        sections.forEach(section => {
          responsePlanSettings[section.$key] = section.$value;
          if (section.$value) {
            totalSections++;
          }
        });
        obj["totalSections"] = totalSections;
        obj["responsePlanSettings"] = responsePlanSettings;
        return obj;
      });
  }

  getSystemGroups(systemId) {
    return this.af.database.list(Constants.APP_STATUS + "/system/" + systemId + '/groups')
      .map(groupList => {
        let groups = [];
        groupList.forEach(group => {
          groups.push(group);
        });
        return groups;
      });
  }

  pushNewResponsePlan(networkCountryId, newResponsePlan) {
    return this.af.database.list(Constants.APP_STATUS + '/responsePlan/' + networkCountryId).push(newResponsePlan)
  }

}
