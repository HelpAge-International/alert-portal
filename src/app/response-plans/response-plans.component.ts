import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {RxHelper} from "../utils/RxHelper";
import {Constants} from "../utils/Constants";
import {ApprovalStatus, UserType} from "../utils/Enums";
import {Observable} from "rxjs/Observable";
import set = Reflect.set;
declare const jQuery: any;

@Component({
  selector: 'app-response-plans',
  templateUrl: './response-plans.component.html',
  styleUrls: ['./response-plans.component.css']
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

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
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

  goToNewOrEditPlan() {
    this.router.navigateByUrl('response-plans/create-edit-response-plan');
  }

  submitForApproval(plan) {
    this.planToApproval = plan;
    jQuery("#dialog-action").modal("show");
    this.dialogTitle = "Submit without partner validation";
    this.dialogContent = "This plan has not been validated by your partners. Are you sure you want to submit it for director approval?";
  }

  confirmDialog() {
    jQuery("#dialog-action").modal("hide");
    if (this.userType == UserType.CountryAdmin) {
      let approvalData = {};
      let countryId = "";
      let agencyId = "";
      let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid)
        .flatMap(countryAdmin => {
          // console.log(countryAdmin);
          countryId = countryAdmin.countryId;
          agencyId = Object.keys(countryAdmin.agencyAdmin)[0];
          return this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + countryId);
        })
        .do(director => {
          if (director && director.$value) {
            console.log("country director");
            console.log(director);
            // console.log(this.planToApproval);
            // console.log("country id: " + countryId);
            // console.log(agencyId);
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + director.$value] = ApprovalStatus.WaitingApproval;
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;
          } else {
            this.waringMessage = "No country director, can not submit for approval!";
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
            this.af.database.object(Constants.APP_STATUS).update(approvalData);
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

  private updateWithRegionalApproval(countryId: string, approvalData) {

    let subscription = this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + countryId)
      .subscribe(id => {
        // console.log(id);
        if (id && id.$value) {
          approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/regionDirector/" + id.$value] = ApprovalStatus.WaitingApproval;
          // console.log("*****approve data*****");
          // console.log(approvalData);
          // console.log("*****approve data*****");
          this.af.database.object(Constants.APP_STATUS).update(approvalData).then(() => {
            console.log("success");
          }, error => {
            console.log(error.message);
          });
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
    return Object.keys(plan.approval).map(key => plan.approval[key]);
  }

  getApproveStatus(approve) {
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


}
