import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {ActionLevel, ActionType, AlertLevels, AlertStatus, Countries, DashboardType, UserType} from "../utils/Enums";
import {UserService} from "../services/user.service";
import {ActionsService} from "../services/actions.service";
import * as moment from "moment";
import {Subject} from "rxjs/Subject";
import {HazardImages} from "../utils/HazardImages";
import {ModelAlert} from "../model/alert.model";
import {
  ChronolineEvent,
  DashboardSeasonalCalendarComponent
} from "./dashboard-seasonal-calendar/dashboard-seasonal-calendar.component";
import {AgencyModulesEnabled, CountryPermissionsMatrix, PageControlService} from "../services/pagecontrol.service";
declare var Chronoline, document, DAY_IN_MILLISECONDS, isFifthDay, prevMonth, nextMonth: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ActionsService]
})

export class DashboardComponent implements OnInit, OnDestroy {

  private alertList: ModelAlert[];

  private NODE_TO_CHECK: string;

  private DashboardType = DashboardType;
  private UserType = UserType;
  private DashboardTypeUsed: DashboardType;

  private uid: string;
  private countryId: string;
  private agencyId: string;
  private systemId: string;
  private actionsOverdue = [];
  private actionsToday = [];
  private actionsThisWeek = [];
  private indicatorsOverdue = [];
  private indicatorsToday = [];
  private indicatorsThisWeek = [];

  private Countries = Countries;
  private CountriesList = Constants.COUNTRIES;
  private countryLocation: any;

  private AlertLevels = AlertLevels;
  private AlertStatus = AlertStatus;

  private alerts: Observable<any>;

  private hazards: any[] = [];
  private numberOfIndicatorsObject = {};
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;

  private countryContextIndicators: any[] = [];

  private seasonEvents = [];
  private chronoline;
  private approveMap = new Map();
  private responsePlansForApproval: Observable<any[]>;
  private approvalPlans = [];
  private amberAlerts: Observable<any[]>;
  private redAlerts: Observable<any[]>;
  private affectedAreasToShow: any [];
  private userPaths = Constants.USER_PATHS;

  // TODO - New Subscriptions - Remove RxHelper and add Subject
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private userType: UserType;

  // Module settings
  private moduleSettings: AgencyModulesEnabled = new AgencyModulesEnabled();

