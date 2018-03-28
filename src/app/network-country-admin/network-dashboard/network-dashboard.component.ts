import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NetworkModulesEnabledModel, PageControlService} from "../../services/pagecontrol.service";
import {AngularFire} from "angularfire2";
import {NetworkService} from "../../services/network.service";
import {NotificationService} from "../../services/notification.service";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {Constants} from "../../utils/Constants";
import {AlertMessageModel} from "../../model/alert-message.model";
import {
  ActionLevel,
  ActionType,
  AlertLevels,
  AlertMessageType,
  AlertStatus,
  ApprovalStatus,
  Countries,
  DashboardType,
  ModuleNameNetwork,
  Privacy,
  UserType
} from "../../utils/Enums";
import {ModelAlert} from "../../model/alert.model";
import {Observable} from "rxjs/Observable";
import {HazardImages} from "../../utils/HazardImages";
import * as moment from "moment";
import {
  ChronolineEvent,
  DashboardSeasonalCalendarComponent
} from "../../dashboard/dashboard-seasonal-calendar/dashboard-seasonal-calendar.component";
import {ActionsService} from "../../services/actions.service";
import {LocalStorageService} from "angular-2-local-storage";
import {CommonUtils} from "../../utils/CommonUtils";
import {SettingsService} from "../../services/settings.service";
import {ModuleSettingsModel} from "../../model/module-settings.model";
import {NetworkCountryCreateEditActionComponent} from "../network-preparedness/network-country-create-edit-action/network-country-create-edit-actionn.component";
import {NetworkCountryMpaComponent} from "../network-preparedness/network-country-mpa/network-country-mpa.component";
import {PrepActionService} from "../../services/prepactions.service";
import {MandatedListModel} from "../../agency-admin/agency-mpa/agency-mpa.component";
import {map} from "rxjs/operator/map";
import {NetworkViewModel} from "../../country-admin/country-admin-header/network-view.model";


declare var Chronoline, document, DAY_IN_MILLISECONDS, isFifthDay, prevMonth, nextMonth: any;
declare var jQuery: any;

