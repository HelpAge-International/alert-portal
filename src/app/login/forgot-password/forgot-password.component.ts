import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {FirebaseApp} from 'angularfire2';
import {Router} from '@angular/router';
import {Observable, Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {CustomerValidator} from "../../utils/CustomValidator";

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
  private loaderInactive: boolean = true;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(@Inject(FirebaseApp) fa: any, private router: Router) {
    this.auth = fa.auth();
  }

  ngOnInit() {
    if (Constants.SHOW_MAINTENANCE_PAGE) {
      this.router.navigateByUrl(Constants.MAINTENANCE_PAGE_URL);
    }
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  onSubmit() {

    if (this.validate()) {
      this.loaderInactive = false;
      this.auth.sendPasswordResetEmail(this.email)
        .then((success) => {
          this.loaderInactive = true;
          console.log("Password reset email sent");
          this.router.navigate(['/login', {emailEntered: this.email}]);
        })
        .catch((err) => {
          this.loaderInactive = true;
          this.errorMessage = "GLOBAL.GENERAL_ERROR";
          this.showAlert();
        });
    } else {
      this.showAlert();
    }
  }

  private showAlert() {
    this.inactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.inactive = true;
    });
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
