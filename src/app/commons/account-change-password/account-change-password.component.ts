import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {ChangePasswordModel} from "../../model/change-password.model";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {DisplayError} from "../../errors/display.error";

@Component({
  selector: 'app-account-change-password',
  templateUrl: './account-change-password.component.html',
  styleUrls: ['./account-change-password.component.scss']
})
export class AccountChangePasswordComponent implements OnInit, OnDestroy {

  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private changePassword: ChangePasswordModel;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() authState;
  @Input() user;
  @Output() cancelClicked = new EventEmitter();

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private router: Router,
              private _userService: UserService,) {
    this.changePassword = new ChangePasswordModel();
  }

  ngOnInit() {
    // this.pageControl.authObj(this.ngUnsubscribe, this.route, this.router, (auth, userType) => {
    //   this.authState = auth;
    //   this.user = auth.auth;
    // });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submit() {
    if (this.validateForm()) {
      this._userService.changePassword(this.user.email, this.changePassword, this.authState)
        .then(() => {
          this.alertMessage = new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD', AlertMessageType.Success);
          this.changePassword = new ChangePasswordModel();
        })
        .catch(err => {
          console.log(err);
          if (err instanceof DisplayError) {
            this.alertMessage = new AlertMessageModel(err.message);
          } else {
            this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
          }
        });
    }
  }

  validateForm(): boolean {
    this.alertMessage = this.changePassword.validate();

    return !this.alertMessage;
  }

  goBack() {
    this.cancelClicked.emit();
  }

}
