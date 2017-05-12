import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {RxHelper} from "../utils/RxHelper";
import {Constants} from "../utils/Constants";
import {ApprovalStatus, UserType} from "../utils/Enums";
import {Observable} from "rxjs/Observable";
import set = Reflect.set;
import {ResponsePlanService} from "../services/response-plan.service";
declare const jQuery: any;

@Component({
  selector: 'app-response-plans',
  templateUrl: './response-plans.component.html',
  styleUrls: ['./response-plans.component.css'],
  providers: [ResponsePlanService]
})

export class ResponsePlansComponent implements OnInit, OnDestroy {

  private dialogTitle: string;
  private dialogContent: string;
  private uid: string;
  private activePlans: any[] = [];
  private archivedPlans: FirebaseListObservable<any[]>;
  private planToApproval: any;
  private userType: number = -1;
  private hideWarning: boolean = true;
  private waringMessage: string;
  private countryId: string;
  private notesMap = new Map();
  private needShowDialog: boolean;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper, private service: ResponsePlanService) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("Admin uid: " + this.uid);
        this.checkUserType(this.uid);
      } else {
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  private checkUserType(uid: string) {
    let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + uid)
      .subscribe(admin => {
        if (admin.countryId) {
          this.userType = UserType.CountryAdmin;
          this.countryId = admin.countryId;
          this.getResponsePlans(admin.countryId);
        } else {
          console.log("check other user types!")
        }
      });
    this.subscriptions.add(subscription);
  }

  private getResponsePlans(id: string) {
    let subscription = this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id, {
      query: {
        orderByChild: "isActive",
        equalTo: true
      }
    })
      .subscribe(plans => {
        this.activePlans = plans;
      });
    this.subscriptions.add(subscription);

    this.archivedPlans = this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id, {
      query: {
        orderByChild: "isActive",
        equalTo: false
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
    this.service.releaseSubscriptions();
  }

  getName(id) {
    let name = "";
    let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + id)
      .subscribe(user => {
        name = user.firstName + " " + user.lastName;
      });
    this.subscriptions.add(subscription);

    return name;
  }

  goToCreateNewResponsePlan() {
    this.router.navigateByUrl('response-plans/create-edit-response-plan');
  }

  editResponsePlan(responsePlan) {
    this.router.navigate(['response-plans/create-edit-response-plan', {id: responsePlan.$key}]);
  }

  submitForApproval(plan) {
    this.needShowDialog = this.service.needShowWaringBypassValidation(plan);
    this.planToApproval = plan;
    if (this.needShowDialog) {
      jQuery("#dialog-action").modal("show");
      this.dialogTitle = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_TITLE";
      this.dialogContent = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_CONTENT";
    } else {
      this.confirmDialog();
    }
  }

  submitForPartnerValidation(plan) {
    this.service.submitForPartnerValidation(plan, this.uid);
  }

  confirmDialog() {
    if (this.needShowDialog) {
      jQuery("#dialog-action").modal("hide");
    }
    if (this.userType == UserType.CountryAdmin) {
      let approvalData = {};
      let countryId = "";
      let agencyId = "";
      let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid)
        .flatMap(countryAdmin => {
          countryId = countryAdmin.countryId;
          agencyId = Object.keys(countryAdmin.agencyAdmin)[0];
          return this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + countryId);
        })
        .do(director => {
          if (director && director.$value) {
            console.log("country director");
            console.log(director);
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + director.$value] = ApprovalStatus.WaitingApproval;
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;
          } else {
            this.waringMessage = "ERROR_NO_COUNTRY_DIRECTOR";
            this.showAlert();
            return;
          }
        })
        .flatMap(() => {
          return this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/responsePlanSettings/approvalHierachy")
        })
        .map(approvalSettings => {
          let setting = [];
          approvalSettings.forEach(item => {
            setting.push(item.$value);
          });
          return setting;
        })
        .first()
        .subscribe(approvalSettings => {
          // console.log("***");
          // console.log(approvalSettings);
          // console.log(approvalData);
          if (approvalSettings[0] == false && approvalSettings[1] == false) {
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/regionDirector/"] = null;
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/globalDirector/"] = null;
            this.updatePartnerValidation(countryId, approvalData);

          } else if (approvalSettings[0] != false && approvalSettings[1] == false) {
            console.log("regional enabled");
            this.updateWithRegionalApproval(countryId, approvalData);
          } else if (approvalSettings[0] == false && approvalSettings[1] != false) {
            console.log("global enabled")
          } else {
            console.log("both directors enabled")
          }
        });
      this.subscriptions.add(subscription);
    }
  }

  private updatePartnerValidation(countryId: string, approvalData: {}) {
    if (this.planToApproval.partnerOrganisations) {
      let partnerData = {};
      this.planToApproval.partnerOrganisations.forEach(item => {
        partnerData[item] = ApprovalStatus.InProgress;
      });
      approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/partner/"] = partnerData;
    }
    this.af.database.object(Constants.APP_STATUS).update(approvalData).then(() => {
      console.log("success");
    }, error => {
      console.log(error.message);
    });
  }

  private updateWithRegionalApproval(countryId: string, approvalData) {

    let subscription = this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + countryId)
      .subscribe(id => {
        // console.log(id);
        if (id && id.$value) {
          approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/regionDirector/" + id.$value] = ApprovalStatus.WaitingApproval;
          this.updatePartnerValidation(countryId, approvalData);
        }
      });
    this.subscriptions.add(subscription);
  }

  closeModal() {
    jQuery("#dialog-action").modal("hide");
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private showAlert() {
    this.hideWarning = false;
    let subscribe = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
      this.hideWarning = true;
    });
    this.subscriptions.add(subscribe);
  }

  getApproves(plan) {
    if (!plan.approval) {
      return;
    }
    return Object.keys(plan.approval).filter(key => key != "partner").map(key => plan.approval[key]);
  }

  getApproveStatus(approve) {
    if (!approve) {
      return;
    }
    let list = Object.keys(approve).map(key => approve[key]);
    return list[0] == ApprovalStatus.Approved;
  }

  activatePlan(plan) {
    if (this.userType == UserType.CountryAdmin) {
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/isActive").set(true);
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/status").set(ApprovalStatus.NeedsReviewing);
      let subscription = this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval")
        .map(list => {
          let newList = [];
          list.forEach(item => {
            let data = {};
            data[item.$key] = Object.keys(item)[0];
            newList.push(data);
          });
          return newList;
        })
        .first()
        .subscribe(approvalList => {
          for (let approval of approvalList) {
            console.log(approval);
            if (approval["countryDirector"]) {
              this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval/countryDirector/" + approval["countryDirector"])
                .set(ApprovalStatus.NeedsReviewing);
            }
            if (approval["regionDirector"]) {
              this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval/regionDirector/" + approval["regionDirector"])
                .set(ApprovalStatus.NeedsReviewing);
            }
            if (approval["globalDirector"]) {
              this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval/globalDirector/" + approval["globalDirector"])
                .set(ApprovalStatus.NeedsReviewing);
            }
          }
        });
      this.subscriptions.add(subscription);
    }
  }

  getNotes(plan) {
    if (plan.status == ApprovalStatus.NeedsReviewing) {
      let subscription = this.af.database.list(Constants.APP_STATUS + "/note/" + plan.$key)
        .first()
        .subscribe(list => {
          this.notesMap.set(plan.$key, list);
        });
      this.subscriptions.add(subscription);
    }
    return this.notesMap.get(plan.$key);
  }

  testExport() {
    this.router.navigateByUrl("/export");
  }


}
