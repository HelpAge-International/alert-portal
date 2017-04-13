import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Country, Currency} from "../../utils/Enums";
import {RxHelper} from "../../utils/RxHelper";
import {Observable} from "rxjs";
import {ModelAgency} from "../../model/agency.model";

@Component({
  selector: 'app-agency-account-details',
  templateUrl: './agency-account-details.component.html',
  styleUrls: ['./agency-account-details.component.css']
})

export class AgencyAccountDetailsComponent implements OnInit, OnDestroy {

  private uid: string;
  private successInactive: boolean = true;
  private successMessage: string = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};
  private modalAgency: ModelAgency;
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
        console.log("Agency admin uid: " + this.uid);
        this.loadAgencyData(this.uid);
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

    if (this.validate()) {

      if (this.modalAgency) {
        var editedAgency: ModelAgency = new ModelAgency(this.modalAgency.name);
        editedAgency.addressLine1 = this.agencyAddressLine1;
        editedAgency.addressLine2 = this.agencyAddressLine2;
        editedAgency.addressLine3 = this.agencyAddressLine3;
        editedAgency.country = this.agencyCountry;
        editedAgency.city = this.agencyCity;
        editedAgency.postCode = this.agencyPostCode;
        editedAgency.phone = this.agencyPhone;
        editedAgency.website = this.agencyWebAddress;
        editedAgency.currency = this.agencyCurrency;

        let noChanges: boolean = editedAgency.addressLine1 == this.modalAgency.addressLine1
          && editedAgency.addressLine2 == this.modalAgency.addressLine2
          && editedAgency.addressLine3 == this.modalAgency.addressLine3
          && editedAgency.country == this.modalAgency.country
          && editedAgency.city == this.modalAgency.city
          && editedAgency.postCode == this.modalAgency.postCode
          && editedAgency.phone == this.modalAgency.phone
          && editedAgency.website == this.modalAgency.website
          && editedAgency.currency == this.modalAgency.currency;

        if (noChanges) {
          this.errorMessage = 'GLOBAL.NO_CHANGES_MADE';
          this.showAlert(true);
        } else {

          this.af.database.object(Constants.APP_STATUS+'/agency/' + this.uid).update(editedAgency).then(() => {
            this.showAlert(false)
          }, error => {
            this.errorMessage = 'GLOBAL.GENERAL_ERROR';
            this.showAlert(true);
            console.log(error.message);
          });
        }
      }
    } else {
      this.showAlert(true);
    }
  }

  private loadAgencyData(uid) {

    let subscription = this.af.database.object(Constants.APP_STATUS+"/agency/" + uid).subscribe((agency: ModelAgency) => {

      this.modalAgency = agency;
      this.agencyAddressLine1 = agency.addressLine1;
      this.agencyAddressLine2 = agency.addressLine2;
      this.agencyAddressLine3 = agency.addressLine3;
      this.agencyCity = agency.city;
      this.agencyPostCode = agency.postCode;
      this.agencyPhone = agency.phone;
      this.agencyWebAddress = agency.website;
      this.agencyCountry = agency.country;
      this.agencyCurrency = agency.currency;
    });
    this.subscriptions.add(subscription);
  }

  private showAlert(error: boolean) {
    if (error) {
      this.errorInactive = false;
      let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.errorInactive = true;
      });
      this.subscriptions.add(subscription);
    } else {
      this.successInactive = false;
      let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.successInactive = true;
      });
      this.subscriptions.add(subscription);
    }
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validate() {

    // TODO - Check image size here (<2MB)
    this.alerts = {};
    if (!(this.agencyAddressLine1)) {
      this.alerts[this.agencyAddressLine1] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_ADDRESS_1";
      return false;
    } else if (!(this.agencyCity)) {
      this.alerts[this.agencyCity] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_CITY";
      return false;
    } else if (!(this.agencyPhone)) {
      this.alerts[this.agencyPhone] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_PHONE";
      return false;
    }
    return true;
  }

}
