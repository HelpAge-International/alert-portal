import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "../../model/message";
import {MessageModel} from "../../model/message.model";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import {UserService} from "../../services/user.service";
import { AlertMessageModel } from '../../model/alert-message.model';
import { AlertMessageType } from '../../utils/Enums';

declare var jQuery: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  
  private _USER_TYPE: string;
  private _countryId: string;
  private _agencyId: string;
  private _userId: string;

  @Input() set USER_TYPE(USER_TYPE: string){
    this._USER_TYPE = USER_TYPE;
    this.getNotifications();
  }

  @Input() set countryId(countryId: string){
    this._countryId = countryId;
    this.getNotifications();
  }

  @Input() set agencyId(agencyId: string){
    this._agencyId = agencyId;
    this.getNotifications();
  }

  @Input() set userId(userId: string){
    this._userId = userId;
    this.getNotifications();
  }

  private messagesTemp = [];
  private messages: MessageModel[] = []
  private messageToDeleteID;
  private messageToDeleteType;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private _userService: UserService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router) {
  }

  ngOnInit() {
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
    let messageNode = Constants.APP_STATUS + '/messageRef/agency/' + this.agencyId + '/countryadmins/' + this.countryId + '/' + this.messageToDeleteID;
    this._notificationService.deleteNotification(messageNode)
            .then(() => {
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            })
            .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeModal() {
    jQuery("#delete-message").modal("hide");
  }

  private getNotifications(){
      if( this._USER_TYPE && this._userId && (this._countryId || this._agencyId)) {
      switch(this._USER_TYPE){
        case 'administratorCountry':
          this._notificationService.getCountryAdminNotifications(this._countryId, this._agencyId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(messages => {
                  this.messages = messages;
                });
          break;
        case 'countryDirector':
          this._notificationService.getCountryDirectorNotifications(this._userId, this._countryId, this._agencyId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(messages => {
                  this.messages = messages;
                });
          break;
        case 'regionDirector':
          this._notificationService.getRegionalDirectorNotifications(this._userId, this._countryId, this._agencyId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(messages => {
                  this.messages = messages;
                });
          break;
        case 'globalDirector':
          this._notificationService.getGlobalDirectorNotifications(this._userId, this._countryId, this._agencyId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(messages => {
                  this.messages = messages;
                });
          break;
        case 'globalUser':
          this._notificationService.getGlobalUserNotifications(this._userId, this._countryId, this._agencyId, true)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(messages => {
                  this.messages = messages;
                });
          break;
        case 'ertLeader':
          this._notificationService.getERTLeadsNotifications(this._userId, this._countryId, this._agencyId)
                .subscribe(messages => {
                  this.messages = messages;
                });
          break;
        case 'ert':
          this._notificationService.getERTNotifications(this._userId, this._countryId, this._agencyId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(messages => {
                  this.messages = messages;
                });
          break;
        case 'donor':      
          this._notificationService.getDonorNotifications(this._userId, this._countryId, this._agencyId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(messages => {
                  this.messages = messages;
                });
          break;
      }
    }
  }
}
