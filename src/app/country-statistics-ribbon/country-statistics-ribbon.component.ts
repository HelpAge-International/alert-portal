import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {Constants} from "../utils/Constants";
import {ApprovalStatus, AlertLevels, Countries} from "../utils/Enums";

@Component({
  selector: 'app-country-statistics-ribbon',
  templateUrl: './country-statistics-ribbon.component.html',
  styleUrls: ['./country-statistics-ribbon.component.css']
})
export class CountryStatisticsRibbonComponent implements OnInit, OnDestroy {

  // TODO - Check when other users are implemented
  private USER_TYPE: string = 'administratorCountry';
  private uid: string;
  private countryId: string;
  private agencyAdminId: string;
  private systemAdminId: string;

  private AlertLevels = AlertLevels;
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

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.loadData();
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  /**
   * Private functions
   */

  private loadData() {
    this.getCountryId().then(() => {
      this.getApprovedResponsePlansCount();
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
      this.af.database.object(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + "/countryId")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((countryId: any) => {
          this.countryId = countryId.$value;
          res(true);
        });
    });
    return promise;
  }

  private getAgencyID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIds: any) => {
          this.agencyAdminId = agencyIds[0].$key ? agencyIds[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private getSystemAdminID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((systemAdminIds: any) => {
          this.systemAdminId = systemAdminIds[0].$key ? systemAdminIds[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private getCountryData() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyAdminId + '/' + this.countryId + "/location")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value;
          res(true);
        });
    });
    return promise;
  }

  private getApprovedResponsePlansCount() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((responsePlans: any) => {
          this.getCountApprovalStatus(responsePlans);
          res(true);
        });
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

  private getSystemThreshold(thresholdType: string) {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminId + '/' + thresholdType)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((threshold: any) => {
          res(threshold);
        });
    });
    return promise;
  }

  private getAllActions() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/action/" + this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((actions: any) => {
          this.getPercenteActions(actions);
          res(true);
        });
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
      if (!percentageMinimumCompletedActions || percentageMinimumCompletedActions < this.sysAdminMinThreshold[1].$value) {
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
      if (!percentageAdvancedCompletedActions || percentageAdvancedCompletedActions < this.sysAdminAdvThreshold[1].$value) {
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
      this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((actions: any) => {
          res(actions);
        });
    });
    return promise;
  }

  public getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
