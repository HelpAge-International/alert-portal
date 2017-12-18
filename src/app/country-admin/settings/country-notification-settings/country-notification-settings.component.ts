import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from "../../../services/user.service";
import {Constants} from '../../../utils/Constants';
import {AlertMessageType, NotificationSettingEvents, UserType} from '../../../utils/Enums';
import {SettingsService} from "../../../services/settings.service";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {DisplayError} from "../../../errors/display.error";
import {NotificationSettingsModel} from "../../../model/notification-settings.model";
import {ExternalRecipientModel} from "../../../model/external-recipient.model";
import {MessageService} from "../../../services/message.service";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";

declare var jQuery: any;

@Component({
  selector: 'app-country-notification-settings',
  templateUrl: './country-notification-settings.component.html',
  styleUrls: ['./country-notification-settings.component.css']
})

export class CountryNotificationSettingsComponent implements OnInit, OnDestroy {
  private uid: string;
  private agencyId: string;
  private countryId: string;

  // Constants and enums
  NOTIFICATION_SETTINGS = NotificationSettingEvents;
  NOTIFICATION_SETTINGS_SELECTION = Constants.NOTIFICATION_SETTINGS;
  USER_TYPE = Constants.USER_TYPE;
  USER_TYPE_SELECTION =
    Constants.USER_TYPE_SELECTION.filter(x => x != UserType.All && x != UserType.NonAlert && x != UserType.GlobalUser);

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private notificationSettings: NotificationSettingsModel[];
  private externalRecipients: ExternalRecipientModel[];

  // Other
  private activeNotification: any;
  private activeNotificationSetting: NotificationSettingsModel;
  private notificationName: string;
  private settingName: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _settingsService: SettingsService,
              private _messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryId = countryId;
      this.agencyId = agencyId;

      this._settingsService.getCountryNotificationSettings(this.agencyId, this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(notificationSettings => {
          this.notificationSettings = notificationSettings;
        });

      this._messageService.getCountryExternalRecipients(this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(externalRecipients => {
          this.externalRecipients = externalRecipients;
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  validateForm(): boolean {
    this.notificationSettings.forEach(notification => {
      this.alertMessage = notification.validate();
      if (this.alertMessage) {
        return;
      }
    });

    return !this.alertMessage;
  }

  submit() {
    this._settingsService.saveCountryNotificationSettings(this.agencyId, this.countryId, this.notificationSettings)
      .then(() => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.NOTIFICATIONS.SAVED_SUCCESS', AlertMessageType.Success);
      })
      .catch(err => {
        if (err instanceof DisplayError) {
          this.alertMessage = new AlertMessageModel(err.message);
        } else {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
        }
      });
  }

  selectUserType(activeNotification: NotificationSettingsModel, action, notificationName) {
    this.activeNotification = action;
    this.activeNotificationSetting = activeNotification as NotificationSettingsModel;
    //this.activeNotificationSetting.mapFromObject(activeNotification);

    this.notificationName = notificationName;

    jQuery("#select-user-type").modal("show");
  }

  saveUserType() {
    this.notificationSettings.forEach(notification => {
      if (notification == this.activeNotification) {
        console.log(notification);
        notification = this.activeNotificationSetting;
      }
    });


    //this.notificationSettings.pop();
    this.closeModal();
  }

  closeModal() {
    jQuery("#select-user-type").modal("hide");
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  addRecipient() {
    this.router.navigateByUrl('/country-admin/settings/country-notification-settings/country-add-external-recipient');
  }

  editRecipient(recipientId: string) {
    this.router.navigate(['/country-admin/settings/country-notification-settings/country-add-external-recipient', {
      id: recipientId
    }], {skipLocationChange: true});
  }

}
