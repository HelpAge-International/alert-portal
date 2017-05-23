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

  saveCountryExternalRecipient(externalRecipient: ExternalRecipientModel, countryId: string): firebase.Promise<any> {
    const externalRecipientData = {};

    if(!countryId) { throw new Error('No countryID'); }

    let uid = externalRecipient.id;

    if (!uid) {
         const recipientList =  this.af.database.list(Constants.APP_STATUS + '/externalRecipient/' + countryId + '/');
         return recipientList.push(externalRecipient);
    } else {
      
      externalRecipientData['/externalRecipient/' + countryId + '/' + uid] = externalRecipient;
      // this.getUser(uid).subscribe(oldUser => {
      //   if (oldUser.email && oldUser.email !== userPublic.email) {
      //     return this.deletePartnerUser(uid).then(bool => {
      //       if (bool) {
      //         partner.id = null; // force new user creation
      //         return this.savePartnerUser(partner, userPublic);
      //       }
      //     })
      //       .catch(err => {
      //         throw new Error(err.message);
      //       });
      //   }
      
        return this.af.database.object(Constants.APP_STATUS).update(externalRecipientData);
    }
  }
}