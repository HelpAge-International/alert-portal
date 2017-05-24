import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseAuthState, AuthProviders, AuthMethods} from 'angularfire2';
import {Router} from '@angular/router';
import {Constants} from '../../../utils/Constants';
import {Observable, Subject} from 'rxjs';
import {CustomerValidator} from '../../../utils/CustomValidator';

@Component({
  selector: 'app-new-agency-password',
  templateUrl: './new-agency-password.component.html',
  styleUrls: ['./new-agency-password.component.css']
})

export class NewAgencyPasswordComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyAdminName: string;

  private successInactive: boolean = true;
  private successMessage: string = "GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD";
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};

  private passwordEntered: string;
  private confirmPasswordEntered: string;

  private authState: FirebaseAuthState;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {

    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        this.authState = auth;
        this.uid = auth.uid;
        console.log('New agency admin uid: ' + this.uid);
        this.af.database.object(Constants.APP_STATUS+"/userPublic/" + this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
          this.agencyAdminName = user.firstName;
        });
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {

    if (this.validate()) {
      this.authState.auth.updatePassword(this.passwordEntered).then(() => {
        this.successInactive = false;
        Observable.timer(Constants.ALERT_REDIRECT_DURATION)
          .takeUntil(this.ngUnsubscribe).subscribe(() => {
          this.successInactive = true;
          this.router.navigateByUrl('/agency-admin/new-agency/new-agency-details');
        });
      }, error => {
        console.log(error.message);
      });
    } else {
      this.showAlert();
    }
  }

  private showAlert() {

    this.errorInactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.errorInactive = true;
    });
  }

  /**
   * Returns false and specific error messages
   * @returns {boolean}
   */
  private validate() {

    this.alerts = {};
    if (!(this.passwordEntered)) {
      this.alerts[this.passwordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_NEW_PASSWORD';
      return false;
    } else if (!(this.confirmPasswordEntered)) {
      this.alerts[this.confirmPasswordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_CONFIRM_PASSWORD';
      return false;
    } else if (!CustomerValidator.PasswordValidator(this.passwordEntered)) {
      this.alerts[this.passwordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.INVALID_PASSWORD';
      return false;
    } else if (this.passwordEntered != this.confirmPasswordEntered) {
      this.alerts[this.passwordEntered] = true;
      this.alerts[this.confirmPasswordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.UNMATCHED_PASSWORD';
      return false;
    }
    return true;
  }

}
