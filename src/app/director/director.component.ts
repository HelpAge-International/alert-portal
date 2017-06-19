import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {SuperMapComponents, SDepHolder} from "../utils/MapHelper";
import {RegionHolder} from "../map/map-countries-list/map-countries-list.component";
import {Countries, UserType, AlertLevels} from "../utils/Enums";
import {ActionsService} from "../services/actions.service";
import * as moment from "moment";
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

  private UserType = UserType;
  private userType: UserType;

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
  private idsOfCountriesInRegion: string[];
  private locationsOfCountriesInRegion: any = [];

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

  // Filter
  private alertLevelSelected = AlertLevels.All;

  private userPaths = Constants.USER_PATHS;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryIds: string[] = [];

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private actionService: ActionsService, private userService: UserService) {
    this.mapHelper = SuperMapComponents.init(af, this.ngUnsubscribe);
    this.regions = [];
    this.countries = [];
    this.countriesInRegion = [];
    this.idsOfCountriesInRegion = [];
    this.locationsOfCountriesInRegion = [];
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
      console.log("Auth found!");
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

  countryOverview(countryId) {
    this.router.navigate(["/director/director-overview", {"countryId": countryId, "isViewing": true}]);
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
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + directorId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.directorName = user.firstName + " " + user.lastName;
        });
    }
    return this.directorName;
  }

  filter() {
    if (this.userType == UserType.RegionalDirector) {
      if (this.alertLevelSelected == AlertLevels.All) {
        this.getCountryCodesForCountriesInRegion(true);
      } else {
        this.getCountryCodesForCountriesInRegion(false);
      }
    } else {

      // TODO - Filter for countries with regions
    }
  }

  /**
   * Private functions
   */

  private loadData() {

    console.log("Agency Admin ---- " + this.agencyId);
    console.log("System Admin ---- " + this.systemAdminId);
    this.userService.getAllCountryIdsForAgency(this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryIds => {
        this.countryIds = countryIds;

        this.userService.getAllCountryAlertLevelsForAgency(this.agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(countryAlertLevels => {
            this.overallAlertLevels = countryAlertLevels;
            this.initData();
          });
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
    let startOfToday = moment().startOf("day").valueOf();
    let endOfToday = moment().endOf("day").valueOf();

    this.countryIds.forEach(countryId => {

      //for each country do following
      this.actionService.getActionsDueInWeek(countryId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(actions => {
          this.actionsToday = actions.filter(action => action.dueDate >= startOfToday && action.dueDate <= endOfToday).concat(this.actionsToday);
          this.actionsThisWeek = actions.filter(action => action.dueDate > endOfToday).concat(this.actionsThisWeek);
        });

      this.actionService.getIndicatorsDueInWeek(countryId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(indicators => {
          let dayIndicators = indicators.filter(indicator => indicator.dueDate >= startOfToday && indicator.dueDate <= endOfToday);
          let weekIndicators = indicators.filter(indicator => indicator.dueDate > endOfToday);
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
        });

      this.actionService.getResponsePlanFoGlobalDirectorToApproval(countryId, this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(plans => {
          this.approvalPlans = this.approvalPlans.concat(plans);
        });

    });

    this.getAgencyName();
    this.getAllRegionsAndCountries();
    this.setupAlertLevelColours();
    this.getResponsePlans();
    this.getThresholds();
    if (this.userType == UserType.RegionalDirector) {
      this.getCountryIdsForRegion();
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

  private getCountryIdsForRegion() {

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
              this.getCountryCodesForCountriesInRegion(true)
            });
        }
      });

  }

  private getCountryCodesForCountriesInRegion(getAllAlertLevels: boolean) {

    if (getAllAlertLevels) {
      if (this.idsOfCountriesInRegion) {
        this.countriesInRegion = [];

        this.idsOfCountriesInRegion.forEach(countryId => {
          this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(country => {
              if (country) {

                let countryToAdd = new SDepHolder(country.$key);
                countryToAdd.location = country.location;
                countryToAdd.alertLevel = country.alertLevel;
                this.countriesInRegion.push(countryToAdd);
                console.log(country.alertLevel);
                if (country.location || country.location == 0) {
                  this.locationsOfCountriesInRegion[countryId] = Countries[country.location];
                }
              }
            });
        });
      }
    } else {

      if (this.idsOfCountriesInRegion) {
        this.countriesInRegion = [];

        this.idsOfCountriesInRegion.forEach(countryId => {
          this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(country => {
              console.log(country.alertLevel);
              if (country && country.alertLevel == this.alertLevelSelected) {

                let countryToAdd = new SDepHolder(country.$key);
                countryToAdd.location = country.location;
                countryToAdd.alertLevel = country.alertLevel;
                this.countriesInRegion.push(countryToAdd);
                if (country.location || country.location == 0) {
                  this.locationsOfCountriesInRegion[countryId] = Countries[country.location];
                }
              }
            });
        });
      }

    }
  }

  private getAllRegionsAndCountries() {

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
    });

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

    this.getSystemThreshold('minThreshold').then((minTreshold: any) => {
      this.minTreshold = minTreshold;
      this.getSystemThreshold('advThreshold').then((advTreshold: any) => {
        this.advTreshold = advTreshold;
        this.getAllActions();
      });
    });

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
