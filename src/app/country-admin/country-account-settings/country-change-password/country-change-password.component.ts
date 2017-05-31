import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { RxHelper } from "../../../utils/RxHelper";
import { UserService } from "../../../services/user.service";
import { AlertMessageModel } from "../../../model/alert-message.model";
import { AlertMessageType } from "../../../utils/Enums";
import { ChangePasswordModel } from "../../../model/change-password.model";
import { DisplayError } from "../../../errors/display.error";

@Component({
  selector: 'app-country-change-password',
  templateUrl: './country-change-password.component.html',
  styleUrls: ['./country-change-password.component.css']
})
export class CountryChangePasswordComponent implements OnInit, OnDestroy {

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private changePassword: ChangePasswordModel;

  constructor(private _userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
                this.changePassword = new ChangePasswordModel();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  submit() {
      this._userService.getAuthUser().subscribe( user => {
        const changePasswordSubscription = this._userService.changePassword(user.email, this.changePassword)
            .then(() => {
              this.alertMessage = new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PASSWORD', AlertMessageType.Success);
              this.changePassword = new ChangePasswordModel();
            })
            .catch(err => {
              if(err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              }else{
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
      }).unsubscribe(); // prevent calling the changePassword() twice
  }

  validateForm(): boolean {
    this.alertMessage = this.changePassword.validate();

    return !this.alertMessage;
  }
  
  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
