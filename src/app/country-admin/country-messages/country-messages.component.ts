import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {UserService} from "../../services/user.service";
import {MessageService} from "../../services/message.service";
import {Constants} from "../../utils/Constants";
import {MessageModel} from "../../model/message.model";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";

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

  private deleteMessageModel: MessageModel;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private sentMessages: MessageModel[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private _userService: UserService, private route: ActivatedRoute,
              private router: Router,
              private _messageService: MessageService) {
    this.sentMessages = [new MessageModel()]
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.countryId = countryId;

      this._messageService.getCountrySentMessages(this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(sentMessages => {
          if (sentMessages) {
            this.sentMessages = sentMessages;
          }
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  deleteMessage(deleteMessageModel) {
    jQuery('#delete-action').modal('show');
    this.deleteMessageModel = deleteMessageModel;
  }

  deleteAction() {
    this.closeModal();
    console.log('delete called');
    this._messageService.deleteCountryMessage(this.countryId, this.agencyId, this.deleteMessageModel)
      .then(() => {
        this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => {
        this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR')
      });
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

}
