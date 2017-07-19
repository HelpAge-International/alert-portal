import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {SuperMapComponents, SDepHolder} from "../../utils/MapHelper";
import {RegionHolder} from "../../map/map-countries-list/map-countries-list.component";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Countries, AlertLevels} from "../../utils/Enums";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {HazardImages} from "../../utils/HazardImages";

@Component({
  selector: 'app-donor-list-view',
  templateUrl: './donor-list-view.component.html',
  styleUrls: ['./donor-list-view.component.css']
})

export class DonorListViewComponent implements OnInit, OnDestroy {
  private displayCountries: number[] = [];
  private hazardMap = new Map<number, Set<number>>();
  private countryLocationMap = new Map<string, number>();
  private countryAgencyRefMap = new Map<number, any>();
  private HazardScenario = Constants.HAZARD_SCENARIOS;

  private loaderInactive: boolean;

  private uid: string;
  private agencyId: string;
  private agencyName: string = '';
  private systemAdminId: string;

  private mapHelper: SuperMapComponents;
  private regions: RegionHolder[];
  private countries: SDepHolder[];

  private directorName: string;
  private countryIdsForOther: Set<string> = new Set<string>();
  private allCountries: Set<string> = new Set<string>();
  private otherRegion: RegionHolder = RegionHolder.create("Other Countries", "unassigned");

  private AlertLevels = AlertLevels;
  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertLevelsList: number[] = Constants.ALERT_LEVELS_LIST;

