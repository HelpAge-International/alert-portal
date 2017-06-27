import {Component, OnDestroy, OnInit} from "@angular/core";
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
  selector: 'app-country-notifications',
  templateUrl: './country-notifications.component.html',
  styleUrls: ['./country-notifications.component.css']
})
export class CountryNotificationsComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyId: string;
  private countryId: string;
  private USER_TYPE;

  private messagesTemp = [];
  private messages: MessageModel[] = []
  private messageToDeleteID;
  private messageToDeleteType;

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private _userService: UserService,
              private _notificationService: NotificationService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
          
        this._userService.getUserType(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(userType => {
          
          this.USER_TYPE = Constants.USER_PATHS[userType];
          
          this._userService.getAgencyId(this.USER_TYPE, this.uid).subscribe(agencyId => {
            this.agencyId = agencyId;
            this._userService.getCountryId(this.USER_TYPE, this.uid).subscribe(countryId => {
              this.countryId = countryId;

              switch(this.USER_TYPE){
                case 'administratorCountry':
                  this._notificationService.getCountryAdminNotifications(this.countryId, this.agencyId)
                        .subscribe(messages => {
                          this.messages = messages;
                        });
                  break;
                case 'countryDirector':
                  this._notificationService.getCountryDirectorNotifications(this.uid, this.countryId, this.agencyId)
                        .subscribe(messages => {
                          this.messages = messages;
                        });
                  break;
                case 'ertLeader':
                  this._notificationService.getERTLeadsNotifications(this.uid, this.countryId, this.agencyId)
                        .subscribe(messages => {
                          this.messages = messages;
                        });
                  break;
                case 'ert':
                  this._notificationService.getERTNotifications(this.uid, this.countryId, this.agencyId)
                        .subscribe(messages => {
                          this.messages = messages;
                        });
                  break;
              }
            });
          });
      });
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
}
