import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType} from "../../../utils/Enums";
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {NetworkMessageModel} from "./network-message.model";
import {NetworkMessageRecipientModel} from "./network-message-recipient.model";
import {AgencyService} from "../../../services/agency-service.service";
import {Constants} from "../../../utils/Constants";

@Component({
  selector: 'app-network-create-edit-message',
  templateUrl: './network-create-edit-message.component.html',
  styleUrls: ['./network-create-edit-message.component.css'],
  providers: [AgencyService]
})
export class NetworkCreateEditMessageComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private message = new NetworkMessageModel();
  private recipients = new NetworkMessageRecipientModel();

  //logic
  private networkId: string;
  private showLoader: boolean;
  private agencyIds: string[];
  private uid : string;

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private userService: UserService,
              private agencyService:AgencyService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
    this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
        });

      //prepare for message save
      this.networkService.getAgencyIdsForNetwork(this.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencyIds =>{
          this.agencyIds = agencyIds;
        });

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submit() {
    //do validation first
    this.alertMessage = this.message.validate([]);
    this.alertMessage ? console.log("error") : this.alertMessage = this.recipients.validate([]);
    this.alertMessage ? console.log("error") : this.storeMessageData();
  }

  /** Utility methods **/

  private storeMessageData() {
    this.networkService.saveMessageDataToFirebase(this.uid, this.networkId, this.agencyIds, this.recipients, this.message, this.recipients.allUsers, this.ngUnsubscribe).then(_ => {
      console.log("Message ref successfully added to all nodes");
      this.router.navigate(['/network/network-message']);
    }).catch(error => {
      console.log("Message ref creation unsuccessful" + error);
      //TODO Display error alert here
    });
  }
}
