import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType} from "../../../utils/Enums";
import {MessageService} from "../../../services/message.service";
import {MessageModel} from "../../../model/message.model";

declare const jQuery: any;

@Component({
  selector: 'app-network-country-messages',
  templateUrl: './network-country-messages.component.html',
  styleUrls: ['./network-country-messages.component.css']
})
export class NetworkCountryMessagesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private sentMessages: MessageModel[] = [];
  private deleteMessageModel: MessageModel;

  //logic
  private networkId: string;
  private showLoader: boolean;
  private networkCountryId: string;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private _messageService: MessageService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          this.showLoader = false;

          this._messageService.getCountrySentMessagesNetwork(user.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(sentMessages => {
              if (sentMessages) {
                this.sentMessages = sentMessages;
              }
            });

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
    // this._messageService.deleteCountryMessageNetwork(this.countryId, this.agencyId, this.deleteMessageModel)
    //   .then(() => {
    //     this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
    //   })
    //   .catch(err => {
    //     this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR')
    //   });
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

}
