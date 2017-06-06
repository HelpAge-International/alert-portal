import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {Subject, Observable} from "rxjs";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {SuperMapComponents, SDepHolder} from "../utils/MapHelper";
import {RegionHolder} from "../map/map-countries-list/map-countries-list.component";
import {RxHelper} from "../utils/RxHelper";
import {Countries} from "../utils/Enums";

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css']
})

export class DirectorComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyId: string = 'qbyONHp4xqZy2eUw0kQHU7BAcov1';

  private mapHelper: SuperMapComponents;
  public regions: RegionHolder[];
  public countries: SDepHolder[];

  private countryIdsForOther: Set<string> = new Set<string>();
  private allCountries: Set<string> = new Set<string>();
  private otherRegion: RegionHolder = RegionHolder.create("Other", "unassigned");

  private responsePlansForApproval: Observable<any[]>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
    this.mapHelper = SuperMapComponents.init(af, subscriptions);
    this.regions = [];
    this.countries = [];
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.loadData();
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  planReview(planId) {
    this.router.navigate(["/dashboard/review-response-plan", {"id": planId}]);
  }

  getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  /**
   * Private functions
   */

  private loadData() {
    // TODO -
    console.log("Here");
    this.getRegions();
  }

  private getRegions(){

    this.otherRegion = new RegionHolder();
    this.otherRegion.regionId = "unassigned";
    this.otherRegion.regionName = "Other";
    console.log("Here");

    this.mapHelper.getRegionsForAgency(this.uid, "globalDirector", (key, obj) => {
      console.log("Updating Region");

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

    this.mapHelper.initCountries(this.uid, "globalDirector", (departments) => {
      console.log("Updating country");
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
