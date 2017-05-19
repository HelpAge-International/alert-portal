import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable} from 'rxjs';
import { PermissionSettingsModel } from "../model/permission-settings.model";

@Injectable()
export class SettingsService {

  constructor(private af: AngularFire, private subscriptions: RxHelper) {}

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
}