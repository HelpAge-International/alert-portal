import {Component, Inject, OnDestroy, OnInit, Input} from "@angular/core";
import {AngularFire, FirebaseApp} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Currency} from "../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {ModelAgency} from "../../model/agency.model";
import {PageControlService} from "../../services/pagecontrol.service";

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
  private headOfficeCountry: number;
  private agencyCurrency: number;

  private clockSettings: any;
  private notificationSettings: any;
  private responsePlanSettings: any;

  private Country = Constants.COUNTRIES;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;
  private Currency = Constants.CURRENCY;
  private currenciesList: number[] = Constants.CURRENCY_SELECTION;
  private logoFile: File;
  private showReplaceRemoveLinks: boolean = false;

  firebase: any;
  private agencyId: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, @Inject(FirebaseApp) firebaseApp: any, private af: AngularFire, private router: Router) {
    this.firebase = firebaseApp;
  }


  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.loadAgencyData(this.agencyId);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
        if(this.isLocalAgency){
          editedAgency.headOfficeCountry = this.headOfficeCountry;
        }
        editedAgency.country = this.agencyCountry;
        editedAgency.city = this.agencyCity;
        editedAgency.postCode = this.agencyPostCode;
        editedAgency.phone = this.agencyPhone;
        editedAgency.website = this.agencyWebAddress;
        editedAgency.currency = this.agencyCurrency;

        // Re-adding default settings values
        editedAgency.clockSettings = this.clockSettings;
        editedAgency.notificationSetting = this.notificationSettings;
        editedAgency.responsePlanSettings = this.responsePlanSettings;

        let noChanges: boolean = editedAgency.addressLine1 == this.modalAgency.addressLine1
          && editedAgency.addressLine2 == this.modalAgency.addressLine2
          && editedAgency.addressLine3 == this.modalAgency.addressLine3
          && editedAgency.country == this.modalAgency.country
          && (this.isLocalAgency ? (editedAgency.headOfficeCountry == this.modalAgency.headOfficeCountry) : true)
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

    this.af.database.object(Constants.APP_STATUS + "/agency/" + uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((agency: ModelAgency) => {

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
        this.headOfficeCountry = agency.headOfficeCountry
        this.agencyCurrency = agency.currency;

        // Loading default settings values
        this.clockSettings = agency.clockSettings;
        this.notificationSettings = agency.notificationSetting;
        this.responsePlanSettings = agency.responsePlanSettings;

        this.showReplaceRemoveLinks = !!this.agencyLogo;
      });
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
      Observable.timer(Constants.ALERT_DURATION)
        .takeUntil(this.ngUnsubscribe).subscribe(() => {
        this.errorInactive = true;
      });
    } else {
      this.successInactive = false;
      Observable.timer(Constants.ALERT_DURATION)
        .takeUntil(this.ngUnsubscribe).subscribe(() => {
        this.successInactive = true;
      });
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
      this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_ADDRESS_1";
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
