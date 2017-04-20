import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Country, Currency} from "../../../utils/Enums";
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";
import {ModelAgency} from "../../../model/agency.model";

@Component({
  selector: 'app-new-agency-details',
  templateUrl: './new-agency-details.component.html',
  styleUrls: ['./new-agency-details.component.css']
})

export class NewAgencyDetailsComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyName: string;
  private agencyAdminName: string;

  private successInactive: boolean = true;
  private successMessage: string = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};

  private agencyAddressLine1: string;
  private agencyAddressLine2: string;
  private agencyAddressLine3: string;
  private agencyCity: string;
  private agencyPostCode: string;
  private agencyPhone: string;
  private agencyWebAddress: string;
  private agencyCountry: number;
  private agencyCurrency: number;

  private Country = Constants.COUNTRY;
  private countriesList: number[] = [Country.UK, Country.France, Country.Germany];
  private Currency = Constants.CURRENCY;
  private currenciesList: number[] = [Currency.GBP, Currency.USD, Currency.EUR];

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("New agency admin uid: " + this.uid);
        let userPublicSubscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid).subscribe(user => {
          this.agencyAdminName = user.firstName;
        });
        this.subscriptions.add(userPublicSubscription);
        let agencySubscription = this.af.database.object(Constants.APP_STATUS + "/agency/" + this.uid).subscribe(agency => {
          this.agencyName = agency.name;
        });
        this.subscriptions.add(agencySubscription);
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {

    this.subscriptions.releaseAll();
  }

  onSubmit() {
    console.log("New agency name: " + this.agencyName);

    if (this.validate()) {

      let agencyData = {}

      var agency: ModelAgency = new ModelAgency(this.agencyName);
      agency.addressLine1 = this.agencyAddressLine1;
      agency.addressLine2 = this.agencyAddressLine2;
      agency.addressLine3 = this.agencyAddressLine3;
      agency.country = this.agencyCountry;
      agency.city = this.agencyCity;
      agency.postCode = this.agencyPostCode;
      agency.phone = this.agencyPhone;
      agency.website = this.agencyWebAddress;
      agency.currency = this.agencyCurrency;

      agencyData['/agency/' + this.uid + '/addressLine1'] = this.agencyAddressLine1;
      agencyData['/agency/' + this.uid + '/addressLine2'] = this.agencyAddressLine2;
      agencyData['/agency/' + this.uid + '/addressLine3'] = this.agencyAddressLine3;
      agencyData['/agency/' + this.uid + '/country'] = this.agencyCountry;
      agencyData['/agency/' + this.uid + '/city'] = this.agencyCity;
      agencyData['/agency/' + this.uid + '/postCode'] = this.agencyPostCode;
      agencyData['/agency/' + this.uid + '/phone'] = this.agencyPhone;
      agencyData['/agency/' + this.uid + '/website'] = this.agencyWebAddress;
      agencyData['/agency/' + this.uid + '/currency'] = this.agencyCurrency;
      agencyData['/administratorAgency/' + this.uid + '/firstLogin'] = false;


      this.af.database.object(Constants.APP_STATUS).update(agencyData).then(() => {
        this.successInactive = false;
        let subscription = Observable.timer(1500).subscribe(() => {
          this.successInactive = true;
          this.router.navigateByUrl('/agency-admin/country-office');
        });
        this.subscriptions.add(subscription);
      }, error => {
        this.errorMessage = 'GLOBAL.GENERAL_ERROR';
        this.showAlert();
        console.log(error.message);
      });
    } else {
      this.showAlert();
    }
  }

  private showAlert() {

    this.errorInactive = false;
    let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
      this.errorInactive = true;
    });
    this.subscriptions.add(subscription);
  }


  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validate() {

    this.alerts = {};
    if (!(this.agencyAddressLine1)) {
      this.alerts[this.agencyAddressLine1] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_ADDRESS_1";
      return false;
    } else if (!(this.agencyCountry)) {
      this.alerts[this.agencyCountry] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_COUNTRY";
      return false;
    } else if (!(this.agencyCity)) {
      this.alerts[this.agencyCity] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_CITY";
      return false;
    } else if (!(this.agencyPhone)) {
      this.alerts[this.agencyPhone] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_PHONE";
      return false;
    } else if (!(this.agencyCurrency)) {
      this.alerts[this.agencyCurrency] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_CURRENCY";
      return false;
    }
    return true;
  }
}
