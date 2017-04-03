import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseAuthState, AuthProviders, AuthMethods} from 'angularfire2';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-agency-account-settings',
  templateUrl: './agency-account-settings.component.html',
  styleUrls: ['./agency-account-settings.component.css']
})
export class AgencyAccountSettingsComponent implements OnInit, OnDestroy {

  private uid: string;
  authState: FirebaseAuthState;
  private successInactive: boolean = true;
  private successMessage: string = 'SYSTEM_ADMIN.ACCOUNT_SETTINGS.SUCCESS_PASSWORD';
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
        console.log('Agency admin uid: ' + this.uid);
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
          this.errorMessage = 'SYSTEM_ADMIN.ACCOUNT_SETTINGS.INCORRECT_CURRENT_PASSWORD';
          this.showAlert(true);
        });

    } else {
      this.showAlert(true);
    }
  }
}
