import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {PersonTitle} from "../../utils/Enums";
import {ModelUserPublic} from "../../model/user-public.model";
import {RxHelper} from "../../utils/RxHelper";
import {Observable} from "rxjs";
import {CustomerValidator} from "../../utils/CustomValidator";

@Component({
  selector: 'app-agency-account-settings',
  templateUrl: './agency-account-settings.component.html',
  styleUrls: ['./agency-account-settings.component.css']
})

export class AgencyAccountSettingsComponent implements OnInit, OnDestroy {

  private uid: string;
  authState: FirebaseAuthState;
  private successInactive: boolean = true;
  private successMessage: string = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
  private errorInactive: boolean = true;
  private errorMessage: string = 'No changes made!';
  private alerts = {};
  private userPublic: ModelUserPublic;
  private systemAdminTitle: number = 0;
  private systemAdminFirstName: string;
  private systemAdminLastName: string;
  private systemAdminEmail: string;
  private systemAdminPhone: string;
  private PersonTitle = Constants.PERSON_TITLE;
  private personTitleList: number[] = [PersonTitle.Mr, PersonTitle.Mrs, PersonTitle.Miss, PersonTitle.Dr, PersonTitle.Prof];
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.authState = auth;
        this.uid = auth.uid;
        console.log("Agency admin uid: " + this.uid);
        this.loadAgencyAdminData(this.uid);
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }


  private loadAgencyAdminData(uid) {

    let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + uid).subscribe((systemAdmin: ModelUserPublic) => {

      this.userPublic = systemAdmin;
      this.systemAdminTitle = systemAdmin.title;
      this.systemAdminFirstName = systemAdmin.firstName;
      this.systemAdminLastName = systemAdmin.lastName;
      this.systemAdminEmail = systemAdmin.email;
      this.systemAdminPhone = systemAdmin.phone;
    });
    this.subscriptions.add(subscription);
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
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validate() {

    this.alerts = {};
    if (!(this.systemAdminFirstName)) {
      this.alerts[this.systemAdminFirstName] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_F_NAME';
      return false;
    } else if (!(this.systemAdminLastName)) {
      this.alerts[this.systemAdminLastName] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_L_NAME';
      return false;
    } else if (!(this.systemAdminEmail)) {
      this.alerts[this.systemAdminEmail] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_EMAIL';
      return false;
    } else if (!CustomerValidator.EmailValidator(this.systemAdminEmail)) {
      this.alerts[this.systemAdminEmail] = true;
      this.errorMessage = "GLOBAL.EMAIL_NOT_VALID";
      return false;
    }
    return true;
  }
}
