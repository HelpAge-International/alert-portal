import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseAuthState, AuthProviders, AuthMethods} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";
import {CustomerValidator} from "../../../utils/CustomValidator";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent implements OnInit, OnDestroy {

  private uid: string;
  authState: FirebaseAuthState;
  private successInactive: boolean = true;
  private successMessage: string = 'Password successfully updated!';
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};
  private currentPasswordEntered: string;
  private newPasswordEntered: string;
  private confirmPasswordEntered: string;
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.authState = auth;
        this.uid = auth.uid;
        console.log("System admin uid: " + this.uid);
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  onSubmit() {

    if (this.validate()) {

      this.af.auth.login({
          email: this.af.auth.getAuth().auth.email,
          password: this.currentPasswordEntered
        },
        {
          provider: AuthProviders.Password,
          method: AuthMethods.Password,
        })
        .then(() => {
          this.authState.auth.updatePassword(this.newPasswordEntered).then(() => {
            this.currentPasswordEntered = '';
            this.newPasswordEntered = '';
            this.confirmPasswordEntered = '';
            this.showAlert(false);
          }, error => {
            console.log(error.message);
          });
        })
        .catch(() => {
          this.errorMessage = 'Current password is incorrect. Please re enter';
          this.showAlert(true);
        });

    } else {
      this.showAlert(true);
    }
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
   * Returns false and specific error messages
   * @returns {boolean}
   */
  private validate() {

    this.alerts = {};
    if (!Boolean(this.currentPasswordEntered)) {
      this.alerts[this.currentPasswordEntered] = true;
      this.errorMessage = 'Please enter your current password';
      return false;
    } else if (!Boolean(this.newPasswordEntered)) {
      this.alerts[this.newPasswordEntered] = true;
      this.errorMessage = 'Please enter a new password';
      return false;
    } else if (!Boolean(this.confirmPasswordEntered)) {
      this.alerts[this.confirmPasswordEntered] = true;
      this.errorMessage = 'Please confirm your new password';
      return false;
    } else if (this.currentPasswordEntered == this.newPasswordEntered) {
      this.alerts[this.currentPasswordEntered] = true;
      this.alerts[this.newPasswordEntered] = true;
      this.errorMessage = 'You have entered the same password. Please enter a new password';
      return false;
    } else if (!CustomerValidator.PasswordValidator(this.newPasswordEntered)) {
      this.alerts[this.newPasswordEntered] = true;
      this.errorMessage = 'Password must be at 6-15 digits long with no symbols and should include at least one numeric digit';
      return false;
    } else if (this.newPasswordEntered != this.confirmPasswordEntered) {
      this.alerts[this.newPasswordEntered] = true;
      this.alerts[this.confirmPasswordEntered] = true;
      this.errorMessage = "Passwords don't match";
      return false;
    }
    return true;
  }
}
