import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable} from 'rxjs';
import { PermissionSettingsModel } from "../model/permission-settings.model";
import { ModuleSettingsModel } from "../model/module-settings.model";
import { ClockSettingsModel } from "../model/clock-settings.model";

@Injectable()
export class SettingsService {

  constructor(private af: AngularFire, private subscriptions: RxHelper) {}

  // PERMISSIONS

  getPermissionSettings(agencyId: string, countryId: string): Observable<PermissionSettingsModel> {
    if (!agencyId || !countryId) {
      return null;
    }
    const permissionSettingsSubscription = this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId +'/permissionSettings')
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
  
  savePermissionSettings(agencyId: string, countryId: string, permissionSettings: PermissionSettingsModel): firebase.Promise<any> {
    if (!agencyId || !countryId) {
      return null;
    }

    const permissionSettingsData = {}; 
    permissionSettingsData['/countryOffice/' + agencyId + '/' + countryId +'/permissionSettings'] = permissionSettings;
    
    return this.af.database.object(Constants.APP_STATUS).update(permissionSettingsData);
  }

  // MODULES

  getModulesSettings(countryId: string): Observable<ModuleSettingsModel[]> {
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

  saveModuleSettings(countryId: string, moduleSettings: ModuleSettingsModel[]): firebase.Promise<any> {
    if (!countryId || !moduleSettings) {
      throw new Error('Country or module value is null');
    }

    const moduleSettingsData = {};

    moduleSettingsData['/module/' + countryId] = moduleSettings;
    
    return this.af.database.object(Constants.APP_STATUS).update(moduleSettingsData);
  }

  getCountryClockSettings(agencyId:string, countryId: string): Observable<ClockSettingsModel>
  {
    if (!agencyId || !countryId) {
      throw new Error("No agencyID or countryID");
    }
    const clockSettingsSubscription = this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId +'/clockSettings')
      .map(items => {
        if (items.$key) {
          const clockSettings = new ClockSettingsModel();
          clockSettings.mapFromObject(items);
          console.log(clockSettings);
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
}