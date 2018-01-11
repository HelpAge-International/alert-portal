import {Component, OnDestroy, OnInit} from '@angular/core';
import {Constants} from "../../utils/Constants";
import {Subject} from "rxjs/Subject";
import {AlertLevels, AlertMessageType, AlertStatus, Privacy, UserType} from "../../utils/Enums";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ActionsService} from "../../services/actions.service";
import {HazardImages} from "../../utils/HazardImages";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AgencyService} from "../../services/agency-service.service";
import {ModelAgencyPrivacy} from "../../model/agency-privacy.model";
import {PageControlService} from "../../services/pagecontrol.service";
import {SettingsService} from "../../services/settings.service";
import {Location} from "@angular/common";
import {NetworkPrivacyModel} from "../../model/network-privacy.model";
import {NetworkService} from "../../services/network.service";
import {CommonUtils} from "../../utils/CommonUtils";

declare var jQuery: any;

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css'],
  providers: [ActionsService, SettingsService]
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {

  private AlertLevels = AlertLevels;
  private AlertStatus = AlertStatus;
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private UserType = UserType;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private menuTab = "officeProfile";
  private tabMap = new Map<string, boolean>();
  private officeMap = new Map<string, boolean>();

  private countryId: string;
  private isViewing: boolean;
  private agencyId: string;
  private systemId: string;
  private from: string;
  private agencyName: string;
  private agencyOverview: boolean;
  private officeTarget: string;
  private alerts: Observable<any>;
  private areaContent: any;
  private canCopy: boolean;
  private userType: number;
  private affectedAreasToShow: any [];
  private privacy: ModelAgencyPrivacy;
  private privacyNetwork: NetworkPrivacyModel;
  private userAgencyId: string;
  private userCountryId: string;
  private isViewingFromExternal: boolean;
  private networkId: string;
  private networkCountryId: string;
  private withinNetwork: boolean;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private pageControl: PageControlService,
              private alertService: ActionsService,
              private agencyService: AgencyService,
              private countryService: SettingsService,
              private networkService: NetworkService,
              private location: Location,
              private router: Router) {
    this.initMainMenu();
    this.initOfficeSubMenu();
  }

  private initMainMenu() {
    this.tabMap.set("officeProfile", false);
    this.tabMap.set("risk", false);
    this.tabMap.set("preparedness-min", false);
    this.tabMap.set("preparedness-adv", false);
    this.tabMap.set("preparedness-budget", false);
    this.tabMap.set("plan", false);
  }

  private initOfficeSubMenu() {
    this.officeMap.set("programme", true);
    this.officeMap.set("officeCapacity", false);
    this.officeMap.set("partners", false);
    this.officeMap.set("equipment", false);
    this.officeMap.set("coordination", false);
    this.officeMap.set("stockCapacity", false);
    this.officeMap.set("documents", false);
    this.officeMap.set("contacts", false);
  }


  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.userAgencyId = agencyId;
      this.userCountryId = countryId

      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["countryId"]) {
            this.countryId = params["countryId"];
          }
          if (params["agencyId"]) {
            this.agencyId = params["agencyId"];
            this.getAgencyInfo(this.agencyId);
          }
          if (params["systemId"]) {
            this.systemId = params["systemId"];
          }
          if (params["isViewing"]) {
            this.isViewing = params["isViewing"];
          }
          if (params["from"]) {
            this.from = params["from"];
            this.menuSelection(this.from);
          }
          if (params["officeTarget"]) {
            this.officeTarget = params["officeTarget"];
            this.handleOfficeSubMenu();
          }
          if (params["canCopy"]) {
            this.canCopy = params["canCopy"];
          }
          if (params["agencyOverview"]) {
            this.agencyOverview = params["agencyOverview"];
            console.log(this.agencyOverview);
          }
          if (params["userType"]) {
            this.userType = params["userType"];
          }
          if (params["isViewingFromExternal"]) {
            this.isViewingFromExternal = params["isViewingFromExternal"];
          }
          if (params["networkId"]) {
            this.networkId = params["networkId"];
          }
          if (params["networkCountryId"]) {
            this.networkCountryId = params["networkCountryId"];
          }

          //kick out to login if path not match
          if (!this.countryId && !this.agencyId && !this.systemId && !this.isViewing) {
            console.log('navigating to dashboard')
            this.router.navigateByUrl("/dashboard").then(() => {
              console.log("Invalid url parameters!!");
            }, error => {
              console.log(error.message);
            });
          }

          //handle privacy settings
          if (this.isViewingFromExternal) {
            console.log("isViewingFromExternal")
            console.log(this.networkCountryId)
            this.networkService.mapNetworkWithCountryForCountry(this.userAgencyId, this.userCountryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(networkCountryMap => {
                let networkCountryIds = CommonUtils.convertMapToValuesInArray(networkCountryMap);
                this.withinNetwork = networkCountryIds.includes(this.networkCountryId)

                this.networkService.getPrivacySettingForNetworkCountry(this.networkCountryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(privacy => {
                    this.privacyNetwork = privacy
                    this.updateMainMenuNetwork(this.privacyNetwork)
                  })
              })
          } else {
            this.countryService.getPrivacySettingForCountry(this.countryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(privacy => {
                this.privacy = privacy;
                this.updateMainMenu(this.privacy);
              });
          }

          this.getAlerts();

        });

    });
  }

  private updateMainMenu(privacy: ModelAgencyPrivacy) {
    if (this.agencyId == this.userAgencyId) {
      this.handleMainMenu("officeProfile");
    } else {
      if (privacy.officeProfile != Privacy.Public) {
        if (privacy.riskMonitoring == Privacy.Public) {
          this.handleMainMenu("risk");
        } else if (privacy.mpa == Privacy.Public || privacy.apa == Privacy.Public) {
          if (privacy.mpa == Privacy.Public) {
            this.handleMainMenu("preparedness-min");
          } else {
            this.handleMainMenu("preparedness-adv");
          }
        } else if (privacy.responsePlan == Privacy.Public) {
          this.handleMainMenu("plan");
        } else {
          this.tabMap.forEach((v, k) => {
            this.tabMap.set(k, false);
          });
        }
      } else {
        this.handleMainMenu("officeProfile");
      }
    }
  }

  private updateMainMenuNetwork(privacy: NetworkPrivacyModel) {
    if (privacy.officeProfile == Privacy.Public || (privacy.officeProfile == Privacy.Network && this.withinNetwork)) {
      this.handleMainMenu("officeProfile");
    } else {
      if (privacy.riskMonitoring == Privacy.Public || (privacy.riskMonitoring == Privacy.Network && this.withinNetwork)) {
        this.handleMainMenu("risk");
      } else if (privacy.mpa == Privacy.Public || privacy.apa == Privacy.Public || (privacy.mpa == Privacy.Network && this.withinNetwork) || (privacy.apa == Privacy.Network && this.withinNetwork)) {
        if (privacy.mpa == Privacy.Public || (privacy.mpa == Privacy.Network && this.withinNetwork)) {
          this.handleMainMenu("preparedness-min");
        } else {
          this.handleMainMenu("preparedness-adv");
        }
      } else if (privacy.responsePlan == Privacy.Public || (privacy.responsePlan == Privacy.Network && this.withinNetwork)) {
        this.handleMainMenu("plan");
      } else {
        this.tabMap.forEach((v, k) => {
          this.tabMap.set(k, false);
        });
      }
    }
  }

  private handleMainMenu(key) {
    this.tabMap.forEach((v, k) => {
      this.tabMap.set(k, key == k);
    });
  }

  showAffectedAreasForAlert(affectedAreas) {
    this.affectedAreasToShow = affectedAreas;
    jQuery("#view-areas").modal("show");
  }

  private getAlerts() {
    let id = this.isViewingFromExternal ? this.networkCountryId : this.countryId
    this.alerts = this.alertService.getAlerts(id)
      .map(alerts => {
        let alertList = [];
        console.log(alerts)
        alerts.forEach(alert => {
            alertList.push(alert);
        });
        return alertList;
      });
  }

  private handleOfficeSubMenu() {
    this.officeMap.forEach((v, k) => {
      this.officeMap.set(k, k == this.officeTarget);
    });
  }

  private getAgencyInfo(agencyId: string) {
    this.userService.getAgencyDetail(agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agency => {
        this.agencyName = agency.name;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  backForDonor() {
    this.location.back();
  }

  menuSelection(menuName: string) {
    console.log(menuName);
    this.tabMap.forEach((v, k) => {
      this.tabMap.set(k, k == menuName);
    });
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

}
