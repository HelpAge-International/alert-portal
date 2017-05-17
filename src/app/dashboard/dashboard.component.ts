import {Component, OnInit, OnDestroy} from '@angular/core';
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {RxHelper} from "../utils/RxHelper";
import {Observable} from "rxjs";
import {AlertLevels, ApprovalStatus, Countries} from "../utils/Enums";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {

  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
  private agencyAdminUid: string;
  private systemAdminUid: string;

  private overallAlertLevel: AlertLevels = AlertLevels.Green; // TODO - Find this value

  private countryLocation: any;
  private CountriesList = Constants.COUNTRIES;
  private count: number = 0;
  private numOfApprovedResponsePlans: number = 0;
  private sysAdminMinThreshold: any = [];
  private sysAdminAdvThreshold: any = [];
  private mpaStatusIcon: any;
  private mpaStatusColor: any;
  private advStatusIcon: any;
  private advStatusColor: any;
  private percentageCHS: any;

  private AlertLevels = AlertLevels;

  private alerts: Observable<any>;

  private hazards: any[] = [];
  private hazardObject = {};
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.loadData();
      } else {
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  /**
   * Private functions
   */

  private loadData() {
    this.getCountryId().then(() => {
      this.getApprovedResponsePlansCount();
      this.getAlerts();
      this.getHazards();
    });
    this.getAgencyID().then(() => {
      this.getCountryData();
    });
    this.getSystemAdminID().then(() => {
      this.getSystemThreshold('minThreshold').then((minThreshold: any) => {
        this.sysAdminMinThreshold = minThreshold;
        this.getSystemThreshold('advThreshold').then((advThreshold: any) => {
          this.sysAdminAdvThreshold = advThreshold;
          this.getAllActions();
        });
      });
    });
  }

  private getCountryId() {
    let promise = new Promise((res, rej) => {
      let subscription = this.af.database.object(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + "/countryId").subscribe((countryId: any) => {
        this.countryId = countryId.$value;
        res(true);
      });
      this.subscriptions.add(subscription);
    });
    return promise;
  }

  private getAgencyID() {
    let promise = new Promise((res, rej) => {
      let subscription = this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/agencyAdmin').subscribe((agencyIds: any) => {
        this.agencyAdminUid = agencyIds[0].$key ? agencyIds[0].$key : "";
        res(true);
      });
      this.subscriptions.add(subscription);
    });
    return promise;
  }

  private getSystemAdminID() {
    let promise = new Promise((res, rej) => {
      let subscription = this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/systemAdmin').subscribe((systemAdminIds: any) => {
        this.systemAdminUid = systemAdminIds[0].$key ? systemAdminIds[0].$key : "";
        res(true);
      });
      this.subscriptions.add(subscription);
    });
    return promise;
  }

  private getCountryData() {
    let promise = new Promise((res, rej) => {
      let subscription = this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyAdminUid + '/' + this.countryId + "/location").subscribe((location: any) => {
        this.countryLocation = location.$value;
        res(true);
      });
      this.subscriptions.add(subscription);
    });
    return promise;
  }

  private getApprovedResponsePlansCount() {
    let promise = new Promise((res, rej) => {
      let subscription = this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + this.countryId).subscribe((responsePlans: any) => {
        this.getCountApprovalStatus(responsePlans);
        res(true);
      });
      this.subscriptions.add(subscription);
    });
    return promise;
  }

  private getCountApprovalStatus(responsePlans: any) {
    responsePlans.forEach((responsePlan: any) => {
      var approvals = responsePlan.approval;
      this.count = 0;
      this.recursiveParseArray(approvals);
    });
  }

  private recursiveParseArray(approvals: any) {
    for (let A in approvals) {
      if (typeof (approvals[A]) == 'object') {
        this.recursiveParseArray(approvals[A]);
      } else {
        var approvalStatus = approvals[A];
        if (approvalStatus == ApprovalStatus.Approved) {
          this.count = this.count + 1;
          this.numOfApprovedResponsePlans = this.count;
        }
      }
    }
  }

  private getAllActions() {
    let promise = new Promise((res, rej) => {
      let subscription = this.af.database.list(Constants.APP_STATUS + "/action/" + this.countryId).subscribe((actions: any) => {
        this.getPercenteActions(actions);
        res(true);
      });
      this.subscriptions.add(subscription);
    });
    return promise;
  }

  private getPercenteActions(actions: any) {

    let promise = new Promise((res, rej) => {
      var countAllMinimumActions = 0;
      var countAllAdvancedActions = 0;
      var countCompletedMinimumActions = 0;
      var countCompletedAdvancedActions = 0;
      var countCompletedAllActions = 0;

      actions.forEach((action: any) => {
        if (action.level == 1) {
          countAllMinimumActions = countAllMinimumActions + 1;
          if (action.actionStatus == 2) {
            countCompletedMinimumActions = countCompletedMinimumActions + 1;
          }
        }

        if (action.level == 2) {
          countAllAdvancedActions = countAllAdvancedActions + 1;
          if (action.actionStatus == 2) {
            countCompletedAdvancedActions = countCompletedAdvancedActions + 1;
          }
        }

        if (action.actionStatus == 2) {
          countCompletedAllActions = countCompletedAllActions + 1;
        }
      });

      var percentageMinimumCompletedActions = (countCompletedMinimumActions / countAllMinimumActions) * 100;
      percentageMinimumCompletedActions = percentageMinimumCompletedActions ? percentageMinimumCompletedActions : 0;

      var percentageAdvancedCompletedActions = (countCompletedAdvancedActions / countAllAdvancedActions) * 100;
      percentageAdvancedCompletedActions = percentageAdvancedCompletedActions ? percentageAdvancedCompletedActions : 0;

      if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= this.sysAdminMinThreshold[0].$value) {
        this.mpaStatusColor = 'green';
        this.mpaStatusIcon = 'fa-check';
      }
      if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= this.sysAdminMinThreshold[1].$value) {
        this.mpaStatusColor = 'orange';
        this.mpaStatusIcon = 'fa-ellipsis-h';
      }
      if (!percentageMinimumCompletedActions) {
        this.mpaStatusColor = 'red';
        this.mpaStatusIcon = 'fa-times'
      }


      if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= this.sysAdminAdvThreshold[0].$value) {
        this.advStatusColor = 'green';
        this.advStatusIcon = 'fa-check';
      }
      if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= this.sysAdminAdvThreshold[1].$value) {
        this.advStatusColor = 'orange';
        this.advStatusIcon = 'fa-ellipsis-h';
      }
      if (!percentageAdvancedCompletedActions) {
        this.advStatusColor = 'red';
        this.advStatusIcon = 'fa-times';
      }

      this.getActionsBySystemAdmin().then((actions: any) => {
        var countAllActionsSysAdmin = actions.length && actions.length > 0 ? actions.length : 0;
        this.percentageCHS = Math.round((countCompletedAllActions / countAllActionsSysAdmin) * 100);
      });

      res(true);
    });

    return promise;
  }

  private getActionsBySystemAdmin() {
    let promise = new Promise((res, rej) => {
      let subscription = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid).subscribe((actions: any) => {
        res(actions);
      });
      this.subscriptions.add(subscription);
    });
    return promise;
  }

  private getSystemThreshold(thresholdType: string) {
    let promise = new Promise((res, rej) => {
      let subscription = this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminUid + '/' + thresholdType).subscribe((threshold: any) => {
        res(threshold);
      });
      this.subscriptions.add(subscription);
    });
    return promise;
  }

  private getAlerts() {

    this.alerts = this.af.database.list(Constants.APP_STATUS + "/alert/" + this.countryId, {
      query: {
        orderByChild: "alertLevel",
        equalTo: AlertLevels.Red
      }
    });
  }

  // TODO - FIX
  private getHazards() {

    let subscription = this.af.database.list(Constants.APP_STATUS + '/hazard/' + this.countryId)
      .flatMap(list => {
        this.hazards = [];
        let tempList = [];
        list.forEach(hazard => {
          tempList.push(hazard);
          this.hazardObject[hazard.$key] = hazard;
        });
        return Observable.from(tempList)
      })
      .flatMap(hazard => {
        return this.af.database.object(Constants.APP_STATUS + '/indicator/' + hazard.$key)
      })
      .distinctUntilChanged()
      .subscribe(x => {
        this.hazards.push(x);
        console.log(x);
      });
    this.subscriptions.add(subscription);
  }

  public getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