@Component({
  selector: 'app-network-dashboard',
  templateUrl: './network-dashboard.component.html',
  styleUrls: ['./network-dashboard.component.css']
})
export class NetworkDashboardComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;
  private ApprovalStatus = ApprovalStatus;
  private NETWORK_MODULE = ModuleNameNetwork

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;
  private localNetworks: any;
  private showLoader: boolean;
  private uid: string;

  //for local network admin
  @Input() isLocalNetworkAdmin: boolean;

  //for view
  private isViewing: boolean;

  //copy over from response plan
  private alertList: ModelAlert[];

  private NODE_TO_CHECK: string;

  private DashboardType = DashboardType;
  private UserType = UserType;
  private DashboardTypeUsed: DashboardType;

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
  private countryLocation: number;

  private AlertLevels = AlertLevels;
  private AlertStatus = AlertStatus;

  private alerts: Observable<any>;
  private alertsNetwork: Observable<any>;
  private alertsNetworkLocal: Observable<any>;

  private hazards: any[] = [];
  private numberOfIndicatorsObject = {};

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
  private networkMap: Map<string, string>;
  private userPaths = Constants.USER_PATHS;

  private taskName: string;
  private taskLevel: number;
  private idToday: string;
  private idThisWeek: string;
  private idOverdue: string;
  protected prepActionService: PrepActionService = new PrepActionService();

  private userType: UserType;
  private actions: MandatedListModel[] = [];
  private mandatedMap = new Map();
  private actionType = ActionType;

  // Module settings
  private moduleSettings: NetworkModulesEnabledModel = new NetworkModulesEnabledModel();
  private networkViewValues: {};
  private agencyCountryMap = new Map<string, string>();
  private networkModules: ModuleSettingsModel[]

  private Hazard_Conflict = 1
  private showCoCBanner: boolean;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private networkService: NetworkService,
              private notificationService: NotificationService,
              private userService: UserService,
              private storageService: LocalStorageService,
              private actionService: ActionsService,
              private route: ActivatedRoute,
              private settingService: SettingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params["isViewing"]) {
        this.isViewing = params["isViewing"];
      }
      if (params["systemId"]) {
        this.systemId = params["systemId"];
      }
      if (params["agencyId"]) {
        this.agencyId = params["agencyId"];
      }
      if (params["countryId"]) {
        this.countryId = params["countryId"];
      }
      if (params["userType"]) {
        this.userType = params["userType"];
      }
      if (params["networkId"]) {
        this.networkId = params["networkId"];
      }
      if (params["uid"]) {
        this.uid = params["uid"];
        this.checkCoCUpdated();
      }
      if (!this.isLocalNetworkAdmin) {
        this.networkCountryId = params["networkCountryId"];
      }

      this.networkService.getLocalNetworksWithCountryForCountry(this.agencyId, this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(localNetworks => {
          this.localNetworks = localNetworks
        });

      this.networkService.mapNetworkWithCountryForCountry(this.agencyId, this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(networkMap => {
          this.networkMap = networkMap
        });

      this.isViewing ? this.isLocalNetworkAdmin ? this.initLocalViewAccess() : this.initViewAccess() : this.isLocalNetworkAdmin ? this.initLocalNetworkAccess() : this.initNetworkAccess();
    })
  }


  private checkCoCUpdated() {
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/latestCoCAgreed", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() == null || snap.val() == false) {
          this.showCoCBanner = true;
        }
      });
  }

  private initNetworkAccess() {
    this.DashboardTypeUsed = DashboardType.default;
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;
      this.checkCoCUpdated();

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];

          this.getMandatedPrepActions();

          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.moduleSettings = matrix);

          this.settingService.getCountryModulesSettings(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(modules => {
              this.networkModules = modules
              console.log(this.networkModules)
            })

        });
    });
  }

  getMandatedPrepActions() {
    console.log(Constants.APP_STATUS + "/actionMandated/" + this.networkId + "/");
    this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + this.networkId + "/", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.actions = [];
        snap.forEach((snapshot) => {
          let x: MandatedListModel = new MandatedListModel();
          x.id = snapshot.key;
          x.task = snapshot.val().task;
          x.level = snapshot.val().level;
          x.department = snapshot.val().department;
          this.mandatedMap.set(x.id, x);
          console.log(this.mandatedMap);

        });
        this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agencyCountryMap => {
            console.log(agencyCountryMap)
            this.agencyCountryMap = agencyCountryMap
            this.loadData();
          })
      });

  }

  navigateToNetworkActions(action) {
    if (action.level == ActionLevel.MPA) {
      let model = new NetworkViewModel(this.systemId, this.agencyId, this.countryId, action.$key, this.userType, this.uid, action.networkId, action.countryId, true)
      this.storageService.set(Constants.NETWORK_VIEW_VALUES, model);
      this.isViewing ?
        this.router.navigate(['/network-country/network-country-mpa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)])
        :
        this.isLocalNetworkAdmin ?
          this.router.navigate(['/network/local-network-preparedness-mpa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)])
          :
          this.router.navigate(['/network-country/network-country-mpa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)])
    } else {
      this.isViewing ?
        this.router.navigate(['/network-country/network-country-apa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)])
        :
        this.isLocalNetworkAdmin ?
          this.router.navigate(['/network/local-network-preparedness-apa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)])
          :
          this.router.navigate(['/network-country/network-country-apa', this.storageService.get(Constants.NETWORK_VIEW_VALUES)])
    }
  }

  navigateToNetworkIndicator(indicator) {
    indicator.hazardScenario["key"] == "countryContext" ?
      this.router.navigate(["/risk-monitoring", {
        "updateIndicatorID": indicator.$key,
        "hazardID": indicator.hazardScenario["key"]
      }])
      :
      this.router.navigate(["/risk-monitoring", {
        "updateIndicatorID": indicator.$key,
        "hazardID": indicator.hazardScenario["hazardScenario"]
      }])
  }

  private initLocalNetworkAccess() {

    this.DashboardTypeUsed = DashboardType.default;
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;
      this.checkCoCUpdated();

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];

          this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agencyCountryMap => {
              this.agencyCountryMap = agencyCountryMap;
              this.loadData();
            });

          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.moduleSettings = matrix);

          this.settingService.getCountryModulesSettings(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(modules => {
              this.networkModules = modules
              console.log(this.networkModules)
            })

        });
    });
  }

  private initViewAccess() {
    console.log(this.userType);
    this.DashboardTypeUsed = this.userType == UserType.CountryDirector ? DashboardType.director : DashboardType.default;
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    console.log(this.networkViewValues)
    if (!this.networkViewValues) {
      console.log('no network view values')
      this.router.navigateByUrl("/dashboard");
      return
    }

    this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyCountryMap => {
        console.log(agencyCountryMap)
        this.agencyCountryMap = agencyCountryMap;
        if (this.userType == UserType.PartnerUser) {
          this.loadDataForPartnerUser(this.agencyId, this.countryId);
        } else {
          this.loadData();
        }
      })

    this.networkService.getNetworkModuleMatrix(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(matrix => this.moduleSettings = matrix);

    this.settingService.getCountryModulesSettings(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(modules => {
        this.networkModules = modules
        console.log(this.networkModules)
      })

  }

  private initLocalViewAccess() {
    console.log(this.userType)
    if (this.userType == UserType.CountryDirector) {
      this.DashboardTypeUsed = DashboardType.director
    } else {
      this.DashboardTypeUsed = DashboardType.default
    }
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    if (!this.networkViewValues) {
      this.router.navigateByUrl("/dashboard")
      return
    }

    this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyCountryMap => {
        console.log(agencyCountryMap)
        this.agencyCountryMap = agencyCountryMap
        if (this.userType == UserType.PartnerUser) {
          this.loadDataForPartnerUser(this.agencyId, this.countryId);
        } else {
          console.log("local view access")
          this.loadData();
        }

      })

    this.networkService.getNetworkModuleMatrix(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(matrix => this.moduleSettings = matrix);

    this.settingService.getCountryModulesSettings(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(modules => {
        this.networkModules = modules
      })
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
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.getAllSeasonsForCountryId(id);
    this.getAlerts(id);
    this.getCountryContextIndicators(id);
    this.getHazards(id);
    this.initData(id);
    this.getCountryDataNetwork(this.networkId, id, this.isLocalNetworkAdmin);
    console.log(this.actionsThisWeek.length, 'actions length');
  }


  private loadDataForPartnerUser(agencyId, countryId) {
    console.log('loading for partner user')
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
    let id = this.countryId ? this.countryId : this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    let agencyId = this.agencyId ? this.agencyId : this.networkId;
    this.getAllSeasonsForCountryId(id);
    this.getAlerts(id)
    this.getCountryContextIndicators(id);
    this.getHazards(id);
    this.initData(id);
    this.getCountryData(agencyId, id);
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
        this.agencyCountryMap && this.agencyCountryMap.size == 0 ? this.initCalendar()
          :
          CommonUtils.convertMapToValuesInArray(this.agencyCountryMap).forEach(id => {
            this.af.database.object(Constants.APP_STATUS + "/season/" + id, {preserveSnapshot: true})
              .takeUntil(this.ngUnsubscribe)
              .subscribe(snapshot => {
                let i = 100;
                snapshot.forEach((seasonInfo) => {
                  let x: ChronolineEvent = ChronolineEvent.create(i, seasonInfo.val());
                  this.seasonEvents.push(x);
                  i++;
                });
                this.initCalendar();
              })
          })
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

  private initData(id) {
    console.log(id)
    let startOfToday = moment().startOf("day").valueOf();
    let endOfToday = moment().endOf("day").valueOf();
    this.actionService.getActionsDueInWeek(id, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(actions => {
        console.log(actions, 'actions');
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
        //console.log(this.actionsThisWeek, 'YO')
        //this.loadMandated();
      });


    this.actionService.getIndicatorsDueInWeek(id, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(indicators => {
        console.log(indicators)
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

    if (this.userType == UserType.PartnerUser) {
      console.log("approval for partner user");
      this.responsePlansForApproval = this.actionService.getResponsePlanForCountryDirectorToApproval(this.countryId, this.uid, true);
      this.responsePlansForApprovalNetworkLocal = Observable.of([])

      if (this.networkCountryId) {
        this.responsePlansForApprovalNetwork = this.actionService.getResponsePlanForCountryDirectorToApproval(this.networkCountryId, this.uid, true);
      }

      if (this.localNetworks) {
        this.networkMap.forEach((networkCountryId) => {
          this.responsePlansForApprovalNetwork = this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkCountryId);
        });

        this.localNetworks.forEach(networkId => {
          this.responsePlansForApprovalNetworkLocal = this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkId);
        })
      }

    } else if (this.userType == UserType.CountryDirector) {
      this.responsePlansForApproval = this.actionService.getResponsePlanForCountryDirectorToApproval(this.countryId, this.uid, false);

      if (this.networkCountryId) {
        this.responsePlansForApprovalNetwork = this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, this.networkCountryId);
      }

      if (this.localNetworks) {
        this.networkMap.forEach((networkCountryId) => {
          this.responsePlansForApprovalNetwork = this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkCountryId);
        });

        this.localNetworks.forEach(networkId => {
          this.responsePlansForApprovalNetworkLocal = this.actionService.getResponsePlanForCountryDirectorToApprovalNetwork(this.countryId, networkId);
        })
      }
    }

    if (this.responsePlansForApproval) {
      this.responsePlansForApproval
        .takeUntil(this.ngUnsubscribe)
        .subscribe(plans => {
          this.approvalPlans = plans;

        });
    }
    if (this.responsePlansForApprovalNetwork) {
      this.responsePlansForApprovalNetwork
        .takeUntil(this.ngUnsubscribe)
        .subscribe(plans => {
          console.log(plans)
          this.approvalPlansNetwork = plans
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
    console.log(this.approvalPlansNetwork, 'approval plan')
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

  private getCountryData(agencyId, countryId) {
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + '/' + countryId + "/location")
      .takeUntil(this.ngUnsubscribe)
      .subscribe((location: any) => {
        this.countryLocation = location.$value;
        this.showLoader = false;
      });
  }

  private getCountryDataNetwork(agencyId, countryId, isLocalNetworkAdmin) {
    isLocalNetworkAdmin ? this.af.database.object(Constants.APP_STATUS + "/network/" + agencyId + "/countryCode")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value;
          this.showLoader = false;
        }) :
      this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + agencyId + '/' + countryId + "/location")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value;
          this.showLoader = false;
        });
  }

  private getAlerts(id) {

    if (this.DashboardTypeUsed == DashboardType.default) {
      this.alerts = this.actionService.getAlerts(id);

    } else if (this.DashboardTypeUsed == DashboardType.director) {

      //this.alerts = this.actionService.getAlertsForDirectorToApprove(this.uid, id);
      //console.log(this.alerts, 'in alerts')
      if (this.networkCountryId) {
        this.alertsNetwork = this.actionService.getAlertsForDirectorToApproveNetwork(this.countryId, this.networkCountryId, this.networkId);
        console.log(this.alertsNetwork, 'logging alerts');
      } else {

        console.log('not network country id');
        this.alertsNetworkLocal = this.actionService.getAlertsForDirectorToApproveLocalNetwork(this.countryId, this.networkId)
      }

      this.amberAlerts = this.actionService.getAlerts(id)
        .map(alerts => {
          return alerts.filter(alert => alert.alertLevel == AlertLevels.Amber);
        });
      this.redAlerts = this.actionService.getRedAlerts(id)
        .map(alerts => {
          return alerts.filter(alert => alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved);
        });

      console.log(this.redAlerts, 'red alerts');
    }
    this.actionService.getRedAlerts(id)
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
    if (level == ActionLevel.MPA && !(this.networkModules && this.networkModules[ModuleNameNetwork.MinimumPreparednessActions].status)) {
      return false;
    }
    else if (level == ActionLevel.APA && (!(this.networkModules && this.networkModules[ModuleNameNetwork.AdvancedPreparednessActions].status) || !this.isRedAlert)) {
      return false;
    }
    else if (action == ActionType.chs && !(this.networkModules && this.networkModules[ModuleNameNetwork.CHSPreparednessActions].status)) {
      return false;
    }
    else return true;
  }

  private getHazards(id) {

    this.hazards = [];

    this.af.database.list(Constants.APP_STATUS + '/hazard/' + id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(list => {
        list.forEach(hazard => {
          if (hazard.isActive && (hazard.hazardScenario == this.Hazard_Conflict && this.networkModules[ModuleNameNetwork.ConflictIndicators].status || hazard.hazardScenario != this.Hazard_Conflict)) {
            if (hazard.hazardScenario == -1) {
              this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName)
                .first()
                .subscribe(nameObj => {
                  hazard.otherName = nameObj.name;
                  this.hazards.push(hazard);
                });
            } else {
              if (!this.checkHazardScenarioExist(hazard, this.hazards)) {
                this.hazards.push(hazard);
                this.af.database.object(Constants.APP_STATUS + '/indicator/' + hazard.$key)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(object => {
                    if (object) {
                      this.numberOfIndicatorsObject[object.$key] = Object.keys(object).filter(key => !key.includes("$")).length;
                    }
                  });
              } else {
                this.af.database.object(Constants.APP_STATUS + '/indicator/' + hazard.$key)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(object => {
                    if (object) {
                      let key = this.getHazardIdIfExist(hazard, this.hazards)
                      this.numberOfIndicatorsObject[key] += Object.keys(object).filter(key => !key.includes("$")).length;
                    }
                  });
              }
            }
          }
        });
      })

    //get hazard and indicator for all normal country in network
    this.getHazardsForCountriesInNetwork();
  }

  private getHazardsForCountriesInNetwork() {
    CommonUtils.convertMapToValuesInArray(this.agencyCountryMap).forEach(countryId => {
      this.settingService.getPrivacySettingForCountry(countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(privacy => {
          console.log(privacy)
          let agencyKey = CommonUtils.reverseMap(this.agencyCountryMap).get(countryId)
          if (agencyKey == this.agencyId || privacy.riskMonitoring != Privacy.Private) {
            this.af.database.list(Constants.APP_STATUS + '/hazard/' + countryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(list => {
                list.forEach(hazard => {
                  if (hazard.isActive && (hazard.hazardScenario == this.Hazard_Conflict && this.networkModules[ModuleNameNetwork.ConflictIndicators].status || hazard.hazardScenario != this.Hazard_Conflict)) {
                    if (hazard.hazardScenario == -1) {
                      this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName)
                        .first()
                        .subscribe(nameObj => {
                          hazard.otherName = nameObj.name;
                          this.hazards.push(hazard);
                        });
                    } else {
                      //check conflict privacy settings
                      if (agencyKey == this.agencyId || !(privacy.conflictIndicators && privacy.conflictIndicators == Privacy.Private && hazard.hazardScenario == this.Hazard_Conflict)) {
                        if (!this.checkHazardScenarioExist(hazard, this.hazards)) {
                          this.hazards.push(hazard);
                          this.af.database.object(Constants.APP_STATUS + '/indicator/' + hazard.$key)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe(object => {
                              if (object) {
                                this.numberOfIndicatorsObject[object.$key] = Object.keys(object).filter(key => !key.includes("$")).length;
                              }
                            });
                        } else {
                          this.af.database.object(Constants.APP_STATUS + '/indicator/' + hazard.$key)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe(object => {
                              if (object) {

                                let key = this.getHazardIdIfExist(hazard, this.hazards)
                                this.numberOfIndicatorsObject[key] += Object.keys(object).filter(key => !key.includes("$")).length;
                              }
                            });
                        }
                      }
                    }
                  }
                });
              })
          }
        })

    })
  }

  private checkHazardScenarioExist(hazard, hazardList) {
    return hazardList.map(hazard => hazard.hazardScenario).indexOf(hazard.hazardScenario) > -1
  }

  private getHazardIdIfExist(hazard, hazardList) {
    let index = hazardList.map(hazard => hazard.hazardScenario).indexOf(hazard.hazardScenario)
    return hazardList[index].$key
  }

  private getCountryContextIndicators(id) {

    this.af.database.list(Constants.APP_STATUS + '/indicator/' + id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(list => {
        list.forEach(indicator => {
          this.countryContextIndicators.push(indicator);
        });
      });

    //get other countries in network
    CommonUtils.convertMapToValuesInArray(this.agencyCountryMap).forEach(countryId => {
      this.settingService.getPrivacySettingForCountry(countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(privacy => {
          let agencyKey = CommonUtils.reverseMap(this.agencyCountryMap).get(countryId)
          if (agencyKey == this.agencyId || privacy.riskMonitoring != Privacy.Private) {
            this.af.database.list(Constants.APP_STATUS + '/indicator/' + countryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(list => {
                list.forEach(indicator => {
                  if (!CommonUtils.itemExistInList(indicator.$key, this.countryContextIndicators)) {
                    this.countryContextIndicators.push(indicator);
                  }
                });
              });
          }
        })

    })
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
          console.log(task, 'logging task')
          action.task = task;
        })
    }
  }

  getIndicatorName(indicator): string {
    return this.actionService.getIndicatorTitle(indicator);
  }

  updateAlert(alertId, isDirectorAmber) {
    if (this.isLocalNetworkAdmin) {
      if (this.DashboardTypeUsed == DashboardType.default) {
        if (this.networkViewValues) {
          this.networkViewValues["id"] = alertId
        }
        this.router.navigate(this.networkViewValues ? ['network/local-network-dashboard/dashboard-update-alert-level/', this.networkViewValues] : ['network/local-network-dashboard/dashboard-update-alert-level/', {
          id: alertId,
          networkCountryId: this.networkCountryId
        }]);
      } else if (isDirectorAmber) {
        if (this.networkViewValues) {
          this.networkViewValues["id"] = alertId
        }
        this.router.navigate(this.networkViewValues ? ['network/local-network-dashboard/dashboard-update-alert-level', this.networkViewValues] : ['network/local-network-dashboard/dashboard-update-alert-level', {
          id: alertId,
          networkId: this.networkId,
          isDirector: true
        }]);
      } else {
        let selection = this.approveMap.get(alertId);
        this.approveMap.set(alertId, !selection);
      }
    } else {
      if (this.DashboardTypeUsed == DashboardType.default) {
        if (this.networkViewValues) {
          this.networkViewValues["id"] = alertId
        }
        this.router.navigate(this.networkViewValues ? ['network-country/network-dashboard/dashboard-update-alert-level/', this.networkViewValues] : ['network-country/network-dashboard/dashboard-update-alert-level/', {
          id: alertId,
          networkCountryId: this.networkCountryId
        }]);
      } else if (isDirectorAmber) {
        if (this.networkViewValues) {
          this.networkViewValues["id"] = alertId
          this.networkViewValues["isDirector"] = true
        }
        this.router.navigate(this.networkViewValues ? ['network-country/network-dashboard/dashboard-update-alert-level', this.networkViewValues]
          : ['network-country/network-dashboard/dashboard-update-alert-level', {
            id: alertId,
            networkCountryId: this.networkCountryId,
            isDirector: true
          }]);
      } else {
        console.log(this.approveMap)
        let selection = this.approveMap.get(alertId);
        this.approveMap.set(alertId, !selection);
        console.log(this.approveMap)
      }
    }

  }

  approveRedAlert(alertId, hazardScenario, alert) {


    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;

    let hazard = this.hazards.find(x => x.hazardScenario == hazardScenario)
    let hazardTrackingNode;

    if (hazard && hazard.timeTracking && hazard.timeTracking[alertId]) {
      hazardTrackingNode = hazard.timeTracking ? hazard.timeTracking[alertId] : undefined;
    }

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1, level: AlertLevels.Red};


    // saves alert key to apa to retrieve locations affected
    this.af.database.list(Constants.APP_STATUS + '/action/' + id, {
      query: {
        orderByChild: 'level',
        equalTo: 2
      }
    })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(actions => {
        actions.forEach(action => {
          if (!action.redAlerts) {
            action.redAlerts = [];
          }
          if (action.assignedHazards && (action.assignedHazards.length == 0 || action.assignedHazards.includes(alert.hazardScenario))) {
            action.redAlerts.push(alert.id)

            if (action["timeTracking"]["timeSpentInGrey"] && action["timeTracking"]["timeSpentInGrey"].find(x => x.finish == -1)) {

              action["timeTracking"]["timeSpentInGrey"][action["timeTracking"]["timeSpentInGrey"].findIndex(x => x.finish == -1)].finish = currentTime;
              if (!action.asignee) {
                if (!action["timeTracking"]["timeSpentInRed"]) {
                  action['timeTracking']['timeSpentInRed'] = [];
                }
                action['timeTracking']['timeSpentInRed'].push(newTimeObject)
              } else if (action.isComplete) {
                if (!action["timeTracking"]["timeSpentInGreen"]) {
                  action['timeTracking']['timeSpentInGreen'] = [];
                }
                action['timeTracking']['timeSpentInGreen'].push(newTimeObject)
              } else {
                if (!action["timeTracking"]["timeSpentInAmber"]) {
                  action['timeTracking']['timeSpentInAmber'] = [];
                }
                action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
              }
            }

            this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.$key + '/timeTracking')
              .update(action.timeTracking)
            this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.$key + '/redAlerts')
              .update(action.redAlerts)
          }
        });
      })


    if (hazard) {

      if (hazardTrackingNode["timeSpentInAmber"]) {
        hazardTrackingNode["timeSpentInAmber"][hazardTrackingNode["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime
      }

      if (hazardTrackingNode) {
        if (!hazardTrackingNode["timeSpentInRed"]) {
          hazardTrackingNode["timeSpentInRed"] = [];
        }

        hazardTrackingNode["timeSpentInRed"].push(newTimeObject)
        this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.$key + '/timeTracking/' + alertId)
          .update(hazardTrackingNode)
      } else {
        this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.$key + '/timeTracking/' + alertId)
          .update({timeSpentInRed: [newTimeObject]})
      }

    }


    if (alert["timeTracking"]) {
      console.log('first here')
      if (!alert["timeTracking"]["timeSpentInRed"]) {
        alert["timeTracking"]["timeSpentInRed"] = [];
      }

      alert["timeTracking"]["timeSpentInRed"].push(newTimeObject)
      this.af.database.object(Constants.APP_STATUS + '/alert/' + id + '/' + alertId + '/timeTracking/')
        .update(alert["timeTracking"])
    } else {
      console.log('here')
      this.af.database.object(Constants.APP_STATUS + '/alert/' + id + '/' + alertId + '/timeTracking/')
        .update({timeSpentInRed: [newTimeObject]})
    }

    this.actionService.approveRedAlertNetwork(this.countryId, alertId, id).then(() => {
      if (this.isLocalNetworkAdmin) {
        this.networkService.mapAgencyCountryForLocalNetworkCountry(this.networkId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(map => {
            this.actionService.getAlertObj(this.networkId, alertId)
              .first()
              .subscribe(alertObj => {
                this.actionService.copyRedAlertOverFromNetwork(map, alertId, alertObj)
              })
          })
      } else {
        this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(map => {
            console.log(map)
            this.actionService.getAlertObj(this.networkCountryId, alertId)
              .first()
              .subscribe(alertObj => {
                this.actionService.copyRedAlertOverFromNetwork(map, alertId, alertObj)
              })
          })
      }

    });
  }

  rejectRedRequest(alert) {
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.isViewing ? this.actionService.rejectRedAlert(id, alert, this.countryId) : this.actionService.rejectRedAlert(id, alert)
  }

  planReview(planId) {
    this.router.navigate(["/dashboard/review-response-plan", this.networkCountryId ? {
      "id": planId,
      "networkCountryId": this.networkCountryId
    } : {"id": planId}]);
  }

  requestAgencyPartner(agency) {
    console.log("called from dashboard");
    console.log(agency);
    this.loadDataForPartnerUser(agency.$key, agency.relatedCountryId);
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  toCalendar() {
    if (this.agencyCountryMap.size > 0) {
      this.storageService.set(Constants.NETWORK_CALENDAR, this.agencyCountryMap)
    }
  }

}
