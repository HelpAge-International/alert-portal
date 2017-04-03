import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {PersonTitle, Country} from "../../utils/Enums";
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
  private personTitleList: number[] = [PersonTitle.Mr, PersonTitle.Mrs, PersonTitle.Miss, PersonTitle.Dr, PersonTitle.Prof];
  private Country = Constants.COUNTRY;
  private countriesList: number[] = [Country.UK, Country.France, Country.Germany];

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

        let noChanges: boolean = editedUser.title == this.userPublic.title && editedUser.firstName == this.userPublic.firstName && editedUser.lastName == this.userPublic.lastName
          && editedUser.email == this.userPublic.email && editedUser.addressLine1 == this.userPublic.addressLine1 && editedUser.addressLine2 == this.userPublic.addressLine2
          && editedUser.addressLine3 == this.userPublic.addressLine3 && editedUser.country == this.userPublic.country && editedUser.city == this.userPublic.city
          && editedUser.postCode == this.userPublic.postCode;

        if (noChanges) {
          this.showAlert(true);
        } else {
          let emailChanged: boolean = editedUser.email != this.userPublic.email;

          if (emailChanged) {
            this.authState.auth.updateEmail(this.agencyAdminEmail).then(_ => {
              this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this.uid).update(editedUser).then(() => {
                this.showAlert(false);
              }, error => {
                this.errorMessage = 'GLOBAL.GENERAL_ERROR';
                this.showAlert(true);
                console.log(error.message);
              });
            })
          } else {
            this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this.uid).update(editedUser).then(() => {
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

    let subscription = this.af.database.object(Constants.APP_STATUS + "/userPublic/" + uid).subscribe((agencyAdmin: ModelUserPublic) => {

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
