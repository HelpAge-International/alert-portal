import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Countries, PermissionsAgency, Privacy} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AgencyService} from "../../services/agency-service.service";
import {ModelAgencyPrivacy} from "../../model/agency-privacy.model";
import {AgencyPermissionObject, PageControlService} from "../../services/pagecontrol.service";
import {SettingsService} from "../../services/settings.service";
import {NetworkService} from "../../services/network.service";
import {NetworkPrivacyModel} from "../../model/network-privacy.model";
import {CommonUtils} from "../../utils/CommonUtils";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'app-view-country-menu',
  templateUrl: './view-country-menu.component.html',
  styleUrls: ['./view-country-menu.component.css'],
  providers: [AgencyService, SettingsService]
})
export class ViewCountryMenuComponent implements OnInit, OnDestroy {

  private CountryNames = Constants.COUNTRIES;
  private Privacy = Privacy;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Output() onMenuSelected = new EventEmitter<string>();

  private menuSelected = "officeProfile";
  private menuMap = new Map<string, boolean>();
  private agencyId: string;
  private countryId: string;
  private countryLocation: number = -1;
  private privacy: any;
  private userAgencyId: string;
  private networkId: string;
  private networkCountryId: string;
  private isViewingFromExternal: boolean;
  private withinNetwork: boolean;
  private userCountryId: string;

