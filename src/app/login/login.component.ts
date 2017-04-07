import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../utils/Constants";
import {RxHelper} from "../utils/RxHelper";
import {Observable} from "rxjs";
import {CustomerValidator} from "../utils/CustomValidator";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  private loaderInactive: Boolean = true;
  private inactive: Boolean = true;
  private errorMessage: string;
  private successInactive: Boolean = true;
  private successMessage: string;
  private alerts = {};
  private emailEntered: string;
  private subscriptions: RxHelper;
  private localUser = {
    userEmail: '',
    password: ''
  };
  constructor(public af: AngularFire, private router: Router, private route: ActivatedRoute) {
    this.subscriptions = new RxHelper();
  }
  ngOnInit() {
    let subscription = this.route.params
      .subscribe((params: Params) => {
        if (params["emailEntered"]) {
          this.successMessage = "FORGOT_PASSWORD.SUCCESS_MESSAGE";
          this.emailEntered = params["emailEntered"];
          this.showAlert(false);
          console.log("From Forgot Password");
        }
      });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.loaderInactive = true;
    this.subscriptions.releaseAll();
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
          this.af.database.list(Constants.APP_STATUS+'/systemAdmin', {preserveSnapshot: true})
              .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                if (snapshot.key == success.uid) {
                  this.router.navigateByUrl(Constants.SYSTEM_ADMIN_HOME);
                }
              });
            });
          this.af.database.list(Constants.APP_STATUS+'/administratorAgency', {preserveSnapshot: true})
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                if (snapshot.key == success.uid) {
                  this.router.navigateByUrl(Constants.AGENCY_ADMIN_HOME);
                }
              });
            });
          this.af.database.list(Constants.APP_STATUS+'/administratorCountry', {preserveSnapshot: true})
            .subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                if (snapshot.key == success.uid) {
                  this.router.navigateByUrl("/country-admin");
                }
              });
            });
        })
        .catch((err) => {
          // err.message can't be used here as they won't be translated. A global message is shown here instead.
          this.errorMessage = "GLOBAL.GENERAL_ERROR";
          this.showAlert(true);
        });
      this.inactive = true;
    } else {
      this.showAlert(true);
    }
  }
  private showAlert(error: boolean) {
    if (error) {
      this.inactive = false;
      let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.inactive = true;
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
