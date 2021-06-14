
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit, Input} from "@angular/core";
//import {AngularFire, AuthMethods, AuthProviders, FirebaseAuthState} from "angularfire2";
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireAuth} from "@angular/fire/auth";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {PageControlService} from "../../../services/pagecontrol.service";
import firebase from "firebase";

@Component({
  selector: 'app-agency-change-password',
  templateUrl: './agency-change-password.component.html',
  styleUrls: ['./agency-change-password.component.css']
})

export class AgencyChangePasswordComponent implements OnInit, OnDestroy {

  private uid: string;
  private successInactive: boolean = true;
  private successMessage: string = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD';
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};
  private currentPasswordEntered: string;
  private newPasswordEntered: string;
  private confirmPasswordEntered: string;
  private user: firebase.User;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private router: Router, private afd: AngularFireDatabase, private afa: AngularFireAuth) {
  }

  ngOnInit() {
    this.pageControl.authObj(this.ngUnsubscribe, this.route, this.router, (userObservable, userType) => {
      userObservable.subscribe(user =>{
        this.user = user;
        this.uid = user.uid;
        console.log('Agency admin uid: ' + this.uid);
      })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async onSubmit() {

    if (this.validate()) {

      this.afa.signInWithEmailAndPassword(
        (await this.afa.currentUser).email,
          this.currentPasswordEntered
        )
        .then(() => {
          this.user.updatePassword(this.newPasswordEntered).then(() => {
            this.currentPasswordEntered = '';
            this.newPasswordEntered = '';
            this.confirmPasswordEntered = '';
            this.showAlert(false);
          }, error => {
            console.log(error.message);
          });
        })
        .catch(() => {
          this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.INCORRECT_CURRENT_PASSWORD';
          this.showAlert(true);
        });

    } else {
      this.showAlert(true);
    }
  }

  private showAlert(error: boolean) {
    if (error) {
      this.errorInactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.errorInactive = true;
      });
    } else {
      this.successInactive = false;
      observableTimer(Constants.ALERT_DURATION).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.successInactive = true;
      });
    }
  }

  /**
   * Returns false and specific error messages
   * @returns {boolean}
   */
  private validate() {

    this.alerts = {};
    if (!(this.currentPasswordEntered)) {
      this.alerts[this.currentPasswordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_CURRENT_PASSWORD';
      return false;
    } else if (!(this.newPasswordEntered)) {
      this.alerts[this.newPasswordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_NEW_PASSWORD';
      return false;
    } else if (!(this.confirmPasswordEntered)) {
      this.alerts[this.confirmPasswordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_CONFIRM_PASSWORD';
      return false;
    } else if (this.currentPasswordEntered == this.newPasswordEntered) {
      this.alerts[this.currentPasswordEntered] = true;
      this.alerts[this.newPasswordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.SAME_PASSWORD';
      return false;
    } else if (!CustomerValidator.PasswordValidator(this.newPasswordEntered)) {
      this.alerts[this.newPasswordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.INVALID_PASSWORD';
      return false;
    } else if (this.newPasswordEntered != this.confirmPasswordEntered) {
      this.alerts[this.newPasswordEntered] = true;
      this.alerts[this.confirmPasswordEntered] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.UNMATCHED_PASSWORD';
      return false;
    }
    return true;
  }
}
