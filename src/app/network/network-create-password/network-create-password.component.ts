import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {PageControlService} from "../../services/pagecontrol.service";
import {Constants} from "../../utils/Constants";
import {Observable, Subject} from "rxjs";
import {CustomerValidator} from "../../utils/CustomValidator";

@Component({
  selector: 'app-network-create-password',
  templateUrl: './network-create-password.component.html',
  styleUrls: ['./network-create-password.component.css']
})

export class NetworkCreatePasswordComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private passwordEntered: string;
  private confirmPasswordEntered: string;
  private successInactive: boolean = true;
  private successMessage: string = "GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD";
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};
  private authState: firebase.User;
  private uid: string;
  private networkAdminName: string;

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute) {

  }

  /**
   * Lifecycle functions
   * */

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user, prevUserType, networkIds, networkCountryIds) => {
        console.log("Authenticated: " + user.uid);
        this.authState = user;
        this.uid = user.uid;
        console.log('New network admin uid: ' + this.uid);
        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
            this.networkAdminName = user.firstName;
          });
      });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Action functions
   * */

  onSubmit() {
    if (this.validate()) {
      this.authState.updatePassword(this.passwordEntered).then(() => {
        this.successInactive = false;
        Observable.timer(Constants.ALERT_REDIRECT_DURATION)
          .takeUntil(this.ngUnsubscribe).subscribe(() => {
          this.successInactive = true;
          this.router.navigateByUrl('network/network-account-selection');
        });
      }, error => {
        console.log(error.message);
      });
    } else {
      this.showAlert();
    }
  }

  /**
   * Utility functions
   * */

  private showAlert() {

    this.errorInactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.errorInactive = true;
    });
  }


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
