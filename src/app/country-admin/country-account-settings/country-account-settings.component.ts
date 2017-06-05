import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from "../../services/user.service";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {ModelUserPublic} from "../../model/user-public.model";
import {DisplayError} from "../../errors/display.error";
import {Subject} from "rxjs";

@Component({
  selector: 'app-country-account-settings',
  templateUrl: './country-account-settings.component.html',
  styleUrls: ['./country-account-settings.component.css']
})

export class CountryAccountSettingsComponent implements OnInit, OnDestroy {
  private uid: string;

  // Constants and enums
  PERSON_TITLE = Constants.PERSON_TITLE;
  PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;
  COUNTRY = Constants.COUNTRY;
  COUNTRY_SELECTION = Constants.COUNTRY_SELECTION;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private userPublic: ModelUserPublic;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this._userService.getAuthUser().takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      this._userService.getUser(this.uid).takeUntil(this.ngUnsubscribe).subscribe(userPublic => {
        if (userPublic.id) {
          this.userPublic = userPublic;
        } else {
          throw new Error('Cannot find user profile');
        }
      })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  validateForm(): boolean {
    const excludedFields = ["phone", "city"];
    this.alertMessage = this.userPublic.validate(excludedFields);

    return !this.alertMessage;
  }

  submit() {
    this._userService.saveUserPublic(this.userPublic)
      .then(() => {
        this.alertMessage = new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE', AlertMessageType.Success);
      })
      .catch(err => {
        if (err instanceof DisplayError) {
          this.alertMessage = new AlertMessageModel(err.message);
        } else {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
        }
      });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
