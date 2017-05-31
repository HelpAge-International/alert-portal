import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../utils/Constants";
import {Observable, Subject} from "rxjs";
import {CustomerValidator} from "../utils/CustomValidator";
import {AgencyService} from "../services/agency-service.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AgencyService]
})
export class LoginComponent implements OnInit, OnDestroy {

  private loaderInactive: boolean = true;
  private inactive: boolean = true;
  private errorMessage: string;
  private successInactive: boolean = true;
  private successMessage: string;
  private alerts = {};
  private emailEntered: string;
  private localUser = {
    userEmail: '',
    password: ''
  };

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public af: AngularFire, private router: Router, private route: ActivatedRoute, private agencyService: AgencyService) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["emailEntered"]) {
          this.successMessage = "FORGOT_PASSWORD.SUCCESS_MESSAGE";
          this.emailEntered = params["emailEntered"];
          this.showAlert(false);
          console.log("From Forgot Password");
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loaderInactive = true;
  }

  onSubmit() {
    this.loaderInactive = false;
    this.successInactive = true;
    if (this.validate()) {
      this.af.auth.login({
          email: this.localUser.userEmail,
          password: this.localUser.password
        },
        {
          provider: AuthProviders.Password,
          method: AuthMethods.Password,
        })
        .then((success) => {

          this.af.database.list(Constants.APP_STATUS + '/system', {preserveSnapshot: true})
            .takeUntil(this.ngUnsubscribe)
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                if (snapshot.key == success.uid) {
                  this.router.navigateByUrl(Constants.SYSTEM_ADMIN_HOME);
                }
              });
              this.af.database.list(Constants.APP_STATUS + '/administratorAgency', {preserveSnapshot: true})
                .takeUntil(this.ngUnsubscribe)
                .subscribe(snapshots => {
                  snapshots.forEach(snapshot => {
                    if (snapshot.key == success.uid) {

                      this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + snapshot.key + '/firstLogin')
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe((value) => {
                          let firstLogin: boolean = value.$value;
                          if (firstLogin) {
                            this.router.navigateByUrl('agency-admin/new-agency/new-agency-password');
                          } else {
                            this.agencyService.getAgencyId(snapshot.key)
                              .takeUntil(this.ngUnsubscribe)
                              .subscribe(agencyId => {
                                this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId + '/isActive')
                                  .takeUntil(this.ngUnsubscribe)
                                  .subscribe((value) => {
                                    let isActive: boolean = value.$value;
                                    if (isActive) {
                                      this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
                                    } else {
                                      this.errorMessage = 'Your account is deactivated - Please check with your system administrator'; // TODO - Translate
                                      this.showAlert(true);
                                    }
                                  });
                              });
                          }
                        });
                    }
                  });
                  this.af.database.list(Constants.APP_STATUS + '/administratorCountry', {preserveSnapshot: true})
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(snapshots => {
                      snapshots.forEach(snapshot => {
                        if (snapshot.key == success.uid) {
                          this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + snapshot.key + '/firstLogin')
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe((value) => {
                              let firstLogin: boolean = value.$value;
                              if (firstLogin) {
                                this.router.navigateByUrl('country-admin/new-country/new-country-password');
                              } else {
                                this.router.navigateByUrl(Constants.COUNTRY_ADMIN_HOME);
                              }
                            });
                        }
                      });
                      this.af.database.list(Constants.APP_STATUS + '/countryDirector', {preserveSnapshot: true})
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(snapshots => {
                          snapshots.forEach(snapshot => {
                            if (snapshot.key == success.uid) {
                              this.router.navigateByUrl(Constants.COUNTRY_ADMIN_HOME);
                            }
                          });
                          this.errorMessage = "LOGIN.UNRECOGNISED_ERROR";
                          this.showAlert(true);
                        });
                    });
                });
            });
        })
        .catch((error) => {
          // error.message can't be used here as they won't be translated. A global message is shown here instead.
          this.errorMessage = "GLOBAL.GENERAL_ERROR";
          console.log(error.message);
          this.showAlert(true);
        });
      this.inactive = true;
    }
    else {
      this.showAlert(true);
    }
  }

  private showAlert(error: boolean) {
    this.loaderInactive = true;
    if (error) {
      this.inactive = false;
      Observable.timer(Constants.ALERT_DURATION)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(() => {
          this.inactive = true;
        });
    } else {
      this.successInactive = false;
      Observable.timer(Constants.ALERT_DURATION)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(() => {
          this.successInactive = true;
        });
    }
  }

  /**
   * Returns false and specific error messages-
   * if no input is entered,
   * if the email field is empty,
   * if the password field is empty,
   * @returns {boolean}
   */
  validate() {
    if ((!(this.localUser.userEmail)) && (!(this.localUser.password))) {
      this.alerts[this.localUser.userEmail] = true;
      this.alerts[this.localUser.password] = true;
      this.errorMessage = "LOGIN.NO_DATA_ERROR";
      return false;
    } else if (!(this.localUser.userEmail)) {
      this.alerts[this.localUser.userEmail] = true;
      this.errorMessage = "LOGIN.NO_EMAIL_ERROR";
      return false;
    } else if (!CustomerValidator.EmailValidator(this.localUser.userEmail)) {
      this.alerts[this.localUser.userEmail] = true;
      this.errorMessage = "GLOBAL.EMAIL_NOT_VALID";
      return false;
    } else if (!(this.localUser.password)) {
      this.alerts[this.localUser.password] = true;
      this.errorMessage = "LOGIN.NO_PASSWORD_ERROR";
      return false;
    }
    return true;
  }
}
