import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {AlertMessageType, UserType} from "../../../../utils/Enums";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {NetworkService} from "../../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "../../../../services/message.service";
import {Constants} from "../../../../utils/Constants";
import {MessageModel} from "../../../../model/message.model";
import {DisplayError} from "../../../../errors/display.error";

@Component({
  selector: 'app-network-country-create-edit-message',
  templateUrl: './network-country-create-edit-message.component.html',
  styleUrls: ['./network-country-create-edit-message.component.scss']
})
export class NetworkCountryCreateEditMessageComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  USER_TYPE = Constants.USER_TYPE;
  USER_TYPE_SELECTION = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;

  //logic
  private networkId: string;
  private showLoader: boolean;
  private networkCountryId: string;
  private uid: string;
  private userMessage: MessageModel;
  private agencyCountryMap: Map<string, string>;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private _messageService: MessageService,
              private router: Router) {
    this.userMessage = new MessageModel();
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          this.showLoader = false;

          this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(map => this.agencyCountryMap = map);

        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  validateForm(): boolean {
    this.alertMessage = this.userMessage.validate();
    return !this.alertMessage;
  }

  submit() {
    if (this.validateForm()) {
      console.log('submit called');
      this.userMessage.time = new Date().getTime();
      this.userMessage.senderId = this.uid;
      console.log(this.userMessage)

      this._messageService.saveCountryMessageNetwork(this.uid, this.agencyCountryMap, this.userMessage).then(() => {
        console.log('function out!');
        this.alertMessage = new AlertMessageModel('MESSAGES.SENT_SUCCESS', AlertMessageType.Success);
        setTimeout(() => this.router.navigateByUrl('/network-country/network-country-messages'), Constants.ALERT_REDIRECT_DURATION);
      })
        .catch(err => {
          if (err instanceof DisplayError) {
            this.alertMessage = new AlertMessageModel(err.message);
          } else {
            console.log(err);
            this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
          }
        });
    }
  }

  recipientSelected(selectedRecipient) {

    let allUserChecked = this.userMessage.userType[UserType.All];

    if (selectedRecipient == UserType.All && !allUserChecked) {
      Constants.USER_TYPE_SELECTION.forEach(userType => {
        this.userMessage.userType[userType] = true;
      })
    } else if (selectedRecipient == UserType.All && allUserChecked) {
      Constants.USER_TYPE_SELECTION.forEach(userType => {
        this.userMessage.userType[userType] = false;
      })
    } else if (selectedRecipient != UserType.CountryAdmin && selectedRecipient !== UserType.CountryDirector && allUserChecked) {
      this.userMessage.userType[UserType.All] = false;
    }
  }

}
