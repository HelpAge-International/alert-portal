import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  ActionLevel,
  AlertLevels,
  AlertMessageType,
  ApprovalStatus,
  Countries,
  HazardScenario,
  ModuleNameNetwork,
  Privacy
} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {PrepActionService, PreparednessAction} from "../../services/prepactions.service";
import {Subject} from "rxjs/Subject";
import {NetworkModulesEnabledModel, PageControlService} from "../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {AlertMessageModel} from "../../model/alert-message.model";
import {NetworkService} from "../../services/network.service";
import {LocalStorageService} from "angular-2-local-storage";
import {SettingsService} from "../../services/settings.service";
import {ModuleSettingsModel} from "../../model/module-settings.model";

@Component({
  selector: 'app-network-country-statistics-ribbon',
  templateUrl: './network-country-statistics-ribbon.component.html',
  styleUrls: ['./network-country-statistics-ribbon.component.scss']
})
export class NetworkCountryStatisticsRibbonComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;
  private ApprovalStatus = ApprovalStatus;
  private PRIVACY = Privacy
  private MODULE_NETWORK = ModuleNameNetwork


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;
  private showLoader: boolean;
  private uid: string;

  //Copy over
  private countryId: string;
  private agencyId: string;
  private systemId: string;

  private AlertLevels = AlertLevels;
  private overallAlertLevel: AlertLevels;

  private countryLocation: number;
  private CountriesList = Constants.COUNTRIES;
  private count: number = 0;
  private numOfApprovedResponsePlans: number = 0;

  private threshMinAmber: number = 60;
  private threshMinGreen: number = 80;
  private threshAdvAmber: number = 60;
  private threshAdvGreen: number = 80;

  private defaultClockValue: number;
  private defaultClockType: number;

  private minPrepPercentage: number;
  private advPrepPercentage: number;
  private chsPrepPercentage: number;

  private mpaStatusColor: string = "grey";
  private mpaStatusIcon: string = "fa-times";
  private apaStatusColor: string = "grey";
  private apaStatusIcon: string = "fa-times";

  private prepActionService: PrepActionService = new PrepActionService();

  private ranThresh: boolean = false;
  private ranClock: boolean = false;

  private date: number = new Date().getTime();

  private userPermissions: any;
  private hazardRedAlert: Map<HazardScenario, boolean> = new Map<HazardScenario, boolean>();
  Math: any;

  //for local network admin
  @Input() isLocalNetworkAdmin: boolean;
  private networkViewValues: {};
  private networkModules: ModuleSettingsModel[];

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private networkService: NetworkService,
              private af: AngularFire,
              private router: Router,
              private settingService: SettingsService,
              private storageService: LocalStorageService) {
    this.Math = Math;
    this.userPermissions = new NetworkModulesEnabledModel();
  }

  ngOnInit() {
    // this.normalAccess();
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    this.networkViewValues ? this.isLocalNetworkAdmin ? this.initViewLocalNetworkAccess() : this.initViewNetworkAccess() : this.isLocalNetworkAdmin ? this.initLocalNetworkAccess() : this.initNetworkAccess();
  }

  private initNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          this.showLoader = false;
          this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agencyCountryMap => {

              this.networkService.getSystemIdForNetworkCountryAdmin(this.uid)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(systemId => {
                  this.systemId = systemId;
                  console.log(`system id: ${systemId}`);

                  this.downloadThreshold(() => {
                    this.downloadDefaultClockSettingsNetwork(this.networkId, () => {
                      this.initAlerts(this.networkCountryId, () => {
                        this.getCountryNumberNetwork(this.networkId, this.networkCountryId);
                        this.getApprovedResponsePlansCount(this.networkCountryId);
                        this.prepActionService.addUpdater(() => {
                          this.recalculateAll();
                        });
                        this.prepActionService.initNetworkDashboardActions(this.af, this.ngUnsubscribe, this.uid, this.systemId, this.networkId, this.networkCountryId)
                        this.prepActionService.initActionsWithInfoAllAgenciesInNetwork(this.af, this.ngUnsubscribe, this.uid, null, this.networkCountryId, this.networkId, this.systemId, agencyCountryMap)
                      });
                    });
                  });

                });
            })


          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.userPermissions = matrix);

        });
    });
  }

  private initLocalNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.showLoader = false;

          this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agencyCountryMap => {

              this.networkService.getSystemIdForNetworkAdmin(this.uid)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(systemId => {
                  this.systemId = systemId;
                  console.log(`system id: ${systemId}`);

                  this.downloadThreshold(() => {
                    this.downloadDefaultClockSettingsNetwork(this.networkId, () => {
                      this.initAlerts(this.networkId, () => {
                        this.getCountryNumberNetworkLocal(this.networkId);
                        this.getApprovedResponsePlansCount(this.networkId);
                        this.prepActionService.addUpdater(() => {
                          this.recalculateAll();
                        });
                        this.prepActionService.initNetworkDashboardActions(this.af, this.ngUnsubscribe, this.uid, this.systemId, this.networkId)
                        this.prepActionService.initActionsWithInfoAllAgenciesInNetworkLocal(this.af, this.ngUnsubscribe, this.uid, null, this.networkId, this.networkId, this.systemId, agencyCountryMap)
                      });
                    });
                  });

                });
            })


          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.userPermissions = matrix);

        });
    });
  }

  private initViewNetworkAccess() {
    this.uid = this.networkViewValues["uid"];
    this.networkId = this.networkViewValues["networkId"];
    this.networkCountryId = this.networkViewValues["networkCountryId"];
    this.systemId = this.networkViewValues["systemId"];

    this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyCountryMap => {
        this.downloadThreshold(() => {
          this.downloadDefaultClockSettingsNetwork(this.networkId, () => {
            this.initAlerts(this.networkCountryId, () => {
              this.getCountryNumberNetwork(this.networkId, this.networkCountryId);
              this.getApprovedResponsePlansCount(this.networkCountryId);
              this.prepActionService.addUpdater(() => {
                this.recalculateAll();
              });
              this.prepActionService.initNetworkDashboardActions(this.af, this.ngUnsubscribe, this.uid, this.systemId, this.networkId, this.networkCountryId)
              this.prepActionService.initActionsWithInfoAllAgenciesInNetwork(this.af, this.ngUnsubscribe, this.uid, null, this.networkCountryId, this.networkId, this.systemId, agencyCountryMap)
            });
          });
        });
      })

    this.networkService.getNetworkModuleMatrix(this.networkCountryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(matrix => {
        this.userPermissions = matrix
        console.log(this.userPermissions)
      });

    //init module status
    this.settingService.getCountryModulesSettings(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(modules => {
        console.log(modules)
        this.networkModules = modules
      })

  }

  private initViewLocalNetworkAccess() {
    this.uid = this.networkViewValues["uid"];
    this.networkId = this.networkViewValues["networkId"];
    this.systemId = this.networkViewValues["systemId"];

    this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyCountryMap => {
        this.downloadThreshold(() => {
          this.downloadDefaultClockSettingsNetwork(this.networkId, () => {
            this.initAlerts(this.networkId, () => {
              this.getCountryNumberNetworkLocal(this.networkId);
              this.getApprovedResponsePlansCount(this.networkId);
              this.prepActionService.addUpdater(() => {
                this.recalculateAll();
              });
              this.prepActionService.initNetworkDashboardActions(this.af, this.ngUnsubscribe, this.uid, this.systemId, this.networkId)
              this.prepActionService.initActionsWithInfoAllAgenciesInNetworkLocal(this.af, this.ngUnsubscribe, this.uid, null, this.networkId, this.networkId, this.systemId, agencyCountryMap)
            });
          });
        });
      })


    this.networkService.getNetworkModuleMatrix(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(matrix => this.userPermissions = matrix);

    //init module status
    this.settingService.getCountryModulesSettings(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(modules => {
        console.log(modules)
        this.networkModules = modules
      })

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Utility methods to
   * - download min threshold values from system
   */
  private downloadThreshold(fun: () => void) {
    if (this.ranThresh) {
      fun();
    }
    else {
      this.af.database.object(Constants.APP_STATUS + "/system/" + this.systemId, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          if (snap.val().minThreshold.length >= 2) {
            this.threshMinGreen = snap.val().minThreshold[0];
            this.threshMinAmber = snap.val().minThreshold[1];
          }
          if (snap.val().advThreshold.length >= 2) {
            this.threshAdvGreen = snap.val().advThreshold[0];
            this.threshAdvAmber = snap.val().advThreshold[1];
          }
          this.ranThresh = true;
          fun();
        });
    }
  }

  private downloadDefaultClockSettings(agencyId, fun: () => void) {
    if (this.ranClock) {
      fun();
    }
    else {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId + "/clockSettings/preparedness", {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          if (snap.val() != null) {
            this.defaultClockValue = snap.val().value;
            this.defaultClockType = snap.val().durationType;
            this.ranClock = true;
            fun();
          }
        });
    }
  }

  private downloadDefaultClockSettingsNetwork(agencyId, fun: () => void) {
    if (this.ranClock) {
      fun();
    }
    else {
      this.af.database.object(Constants.APP_STATUS + "/network/" + agencyId + "/clockSettings/preparedness", {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          if (snap.val() != null) {
            this.defaultClockValue = snap.val().value;
            this.defaultClockType = snap.val().durationType;
            this.ranClock = true;
            fun();
          }
        });
    }
  }

  /**
   * Country information
   */
  private getCountryNumber(agencyId, countryId) {
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.countryLocation = snap.val().location;
        }
      });
  }

  private getCountryNumberNetwork(agencyId, countryId) {
    this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + agencyId + "/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.countryLocation = snap.val().location;
        }
      });
  }

  private getCountryNumberNetworkLocal(agencyId) {
    this.af.database.object(Constants.APP_STATUS + "/network/" + agencyId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.countryLocation = snap.val().countryCode;
        }
      });
  }

  public getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  /**
   * Response plans counting
   */
  private getApprovedResponsePlansCount(countryId) {
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlans: any) => {
        this.numOfApprovedResponsePlans = 0;
        responsePlans.forEach(plan => {
          if (plan.status == ApprovalStatus.Approved) {
            this.numOfApprovedResponsePlans = this.numOfApprovedResponsePlans + 1;
          }
        });
      });
  }

  /**
   * Initialisation method for the alerts. Builds the map HazardScenario -> boolean if they're active or not
   */
  private initAlerts(countryId, fun: () => void) {
    this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (snapshot.val().alertLevel == AlertLevels.Red) {
            let res: boolean = false;
            for (const userTypes in snapshot.val().approval) {
              for (const thisUid in snapshot.val().approval[userTypes]) {
                if (snapshot.val().approval[userTypes][thisUid] != 0) {
                  res = true;
                }
              }
            }
            if (this.hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              this.hazardRedAlert.set(snapshot.val().hazardScenario, res);
            }
          }
          else {
            if (this.hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              this.hazardRedAlert.set(snapshot.val().hazardScenario, false);
            }
          }
        });
        fun();
      });

    // Populate actions
  }


  /**
   * Preparedness Actions
   */
  private isActionCompleted(action: PreparednessAction) {
    if (action.isArchived == true) {
      return false;
    }
    if (action.level == ActionLevel.APA) {
      if (action.isRedAlertActive(this.hazardRedAlert) && action.isComplete != null) {
        return action.isCompleteAt + action.computedClockSetting > this.date;
      }
    }
    else if (action.level == ActionLevel.MPA) {
      if (action.isComplete != null) {
        return action.isCompleteAt + action.computedClockSetting > this.date;
      }
    }
    return false;
  }

  private recalculateAll() {
    let minTotal: number = 0;
    let minGreen: number = 0;
    let advTotal: number = 0;
    let advGreen: number = 0;
    let chsTotal: number = 0;
    let chsGreen: number = 0;
    for (let x of this.prepActionService.actions) {
      if (x.level == ActionLevel.MPA) {
        if (!x.isArchived) {
          minTotal++;
          if (this.isActionCompleted(x)) {
            minGreen++;
          }
        }
      }
      else if (x.level == ActionLevel.APA) {
        if (!x.isArchived && x.isRedAlertActive(this.hazardRedAlert)) {
          advTotal++;
          if (this.isActionCompleted(x)) {
            advGreen++;
          }
        }
      }
      // if (x.type == ActionType.chs) {
      //   if (!x.isArchived) {
      //     chsTotal++;
      //     // console.log(`chs total ${chsTotal}`)
      //     if (this.isActionCompleted(x)) {
      //       chsGreen++;
      //       // console.log(`chs completed: ${chsGreen}`)
      //     }
      //   }
      // }
    }
    this.minPrepPercentage = minTotal == 0 ? 0 : (minGreen * 100) / minTotal;
    this.advPrepPercentage = advTotal == 0 ? 0 : (advGreen * 100) / advTotal;
    this.chsPrepPercentage = chsTotal == 0 ? 0 : (chsGreen * 100) / chsTotal;
    this.minPrepPercentage = Math.round(this.minPrepPercentage);
    this.advPrepPercentage = Math.round(this.advPrepPercentage);
    this.chsPrepPercentage = Math.round(this.chsPrepPercentage);
    if (minTotal == 0) {
      this.mpaStatusColor = 'grey';
      this.mpaStatusIcon = 'fa-times';
    }
    else {
      if (this.minPrepPercentage >= this.threshMinGreen) {
        this.mpaStatusColor = 'green';
        this.mpaStatusIcon = 'fa-check';
      }
      else if (this.minPrepPercentage >= this.threshMinAmber) {
        this.mpaStatusColor = 'orange';
        this.mpaStatusIcon = 'fa-ellipsis-h';
      }
      else {
        this.mpaStatusColor = 'red';
        this.mpaStatusIcon = 'fa-times';
      }
    }
    if (advTotal == 0) {
      this.apaStatusColor = 'grey';
      this.apaStatusIcon = 'fa-times';
    }
    else {
      if (this.advPrepPercentage >= this.threshAdvGreen) {
        this.apaStatusColor = 'green';
        this.apaStatusIcon = 'fa-check';
      }
      else if (this.advPrepPercentage >= this.threshAdvAmber) {
        this.apaStatusColor = 'orange';
        this.apaStatusIcon = 'fa-ellipsis-h';
      }
      else {
        this.apaStatusColor = 'red';
        this.apaStatusIcon = 'fa-times';
      }
    }
  }

  goToCHS() {
    if ((this.networkViewValues && this.networkModules[ModuleNameNetwork.CHSPreparednessActions].status) || !this.networkViewValues) {
      this.networkViewValues ? this.isLocalNetworkAdmin ? this.router.navigate(["/network/local-network-preparedness-mpa", Object.assign({}, {"isCHS": true}, this.networkViewValues)]) : this.router.navigate(["/network-country/network-country-mpa", Object.assign({}, {"isCHS": true}, this.networkViewValues)])
        :
        this.isLocalNetworkAdmin ? this.router.navigate(["/network/local-network-preparedness-mpa", {"isCHS": true}])
          :
          this.router.navigate(["/network-country/network-country-mpa", {"isCHS": true}]);
    }
  }

}
