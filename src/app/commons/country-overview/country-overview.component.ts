import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {
  ActionLevel, ActionType, AlertLevels, AlertStatus, ApprovalStatus, Countries, HazardScenario,
  Privacy
} from "../../utils/Enums";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {PrepActionService, PreparednessAction} from "../../services/prepactions.service";
import {AgencyService} from "../../services/agency-service.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {ModelAgencyPrivacy} from "../../model/agency-privacy.model";
import {SettingsService} from "../../services/settings.service";
import {NetworkService} from "../../services/network.service";
import {NetworkPrivacyModel} from "../../model/network-privacy.model";
import {CommonUtils} from "../../utils/CommonUtils";

declare var jQuery: any;

@Component({
  selector: 'app-country-overview',
  templateUrl: './country-overview.component.html',
  styleUrls: ['./country-overview.component.css'],
  providers: [SettingsService]
})
export class CountryOverviewComponent implements OnInit, OnDestroy {

  private Privacy = Privacy;

  private _agencyId: string;
  private _agencies: string;
  private _globalNetworks: string;
  private _systemId: string;
  private _userId: string;
  private _countryOfficeData: any;
  private _userType: number;
  // private privacyMap = new Map<string, ModelAgencyPrivacy>();
  private privacyMapCountry = new Map<string, ModelAgencyPrivacy>();
  private privacyMapNetworkCountry = new Map<string, NetworkPrivacyModel>();
  private _networkCountryData: any;
  private _localNetworks: any;


  @Input()
  set agencyId(agencyId: string) {
    this._agencyId = agencyId;
    // this._loadDataForNetworkCountries()
    this._loadData();
  }

  @Input()
  set agencies(agencies: any) {
    this._agencies = agencies;
    // this._loadDataForNetworkCountries()
    this._loadData();
  }

  @Input()
  set globalNetworks(globalNetworks: any) {
    this._globalNetworks = globalNetworks;
    this._loadData();
    // this._loadDataForNetworkCountries()
  }

  @Input()
  set localNetworks(localNetworks: any) {
    this._localNetworks = localNetworks;
    this._loadData();
    this._loadDataForLocalNetworks()
  }

  @Input()
  set systemId(systemId: string) {
    this._systemId = systemId;
    this._loadData();
    // this._loadDataForNetworkCountries()
  }

  @Input()
  set userId(userId: string) {
    this._userId = userId;
    this._loadData();
    // this._loadDataForNetworkCountries()
  }

  @Input()
  set userType(userType: number) {
    this._userType = userType;
    // this._loadDataForNetworkCountries()
    this._loadData();
  }

  @Input()
  set countryOfficeData(countryOfficeData: any) {

    this._countryOfficeData = countryOfficeData;
    // this._loadDataForNetworkCountries()
    this._loadData();
  }

  @Input()
  set networkCountryData(networkCountryData: any) {
    this._networkCountryData = networkCountryData;
    this._loadData();
    this._loadDataForNetworkCountries()
  }

  @Input() isDirector: boolean;
  @Input() agencyOverview: boolean = false;

  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertLevelsList: number[] = [AlertLevels.Green, AlertLevels.Amber, AlertLevels.Red];

  private countries = Constants.COUNTRIES;
  private filteredCountryOfficeData: any = [];
  private filteredNetworkCountryData: any = [];
  private filteredLocalNetworkData: any = [];
  protected CountriesEnum = Object.keys(Countries).map(k => Countries[k]).filter(v => typeof v === "string") as string[];

  private countResponsePlans: any = [];
  private percentageCHS: any = [];
  private chsPrepPercentage: any = [];

  private filter: any = 'all';

  private minTreshold: any = [];
  private advTreshold: any = [];

  private mpaStatusIcons: any = [];
  private mpaStatusColors: any = [];
  private advStatusIcons: any = [];
  private advStatusColors: any = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private prepActionService: PrepActionService[] = [];
  private hazardRedAlert: Map<HazardScenario, boolean>[] = [];

  private defaultAgencyLogo: string = 'assets/images/alert_logo--grey.svg';

  private date: number = new Date().getTime();
  private userCountryId: string;
  private userAgencyId: string;

  private withinNetworkMap = new Map<string, boolean>()

