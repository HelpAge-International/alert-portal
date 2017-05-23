import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable} from 'rxjs';
import { ExternalRecipientModel } from "../model/external-recipient.model";

@Injectable()
export class MessageService {

  constructor(private af: AngularFire, private subscriptions: RxHelper) {}

  getCountryExternalRecipients(countryId: string): Observable<ExternalRecipientModel[]> {

    const externalRecipientSubscription = this.af.database.list(Constants.APP_STATUS + '/externalRecipient/' + countryId)
      .map(items =>
        {
            const externalRecipients: ExternalRecipientModel[] = [];
            items.forEach(item => { 
              let externalRecipient = new ExternalRecipientModel();
              externalRecipient.mapFromObject(item);
              externalRecipient.id = item.$key;
              externalRecipients.push(externalRecipient);
            });
            return externalRecipients;
        });

    return externalRecipientSubscription;
  }

  getCountryExternalRecipient(countryId: string, recipientId: string): Observable<ExternalRecipientModel> {
    if(!countryId || !recipientId) { throw new Error('No countryID or recipientID'); }

    const externalRecipientSubscription = this.af.database.object(Constants.APP_STATUS + '/externalRecipient/' + countryId + '/' + recipientId)
      .map(item =>
        {
            let externalRecipient = new ExternalRecipientModel();
            
            if(item.$key)
            {
              externalRecipient.mapFromObject(item);
              externalRecipient.id = item.$key;
            }
            
            return externalRecipient;
        });

    return externalRecipientSubscription;
  }

  saveCountryExternalRecipient(externalRecipient: ExternalRecipientModel, countryId: string): firebase.Promise<any> {
    const externalRecipientData = {};

    if(!countryId) { throw new Error('No countryID'); }

    let uid = externalRecipient.id;

    if (!uid) {
      const recipientList =  this.af.database.list(Constants.APP_STATUS + '/externalRecipient/' + countryId + '/');
      return recipientList.push(externalRecipient);
    } else {
      externalRecipientData['/externalRecipient/' + countryId + '/' + uid] = externalRecipient;
      return this.af.database.object(Constants.APP_STATUS).update(externalRecipientData);
    }
  }

  deleteCountryExternalRecipient(countryId: string, uid: string): firebase.Promise<any> {
    const externalRecipientData = {};

    if (!uid || !countryId) {
      throw new Error('UserID or countryID not present');
    }
    externalRecipientData['/externalRecipient/' + countryId + '/' + uid] = null;
    return this.af.database.object(Constants.APP_STATUS).update(externalRecipientData);
  }
}