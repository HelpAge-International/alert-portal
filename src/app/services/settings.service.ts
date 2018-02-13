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
import {ModelDepartmentCanDelete} from "../agency-admin/settings/department/department.component";
import {ModelDepartment} from "../model/department.model";

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
          if (snap.val()[6]) {
            privacy.conflictIndicators = snap.val()[6].privacy
          }
          return privacy;
        }
      });
  }

  public updateCountryPrivacy(countryId, module, countryPrivacy) {
    if (module.mpa == Privacy.Private) {
      countryPrivacy.mpa = Privacy.Private;
    } else if (module.mpa == Privacy.Network && countryPrivacy.mpa == Privacy.Public) {
      countryPrivacy.mpa = Privacy.Network;
    }
    if (module.apa == Privacy.Private) {
      countryPrivacy.apa = Privacy.Private;
    } else if (module.apa == Privacy.Network && countryPrivacy.apa == Privacy.Public) {
      countryPrivacy.apa = Privacy.Network;
    }
    if (module.chs == Privacy.Private) {
      countryPrivacy.chs = Privacy.Private;
    } else if (module.chs == Privacy.Network && countryPrivacy.chs == Privacy.Public) {
      countryPrivacy.chs = Privacy.Network;
    }
    if (module.riskMonitoring == Privacy.Private) {
      countryPrivacy.riskMonitoring = Privacy.Private;
    } else if (module.riskMonitoring == Privacy.Network && countryPrivacy.riskMonitoring == Privacy.Public) {
      countryPrivacy.riskMonitoring = Privacy.Network;
    }
    if (module.responsePlan == Privacy.Private) {
      countryPrivacy.responsePlan = Privacy.Private;
    } else if (module.responsePlan == Privacy.Network && countryPrivacy.responsePlan == Privacy.Public) {
      countryPrivacy.responsePlan = Privacy.Network;
    }
    if (module.officeProfile == Privacy.Private) {
      countryPrivacy.officeProfile = Privacy.Private;
    } else if (module.officeProfile == Privacy.Network && countryPrivacy.officeProfile == Privacy.Public) {
      countryPrivacy.officeProfile = Privacy.Network;
    }

    let update = {};
    update["/module/" + countryId + "/0/privacy"] = countryPrivacy.mpa;
    update["/module/" + countryId + "/1/privacy"] = countryPrivacy.apa;
    update["/module/" + countryId + "/2/privacy"] = countryPrivacy.chs;
    update["/module/" + countryId + "/3/privacy"] = countryPrivacy.riskMonitoring;
    update["/module/" + countryId + "/4/privacy"] = countryPrivacy.officeProfile;
    update["/module/" + countryId + "/5/privacy"] = countryPrivacy.responsePlan;

    this.af.database.object(Constants.APP_STATUS).update(update);
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

  getNetworkClockSettings(networkId: string): Observable<ClockSettingsModel> {
    if (!networkId) {
      throw new Error("No network id");
    }
    return this.af.database.object(Constants.APP_STATUS + '/network/' + networkId + '/clockSettings')
      .map(items => {
        if (items.$key) {
          const clockSettings = new ClockSettingsModel();
          clockSettings.mapFromObject(items);
          return clockSettings;
        }
        return null;
      });
  }

  getNetworkCountryClockSettings(networkId: string, networkCountryId:string): Observable<ClockSettingsModel> {
    if (!networkId || !networkCountryId) {
      throw new Error("No network id / network country id");
    }
    return this.af.database.object(Constants.APP_STATUS + '/networkCountry/' + networkId +'/'+ networkCountryId + '/clockSettings')
      .map(items => {
        if (items.$key) {
          const clockSettings = new ClockSettingsModel();
          clockSettings.mapFromObject(items);
          return clockSettings;
        }
        return null;
      });
  }

  saveNetworkClockSettings(networkId: string, clockSettings: ClockSettingsModel): firebase.Promise<any> {
    if (!networkId) {
      return null;
    }

    const clockSettingsData = {};
    clockSettingsData['/network/' + networkId + '/clockSettings'] = clockSettings;

    return this.af.database.object(Constants.APP_STATUS).update(clockSettingsData);
  }

  saveNetworkCountryClockSettings(networkId: string, networkCountryId:string, clockSettings: ClockSettingsModel): firebase.Promise<any> {
    if (!networkId || !networkCountryId) {
      return null;
    }

    const clockSettingsData = {};
    clockSettingsData['/networkCountry/' + networkId + '/' + networkCountryId + '/clockSettings'] = clockSettings;

    return this.af.database.object(Constants.APP_STATUS).update(clockSettingsData);
  }

  getNetworkPlanSettings(networkId: string) {
    if (!networkId) {
      return null;
    }

    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId + "/responsePlanSettings/sections", {preserveSnapshot: true})
      .map(snap => {
        if (snap.val()) {
          return snap.val();
        }
      })
  }

  saveNetworkPlanSettings(networkId: string, sections: [boolean]): firebase.Promise<void> {
    const planSettings = {};
    planSettings['/network/' + networkId + '/responsePlanSettings/sections'] = sections;
    return this.af.database.object(Constants.APP_STATUS).update(planSettings);
  }

  getCountryLocalDepartments(agencyId, countryId) {
    return this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId + "/departments", {preserveSnapshot: true})
      .map((snapshot) => {
        let depts:ModelDepartment[] = [];
        snapshot.forEach((snap) => {
          let y: ModelDepartment = new ModelDepartment();
          y.id = snap.key;
          y.name = snap.val().name;
          depts.push(y);
        });
        return depts
      });
  }

}
