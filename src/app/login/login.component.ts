
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {AngularFire, AuthMethods, AuthProviders} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../utils/Constants";
import {CustomerValidator} from "../utils/CustomValidator";
import {AgencyService} from "../services/agency-service.service";
import {LocalStorageService} from "angular-2-local-storage";
import {NetworkService} from "../services/network.service";
import * as firebase from "firebase";

declare var jQuery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AgencyService]
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('cookieLaw')
  private cookieLawEl: any;

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
  private uid: string;
  private cocText: string;
  private tocText: string;

  public version = Constants.VERSION;

  public isLive: boolean = Constants.APP_STATUS == '/live';
  public environmentLabel: string = Constants.APP_STATUS.substr(1);

  // Temporary values for the login user type.
  //  - Won't be used for anything else
  private mCheckLoginDisallowCountryId: string;
  private mCheckLoginDisallowFirstLogin: boolean;

  constructor(public af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private networkService: NetworkService,
              private storageService: LocalStorageService,
              private agencyService: AgencyService) {
    this.mErrorCodes.set("password", "LOGIN.INCORRECT_PASSWORD");
    this.mErrorCodes.set("no user record", "LOGIN.INCORRECT_EMAIL");
    this.mErrorCodes.set("blocked", "LOGIN.LOGIN_BLOCKED");
  }

  ngOnInit() {

    console.log(this.isLive + " - " + this.environmentLabel);
    //clear local storage
    this.storageService.remove(Constants.NETWORK_VIEW_SELECTED_ID, Constants.NETWORK_VIEW_SELECTED_ID)

    if (Constants.SHOW_MAINTENANCE_PAGE) {
      this.router.navigateByUrl(Constants.MAINTENANCE_PAGE_URL);
    } else {
      this.route.params.pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe((params: Params) => {
          if (params["emailEntered"]) {
            this.successMessage = "FORGOT_PASSWORD.SUCCESS_MESSAGE";
            this.emailEntered = params["emailEntered"];
            this.showAlert(false, "");
          }
        });
    }
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
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {

          this.af.auth.login({
              email: this.localUser.userEmail,
              password: this.localUser.password
            },
            {
              provider: AuthProviders.Password,
              method: AuthMethods.Password,
            })
            .then((success) => {
              this.uid = success.uid;
              // this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid, {preserveSnapshot: true})
              //   .take(1)
              //   .subscribe((snap) => {
              // const data = {
              //   "latestCoCAgreed": true,
              //   "latestToCAgreed": true
              // };
              // this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid+"/latestCoCAgreed").set(true)
              // this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid+"/latestToCAgreed").set(true);
              // this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid).update(data).then(() => {
              this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid, {preserveSnapshot: true})
                .subscribe((snap) => {
                  console.log("PROCESSING!!");
                  console.log(snap.val());
                  if (snap.val() && (snap.val().latestCoCAgreed == null || snap.val().latestCoCAgreed == false)) {
                    this.showCoC();
                  } else {
                    let isAgencyAdmin: boolean = false;
                    this.af.database.list(Constants.APP_STATUS + "/administratorAgency/")
                      .take(1)
                      .subscribe(snapshots => {
                        console.log(snapshots);
                        snapshots.forEach(snap => {
                          if (!isAgencyAdmin) {
                            isAgencyAdmin = snap != null && snap.$key == this.uid;
                          }
                        });
                        if (isAgencyAdmin) {
                          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid, {preserveSnapshot: true})
                            .take(1)
                            .subscribe((snap) => {
                              if (snap.val() && (snap.val().latestToCAgreed == null || snap.val().latestToCAgreed == false)) {
                                this.showToC();
                              } else {
                                this.checkLogins();
                              }
                            });

                        } else {
                          this.checkLogins();
                        }
                      });
                  }
                });
              // }
              // })
              // });
            })
            .catch((error) => {
              // An error occured with logging in the user
              console.log(error.message);
              let ran: boolean = false;
              this.mErrorCodes.forEach((val, key) => {
                if (error.message.indexOf(key) != -1) {
                  this.showAlert(true, this.mErrorCodes.get(key));
                  ran = true;
                }
              });
              if (!ran) {
                this.showAlert(true, "GLOBAL.GENERAL_LOGIN_ERROR");
              }
            });
        });

      this.inactive = true;
    }
    else {
      this.showAlert(true, "LOGIN.VALIDATION_ERROR");
    }
  }

  private showCoC() {
    this.af.database.object(Constants.APP_STATUS + "/system/systemAdminId", {preserveSnapshot: true})
      .take(1)
      .subscribe((systemAdminId) => {
        this.af.database.object(Constants.APP_STATUS + "/system/" + systemAdminId.val(), {preserveSnapshot: true})
          .take(1)
          .subscribe((snap) => {
            if (snap) {
              this.cocText = snap.val().coc;
              this.loaderInactive = true;
              jQuery("#coc-window").modal("show");
            } else {
              this.checkLogins();
            }
          });
      });
  }

  private showToC() {
    this.af.database.object(Constants.APP_STATUS + "/system/systemAdminId", {preserveSnapshot: true})
      .take(1)
      .subscribe((systemAdminId) => {
        this.af.database.object(Constants.APP_STATUS + "/system/" + systemAdminId.val(), {preserveSnapshot: true})
          .take(1)
          .subscribe((snap) => {
            if (snap) {
              this.tocText = snap.val().toc;
              console.log(this.tocText);
              this.loaderInactive = true;
              jQuery("#toc-window").modal("show");
            } else {
              this.checkLogins();
            }
          });
      });
  }

  onAgreeCoC() {
    this.loaderInactive = false;
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/latestCoCAgreed").set(true);
    let isAgencyAdmin: boolean = false;
    this.af.database.list(Constants.APP_STATUS + "/administratorAgency/")
      .take(1)
      .subscribe(snapshots => {
        console.log(snapshots);
        snapshots.forEach(snap => {
          if (!isAgencyAdmin) {
            isAgencyAdmin = snap != null && snap.$key == this.uid;
          }
        });
        if (isAgencyAdmin) {
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid, {preserveSnapshot: true})
            .take(1)
            .subscribe((snap) => {
              if (snap.val() && (snap.val().latestToCAgreed == null || snap.val().latestToCAgreed == false)) {
                this.showToC();
              } else {
                this.checkLogins();
              }
            });
        } else {
          this.checkLogins();
        }
      });
  }

  onAgreeToC() {
    this.loaderInactive = false;
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/latestToCAgreed").set(true);
    this.checkLogins();
  }

  private checkLogins() {
    this.checkNetworkLogin(this.uid, (isNetworkAdmin: boolean, isNetworkCountryAdmin: boolean) => {    // NETWORK ADMIN LOGIN
      this.router.navigateByUrl("network/network-account-selection")
    }, () => {// REGULAR LOGIN
      this.regularLogin(this.uid);
    })
  }

  /**
   * Network login checking methods
   */
  private NETWORK_NODE_ADMIN = "administratorNetwork";
  private NETWORK_NODE_COUNTRY_ADMIN = "administratorNetworkCountry";
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
          if (snap.val() && snap.val().networkIds) {
            Object.keys(snap.val().networkIds).forEach(networkId => {
              this.networkCount++
              this.networkService.getNetworkDetail(networkId).pipe(
                takeUntil(this.ngUnsubscribe))
                .subscribe(network => {
                  if (network.isActive) {
                    this.networkAdmin = true
                  }
                  this.checkNetworkAll(isNetwork, isNotNetwork);
                })
            })
          } else {
            this.networkCount++
            this.checkNetworkAll(isNetwork, isNotNetwork);
          }
        }
        else if (userNode == this.NETWORK_NODE_COUNTRY_ADMIN) {
          if (snap.val() && snap.val().networkCountryIds) {
            let countryList = Object.keys(snap.val().networkCountryIds).map(networkId => {
              let obj = {}
              let networkCountryIds = Object.keys(snap.val().networkCountryIds[networkId]);
              obj["networkId"] = networkId
              obj["networkCountryIds"] = networkCountryIds
              return obj
            }).map(obj => {
              let tempList = []
              obj["networkCountryIds"].forEach(networkCountryId => {
                let subObj = {}
                subObj["networkId"] = obj["networkId"]
                subObj["networkCountryId"] = networkCountryId
                tempList.push(subObj)
              })
              return tempList
            }).reduce((accumulator, current) => {
              return accumulator.concat(current)
            })
            countryList.forEach(obj => {
              this.networkCount++

              this.networkService.getNetworkDetail(obj["networkId"]).pipe(
                takeUntil(this.ngUnsubscribe))
                .subscribe(network => {
                  if (network.isActive) {
                    this.networkService.getNetworkCountry(obj["networkId"], obj["networkCountryId"]).pipe(
                      takeUntil(this.ngUnsubscribe))
                      .subscribe(networkCountry => {
                        if (networkCountry.isActive) {
                          this.networkCountryAdmin = true
                        }
                        this.checkNetworkAll(isNetwork, isNotNetwork);
                      })
                  } else {
                    this.checkNetworkAll(isNetwork, isNotNetwork);
                  }
                })
            })
          } else {
            this.networkCount++
            this.checkNetworkAll(isNetwork, isNotNetwork);
          }
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
    this.loginCheckingFirstLoginValue(successUid, "localAgencyDirector", 'local-agency/dashboard', 'new-user-password');
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
    this.loginCheckingDeactivated(successUid, "localAgencyDirector",
      Constants.LOCAL_AGENCY_ADMIN_HOME, 'new-user-password',
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
          if (snapshot.val().firstLogin == null && userNodeName == "partnerUser") {
            this.router.navigateByUrl(directToIfFirst);
          }
          else if (directToIfFirst == null || snapshot.val().firstLogin == null || !snapshot.val().firstLogin) {
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
              // this.showAlert(true, "LOGIN.COUNTRY_OFFICE_DOESNT_EXIST");
              console.log("COUNTRY_OFFICE_DOESNT_EXIST")
              this.router.navigateByUrl(Constants.LOCAL_AGENCY_ADMIN_HOME);
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
        console.log(snapshot.val())
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
                if (snapshot.val().hasOwnProperty('isGlobalAgency')) {
                  if (snapshot.val().isGlobalAgency) {
                    this.router.navigateByUrl(directToIfSuccess);
                  } else {
                    this.router.navigateByUrl('/local-agency/dashboard');
                  }
                } else {
                  this.router.navigateByUrl(directToIfSuccess);
                }

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
        console.log(directToIfFirst)
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
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.inactive = true;
        });
    } else {
      this.successInactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe))
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
      this.errorMessage = "FORGOT_PASSWORD.NO_EMAIL_ERROR";
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

  public seenCookiePolicy(seen: any) {
    if (seen) {
      this.cookieLawEl.dismiss();
    }
  }
}
