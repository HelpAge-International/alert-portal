
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireAuth} from "@angular/fire/auth";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ModelUserPublic} from "../../model/user-public.model";
import {CustomerValidator} from "../../utils/CustomValidator";
import {PageControlService} from "../../services/pagecontrol.service";
import firebase from "firebase";

@Component({
  selector: 'app-agency-account-settings',
  templateUrl: './agency-account-settings.component.html',
  styleUrls: ['./agency-account-settings.component.css']
})

export class AgencyAccountSettingsComponent implements OnInit, OnDestroy {

  private uid: string;
  //authState: AngularFireAuth.currentUser.auh;
  private user: firebase.User
  private successInactive: boolean = true;
  private successMessage: string = 'GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE';
  private errorInactive: boolean = true;
  private errorMessage: string;
  private alerts = {};
  private userPublic: ModelUserPublic;
  private agencyAdminTitle: number = 0;
  private agencyAdminFirstName: string;
  private agencyAdminLastName: string;
  private agencyAdminEmail: string;
  private agencyAdminAddressLine1: string;
  private agencyAdminAddressLine2: string;
  private agencyAdminAddressLine3: string;
  private agencyAdminCity: string;
  private agencyAdminPostCode: string;
  private agencyAdminCountry: number;
  private PersonTitle = Constants.PERSON_TITLE;
  private personTitleList: number[] = Constants.PERSON_TITLE_SELECTION;
  private Country = Constants.COUNTRIES;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private afd: AngularFireDatabase, private afa: AngularFireAuth, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authObj(this.ngUnsubscribe, this.route, this.router, (userObservable, userType) => {
      userObservable.subscribe(user=> {
        this.user = user
        this.uid = user.uid
        console.log("Agency admin uid: " + this.uid);
        this.loadAgencyAdminData(this.uid);
      })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {

    if (this.validate()) {

      if (this.userPublic) {
        var editedUser: ModelUserPublic = new ModelUserPublic(this.agencyAdminFirstName, this.agencyAdminLastName, this.agencyAdminTitle, this.agencyAdminEmail);
        editedUser.addressLine1 = this.agencyAdminAddressLine1;
        editedUser.addressLine2 = this.agencyAdminAddressLine2;
        editedUser.addressLine3 = this.agencyAdminAddressLine3;
        editedUser.country = this.agencyAdminCountry;
        editedUser.city = this.agencyAdminCity;
        editedUser.postCode = this.agencyAdminPostCode;

        let noChanges: boolean = editedUser.title == this.userPublic.title
          && editedUser.firstName == this.userPublic.firstName
          && editedUser.lastName == this.userPublic.lastName
          && editedUser.email == this.userPublic.email
          && editedUser.addressLine1 == this.userPublic.addressLine1
          && editedUser.addressLine2 == this.userPublic.addressLine2
          && editedUser.addressLine3 == this.userPublic.addressLine3
          && editedUser.country == this.userPublic.country
          && editedUser.city == this.userPublic.city
          && editedUser.postCode == this.userPublic.postCode;

        if (noChanges) {
          this.errorMessage = 'GLOBAL.NO_CHANGES_MADE';
          this.showAlert(true);
        } else {
          let emailChanged: boolean = editedUser.email != this.userPublic.email;

          if (emailChanged) {
            this.afa.authState.forEach(auth =>
              auth.updateEmail(this.agencyAdminEmail).then(_ => {
              this.afd.object(Constants.APP_STATUS + '/userPublic/' + this.uid).update(editedUser).then(() => {
                this.showAlert(false);
              }, error => {
                this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                this.showAlert(true);
                console.log(error.message);
              });
            })
          )
          } else {
            this.afd.object(Constants.APP_STATUS + '/userPublic/' + this.uid).update(editedUser).then(() => {
              this.showAlert(false)
            }, error => {
              this.errorMessage = 'GLOBAL.GENERAL_ERROR';
              this.showAlert(true);
              console.log(error.message);
            });
          }
        }
      }
    } else {
      this.showAlert(true);
    }
  }

  private loadAgencyAdminData(uid) {

    this.afd.object<ModelUserPublic>(Constants.APP_STATUS + "/userPublic/" + uid)
      .valueChanges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((agencyAdmin: ModelUserPublic) => {

        this.userPublic = agencyAdmin;
        this.agencyAdminTitle = agencyAdmin.title;
        this.agencyAdminFirstName = agencyAdmin.firstName;
        this.agencyAdminLastName = agencyAdmin.lastName;
        this.agencyAdminEmail = agencyAdmin.email;
        this.agencyAdminAddressLine1 = agencyAdmin.addressLine1;
        this.agencyAdminAddressLine2 = agencyAdmin.addressLine2;
        this.agencyAdminAddressLine3 = agencyAdmin.addressLine3;
        this.agencyAdminCountry = agencyAdmin.country;
        this.agencyAdminCity = agencyAdmin.city;
        this.agencyAdminPostCode = agencyAdmin.postCode;
      });
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
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validate() {

    this.alerts = {};
    if (!(this.agencyAdminFirstName)) {
      this.alerts[this.agencyAdminFirstName] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_F_NAME';
      return false;
    } else if (!(this.agencyAdminLastName)) {
      this.alerts[this.agencyAdminLastName] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_L_NAME';
      return false;
    } else if (!(this.agencyAdminEmail)) {
      this.alerts[this.agencyAdminEmail] = true;
      this.errorMessage = 'GLOBAL.ACCOUNT_SETTINGS.NO_EMAIL';
      return false;
    } else if (!CustomerValidator.EmailValidator(this.agencyAdminEmail)) {
      this.alerts[this.agencyAdminEmail] = true;
      this.errorMessage = "GLOBAL.EMAIL_NOT_VALID";
      return false;
    }
    return true;
  }
}
