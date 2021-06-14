
import {from as observableFrom, Observable, Scheduler, Subject} from 'rxjs';

import {takeUntil, mergeMap, first} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFireDatabase, SnapshotAction} from "@angular/fire/database";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {AgencyService} from "../../services/agency-service.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {UserType} from "../../utils/Enums";
import {ModelCountryOffice} from "../../model/countryoffice.model";
import {ModelRegion} from "../../model/region.model";
import {ModelUserPublic} from "../../model/user-public.model";

declare var jQuery: any;

@Component({
  selector: 'app-country-office',
  templateUrl: './country-office.component.html',
  styleUrls: ['./country-office.component.css'],
  providers: [AgencyService]
})

export class CountryOfficeComponent implements OnInit, OnDestroy {


  private hideLoader: boolean;
  private uid: string;
  private agencyId: string;
  private countries: Observable<SnapshotAction<ModelCountryOffice>[]>;
  private countryNames: string [] = Constants.COUNTRIES;
  private admins: Observable<any>[];
  private regions: Observable<SnapshotAction<ModelRegion>[]>;
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
  private systemId: string;
  private userType: UserType;
  private showCoCBanner: boolean;
  private showToCBanner: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private afd: AngularFireDatabase, private router: Router, private route: ActivatedRoute, private agencyService: AgencyService) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.systemId = systemId;
      this.userType = userType;

      this.countries = this.afd.list<ModelCountryOffice>(Constants.APP_STATUS + '/countryOffice/' + this.agencyId).snapshotChanges();
      this.regions = this.afd.list<ModelRegion>(Constants.APP_STATUS + '/region/' + this.agencyId).snapshotChanges();
      this.regions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(regions => {
        regions.forEach(region => {
          this.showRegionMap.set(region.key, false);
        });
      });

      this.checkCoCUpdated();
      this.checkToCUpdated();
      this.checkAnyCountryNoRegion();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private checkCoCUpdated(){
    this.afd.object<boolean>(Constants.APP_STATUS + "/userPublic/" + this.uid + "/latestCoCAgreed")
      .snapshotChanges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((snap) => {
        if(snap.payload.val() == null || snap.payload.val() == false){
          this.showCoCBanner = true;
        }
      });
  }

  private checkToCUpdated(){
    this.afd.object<boolean>(Constants.APP_STATUS + "/userPublic/" + this.uid + "/latestToCAgreed")
      .snapshotChanges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((snap) => {
        if(snap.payload.val() == null || snap.payload.val() == false){
          this.showToCBanner = true;
        }
      });
  }

  private checkAnyCountryNoRegion() {
    this.countriesWithRegion = [];
    this.allCountries = [];
    this.otherCountries = [];
    this.regions
      .map(regions => {
        let countries:Set<string> = new Set();
        regions.forEach(region => {
          Object.keys(region.payload.val().countries).forEach(countryId => {
            countries.add(countryId);
          });
        });
        return Array.from(countries);
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      //.subscribeOn(Scheduler.async)
      .subscribe(result => {
        this.hideLoader = true;
        // console.log(result);
        this.countriesWithRegion = result;
        this.countries
          .map(list => {
            let countryids: string[] = [];
            list.forEach(country => {
              countryids.push(country.key);
            });
            return countryids;
          })
          .pipe(takeUntil(this.ngUnsubscribe))
          //.subscribeOn(Scheduler.async)
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
    observableFrom(diff).pipe(
      mergeMap(id => {
        return this.afd.object<ModelCountryOffice>(Constants.APP_STATUS + '/countryOffice/' + this.agencyId + '/' + id).snapshotChanges();
      }),
      takeUntil(this.ngUnsubscribe),)
      .subscribe(result => {
        let exist = this.otherCountries.filter(country => country.$key == result.key).length > 0;
        if (!exist) {
          this.otherCountries.push(result);
        }
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

    this.otherCountries.forEach(country => {
      console.log(country)
      if (country.$key == this.countryToUpdate.$key) {
        country.isActive = state;
      }
    });
    // this.otherCountries = [];
    this.afd.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyId + '/' + this.countryToUpdate.$key + '/isActive').set(state)
      .then(_ => {
        console.log("Country state updated");
        this.closeModal();
      });
  }

  closeModal() {
    jQuery("#update-country").modal("hide");
  }

  editCountry(country) {
    this.router.navigate(['agency-admin/country-office/create-edit-country/', {id: country.$key}]);
  }

  viewCountry(country){
    console.log(country);
    let data = {
      "countryId": country.$key,
      "isViewing": true,
      "agencyId": this.agencyId,
      "systemId": this.systemId,
      "userType": this.userType,
      "uid": this.uid
    };

    this.router.navigate(["/agency-admin/agency-overview", data]);
  }

  getCountries(region): any {

    if (!region) {
      return;
    }

    this.regionCountries = [];
    this.tempCountryIdList = [];
    for (let countryId in region.countries) {
      this.afd.object<ModelCountryOffice>(Constants.APP_STATUS + '/countryOffice/' + this.agencyId + '/' + countryId)
        .valueChanges()
        .pipe(first())
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(country => {
          if (!this.tempCountryIdList.includes(String(country.location))) {
            this.tempCountryIdList.push(String(country.location));
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
    this.afd.object<string>(Constants.APP_STATUS + '/countryOffice/' + this.agencyId + '/' + key + '/adminId')
      .valueChanges()
      .flatMap(adminId => {
        return this.afd.object<ModelUserPublic>(Constants.APP_STATUS + '/userPublic/' + adminId).valueChanges()
      })
      .pipe(takeUntil(this.ngUnsubscribe))
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
    this.directorName = "UNASSIGNED";
    if (director && director.directorId && director.directorId != "null") {
      this.afd.object<ModelUserPublic>(Constants.APP_STATUS + "/userPublic/" + director.directorId)
        .valueChanges()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(user => {
          this.directorName = user.firstName + " " + user.lastName;
        });
    }

    return this.directorName;
  }

}