  public permMinimumPreparedness = false;
  public permAdvancedPreparedness = false;
  public permCHSPreparedness = false;
  public permRiskMonitoring = false;
  public permCountryOffice = false;
  public permResponsePlanning = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private af: AngularFire,
              private userService: UserService,
              private pageControl: PageControlService,
              private countryService: SettingsService,
              private networkService: NetworkService,
              private agencyService: AgencyService) {
    this.menuMap.set("officeProfile", false);
    this.menuMap.set("risk", false);
    this.menuMap.set("preparedness", false);
    this.menuMap.set("plan", false);
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.userAgencyId = agencyId;
      this.userCountryId = countryId;

      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["from"]) {
            this.handleActiveClass(params["from"])
          } else {
            this.handleActiveClass("officeProfile");
          }
          if (params["agencyId"]) {
            this.agencyId = params["agencyId"];
          }
          if (params["countryId"]) {
            this.countryId = params["countryId"];
          }
          if (params["networkId"]) {
            this.networkId = params["networkId"];
          }
          if (params["networkCountryId"]) {
            this.networkCountryId = params["networkCountryId"];
          }
          if (params["isViewingFromExternal"]) {
            this.isViewingFromExternal = params["isViewingFromExternal"];
          }

          PageControlService.agencyModuleListMatrix(this.af, this.ngUnsubscribe, this.agencyId, (list: AgencyPermissionObject[]) => {
            for (const value of list) {
              console.log(list)
              if (value.permission === PermissionsAgency.MinimumPreparedness) {
                this.permMinimumPreparedness = !value.isAuthorized;
              }
              if (value.permission === PermissionsAgency.AdvancedPreparedness) {
                this.permAdvancedPreparedness = !value.isAuthorized;
              }
              if (value.permission === PermissionsAgency.RiskMonitoring) {
                this.permRiskMonitoring = !value.isAuthorized;
              }
              if (value.permission === PermissionsAgency.CountryOffice) {
                this.permCountryOffice = !value.isAuthorized;
              }
              if (value.permission === PermissionsAgency.ResponsePlanning) {
                this.permResponsePlanning = !value.isAuthorized;
              }
              PageControlService.agencySelfCheck(userType, this.route, this.router, value);
            }
          });

          this.networkService.mapNetworkWithCountryForCountry(this.userAgencyId, this.userCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(networkCountryMap => {
              let networkCountryIds = CommonUtils.convertMapToValuesInArray(networkCountryMap);
              this.withinNetwork = networkCountryIds.includes(this.networkCountryId)

              if (this.agencyId && this.countryId && !this.isViewingFromExternal) {
                this.loadCountry(this.agencyId, this.countryId);
                this.countryService.getPrivacySettingForCountry(this.countryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(privacy => {
                    this.privacy = privacy;
                    this.updateMainMenu(this.privacy);
                  });

              } else if (this.networkId && this.networkCountryId && this.isViewingFromExternal) {
                this.loadNetworkCountry(this.networkId, this.networkCountryId)
                this.networkService.getPrivacySettingForNetworkCountry(this.networkCountryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(privacy => {
                    this.privacy = privacy
                    this.updateMainMenuNetwork(this.privacy)
                  })
              } else if (this.networkId && !this.networkCountryId && this.isViewingFromExternal) {
                this.loadNetwork(this.networkId)
                this.networkService.getPrivacySettingForNetwork(this.networkId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(privacy => {
                    this.privacy = privacy
                    this.updateMainMenuNetwork(this.privacy)
                  })
                this.networkService.getLocalNetworkModelsForCountry(this.userAgencyId, this.userCountryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(localNetworks =>{
                    this.withinNetwork = localNetworks.map(network => network.id).includes(this.networkId)
                  })
              }

            })

          // if (this.agencyId && this.countryId && !this.isViewingFromExternal) {
          //   this.networkService.mapNetworkWithCountryForCountry(this.userAgencyId, this.userCountryId)
          //     .takeUntil(this.ngUnsubscribe)
          //     .subscribe(networkCountryMap => {
          //       let networkCountryIds = CommonUtils.convertMapToValuesInArray(networkCountryMap);
          //       this.withinNetwork = networkCountryIds.includes(this.networkCountryId)
          //       this.loadCountry(this.agencyId, this.countryId);
          //
          //       this.countryService.getPrivacySettingForCountry(this.countryId)
          //         .takeUntil(this.ngUnsubscribe)
          //         .subscribe(privacy => {
          //           this.privacy = privacy;
          //           this.updateMainMenu(this.privacy);
          //         });
          //     })
          //
          // } else if (this.networkId && this.networkCountryId && this.isViewingFromExternal) {
          //   this.loadNetworkCountry(this.networkId, this.networkCountryId)
          //   this.networkService.getPrivacySettingForNetworkCountry(this.networkCountryId)
          //     .takeUntil(this.ngUnsubscribe)
          //     .subscribe(privacy => {
          //       this.privacy = privacy
          //       this.updateMainMenuNetwork(this.privacy)
          //     })
          // }

        });

    });
  }

  private updateMainMenu(privacy: ModelAgencyPrivacy) {
    if (this.userAgencyId == this.agencyId) {
      this.handleActiveClass("officeProfile");
    } else {
      if (privacy.officeProfile != Privacy.Public) {
        if (privacy.riskMonitoring == Privacy.Public) {
          this.handleActiveClass("risk");
        } else if (privacy.mpa == Privacy.Public || privacy.apa == Privacy.Public) {
          this.handleActiveClass("preparedness");
        } else if (privacy.responsePlan == Privacy.Public) {
          this.handleActiveClass("plan");
        } else {
          this.handleActiveClass("");
        }
      } else {
        this.handleActiveClass("officeProfile");
      }
    }
  }

  private updateMainMenuNetwork(privacy: NetworkPrivacyModel) {
    if (privacy.officeProfile == Privacy.Public || (privacy.officeProfile == Privacy.Network && this.withinNetwork)) {
      this.handleActiveClass("officeProfile");
    } else {
      if (privacy.riskMonitoring == Privacy.Public || (privacy.riskMonitoring == Privacy.Network && this.withinNetwork)) {
        this.handleActiveClass("risk");
      } else if (privacy.mpa == Privacy.Public || privacy.apa == Privacy.Public || (privacy.mpa == Privacy.Network && this.withinNetwork) || (privacy.apa == Privacy.Network && this.withinNetwork)) {
        if (privacy.mpa == Privacy.Public || (privacy.mpa == Privacy.Network && this.withinNetwork)) {
          this.handleActiveClass("preparedness-min");
        } else {
          this.handleActiveClass("preparedness-adv");
        }
      } else if (privacy.responsePlan == Privacy.Public || (privacy.responsePlan == Privacy.Network && this.withinNetwork)) {
        this.handleActiveClass("plan");
      } else {
        this.handleActiveClass("")
      }
    }
  }

  private loadCountry(agencyId: string, countryId: string) {
    this.userService.getCountryDetail(countryId, agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(country => {
        this.countryLocation = country.location;
      });
  }

  private loadNetworkCountry(networkId: string, networkCountryId: string) {
    this.networkService.getNetworkCountry(networkId, networkCountryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkCountry => {
        this.countryLocation = networkCountry.location
      })
  }

  private loadNetwork(networkId: string) {
    this.networkService.getLocalNetwork(networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(localNetwork => {
        this.countryLocation = localNetwork.countryCode
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private handleActiveClass(name: string) {
    this.menuMap.forEach((v, k) => {
      this.menuMap.set(k, k === name);
    });
  }

  menuSelection(menu: string) {
    this.onMenuSelected.emit(menu);
    this.menuSelected = menu;
    this.handleActiveClass(menu);
  }

  getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }
}
