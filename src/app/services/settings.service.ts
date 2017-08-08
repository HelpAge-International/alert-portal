import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable} from 'rxjs';
import {PermissionSettingsModel} from "../model/permission-settings.model";
import {ModuleSettingsModel} from "../model/module-settings.model";
import {ClockSettingsModel} from "../model/clock-settings.model";
import {NotificationSettingsModel} from "../model/notification-settings.model";
import {ModelAgencyPrivacy} from "../model/agency-privacy.model";
import {Privacy} from "../utils/Enums";

@Injectable()
export class SettingsService {

  constructor(private af: AngularFire) {
  }

  // COUNTRY PERMISSIONS

  getCountryPermissionSettings(agencyId: string, countryId: string): Observable<PermissionSettingsModel> {
    if (!agencyId || !countryId) {
      return null;
    }
    const permissionSettingsSubscription = this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/permissionSettings')
      .map(items => {
        if (items.$key) {
          let permissions = new PermissionSettingsModel();
          permissions.mapFromObject(items);

          return permissions;
        }
        return null;
      });

    return permissionSettingsSubscription;
  }

  saveCountryPermissionSettings(agencyId: string, countryId: string, permissionSettings: PermissionSettingsModel): firebase.Promise<any> {
    if (!agencyId || !countryId) {
      return null;
    }

    const permissionSettingsData = {};
    permissionSettingsData['/countryOffice/' + agencyId + '/' + countryId + '/permissionSettings'] = permissionSettings;

    return this.af.database.object(Constants.APP_STATUS).update(permissionSettingsData);
  }


  // COUNTRY MODULES

  getCountryModulesSettings(countryId: string): Observable<ModuleSettingsModel[]> {
    if (!countryId) {
      return null;
    }
    const moduleSettingsSubscription = this.af.database.object(Constants.APP_STATUS + '/module/' + countryId)
      .map(items => {
        if (items.$key) {
          let modules = [];
          items.forEach(item => {
            const module = new ModuleSettingsModel();
            module.mapFromObject(item);
            modules.push(module);
          });

          return modules;
        }
        return null;
      });

    return moduleSettingsSubscription;
  }

  saveCountryModuleSettings(countryId: string, moduleSettings: ModuleSettingsModel[]): firebase.Promise<any> {
    if (!countryId || !moduleSettings) {
      throw new Error('Country or module value is null');
    }

    const moduleSettingsData = {};

    moduleSettingsData['/module/' + countryId] = moduleSettings;

    return this.af.database.object(Constants.APP_STATUS).update(moduleSettingsData);
  }

  public getPrivacySettingForCountry(countryId): Observable<any> {
    return this.af.database.object(Constants.APP_STATUS + "/module/" + countryId, {preserveSnapshot: true})
      .map(snap => {
        if (snap.val()) {
          let privacy = new ModelAgencyPrivacy();
          privacy.mpa = snap.val()[0].privacy;
          privacy.apa = snap.val()[1].privacy;
          privacy.chs = snap.val()[2].privacy;
          privacy.riskMonitoring = snap.val()[3].privacy;
          privacy.officeProfile = snap.val()[4].privacy;
          privacy.responsePlan = snap.val()[5].privacy;
          privacy.id = snap.key;
          return privacy;
        }
      });
  }


  // COUNTRY CLOCK SETTINGS

  getCountryClockSettings(agencyId: string, countryId: string): Observable<ClockSettingsModel> {
    if (!agencyId || !countryId) {
      throw new Error("No agencyID or countryID");
    }
    const clockSettingsSubscription = this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/clockSettings')
      .map(items => {
        if (items.$key) {
          const clockSettings = new ClockSettingsModel();
          clockSettings.mapFromObject(items);
          return clockSettings;
        }
        return null;
      });

    return clockSettingsSubscription;
  }

  saveCountryClockSettings(agencyId: string, countryId: string, clockSettings: ClockSettingsModel): firebase.Promise<any> {
    if (!agencyId || !countryId) {
      return null;
    }

    const clockSettingsData = {};
    clockSettingsData['/countryOffice/' + agencyId + '/' + countryId + '/clockSettings'] = clockSettings;

    return this.af.database.object(Constants.APP_STATUS).update(clockSettingsData);
  }


  // COUNTRY NOTIFICATION SETTINGS

  getCountryNotificationSettings(agencyId: string, countryId: string): Observable<NotificationSettingsModel[]> {

    const notificationSettingsSubscription =
      this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/defaultNotificationSettings')
        .map(items => {
          const notificationSettings: NotificationSettingsModel[] = [];
          items.forEach(item => {
            const notificationSetting = new NotificationSettingsModel();
            notificationSetting.mapFromObject(item);
            notificationSettings.push(notificationSetting);
          });
          return notificationSettings;
        });

    return notificationSettingsSubscription;
  }

  saveCountryNotificationSettings(agencyId: string, countryId: string, notificationSettings: NotificationSettingsModel[]): firebase.Promise<any> {
    if (!agencyId || !countryId) {
      return null;
    }

    const notificationsSettingsData = {};
    notificationsSettingsData['/countryOffice/' + agencyId + '/' + countryId + '/defaultNotificationSettings'] = notificationSettings;

    return this.af.database.object(Constants.APP_STATUS).update(notificationsSettingsData);
  }

  getAgencyClockSettings(agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId + "/clockSettings");
  }
}
