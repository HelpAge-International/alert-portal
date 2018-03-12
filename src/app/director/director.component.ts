import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {SDepHolder, SuperMapComponents} from "../utils/MapHelper";
import {RegionHolder} from "../map/map-countries-list/map-countries-list.component";
import {Countries, UserType} from "../utils/Enums";
import {ActionsService} from "../services/actions.service";
import {AgencyService} from "../services/agency-service.service";
import {UserService} from "../services/user.service";
import {PageControlService} from "../services/pagecontrol.service";
import {TranslateService} from "@ngx-translate/core";
import {NetworkService} from "../services/network.service";

declare const jQuery: any;

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css'],
  providers: [ActionsService, AgencyService]
})

export class DirectorComponent implements OnInit, OnDestroy {

  private userType: UserType;
  private UserType = UserType;

  private loaderInactive: boolean = true;

  private uid: string;
  private agencyId: string;
  private agencyName: string = '';
  private systemAdminId: string;

  private actionsToday = [];
  private actionsThisWeek = [];
  private indicatorsToday = [];
  private indicatorsThisWeek = [];
  private approvalPlans = [];
  private approvalPlansNetwork = [];
  private approvalPlansNetworkLocal = [];
  private mapHelper: SuperMapComponents;
  private regions: RegionHolder[];
  private countries: SDepHolder[];

  // Regional Director
  private regionId: string;
  private regionName: string = '';
  private countriesInRegion: SDepHolder[] = [];
  private regionCountryOffice = [];
  private idsOfCountriesInRegion: string[];

  private directorName: string;
  private countryIdsForOther: Set<string> = new Set<string>();
  private allCountries: Set<string> = new Set<string>();
  private otherRegion: RegionHolder = RegionHolder.create("Other Countries", "unassigned");

  private userPaths = Constants.USER_PATHS;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryIds: string[] = [];
  private countryOffices = [];
  private regionalCountryOffices = [];
  private showCoCBanner: boolean;

