import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { RxHelper } from "../../../utils/RxHelper";
import {Observable} from "rxjs";

import { AlertMessageModel } from "../../../model/alert-message.model";
import { AlertMessageType, UserType } from "../../../utils/Enums";
import { UserService } from "../../../services/user.service";
import { MessageService } from "../../../services/message.service";
import { MessageModel } from "../../../model/message.model";
import { Constants } from "../../../utils/Constants";
import { DisplayError } from "../../../errors/display.error";

@Component({
  selector: 'app-country-create-edit-message',
  templateUrl: './country-create-edit-message.component.html',
  styleUrls: ['./country-create-edit-message.component.css']
})
export class CountryCreateEditMessageComponent implements OnInit, OnDestroy {
  private uid;
  private countryId;
  private agencyId;

  // Constants and enums
  USER_TYPE = Constants.USER_TYPE;
  USER_TYPE_SELECTION = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION;

   // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private userMessage: MessageModel;

  constructor(private _userService: UserService,
              private _messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
                this.userMessage = new MessageModel();
                console.log(this.USER_TYPE_SELECTION);
  }

  ngOnInit() {
    const authSubscription = this._userService.getAuthUser().subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
        if(countryAdminUser)
        {
          this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
          this.countryId = countryAdminUser.countryId;
        }
      });
    });
    this.subscriptions.add(authSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  validateForm(): boolean {
    this.alertMessage = this.userMessage.validate();

    return !this.alertMessage;
  }
  submit() {
    console.log('submit called');
    this.userMessage.time = new Date().getTime();
    this.userMessage.senderId = this.uid;

    this._messageService.saveCountryMessage(this.countryId, this.agencyId, this.userMessage).then(() => {
              console.log('function out!');
              this.alertMessage = new AlertMessageModel('MESSAGES.SENT_SUCCESS', AlertMessageType.Success);
              setTimeout(() => this.router.navigateByUrl('/country-admin/country-messages'), Constants.ALERT_REDIRECT_DURATION);
            })
            .catch(err => {
              if(err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              }else{
                console.log(err);
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
  }

  recipientSelected( selectedRecipient ){
  
    let allUserChecked = this.userMessage.userType[UserType.All];

    if(selectedRecipient == UserType.All && !allUserChecked){
      Constants.USER_TYPE_SELECTION.forEach(userType => {
          this.userMessage.userType[userType] = true;
      })
    }else if(selectedRecipient == UserType.All && allUserChecked){
      Constants.USER_TYPE_SELECTION.forEach(userType => {
          this.userMessage.userType[userType] = false;
      })
    } else if(selectedRecipient != UserType.CountryAdmin && selectedRecipient !== UserType.CountryDirector && allUserChecked) {
      this.userMessage.userType[UserType.All] = false;
    }
  }
}
