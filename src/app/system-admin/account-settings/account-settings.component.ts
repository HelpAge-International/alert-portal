
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {PersonTitle} from "../../utils/Enums";
import {ModelUserPublic} from "../../model/user-public.model";
import {CustomerValidator} from "../../utils/CustomValidator";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})

export class AccountSettingsComponent implements OnInit, OnDestroy {

  private uid: string;
  authState: FirebaseAuthState;
  private successInactive: boolean = true;
  private successMessage: string = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};
  private userPublic: ModelUserPublic;
  private systemAdminTitle: number = 0;
  private systemAdminFirstName: string;
  private systemAdminLastName: string;
  private systemAdminEmail: string;
  private systemAdminPhone: string;
  private PersonTitle = Constants.PERSON_TITLE;
  private personTitleList: number[] = Constants.PERSON_TITLE_SELECTION;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authObj(this.ngUnsubscribe, this.route, this.router, (auth, userType) => {
        this.authState = auth;
        this.uid = auth.uid;
        console.log("System admin uid: " + this.uid);
        this.loadSystemAdminData(this.uid);
    });
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  onSubmit() {

    if (this.validate()) {

      if (this.userPublic) {
        var editedUser: ModelUserPublic = new ModelUserPublic(this.systemAdminFirstName, this.systemAdminLastName, this.systemAdminTitle, this.systemAdminEmail);
        editedUser.phone = this.systemAdminPhone;

        let noChanges: boolean = editedUser.title == this.userPublic.title && editedUser.firstName == this.userPublic.firstName && editedUser.lastName == this.userPublic.lastName
          && editedUser.email == this.userPublic.email && editedUser.phone == this.userPublic.phone;

        if (noChanges) {
          this.errorMessage = 'GLOBAL.NO_CHANGES_MADE';
          this.showAlert(true);
        } else {
          this.authState.auth.updateEmail(this.systemAdminEmail).then(_ => {
            this.af.database.object(Constants.APP_STATUS+'/userPublic/' + this.uid).update(editedUser).then(() => {
              this.showAlert(false)
            }, error => {
              this.errorMessage = 'GLOBAL.GENERAL_ERROR';
              this.showAlert(true);
              console.log(error.message);
            });
          })
        }
      }
    } else {
      this.showAlert(true);
    }
  }

  private loadSystemAdminData(uid) {

    this.af.database.object(Constants.APP_STATUS+"/userPublic/" + uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((systemAdmin: ModelUserPublic) => {

      this.userPublic = systemAdmin;
      this.systemAdminTitle = systemAdmin.title;
      this.systemAdminFirstName = systemAdmin.firstName;
      this.systemAdminLastName = systemAdmin.lastName;
      this.systemAdminEmail = systemAdmin.email;
      this.systemAdminPhone = systemAdmin.phone;
    });
  }

  private showAlert(error: boolean) {
    if (error) {
      this.errorInactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
        this.errorInactive = true;
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
