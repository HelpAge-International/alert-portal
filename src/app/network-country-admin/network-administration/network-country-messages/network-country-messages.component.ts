
import {takeUntil} from 'rxjs/operators';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
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
  private uid: string;
  private agencyCountryMap: Map<string, string>;

  //for local network admin
  @Input() isLocalNetworkAdmin: boolean


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private _messageService: MessageService,
              private router: Router) {
  }

  ngOnInit() {
    this.isLocalNetworkAdmin ? this.initLocalNetworkAccess() : this.initNetworkCountryAccess();
  }

  private initNetworkCountryAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];

          this._messageService.getCountrySentMessagesNetwork(user.uid).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(sentMessages => {
              this.showLoader = false;
              if (sentMessages) {
                this.sentMessages = sentMessages;
              }
            });

          this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(map => this.agencyCountryMap = map);

        });
    });
  }

  private initLocalNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];

          this._messageService.getSentMessagesLocalNetwork(user.uid).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(sentMessages => {
              this.showLoader = false;
              if (sentMessages) {
                this.sentMessages = sentMessages;
              }
            });

          this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(map => this.agencyCountryMap = map);

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
    this.isLocalNetworkAdmin ?
      this._messageService.deleteMessageLocalNetwork(this.uid, this.agencyCountryMap, this.deleteMessageModel)
        .then(() => {
          this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(() => {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR')
        })
      :
      this._messageService.deleteCountryMessageNetwork(this.uid, this.agencyCountryMap, this.deleteMessageModel)
        .then(() => {
          this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(() => {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR')
        });
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

}
