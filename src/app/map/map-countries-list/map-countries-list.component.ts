import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SDepHolder, SuperMapComponents} from "../../utils/MapHelper";
import {AngularFire} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {ModelCountryOffice} from "../../model/countryoffice.model";
import {ModelRegion} from "../../model/region.model";
import {Countries, UserType} from "../../utils/Enums";
import {ModelHazard} from "../../model/hazard.model";
import {HazardImages} from "../../utils/HazardImages";
import {Subject} from "rxjs/Subject";
import {UserService} from "../../services/user.service";
import {Constants} from "../../utils/Constants";
import {AgencyModulesEnabled, PageControlService} from "../../services/pagecontrol.service";
import {MapCountry, MapService} from "../../services/map.service";
import {TranslateService} from "@ngx-translate/core";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-map-countries-list',
  templateUrl: './map-countries-list.component.html',
  styleUrls: ['./map-countries-list.component.css']
})
export class MapCountriesListComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private uid: string;
  public agencyId: string;

  private mapService: MapService;

  public countries: MapCountry[];
  public otherRegion: RegionHolder = RegionHolder.create("Other", "unassigned");
  public regions: RegionHolder[];

  public showRegionHeaders: boolean = true;

  public minThreshGreen: number = -1;
  public minThreshYellow: number = -1;

  private Number = Number;

  private isDirector: boolean;

  private DEPARTMENT_MAP: Map<string, string> = new Map<string, string>();

  private moduleAccess: AgencyModulesEnabled = new AgencyModulesEnabled();

  private countryId: string;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private settingService:SettingsService,
              private translate : TranslateService) {
    this.regions = [];
    this.mapService = MapService.init(this.af, this.ngUnsubscribe);
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.countryId = countryId

      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["isDirector"]) {
            this.isDirector = params["isDirector"];
          }
        });

      /** Setup the region count **/
      this.otherRegion = new RegionHolder();
      this.otherRegion.regionId = "unassigned";
      this.otherRegion.regionName = this.translate.instant("OTHER");

      // Initialise the department map
      this.initDepartments();

      // Initialise the countries
      this.mapService.initCountries(this.uid, userType, countryId, agencyId, systemId, (countries, minGreen, minYellow) => {
        this.countries = countries;
        this.minThreshGreen = minGreen;
        this.minThreshYellow = minYellow;

        // Process everything we need for the regions
        this.evaluateRegionsAndCountries();
      });

      // Find all the regions
      this.findAllRegions();

      /** Permissions for the minimum preparedness **/
      if (userType != UserType.AgencyAdmin &&
        userType != UserType.SystemAdmin &&
        userType != UserType.All) {
        PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[userType], (isEnabled) => {
          this.moduleAccess = isEnabled;
        });
      }
      else {
        this.moduleAccess.all(true);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToMapView() {
    this.isDirector ? this.router.navigate(["/map", {"isDirector": true}]) : this.router.navigateByUrl('map');
  }

  /**
   * Handlers for the regions[] list.
   */
  public findAllRegions() {
    this.af.database.list(Constants.APP_STATUS + "/region/" + this.agencyId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.regions = [];
        for (let x of snap) {
          let thisVal: RegionHolder = new RegionHolder();
          thisVal.regionName = x.val().name;
          thisVal.regionId = x.key;
          thisVal.directorId = x.val().directorId;
          for (let country in x.val().countries) {
            if (x.val().countries[country]) {
              thisVal.countries.add(country);
            }
          }
          this.regions.push(thisVal);
        }
        this.evaluateRegionsAndCountries();
      })
  }

  public evaluateRegionsAndCountries() {
    if (this.regions != null && this.countries != null) {
      // Joint logic run here
      // Construct the otherRegion object, remove all countryIds that already exist in a region
      console.log("Preparing other region");
      console.log(this.countries);
      for (let x of this.countries) {
        this.otherRegion.countries.add(x.countryId);
      }
      for (let x of this.regions) {
        x.countries.forEach((value, key) => {
          this.otherRegion.countries.delete(key);
        });
      }
      console.log(this.regions);
      console.log(this.otherRegion);
    }
  }

  public initDepartments() {
    console.log(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments");
    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((deps) => {
        this.DEPARTMENT_MAP.clear();
        this.DEPARTMENT_MAP.set("unassigned", this.translate.instant("UNASSIGNED"));
        for (let x of deps) {
          this.DEPARTMENT_MAP.set(x.key, x.val().name);
        }
        console.log(this.DEPARTMENT_MAP);

        //try to add country local departments here
        this.settingService.getCountryLocalDepartments(this.agencyId, this.countryId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(localDepts => {
            localDepts.forEach(dep => this.DEPARTMENT_MAP.set(dep.id, dep.name))
          })
      })
  }

  /**
   * Utility methods for the UI, getting CountryCodes and some simple tests
   */
  public getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  public getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  public isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }
}

export class RegionHazard {

  constructor(location: number, hazard) {
    this.hazardScenario = hazard.hazardScenario;
    this.location = location;
  }

  public hazardScenario: number;
  public location: number;

  public locationS() {
    return Countries[this.location];
  }
}


export class RegionHolder {
  constructor() {
    this.countries = new Set<string>();
  }

  public static create(name: string, uid: string) {
    let regionHolder: RegionHolder = new RegionHolder();
    regionHolder.regionName = name;
    regionHolder.regionId = uid;
    return regionHolder;
  }

  public getRegionId() {
    return "mapParent-" + this.regionId;
  }

  public getRegionIdHash() {
    return "#" + this.getRegionId();
  }

  public getCountryId(id: string) {
    return "mapCountry-" + this.regionId + "-" + id;
  }

  public getCountryIdHash(id: string) {
    return "#" + this.getCountryId(id);
  }

  public getDepartmentId(id: string) {
    return "mapDepartment-" + this.regionId + "-" + id;
  }

  public getDepartmentIdHash(id: string) {
    return "#" + this.getDepartmentId(id);
  }

  public listOfCountries() {
    let r: string = "";
    r += this.getRegionIdHash() + ", ";
    this.countries.forEach(value => {
      r += this.getCountryIdHash(value) + ", ";
    });
    r = r.substr(0, r.length - 2);
    return r;
  }

  public listOfDepartments() {
    let r: string = "";
    r += this.getRegionIdHash() + ", ";
    this.countries.forEach(value => {
      r += this.getDepartmentIdHash(value) + ", ";
    });
    r = r.substr(0, r.length - 2);
    return r;
  }

  public countries: Set<string>;
  public regionId: string;
  public regionName: string;
  public directorId: string;
}
