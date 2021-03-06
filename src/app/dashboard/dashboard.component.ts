import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
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
import {NetworkService} from "../services/network.service";
import {CommonUtils} from "../utils/CommonUtils";
import {LocalStorageService} from "angular-2-local-storage";
import {NetworkViewModel} from "../country-admin/country-admin-header/network-view.model";
import {PrepActionService, PreparednessAction} from "../services/prepactions.service";
import {forEach} from "@angular/router/src/utils/collection";
import {MinimumPreparednessComponent} from "../preparedness/minimum/minimum.component";
import { BugReportingService } from "../services/bug-reporting.service";
import { ReportProblemComponent } from "../report-problem/report-problem.component";
import * as html2canvas from "html2canvas";

declare var Chronoline, document, DAY_IN_MILLISECONDS, isFifthDay, prevMonth, nextMonth: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ActionsService]
})

export class DashboardComponent implements OnInit, OnDestroy {

  // Reporting problem
  @Input() showIcon: boolean;


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
  private actionsOverdueNetwork = [];
  private actionsTodayNetwork = [];
  private actionsThisWeekNetwork = [];
  private indicatorsOverdue = [];
  private indicatorsToday = [];
  private indicatorsThisWeek = [];
  private indicatorsOverdueNetwork = [];
  private indicatorsTodayNetwork = [];
  private indicatorsThisWeekNetwork = [];

  private Countries = Countries;
  private CountriesList = Constants.COUNTRIES;
  private countryLocation: number;

  private AlertLevels = AlertLevels;
  private AlertStatus = AlertStatus;

  private alerts: Observable<any>;
  private alertsNetwork: Observable<any>;

  private hazards: any[] = [];
  private numberOfIndicatorsObject = {};
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;

  private countryContextIndicators: any[] = [];

  private seasonEvents = [];
  private chronoline;
  private approveMap = new Map();
  private responsePlansForApproval: Observable<any[]>;
  private responsePlansForApprovalNetwork: Observable<any[]>;
  private responsePlansForApprovalNetworkLocal: Observable<any[]>;
  private approvalPlans = [];
  private approvalPlansNetwork = [];
  private approvalPlansNetworkLocal = [];
  private amberAlerts: Observable<any[]>;
  private redAlerts: Observable<any[]>;
  private isRedAlert: boolean;
  private affectedAreasToShow: any [];
  private userPaths = Constants.USER_PATHS;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private userType: UserType;

  // Module settings
  private moduleSettings: AgencyModulesEnabled = new AgencyModulesEnabled();

