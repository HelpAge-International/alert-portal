import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {RxHelper} from '../../utils/RxHelper';
import {Subject} from "rxjs/Subject";
import { MessageModel } from "../../model/message.model";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.css']
})
export class NotificationBadgeComponent implements OnInit {
  private unreadMessages: MessageModel[];
  
  private _USER_TYPE: string;
  private _countryId: string;
  private _agencyId: string;
  private _userId: string;

  @Input() set USER_TYPE(USER_TYPE: string){
    this._USER_TYPE = USER_TYPE;
    this.getUnreadMessages();
  }

  @Input() set countryId(countryId: string){
    this._countryId = countryId;
    this.getUnreadMessages();
  }

  @Input() set agencyId(agencyId: string){
    this._agencyId = agencyId;
    this.getUnreadMessages();
  }

  @Input() set userId(userId: string){
    this._userId = userId;
    this.getUnreadMessages();
  }

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _notificationService: NotificationService,
              private af: AngularFire,
              private router: Router) {
                this.unreadMessages = [];
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToNotifications() {
    switch(this._USER_TYPE){
      case 'administratorAgency':
        let nodesAdministratorAgency = this._notificationService.getAgencyAdministratorNodes(this._agencyId);

        let c1 = 1;
        for (let node of nodesAdministratorAgency) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c1 == nodesAdministratorAgency.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("agency-admin/agency-notifications/agency-notifications");
            }else{
              c1++;
            }
          });
        }
        break;
      case 'administratorCountry':
        let nodesAdministratorCountry = this._notificationService.getCountryAdministratorNodes(this._agencyId, this._countryId, this._userId);

        let c2 = 1;
        for (let node of nodesAdministratorCountry) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c2 == nodesAdministratorCountry.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("country-admin/country-notifications");
            }else{
              c2++;
            }
          });
        }
        break;
      case 'countryUser':
        let nodesCountryUser = this._notificationService.getCountryUserNodes(this._agencyId, this._countryId, this._userId);

        let c3 = 1;
        for (let node of nodesCountryUser) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c3 == nodesCountryUser.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("director/director-notifications");
            }else{
              c3++;
            }
          });
        }
        break;
      case 'countryDirector':
        let nodesCountryDirector = this._notificationService.getCountryDirectorNodes(this._agencyId, this._countryId, this._userId);

        let c4 = 1;
        for (let node of nodesCountryDirector) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c4 == nodesCountryDirector.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("country-admin/country-notifications");
            }else{
              c4++;
            }
          });
        }
        break;
      case 'regionDirector':
        let nodesRegionDirector = this._notificationService.getRegionDirectorNodes(this._agencyId, this._countryId, this._userId);

        let c5 = 1;
        for (let node of nodesRegionDirector) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c5 == nodesRegionDirector.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("director/director-notifications");
            }else{
              c5++;
            }
          });
        }
        break;
      case 'globalDirector':
        let nodesGlobalDirector = this._notificationService.getGlobalDirectorNodes(this._agencyId, this._countryId, this._userId);

        let c6 = 1;
        for (let node of nodesGlobalDirector) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c6 == nodesGlobalDirector.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("director/director-notifications");
            }else{
              c6++;
            }
          });
        }
        break;
      case 'globalUser':
         let nodesGlobalUser = this._notificationService.getGlobalUserNodes(this._agencyId, this._countryId, this._userId);

        let c7 = 1;
        for (let node of nodesGlobalUser) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c7 == nodesGlobalUser.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("director/director-notifications");
            }else{
              c7++;
            }
          });
        }
        break;
      case 'ertLeader':
        let nodesErtLeader = this._notificationService.getErtLeaderNodes(this._agencyId, this._countryId, this._userId);
        
        let c8 = 1;
        for (let node of nodesErtLeader) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c8 == nodesErtLeader.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("country-admin/country-notifications");
            }else{
              c8++;
            }
          });
        }
        break;
      case 'ert':
        let nodesErt = this._notificationService.getErtNodes(this._agencyId, this._countryId, this._userId);
        
        let c9 = 1;
        for (let node of nodesErt) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c9 == nodesErt.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("country-admin/country-notifications");
            }else{
              c9++;
            }
          });
        }
        break;
      case 'donor':
        let nodesDonor = this._notificationService.getDonorNodes(this._agencyId, this._countryId, this._userId);
        
        let c10 = 1;
        for (let node of nodesDonor) {
          this._notificationService.setNotificationsAsRead(node).subscribe(() => {
            if(c10 == nodesDonor.length){
              this.unreadMessages = [];
              this.router.navigateByUrl("donor-module/donor-notifications");
            }else{
              c10++;
            }
          });
        }
        break;
    }
  }

  private getUnreadMessages(){
    if( this._USER_TYPE && this._userId && (this._countryId || this._agencyId)) {
      switch(this._USER_TYPE){
        case 'administratorAgency':
          let nodesAdministratorAgency = this._notificationService.getAgencyAdministratorNodes(this._agencyId);

          for (let node of nodesAdministratorAgency) {
            this.af.database.list(Constants.APP_STATUS + node)
              .subscribe(list => {
                list.forEach((x) => {
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
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
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
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
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
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
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
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
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
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
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
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
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
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
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
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
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
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
                  if(x.$value === true) { // only unread messages
                    this._notificationService.getNotificationMessage(x.$key)
                      .subscribe(message => this.unreadMessages.push(message));
                  }
                });
              });
          }
          break;
      }
    }
  }

}
