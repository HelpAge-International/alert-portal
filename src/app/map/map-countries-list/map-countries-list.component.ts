import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SDepHolder, SuperMapComponents} from "../../utils/MapHelper";
import {AngularFire} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {ModelCountryOffice} from "../../model/countryoffice.model";
import {ModelRegion} from "../../model/region.model";

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
  public showRegionHeaders: boolean;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
    this.mapHelper = SuperMapComponents.init(af, subscriptions);
    this.regions = [];
    this.countries = [];
  }

  ngOnInit() {
    let sub = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.uid;

        /** Setup the region count **/
        this.mapHelper.getRegionsForAgency(this.uid, "administratorCountry", (key, obj) => {
          this.showRegionHeaders = key != "";
          if (!this.showRegionHeaders) return;
          let hRegion = new RegionHolder();
          hRegion.regionName  = obj.name;
          hRegion.regionId = key;
          for (let x in obj.countries) {
            hRegion.countries.add(x);
          }
          this.addOrUpdateRegion(hRegion);
        });

        /** Country list **/
        this.mapHelper.initCountries(this.uid, "administratorCountry", (departments => {
          for (let x of departments) {
            this.addOrUpdateCountry(x);
          }
          console.log(this.countries);
        }));
      }
    });
    this.subscriptions.add(sub);
  }

  goToMapView() {
    this.router.navigateByUrl('map');
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
}

export class RegionHolder {
  constructor() {
    this.countries = new Set<string>();
  }
  public getParentId() {
    return "collapseParent-" + this.regionId;
  }
  public getParentIdHash() {
    return "#" + this.getParentId();
  }
  public getCountryId(id: string) {
    return "collapseCountry-" + this.regionId + "-" + id;
  }
  public getCountryIdHash(id: string) {
    return "#" + this.getCountryId(id);
  }
  public listOfCountries() {
    let r: string = "";
    r += this.getParentId() + ", ";
    this.countries.forEach(value => {
      r += this.getCountryId(value) + ", ";
    });
    r = r.substr(0, r.length - 2);
    return r;
  }
  public countries: Set<string>;
  public regionId: string;
  public regionName: string;
}
