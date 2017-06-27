import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {Constants} from "../../utils/Constants";
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
              private router: Router) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToNotifications() {
    switch(this._USER_TYPE){
      case 'administratorCountry':
        this._notificationService.setCountryAdminNotificationsAsRead(this._countryId, this._agencyId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(() => {
                this.router.navigateByUrl("country-admin/country-notifications");
              });
        break;
      case 'countryDirector':
        this._notificationService.setCountryDirectorNotificationsAsRead(this._userId, this._countryId, this._agencyId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(() => {
                this.router.navigateByUrl("country-admin/country-notifications");
              });
        break;
      case 'ertLeader':
        this._notificationService.setERTLeadsNotificationsAsRead(this._userId, this._countryId, this._agencyId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(() => {
                this.router.navigateByUrl("country-admin/country-notifications");
              });
        break;
      case 'ert':
        this._notificationService.setERTNotificationsAsRead(this._userId, this._countryId, this._agencyId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(() => {
                this.router.navigateByUrl("country-admin/country-notifications");
              });
        break;
      case 'donor':
        this._notificationService.setDonorNotificationsAsRead(this._userId, this._countryId, this._agencyId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(() => {
                this.router.navigateByUrl("donor-module/donor-notifications");
              });
        break;
    }
  }

  private getUnreadMessages(){
    if( this._USER_TYPE && this._countryId && this._agencyId && this._userId) {
      switch(this._USER_TYPE){
        case 'administratorCountry':
          this._notificationService.getCountryAdminNotifications(this._countryId, this._agencyId, true)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(unreadMessages => {
                  this.unreadMessages = unreadMessages;
                });
          break;
        case 'countryDirector':
          this._notificationService.getCountryDirectorNotifications(this._userId, this._countryId, this._agencyId, true)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(unreadMessages => {
                  this.unreadMessages = unreadMessages;
                });
          break;
        case 'ertLeader':
          this._notificationService.getERTLeadsNotifications(this._userId, this._countryId, this._agencyId, true)
                .subscribe(unreadMessages => {
                  this.unreadMessages = unreadMessages;
                });
          break;
        case 'ert':
          this._notificationService.getERTNotifications(this._userId, this._countryId, this._agencyId, true)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(unreadMessages => {
                  this.unreadMessages = unreadMessages;
                });
          break;
        case 'donor':      
          this._notificationService.getDonorNotifications(this._userId, this._countryId, this._agencyId, true)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(unreadMessages => {
                  this.unreadMessages = unreadMessages;
                });
          break;
      }
    }
  }

}
