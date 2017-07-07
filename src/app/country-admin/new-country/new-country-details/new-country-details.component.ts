import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {AngularFire, FirebaseApp} from 'angularfire2';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../utils/Constants';
import {Countries, PhonePrefix} from '../../../utils/Enums';
import {Observable, Subject} from 'rxjs';
import {CountryOfficeAddressModel} from '../../../model/countryoffice.address.model';
import {PageControlService} from "../../../services/pagecontrol.service";
import {CustomerValidator} from "../../../utils/CustomValidator";

@Component({
  selector: 'app-new-country-details',
  templateUrl: './new-country-details.component.html',
  styleUrls: ['./new-country-details.component.css']
})

export class NewCountryDetailsComponent implements OnInit, OnDestroy {

  private uid: string;
  private countryAdminName: string;
  private countryAdminCountryId = '';
  private agencyAdminId: string;

  private successInactive = true;
  private successMessage = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
  private errorInactive = true;
  private errorMessage: string;
  private alerts = {};

  private CountryOfficeAddressModel: CountryOfficeAddressModel = new CountryOfficeAddressModel();

  private Country = Constants.COUNTRIES;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  firebase: any;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, @Inject(FirebaseApp) firebaseApp: any, private af: AngularFire, private router: Router) {
    this.firebase = firebaseApp;
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.countryAdminName = user.firstName;
        });
      this.af.database.object(Constants.APP_STATUS + '/administratorCountry/' + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(countryAdmin => {
          // Get the country administrator id and agency administrator id
          this.countryAdminCountryId = countryAdmin.countryId;
          this.agencyAdminId = countryAdmin.agencyAdmin ? Object.keys(countryAdmin.agencyAdmin)[0] : '';

          this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyAdminId + "/" + this.countryAdminCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(countryOffice => {
              // Get the country office location to pre populate the country select
              this.CountryOfficeAddressModel.location = countryOffice.location;

              // Set the phone prefix
              this.CountryOfficeAddressModel.phone = '+' + PhonePrefix[Countries[countryOffice.location]];
            });
          // If there are any errors raised by firebase, the Country select will not be disabled and will allow user input
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    if (this.validate()) {
      this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyAdminId + '/' + this.countryAdminCountryId + '/')
        .update(this.CountryOfficeAddressModel).then(() => {

        // update the firstLogin flag
        this.af.database.object(Constants.APP_STATUS + '/administratorCountry/' + this.uid + '/').update({firstLogin: false});

        this.successInactive = false;
        let subscription = Observable.timer(1500)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(() => {
            this.successInactive = true;
            this.router.navigateByUrl(Constants.COUNTRY_ADMIN_HOME);
          });
      }, error => {
        this.errorMessage = 'GLOBAL.GENERAL_ERROR';
        this.showAlert();
      });
    } else {
      this.showAlert();
    }
  }

  validatePhoneNumber() {
    if (CustomerValidator.PhoneNumberValidator(this.CountryOfficeAddressModel.phone)) {
      this.alerts[this.CountryOfficeAddressModel.phone] = true;
      this.errorMessage = 'There are letters in phone number';
      this.showAlert();
    }
  }

  private showAlert() {
    this.errorInactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.errorInactive = true;
      });
  }


  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validate() {
    this.alerts = {};
    if (!(this.CountryOfficeAddressModel.addressLine1)) {
      this.alerts[this.CountryOfficeAddressModel.addressLine1] = true;
      this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_ADDRESS_1";
      return false;
    } else if (!(this.CountryOfficeAddressModel.city)) {
      this.alerts[this.CountryOfficeAddressModel.city] = true;
      this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_CITY";
      return false;
    } else if (!(this.CountryOfficeAddressModel.phone) || (this.CountryOfficeAddressModel.phone == PhonePrefix[Countries[this.CountryOfficeAddressModel.location]])) {
      this.alerts[this.CountryOfficeAddressModel.phone] = true;
      this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_PHONE";
      return false;
    } else if (CustomerValidator.PhoneNumberValidator(this.CountryOfficeAddressModel.phone)) {
      this.alerts[this.CountryOfficeAddressModel.phone] = true;
      this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.INVALID_PHONE";
      return false;
    }
    return true;
  }
}
