
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {FirebaseApp} from "@angular/fire";
import {AngularFireDatabase} from "@angular/fire/database";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Currency, UserType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ModelAgency} from "../../../model/agency.model";
import {ModelUserPublic} from "../../../model/user-public.model";
declare var jQuery: any;

@Component({
  selector: 'app-new-agency-details',
  templateUrl: './new-agency-details.component.html',
  styleUrls: ['./new-agency-details.component.css']
})

export class NewAgencyDetailsComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyId: string;
  private agencyAdminName: string;

  private successInactive: boolean = true;
  private successMessage: string = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};

  private agencyName: string;
  private agencyAddressLine1: string = '';
  private agencyAddressLine2: string = '';
  private agencyAddressLine3: string = '';
  private agencyCity: string = '';
  private agencyPostCode: string = '';
  private agencyPhone: string = '';
  private agencyWebAddress: string = '';
  private agencyCountry: number;
  private agencyCurrency: number;
  private userType: number;

  private Country = Constants.COUNTRIES;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;
  private Currency = Constants.CURRENCY;
  private currenciesList: number[] = Constants.CURRENCY_SELECTION;

  private agencyLogo: string;
  private logoFile: File;
  private showReplaceRemoveLinks: boolean = false;
  firebase: any;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, @Inject(FirebaseApp) firebaseApp: any, private afd: AngularFireDatabase, private router: Router) {
    this.firebase = firebaseApp;
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.userType = userType
        this.afd.object<string>(Constants.APP_STATUS + "/administratorAgency/" + this.uid + "/agencyId")
          .snapshotChanges()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(id => {
            this.agencyId = id.payload.val();
            console.log("Agency Id: "+ this.agencyId);
            this.afd.object<ModelAgency>(Constants.APP_STATUS + "/agency/" + this.agencyId)
              .valueChanges()
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(agency => {
                if(agency.logoPath != null){
                  this.agencyLogo = agency.logoPath;
                }
                this.agencyName = agency.name ? agency.name : '';
                this.agencyAddressLine1 = agency.addressLine1 ? agency.addressLine1 : '';
                this.agencyAddressLine2 = agency.addressLine2 ? agency.addressLine2 : '';
                this.agencyAddressLine3 = agency.addressLine3 ? agency.addressLine3 : '';
                this.agencyCity = agency.city ? agency.city : '';
                this.agencyPostCode = agency.postCode ? agency.postCode : '';
                this.agencyWebAddress = agency.website ? agency.website : '';
                this.agencyPhone = agency.phone ? agency.phone : '';
                if(agency.country != null){
                  this.agencyCountry = agency.country;
                }
                if(agency.currency != null){
                  this.agencyCurrency = agency.currency;
                }
              });
          });
       this.afd.object<ModelUserPublic>(Constants.APP_STATUS + "/userPublic/" + this.uid)
          .valueChanges()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(user => {
          this.agencyAdminName = user.firstName;
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    if (this.validate()) {
      console.log('validated')

      let agencyData = {};

      agencyData['/agency/' + this.agencyId + '/name'] = this.agencyName;
      agencyData['/agency/' + this.agencyId + '/addressLine1'] = this.agencyAddressLine1;
      agencyData['/agency/' + this.agencyId + '/addressLine2'] = this.agencyAddressLine2;
      agencyData['/agency/' + this.agencyId + '/addressLine3'] = this.agencyAddressLine3;
      agencyData['/agency/' + this.agencyId + '/country'] = this.agencyCountry;
      agencyData['/agency/' + this.agencyId + '/city'] = this.agencyCity;
      agencyData['/agency/' + this.agencyId + '/postCode'] = this.agencyPostCode;
      agencyData['/agency/' + this.agencyId + '/phone'] = this.agencyPhone;
      agencyData['/agency/' + this.agencyId + '/website'] = this.agencyWebAddress;
      agencyData['/agency/' + this.agencyId + '/currency'] = this.agencyCurrency;
      agencyData['/administratorAgency/' + this.uid + '/firstLogin'] = false;
      if(this.userType == UserType.LocalAgencyAdmin){
        agencyData['/administratorLocalAgency/' + this.uid + '/firstLogin'] = false;
      }


      if (this.logoFile) {

        console.log("With logo");
        this.uploadAgencyLogo().then(result => {

            this.agencyLogo = result as string;
            agencyData['/agency/' + this.agencyId + '/logoPath'] = this.agencyLogo;

            this.afd.object(Constants.APP_STATUS).update(agencyData).then(() => {
              this.successInactive = false;
              observableTimer(Constants.ALERT_REDIRECT_DURATION).pipe(
                takeUntil(this.ngUnsubscribe))
                .subscribe(() => {
                this.successInactive = true;

                if(this.userType == UserType.AgencyAdmin){

                  this.router.navigateByUrl('/agency-admin/country-office');
                } else{

                  this.router.navigateByUrl('/local-agency/dashboard');
                }
              });
            }, error => {
              this.errorMessage = 'GLOBAL.GENERAL_ERROR';
              this.showAlert();
              console.log(error.message);
            });
          },
          error => {
            this.errorMessage = 'GLOBAL.GENERAL_ERROR';
            this.showAlert();
            console.log(error.message);
          });
      } else {

        this.afd.object(Constants.APP_STATUS).update(agencyData).then(() => {
          this.successInactive = false;
          observableTimer(Constants.ALERT_REDIRECT_DURATION).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
            this.successInactive = true;

              if(this.userType == UserType.AgencyAdmin){

                this.router.navigateByUrl('/agency-admin/country-office');
              } else{

                this.router.navigateByUrl('/local-agency/dashboard');
              }
          });
        }, error => {
          this.errorMessage = 'GLOBAL.GENERAL_ERROR';
          this.showAlert();
          console.log(error.message);
        });
      }

    } else {
      this.showAlert();
    }
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

  removeLogoPreview() {
    this.agencyLogo = '';
    this.logoFile = null; // remove the uploaded file
    jQuery("#imgInp").val(""); // reset file to trigger change event if the same file is uploaded
    this.setLogoPreview(this.agencyLogo);
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
      var storageRef = this.firebase.storage().ref().child('agency/' + this.agencyId + '/' + this.logoFile.name);
      var uploadTask = storageRef.put(this.logoFile);
      uploadTask.on('state_changed', function (snapshot) {
      }, function (error) {
        rej(error);
      }, function () {
        var downloadURL = uploadTask.snapshot.downloadURL;
        res(downloadURL);
      });
    });
    return promise;
  }

  private showAlert() {

    this.errorInactive = false;
    observableTimer(Constants.ALERT_DURATION).pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.errorInactive = true;
    });
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
    } else if (!(this.agencyCountry) && (this.agencyCountry != 0)) {
      this.alerts[this.agencyCountry] = true;
      this.errorMessage = "GLOBAL.ACCOUNT_SETTINGS.NO_COUNTRY";
      return false;
    } else if (!(this.agencyCity)) {
      this.alerts[this.agencyCity] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_CITY";
      return false;
    } else if (!(this.agencyPhone)) {
      this.alerts[this.agencyPhone] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_PHONE";
      return false;
    } else if (!(this.agencyCurrency) && (this.agencyCurrency != 0)) {
      this.alerts[this.agencyCurrency] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_CURRENCY";
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
}
