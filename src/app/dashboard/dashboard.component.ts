import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {RxHelper} from "../utils/RxHelper";
import {Observable} from "rxjs";
import {AlertLevels, ApprovalStatus, Countries} from "../utils/Enums";
import {UserService} from "../services/user.service";
import {ActionsService} from "../services/actions.service";
import * as moment from "moment";
import {Subject} from "rxjs/Subject";
import {HazardImages} from "../utils/HazardImages";
import {ModelAlert} from "../model/alert.model";
declare var Chronoline, document, DAY_IN_MILLISECONDS, isFifthDay, prevMonth, nextMonth: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ActionsService]
})

export class DashboardComponent implements OnInit, OnDestroy {

  private HAZARDS: string[] = Constants.HAZARD_SCENARIOS;

  private alertList: ModelAlert[];

  // TODO - Check when other users are implemented
  private USER_TYPE: string = 'administratorCountry';

  private uid: string;
  private countryId: string;
  private agencyAdminUid: string;
  private actionsToday = [];
  private actionsThisWeek = [];
  private indicatorsToday = [];
  private indicatorsThisWeek = [];
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
  private numberOfIndicatorsObject = {};
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;

  private countryContextIndicators: any[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router, private userService: UserService, private actionService: ActionsService) {
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

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  /**
   * Private functions
   */

  private loadData() {
    this.getCountryId().then(() => {
      this.initCalendar();
      this.getApprovedResponsePlansCount();
      this.getAlerts();
      this.getCountryContextIndicators();
      this.getHazards();
      this.initData();
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

  // TODO -
  private initCalendar() {
    const events = [
      {
        dates: [new Date(2016, 4, 23), new Date(2018, 6, 25)],
        title: "Earth",
        eventHeight: 30,
        section: 1,
        attrs: {fill: "#d4e3fd", stroke: "#d4e3fd"}
      },
      {
        dates: [new Date(2017, 7, 23), new Date(2017, 9, 26)],
        title: "Wind",
        eventHeight: 20,
        section: 1,
        attrs: {fill: "#6FD08C", stroke: "#6FD08C"}
      },
      {
        dates: [new Date(2017, 4, 26), new Date(2017, 6, 28)],
        title: "Fire",
        eventHeight: 10,
        section: 1,
        attrs: {fill: "#6FD08C", stroke: "#6FD08C"}
      },
    ];

    const timeline2 = new Chronoline(document.getElementById("target2"), events,
      {
        visibleSpan: DAY_IN_MILLISECONDS * 91,
        animated: true,
        tooltips: true,
        sectionLabelAttrs: {'fill': '#997e3d', 'font-weight': 'bold'},
        labelInterval: isFifthDay,
        hashInterval: isFifthDay,
        scrollLeft: prevMonth,
        scrollRight: nextMonth,
        // markToday: 'labelBox',
        draggable: true
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
          this.agencyAdminUid = agencyIds[0].$key ? agencyIds[0].$key : "";
          res(true);
        });
    });
    return promise;
  }


  private initData() {
    let startOfToday = moment().startOf("day").valueOf();
    let endOfToday = moment().endOf("day").valueOf();
    this.actionService.getActionsDueInWeek(this.countryId, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(actions => {
        this.actionsToday = [];
        this.actionsThisWeek = [];
        this.actionsToday = actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday);
        this.actionsThisWeek = actions.filter(action => action.dueDate > endOfToday);
      });

    this.actionService.getIndicatorsDueInWeek(this.countryId, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(indicators => {
        let dayIndicators = indicators.filter(indicator => indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday);
        let weekIndicators = indicators.filter(indicator => indicator.dueDate > endOfToday);
        if (dayIndicators.length > 0) {
          dayIndicators.forEach(indicator => {
            if (this.actionService.isExist(indicator.$key, this.indicatorsToday)) {
              let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsToday);
              if (index != -1) {
                this.indicatorsToday[index] = indicator;
              }
            } else {
              this.indicatorsToday.push(indicator);
            }
          });
        }
        if (weekIndicators.length > 0) {
          weekIndicators.forEach(indicator => {
            if (this.actionService.isExist(indicator.$key, this.indicatorsThisWeek)) {
              let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsThisWeek);
              if (index != -1) {
                this.indicatorsThisWeek[index] = indicator;
              }
            } else {
              this.indicatorsThisWeek.push(indicator);
            }
          });
        }
      });
  }

  private getSystemAdminID() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.USER_TYPE + "/" + this.uid + '/systemAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((systemAdminIds: any) => {
          this.systemAdminUid = systemAdminIds[0].$key ? systemAdminIds[0].$key : "";
          res(true);
        });
    });
    return promise;
  }

  private getCountryData() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyAdminUid + '/' + this.countryId + "/location")
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
        console.log(approvals[A]);
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
      this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((actions: any) => {
          res(actions);
        });
    });
    return promise;
  }

  private getSystemThreshold(thresholdType: string) {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminUid + '/' + thresholdType)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((threshold: any) => {
          res(threshold);
        });
    });
    return promise;
  }

  private getAlerts() {
    this.alerts = this.actionService.getAlerts(this.countryId);
    this.alerts
      .subscribe(x => {
        console.log(x)
      })
    // this.actionService.getAlerts(this.countryId)
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe(alertList => {
    //     console.log(alertList);
    //   })

  }

  // TODO - FIX num of indicators
  private getHazards() {

    this.af.database.list(Constants.APP_STATUS + '/hazard/' + this.countryId)
      .flatMap(list => {
        this.hazards = [];
        let tempList = [];
        list.forEach(hazard => {
          this.hazards.push(hazard);
          tempList.push(hazard);
        });
        return Observable.from(tempList)
      })
      .flatMap(hazard => {
        return this.af.database.object(Constants.APP_STATUS + '/indicator/' + hazard.$key);
      })
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(object => {
        this.numberOfIndicatorsObject[object.$key] = Object.keys(object).length;
      });
  }

  private getCountryContextIndicators() {

    this.af.database.list(Constants.APP_STATUS + '/indicator/' + this.countryId)
      .subscribe(list => {
        list.forEach(indicator => {
          this.countryContextIndicators.push(indicator);
        });
      });
  }

  public getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  getActionTitle(action): string {
    return this.actionService.getActionTitle(action);
  }

  getIndicatorName(indicator): string {
    return this.actionService.getIndicatorTitle(indicator);
  }

  updateAlert(alertId) {
    this.router.navigate(['/dashboard/dashboard-update-alert-level/', {id: alertId, countryId: this.countryId}]);
  }


}
