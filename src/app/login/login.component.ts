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
  private userChecks: number = 0;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private mErrorCodes: Map<string, string> = new Map<string, string>();

  // Temporary values for the login user type.
  //  - Won't be used for anything else
  private mCheckLoginDisallowCountryId: string;
  private mCheckLoginDisallowFirstLogin: boolean;

  constructor(public af: AngularFire, private router: Router, private route: ActivatedRoute, private agencyService: AgencyService) {
    this.mErrorCodes.set("password", "LOGIN.INCORRECT_PASSWORD");
    this.mErrorCodes.set("no user record", "LOGIN.INCORRECT_EMAIL");
    this.mErrorCodes.set("blocked", "LOGIN.LOGIN_BLOCKED");
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["emailEntered"]) {
          this.successMessage = "FORGOT_PASSWORD.SUCCESS_MESSAGE";
          this.emailEntered = params["emailEntered"];
          this.showAlert(false, "");
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

          // Fire off list of calls to check if the user id exists under any one of the nodes
          // - If all of these fail, the results are aggregated in loginAllCallsFinished();
          this.loginCheckingDeactivated(success.uid, "administratorCountry", Constants.COUNTRY_ADMIN_HOME, 'country-admin/new-country/new-country-password',
            () => { this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED"); });
          this.loginChecking(success.uid, "system", Constants.SYSTEM_ADMIN_HOME);
          this.loginCheckingDeactivated(success.uid, "countryDirector", Constants.COUNTRY_ADMIN_HOME, Constants.COUNTRY_ADMIN_HOME,
            () => { this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED"); });
          this.loginChecking(success.uid, "globalDirector", Constants.G_OR_R_DIRECTOR_DASHBOARD);
          this.loginChecking(success.uid, "regionDirector", Constants.G_OR_R_DIRECTOR_DASHBOARD);
          this.loginChecking(success.uid, "globalUser", Constants.G_OR_R_DIRECTOR_DASHBOARD);
          this.loginChecking(success.uid, "countryUser", Constants.G_OR_R_DIRECTOR_DASHBOARD);
          this.loginCheckingDeactivated(success.uid, "ertLeader", Constants.COUNTRY_ADMIN_HOME, Constants.COUNTRY_ADMIN_HOME,
            () => { this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED"); });
          this.loginCheckingDeactivated(success.uid, "ert", Constants.COUNTRY_ADMIN_HOME, Constants.COUNTRY_ADMIN_HOME,
            () => { this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED"); });
          this.loginCheckingDeactivated(success.uid, "donor", Constants.DONOR_HOME, 'donor-module/donor-account-settings/new-donor-password',
            () => { this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED"); });
          this.loginCheckingAgency(success.uid, "administratorAgency", Constants.AGENCY_ADMIN_HOME, 'agency-admin/new-agency/new-agency-password');
        })

        .catch((error) => {
          // An error occured with logging in the user
          console.log(error.message);
          let ran: boolean = false;
          this.mErrorCodes.forEach((val, key) => {
            console.log(key);
            console.log(error.message.indexOf(key));
            if (error.message.indexOf(key) != -1) {
              this.showAlert(true, this.mErrorCodes.get(key));
              ran = true;
            }
          });
          if (!ran) {
            this.showAlert(true, "GLOBAL.GENERAL_LOGIN_ERROR");
          }
        });
      this.inactive = true;
    }
    else {
      this.showAlert(true, "LOGIN.VALIDATION_ERROR");
    }
  }

  /**
   * Generic login checking methods.
   */
  private loginChecking(successUid: string, userNodeName: string, directToIfSuccess: string) {
    this.loginCheckingFirstLoginValue(successUid, userNodeName, directToIfSuccess, null);
  }
  private loginCheckingFirstLoginValue(successUid: string, userNodeName: string, directToIfSuccess: string, directToIfFirst: string) {
    this.userChecks++;
    this.af.database.object(Constants.APP_STATUS + "/" + userNodeName + "/" + successUid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snapshot => {
        if (snapshot.val() != null) {
          // TODO: Logic for if it's deactivated or not
          if (directToIfFirst == null || snapshot.val().firstLogin == null || !snapshot.val().firstLogin) {
            // If there's no first directory or firstLogin is not defined or false, go to success (as if it's a regular login)
            this.router.navigateByUrl(directToIfSuccess);
          }
          else {
            // firstLogin = true, go to the first login page
            this.router.navigateByUrl(directToIfFirst);
          }
        }
        else {
          // It's not this user type. Notify the finish method
          this.loginAllCallsFinished();
        }
      });
  }
  private loginCheckingDeactivated(successUid: string, userNodeName: string, directToIfSuccess: string, directToIfFirst, disallowed: () => void) {
    this.loginCheckingCustom(successUid, userNodeName,
      (snapshot) => {
          this.mCheckLoginDisallowCountryId = snapshot.countryId;
          let x = "";
          for (let s in snapshot.agencyAdmin) {
            x = s;
          }
          return this.af.database.object(Constants.APP_STATUS + "/agency/" + x, {preserveSnapshot: true})
            .map((snap) => {
              if (snap.val() != null) {
                return snap.val().adminId;
              }
              else {
                this.showAlert(true, "LOGIN.AGENCY_DOESNT_EXIST");
              }
            })
            .flatMap((s) => {
              return this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + s + "/" + this.mCheckLoginDisallowCountryId, {preserveSnapshot: true});
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe((snaps) => {
              if (snaps.val() != null) {
                if (snaps.val().isActive) {
                  this.router.navigateByUrl(directToIfSuccess);
                }
                else {
                  disallowed();
                }
              }
              else {
                this.showAlert(true, "LOGIN.COUNTRY_OFFICE_DOESNT_EXIST");
              }
            });
      },
      (firstLoginSnapshot) => {
        this.router.navigateByUrl(directToIfFirst);
      });
  }
  private loginCheckingCustom(successUid: string, userNodeName: string, success: (snap) => void, firstLogin: (snap) => void) {
    this.userChecks++;
    this.af.database.object(Constants.APP_STATUS + "/" + userNodeName + "/" + successUid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snapshot) => {
        if (snapshot.val() != null) {
          if (snapshot.val().firstLogin != null && snapshot.val().firstLogin) {
            firstLogin(snapshot.val());
          }
          else {
            success(snapshot.val());
          }
        }
        else {
          // It's not this user type. Notify the finish method
          this.loginAllCallsFinished();
        }
      });
  }

  /**
   * Custom agency login check - Required custom /agency/ authentication for if the account is disabled or not
   */
  private loginCheckingAgency(successUid: string, userNodeName: string, directToIfSuccess: string, directToIfFirst: string) {
    this.loginCheckingCustom(successUid, userNodeName,
      (snap) => {
        this.af.database.object(Constants.APP_STATUS + "/agency/" + snap.agencyId, {preserveSnapshot: true})
          .takeUntil(this.ngUnsubscribe)
          .subscribe((snapshot) => {
            if (snapshot.val() != null) {
              if (snapshot.val().isActive != null && snapshot.val().isActive) {
                this.router.navigateByUrl(directToIfSuccess);
              }
              else {
                this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED");
              }
            }
            else {
              this.showAlert(true, "LOGIN.AGENCY_DOESNT_EXIST");
            }
          });
      },
      (snap) => {
        this.router.navigateByUrl(directToIfFirst);
      });
  }

  private loginAllCallsFinished() {
    this.userChecks--;
    if (this.userChecks <= 0) {
      // Run this logic
      this.showAlert(true, "LOGIN.USERTYPE_UNASSIGNED");
    }
  }

  private showAlert(error: boolean, errorMessage: string) {
    this.errorMessage = errorMessage;
    this.loaderInactive = true;
    if (error) {
      this.af.auth.logout();
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
