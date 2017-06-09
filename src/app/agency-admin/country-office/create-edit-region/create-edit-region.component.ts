import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable, Subject} from "rxjs";
import {Countries, UserType} from "../../../utils/Enums";
import {ModelRegion} from "../../../model/region.model";

@Component({
  selector: 'app-create-edit-region',
  templateUrl: './create-edit-region.component.html',
  styleUrls: ['./create-edit-region.component.css']
})

export class CreateEditRegionComponent implements OnInit, OnDestroy {

  private pageTitle: string = "AGENCY_ADMIN.COUNTRY_OFFICES.CREATE_NEW_REGION";
  private submitText: string = "AGENCY_ADMIN.COUNTRY_OFFICES.SAVE_NEW_REGION";
  private COUNTRY_NAMES: string[] = Constants.COUNTRIES;
  private regionName: string;
  private counter: number = 0;
  private countries: number[] = [this.counter];
  private regionalDirectorId: string;
  // private regionalDirectorId: any;
  private uid: string;
  private hideWarning: boolean = true;
  private errorMessage: string;
  private countrySelected = 0;
  private selectedCountries: string[] = [];
  private officeList = [];
  private countrySelections: FirebaseListObservable<any[]>;
  private regionId: string;
  private isEdit: boolean;
  private preRegionName: string;
  private isSubmitted: boolean;
  private regionalDirectors: any[] = [null];
  private hideRemove: boolean = true;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.uid = user.auth.uid;
      this.countrySelections = this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid);
      //regional directors
      this.af.database.list(Constants.APP_STATUS + "/staff/globalUser/" + this.uid, {
        query: {
          orderByChild: "userType",
          equalTo: UserType.RegionalDirector
        }
      })
        .flatMap(staffs => {
          let ids = [];
          staffs.forEach(staff => {
            ids.push(staff.$key);
          });
          return Observable.from(ids);
        })
        .flatMap(id => {
            return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + id)
          }
        )
        .takeUntil(this.ngUnsubscribe)
        .subscribe(x => {
          this.regionalDirectors.push(x);
        });
      // //regional directors
      // this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid)
      //   .flatMap(countries => {
      //     let countryIds = ["globalUser"];
      //     countries.forEach(country => {
      //       countryIds.push(country.$key)
      //     });
      //     return Observable.from(countryIds);
      //   })
      //   .flatMap(countryId => {
      //     return this.af.database.list(Constants.APP_STATUS + "/staff/" + countryId, {
      //       query: {
      //         orderByChild: "userType",
      //         equalTo: UserType.RegionalDirector
      //       }
      //     });
      //   })
      //   .flatMap(staffs => {
      //     let ids = [];
      //     staffs.forEach(staff => {
      //       ids.push(staff.$key);
      //     });
      //     return Observable.from(ids);
      //   })
      //   .flatMap(id => {
      //       return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + id)
      //     }
      //   )
      //   .takeUntil(this.ngUnsubscribe)
      //   .subscribe(x => {
      //     this.regionalDirectors.push(x);
      //   });
      //check if edit mode
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.regionId = params["id"];
            this.isEdit = true;
            this.pageTitle = "AGENCY_ADMIN.COUNTRY_OFFICES.EDIT_REGION";
            this.submitText = "AGENCY_ADMIN.COUNTRY_OFFICES.SAVE_REGION";
          }
          this.fetchCountries();
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private fetchCountries() {
    if (!this.isEdit) {
      this.countrySelections
        .takeUntil(this.ngUnsubscribe)
        .subscribe(country => {
          this.selectedCountries.push(country[0].location);
        });
    } else {
      this.loadRegionInfo(this.regionId);
    }
  }

  addCountrySelection() {
    console.log("add new country selection");

    this.countrySelections
      .takeUntil(this.ngUnsubscribe)
      .first()
      .subscribe(result => {
        console.log("counter: " + this.counter + "/result: " + result.length);
        // if (this.isEdit) {
        if (this.counter < result.length - 1) {
          console.log("can add more country");
          this.counter++;
          this.countries.push(this.counter);
          this.selectedCountries.push(this.selectedCountries[0]);
        } else {
          this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_MAX_COUNTRIES';
          this.showAlert();
          return;
        }

        console.log(this.countries)
        if (this.countries.length > 1) {
          this.hideRemove = false;
        }
      });
  }

  submit() {
    console.log("submit");
    console.log(this.regionalDirectorId);
    if (!this.regionName) {
      this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_NO_NAME';
      this.showAlert();
      return;
    }
    if (this.selectedCountries.length == 0) {
      this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_NO_COUNTRY';
      this.showAlert();
      return;
    }
    if (!this.checkCountries()) {
      this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.ERROR_DUPLICATE_COUNTRY';
      this.showAlert();
      return;
    }
    if (!this.regionalDirectorId || this.regionalDirectorId == 'AGENCY_ADMIN.COUNTRY_OFFICES.UNASSIGNED') {
      this.regionalDirectorId = "null";
    }
    console.log(this.regionName);
    console.log(this.selectedCountries);
    console.log(this.regionalDirectorId);
    this.validateData();
  }

  private validateData() {
    if (this.isEdit && this.preRegionName == this.regionName) {
      this.retrieveCountryOffices();
    } else {
      this.af.database.list(Constants.APP_STATUS + "/region/" + this.uid, {
        query: {
          orderByChild: "name",
          equalTo: this.regionName
        }
      })
        .takeUntil(this.ngUnsubscribe)
        .first()
        .subscribe(result => {
          if (result.length != 0) {
            this.errorMessage = 'AGENCY_ADMIN.COUNTRY_OFFICES.DUPLICATE_NAME';
            this.showAlert();
            return;
          }
          this.retrieveCountryOffices();
          // this.updateDatabase();
        });
    }

  }

  private retrieveCountryOffices() {
    console.log("retrieve country offices");

    this.selectedCountries.forEach(country => {
      console.log(Countries[country]);
      this.fetchOffice(Countries[country])
        .takeUntil(this.ngUnsubscribe)
        .first()
        .subscribe(x => {
          if (!x) {
            console.log("error error");
            return;
          }
          console.log(x[0].$key);
          this.officeList.push(x[0].$key);
          if (this.officeList.length == this.selectedCountries.length) {
            this.updateDatabase();
          }
        });
    })
  }

  private fetchOffice(country) {
    console.log("here: " + country);
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid, {
      query: {
        orderByChild: "location",
        equalTo: Countries[country]
      }
    });
  }

  private updateDatabase() {
    console.log("update firebase");
    console.log(this.officeList);
    this.isSubmitted = true;
    if (!this.isEdit) {
      console.log("push new data");
      let modelRegion = new ModelRegion();
      modelRegion.name = this.regionName;
      for (let office of this.officeList) {
        modelRegion.countries[office] = true;
      }
      modelRegion.directorId = this.regionalDirectorId;
      // modelRegion.directorId = this.regionalDirectorId.$key;
      this.af.database.list(Constants.APP_STATUS + "/region/" + this.uid).push(modelRegion).then(() => {
        this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
      }, error => {
        console.log(error.message);
        this.isSubmitted = false;
      });
    } else {
      console.log("only update data");
      let regionData = {};
      regionData["/region/" + this.uid + "/" + this.regionId + "/name"] = this.regionName;
      // if (this.regionalDirectorId instanceof String) {
      //   regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = this.regionalDirectorId;
      // } else {
      //   if (this.regionalDirectorId) {
      //     regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = this.regionalDirectorId.$key;
      //   } else {
      //     regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = "";
      //   }
      // }
      if (this.regionalDirectorId && this.regionalDirectorId != "null") {
        regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = this.regionalDirectorId;
      } else {
        regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = "null";
      }

      let countriesData = {};
      for (let office of this.officeList) {
        countriesData[office] = true;
        //update group
        regionData["/directorRegion/" + office + "/"] = this.regionalDirectorId;
      }
      regionData["/region/" + this.uid + "/" + this.regionId + "/countries"] = countriesData;
      this.af.database.object(Constants.APP_STATUS).update(regionData).then(() => {
        this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
      }, error => {
        console.log(error.message);
        this.isSubmitted = false;
      });
    }
  }

  cancel() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
  }

  showAlert() {
    this.hideWarning = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.hideWarning = true;
    });
  }

  private checkCountries(): boolean {
    let countrySet = new Set();
    for (let country of this.selectedCountries) {
      countrySet.add(country);
    }
    return countrySet.size == this.selectedCountries.length;

  }

  countryChange(country) {
    console.log("selected: " + this.selectedCountries.length + "/ countries: " + this.countries.length);
    if (this.selectedCountries.length == this.countries.length) {
      console.log("update");
      this.selectedCountries[country] = Countries[this.countrySelected];
    } else {
      console.log("push new country");
      this.selectedCountries.push(Countries[this.countrySelected]);
    }
    console.log("country: " + country);
    console.log("country selected: " + this.countrySelected);
    console.log("country list: " + this.selectedCountries);
    this.countrySelected = 0;
  }

  private loadRegionInfo(param: string) {
    this.selectedCountries = [];
    this.countries = [];
    this.af.database.object(Constants.APP_STATUS + "/region/" + this.uid + "/" + param)
      .do(region => {
        this.regionName = region.name;
        this.preRegionName = region.name;
        console.log("***");
        console.log(region.directorId);
        console.log("***");

        if (!this.isSubmitted) {
          for (let i = 0; i < Object.keys(region.countries).length; i++) {
            this.countries.push(i);
            if (i != 0) {
              this.counter++;
            }
          }
          this.hideRemove = !( this.counter > 0 );
        }
      })
      .do(region => {
        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + region.directorId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
            // console.log(user);
            this.regionalDirectorId = user.$key;
          });
      })
      .flatMap(region => {
        return Observable.from(Object.keys(region.countries));
      })
      .flatMap(countryId => {
        console.log("country id: " + countryId);
        return this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.uid + "/" + countryId)
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(country => {
        if (!this.isSubmitted) {
          this.selectedCountries.push(country.location);
        }
        // console.log(this.selectedCountries);
      });
  }

  showName(director) {
    let name = "Unassigned";
    if (director) {
      name = director.firstName + " " + director.lastName;
    }
    return name;
  }

  removeCountry(country) {
    if (this.countries.length > 1) {
      this.selectedCountries.splice(country, 1);
      this.countries = this.countries.filter(item => item !== country);
      this.counter--;
    }
    if (this.countries.length == 1) {
      this.hideRemove = true;
    }
  }

}
