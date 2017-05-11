import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable} from 'rxjs';

@Injectable()
export class NotificationSettingsService {

  constructor(private af: AngularFire, private subscriptions: RxHelper) {}

  getNotificationSettings(agencyId: string): Observable<any> {

    const notificationSettingsSubscription = this.af.database.list(Constants.APP_STATUS + '/agency/' + agencyId + '/notificationSetting')
      .map(items =>
        {
            const notificationSettings: any[] = [];
            items.forEach(item => { notificationSettings[item.$key] = false; });
            return notificationSettings;
        });

    return notificationSettingsSubscription;
  }
}