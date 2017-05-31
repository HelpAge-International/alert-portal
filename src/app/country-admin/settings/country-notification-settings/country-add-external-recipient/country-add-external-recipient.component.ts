import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { RxHelper } from "../../../../utils/RxHelper";
import { MessageService } from "../../../../services/message.service";
import { AlertMessageModel } from "../../../../model/alert-message.model";
import { AlertMessageType } from "../../../../utils/Enums";
import { ExternalRecipientModel } from "../../../../model/external-recipient.model";
import { UserService } from "../../../../services/user.service";
import { Constants } from "../../../../utils/Constants";
import { NotificationSettingsService } from "../../../../services/notification-settings.service";
import { DisplayError } from "../../../../errors/display.error";

declare var jQuery: any;

@Component({
  selector: 'app-country-add-external-recipient',
  templateUrl: './country-add-external-recipient.component.html',
  styleUrls: ['./country-add-external-recipient.component.css']
})
export class CountryAddExternalRecipientComponent implements OnInit, OnDestroy {
  private isEdit = false;

  private uid: string;
  private agencyId: string;
  private countryId: string;
  
  // Constants and enums
  PERSON_TITLE = Constants.PERSON_TITLE;
  PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;
  NOTIFICATION_SETTINGS = Constants.NOTIFICATION_SETTINGS;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private externalRecipient: ExternalRecipientModel;

  constructor(private _userService: UserService,
              private _notificationSettingsService: NotificationSettingsService,
              private _messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
                this.externalRecipient = new ExternalRecipientModel();
  }

  ngOnInit() {
    const authSubscription = this._userService.getAuthUser().subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      try {
        this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
          if(countryAdminUser)
          {
            this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
            this.countryId = countryAdminUser.countryId;

            const editSubscription = this.route.params.subscribe((params: Params) => {
                if (params['id']) {
                  this.isEdit = true;
                  const getExternalRecipientSubscription = this._messageService.getCountryExternalRecipient(this.countryId, params['id'])
                        .subscribe(externalRecipient => {
                            if( externalRecipient )
                            {
                              this.externalRecipient = externalRecipient;
                            }else{
                              throw new DisplayError('COUNTRY_ADMIN.SETTINGS.NOTIFICATIONS.RECIPIENT_NOT_FOUND');
                            }
                          },
                          err => { throw new Error(err.message);});
                  this.subscriptions.add(getExternalRecipientSubscription);
                }else{
                  const notificationSettingsSubscription = this._notificationSettingsService.getNotificationSettings(this.agencyId)
                          .subscribe(notificationSettings => { this.externalRecipient.notificationsSettings = notificationSettings });
                  this.subscriptions.add(notificationSettingsSubscription);
                }
            });
            this.subscriptions.add(editSubscription);
          }
        });
      }
      catch(err) {
        if(err instanceof DisplayError) {
          this.alertMessage = new AlertMessageModel(err.message);
        }else{
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
        }
      }
    })
    this.subscriptions.add(authSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  validateForm(): boolean {
    this.alertMessage = this.externalRecipient.validate();

    return !this.alertMessage;
  }

  submit() {
      this._messageService.saveCountryExternalRecipient(this.externalRecipient, this.countryId)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.NOTIFICATIONS.SAVED_RECIPIENT_SUCCESS', AlertMessageType.Success);
              setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
            })
            .catch(err => {
              if(err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              }else{
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
  }
  
  goBack() {
    this.router.navigateByUrl('/country-admin/settings/country-notification-settings');
  }

  deleteRecipient() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();
    const deleteCountryExternalRecipientSubscription = 
      this._messageService.deleteCountryExternalRecipient(this.countryId, this.externalRecipient.id)
      .then(() => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.NOTIFICATIONS.SUCCESS_DELETED', AlertMessageType.Success);
        this.goBack();
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }
}
