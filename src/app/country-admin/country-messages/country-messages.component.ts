import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {UserService} from "../../services/user.service";
import {MessageService} from "../../services/message.service";
import {Constants} from "../../utils/Constants";
import {MessageModel} from "../../model/message.model";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {Subject} from "rxjs";

declare var jQuery: any;

@Component({
  selector: 'app-country-messages',
  templateUrl: './country-messages.component.html',
  styleUrls: ['./country-messages.component.css']
})

export class CountryMessagesComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;
  private agencyId: string;

  private deleteMessageId;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private sentMessages: MessageModel[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _userService: UserService,
              private _messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute) {
    this.sentMessages = [new MessageModel()]
  }

  ngOnInit() {
    this._userService.getAuthUser()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        if (!user) {
          this.router.navigateByUrl(Constants.LOGIN_PATH);
          return;
        }

        this.uid = user.uid;

        this._userService.getCountryAdminUser(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(countryAdminUser => {
            if (countryAdminUser) {
              this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
              this.countryId = countryAdminUser.countryId;

              this._messageService.getCountrySentMessages(this.countryId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(sentMessages => {
                  if (sentMessages) {
                    this.sentMessages = sentMessages;
                  }
                });
            }
          });
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  deleteMessage(deleteMessageId) {
    jQuery('#delete-action').modal('show');
    this.deleteMessageId = deleteMessageId;
  }

  deleteAction() {
    this.closeModal();
    console.log('delete called');
    this._messageService.deleteCountryMessage(this.countryId, this.agencyId, this.deleteMessageId)
      .then(() => {
        this.alertMessage = new AlertMessageModel('MESSAGES.DELETE_SUCCESS', AlertMessageType.Success);
      })
      .catch(err => {
        this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR')
      });
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

}
