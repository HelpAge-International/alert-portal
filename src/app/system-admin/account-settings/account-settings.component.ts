import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {PersonTitle} from "../../utils/Enums";
import {ModelUserPublic} from "../../model/user-public.model";
import {RxHelper} from "../../utils/RxHelper";
import {Observable} from "rxjs";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  private uid: string;
  authState: FirebaseAuthState;
  private succesInactive: boolean = true;
  private succesMessage: string = 'Profile successfully updated!';
  private errorInactive: boolean = true;
  private errorMessage: string = 'No changes made!';
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
        console.log("System admin uid: " + this.uid)
        this.loadSystemAdminData(this.uid);
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
    if (this.userPublic) {

      var editedUser: ModelUserPublic = new ModelUserPublic(this.systemAdminFirstName, this.systemAdminLastName, this.systemAdminTitle, this.systemAdminEmail);
      editedUser.phone = this.systemAdminPhone;

      let noChanges: boolean = editedUser.title == this.userPublic.title && editedUser.firstName == this.userPublic.firstName && editedUser.lastName == this.userPublic.lastName
        && editedUser.email == this.userPublic.email && editedUser.phone == this.userPublic.phone;

      if (noChanges) {
        console.log("No changes made");
        this.errorInactive = false;
        Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
          this.errorInactive = true;
        })
      } else {
        this.authState.auth.updateEmail(this.systemAdminEmail).then(_ => {
          this.af.database.object(Constants.APP_STATUS + '/userPublic/' + this.uid).update(editedUser).then(() => {
            this.succesInactive = false;
            Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
              this.succesInactive = true;
            })
          }, error => {
            console.log(error.message);
          });
        })
      }
    }
  }

  private loadSystemAdminData(uid) {

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
}
