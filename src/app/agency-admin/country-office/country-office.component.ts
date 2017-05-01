import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {RxHelper} from '../../utils/RxHelper';
import {Router} from '@angular/router';
import {Constants} from '../../utils/Constants';
import {Observable} from 'rxjs';
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

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      // console.log(user.auth.uid);
      this.uid = user.auth.uid;
      this.countries = this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.uid);
      this.regions = this.af.database.list(Constants.APP_STATUS + '/region/' + this.uid);
      let subscription = this.regions
        .subscribe(regions => {
          regions.forEach(region => {
            this.showRegionMap.set(region.$key, false);
          });
        });
      this.subscriptions.add(subscription);
      this.checkAnyCountryNoRegion();
    });
    this.subscriptions.add(subscription);
  }

  private checkAnyCountryNoRegion() {
    this.countriesWithRegion = [];
    this.allCountries = [];
    this.otherCountries = [];
    let subscription = this.regions
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
        this.subscriptions.add(subscription);
      });
    this.subscriptions.add(subscription);


  }

  private retrieveOtherCountries(diff: string[]) {
    // console.log('do have other countries, fetch data!');
    let subscription = Observable.from(diff)
      .flatMap(id => {
        return this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + id);
      })
      .subscribe(result => {
        // console.log(result);
        this.otherCountries.push(result);
      });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
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
      let subscription = this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + countryId)
        .first()
        .subscribe(country => {
          if (!this.tempCountryIdList.includes(country.location)) {
            this.tempCountryIdList.push(country.location);
            this.regionCountries.push(country);
          }
        });
      this.subscriptions.add(subscription);
    }
    return this.regionCountries;
  }

  getAdminName(key): string {
    if (!key) {
      return;
    }
    let name: string = '';
    let subscription = this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + key + '/adminId')
      .flatMap(adminId => {
        return this.af.database.object(Constants.APP_STATUS + '/userPublic/' + adminId.$value)
      })
      .subscribe(user => {
        name = user.firstName + ' ' + user.lastName;
      });
    this.subscriptions.add(subscription);

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
      let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + director.directorId)
        .subscribe(user => {
          this.directorName = user.firstName + " " + user.lastName;
        });
      this.subscriptions.add(subscription);
    }

    return this.directorName;
  }

}
