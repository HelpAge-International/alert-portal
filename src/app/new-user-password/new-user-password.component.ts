import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {Constants} from "../utils/Constants";
import {PageControlService} from "../services/pagecontrol.service";
import {CustomerValidator} from "../utils/CustomValidator";
import {UserType} from "../utils/Enums";

@Component({
  selector: 'app-new-user-password',
  templateUrl: 'new-user-password.component.html',
  styleUrls: ['new-user-password.component.css']
})

export class NewUserPasswordComponent implements OnInit, OnDestroy {

  private uid: string;
  private userType;
  private firstNameToShow: string;

  private successInactive: boolean = true;
  private successMessage: string = "GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD";
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};

  private passwordEntered: string;
  private confirmPasswordEntered: string;

  private authState: FirebaseAuthState;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authObj(this.ngUnsubscribe, this.route, this.router, (auth, userType) => {
      this.authState = auth;
      this.uid = auth.auth.uid;
      this.userType = userType;

      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.firstNameToShow = user.firstName;
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {

    if (this.validate()) {
      this.authState.auth.updatePassword(this.passwordEntered).then(() => {

        let directorData = {};
        directorData["/" + Constants.USER_PATHS[this.userType] + "/" + this.uid + '/firstLogin'] = false;

        this.af.database.object(Constants.APP_STATUS).update(directorData).then(() => {
          this.successInactive = false;
          Observable.timer(Constants.ALERT_REDIRECT_DURATION)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
              this.successInactive = true;

              if (
                (this.userType == UserType.GlobalDirector) ||
                (this.userType == UserType.RegionalDirector) ||
                (this.userType == UserType.GlobalUser) ||
                (this.userType == UserType.CountryUser)) {
                this.router.navigateByUrl(Constants.G_OR_R_DIRECTOR_DASHBOARD);
              }

            });

        }, error => {
          this.errorMessage = 'GLOBAL.GENERAL_ERROR';
          this.showAlert();
          console.log(error.message);
        });

      }, error => {
        console.log("An error occurred -- " + error.message);
        this.router.navigateByUrl('/login');
      });
    } else {
      this.showAlert();
    }
  }

  private showAlert() {

    this.errorInactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
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