  private countryPermissionMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();
  protected prepActionService: PrepActionService = new PrepActionService();
  // private networkCountryId: string;
  // private networkId: string;
  private networkMap: Map<string, string>;
  private localNetworks: any;
  private alertsLocalNetwork: Observable<any>;
  private showCoCBanner: boolean;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private networkService: NetworkService,
              private storageService: LocalStorageService,
              private actionService: ActionsService,
              private bugReport: BugReportingService) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.userType = userType;
      this.agencyId = agencyId;
      this.countryId = countryId;
      this.systemId = systemId;
      this.NODE_TO_CHECK = Constants.USER_PATHS[userType];

      this.checkCoCUpdated();

      this.networkService.mapNetworkWithCountryForCountry(this.agencyId, this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(networkMap => {
          this.networkMap = networkMap
          if (userType == UserType.CountryDirector) {
            this.DashboardTypeUsed = DashboardType.director;
          } else {
            this.DashboardTypeUsed = DashboardType.default;
          }
          if (this.userType == UserType.PartnerUser) {
            console.log("partner user")
            this.agencyId = agencyId;
            this.countryId = countryId;
            this.loadDataForPartnerUser(agencyId, countryId);
          } else {
            this.NODE_TO_CHECK = Constants.USER_PATHS[userType];
            console.log("local")
            this.loadData();
          }
        })

      this.networkService.getLocalNetworksWithCountryForCountry(this.agencyId, this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(localNetworks => {
          this.localNetworks = localNetworks
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
            console.log("agency")
            this.NODE_TO_CHECK = Constants.USER_PATHS[userType];
            this.loadData();
          }
        })

      PageControlService.agencyModuleMatrix(this.af, this.ngUnsubscribe, agencyId, (isEnabled => {
        this.moduleSettings = isEnabled;
      }));

      // Load in the country permissions
      PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, this.userType, (isEnabled => {
        this.countryPermissionMatrix = isEnabled;
      }));

    });
  }

  private checkCoCUpdated(){
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/latestCoCAgreed", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if(snap.val() == null || snap.val() == false){
          this.showCoCBanner = true;
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getCSSHazard(hazard: any) {
    let value = (typeof hazard == "string") ? parseInt(hazard) : hazard
    return HazardImages.init().getCSS(value);
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  /**
   * Private functions
   */

  private loadData() {
    // this.getCountryId().then(() => {
    //   console.log("Country ID: " + this.countryId);
    //   if (this.DashboardTypeUsed == DashboardType.default) {
    //     this.getAllSeasonsForCountryId(this.countryId);
    //   }
    //   this.getAlerts();
    //   this.getCountryContextIndicators();
    //   this.getHazards();
    //   this.initData();
    // });
    if (this.DashboardTypeUsed == DashboardType.default) {
      this.getAllSeasonsForCountryId(this.countryId);
    }
    this.getAlerts();
    this.getCountryContextIndicators();
    this.getHazards();
    this.initData();
    // this.getAgencyID().then(() => {
    //   this.getCountryData();
    // });
    this.getCountryData();
    // this.userService.getSystemAdminId(this.NODE_TO_CHECK, this.uid)
    //   .subscribe(systemId => {
    //     this.systemId = systemId;
    //   })
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

  // private getCountryId() {
  //   let promise = new Promise((res, rej) => {
  //     this.af.database.object(Constants.APP_STATUS + "/" + this.NODE_TO_CHECK + "/" + this.uid + "/countryId")
  //       .takeUntil(this.ngUnsubscribe)
  //       .subscribe((countryId: any) => {
  //         this.countryId = countryId.$value;
  //         res(true);
  //       });
  //   });
  //   return promise;
  // }

  // private getAgencyID() {
  //   let promise = new Promise((res, rej) => {
  //     this.af.database.list(Constants.APP_STATUS + "/" + this.NODE_TO_CHECK + "/" + this.uid + '/agencyAdmin')
  //       .takeUntil(this.ngUnsubscribe)
  //       .subscribe((agencyIds: any) => {
  //         this.agencyId = agencyIds[0].$key ? agencyIds[0].$key : "";
  //         res(true);
  //       });
  //   });
  //   return promise;
  // }


  private initData() {
    let startOfToday = moment().startOf("day").valueOf();
    let endOfToday = moment().endOf("day").valueOf();
    this.actionService.getActionsDueInWeek(this.countryId, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(actions => {

        // Display APA only if there is a red alert
        actions = actions.filter(action => !action.level || action.level != ActionLevel.APA || this.isRedAlert);

        this.actionsOverdue = [];
        this.actionsToday = [];
        this.actionsThisWeek = [];
        this.actionsOverdue = actions.filter(action => action.dueDate < startOfToday);
        this.actionsToday = actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday);
        this.actionsThisWeek = actions.filter(action => action.dueDate > endOfToday);

        for (let x of this.actionsOverdue) {
          this.updateTaskDataForActions(x.$key, x, (action) => {
            if (action) {
              x.task = action.task;
              x.level = action.level;
            }
          });
        }

        for (let x of this.actionsToday) {
          this.updateTaskDataForActions(x.$key, x, (action) => {
            if (action) {
              x.task = action.task;
              x.level = action.level;
            }
          });
        }
        for (let x of this.actionsThisWeek) {
          this.updateTaskDataForActions(x.$key, x, (action) => {
            if (action) {
              x.task = action.task;
              x.level = action.level;
            }
          });
        }
      });

    if (this.networkMap) {
      this.initNetworkActions(startOfToday, endOfToday, this.networkMap)
    }
    if (this.localNetworks) {
      this.initLocalNetworkActions(startOfToday, endOfToday, this.localNetworks)
    }

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

    if (this.networkMap) {
      this.initNetworkIndicators(startOfToday, endOfToday, this.networkMap);
    }
    if (this.localNetworks) {
      this.initLocalNetworkIndicators(startOfToday, endOfToday, this.localNetworks);
    }
    // plan approval

    if (this.userType == UserType.PartnerUser) {
      this.responsePlansForApproval = this.actionService.getResponsePlanForCountryDirectorToApproval(this.countryId, this.uid, true);
      this.responsePlansForApprovalNetwork = Observable.of([])
      this.responsePlansForApprovalNetworkLocal = Observable.of([])

      if (this.networkMap) {
        this.networkMap.forEach((networkCountryId, networkId) => {
          this.responsePlansForApprovalNetwork = this.responsePlansForApprovalNetwork.merge(this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkCountryId));
          this.responsePlansForApprovalNetworkLocal = this.responsePlansForApprovalNetworkLocal.merge(this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkId));
        })
      }
      if (this.localNetworks) {
        this.localNetworks.forEach(networkId => {
          console.log(networkId)
          this.responsePlansForApprovalNetworkLocal = this.responsePlansForApprovalNetworkLocal.merge(this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkId));
        })
      }

    } else if (this.userType == UserType.CountryDirector) {
      this.responsePlansForApproval = this.actionService.getResponsePlanForCountryDirectorToApproval(this.countryId, this.uid, false);
      this.responsePlansForApprovalNetwork = Observable.of([]);
      this.responsePlansForApprovalNetworkLocal = Observable.of([]);

      if (this.networkMap) {
        this.networkMap.forEach((networkCountryId, networkId) => {
          this.responsePlansForApprovalNetwork = this.responsePlansForApprovalNetwork.merge(this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkCountryId));
          this.responsePlansForApprovalNetworkLocal = this.responsePlansForApprovalNetworkLocal.merge(this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkId));
        })
      }
      if (this.localNetworks) {
        this.localNetworks.forEach(networkId => {
          console.log(networkId)
          this.responsePlansForApprovalNetworkLocal = this.responsePlansForApprovalNetworkLocal.merge(this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkId));
        })
      }

    }
    if (this.responsePlansForApproval) {
      this.responsePlansForApproval
        .takeUntil(this.ngUnsubscribe)
        .subscribe(plans => {
          this.approvalPlans = plans;
          console.log(plans)
        });
    }
    if (this.responsePlansForApprovalNetwork) {
      this.responsePlansForApprovalNetwork
        .takeUntil(this.ngUnsubscribe)
        .subscribe(plans => {
          console.log(plans)
          this.approvalPlansNetwork = plans;
        });
    }
    if (this.responsePlansForApprovalNetworkLocal) {
      this.responsePlansForApprovalNetworkLocal
        .takeUntil(this.ngUnsubscribe)
        .subscribe(plans => {
          this.approvalPlansNetworkLocal = plans
          console.log(this.approvalPlansNetworkLocal)
        });
    }
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

  private updateTaskDataForActionsNetwork(actionId: string, action: any, networkCountryId: string, fun: (action) => void) {
    let node: string = "";
    let typeId: string = "";
    if (action.type == ActionType.mandated) {
      node = "actionMandated";
      let map = CommonUtils.reverseMap(this.networkMap)
      typeId = map.get(networkCountryId);
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
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + '/' + this.countryId + "/location")
      .takeUntil(this.ngUnsubscribe)
      .subscribe((location: any) => {
        this.countryLocation = location.$value;
      });
  }

  private getAlerts() {
    if (this.DashboardTypeUsed == DashboardType.default) {
      this.alerts = this.actionService.getAlerts(this.countryId);

    } else if (this.DashboardTypeUsed == DashboardType.director) {
      this.alerts = this.actionService.getAlertsForDirectorToApprove(this.uid, this.countryId);
      if (this.networkMap) {
        this.alertsNetwork = Observable.from([])
        this.networkMap.forEach((networkCountryId, networkId) => {
          this.alertsNetwork = Observable.merge(this.alertsNetwork, this.actionService.getAlertsForDirectorToApproveNetwork(this.countryId, networkCountryId, networkId))
        })
      }
      if (this.localNetworks) {
        this.alertsLocalNetwork = Observable.from([])
        this.localNetworks.forEach((networkId) => {
          this.alertsLocalNetwork = Observable.merge(this.alertsLocalNetwork, this.actionService.getAlertsForDirectorToApproveLocalNetwork(this.countryId, networkId))
        })
      }

      this.amberAlerts = this.actionService.getAlerts(this.countryId)
        .map(alerts => {
          return alerts.filter(alert => alert.alertLevel == AlertLevels.Amber);
        });
      this.redAlerts = this.actionService.getRedAlerts(this.countryId)
        .map(alerts => {
          return alerts.filter(alert => alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved);
        });
    }
    this.actionService.getRedAlerts(this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(alerts => {
        alerts = alerts.filter(alert => alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved);
        this.isRedAlert = alerts.length > 0;
      });
  }

  showAffectedAreasForAlert(affectedAreas) {
    this.affectedAreasToShow = affectedAreas;
    jQuery("#view-areas").modal("show");
  }

  shouldShow(level: number, action: any) {
    if (level == ActionLevel.MPA && !this.moduleSettings.minimumPreparedness) {
      return false;
    }
    if (level == ActionLevel.APA && (!this.moduleSettings.advancedPreparedness || !this.isRedAlert)) {
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
          if (hazard.isActive) {
            if (hazard.hazardScenario == -1) {
              this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName)
                .first()
                .subscribe(nameObj => {
                  hazard.otherName = nameObj.name;
                  if (!this.hazards.map(item => item.$key).includes(hazard.$key)) {
                    this.hazards.push(hazard);
                  }
                });
            } else {
              if (!this.hazards.map(item => item.$key).includes(hazard.$key)) {
                this.hazards.push(hazard);
              }
            }
            tempList.push(hazard);
          }
        });
        return Observable.from(tempList)
      })
      .flatMap(hazard => {
        return this.af.database.object(Constants.APP_STATUS + '/indicator/' + hazard.$key);
      })
      .distinctUntilChanged()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(object => {
        this.numberOfIndicatorsObject[object.$key] = Object.keys(object).filter(key => !key.includes("$")).length;
      });
  }

  private getCountryContextIndicators() {
    this.af.database.list(Constants.APP_STATUS + '/indicator/' + this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(list => {
        this.countryContextIndicators = [];
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
        .takeUntil(this.ngUnsubscribe)
        .subscribe(task => {
          action.task = task;
        })
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

  approveRedAlert(alertId, hazardScenario, alert) {


    let hazard = this.hazards.find(x => x.hazardScenario == hazardScenario)
    let hazardTrackingNode;

    if(hazard && hazard.timeTracking && hazard.timeTracking[alertId]){
      hazardTrackingNode = hazard ? hazard.timeTracking[alertId] : undefined;
    }

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1, level: AlertLevels.Red};


    // saves alert key to apa to retrieve locations affected
    this.af.database.list(Constants.APP_STATUS + '/action/' + this.countryId, {
      query: {
        orderByChild: 'level',
        equalTo: 2
       }
    })
    .takeUntil(this.ngUnsubscribe)
    .subscribe(actions => {
      actions.forEach(action => {
        if(!action.redAlerts){
          action.redAlerts = [];
        }

        if(action.assignedHazards && (action.assignedHazards.length == 0 || action.assignedHazards.includes(alert.hazardScenario))){
          action.redAlerts.push(alertId)

          if(action["timeTracking"]["timeSpentInGrey"] && action["timeTracking"]["timeSpentInGrey"].find(x => x.finish == -1)){

            action["timeTracking"]["timeSpentInGrey"][action["timeTracking"]["timeSpentInGrey"].findIndex(x => x.finish == -1)].finish = currentTime;
            if(!action.asignee){
              if(!action["timeTracking"]["timeSpentInRed"]){
                action['timeTracking']['timeSpentInRed'] = [];
              }
              action['timeTracking']['timeSpentInRed'].push(newTimeObject)
            }else if(action.isComplete){
              if(!action["timeTracking"]["timeSpentInGreen"]){
                action['timeTracking']['timeSpentInGreen'] = [];
              }
              action['timeTracking']['timeSpentInGreen'].push(newTimeObject)
            }else{
              if(!action["timeTracking"]["timeSpentInAmber"]){
                action['timeTracking']['timeSpentInAmber'] = [];
              }
              action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
            }
          }

          this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryId + '/' + action.$key + '/timeTracking')
          .update(action.timeTracking)
          this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryId + '/' + action.$key + '/redAlerts')
          .update(action.redAlerts)
        }
      });
    })


    if(hazard){

        if(hazardTrackingNode){
          if(hazardTrackingNode["timeSpentInAmber"]){
            hazardTrackingNode["timeSpentInAmber"][hazardTrackingNode["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime
          }

          if(!hazardTrackingNode["timeSpentInRed"]){
            hazardTrackingNode["timeSpentInRed"] = [];
          }

          hazardTrackingNode["timeSpentInRed"].push(newTimeObject)
          this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.countryId + '/' + hazard.$key + '/timeTracking/' + alertId)
          .update(hazardTrackingNode)
        }else{
          this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.countryId + '/' + hazard.$key + '/timeTracking/' + alertId)
          .update({timeSpentInRed: [newTimeObject]})
        }

    }


      if(alert["timeTracking"]){
        if(!alert["timeTracking"]["timeSpentInRed"]){
          alert["timeTracking"]["timeSpentInRed"] = [];
        }

        alert["timeTracking"]["timeSpentInRed"].push(newTimeObject)
        this.af.database.object(Constants.APP_STATUS + '/alert/' + this.countryId + '/' + alertId + '/timeTracking/')
        .update(alert["timeTracking"])
      }else{
        this.af.database.object(Constants.APP_STATUS + '/alert/' + this.countryId + '/' + alertId + '/timeTracking/')
          .update({timeSpentInRed: [newTimeObject]})
      }

      this.actionService.approveRedAlert(this.countryId, alertId, this.uid);
  }

  approveRedAlertNetwork(alert, hazardScenario) {

    this.af.database.list(Constants.APP_STATUS + '/hazards/' + alert.networkCountryId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe(hazards => {

      let hazard = hazards.find(x => x.hazardScenario == hazardScenario)
      let hazardTrackingNode;

      let currentTime = new Date().getTime()
      let newTimeObject = {start: currentTime, finish: -1, level: AlertLevels.Red};

      // saves alert key to apa to retrieve locations affected
        this.af.database.list(Constants.APP_STATUS + '/action/' + alert.networkCountryId, {
          query: {
            orderByChild: 'level',
            equalTo: 2
           }
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(actions => {
          actions.forEach(action => {
            if(!action.redAlerts){
              action.redAlerts = [];
            }
            if(action.assignedHazards && (action.assignedHazards.length == 0 || action.assignedHazards.includes(alert.hazardScenario))){
              action.redAlerts.push(alert.id)

              if(action["timeTracking"]["timeSpentInGrey"] && action["timeTracking"]["timeSpentInGrey"].find(x => x.finish == -1)){

                action["timeTracking"]["timeSpentInGrey"][action["timeTracking"]["timeSpentInGrey"].findIndex(x => x.finish == -1)].finish = currentTime;
                if(!action.asignee){
                  if(!action["timeTracking"]["timeSpentInRed"]){
                    action['timeTracking']['timeSpentInRed'] = [];
                  }
                  action['timeTracking']['timeSpentInRed'].push(newTimeObject)
                }else if(action.isComplete){
                  if(!action["timeTracking"]["timeSpentInGreen"]){
                    action['timeTracking']['timeSpentInGreen'] = [];
                  }
                  action['timeTracking']['timeSpentInGreen'].push(newTimeObject)
                }else{
                  if(!action["timeTracking"]["timeSpentInAmber"]){
                    action['timeTracking']['timeSpentInAmber'] = [];
                  }
                  action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
                }
              }

              this.af.database.object(Constants.APP_STATUS + '/action/' + alert.networkCountryId + '/' + action.$key + '/timeTracking')
              .update(action.timeTracking)
              this.af.database.object(Constants.APP_STATUS + '/action/' + alert.networkCountryId + '/' + action.$key + '/redAlerts')
              .update(action.redAlerts)
            }
          });
        })


      if(hazard && hazard.timeTracking && hazard.timeTracking[alert.networkCountryId]){
        hazardTrackingNode = hazard ? hazard.timeTracking[alert.networkCountryId] : undefined;
      }


      if(hazard){


        if(hazardTrackingNode){
          if(hazardTrackingNode["timeSpentInAmber"]){
            hazardTrackingNode["timeSpentInAmber"][hazardTrackingNode["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime
          }

          if(!hazardTrackingNode["timeSpentInRed"]){
            hazardTrackingNode["timeSpentInRed"] = [];
          }

          hazardTrackingNode["timeSpentInRed"].push(newTimeObject)
          this.af.database.object(Constants.APP_STATUS + '/hazard/' + alert.networkCountryId + '/' + hazard.$key + '/timeTracking/' + alert.id)
          .update(hazardTrackingNode)
        }else{
          this.af.database.object(Constants.APP_STATUS + '/hazard/' + alert.networkCountryId + '/' + hazard.$key + '/timeTracking/' + alert.id)
          .update({timeSpentInRed: [newTimeObject]})
        }

    }

    if(alert["timeTracking"]){
      if(!alert["timeTracking"]["timeSpentInRed"]){
        alert["timeTracking"]["timeSpentInRed"] = [];
      }

      alert["timeTracking"]["timeSpentInRed"].push(newTimeObject)
      this.af.database.object(Constants.APP_STATUS + '/alert/' + alert.networkCountryId + '/' + alert.id + '/timeTracking/')
      .update(alert["timeTracking"])
    }else{
      this.af.database.object(Constants.APP_STATUS + '/alert/' + alert.networkCountryId + '/' + alert.id + '/timeTracking/')
        .update({timeSpentInRed: [newTimeObject]})
    }

      this.actionService.approveRedAlertNetwork(this.countryId, alert.id, alert.networkCountryId).then(() => {
        this.networkService.mapAgencyCountryForNetworkCountry(alert.networkId, alert.networkCountryId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agencyCountryMap => {
            this.actionService.getAlertObj(alert.networkCountryId, alert.id)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(alertObj => {
                this.actionService.copyRedAlertOverFromNetwork(agencyCountryMap, alert.id, alertObj)
              })
          })
      });

    })

  }

  approveRedAlertLocalNetwork(alert, hazardScenario) {

    this.af.database.list(Constants.APP_STATUS + '/hazards/' + alert.networId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe(hazards => {

      let hazard = hazards.find(x => x.hazardScenario == hazardScenario)
      let hazardTrackingNode;

      if(hazard && hazard.timeTracking && hazard.timeTracking[alert.networkId]){
        hazardTrackingNode = hazard ? hazard.timeTracking[alert.networkId] : undefined;
      }

      let currentTime = new Date().getTime()
      let newTimeObject = {start: currentTime, finish: -1, level: AlertLevels.Red};



      // saves alert key to apa to retrieve locations affected
      this.af.database.list(Constants.APP_STATUS + '/action/' + alert.networkId, {
        query: {
          orderByChild: 'level',
          equalTo: 2
         }
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(actions => {
        actions.forEach(action => {
          if(!action.redAlerts){
            action.redAlerts = [];
          }
          if(action.assignedHazards && action.assignedHazards.length == 0 || action.assignedHazards.includes(alert.hazardScenario)){
            action.redAlerts.push(alert.id)

            if(action["timeTracking"]["timeSpentInGrey"] && action["timeTracking"]["timeSpentInGrey"].find(x => x.finish == -1)){

              action["timeTracking"]["timeSpentInGrey"][action["timeTracking"]["timeSpentInGrey"].findIndex(x => x.finish == -1)].finish = currentTime;
              if(!action.asignee){
                if(!action["timeTracking"]["timeSpentInRed"]){
                  action['timeTracking']['timeSpentInRed'] = [];
                }
                action['timeTracking']['timeSpentInRed'].push(newTimeObject)
              }else if(action.isComplete){
                if(!action["timeTracking"]["timeSpentInGreen"]){
                  action['timeTracking']['timeSpentInGreen'] = [];
                }
                action['timeTracking']['timeSpentInGreen'].push(newTimeObject)
              }else{
                if(!action["timeTracking"]["timeSpentInAmber"]){
                  action['timeTracking']['timeSpentInAmber'] = [];
                }
                action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
              }
            }

            this.af.database.object(Constants.APP_STATUS + '/action/' + alert.networkId + '/' + action.$key + '/timeTracking')
            .update(action.timeTracking)
            this.af.database.object(Constants.APP_STATUS + '/action/' + alert.networkId + '/' + action.$key + '/redAlerts')
            .update(action.redAlerts)
          }
        });
      })



      if(hazard){


        if(hazardTrackingNode){
          if(hazardTrackingNode["timeSpentInAmber"]){
            hazardTrackingNode["timeSpentInAmber"][hazardTrackingNode["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime
          }

          if(!hazardTrackingNode["timeSpentInRed"]){
            hazardTrackingNode["timeSpentInRed"] = [];
          }

          hazardTrackingNode["timeSpentInRed"].push(newTimeObject)
          this.af.database.object(Constants.APP_STATUS + '/hazard/' + alert.networkId + '/' + hazard.$key + '/timeTracking/' + alert.id)
          .update(hazardTrackingNode)
        }else{
          this.af.database.object(Constants.APP_STATUS + '/hazard/' + alert.networkId + '/' + hazard.$key + '/timeTracking/' + alert.id)
          .update({timeSpentInRed: [newTimeObject]})
        }

    }

    if(alert["timeTracking"]){
      if(!alert["timeTracking"]["timeSpentInRed"]){
        alert["timeTracking"]["timeSpentInRed"] = [];
      }
      alert["timeTracking"]["timeSpentInRed"].push(newTimeObject)
      this.af.database.object(Constants.APP_STATUS + '/alert/' + alert.networkId + '/' + alert.id + '/timeTracking/')
      .update(alert["timeTracking"])
    }else{
      this.af.database.object(Constants.APP_STATUS + '/alert/' + alert.networkId + '/' + alert.id + '/timeTracking/')
        .update({timeSpentInRed: [newTimeObject]})
    }

      this.actionService.approveRedAlertNetwork(this.countryId, alert.id, alert.networkId).then(() => {
        this.networkService.mapAgencyCountryForLocalNetworkCountry(alert.networkId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agencyCountryMap => {
            this.actionService.getAlertObj(alert.networkId, alert.id)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(alertObj => {
                this.actionService.copyRedAlertOverFromNetwork(agencyCountryMap, alert.id, alertObj)
              })
          })
      });

    })

  }

  rejectRedRequest(alert) {
    this.actionService.rejectRedAlert(this.countryId, alert);
  }

  rejectRedRequestNetwork(alert) {
    this.actionService.rejectRedAlertNetwork(this.countryId, alert);
  }

  planReview(plan, isLocal) {
    this.router.navigate(["/dashboard/review-response-plan", isLocal ? {
      "id": plan.$key,
      "networkCountryId": plan.networkCountryId,
      "systemId": this.systemId
    } : plan.networkCountryId ? {
      "id": plan.$key,
      "networkCountryId": plan.networkCountryId,
      "systemId": this.systemId
    } : {"id": plan.$key}]);
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
    this.loadDataForPartnerUser(agency.$key, agency.relatedCountryId);
  }

  navigateToCompleteAction(action) {
    action.level == ActionLevel.MPA ?
      this.router.navigate(["/preparedness/minimum", { "updateActionID": action.$key }])
      :
      this.router.navigate(["/preparedness/advanced", { "updateActionID": action.$key }])
  }

  navigateToCompleteIndicator(indicator) {//For both: Normal and Network
    indicator.hazardScenario["key"] == "countryContext" ?
      this.router.navigate(["/risk-monitoring", { "updateIndicatorID": indicator.$key, "hazardID": indicator.hazardScenario["key"] }])
    :
      this.router.navigate(["/risk-monitoring", { "updateIndicatorID": indicator.$key, "hazardID": indicator.hazardScenario["hazardScenario"] }])
  }

  navigateToNetworkActions(action) {
    //TODO CHECK FROM HERE
    console.log(action)
    console.log(this.networkMap)
    let reverseMap = CommonUtils.reverseMap(this.networkMap);
    let networkId = reverseMap.get(action.countryId) ? reverseMap.get(action.countryId) : action.countryId
    let networkCountryId = this.networkMap.get(action.networkId) ? this.networkMap.get(action.networkId) : null
    let model = new NetworkViewModel(this.systemId, this.agencyId, this.countryId, action.$key, this.userType, this.uid, networkId, networkCountryId, true);
    this.storageService.set(Constants.NETWORK_VIEW_SELECTED_ID, model.networkId);
    this.storageService.set(Constants.NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID, model.networkCountryId ? model.networkCountryId : model.networkId);
    this.storageService.set(Constants.NETWORK_VIEW_VALUES, model);
    console.log(model.networkId)
    console.log(model.networkCountryId)
    action.level == ActionLevel.MPA ?
      this.networkMap.get(action.networkId) ? this.router.navigate(['/network-country/network-country-mpa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)]) : this.router.navigate(['/network/local-network-preparedness-mpa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)])
      :
      this.networkMap.get(action.networkId) ? this.router.navigate(['/network-country/network-country-apa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)]) : this.router.navigate(['/network/local-network-preparedness-apa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)])
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private initNetworkActions(startOfToday: number, endOfToday: number, networkMap: Map<string, string>) {
    this.actionsOverdueNetwork = [];
    this.actionsTodayNetwork = [];
    this.actionsThisWeekNetwork = [];
    CommonUtils.convertMapToValuesInArray(networkMap).forEach(networkCountryId => {
      this.actionService.getActionsDueInWeek(networkCountryId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(actions => {

          // Display APA only if there is a red alert
          actions = actions.filter(action => !action.level || action.level != ActionLevel.APA || this.isRedAlert);

          this.actionsOverdueNetwork = actions.filter(action => action.dueDate < startOfToday);
          this.actionsTodayNetwork = actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday);
          this.actionsThisWeekNetwork = actions.filter(action => action.dueDate > endOfToday);

          // this.actionsOverdueNetwork = this.actionsOverdueNetwork.concat(actions.filter(action => action.dueDate < startOfToday));
          // this.actionsTodayNetwork = this.actionsTodayNetwork.concat(actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday));
          // this.actionsThisWeekNetwork = this.actionsThisWeekNetwork.concat(actions.filter(action => action.dueDate > endOfToday));

          for (let x of this.actionsOverdueNetwork) {
            this.updateTaskDataForActionsNetwork(x.$key, x, networkCountryId, (action) => {
              if (action) {
                x.task = action.task;
                x.level = action.level;
              }
            });
          }

          for (let x of this.actionsTodayNetwork) {
            this.updateTaskDataForActionsNetwork(x.$key, x, networkCountryId, (action) => {
              if (action) {
                x.task = action.task;
                x.level = action.level;
              }
            });
          }
          for (let x of this.actionsThisWeekNetwork) {
            this.updateTaskDataForActionsNetwork(x.$key, x, networkCountryId, (action) => {
              if (action) {
                x.task = action.task;
                x.level = action.level;
              }
            });
          }
        });
    })
  }

  private initLocalNetworkActions(startOfToday: number, endOfToday: number, localNetworks) {
    this.actionsOverdueNetwork = [];
    this.actionsTodayNetwork = [];
    this.actionsThisWeekNetwork = [];
    localNetworks.forEach(networkId => {
      this.actionService.getActionsDueInWeek(networkId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(actions => {

          // Display APA only if there is a red alert
          actions = actions.filter(action => !action.level || action.level != ActionLevel.APA || this.isRedAlert);

          this.actionsOverdueNetwork = this.actionsOverdueNetwork.concat(actions.filter(action => action.dueDate < startOfToday));
          this.actionsTodayNetwork = this.actionsTodayNetwork.concat(actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday));
          this.actionsThisWeekNetwork = this.actionsThisWeekNetwork.concat(actions.filter(action => action.dueDate > endOfToday));

          for (let x of this.actionsOverdueNetwork) {
            this.updateTaskDataForActionsNetwork(x.$key, x, networkId, (action) => {
              if (action) {
                x.task = action.task;
                x.level = action.level;
              }
            });
          }

          for (let x of this.actionsTodayNetwork) {
            this.updateTaskDataForActionsNetwork(x.$key, x, networkId, (action) => {
              if (action) {
                x.task = action.task;
                x.level = action.level;
              }
            });
          }
          for (let x of this.actionsThisWeekNetwork) {
            this.updateTaskDataForActionsNetwork(x.$key, x, networkId, (action) => {
              if (action) {
                x.task = action.task;
                x.level = action.level;
              }
            });
          }
        });
    })
  }

  private initNetworkIndicators(startOfToday, endOfToday, networkMap: Map<string, string>) {
    this.indicatorsOverdueNetwork = [];
    this.indicatorsThisWeekNetwork = [];
    this.indicatorsTodayNetwork = [];
    CommonUtils.convertMapToValuesInArray(networkMap).forEach(networkCountryId => {
      this.actionService.getIndicatorsDueInWeek(networkCountryId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(indicators => {
          let overdueIndicators = indicators.filter(indicator => indicator.dueDate < startOfToday);
          //this.indicatorsOverdueNetwork = this.indicatorsOverdueNetwork.concat(overdueIndicators);
          let dayIndicators = indicators.filter(indicator => indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday);
          //this.indicatorsTodayNetwork = this.indicatorsTodayNetwork.concat(dayIndicators);
          let weekIndicators = indicators.filter(indicator => indicator.dueDate > endOfToday);
          //this.indicatorsThisWeekNetwork = this.indicatorsThisWeekNetwork.concat(weekIndicators);
          if (overdueIndicators.length > 0) {
            overdueIndicators.forEach(indicator => {
              if (this.actionService.isExist(indicator.$key, this.indicatorsOverdueNetwork)) {
                let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsOverdueNetwork);
                if (index != -1) {
                  this.indicatorsOverdueNetwork[index] = indicator;
                }
              } else {
                this.indicatorsOverdueNetwork.push(indicator);
              }
            });
          }
          if (dayIndicators.length > 0) {
            dayIndicators.forEach(indicator => {
              if (this.actionService.isExist(indicator.$key, this.indicatorsTodayNetwork)) {
                let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsTodayNetwork);
                if (index != -1) {
                  this.indicatorsTodayNetwork[index] = indicator;
                }
              } else {
                this.indicatorsTodayNetwork.push(indicator);
              }
            });
          }
          if (weekIndicators.length > 0) {
            weekIndicators.forEach(indicator => {
              if (this.actionService.isExist(indicator.$key, this.indicatorsThisWeekNetwork)) {
                let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsThisWeekNetwork);
                if (index != -1) {
                  this.indicatorsThisWeekNetwork[index] = indicator;
                }
              } else {
                this.indicatorsThisWeekNetwork.push(indicator);
              }
            });
          }
          // console.log('Count ---- ' + this.responseType.length)
        });
    })
  }

  private initLocalNetworkIndicators(startOfToday, endOfToday, localNetworks) {
    this.indicatorsOverdueNetwork = [];
    this.indicatorsThisWeekNetwork = [];
    this.indicatorsTodayNetwork = [];
    localNetworks.forEach(networkId => {
      this.actionService.getIndicatorsDueInWeek(networkId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(indicators => {
          let overdueIndicators = indicators.filter(indicator => indicator.dueDate < startOfToday);
          //this.indicatorsOverdueNetwork = this.indicatorsOverdueNetwork.concat(overdueIndicators);
          let dayIndicators = indicators.filter(indicator => indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday);
          //this.indicatorsTodayNetwork = this.indicatorsTodayNetwork.concat(dayIndicators);
          let weekIndicators = indicators.filter(indicator => indicator.dueDate > endOfToday);
          //this.indicatorsThisWeekNetwork = this.indicatorsThisWeekNetwork.concat(weekIndicators);
          if (overdueIndicators.length > 0) {
            overdueIndicators.forEach(indicator => {
              if (this.actionService.isExist(indicator.$key, this.indicatorsOverdueNetwork)) {
                let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsOverdueNetwork);
                if (index != -1) {
                  this.indicatorsOverdueNetwork[index] = indicator;
                }
              } else {
                this.indicatorsOverdueNetwork.push(indicator);
              }
            });
          }
          if (dayIndicators.length > 0) {
            dayIndicators.forEach(indicator => {
              if (this.actionService.isExist(indicator.$key, this.indicatorsTodayNetwork)) {
                let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsTodayNetwork);
                if (index != -1) {
                  this.indicatorsTodayNetwork[index] = indicator;
                }
              } else {
                this.indicatorsTodayNetwork.push(indicator);
              }
            });
          }
          if (weekIndicators.length > 0) {
            weekIndicators.forEach(indicator => {
              if (this.actionService.isExist(indicator.$key, this.indicatorsThisWeekNetwork)) {
                let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsThisWeekNetwork);
                if (index != -1) {
                  this.indicatorsThisWeekNetwork[index] = indicator;
                }
              } else {
                this.indicatorsThisWeekNetwork.push(indicator);
              }
            });
          }
          // console.log('Count ---- ' + this.responseType.length)
        });
    })
  }
}
