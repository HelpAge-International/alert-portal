import {Injectable} from "@angular/core";
import {AngularFire} from "angularfire2";
import {UserService} from "./user.service";
import {ApprovalStatus, UserType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Subject} from "rxjs/Subject";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from "./notification.service";
import { MessageModel } from "../model/message.model";

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

  submitForPartnerValidation(plan, uid) {
    console.log("submitForPartnerValidation");
    this.userService.getUserType(uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        this.updatePartnerValidation(uid, user, plan);
      });
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

  private updatePartnerValidation(uid: string, user: UserType, plan: any) {
    const paths: string[] = [, , Constants.APP_STATUS + "/directorRegion/",
      Constants.APP_STATUS + "/directorCountry/", , , , , Constants.APP_STATUS + "/administratorCountry/",]
    // if (user == UserType.CountryAdmin) {
    let countryId = "";
    this.userService.getCountryId(Constants.USER_PATHS[user], uid)
    // this.af.database.object(paths[user] + uid)
      .flatMap(fetchedCountryId => {
        countryId = fetchedCountryId;
        return this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + plan.$key)
      })
      .flatMap(responsePlan => {
        this.responsePlan = responsePlan;
        let partnerIds = [];
        responsePlan.partnerOrganisations.forEach(partner => {
          partnerIds.push(partner);
        });
        return Observable.from(partnerIds);
      })
      .flatMap(partnerId => {
        return this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + partnerId);
      })
      .do(partner => {
        this.validPartnerMap.set(partner.$key, partner.isApproved);
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        console.log(this.validPartnerMap);
        console.log(this.responsePlan);
        let approvalData = {};
        if (this.responsePlan.approval) {
          approvalData = this.responsePlan.approval;
        }
        let partnerData = {};
        this.responsePlan.partnerOrganisations.forEach(partnerId => {
          if (this.validPartnerMap.get(partnerId)) {
            partnerData[partnerId] = ApprovalStatus.WaitingApproval;
          }
        });
        approvalData["partner"] = partnerData;

        let updateData = {};
        updateData["/responsePlan/" + countryId + "/" + plan.$key + "/approval/"] = approvalData;
        // updateData["/responsePlan/" + countryId + "/" + plan.$key + "/status/"] = ApprovalStatus.WaitingApproval;
        this.af.database.object(Constants.APP_STATUS).update(updateData).then(() => {
        }, error => {
          console.log(error.message);
        });
      });
    // }
  }

  getResponsePlan(countryId, responsePlanId) {
    return this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + responsePlanId);
  }

  updateResponsePlanApproval(userType, uid, countryId, responsePlanId, isApproved, rejectNoteContent, isDirector, responsePlanName, agencyId) {
    let approvalName = this.getUserTypeName(userType);
    console.log("USER TYPE ---- " + Constants.USER_PATHS[userType]);
    if (approvalName) {
      let updateData = {};
      updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/approval/" + approvalName + "/" + uid] = isApproved ? ApprovalStatus.Approved : ApprovalStatus.NeedsReviewing;

      // Updating status if the plan is rejected
      if (!isApproved) {
        updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/status"] = ApprovalStatus.NeedsReviewing;
      }

      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + responsePlanId + "/approval/")
        .take(1)
        .subscribe(result => {
          if (result) {
            let approvePair = Object.keys(result).filter(key => !(key.indexOf("$") > -1)).map(key => result[key]);
            let waitingApprovalList = [];
            approvePair.forEach(item => {
              let waiting = Object.keys(item).map(key => item[key]).filter(value => value == ApprovalStatus.WaitingApproval);
              waitingApprovalList = waitingApprovalList.concat(waiting);
            });

            if (waitingApprovalList.length == 0) {
              updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/status"] = ApprovalStatus.Approved;
            }

            this.af.database.object(Constants.APP_STATUS).update(updateData).then(() => {
              if(!isApproved)
              {
                // Send notification to users with Response plan rejected
                const responsePlanRejectedNotificationSetting = 5;

                let notification = new MessageModel();
                notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_REJECTED_TITLE", { responsePlan: responsePlanName});
                notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_REJECTED_CONTENT", { responsePlan: responsePlanName});
                notification.time = new Date().getTime();

                this.notificationService.saveUserNotificationBasedOnNotificationSetting(notification, responsePlanRejectedNotificationSetting, agencyId, countryId);
              }

              if (rejectNoteContent) {
                this.addResponsePlanRejectNote(uid, responsePlanId, rejectNoteContent, isDirector);
              } else {
                isDirector ? this.router.navigateByUrl("/director") : this.router.navigateByUrl("/dashboard");
              }
            }, error => {
              console.log(error.message);
            });
          }
        });

    } else {
      console.log("user type is empty");
    }
  }

  private addResponsePlanRejectNote(uid, responsePlanId, content, isDirector) {
    let note = {};
    note["content"] = content;
    note["time"] = Date.now();
    note["uploadBy"] = uid;
    this.af.database.list(Constants.APP_STATUS + "/note/" + responsePlanId).push(note).then(() => {
      isDirector ? this.router.navigateByUrl("/director") : this.router.navigateByUrl("/dashboard");
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
    } else {
      return "";
    }
  }

  getPartnerOrgnisation(id) {
    return this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + id);
  }

  serviceDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