  private countryPermissionMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  constructor(private pageControl: PageControlService, private af: AngularFire, private route: ActivatedRoute, private router: Router, private userService: UserService, private actionService: ActionsService) {
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.userType = userType;
      this.agencyId = agencyId;
      this.countryId = countryId;
      this.systemId = systemId;
      this.NODE_TO_CHECK = Constants.USER_PATHS[userType];

      if (userType == UserType.CountryDirector) {
        this.DashboardTypeUsed = DashboardType.director;
      } else {
        this.DashboardTypeUsed = DashboardType.default;
      }
      if (this.userType == UserType.PartnerUser) {
        this.agencyId = agencyId;
        this.countryId = countryId;
        this.loadDataForPartnerUser(agencyId, countryId);
      } else {
        this.NODE_TO_CHECK = Constants.USER_PATHS[userType];
        this.loadData();
      }

      PageControlService.agencyModuleMatrix(this.af, this.ngUnsubscribe, agencyId, (isEnabled => {
        this.moduleSettings = isEnabled;
        console.log(this.moduleSettings);
      }));

      // Load in the country permissions
      PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, this.userType, (isEnabled => {
        this.countryPermissionMatrix = isEnabled;
      }));
    });
    // this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
    //   console.log(userType);
    //   this.uid = user.uid;
    //   this.userType = userType;
    //   console.log(this.userType)
    //   this.NODE_TO_CHECK = Constants.USER_PATHS[userType];
    //   console.log(this.NODE_TO_CHECK);
    //   PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[this.userType], (isEnabled => {
    //     this.moduleSettings = isEnabled;
    //   }));
    //   if (userType == UserType.CountryDirector) {
    //     this.DashboardTypeUsed = DashboardType.director;
    //   } else {
    //     this.DashboardTypeUsed = DashboardType.default;
    //   }
    //   if (this.userType == UserType.PartnerUser) {
    //     this.loadDataForPartnerUser(null, null);
    //     this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (auth, userType, countryId, agencyId, systemId) => {
    //       console.log("******")
    //       console.log(agencyId)
    //       console.log(countryId)
    //       console.log("******")
    //     });
    //   } else {
    //     this.loadData();
    //   }
    //
    //   // Load in the country permissions
    //   PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, this.userType, (isEnabled => {
    //     this.countryPermissionMatrix = isEnabled;
    //   }));
    // });
  }

  // TODO - New Subscriptions - Remove all subscriptions
  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
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
      console.log("Country ID: " + this.countryId);
      if (this.DashboardTypeUsed == DashboardType.default) {
        this.getAllSeasonsForCountryId(this.countryId);
      }
      this.getAlerts();
      this.getCountryContextIndicators();
      this.getHazards();
      this.initData();
    });
    this.getAgencyID().then(() => {
      this.getCountryData();
    });
    this.userService.getSystemAdminId(this.NODE_TO_CHECK, this.uid)
      .subscribe(systemId => { this.systemId = systemId;})
  }

  private loadDataForPartnerUser(agencyId, countryId) {
    if (agencyId != null && countryId != null) {
      this.agencyId = agencyId;
      this.countryId = countryId;
      this.prepareData();
    } else {
      this.af.database.list(Constants.APP_STATUS + "/partnerUser/" + this.uid + "/agencies")
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencyCountries => {
          this.agencyId = agencyCountries[0].$key;
          this.countryId = agencyCountries[0].$value;
          this.prepareData();
        });
    }
  }

  private prepareData() {
    if (this.DashboardTypeUsed == DashboardType.default) {
      this.getAllSeasonsForCountryId(this.countryId);
    }
    this.getAlerts();
    this.getCountryContextIndicators();
    this.getHazards();
    this.initData();
    this.getCountryData();
  }

  public getAllSeasonsForCountryId(countryId: string) {
    this.af.database.object(Constants.APP_STATUS + "/season/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snapshot => {
        this.seasonEvents = [
          ChronolineEvent.create(1, DashboardSeasonalCalendarComponent.spanModelCalendar())
        ];
        let i = 2;
        snapshot.forEach((seasonInfo) => {
          let x: ChronolineEvent = ChronolineEvent.create(i, seasonInfo.val());
          this.seasonEvents.push(x);
          i++;
        });
        this.initCalendar();
        // Init map here after replacing the entire array
      });
  }

  private initCalendar() {
    // Element is removed and re-added upon a data change
    document.getElementById("target2").innerHTML = "";
    this.chronoline = new Chronoline(document.getElementById("target2"), this.seasonEvents,
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
      this.af.database.object(Constants.APP_STATUS + "/" + this.NODE_TO_CHECK + "/" + this.uid + "/countryId")
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
      this.af.database.list(Constants.APP_STATUS + "/" + this.NODE_TO_CHECK + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIds: any) => {
          this.agencyId = agencyIds[0].$key ? agencyIds[0].$key : "";
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
        this.actionsOverdue = [];
        this.actionsToday = [];
        this.actionsThisWeek = [];
        this.actionsOverdue = actions.filter(action => action.dueDate < startOfToday);
        this.actionsToday = actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday);
        this.actionsThisWeek = actions.filter(action => action.dueDate > endOfToday);

        for (let x of this.actionsOverdue) {
          this.updateTaskDataForActions(x.$key, x, (action) => {
            x.task = action.task;
            x.level = action.level;
          });
        }
        for (let x of this.actionsToday) {
          this.updateTaskDataForActions(x.$key, x, (action) => {
            x.task = action.task;
            x.level = action.level;
          });
        }
        for (let x of this.actionsThisWeek) {
          this.updateTaskDataForActions(x.$key, x, (action) => {
            x.task = action.task;
            x.level = action.level;
          });
        }
      });

    this.actionService.getIndicatorsDueInWeek(this.countryId, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(indicators => {
        let overdueIndicators = indicators.filter(indicator => indicator.dueDate < startOfToday);
        let dayIndicators = indicators.filter(indicator => indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday);
        let weekIndicators = indicators.filter(indicator => indicator.dueDate > endOfToday);
        if (overdueIndicators.length > 0) {
          overdueIndicators.forEach(indicator => {
            if (this.actionService.isExist(indicator.$key, this.indicatorsOverdue)) {
              let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsOverdue);
              if (index != -1) {
                this.indicatorsOverdue[index] = indicator;
              }
            } else {
              this.indicatorsOverdue.push(indicator);
            }
          });
        }
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
        // console.log('Count ---- ' + this.responseType.length)
      });

    //TODO change temp id to actual uid
    if (this.userType == UserType.PartnerUser) {
      this.responsePlansForApproval = this.actionService.getResponsePlanForCountryDirectorToApproval(this.countryId, this.uid, true);
    } else if (this.userType == UserType.CountryDirector) {
      this.responsePlansForApproval = this.actionService.getResponsePlanForCountryDirectorToApproval(this.countryId, this.uid, false);
    }
    this.responsePlansForApproval.takeUntil(this.ngUnsubscribe).subscribe(plans => {
      this.approvalPlans = plans
    });
  }

  private updateTaskDataForActions(actionId: string, action: any, fun: (action) => void) {
    let node: string = "";
    let typeId: string = "";
    if (action.type == ActionType.mandated) {
      node = "actionMandated";
      typeId = this.agencyId;
    }
    if (action.type == ActionType.chs) {
      node = "actionCHS";
      typeId = this.systemId;
    }
    this.af.database.object(Constants.APP_STATUS + "/" + node + "/" + typeId + "/" + actionId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        fun(snap.val());
      });
  }

  private getCountryData() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + '/' + this.countryId + "/location")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value;
          res(true);
        });
    });
    return promise;
  }

  private getAlerts() {
    if (this.DashboardTypeUsed == DashboardType.default) {
      console.log(this.countryId);
      this.alerts = this.actionService.getAlerts(this.countryId);

    } else if (this.DashboardTypeUsed == DashboardType.director) {
      this.alerts = this.actionService.getAlertsForDirectorToApprove(this.uid, this.countryId);
      this.amberAlerts = this.actionService.getAlerts(this.countryId)
        .map(alerts => {
          return alerts.filter(alert => alert.alertLevel == AlertLevels.Amber);
        });
      this.redAlerts = this.actionService.getRedAlerts(this.countryId)
        .map(alerts => {
          return alerts.filter(alert => alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved);
        });
    }
  }

  showAffectedAreasForAlert(affectedAreas) {
    this.affectedAreasToShow = affectedAreas;
    jQuery("#view-areas").modal("show");
  }

  shouldShow(level: number, action: number) {
    if (level == ActionLevel.MPA && !this.moduleSettings.minimumPreparedness) {
      return false;
    }
    if (level == ActionLevel.APA && !this.moduleSettings.advancedPreparedness) {
      return false;
    }
    if (action == ActionType.chs && !this.moduleSettings.chsPreparedness) {
      return false;
    }
    return true;
  }

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
      .takeUntil(this.ngUnsubscribe)
      .subscribe(list => {
        list.forEach(indicator => {
          this.countryContextIndicators.push(indicator);
        });
      });
  }

  public getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  getActionTitle(action): string {
    return this.actionService.getActionTitle(action);
  }

  getCHSActionTask(action) {
    if (action.type == ActionType.chs) {
      this.actionService.getCHSActionTask(action, this.systemId)
        .subscribe(task => { action.task = task; })
    }
  }

  getIndicatorName(indicator): string {
    return this.actionService.getIndicatorTitle(indicator);
  }

  updateAlert(alertId, isDirectorAmber) {
    if (this.DashboardTypeUsed == DashboardType.default) {
      this.router.navigate(['/dashboard/dashboard-update-alert-level/', {id: alertId, countryId: this.countryId}]);
    } else if (isDirectorAmber) {
      this.router.navigate(['/dashboard/dashboard-update-alert-level/', {
        id: alertId,
        countryId: this.countryId,
        isDirector: true
      }]);
    } else {
      let selection = this.approveMap.get(alertId);
      this.approveMap.set(alertId, !selection);
    }
  }

  approveRedAlert(alertId) {
    this.actionService.approveRedAlert(this.countryId, alertId, this.uid);
  }

  rejectRedRequest(alertId) {
    this.actionService.rejectRedAlert(this.countryId, alertId, this.uid);
  }

  planReview(planId) {
    this.router.navigate(["/dashboard/review-response-plan", {"id": planId}]);
  }

  goToAgenciesInMyCountry() {
    this.router.navigateByUrl("/country-admin/country-agencies");
  }

  goToFaceToFaceMeeting() {
    // this.router.navigateByUrl("/dashboard/facetoface-meeting-request");
    this.router.navigate(["/dashboard/facetoface-meeting-request", {
      countryId: this.countryId,
      agencyId: this.agencyId
    }]);
  }

  requestAgencyPartner(agency) {
    console.log("called from dashboard");
    console.log(agency);
    this.loadDataForPartnerUser(agency.$key, agency.relatedCountryId);
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
