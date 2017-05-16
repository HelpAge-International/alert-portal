import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseApp} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Country, Currency} from "../../utils/Enums";
import {RxHelper} from "../../utils/RxHelper";
import {Observable} from "rxjs";
import {ModelAgency} from "../../model/agency.model";
declare var jQuery: any;

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
  private agencyLogo: string = '';
  private agencyAddressLine1: string = '';
  private agencyAddressLine2: string = '';
  private agencyAddressLine3: string = '';
  private agencyCity: string = '';
  private agencyPostCode: string = '';
  private agencyPhone: string = '';
  private agencyWebAddress: string = '';
  private agencyCountry: number;
  private agencyCurrency: number;
  private Country = Constants.COUNTRY;
  private countriesList: number[] = [Country.UK, Country.France, Country.Germany];
  private Currency = Constants.CURRENCY;
  private currenciesList: number[] = [Currency.GBP, Currency.USD, Currency.EUR];
  private logoFile: File;
  private showReplaceRemoveLinks: boolean = false;

  firebase: any;
  private agencyId: string;

  constructor(@Inject(FirebaseApp) firebaseApp: any, private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
    this.firebase = firebaseApp;
  }


  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + this.uid + "/agencyId")
          .subscribe(id => {
            this.agencyId = id.$value;
            this.loadAgencyData(this.agencyId);
          });
        this.subscriptions.add(subscription);
        console.log("Agency admin uid: " + this.agencyId);
      } else {
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  fileChange(event) {
    if (event.target.files.length > 0) {
      this.logoFile = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.showReplaceRemoveLinks = true;
        this.setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(this.logoFile);
    }
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
          && editedAgency.currency == this.modalAgency.currency
          && this.logoFile == null; // no image was uploaded

        if (noChanges) {
          this.errorMessage = 'GLOBAL.NO_CHANGES_MADE';
          this.showAlert(true);
        } else {

          if (this.logoFile == null) {

            this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId).update(editedAgency).then(() => {
              this.showAlert(false)
            }, error => {
              this.errorMessage = 'GLOBAL.GENERAL_ERROR';
              this.showAlert(true);
              console.log(error.message);
            });
          }
          else {
            this.uploadAgencyLogo().then(result => {
                var oldLogo = this.agencyLogo;

                // update the logo preview default placeholder and agency model
                this.agencyLogo = result as string;
                console.log(this.agencyLogo);
                editedAgency.logoPath = this.agencyLogo;

                // remove the old logo from firebase
                try {
                  // check if the newly uploaded image is diferrent than the old one
                  if (this.firebase.storage().refFromURL(oldLogo).location.path != this.firebase.storage().refFromURL(this.agencyLogo).location.path) {
                    this.firebase.storage().refFromURL(oldLogo).delete();
                  }
                }
                catch (error) { /* Log error */
                }

                this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId).update(editedAgency).then(() => {
                  this.showAlert(false)
                }, error => {
                  this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                  this.showAlert(true);
                  console.log(error.message);
                });
              },
              error => {
                this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                this.showAlert(true);
                console.log(error.message);
              });
          }
        }
      }
    } else {
      this.showAlert(true);
    }
  }

  removeLogo() {
    if (this.logoFile == null) {
      jQuery("#delete-logo").modal("show");
    } else {
      this.setLogoPreview(this.agencyLogo);
      this.logoFile = null; // remove the uploaded file
      jQuery("#imgInp").val(""); // reset file to trigger change event if the same file is uploaded
    }
  }

  removeLogoFromStorage() {
    try {
      this.firebase.storage().refFromURL(this.agencyLogo).delete().then(() => {
        this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId + '/logoPath').remove().then(() => {
          jQuery("#delete-logo").modal("hide");
        });
      })
    }
    catch (error) { /* Log error */
      console.log(error);
    }
  }

  closeModal() {
    jQuery("#delete-logo").modal("hide");
  }

  private loadAgencyData(uid) {

    let subscription = this.af.database.object(Constants.APP_STATUS + "/agency/" + uid).subscribe((agency: ModelAgency) => {

      this.modalAgency = agency;
      this.agencyLogo = agency.logoPath;
      this.agencyAddressLine1 = agency.addressLine1;
      this.agencyAddressLine2 = agency.addressLine2;
      this.agencyAddressLine3 = agency.addressLine3;
      this.agencyCity = agency.city;
      this.agencyPostCode = agency.postCode;
      this.agencyPhone = agency.phone;
      this.agencyWebAddress = agency.website;
      this.agencyCountry = agency.country;
      this.agencyCurrency = agency.currency;

      this.showReplaceRemoveLinks = !!this.agencyLogo;
    });
    this.subscriptions.add(subscription);
  }

  private setLogoPreview(logoImage: string) {
    jQuery(".Agency-details__logo__preview").css("background-image", "url(" + logoImage + ")");
    if (logoImage) {
      jQuery(".Agency-details__logo__preview").addClass("Selected");
    } else {
      this.showReplaceRemoveLinks = false;
      jQuery(".Agency-details__logo__preview").removeClass("Selected");
    }
  }

  private uploadAgencyLogo() {
    let promise = new Promise((res, rej) => {
      if (this.logoFile) {
        var storageRef = this.firebase.storage().ref().child('agency/' + this.agencyId + '/' + this.logoFile.name);
        var uploadTask = storageRef.put(this.logoFile);
        uploadTask.on('state_changed', function (snapshot) {
        }, function (error) {
          rej(error);
        }, function () {
          var downloadURL = uploadTask.snapshot.downloadURL;
          res(downloadURL);
        });
      } else {
        res(this.agencyLogo);
      }
    });
    return promise;
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
    } else if (this.logoFile) {
      // Check for file size
      if (this.logoFile.size > Constants.AGENCY_ADMIN_LOGO_MAX_SIZE) {
        this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.AGENCY_LOGO_SIZE_EXCEEDED";
        return false;
      }
      // Check for file type
      if (!(Constants.AGENCY_ADMIN_LOGO_FILE_TYPES.indexOf(this.logoFile.type) > -1 )) {
        this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.AGENCY_LOGO_INVALID_FILETYPE";
        return false;
      }
    }

    return true;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
