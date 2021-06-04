
import {merge as observableMerge, from as observableFrom, Subject, Observable} from 'rxjs';

import {takeUntil, tap, mergeMap, take, flatMap, map} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {AngularFireDatabase, SnapshotAction} from "@angular/fire/database";
import {UserService} from "./user.service";
import {ApprovalStatus, UserType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {NotificationService} from "./notification.service";
import {MessageModel} from "../model/message.model";
import * as moment from "moment";
import {ResponsePlan} from "../model/responsePlan";
import {PartnerOrganisationModel} from "../model/partner-organisation.model";
import {PartnerModel} from "../model/partner.model";
import {Snap} from "ol/interaction";
import {NetworkOfficeAdminModel} from "../network-admin/network-offices/add-edit-network-office/network-office-admin.model";
import {CountryAdminModel} from "../model/country-admin.model";
import {NoteModel} from "../model/note.model";

@Injectable()
export class ResponsePlanService {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private validPartnerMap = new Map<string, boolean>();

  constructor(private afd: AngularFireDatabase,
              private userService: UserService,
              private router: Router,
              private translate: TranslateService,
              private notificationService: NotificationService) {

  }

  submitForPartnerValidation(plan, countryId) {
    console.log("submitForPartnerValidation");
    this.updatePartnerValidation(plan, countryId);
  }

  needShowWaringBypassValidation(plan): boolean {
    if (!plan.partnerOrganisations) {
      return false;
    }
    return !(plan.partnerOrganisations && plan.approval && plan.approval["partner"]);

  }

  private updatePartnerValidation(plan: SnapshotAction<ResponsePlan>, passedCountryId: string) {
    console.log(plan.key);
    const orgUserMap = new Map<string, string>();
    const needValidResponsePlanId = plan.key;

    let partnerOrgIds = [];
    plan.payload.val().partnerOrganisations.forEach(partnerOrg => {
      partnerOrgIds.push(partnerOrg);
    });

    let noPartnerUserOrg;

    observableFrom(partnerOrgIds).pipe(
      mergeMap(partnerOrgId => {
        return this.afd.object<PartnerOrganisationModel>(Constants.APP_STATUS + "/partnerOrganisation/" + partnerOrgId) //, {preserveSnapshot: true});
          .snapshotChanges()
      }),
      tap(snap => {
        if (snap && snap.payload.val()) {
          noPartnerUserOrg = snap.payload.val();
          noPartnerUserOrg["key"] = snap.key;
          this.validPartnerMap.set(snap.key, snap.payload.val().isApproved);
        }
      }),
      mergeMap(snap => {
        if (snap && snap.payload.val()) {
          orgUserMap.set(snap.key, "");
          return this.afd.object<PartnerModel>(Constants.APP_STATUS + "/partner/" + snap.payload.val().validationPartnerUserId)//, {preserveSnapshot: true})
            .snapshotChanges()
            .map(snap2 => {
              if (snap2 && snap2.payload.val()) {
                snap2.payload.val().orgId = snap.key;
                return snap2;
              }
            });
        }
      }),
      takeUntil(this.ngUnsubscribe),)
      .subscribe(snap => {
        console.log(snap);
        if (snap && snap.payload.val()) {
          console.log(snap.payload.val());
          orgUserMap.set(snap.payload.val().partnerOrganisationId, snap.key);

          let updateData = {};
          updateData["/responsePlan/" + passedCountryId + "/" + needValidResponsePlanId + "/approval/partner/" + snap.key] = ApprovalStatus.WaitingApproval;
          console.log(updateData);
          this.afd.object(Constants.APP_STATUS).update(updateData).then(() => {
            console.log("update success")
          }, error => {
            console.log(error.message);
          });
        } else {
          console.log("no partner user found!!!!!!!");
          console.log(noPartnerUserOrg);
          console.log(orgUserMap);
          let updateData = {};
          orgUserMap.forEach((v, k) => {
            if (!v) {
              updateData["/responsePlan/" + passedCountryId + "/" + needValidResponsePlanId + "/approval/partner/" + k] = ApprovalStatus.WaitingApproval;
            }
          });
          console.log(updateData);
          this.afd.object(Constants.APP_STATUS).update(updateData).then(() => {
            console.log("update success")
          }, error => {
            console.log(error.message);
          });
        }

        //update response plan status
        if (orgUserMap.size === partnerOrgIds.length) {
          this.afd.object(Constants.APP_STATUS + "/responsePlan/" + passedCountryId + "/" + plan.key + "/status").set(ApprovalStatus.WaitingApproval);
        }

      });
  }

  getResponsePlan(countryId, responsePlanId) {
    return this.afd.object(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + responsePlanId);
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

      this.afd.object(Constants.APP_STATUS).update(updateData).then(() => {

        console.log("update after status change")
        this.afd.object<any>(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + responsePlanId + "/approval/")
          .valueChanges()
          .pipe(take(1))
          .subscribe(result => {
            if (result) {
              console.log(result)
              let hasCountryDirector = Object.keys(result).includes("countryDirector");
              let approvePair = Object.keys(result).filter(key => !(key.indexOf("$") > -1)).map(key => result[key]);
              let waitingApprovalList = [];
              approvePair.forEach(item => {
                let waiting = Object.keys(item).map(key => item[key]).filter(value => (value == ApprovalStatus.WaitingApproval || value == ApprovalStatus.InProgress));
                waitingApprovalList = waitingApprovalList.concat(waiting);
              });

              console.log(waitingApprovalList)

              if (waitingApprovalList.length == 0 && hasCountryDirector && isApproved) {
                // updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/status"] = ApprovalStatus.Approved;
                let approveUpdateData = {};
                approveUpdateData["/responsePlan/" + countryId + "/" + responsePlanId + "/status"] = ApprovalStatus.Approved;
                approveUpdateData["/responsePlan/" + countryId + "/" + responsePlanId + "/timeUpdated"] = moment().utc().valueOf();
                this.afd.object(Constants.APP_STATUS).update(approveUpdateData);
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
                this.addResponsePlanRejectNote(uid, userType, responsePlanId, rejectNoteContent, isDirector, hasToken);
              } else {
                if (hasToken) {
                  this.router.navigate(["/after-validation", {"plan": true}], {skipLocationChange: true}).then();
                } else {
                  if(userType == UserType.LocalAgencyDirector){
                    this.router.navigateByUrl("/local-agency/dashboard");
                  }else{
                    isDirector ? this.router.navigateByUrl("/director") : this.router.navigateByUrl("/dashboard");
                  }

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

  private addResponsePlanRejectNote(uid, userType, responsePlanId, content, isDirector, hasToken) {
    let note = {};
    note["content"] = content;
    note["time"] = Date.now();
    note["uploadBy"] = uid;
    this.afd.list(Constants.APP_STATUS + "/note/" + responsePlanId).push(note).then(() => {
      if (hasToken) {
        this.router.navigateByUrl(Constants.LOGIN_PATH).then();
      } else {
        if (userType == UserType.LocalAgencyDirector) {
          this.router.navigateByUrl("/local-agency/dashboard")
        } else {
          isDirector ? this.router.navigateByUrl("/director") : this.router.navigateByUrl("/dashboard");
        }
      }
    }, error => {
      console.log(error.message)
    });
  }

  private getUserTypeName(userType: number): string {
    if (userType == UserType.CountryDirector || userType == UserType.LocalAgencyDirector) {
      return "countryDirector";
    } else if (userType == UserType.RegionalDirector) {
      return "regionDirector";
    } else if (userType == UserType.GlobalDirector) {
      return "globalDirector";
    } else if (userType == UserType.PartnerUser) {
      return "partner"
    } else if (userType == UserType.PartnerOrganisation) {
      return "partnerOrganisation"
    } else if (userType == UserType.LocalAgencyDirector){
      return "localAgencyDirector"
    } else {
      return "";
    }
  }

  getPartnerOrgnisation(id) {
    return this.afd.object(Constants.APP_STATUS + "/partnerOrganisation/" + id);
  }

  getPartnerBasedOnOrgId(orgId) {
    return this.afd.object<PartnerOrganisationModel>(Constants.APP_STATUS + "/partnerOrganisation/" + orgId)
      .valueChanges()
      .pipe(flatMap(partnerOrg => {
        let partnerIds = [];
        if (partnerOrg.partners) {
          partnerIds = Object.keys(partnerOrg.partners);
        }
        return observableFrom(partnerIds);
      }),
      flatMap(partnerId => {
        return this.afd.object<PartnerModel>(Constants.APP_STATUS + "/partner/" + partnerId).snapshotChanges()
      }),
      map(partner => {
        if (partner.payload.val().hasValidationPermission) {
          return partner.key;
        }
        return "";
      })
      );
  }

  getDirectors(countryId, agencyId): Observable<string | CountryAdminModel[]> {
    console.log(countryId + "/" + agencyId);
    let directorCountry = this.afd.object<string>(Constants.APP_STATUS + "/directorCountry/" + countryId).valueChanges();
    let directorRegion = this.afd.object<string | null>(Constants.APP_STATUS + "/directorRegion/" + countryId).valueChanges();
    let directorGlobal = this.afd.list<CountryAdminModel>(Constants.APP_STATUS + "/globalDirector", ref => ref.orderByChild("agencyAdmin/" + agencyId).equalTo(true)).valueChanges();
    return observableMerge(directorCountry, directorRegion, directorGlobal);
  }

  getLocalAgencyDirector(agencyId): Observable<string> {
    return this.afd.object<string>(Constants.APP_STATUS + "/directorLocalAgency/" + agencyId).valueChanges();
  }

  serviceDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * network response plan methods here
   */
  getNetworkPlanSetting(networkId) {
    return this.afd.list<Map<string,boolean>>(Constants.APP_STATUS + '/network/' + networkId + '/responsePlanSettings/sections').snapshotChanges()
      .pipe(map(sections => {
        let obj = {};
        let totalSections = 0;
        let responsePlanSettings = {};
        sections.forEach(section => {
          responsePlanSettings[section.key] = section.payload.val();
          if (section.payload.val()) {
            totalSections++;
          }
        });
        obj["totalSections"] = totalSections;
        obj["responsePlanSettings"] = responsePlanSettings;
        return obj;
      }));
  }

  getSystemGroups(systemId) {
    return this.afd.list<{name: string}>(Constants.APP_STATUS + "/system/" + systemId + '/groups')
      .valueChanges()
      .pipe(map(groupList => {
        let groups:{name: string}[] = [];
        groupList.forEach(group => {
          groups.push(group);
        });
        return groups;
      }));
  }

  pushNewResponsePlan(networkCountryId, newResponsePlan) {
    return this.afd.list<ResponsePlan>(Constants.APP_STATUS + '/responsePlan/' + networkCountryId).push(newResponsePlan)
  }

  getPlans(countryId) {
    return this.afd.list<ResponsePlan>(Constants.APP_STATUS + "/responsePlan/" + countryId).valueChanges();
  }

  getArchivedPlans(countryId) {
    return this.afd.list<ResponsePlan>(Constants.APP_STATUS + "/responsePlan/" + countryId, ref => ref.orderByChild('isActive').equalTo(false)).valueChanges()
  }

  getNotesForPlan(planId) {
    return this.afd.list<NoteModel>(Constants.APP_STATUS + "/note/" + planId).valueChanges()
  }

  expirePlan(networkCountryId, planId) {
    this.afd.object(Constants.APP_STATUS + "/responsePlan/" + networkCountryId + "/" + planId + "/isActive").set(false);
  }

  getPlanApprovalData(countryId, planId) {
    return this.afd.list<any>(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + planId + "/approval").valueChanges();
  }

  getPlanById(countryId, planId) {
    return this.afd.object<ResponsePlan>(Constants.APP_STATUS + '/responsePlan/' + countryId + '/' + planId)
      .snapshotChanges()
      .pipe(map(plan => {
        let model = new ResponsePlan();
        model.mapFromObject(plan.payload.val());
        model.id = plan.key;
        return model;
      }));
  }

}