  private overallAlertLevels: any = [];
  private alertLevelColours: any = [];
  private countResponsePlans: any = [];
  private count: number = 0;
  private minTreshold: any = [];
  private advTreshold: any = [];
  private mpaStatusIcons: any = [];
  private mpaStatusColors: any = [];
  private advStatusIcons: any = [];
  private advStatusColors: any = [];
  private percentageCHS: any = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private countryIds: string[] = [];

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService) {
    this.mapHelper = SuperMapComponents.init(af, this.ngUnsubscribe);
    this.regions = [];
    this.countries = [];
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.systemAdminId = systemId;
      this.loadData();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToCountryIndex(countryId) {
    this.router.navigate(['/donor-module/donor-country-index', {countryId: countryId, agencyId: this.agencyId}]);
  }

  getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  getDirectorName(directorId) {
    this.directorName = "AGENCY_ADMIN.COUNTRY_OFFICES.UNASSIGNED";
    if (directorId && directorId != "null") {
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + directorId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.directorName = user.firstName + " " + user.lastName;
        });
    }
    return this.directorName;
  }

  goToMapView() {
    this.router.navigateByUrl(Constants.DONOR_HOME);
  }

  /**
   * Private functions
   */

  private loadData() {

    this.af.database.object(Constants.APP_STATUS + "/countryOffice/", {preserveSnapshot: true})
      .map(snap => {
        let locations = [];
        if (snap && snap.val()) {
          let countryObjects = Object.keys(snap.val()).map(key => {
            let countryWithAgencyId = snap.val()[key];
            countryWithAgencyId["agencyId"] = key;
            return countryWithAgencyId;
          });
          countryObjects.forEach(item => {
            let countries = Object.keys(item).filter(key => key != "agencyId").map(key => {
              let country = item[key];
              country["countryId"] = key;
              country["agencyId"] = item.agencyId;
              return country;
            });
            countries.forEach(country => {
              locations.push(country.location);
              this.hazardMap.set(Number(country.location), new Set<number>());
              this.countryAgencyRefMap.set(Number(country.location), country);
            });
            countries.forEach(country => {
              this.getHazardInfo(country);
            });
          });
        }
        return locations;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(allLocations => {
        this.loaderInactive = true;
        this.displayCountries = [];
        allLocations.forEach(location => {
          if (!this.displayCountries.includes(location)) {
            this.displayCountries.push(location);
          }
        });
      });

  }

  private initData() {

    this.getAllRegionsAndCountries();
    this.setupAlertLevelColours();
    this.getResponsePlans();
    this.getThresholds().then(_ => {
      this.loaderInactive = true;
    });
  }

  private getHazardInfo(country: any) {
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + country.agencyId + "/" + country.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(country => {
        this.countryLocationMap.set(country.$key, Number(country.location));
        this.af.database.list(Constants.APP_STATUS + "/hazard/" + country.$key)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(hazards => {
            hazards.forEach(hazard => {
              let newSet = this.hazardMap.get(this.countryLocationMap.get(country.$key)).add(Number(hazard.hazardScenario));
              this.hazardMap.set(this.countryLocationMap.get(country.$key), newSet);
            });
          });
      });
  }

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  getHazardsForCountry(location) {
    return Array.from(this.hazardMap.get(location));
  }

  seeCountryIndex(location) {
    let navRef = this.countryAgencyRefMap.get(location);
    this.router.navigate(["donor-module/donor-country-index", {
      "countryId": navRef.countryId,
      "agencyId": navRef.agencyId
    }]);
  }

  private getAllRegionsAndCountries() {

    this.otherRegion = new RegionHolder();
    this.otherRegion.regionId = "Unassigned";
    this.otherRegion.regionName = "Other Countries";
    this.mapHelper.getRegionsForAgency(this.uid, 'donor', (key, obj) => {
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

    this.mapHelper.initCountries(this.uid, 'donor', (departments) => {
      this.allCountries.clear();
      for (let x of departments) {
        this.addOrUpdateCountry(x);
        this.allCountries.add(x.countryId);
      }
      this.evaluateOthers();
    });

  }

  private evaluateOthers() {
    if (this.allCountries.size > 0) {
      for (let x in this.allCountries) {
        if (!this.countryIdsForOther.has(x)) {
          this.otherRegion.countries.add(x);
        } else {
          this.otherRegion.countries.delete(x);
        }
      }
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

  private setupAlertLevelColours() {

    for (let country in this.overallAlertLevels) {
      if (this.overallAlertLevels[country] == AlertLevels.Green) {
        this.alertLevelColours[country] = 'green';
      } else if (this.overallAlertLevels[country] == AlertLevels.Amber) {
        this.alertLevelColours[country] = 'orange';
      } else if (this.overallAlertLevels[country] == AlertLevels.Red) {
        this.alertLevelColours[country] = 'red';
      } else {
        this.alertLevelColours[country] = 'grey';
      }
    }
  }

  private getResponsePlans() {
    let promise = new Promise((res, rej) => {
      this.countryIds.forEach((countryID) => {
        this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryID)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((responsePlans: any) => {
            this.getCountApprovalStatus(responsePlans, countryID);
            res(true);
          });
      });
    });
    return promise;
  }

  private getCountApprovalStatus(responsePlans: any, countryID: string) {
    responsePlans.forEach((responsePlan: any) => {
      var approvals = responsePlan.approval;
      this.count = 0;
      this.recursiveParseArray(approvals, countryID);
    });
  }

  private recursiveParseArray(approvals: any, countryID: string) {
    for (let A in approvals) {
      if (typeof (approvals[A]) == 'object') {
        this.recursiveParseArray(approvals[A], countryID);
      } else {
        var approvalStatus = approvals[A];
        if (approvalStatus == 2) {
          this.count = this.count + 1;
          this.countResponsePlans[countryID] = this.count;
        }
      }
    }
  }

  private getThresholds() {

    let promise = new Promise((res, rej) => {
      this.getSystemThreshold('minThreshold').then((minTreshold: any) => {
        this.minTreshold = minTreshold;
        this.getSystemThreshold('advThreshold').then((advTreshold: any) => {
          this.advTreshold = advTreshold;
          this.getAllActions().then(_ => {
            res(true);
          });
        });
      });
    });
    return promise;
  }

  private getSystemThreshold(tresholdType: string) {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/system/" + this.systemAdminId + '/' + tresholdType)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((treshold: any) => {
          res(treshold);
        });
    });
    return promise;
  }

  private getAllActions() {
    let promise = new Promise((res, rej) => {
      this.countryIds.forEach((countryId) => {
        this.af.database.list(Constants.APP_STATUS + "/action/" + countryId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((actions: any) => {
            this.getPercenteActions(actions, countryId);
            res(true);
          });
      });
    });
    return promise;
  }

  private getPercenteActions(actions: any, countryId: string) {

    let promise = new Promise((res, rej) => {
      var countAllMinimumActions = 0;
      var countAllAdvancedActions = 0;
      var countCompletedMinimumActions = 0;
      var countCompletedAdvancedActions = 0;
      var countCompletedAllActions = 0;

      actions.forEach((action: any) => {
        if (action.level == 1) {
          countAllMinimumActions = countAllMinimumActions + 1;
          if (action.actionStatus == 2) {
            countCompletedMinimumActions = countCompletedMinimumActions + 1;
          }
        }

        if (action.level == 2) {
          countAllAdvancedActions = countAllAdvancedActions + 1;
          if (action.actionStatus == 2) {
            countCompletedAdvancedActions = countCompletedAdvancedActions + 1;
          }
        }

        if (action.actionStatus == 2) {
          countCompletedAllActions = countCompletedAllActions + 1;
        }
      });

      var percentageMinimumCompletedActions = (countCompletedMinimumActions / countAllMinimumActions) * 100;
      percentageMinimumCompletedActions = percentageMinimumCompletedActions ? percentageMinimumCompletedActions : 0;

      var percentageAdvancedCompletedActions = (countCompletedAdvancedActions / countAllAdvancedActions) * 100;
      percentageAdvancedCompletedActions = percentageAdvancedCompletedActions ? percentageAdvancedCompletedActions : 0;

      if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= this.minTreshold[0].$value) {
        this.mpaStatusColors[countryId] = 'green';
        this.mpaStatusIcons[countryId] = 'fa-check';
      }
      if (percentageMinimumCompletedActions && percentageMinimumCompletedActions >= this.minTreshold[1].$value) {
        this.mpaStatusColors[countryId] = 'orange';
        this.mpaStatusIcons[countryId] = 'fa-ellipsis-h';
      }
      if (!percentageMinimumCompletedActions || percentageMinimumCompletedActions < this.minTreshold[1].$value) {
        this.mpaStatusColors[countryId] = 'red';
        this.mpaStatusIcons[countryId] = 'fa-times'
      }

      if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= this.advTreshold[0].$value) {
        this.advStatusColors[countryId] = 'green';
        this.advStatusIcons[countryId] = 'fa-check';
      }
      if (percentageAdvancedCompletedActions && percentageAdvancedCompletedActions >= this.advTreshold[1].$value) {
        this.advStatusColors[countryId] = 'orange';
        this.advStatusIcons[countryId] = 'fa-ellipsis-h';
      }
      if (!percentageAdvancedCompletedActions || percentageAdvancedCompletedActions < this.advTreshold[1].$value) {
        this.advStatusColors[countryId] = 'red';
        this.advStatusIcons[countryId] = 'fa-times';
      }

      this.getActionsBySystemAdmin().then((actions: any) => {
        var countAllActionsSysAdmin = actions.length && actions.length > 0 ? actions.length : 0;
        this.percentageCHS[countryId] = Math.round((countCompletedAllActions / countAllActionsSysAdmin) * 100);
      });

      res(true);
    });

    return promise;
  }

  private getActionsBySystemAdmin() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((actions: any) => {
          res(actions);
        });
    });
    return promise;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
