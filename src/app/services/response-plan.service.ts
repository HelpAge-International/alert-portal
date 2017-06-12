import {Injectable} from "@angular/core";
import {AngularFire} from "angularfire2";
import {UserService} from "./user.service";
import {ApprovalStatus, UserType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Subject} from "rxjs/Subject";
import {Router} from "@angular/router";

@Injectable()
export class ResponsePlanService {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private af: AngularFire, private userService: UserService, private router: Router) {
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
                    this.af.database.object(Constants.APP_STATUS).update(updateData).then((_) => {
                    }, (error) => {
                        console.log(error.message);
                    });
                });
        }
    }

    getResponsePlan(countryId, responsePlanId) {
        return this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + responsePlanId);
    }

    updateResponsePlanApproval(userType, uid, countryId, responsePlanId, isApproved, rejectNoteContent, isDirector) {
        let approvalName = this.getUserTypeName(userType);
        if (approvalName) {
            let updateData = {};
            updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/approval/" + approvalName + "/" + uid] = isApproved ? ApprovalStatus.Approved : ApprovalStatus.NeedsReviewing;
            updateData["/responsePlan/" + countryId + "/" + responsePlanId + "/status"] = isApproved ? ApprovalStatus.Approved : ApprovalStatus.NeedsReviewing;
            this.af.database.object(Constants.APP_STATUS).update(updateData).then(() => {
                if (rejectNoteContent) {
                    this.addResponsePlanRejectNote(uid, responsePlanId, rejectNoteContent, isDirector);
                } else {
                    isDirector ? this.router.navigateByUrl("/director") : this.router.navigateByUrl("/dashboard");
                }
            }, error => {
                console.log(error.message);
            });
        } else {
            console.log("user type is empty!!!");
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

    serviceDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
