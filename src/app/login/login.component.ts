import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, AuthMethods, AuthProviders} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
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
  private ngUnsubscribe: Subject<any> = new Subject<any>();
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

          // Check if we are a network admin!
          this.checkNetworkLogin(success.uid,
            (isNetworkAdmin: boolean, isNetworkCountryAdmin: boolean) => {    // NETWORK ADMIN LOGIN
              console.log("Network Admin Login detected!");
              this.regularLogin(success.uid);
            },
            () => {                                                           // REGULAR LOGIN
              this.regularLogin(success.uid);
            })

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
   * Network login checking methods
   */
  private NETWORK_NODE_ADMIN = "networkAdmin";
  private NETWORK_NODE_COUNTRY_ADMIN = "networkCountryAdmin";
  private networkCount = 0;
  private networkAdmin: boolean = false;
  private networkCountryAdmin: boolean = false;

  private checkNetworkLogin(successUid: string, isNetwork: (isNetworkAdmin: boolean, isNetworkCountryAdmin: boolean) => void, isNotNetwork: () => void) {
    this.networkCount = 0;
    this.checkNetworkLoginNode(successUid, this.NETWORK_NODE_ADMIN, isNetwork, isNotNetwork);
    this.checkNetworkLoginNode(successUid, this.NETWORK_NODE_COUNTRY_ADMIN, isNetwork, isNotNetwork);
  }

  private checkNetworkLoginNode(successUid: string, userNode: string, isNetwork: (isNetworkAdmin: boolean, isNetworkCountryAdmin: boolean) => void, isNotNetwork: () => void) {
    this.networkCount++;
    this.af.database.object(Constants.APP_STATUS + "/" + userNode + "/" + successUid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (userNode == this.NETWORK_NODE_ADMIN) {
          this.networkAdmin = (snap.val() != null);
        }
        else if (userNode == this.NETWORK_NODE_COUNTRY_ADMIN) {
          this.networkCountryAdmin = (snap.val() != null);
        }
        this.checkNetworkAll(isNetwork, isNotNetwork);
      })
  }

  private checkNetworkAll(isNetwork: (isNetworkAdmin: boolean, isNetworkCountryAdmin: boolean) => void, isNotNetwork: () => void) {
    this.networkCount--;
    if (this.networkCount == 0) {
      // Final method!
      if (!this.networkAdmin && !this.networkCountryAdmin) {
        isNotNetwork();
      }
      else {
        isNetwork(this.networkAdmin, this.networkCountryAdmin);
      }
    }
  }

  /**
   * Generic login checking methods.
   */
  private regularLogin(successUid: string) {
    // Fire off list of calls to check if the user id exists under any one of the nodes
    // - If all of these fail, the results are aggregated in loginAllCallsFinished();
    // loginCheckingDeactivate params
    // => my id,
    // => user type path,
    // => go to if success,
    // => go to if first login,
    // => actions if the account is disabled()
    // loginChecking params
    // => my id,
    // => user type path,
    // => go to if success
    // loginCheckingAgency params
    // => my id,
    // => user type path,
    // => go to if success
    // => go to if first login
    this.loginCheckingFirstLoginValue(successUid, "globalDirector", Constants.G_OR_R_DIRECTOR_DASHBOARD, 'new-user-password');
    this.loginCheckingFirstLoginValue(successUid, "regionDirector", Constants.G_OR_R_DIRECTOR_DASHBOARD, 'new-user-password');
    this.loginCheckingFirstLoginValue(successUid, "globalUser", Constants.G_OR_R_DIRECTOR_DASHBOARD, 'new-user-password');
    this.loginCheckingFirstLoginValue(successUid, "countryUser", Constants.G_OR_R_DIRECTOR_DASHBOARD, 'new-user-password');
    this.loginCheckingFirstLoginValue(successUid, "partnerUser", Constants.COUNTRY_ADMIN_HOME, 'new-user-password');
    this.loginChecking(successUid, "system", Constants.SYSTEM_ADMIN_HOME);
    this.loginCheckingDeactivated(successUid, "administratorCountry",
      Constants.COUNTRY_ADMIN_HOME, 'country-admin/new-country/new-country-password',
      () => {
        this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED");
      });
    this.loginCheckingDeactivated(successUid, "countryDirector",
      Constants.COUNTRY_ADMIN_HOME, 'new-user-password',
      () => {
        this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED");
      });
    this.loginCheckingDeactivated(successUid, "ertLeader",
      Constants.COUNTRY_ADMIN_HOME, 'new-user-password',
      () => {
        this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED");
      });
    this.loginCheckingDeactivated(successUid, "ert",
      Constants.COUNTRY_ADMIN_HOME, 'new-user-password',
      () => {
        this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED");
      });
    // this.loginCheckingDeactivated(successUid, "donor",
    //   Constants.DONOR_HOME, 'donor-module/donor-account-settings/new-donor-password',
    //   () => {
    //     this.showAlert(true, "LOGIN.AGENCY_DEACTIVATED");
    //   });
    this.loginCheckingFirstLoginValue(successUid, "donor", Constants.DONOR_HOME, 'new-user-password');
    this.loginCheckingAgency(successUid, "administratorAgency",
      Constants.AGENCY_ADMIN_HOME, 'agency-admin/new-agency/new-agency-password');
  }

  // Override method for checking the login. Just passes it to below with no firstLogin dir
  private loginChecking(successUid: string, userNodeName: string, directToIfSuccess: string) {
    this.loginCheckingFirstLoginValue(successUid, userNodeName, directToIfSuccess, null);
  }

  // Login checking if a firstLogin: true field exists.
  private loginCheckingFirstLoginValue(successUid: string, userNodeName: string, directToIfSuccess: string, directToIfFirst: string) {
    this.userChecks++;
    this.af.database.object(Constants.APP_STATUS + "/" + userNodeName + "/" + successUid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snapshot => {
        if (snapshot.val() != null) {
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
              return snap.key;
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

  // Login with some custom behaviour on success / first login hit.
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


  /**
   * Method ran when the login calls are finished for the system
   */
  private loginAllCallsFinished() {
    this.userChecks--;
    if (this.userChecks <= 0) {
      // Run this logic. This happens when it's none of the detected user types!
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