  //phase 2 sprint 4 task
  @Input() agencyAdminIs:boolean


  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private actionService: ActionsService,
              private userService: UserService,
              private networkService: NetworkService,
              private translate: TranslateService) {
    this.mapHelper = SuperMapComponents.init(af, this.ngUnsubscribe);
    this.regions = [];
    this.countries = [];
    this.countriesInRegion = [];
    this.idsOfCountriesInRegion = [];
  }

  ngOnInit() {
    //clear data
    this.actionsToday = [];
    this.actionsThisWeek = [];
    this.indicatorsToday = [];
    this.indicatorsThisWeek = [];
    this.approvalPlans = [];
    this.approvalPlansNetwork = [];
    this.approvalPlansNetworkLocal = [];

    //set initial loader status
    this.loaderInactive = false;

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.userType = userType;
      this.agencyId = agencyId;
      this.systemAdminId = systemId;

      this.checkCoCUpdated();

      if (this.userType == UserType.RegionalDirector) {
        this.userService.getRegionId(Constants.USER_PATHS[userType], this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(regionId => {
            this.regionId = regionId;
            this.loadData();
          });
      } else {
        this.loadData();
      }
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

  planReview(planId, countryId) {
    this.router.navigate(["/dashboard/review-response-plan", {
      "id": planId,
      "countryId": countryId,
      "isDirector": true
    }]);
  }

  getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  getCountryCodeFromCountryId(countryId: number) {
    console.log("countryId - " + countryId);
    let location;
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(country => {
        if (country.location || country.location == 0) {
          location = country.location;
          return Countries[location];
        }
      });
  }

  getDirectorName(directorId) {

    this.directorName = "UNASSIGNED";
    if (directorId && directorId != "null") {
      this.userService.getUser(directorId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.directorName = user.firstName + " " + user.lastName;
        });
    }
    return this.directorName;
  }

  /**
   * Private functions
   */

  private loadData() {
    this.userService.getAllCountryOfficesForAgency(this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryOffices => {
        this.countryOffices = countryOffices;
        console.log(this.countryOffices)
        this.initData();
      });
  }

  // TODO - Filter for countries with regions
  // isValidAlertLevel(countryAlertLevel, selectedFilterLevel) {
  //
  //   console.log(countryAlertLevel.aletLevel);
  //   if (countryAlertLevel == selectedFilterLevel) {
  //     return true
  //   } else {
  //
  //   }
  // }

  private initData() {

    this.getAgencyName();

    this.getAllRegionsAndCountries().then(() => {

      //open region tab
      jQuery('#mapParent-' + this.regionId).collapse();

      if (this.userType != UserType.RegionalDirector) {
        this.countryOffices.forEach(countryOffice => {
          //normal
          this.actionService.getResponsePlanFoGlobalDirectorToApproval(countryOffice.$key, this.uid, this.agencyId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(plans => {
              this.approvalPlans = this.approvalPlans.concat(plans);
            });

          //for network
          this.networkService.getNetworksForCountry(this.agencyId, countryOffice.$key)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(networks => {
              console.log(networks);
              networks.forEach(id => {
                this.actionService.getResponsePlanFoGlobalDirectorToApproval(id, this.uid, this.agencyId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(plans => {
                    this.approvalPlansNetwork = this.approvalPlansNetwork.concat(plans);
                  });
              });
            });
        });

        //for local network
        this.networkService.getNetworksForAgency(this.agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(networks => {
            console.log(networks);
            networks.forEach(id => {
              this.actionService.getResponsePlanFoGlobalDirectorToApproval(id, this.uid, this.agencyId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(plans => {
                  this.approvalPlansNetworkLocal = this.approvalPlansNetworkLocal.concat(plans);
                });
            });
          });

      }

      this.regions.forEach(region => {
        jQuery('#mapParent-' + region.regionId).collapse();
        this.regionalCountryOffices[region.regionId] = this.countryOffices.filter(x => region.countries.has(x.$key));
      });

      console.log(this.regions)
      jQuery('#mapParent-' + this.otherRegion.regionId).collapse();
      // other regions
      this.regionalCountryOffices[this.otherRegion.regionId] = this.countryOffices.filter(x => this.otherRegion.countries.has(x.$key));

    });


    if (this.userType == UserType.RegionalDirector) {

      this.getCountryIdsForRegion().then(() => {

        this.idsOfCountriesInRegion.forEach(countryId => {

          this.actionService.getResponsePlanFoRegionalDirectorToApproval(countryId, this.uid, this.regionId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(plans => {
              this.approvalPlans = this.approvalPlans.concat(plans);
            });

          //for network
          this.networkService.getNetworksForCountry(this.agencyId, countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(networks => {
              console.log(networks);
              networks.forEach(id => {
                this.actionService.getResponsePlanFoRegionalDirectorToApproval(id, this.uid, this.regionId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(plans => {
                    this.approvalPlansNetwork = this.approvalPlansNetwork.concat(plans);
                  });
              });
            });
        });

        //for local network
        this.networkService.getNetworksForAgency(this.agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(networks => {
            console.log(networks);
            networks.forEach(id => {
              this.actionService.getResponsePlanFoRegionalDirectorToApproval(id, this.uid, this.regionId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(plans => {
                  this.approvalPlansNetworkLocal = this.approvalPlansNetworkLocal.concat(plans);
                });
            });
          });

        this.regionCountryOffice = this.countryOffices.filter(x => this.idsOfCountriesInRegion.includes(x.$key));

      }, error => {
        console.log(error.message);
      })
    }

    this.loaderInactive = true;
  }

  private getAgencyName() {
    if (this.agencyId) {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + '/name')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyName) => {
          this.agencyName = agencyName ? agencyName.$value : "Agency";
        });
    }
  }

  private getCountryIdsForRegion(): Promise<any> {

    let promise = new Promise((res, rej) => {

      if (this.agencyId && this.regionId) {
        this.af.database.object(Constants.APP_STATUS + "/region/" + this.agencyId + '/' + this.regionId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((region) => {

            this.regionName = region.name ? region.name : this.translate.instant("REGION");
            for (let country in region.countries) {
              this.idsOfCountriesInRegion.push(country);
            }
            res(true);
          });
      }

    });
    return promise;
  }

  private getAllRegionsAndCountries(): Promise<any> {
    console.log("called here%%%%%")
    let promise = new Promise((res, rej) => {
      this.otherRegion = new RegionHolder();
      this.otherRegion.regionId = "Unassigned";
      this.otherRegion.regionName = this.translate.instant("AGENCY_ADMIN.COUNTRY_OFFICES.OTHER_COUNTRIES");
      this.mapHelper.getRegionsForAgency(this.uid, this.userPaths[this.userType], (key, obj) => {
        let hRegion = new RegionHolder();
        hRegion.regionName = obj.name;
        hRegion.directorId = obj.directorId;
        hRegion.regionId = key;
        for (let x in obj.countries) {
          hRegion.countries.add(x);
          this.countryIdsForOther.add(x);
        }
        this.evaluateOthers();
        this.addOrUpdateRegion(hRegion);
      });

      this.mapHelper.initCountries(this.uid, this.userPaths[this.userType], (departments) => {
        this.allCountries.clear();
        for (let x of departments) {
          this.addOrUpdateCountry(x);
          this.allCountries.add(x.countryId);
        }
        this.evaluateOthers();

        res(true);
      });
    });

    return promise;

  }

  private evaluateOthers() {
    if (this.allCountries.size > 0) {
      this.allCountries.forEach(country => {
        if (!this.countryIdsForOther.has(country)) {
          this.otherRegion.countries.add(country);
        } else {
          this.otherRegion.countries.delete(country);
        }

      });
    }
  }

  private addOrUpdateCountry(holder: SDepHolder) {
    for (let x of this.countries) {
      if (x.countryId == holder.countryId) {
        x.location = holder.location;
        x.alertLevel = holder.alertLevel;
        x.departments = holder.departments;
        return;
      }
    }
    this.countries.push(holder);
    return;
  }

  private addOrUpdateRegion(holder: RegionHolder) {
    for (let x of this.regions) {
      if (x.regionId == holder.regionId) {
        x.regionName = holder.regionName;
        x.directorId = holder.directorId;
        x.countries = holder.countries;
        return;
      }
    }
    this.regions.push(holder);
    return;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
