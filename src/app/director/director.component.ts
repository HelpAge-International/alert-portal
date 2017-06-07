import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {Subject, Observable} from "rxjs";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {SuperMapComponents, SDepHolder} from "../utils/MapHelper";
import {RegionHolder} from "../map/map-countries-list/map-countries-list.component";
import {RxHelper} from "../utils/RxHelper";
import {Countries, UserType} from "../utils/Enums";

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css']
})

export class DirectorComponent implements OnInit, OnDestroy {

  private uid: string;

  private mapHelper: SuperMapComponents;
  private regions: RegionHolder[];
  private countries: SDepHolder[];

  private directorName: string;
  private countryIdsForOther: Set<string> = new Set<string>();
  private allCountries: Set<string> = new Set<string>();
  private otherRegion: RegionHolder = RegionHolder.create("Other", "unassigned");

  private userPaths = Constants.USER_PATHS;

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

  getDirectorName(directorId) {

    this.directorName = "AGENCY_ADMIN.COUNTRY_OFFICES.UNASSIGNED";
    console.log(directorId);
    if (directorId && directorId != "null") {
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + directorId)
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
    this.getAllRegionsAndCountries();
  }

  private getAllRegionsAndCountries() {

    this.otherRegion = new RegionHolder();
    this.otherRegion.regionId = "Unassigned";
    this.otherRegion.regionName = "Other Countries";
    this.mapHelper.getRegionsForAgency(this.uid, this.userPaths[UserType.GlobalDirector], (key, obj) => {
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

    this.mapHelper.initCountries(this.uid, this.userPaths[UserType.GlobalDirector], (departments) => {
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
