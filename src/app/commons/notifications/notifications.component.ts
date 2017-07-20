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

  private messages: MessageModel[] = []
  private messageToDeleteID;
  private deleteMessageContent: string;
  private doDeleteAll: boolean = false;

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

  deleteAllMessages(){
    console.log("Delete all messages");
    this.doDeleteAll = true;
    jQuery("#delete-message").modal("show");
    this.deleteMessageContent = 'DELETE_MESSAGE_DIALOG.ALL_MSG_CONTENT';
  }

  deleteMessage(messageID: string) {
    if (!messageID) {
      console.log('messageId is required!');
      return;
    }
    this.doDeleteAll = false;
    this.messageToDeleteID = messageID;
    jQuery("#delete-message").modal("show");
    this.deleteMessageContent = 'DELETE_MESSAGE_DIALOG.SINGLE_MSG_CONTENT';
  }

  deleteAction() {
    this.closeModal();

    if(this.doDeleteAll){
      this.messages.forEach(message => {
        this.messageToDeleteID = message.id;
        this.messages = [];
        this.deleteSingleMsg();
      });
    }else{
      this.deleteSingleMsg();
    }
  }

  private deleteSingleMsg(){
    switch(this._USER_TYPE){
      case 'administratorAgency':
        this._notificationService.deleteAgencyAdminNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
      case 'administratorCountry':
        this._notificationService.deleteCountryAdminNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
      case 'countryUser':
        this._notificationService.deleteCountryUserNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
      case 'countryDirector':
        this._notificationService.deleteCountryDirectorNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
      case 'regionDirector':
        this._notificationService.deleteRegionalDirectorNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
      case 'globalDirector':
        this._notificationService.deleteGlobalDirectorNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
      case 'globalUser':
        this._notificationService.deleteGlobalUserNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
      case 'ertLeader':
        this._notificationService.deleteERTLeadsNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
      case 'ert':
        this._notificationService.deleteERTNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
      case 'donor':
        this._notificationService.deleteDonorNotification(this._userId, this._countryId, this._agencyId, this.messageToDeleteID)
          .then(() => {
            if(!this.doDeleteAll){
              this.messages = this.messages.filter(x => x.id != this.messageToDeleteID);
              this.alertMessage = new AlertMessageModel('AGENCY_ADMIN.MESSAGES.SUCCESS_DELETED', AlertMessageType.Success);
            }
          })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
        break;
    }
  }

  closeModal() {
    jQuery("#delete-message").modal("hide");
  }

  private getNotifications(){
      if( this._USER_TYPE && this._userId && (this._countryId || this._agencyId)) {
      switch(this._USER_TYPE){
        case 'administratorAgency':
          let nodesAdministratorAgency = this._notificationService.getAgencyAdministratorNodes(this._agencyId);

          for (let node of nodesAdministratorAgency) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
        case 'administratorCountry':
          let nodesAdministratorCountry = this._notificationService.getCountryAdministratorNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesAdministratorCountry) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
        case 'countryUser':
          let nodesCountryUser = this._notificationService.getCountryUserNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesCountryUser) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
        case 'countryDirector':
          let nodesCountryDirector = this._notificationService.getCountryDirectorNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesCountryDirector) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
        case 'regionDirector':
          let nodesRegionDirector = this._notificationService.getRegionDirectorNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesRegionDirector) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
        case 'globalDirector':
          let nodesGlobalDirector = this._notificationService.getGlobalDirectorNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesGlobalDirector) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
        case 'globalUser':
          let nodesGlobalUser = this._notificationService.getGlobalUserNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesGlobalUser) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
        case 'ertLeader':
          let nodesErtLeader = this._notificationService.getErtLeaderNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesErtLeader) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
        case 'ert':
          let nodesErt = this._notificationService.getErtNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesErt) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
        case 'donor':
          let nodesDonor = this._notificationService.getDonorNodes(this._agencyId, this._countryId, this._userId);

          for (let node of nodesDonor) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  this._notificationService.getNotificationMessage(x.$key)
                    .subscribe(message => {
                      if(!this.messages.find(x => x.id === message.id)) // if the message does not exist in the list
                      {
                        this.messages.push(message);
                        this.messages.sort(function (a, b){
                          return b.time - a.time;
                        });
                      }
                    });
                });
              });
          }
          break;
      }
    }
  }
}
