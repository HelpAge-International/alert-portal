import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "../../model/message";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import { AlertMessageModel } from '../../model/alert-message.model';
import { AlertMessageType } from '../../utils/Enums';

declare var jQuery: any;
@Component({
  selector: 'app-agency-notifications',
  templateUrl: './agency-notifications.component.html',
  styleUrls: ['./agency-notifications.component.css']
})
export class AgencyNotificationsComponent implements OnInit, OnDestroy {

  private uid: string;
  private messages = [];
  private messageToDeleteID;
  private messageToDeleteType;

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this._notificationService.getAgencyNotifications(this.uid).takeUntil(this.ngUnsubscribe)
                                    .subscribe(messages => { console.log(messages); this.messages = messages; });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  deleteMessage(messageID: string, groupType: string) {
    if (!messageID || !groupType) {
      console.log('message ID and groupType requried params!');
      return;
    }
    this.messageToDeleteID = messageID;
    this.messageToDeleteType = groupType;
    jQuery("#delete-message").modal("show");
  }

  deleteAction() {
    this.closeModal();
    let messageNode = Constants.APP_STATUS + '/messageRef/systemadmin/' + this.messageToDeleteType + '/' + this.uid + '/' + this.messageToDeleteID;
    console.log(messageNode);
    this._notificationService.deleteNotification(messageNode)
            .then(() => {
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            })
            .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeModal() {
    jQuery("#delete-message").modal("hide");
  }
}
