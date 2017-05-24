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

@Component({
  selector: 'app-country-create-edit-message',
  templateUrl: './country-create-edit-message.component.html',
  styleUrls: ['./country-create-edit-message.component.css']
})
export class CountryCreateEditMessageComponent implements OnInit, OnDestroy {

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
  }
}
