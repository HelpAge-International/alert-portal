import {Component, OnDestroy, OnInit} from "@angular/core";
import {RxHelper} from "../../../utils/RxHelper";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Route, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from "rxjs";
import {Country} from "../../../utils/Enums";
import {ModelRegion} from "../../../model/region.model";

@Component({
  selector: 'app-create-edit-region',
  templateUrl: './create-edit-region.component.html',
  styleUrls: ['./create-edit-region.component.css']
})
export class CreateEditRegionComponent implements OnInit, OnDestroy {
  private pageTitle: string = "Create new region";
  private submitText: string = "Save new region";
  private COUNTRY_NAMES: string[] = Constants.COUNTRY;
  private regionName: string;
  private counter: number = 0;
  private countries: number[] = [this.counter];
  private regionalDirectorId: string;
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

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }
      this.uid = user.auth.uid;
      this.countrySelections = this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid);
      let subscription = this.route.params
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.regionId = params["id"];
            this.isEdit = true;
            this.pageTitle = "Edit region";
            this.submitText = "save region";
          }
          this.fetchCountries();
        });
      this.subscriptions.add(subscription);
    });
  }

  private fetchCountries() {
    if (!this.isEdit) {
      let subscription = this.countrySelections.subscribe(country => {
        this.selectedCountries.push(country[0].location);
      });
      this.subscriptions.add(subscription);
    } else {
      this.loadRegionInfo(this.regionId);
    }
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  addCountrySelection() {
    console.log("add new country selection");
    let subscription = this.countrySelections
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
          this.errorMessage = "No more countries can be selected!!";
          this.showAlert();
          return;
        }
      });
    this.subscriptions.add(subscription);
  }

  submit() {
    console.log("submit");
    if (!this.regionName) {
      this.errorMessage = "Name can not be empty!";
      this.showAlert();
      return;
    }
    if (this.selectedCountries.length == 0) {
      this.errorMessage = "No country was selected for this region!";
      this.showAlert();
      return;
    }
    if (!this.checkCountries()) {
      this.errorMessage = "Country can not be duplicate for the same region!";
      this.showAlert();
      return;
    }
    if (!this.regionalDirectorId || this.regionalDirectorId == "Unassigned") {
      this.regionalDirectorId = "";
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
      let subscription = this.af.database.list(Constants.APP_STATUS + "/region/" + this.uid, {
        query: {
          orderByChild: "name",
          equalTo: this.regionName
        }
      })
        .first()
        .subscribe(result => {
          if (result.length != 0) {
            this.errorMessage = "Name is duplicate!";
            this.showAlert();
            return;
          }
          this.retrieveCountryOffices();
          // this.updateDatabase();
        });
      this.subscriptions.add(subscription);
    }

  }

  private retrieveCountryOffices() {
    console.log("retrieve country offices");

    this.selectedCountries.forEach(country => {
      console.log(Country[country]);
      let subscription = this.fetchOffice(Country[country])
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
      this.subscriptions.add(subscription);
    })
  }

  private fetchOffice(country) {
    console.log("here: " + country);
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.uid, {
      query: {
        orderByChild: "location",
        equalTo: Country[country]
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
      regionData["/region/" + this.uid + "/" + this.regionId + "/directorId"] = this.regionalDirectorId;
      let countriesData = {};
      for (let office of this.officeList) {
        countriesData[office] = true;
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
    let subscribe = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
      this.hideWarning = true;
    });
    this.subscriptions.add(subscribe);
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
      this.selectedCountries[country] = Country[this.countrySelected];
    } else {
      console.log("push new country");
      this.selectedCountries.push(Country[this.countrySelected]);
    }
    console.log("country: " + country);
    console.log("country selected: " + this.countrySelected);
    console.log("country list: " + this.selectedCountries);
    this.countrySelected = 0;
  }

  private loadRegionInfo(param: string) {
    this.selectedCountries = [];
    this.countries = [];
    let subscription = this.af.database.object(Constants.APP_STATUS + "/region/" + this.uid + "/" + param)
      .do(region => {
        this.regionName = region.name;
        this.preRegionName = region.name;
        this.regionalDirectorId = region.directorId;

        if (!this.isSubmitted) {
          for (let i = 0; i < Object.keys(region.countries).length; i++) {
            this.countries.push(i);
          }
        }
      })
      .flatMap(region => {
        return Observable.from(Object.keys(region.countries));
      })
      .flatMap(countryId => {
        console.log("country id: " + countryId);
        return this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.uid + "/" + countryId)
      })
      .subscribe(country => {
        if (!this.isSubmitted) {
          this.selectedCountries.push(country.location);
        }
        console.log(this.selectedCountries);
      });
    this.subscriptions.add(subscription);
  }
}