  constructor(private pageControl: PageControlService,
              private agencyService: AgencyService,
              private countryService: SettingsService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              protected _sanitizer: DomSanitizer,
              private userService: UserService,
              private networkService: NetworkService,
              private actionsService: ActionsService) {
  }

  ngOnInit() {

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.userCountryId = countryId;
      this.userAgencyId = agencyId;
      this._loadData();
      this._loadDataForNetworkCountries()
      this._loadDataForLocalNetworks()
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  filterAlertLevel(event: any) {
    this.filter = event.target.value;
    this.filteredCountryOfficeData = (!this.filter || this.filter == 'all') ? this._countryOfficeData : this._countryOfficeData.filter(x => x.alertLevel === +this.filter);
    this.filteredNetworkCountryData = (!this.filter || this.filter == 'all') ? this._networkCountryData : this._networkCountryData.filter(x => x.alertLevel === +this.filter);
    this.filteredLocalNetworkData = (!this.filter || this.filter == 'all') ? this._localNetworks : this._localNetworks.filter(x => x.alertLevel === +this.filter);
  }

  _loadData() {

    if (this._userId && this._userType && this._systemId && (this._agencyId || this._agencies) && this._countryOfficeData) {

      this._getSystemThreshold('minThreshold').then((minTreshold: any) => {
        this.minTreshold = minTreshold;

        this._getSystemThreshold('advThreshold').then((advTreshold: any) => {
          this.advTreshold = advTreshold;

          this._countryOfficeData.forEach(countryOffice => {
            if (!countryOffice.agencyId) {
              countryOffice.agencyId = this._agencyId;
            }

            this.prepActionService[countryOffice.$key] = new PrepActionService();
            this.hazardRedAlert[countryOffice.$key] = new Map<HazardScenario, boolean>();

            this._getResponsePlans(countryOffice);
            this._getAlertLevel(countryOffice).then(() => {
              this.prepActionService[countryOffice.$key].initActionsWithInfo(this.af, this.ngUnsubscribe, this._userId, this._userType, null, countryOffice.$key, countryOffice.agencyId, this._systemId);
              this.prepActionService[countryOffice.$key].addUpdater(() => {
                this.recalculateAll(countryOffice);
              });
            });

            // this.agencyService.getPrivacySettingForAgency(countryOffice.agencyId)
            //   .takeUntil(this.ngUnsubscribe)
            //   .subscribe((privacy: ModelAgencyPrivacy) => {
            //     this.privacyMap.set(countryOffice.agencyId, privacy);
            //   });

            this.countryService.getPrivacySettingForCountry(countryOffice.countryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe((privacy: ModelAgencyPrivacy) => {
                this.privacyMapCountry.set(countryOffice.countryId, privacy);
              });
          });

          this.filteredCountryOfficeData = this._countryOfficeData;
        });
      });
    }
  }

  _loadDataForNetworkCountries() {

    if (this._userId && this._userType && this._systemId && (this._agencyId || this._agencies) && this._networkCountryData) {

      this._getSystemThreshold('minThreshold').then((minTreshold: any) => {
        this.minTreshold = minTreshold;

        this._getSystemThreshold('advThreshold').then((advTreshold: any) => {
          this.advTreshold = advTreshold;

          this.networkService.mapNetworkWithCountryForCountry(this.userAgencyId, this.userCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(networkCountryMap => {

              let networkCountryIds = CommonUtils.convertMapToValuesInArray(networkCountryMap);

              this._networkCountryData.forEach(networkCountry => {

                if (!networkCountry.globalNetworkId) {
                  networkCountry.globalNetworkId = this._agencyId;
                }

                let networkCountryId = networkCountry.id ? networkCountry.id : networkCountry.$key
                let networkId = networkCountry.networkId ? networkCountry.networkId : networkCountry.globalNetworkId

                if (networkCountryIds.includes(networkCountryId)) {
                  this.withinNetworkMap.set(networkCountryId, true)
                } else {
                  this.withinNetworkMap.set(networkCountryId, false)
                }

                this.prepActionService[networkCountryId] = new PrepActionService();

                this.hazardRedAlert[networkCountryId] = new Map<HazardScenario, boolean>();
                this._getResponsePlansNetworkCountry(networkCountry);
                this._getAlertLevelNetworkCountry(networkCountry).then(() => {
                  this.prepActionService[networkCountryId].initActionsWithInfoNetwork(this.af, this.ngUnsubscribe, this._userId, null, networkCountryId, networkId, this._systemId);
                  this.prepActionService[networkCountryId].addUpdater(() => {
                    this.recalculateAllNetworkCountry(networkCountry);
                  });
                });

                this.networkService.getPrivacySettingForNetworkCountry(networkCountryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((privacy: NetworkPrivacyModel) => {
                    this.privacyMapNetworkCountry.set(networkCountryId, privacy);
                  });
              });
            })

          this.filteredNetworkCountryData = this._networkCountryData;
        });
      });
    }
  }

  _loadDataForLocalNetworks() {

    if (this._userId && this._userType && this._systemId && (this._agencyId || this._agencies) && this._localNetworks) {

      this._getSystemThreshold('minThreshold').then((minTreshold: any) => {
          this.minTreshold = minTreshold;

          this._getSystemThreshold('advThreshold').then((advTreshold: any) => {
            this.advTreshold = advTreshold;

            console.log(this._localNetworks)
            console.log(this.userAgencyId)
            console.log(this.userCountryId)

            this.networkService.getLocalNetworkModelsForCountry(this.userAgencyId, this.userCountryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(localNetworks => {
                console.log(localNetworks)

                this._localNetworks.forEach(network => {
                  if (localNetworks.map(localNetwork => localNetwork.id).includes(network.networkId)) {
                    this.withinNetworkMap.set(network.networkId, true)
                  } else {
                    this.withinNetworkMap.set(network.networkId, false)
                  }

                  this.prepActionService[network.networkId] = new PrepActionService();
                  this.hazardRedAlert[network.networkId] = new Map<HazardScenario, boolean>();
                  this._getResponsePlansLocalNetwork(network);
                  this._getAlertLevelLocalNetwork(network).then(() => {
                    this.prepActionService[network.networkId].initActionsWithInfoNetworkLocal(this.af, this.ngUnsubscribe, this._userId, null, network.networkId, this._systemId);
                    this.prepActionService[network.networkId].addUpdater(() => {
                      this.recalculateAllLocalNetwork(network);
                    });
                  });
                  this.networkService.getPrivacySettingForNetwork(network.networkId)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((privacy: NetworkPrivacyModel) => {
                      this.privacyMapNetworkCountry.set(network.networkId, privacy);
                    });
                })
              })

            this.filteredLocalNetworkData = this._localNetworks;
          });
        }
      );
    }
  }

  _getResponsePlans(countryOffice) {
    return new Promise((res,) => {
      this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryOffice.$key)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((responsePlans: any) => {
          this.countResponsePlans[countryOffice.$key] = 0;
          responsePlans.forEach(plan => {
            if (plan.status == ApprovalStatus.Approved && plan.isActive == true) {
              this.countResponsePlans[countryOffice.$key] = this.countResponsePlans[countryOffice.$key] + 1;
            }
          });

          res(true);
        });
    });
  }

  _getResponsePlansNetworkCountry(networkCountry) {
    let id = networkCountry.id ? networkCountry.id : networkCountry.$key
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlans: any) => {
        this.countResponsePlans[id] = 0;
        responsePlans.forEach(plan => {
          if (plan.status == ApprovalStatus.Approved && plan.isActive == true) {
            this.countResponsePlans[id] = this.countResponsePlans[id] + 1;
          }
        });
      });
  }

  _getResponsePlansLocalNetwork(localNetwork) {
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + localNetwork.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((responsePlans: any) => {
        this.countResponsePlans[localNetwork.networkId] = 0;
        responsePlans.forEach(plan => {
          if (plan.status == ApprovalStatus.Approved && plan.isActive == true) {
            this.countResponsePlans[localNetwork.networkId] = this.countResponsePlans[localNetwork.networkId] + 1;
          }
        });
      });
  }

  _getAlertLevel(countryOffice): Promise<any> {

    return new Promise((res,) => {
      countryOffice.alertLevel = AlertLevels.Green;
      this.actionsService.getAlerts(countryOffice.$key)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((alerts: ModelAlert[]) => {
          alerts.forEach(alert => {
            this.hazardRedAlert[countryOffice.$key].set(alert.hazardScenario, false);
            if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
              countryOffice.alertLevel = AlertLevels.Red;
              this.hazardRedAlert[countryOffice.$key].set(alert.hazardScenario, true);
            }
            if ((alert.alertLevel == AlertLevels.Amber && (alert.approvalStatus == AlertStatus.Approved || alert.approvalStatus == AlertStatus.Rejected))
              || (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.WaitingResponse)) {
              countryOffice.alertLevel = AlertLevels.Amber;
            }
          });
          res(true);
        });
    });

  }

  _getAlertLevelNetworkCountry(networkCountry): Promise<any> {

    return new Promise((res,) => {
      networkCountry.alertLevel = AlertLevels.Green;
      let id = networkCountry.id ? networkCountry.id : networkCountry.$key
      this.actionsService.getAlerts(id)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((alerts: ModelAlert[]) => {
          alerts.forEach(alert => {
            this.hazardRedAlert[id].set(alert.hazardScenario, false);
            if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
              networkCountry.alertLevel = AlertLevels.Red;
              this.hazardRedAlert[id].set(alert.hazardScenario, true);
            }
            if ((alert.alertLevel == AlertLevels.Amber && (alert.approvalStatus == AlertStatus.Approved || alert.approvalStatus == AlertStatus.Rejected))
              || (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.WaitingResponse)) {
              networkCountry.alertLevel = AlertLevels.Amber;
            }
          });
          res(true);
        });
    });

  }

