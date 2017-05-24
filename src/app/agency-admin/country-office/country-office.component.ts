import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {Router} from '@angular/router';
import {Constants} from '../../utils/Constants';
import {Observable, Subject} from 'rxjs';
declare var jQuery: any;

@Component({
  selector: 'app-country-office',
  templateUrl: './country-office.component.html',
  styleUrls: ['./country-office.component.css']
})

export class CountryOfficeComponent implements OnInit, OnDestroy {

  private uid: string;
  private countries: FirebaseListObservable<any[]>;
  private countryNames: string [] = Constants.COUNTRY;
  private admins: Observable<any>[];
  private regions: FirebaseListObservable<any[]>;
  private hasRegion: boolean;
  private regionCountries: any = [];
  private tempCountryIdList: string[] = [];
  private showRegionMap = new Map();
  private hideOtherTab: boolean = true;
  private countriesWithRegion: string [];
  private allCountries: string[];
  private otherCountries: any = [];
  private hideOtherCountries: boolean;

  private alertTitle: string;
  private alertContent: string;
  private countryToUpdate;
  private directorName: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      // console.log(user.auth.uid);
      this.uid = user.auth.uid;
      this.countries = this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.uid);
      this.regions = this.af.database.list(Constants.APP_STATUS + '/region/' + this.uid);
      this.regions.takeUntil(this.ngUnsubscribe).subscribe(regions => {
          regions.forEach(region => {
            this.showRegionMap.set(region.$key, false);
          });
        });
      this.checkAnyCountryNoRegion();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private checkAnyCountryNoRegion() {
    this.countriesWithRegion = [];
    this.allCountries = [];
    this.otherCountries = [];
    this.regions
      .map(regions => {
        let countries = new Set();
        regions.forEach(region => {
          Object.keys(region.countries).forEach(countryId => {
            countries.add(countryId);
          });
        });
        return Array.from(countries);
      })
      .first()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(result => {
        // console.log(result);
        this.countriesWithRegion = result;
        let subscription = this.countries
          .map(list => {
            let countryids = [];
            list.forEach(country => {
              countryids.push(country.$key);
            });
            return countryids;
          })
          .first()
          .takeUntil(this.ngUnsubscribe)
          .subscribe(result => {
            // console.log(result);
            this.allCountries = result;
            let diff = this.allCountries.filter(x => {
              return !this.countriesWithRegion.includes(x);
            });
            if (diff.length > 0) {
              this.hideOtherTab = false;
              this.retrieveOtherCountries(diff);
            }
          });
      });


  }

  private retrieveOtherCountries(diff: string[]) {
    // console.log('do have other countries, fetch data!');
    Observable.from(diff)
      .flatMap(id => {
        return this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + id);
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(result => {
        // console.log(result);
        this.otherCountries.push(result);
      });
  }

  update(country) {
    this.countryToUpdate = country;
    if (this.countryToUpdate.isActive) {
      this.alertTitle = "GLOBAL.DEACTIVATE";
      this.alertContent = 'AGENCY_ADMIN.COUNTRY_OFFICES.DEACTIVATE_ALERT';
    } else {
      this.alertTitle = "GLOBAL.ACTIVATE";
      this.alertContent = 'AGENCY_ADMIN.COUNTRY_OFFICES.ACTIVATE_ALERT';
    }
    jQuery("#update-country").modal("show");
  }

  toggleActive() {
    let state: boolean = !this.countryToUpdate.isActive;

    this.otherCountries = [];
    this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + this.countryToUpdate.$key + '/isActive').set(state)
      .then(_ => {
        console.log("Country state updated");
        jQuery("#update-country").modal("hide");
      });
  }

  closeModal() {
    jQuery("#update-country").modal("hide");
  }

  editCountry(country) {
    this.router.navigate(['agency-admin/country-office/create-edit-country/', {id: country.$key}]);
  }

  getCountries(region): any {

    if (!region) {
      return;
    }

    this.regionCountries = [];
    this.tempCountryIdList = [];
    for (let countryId in region.countries) {
      this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + countryId)
        .first()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(country => {
          if (!this.tempCountryIdList.includes(country.location)) {
            this.tempCountryIdList.push(country.location);
            this.regionCountries.push(country);
          }
        });
    }
    return this.regionCountries;
  }

  getAdminName(key): string {
    if (!key) {
      return;
    }
    let name: string = '';
    this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + key + '/adminId')
      .flatMap(adminId => {
        return this.af.database.object(Constants.APP_STATUS + '/userPublic/' + adminId.$value)
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        name = user.firstName + ' ' + user.lastName;
      });

    if (name) {
      return name;
    }
  }

  hideCountryList(region) {
    if (region) {
      this.showRegionMap.set(region.$key, !this.showRegionMap.get(region.$key));
    } else {
      this.hideOtherCountries = !this.hideOtherCountries;
    }
  }

  editRegion(region) {
    this.router.navigate(['/agency-admin/country-office/create-edit-region', {id: region.$key}], {skipLocationChange: true});
  }

  getDirectorName(director) {
    this.directorName = "AGENCY_ADMIN.COUNTRY_OFFICES.UNASSIGNED";
    if (director && director.directorId && director.directorId != "null") {
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + director.directorId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.directorName = user.firstName + " " + user.lastName;
        });
    }

    return this.directorName;
  }

}
