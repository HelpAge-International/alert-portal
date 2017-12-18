import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {
  ActionLevel,
  ActionType,
  AlertLevels,
  AlertStatus,
  ApprovalStatus,
  Countries,
  HazardScenario, Privacy
} from "../../utils/Enums";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {PrepActionService, PreparednessAction} from "../../services/prepactions.service";
import {AgencyService} from "../../services/agency-service.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {ModelAgencyPrivacy} from "../../model/agency-privacy.model";
import {SettingsService} from "../../services/settings.service";

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
  private _networkCountryData: any;


  @Input()
  set agencyId(agencyId: string) {
    this._agencyId = agencyId;
    this._loadDataForNetworkCountries()
    this._loadData();
  }

  @Input()
  set agencies(agencies: any) {
    this._agencies = agencies;
    this._loadDataForNetworkCountries()
    this._loadData();
  }

  @Input()
  set globalNetworks(globalNetworks: any) {
    this._globalNetworks = globalNetworks;
    this._loadData();
  }

  @Input()
  set systemId(systemId: string) {
    this._systemId = systemId;
    this._loadData();
  }

  @Input()
  set userId(userId: string) {
    this._userId = userId;
    this._loadData();
  }

  @Input()
  set userType(userType: number) {
    this._userType = userType;
    this._loadDataForNetworkCountries()
    this._loadData();
  }

  @Input()
  set countryOfficeData(countryOfficeData: any) {

    this._countryOfficeData = countryOfficeData;
    this._loadDataForNetworkCountries()
    this._loadData();
  }

  @Input()
  set networkCountryData(networkCountryData: any) {

    this._networkCountryData = networkCountryData;
    this._loadDataForNetworkCountries()
    this._loadData();
  }

  @Input() isDirector: boolean;
  @Input() agencyOverview: boolean = false;

  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertLevelsList: number[] = [AlertLevels.Green, AlertLevels.Amber, AlertLevels.Red];

  private countries = Constants.COUNTRIES;
  private filteredCountryOfficeData: any = [];
  private filteredNetworkCountryData: any = [];
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
  private userAgencyId: string;

  constructor(private pageControl: PageControlService,
              private agencyService: AgencyService,
              private countryService: SettingsService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              protected _sanitizer: DomSanitizer,
              private userService: UserService,
              private actionsService: ActionsService) {
  }

  ngOnInit() {

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.userAgencyId = agencyId;
      this._loadData();
      this._loadDataForNetworkCountries()
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  filterAlertLevel(event: any) {
    this.filter = event.target.value;
    this.filteredCountryOfficeData = (!this.filter || this.filter == 'all') ? this._countryOfficeData : this._countryOfficeData.filter(x => x.alertLevel === +this.filter);
  }

  _loadData() {

    if (this._userId && this._userType && this._systemId && (this._agencyId || this._agencies) && this._networkCountryData) {

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

  _loadDataForNetworkCountries(){
  //function not finished.
    if (this._userId && this._userType && this._systemId && (this._agencyId || this._agencies) && this._countryOfficeData) {

      this._getSystemThreshold('minThreshold').then((minTreshold: any) => {
        this.minTreshold = minTreshold;

        this._getSystemThreshold('advThreshold').then((advTreshold: any) => {
          this.advTreshold = advTreshold;

          this._networkCountryData.forEach(networkCountry => {
            if (!networkCountry.globalNetworkId) {
              networkCountry.globalNetworkId = this._agencyId;
            }

            this.prepActionService[networkCountry.$key] = new PrepActionService();
            this.hazardRedAlert[networkCountry.$key] = new Map<HazardScenario, boolean>();

            this._getResponsePlansNetworkCountry(networkCountry);
            this._getAlertLevelNetworkCountry(networkCountry).then(() => {
              this.prepActionService[networkCountry.$key].initActionsWithInfoNetwork(this.af, this.ngUnsubscribe, this._userId, null, networkCountry.$key, networkCountry.globalNetworkId, this._systemId);
              this.prepActionService[networkCountry.$key].addUpdater(() => {
                this.recalculateAll(networkCountry);
              });
            });
          //
          //   // this.agencyService.getPrivacySettingForAgency(countryOffice.agencyId)
          //   //   .takeUntil(this.ngUnsubscribe)
          //   //   .subscribe((privacy: ModelAgencyPrivacy) => {
          //   //     this.privacyMap.set(countryOffice.agencyId, privacy);
          //   //   });
          //
          //   this.countryService.getPrivacySettingForCountry(countryOffice.countryId)
          //     .takeUntil(this.ngUnsubscribe)
          //     .subscribe((privacy: ModelAgencyPrivacy) => {
          //       this.privacyMapCountry.set(countryOffice.countryId, privacy);
          //     });
          });
          //
          this.filteredNetworkCountryData = this._networkCountryData;
        });
      });
    }
  }

  _getResponsePlans(countryOffice) {
    let promise = new Promise((res, rej) => {
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
    return promise;
  }

  _getResponsePlansNetworkCountry(networkCountry) {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + networkCountry.$key)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((responsePlans: any) => {
          this.countResponsePlans[networkCountry.$key] = 0;
          responsePlans.forEach(plan => {
            if (plan.status == ApprovalStatus.Approved && plan.isActive == true) {
              this.countResponsePlans[networkCountry.$key] = this.countResponsePlans[networkCountry.$key] + 1;
            }
          });

          res(true);
        });
    });
    return promise;
  }

  _getAlertLevel(countryOffice): Promise<any> {

    let promise = new Promise((res, rej) => {
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

    return promise;

  }

  _getAlertLevelNetworkCountry(networkCountry): Promise<any> {

    let promise = new Promise((res, rej) => {
      networkCountry.alertLevel = AlertLevels.Green;
      this.actionsService.getAlerts(networkCountry.$key)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((alerts: ModelAlert[]) => {
          alerts.forEach(alert => {
            this.hazardRedAlert[networkCountry.$key].set(alert.hazardScenario, false);
            if (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.Approved) {
              networkCountry.alertLevel = AlertLevels.Red;
              this.hazardRedAlert[networkCountry.$key].set(alert.hazardScenario, true);
            }
            if ((alert.alertLevel == AlertLevels.Amber && (alert.approvalStatus == AlertStatus.Approved || alert.approvalStatus == AlertStatus.Rejected))
              || (alert.alertLevel == AlertLevels.Red && alert.approvalStatus == AlertStatus.WaitingResponse)) {
              networkCountry.alertLevel = AlertLevels.Amber;
            }
          });
          res(true);
        });
    });

    return promise;

  }

  _getSystemThreshold(tresholdType: string) {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/system/" + this._systemId + '/' + tresholdType)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((treshold: any) => {
          res(treshold);
        });
    });
    return promise;
  }

  private recalculateAll(countryOffice) {
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

  private recalculateAllNetworkCountry(networkCountry) {
    let countryID = networkCountry.$key;
    let minTotal: number = 0;
    let minGreen: number = 0;
    let advTotal: number = 0;
    let advGreen: number = 0;
    let chsTotal: number = 0;
    let chsGreen: number = 0;

    let minPrepPercentage: number;
    let advPrepPercentage: number;


    for (let x of this.prepActionService[networkCountry.$key].actions) {
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

  private isActionCompleted(action: PreparednessAction, countryID) {
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  protected getBackground(location) {
    if (location)
      return this._sanitizer.bypassSecurityTrustStyle('url(/assets/images/countries/' + this.CountriesEnum[location] + '.svg)');
  }

  overviewCountry(countryId, agencyId) {
    let data = {
      "countryId": countryId,
      "isViewing": true,
      "agencyId": agencyId,
      "systemId": this._systemId,
      "userType": this._userType
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


}
