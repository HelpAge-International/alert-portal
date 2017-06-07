import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SDepHolder, SuperMapComponents} from "../../utils/MapHelper";
import {AngularFire} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {ModelCountryOffice} from "../../model/countryoffice.model";
import {ModelRegion} from "../../model/region.model";
import {Countries} from "../../utils/Enums";
import {ModelHazard} from "../../model/hazard.model";
import {HazardImages} from "../../utils/HazardImages";

@Component({
  selector: 'app-map-countries-list',
  templateUrl: './map-countries-list.component.html',
  styleUrls: ['./map-countries-list.component.css']
})
export class MapCountriesListComponent implements OnInit {

  private uid: string;
  private mapHelper: SuperMapComponents;
  public regions: RegionHolder[];
  public countries: SDepHolder[];
  public hazards: RegionHazard[];
  public showRegionHeaders: boolean = true;

  public minThreshGreen: number = -1;
  public minThreshYellow: number = -1;
  public minThreshRed: number = -1;

  private countryIdsForOther: Set<string> = new Set<string>();
  private allCountries: Set<string> = new Set<string>();
  private otherRegion: RegionHolder = RegionHolder.create("Other", "unassigned");

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
    this.mapHelper = SuperMapComponents.init(af, subscriptions);
    this.regions = [];
    this.countries = [];
    this.hazards = [];
  }

  ngOnInit() {
    let sub = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.uid;

        /** Setup the minimum threshold **/
        this.mapHelper.getSystemInfo(this.uid, "administratorCountry", (red, yellow, green) => {
          this.minThreshGreen = green;
          this.minThreshYellow = yellow;
          this.minThreshRed = red;
        });

        /** Setup the region count **/
        this.otherRegion = new RegionHolder();
        this.otherRegion.regionId = "unassigned";
        this.otherRegion.regionName = "Other";
        this.mapHelper.getRegionsForAgency(this.uid, "administratorCountry", (key, obj) => {
          console.log("Updating Region");
          // this.showRegionHeaders = key != "";
          // if (!this.showRegionHeaders) return;
          let hRegion = new RegionHolder();
          hRegion.regionName  = obj.name;
          hRegion.regionId = key;
          for (let x in obj.countries) {
            hRegion.countries.add(x);
            this.countryIdsForOther.add(x);
          }
          this.evaluateOthers();
          this.addOrUpdateRegion(hRegion);
        });

        /** Country list **/
        this.mapHelper.initCountries(this.uid, "administratorCountry", (departments => {
          console.log("Updating country");
          this.allCountries.clear();
          for (let x of departments) {
            this.addOrUpdateCountry(x);
            this.allCountries.add(x.countryId);
          }
          this.evaluateOthers();
        }));

        /** Markers */
        this.mapHelper.actionInfoForAgencyAdmin(this.uid, "administratorCountry", (location, marker) => {
          let hazard: RegionHazard = new RegionHazard(location, marker);
          this.addOrUpdateHazard(hazard);
          console.log(this.hazards);
        });
      }
    });
    this.subscriptions.add(sub);
  }

  goToMapView() {
    this.router.navigateByUrl('map');
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
        x.countries = holder.countries;
        return;
      }
    }
    this.regions.push(holder);
    return;
  }

  public addOrUpdateHazard(holder: RegionHazard) {
    for (let x of this.hazards) {
      if (x.hazardScenario == holder.hazardScenario) {
        x.location = holder.location;
        return;
      }
    }
    this.hazards.push(holder);
    return;
  }

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
    let regionHolder:RegionHolder = new RegionHolder();
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
}
