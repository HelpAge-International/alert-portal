import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {FirebaseApp} from 'angularfire2';
import {Router} from '@angular/router';
import {Observable} from "rxjs";
import {Constants} from "../../utils/Constants";
import {CustomerValidator} from "../../utils/CustomValidator";
import {RxHelper} from "../../utils/RxHelper";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {

  private inactive: Boolean = true;
  private errorMessage: any;
  private alerts = {};
  private email: string = '';
  private auth: any;
  private subscriptions: RxHelper;

  constructor(@Inject(FirebaseApp) fa: any, private router: Router) {
    this.auth = fa.auth();
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  onSubmit() {

    if (this.validate()) {

      this.auth.sendPasswordResetEmail(this.email)
        .then((success) => {
          console.log("Password reset email sent");
          this.router.navigate(['/login', {emailEntered: this.email}]);
        })
        .catch((err) => {
          this.errorMessage = "GLOBAL.GENERAL_ERROR";
          this.showAlert();
        });

      this.inactive = true;

    } else {
      this.showAlert();
    }
  }

  private showAlert() {
    this.inactive = false;
    let subscription = Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
      this.inactive = true;
    });
    this.subscriptions.add(subscription);
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  validate() {

    if (!(this.email)) {
      this.alerts[this.email] = true;
      this.errorMessage = "FORGOT_PASSWORD.NO_EMAIL_ERROR";
      return false;
    } else if (!CustomerValidator.EmailValidator(this.email)) {
      this.alerts[this.email] = true;
      this.errorMessage = "GLOBAL.EMAIL_NOT_VALID";
      return false;
    }
    return true;

  }



}
