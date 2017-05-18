import {Injectable} from '@angular/core';
import {AngularFire} from "angularfire2";
import {UserService} from "./user.service";
import {RxHelper} from "../utils/RxHelper";
import {ApprovalStatus, UserType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Subject} from "rxjs/Subject";
import {error} from "util";

@Injectable()
export class ResponsePlanService {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private userService: UserService) {
  }

  submitForPartnerValidation(plan, uid) {
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
    if (user == UserType.CountryAdmin) {
      let countryId = "";
      this.af.database.object(paths[user] + uid)
        .flatMap(countryAdmin => {
          countryId = countryAdmin.countryId;
          return this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + countryAdmin.countryId + "/" + plan.$key)
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(responsePlan => {
          let approvalData = {};
          if (responsePlan.approval) {
            approvalData = responsePlan.approval;
          }
          let partnerData = {};
          responsePlan.partnerOrganisations.forEach(partnerId => {
            partnerData[partnerId] = ApprovalStatus.WaitingApproval;
          });
          approvalData["partner"] = partnerData;

          let updateData = {};
          updateData["/responsePlan/" + countryId + "/" + plan.$key + "/approval/"] = approvalData;
          // updateData["/responsePlan/" + countryId + "/" + plan.$key + "/status/"] = ApprovalStatus.WaitingApproval;
          this.af.database.object(Constants.APP_STATUS).update(updateData).then((_) => {}, (error) => {
            console.log(error.message);
          });
        });
    }
  }

  serviceDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