  _getAlertLevelLocalNetwork(localNetwork): Promise<any> {

    return new Promise((res,) => {
      localNetwork.alertLevel = AlertLevels.Green;
      this.actionsService.getAlerts(localNetwork.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((alerts: ModelAlert[]) => {
          alerts.forEach(alert => {
            this.hazardRedAlert[localNetwork.networkId].set(alert.hazardScenario, false);
            if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
              localNetwork.alertLevel = AlertLevels.Red;
              this.hazardRedAlert[localNetwork.networkId].set(alert.hazardScenario, true);
            }
            if ((alert.alertLevel == AlertLevels.Amber && (alert.approvalStatus == AlertStatus.Approved || alert.approvalStatus == AlertStatus.Rejected))
              || (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.WaitingResponse)) {
              localNetwork.alertLevel = AlertLevels.Amber;
            }
          });
          res(true);
        });
    });

  }

  _getSystemThreshold(tresholdType: string) {
    return new Promise((res,) => {
      this.af.database.list(Constants.APP_STATUS + "/system/" + this._systemId + '/' + tresholdType)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((treshold: any) => {
          res(treshold);
        });
    });
  }

  recalculateAll(countryOffice) {
    let countryID = countryOffice.$key;
    let minTotal: number = 0;
    let minGreen: number = 0;
    let advTotal: number = 0;
    let advGreen: number = 0;
    let chsTotal: number = 0;
    let chsGreen: number = 0;

    let minPrepPercentage: number;
    let advPrepPercentage: number;


    for (let x of this.prepActionService[countryOffice.$key].actions) {
      if (x.level == ActionLevel.MPA) {
        if (!x.isArchived) {
          minTotal++;
          if (this.isActionCompleted(x, countryID)) {
            minGreen++;
          }
        }
      }
      else if (x.level == ActionLevel.APA) {
        if (!x.isArchived && x.isRedAlertActive(this.hazardRedAlert[countryID])) {
          advTotal++;
          if (this.isActionCompleted(x, countryID)) {
            advGreen++;
          }
        }
      }
      if (x.type == ActionType.chs) {
        if (!x.isArchived) {
          chsTotal++;
          if (this.isActionCompleted(x, countryID)) {
            chsGreen++;
          }
        }
      }
    }
    minPrepPercentage = minTotal == 0 ? 0 : (minGreen * 100) / minTotal;
    advPrepPercentage = advTotal == 0 ? 0 : (advGreen * 100) / advTotal;
    this.percentageCHS[countryID] = chsTotal == 0 ? 0 : (chsGreen * 100) / chsTotal;

    minPrepPercentage = Math.round(minPrepPercentage);
    advPrepPercentage = Math.round(advPrepPercentage);
    this.percentageCHS[countryID] = Math.round(this.percentageCHS[countryID]);

    if (minTotal == 0) {
      this.mpaStatusColors[countryID] = 'grey';
      this.mpaStatusIcons[countryID] = 'fa-times';
    }
    else {
      if (minPrepPercentage >= this.minTreshold[0].$value) {
        this.mpaStatusColors[countryID] = 'green';
        this.mpaStatusIcons[countryID] = 'fa-check';
      }
      else if (minPrepPercentage >= this.minTreshold[1].$value) {
        this.mpaStatusColors[countryID] = 'orange';
        this.mpaStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      else {
        this.mpaStatusColors[countryID] = 'red';
        this.mpaStatusIcons[countryID] = 'fa-times';
      }
    }
    if (advTotal == 0) {
      this.advStatusColors[countryID] = 'grey';
      this.advStatusIcons[countryID] = 'fa-times';
    }
    else {
      if (advPrepPercentage >= this.advTreshold[0].$value) {
        this.advStatusColors[countryID] = 'green';
        this.advStatusIcons[countryID] = 'fa-check';
      }
      else if (advPrepPercentage >= this.advTreshold[1].$value) {
        this.advStatusColors[countryID] = 'orange';
        this.advStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      else {
        this.advStatusColors[countryID] = 'red';
        this.advStatusIcons[countryID] = 'fa-times';
      }
    }
  }

  recalculateAllNetworkCountry(networkCountry) {
    let countryID = networkCountry.id ? networkCountry.id : networkCountry.$key;
    let minTotal: number = 0;
    let minGreen: number = 0;
    let advTotal: number = 0;
    let advGreen: number = 0;
    let chsTotal: number = 0;
    let chsGreen: number = 0;

    let minPrepPercentage: number;
    let advPrepPercentage: number;


    for (let x of this.prepActionService[countryID].actions) {
      if (x.level == ActionLevel.MPA) {
        if (!x.isArchived) {
          minTotal++;
          if (this.isActionCompleted(x, countryID)) {
            minGreen++;
          }
        }
      }
      else if (x.level == ActionLevel.APA) {
        if (!x.isArchived && x.isRedAlertActive(this.hazardRedAlert[countryID])) {
          advTotal++;
          if (this.isActionCompleted(x, countryID)) {
            advGreen++;
          }
        }
      }
      // if (x.type == ActionType.chs) {
      //   if (!x.isArchived) {
      //     chsTotal++;
      //     if (this.isActionCompleted(x, countryID)) {
      //       chsGreen++;
      //     }
      //   }
      // }
    }


    minPrepPercentage = minTotal == 0 ? 0 : (minGreen * 100) / minTotal;
    advPrepPercentage = advTotal == 0 ? 0 : (advGreen * 100) / advTotal;
    this.chsPrepPercentage[countryID] = chsTotal == 0 ? 0 : (chsGreen * 100) / chsTotal;

    minPrepPercentage = Math.round(minPrepPercentage);
    advPrepPercentage = Math.round(advPrepPercentage);
    this.chsPrepPercentage[countryID] = Math.round(this.chsPrepPercentage[countryID]);

    if (minTotal == 0) {
      this.mpaStatusColors[countryID] = 'grey';
      this.mpaStatusIcons[countryID] = 'fa-times';
    }
    else {
      if (minPrepPercentage >= this.minTreshold[0].$value) {
        this.mpaStatusColors[countryID] = 'green';
        this.mpaStatusIcons[countryID] = 'fa-check';
      }
      else if (minPrepPercentage >= this.minTreshold[1].$value) {
        this.mpaStatusColors[countryID] = 'orange';
        this.mpaStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      else {
        this.mpaStatusColors[countryID] = 'red';
        this.mpaStatusIcons[countryID] = 'fa-times';
      }
    }
    if (advTotal == 0) {
      this.advStatusColors[countryID] = 'grey';
      this.advStatusIcons[countryID] = 'fa-times';
    }
    else {
      if (advPrepPercentage >= this.advTreshold[0].$value) {
        this.advStatusColors[countryID] = 'green';
        this.advStatusIcons[countryID] = 'fa-check';
      }
      else if (advPrepPercentage >= this.advTreshold[1].$value) {
        this.advStatusColors[countryID] = 'orange';
        this.advStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      else {
        this.advStatusColors[countryID] = 'red';
        this.advStatusIcons[countryID] = 'fa-times';
      }
    }
  }

  recalculateAllLocalNetwork(localNetwork) {
    let countryID = localNetwork.networkId;
    console.log(countryID)
    let minTotal: number = 0;
    let minGreen: number = 0;
    let advTotal: number = 0;
    let advGreen: number = 0;
    let chsTotal: number = 0;
    let chsGreen: number = 0;

    let minPrepPercentage: number;
    let advPrepPercentage: number;


    for (let x of this.prepActionService[countryID].actions) {
      if (x.level == ActionLevel.MPA) {
        if (!x.isArchived) {
          minTotal++;
          if (this.isActionCompleted(x, countryID)) {
            minGreen++;
          }
        }
      }
      else if (x.level == ActionLevel.APA) {
        if (!x.isArchived && x.isRedAlertActive(this.hazardRedAlert[countryID])) {
          advTotal++;
          if (this.isActionCompleted(x, countryID)) {
            advGreen++;
          }
        }
      }
      // if (x.type == ActionType.chs) {
      //   if (!x.isArchived) {
      //     chsTotal++;
      //     if (this.isActionCompleted(x, countryID)) {
      //       chsGreen++;
      //     }
      //   }
      // }
    }


    minPrepPercentage = minTotal == 0 ? 0 : (minGreen * 100) / minTotal;
    advPrepPercentage = advTotal == 0 ? 0 : (advGreen * 100) / advTotal;
    this.chsPrepPercentage[countryID] = chsTotal == 0 ? 0 : (chsGreen * 100) / chsTotal;

    minPrepPercentage = Math.round(minPrepPercentage);
    advPrepPercentage = Math.round(advPrepPercentage);
    this.chsPrepPercentage[countryID] = Math.round(this.chsPrepPercentage[countryID]);

    if (minTotal == 0) {
      this.mpaStatusColors[countryID] = 'grey';
      this.mpaStatusIcons[countryID] = 'fa-times';
    }
    else {
      if (minPrepPercentage >= this.minTreshold[0].$value) {
        this.mpaStatusColors[countryID] = 'green';
        this.mpaStatusIcons[countryID] = 'fa-check';
      }
      else if (minPrepPercentage >= this.minTreshold[1].$value) {
        this.mpaStatusColors[countryID] = 'orange';
        this.mpaStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      else {
        this.mpaStatusColors[countryID] = 'red';
        this.mpaStatusIcons[countryID] = 'fa-times';
      }
    }
    if (advTotal == 0) {
      this.advStatusColors[countryID] = 'grey';
      this.advStatusIcons[countryID] = 'fa-times';
    }
    else {
      if (advPrepPercentage >= this.advTreshold[0].$value) {
        this.advStatusColors[countryID] = 'green';
        this.advStatusIcons[countryID] = 'fa-check';
      }
      else if (advPrepPercentage >= this.advTreshold[1].$value) {
        this.advStatusColors[countryID] = 'orange';
        this.advStatusIcons[countryID] = 'fa-ellipsis-h';
      }
      else {
        this.advStatusColors[countryID] = 'red';
        this.advStatusIcons[countryID] = 'fa-times';
      }
    }
  }

  isActionCompleted(action: PreparednessAction, countryID) {
    if (action.isArchived == true) {
      return false;
    }

    if (action.level == ActionLevel.APA) {
      if (action.isRedAlertActive(this.hazardRedAlert[countryID]) && action.isComplete != null) {
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

  getBackground(location) {
    if (location)
      return this._sanitizer.bypassSecurityTrustStyle('url(/assets/images/countries/' + this.CountriesEnum[location] + '.svg)');
  }

  overviewCountry(countryId, agencyId) {
    let data = {
      "countryId": countryId,
      "isViewing": true,
      "agencyId": agencyId,
      "systemId": this._systemId,
      "userType": this._userType,
      "uid": this._userId
    };
    if (this.isDirector) {
      this.router.navigate(["/director/director-overview", data]);
    } else {
      data["canCopy"] = true;
      if (this.agencyOverview) {
        data["agencyOverview"] = this.agencyOverview;
      }
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    }
  }

  overviewNetworkCountry(networkCountryId, networkId) {
    let data = {
      "countryId": this.userCountryId,
      "isViewing": true,
      "agencyId": this.userAgencyId,
      "systemId": this._systemId,
      "userType": this._userType,
      "uid": this._userId,
      "isViewingFromExternal": true,
      "networkId": networkId,
      "networkCountryId": networkCountryId
    };
    // this.router.navigate(["/dashboard/dashboard-overview", data]);
    if (this.isDirector) {
      this.router.navigate(["/director/director-overview", data]);
    } else {
      data["canCopy"] = true;
      if (this.agencyOverview) {
        data["agencyOverview"] = this.agencyOverview;
      }
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    }
  }

  overviewLocalNetwork(networkId) {
    let data = {
      "countryId": this.userCountryId,
      "isViewing": true,
      "agencyId": this.userAgencyId,
      "systemId": this._systemId,
      "userType": this._userType,
      "uid": this._userId,
      "isViewingFromExternal": true,
      "networkId": networkId
    };
    if (this.isDirector) {
      this.router.navigate(["/director/director-overview", data]);
    } else {
      data["canCopy"] = true;
      if (this.agencyOverview) {
        data["agencyOverview"] = this.agencyOverview;
      }
      this.router.navigate(["/dashboard/dashboard-overview", data]);
    }
  }

  getIcon(type, agencyId, countryId) {
    let label = "";
    let privacyCountry = this.privacyMapCountry.get(countryId);
    if (privacyCountry) {
      if (type == "plan" && privacyCountry.responsePlan == this.Privacy.Public || type == "chs" && privacyCountry.chs == this.Privacy.Public) {
        label = "blue";
      } else if (type == "plan" && privacyCountry.responsePlan == this.Privacy.Private || type == "chs" && privacyCountry.chs == this.Privacy.Private) {
        label = "grey";
      }
    }
    return label;
  }

  getIconNetwork(type, agencyId, countryId) {
    if (type === "chs") {
      return "grey"
    }
    let label = "";
    let privacyCountry = this.privacyMapNetworkCountry.get(countryId);
    if (privacyCountry) {
      if (type == "plan" && (privacyCountry.responsePlan == this.Privacy.Public || (privacyCountry.responsePlan == this.Privacy.Network && this.withinNetworkMap.get(countryId)))) {
        label = "blue";
      } else {
        label = "grey";
      }
    }
    return label;
  }

  getIconLocalNetwork(type, localNetworkId) {
    if (type === "chs") {
      return "grey"
    }
    let label = "";
    let privacyCountry = this.privacyMapNetworkCountry.get(localNetworkId);
    if (privacyCountry) {
      if (type == "plan" && (privacyCountry.responsePlan == this.Privacy.Public || (privacyCountry.responsePlan == this.Privacy.Network && this.withinNetworkMap.get(localNetworkId)))) {
        label = "blue";
      } else {
        label = "grey";
      }
    }
    return label;
  }

  getActionIcon(isMpa, agencyId, countryId, stdColor) {
    let label = "";
    let privacyCountry = this.privacyMapCountry.get(countryId);
    if (privacyCountry) {
      if (isMpa && privacyCountry.mpa == this.Privacy.Public || !isMpa && privacyCountry.apa == this.Privacy.Public) {
        label = stdColor;
      } else if (isMpa && privacyCountry.mpa == this.Privacy.Private || !isMpa && privacyCountry.apa == this.Privacy.Private) {
        label = "grey";
      }
    }
    return label;
  }

  getActionIconNetwork(isMpa, networkId, networkCountryId, stdColor) {
    let label = "";
    let privacyCountry = this.privacyMapNetworkCountry.get(networkCountryId);
    if (privacyCountry) {
      if (isMpa && privacyCountry.mpa == this.Privacy.Public ||
        !isMpa && privacyCountry.apa == this.Privacy.Public ||
        (isMpa && privacyCountry.mpa == this.Privacy.Network && this.withinNetworkMap.get(networkCountryId)) ||
        (!isMpa && privacyCountry.apa == this.Privacy.Network && this.withinNetworkMap.get(networkCountryId))) {
        label = stdColor;
      } else {
        label = "grey";
      }
    }
    return label;
  }

  getActionIconLocalNetwork(isMpa, networkId, stdColor) {
    let label = "";
    let privacyCountry = this.privacyMapNetworkCountry.get(networkId);
    if (privacyCountry) {
      if (isMpa && privacyCountry.mpa == this.Privacy.Public ||
        !isMpa && privacyCountry.apa == this.Privacy.Public ||
        (isMpa && privacyCountry.mpa == this.Privacy.Network && this.withinNetworkMap.get(networkId)) ||
        (!isMpa && privacyCountry.apa == this.Privacy.Network && this.withinNetworkMap.get(networkId))) {
        label = stdColor;
      } else {
        label = "grey";
      }
    }
    return label;
  }


}
