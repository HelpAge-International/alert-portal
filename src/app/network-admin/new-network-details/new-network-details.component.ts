import {Component, Inject, Input, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseApp} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {ModelNetwork} from "../../model/network.model";
import {NetworkService} from "../../services/network.service";

declare var jQuery: any;

@Component({
  selector: 'app-new-network-details',
  templateUrl: './new-network-details.component.html',
  styleUrls: ['./new-network-details.component.css'],
  providers: [NetworkService]
})

export class NewNetworkDetailsComponent implements OnInit, OnDestroy {

  private successInactive: boolean = true;
  private successMessage: string = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};
  private Country = Constants.COUNTRIES;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;
  private logoFile: File;
  private showReplaceRemoveLinks: boolean = false;
  firebase: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private networkAdminName: string;
  private networkName: string;
  private networkAddressLine1: string = '';
  private networkAddressLine2: string = '';
  private networkAddressLine3: string = '';
  private networkCity: string = '';
  private networkPostCode: string = '';
  private networkTelephone: string = '';
  private networkWebAddress: string = '';
  private networkCountry: number;
  private networkLogo: string;
  private networkId: string;

  @Input() notFirstLogin: boolean = false;
  private loadedNetwork: ModelNetwork;
  private showLoader:boolean;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              @Inject(FirebaseApp) firebaseApp: any,
              private af: AngularFire,
              private networkService: NetworkService,
              private router: Router) {
    this.firebase = firebaseApp;
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user, prevUserType, networkIds, networkCountryIds) => {
      this.uid = user.uid;
      console.log("Network admin uid: " + this.uid);
      this.showLoader = true;

      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.networkAdminName = user.firstName;
        });

      this.networkService.checkNetworkUserSelection(this.uid)
        .flatMap(data => {
          console.log(data);
          if (data.isNetworkAdmin) {
            this.networkId = data.networkId;
            return this.networkService.getNetworkDetail(data.networkId);
          } else {
            //TODO GET NETWORK COUNTRY DETAIL
          }
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(network => {
          this.loadedNetwork = network;

          network.name ? this.networkName = network.name : this.networkName = "";
          network.logoPath ? this.networkLogo = network.logoPath : this.networkLogo = "";
          network.addressLine1 ? this.networkAddressLine1 = network.addressLine1 : this.networkAddressLine1 = "";
          network.addressLine2 ? this.networkAddressLine2 = network.addressLine2 : this.networkAddressLine2 = "";
          network.addressLine3 ? this.networkAddressLine3 = network.addressLine3 : this.networkAddressLine3 = "";
          network.countryId ? this.networkCountry = network.countryId : this.networkCountry = -1;
          network.city ? this.networkCity = network.city : this.networkCity = "";
          network.postcode ? this.networkPostCode = network.postcode : this.networkPostCode = "";
          network.telephone ? this.networkTelephone = network.telephone : this.networkTelephone = "";
          network.websiteAddress ? this.networkWebAddress = network.websiteAddress : this.networkWebAddress = "";

          this.showLoader = false;
        });


      // this.route.params
      //   .takeUntil(this.ngUnsubscribe)
      //   .subscribe((params: Params) => {
      //     this.networkId = params["networkId"];
      //     console.log(this.networkId);
      //
      //     this.af.database.object(Constants.APP_STATUS + "/network/" + this.networkId)
      //       .takeUntil(this.ngUnsubscribe)
      //       .subscribe(network => {
      //         this.networkName = network.name;
      //         this.networkLogo = network.logoPath;
      //       });
      //   });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    if (this.validate()) {
      let newNetwork = new ModelNetwork();
      newNetwork.name = this.networkName;
      newNetwork.addressLine1 = this.networkAddressLine1;
      newNetwork.addressLine2 = this.networkAddressLine2;
      newNetwork.addressLine3 = this.networkAddressLine3;
      newNetwork.countryId = this.networkCountry;
      newNetwork.city = this.networkCity;
      newNetwork.postcode = this.networkPostCode;
      newNetwork.telephone = this.networkTelephone;
      newNetwork.websiteAddress = this.networkWebAddress;
      newNetwork.isInitialisedNetwork = true;
      newNetwork.clockSettings = this.loadedNetwork.clockSettings;
      newNetwork.responsePlanSettings = this.loadedNetwork.responsePlanSettings;

      console.log(newNetwork);

      if (this.logoFile) {
        console.log("With logo");
        this.uploadNetworkLogo().then(result => {

            this.networkLogo = result as string;
            newNetwork.logoPath = this.networkLogo;

            this.af.database.object(Constants.APP_STATUS + "/network/" + this.networkId).update(newNetwork).then(() => {
              this.successInactive = false;
              Observable.timer(Constants.ALERT_REDIRECT_DURATION)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(() => {
                  this.successInactive = true;

                  //TODO: navigation to next page
                  if (!this.notFirstLogin) {
                    this.router.navigateByUrl('/network/network-offices');
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

        console.log("Without logo");
        this.af.database.object(Constants.APP_STATUS + "/network/" + this.networkId).update(newNetwork).then(() => {
          this.successInactive = false;
          Observable.timer(Constants.ALERT_REDIRECT_DURATION)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
              this.successInactive = true;

              //TODO: navigation to next page
              if (!this.notFirstLogin) {
                this.router.navigateByUrl('/network/network-offices');
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
    this.networkLogo = '';
    this.logoFile = null; // remove the uploaded file
    jQuery("#imgInp").val(""); // reset file to trigger change event if the same file is uploaded
    this.setLogoPreview(this.networkLogo);
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

  private uploadNetworkLogo() {
    let promise = new Promise((res, rej) => {
      var storageRef = this.firebase.storage().ref().child('network/' + this.networkId + '/' + this.logoFile.name);
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
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.errorInactive = true;
    });
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */

  private validate() {
    this.alerts = {};
    if (!(this.networkAddressLine1)) {
      this.alerts[this.networkAddressLine1] = true;
      this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_ADDRESS_1";
      return false;
    } else if (!(this.networkCountry) && (this.networkCountry != 0)) {
      this.alerts[this.networkCountry] = true;
      this.errorMessage = "GLOBAL.ACCOUNT_SETTINGS.NO_COUNTRY";
      return false;
    } else if (!(this.networkCity)) {
      this.alerts[this.networkCity] = true;
      this.errorMessage = "COUNTRY_ADMIN.UPDATE_DETAILS.NO_CITY";
      return false;
    } else if (!(this.networkTelephone)) {
      this.alerts[this.networkTelephone] = true;
      this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.NO_PHONE";
      return false;
    } else if (this.logoFile) {
      // Check for file size
      if (this.logoFile.size > Constants.NETWORK_ADMIN_LOGO_MAX_SIZE) {
        this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.AGENCY_LOGO_SIZE_EXCEEDED";
        return false;
      }
      // Check for file type
      if (!(Constants.NETWORK_ADMIN_LOGO_FILE_TYPES.indexOf(this.logoFile.type) > -1 )) {
        this.errorMessage = "AGENCY_ADMIN.UPDATE_DETAILS.AGENCY_LOGO_INVALID_FILETYPE";
        return false;
      }
    }
    return true;
  }
}
