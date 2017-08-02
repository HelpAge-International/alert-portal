import {Component, OnDestroy, OnInit} from "@angular/core";
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

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private actionService: ActionsService, private userService: UserService) {
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

    //set initial loader status
    this.loaderInactive = false;

    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.userType = userType;

      this.userService.getAgencyId(Constants.USER_PATHS[userType], this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencyId => {
          this.agencyId = agencyId;
          this.userService.getUserType(this.uid)
            .flatMap(userType => {
              return this.userService.getSystemAdminId(Constants.USER_PATHS[userType], this.uid);
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(systemAdminId => {
              this.systemAdminId = systemAdminId;
              this.loadData();
            });
        });
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

    this.directorName = "AGENCY_ADMIN.COUNTRY_OFFICES.UNASSIGNED";
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

    if (this.userType != UserType.RegionalDirector) {
      //for each country do following
      // this.actionService.getActionsDueInWeek(countryId, this.uid)
      //   .takeUntil(this.ngUnsubscribe)
      //   .subscribe(actions => {
      //     this.actionsToday = actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday).concat(this.actionsToday);
      //     this.actionsThisWeek = actions.filter(action => action.dueDate > endOfToday).concat(this.actionsThisWeek);
      //   });

      // this.actionService.getIndicatorsDueInWeek(countryId, this.uid)
      //   .takeUntil(this.ngUnsubscribe)
      //   .subscribe(indicators => {
      //     let dayIndicators = indicators.filter(indicator => indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday);
      //     let weekIndicators = indicators.filter(indicator => indicator.dueDate > endOfToday);
      //     if (dayIndicators.length > 0) {
      //       dayIndicators.forEach(indicator => {
      //         if (this.actionService.isExist(indicator.$key, this.indicatorsToday)) {
      //           let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsToday);
      //           if (index != -1) {
      //             this.indicatorsToday[index] = indicator;
      //           }
      //         } else {
      //           this.indicatorsToday.push(indicator);
      //         }
      //       });
      //     }
      //     if (weekIndicators.length > 0) {
      //       weekIndicators.forEach(indicator => {
      //         if (this.actionService.isExist(indicator.$key, this.indicatorsThisWeek)) {
      //           let index = this.actionService.indexOfItem(indicator.$key, this.indicatorsThisWeek);
      //           if (index != -1) {
      //             this.indicatorsThisWeek[index] = indicator;
      //           }
      //         } else {
      //           this.indicatorsThisWeek.push(indicator);
      //         }
      //       });
      //     }
      //   });


      this.getAllRegionsAndCountries().then(() => {
        this.countryOffices.forEach(countryOffice => {
          this.actionService.getResponsePlanFoGlobalDirectorToApproval(countryOffice.$key, this.uid, this.agencyId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(plans => {
              this.approvalPlans = this.approvalPlans.concat(plans);
            });
        })

        this.regions.forEach(region => {
          this.regionalCountryOffices[region.regionId] = this.countryOffices.filter(x => region.countries.has(x.$key));
        })

        // other regions
        this.regionalCountryOffices[this.otherRegion.regionId] = this.countryOffices.filter(x => this.otherRegion.countries.has(x.$key));
      });
    } else {
      this.getCountryIdsForRegion().then(() => {
        this.idsOfCountriesInRegion.forEach(countryId => {

          this.actionService.getResponsePlanFoRegionalDirectorToApproval(countryId, this.uid, this.regionId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(plans => {
              this.approvalPlans = this.approvalPlans.concat(plans);
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
      this.userService.getRegionId(this.userPaths[this.userType], this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(regionId => {
          this.regionId = regionId;

          if (this.agencyId && this.regionId) {
            this.af.database.object(Constants.APP_STATUS + "/region/" + this.agencyId + '/' + this.regionId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe((region) => {

                this.regionName = region.name ? region.name : "Region";
                for (let country in region.countries) {
                  this.idsOfCountriesInRegion.push(country);
                }
                res(true);
              });
          }
        });
    });
    return promise;
  }

  private getAllRegionsAndCountries(): Promise<any> {
    let promise = new Promise((res, rej) => {
      this.otherRegion = new RegionHolder();
      this.otherRegion.regionId = "Unassigned";
      this.otherRegion.regionName = "Other Countries";
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
    })

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
