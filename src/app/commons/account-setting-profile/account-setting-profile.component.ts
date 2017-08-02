import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from "../../services/user.service";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {ModelUserPublic} from "../../model/user-public.model";
import {DisplayError} from "../../errors/display.error";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {FirebaseAuthState} from "angularfire2";

@Component({
  selector: 'app-account-setting-profile',
  templateUrl: './account-setting-profile.component.html',
  styleUrls: ['./account-setting-profile.component.css']
})
export class AccountSettingProfileComponent implements OnInit, OnDestroy {

  private uid: string;

  // Constants and enums
  PERSON_TITLE = Constants.PERSON_TITLE;
  PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;
  COUNTRY = Constants.COUNTRIES;
  COUNTRY_SELECTION = Constants.COUNTRY_SELECTION;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private userPublic: ModelUserPublic;
  authState: FirebaseAuthState;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() isDirector:boolean = false;

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.authObj(this.ngUnsubscribe, this.route, this.router, (auth, userType) => {
      this.uid = auth.auth.uid;
      this.authState = auth;

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
    console.log("validateForm");
    const excludedFields = ["phone", "city", "title"];
    this.alertMessage = this.userPublic.validate(excludedFields);

    return !this.alertMessage;
  }

  submit() {
    console.log("submit");
    if (this.validateForm()) {
      this._userService.saveUserPublic(this.userPublic, this.authState)
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
  }

  goBack() {
    if (this.isDirector) {
      this.router.navigateByUrl('/director');
    } else {
      this.router.navigateByUrl('/dashboard');
    }
  }

}
