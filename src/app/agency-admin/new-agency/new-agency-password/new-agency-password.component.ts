
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {take, takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireAuth} from "@angular/fire/auth";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {CustomerValidator} from "../../../utils/CustomValidator";
import {PageControlService} from "../../../services/pagecontrol.service";
import {UserType} from "../../../utils/Enums";
import firebase from "firebase";
import {ModelUserPublic} from "../../../model/user-public.model";

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

  private user: firebase.User

  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private afd: AngularFireDatabase, private afa: AngularFireAuth, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authObj(this.ngUnsubscribe, this.route, this.router, (auth, userType) => {
      auth.pipe(take(1)).subscribe(user => {
        this.user = user;
        this.uid = user.uid;
        console.log('New agency admin uid: ' + this.uid);
        this.afd.object<ModelUserPublic>(Constants.APP_STATUS + "/userPublic/" + this.uid)
          .valueChanges()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(user => {
            this.agencyAdminName = user.firstName;
          });
      })

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {

    if (this.validate()) {
      this.user.updatePassword(this.passwordEntered).then(() => {
        this.successInactive = false;
        observableTimer(Constants.ALERT_REDIRECT_DURATION).pipe(
          takeUntil(this.ngUnsubscribe)).subscribe(() => {
          this.successInactive = true;
          console.log('navigating to /agency-admin/new-agency/new-agency-details')
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
    observableTimer(Constants.ALERT_DURATION).pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(() => {
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
