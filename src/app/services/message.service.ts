import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import {ExternalRecipientModel} from "../model/external-recipient.model";
import {MessageModel} from "../model/message.model";
import {UserType} from '../utils/Enums';

@Injectable()
export class MessageService {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire) {
  }

  // COUNTRY ADMIN

  getCountryExternalRecipients(countryId: string): Observable<ExternalRecipientModel[]> {

    const externalRecipientSubscription = this.af.database.list(Constants.APP_STATUS + '/externalRecipient/' + countryId)
      .map(items => {
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
    if (!countryId || !recipientId) {
      throw new Error('No countryID or recipientID');
    }

    const externalRecipientSubscription = this.af.database.object(Constants.APP_STATUS + '/externalRecipient/' + countryId + '/' + recipientId)
      .map(item => {
        let externalRecipient = new ExternalRecipientModel();

        if (item.$key) {
          externalRecipient.mapFromObject(item);
          externalRecipient.id = item.$key;
        }

        return externalRecipient;
      });

    return externalRecipientSubscription;
  }

  saveCountryExternalRecipient(externalRecipient: ExternalRecipientModel, countryId: string): firebase.Promise<any> {
    const externalRecipientData = {};

    if (!countryId) {
      throw new Error('No countryID');
    }

    let uid = externalRecipient.id;

    if (!uid) {
      const recipientList = this.af.database.list(Constants.APP_STATUS + '/externalRecipient/' + countryId + '/');
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

  getCountrySentMessages(countryId: string): Observable<MessageModel[]> {
    if (!countryId) {
      throw new Error('No countryID');
    }

    const countrySentMessagesSubsciption = this.af.database.list(Constants.APP_STATUS + '/administratorCountry/' + countryId + '/sentmessages')
      .map(items => {
        let sentMessages = [];
        if (items) {
          items.forEach(item => {
            this.af.database.object(Constants.APP_STATUS + '/message/' + item.$key)
              .subscribe(message => {
                  if (message.content) {
                    let sentMessage = new MessageModel();
                    sentMessage.mapFromObject(message);
                    sentMessage.id = message.$key;
                    sentMessages.push(sentMessage);
                  }

                  return sentMessages;
                },
                err => console.log('Could not find message'))
          })
        }
        return sentMessages;
      });
    return countrySentMessagesSubsciption;
  }

  saveCountryMessage(countryId: string, agencyId: string, message: MessageModel): firebase.Promise<any> {
    return this.af.database.list(Constants.APP_STATUS + '/message').push(message)
      .then(msgId => {
        let messageRefData = {};

        messageRefData['/administratorCountry/' + countryId + '/sentmessages/' + msgId.key] = true;

        if (message.userType[UserType.All]) {
          this.saveCountryUserTypeMessage(countryId, message, msgId.key, 'countryallusersgroup', messageRefData)
            .subscribe(messageRef => {
              messageRefData = messageRef;
              console.log('assign routes');
            });
          if (message.userType[UserType.CountryAdmin]) {
            this.saveAgencyUserTypeMessage(countryId, message, msgId.key, 'countryadmins', messageRefData);
          }
          if (message.userType[UserType.CountryDirector]) {
            this.saveAgencyUserTypeMessage(countryId, message, msgId.key, 'countrydirectors', messageRefData);
          }
          return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
        } else {
          return this.buildMessageRef(countryId, message, msgId.key, messageRefData)
            .then(messageRef => {
              return this.af.database.object(Constants.APP_STATUS).update(messageRef);
            });
        }
      });

  }

  deleteCountryMessage(countryId: string, agencyId: string, messageId: string): firebase.Promise<any> {
    console.log(messageId);

    let messageRefData = {};

    messageRefData['/message/' + messageId] = null;
    messageRefData['/administratorCountry/' + countryId + '/sentmessages/' + messageId] = null;

    this.af.database.list(Constants.APP_STATUS + '/message/' + messageId)
      .subscribe(userMessage => {
        let message = new MessageModel();
        message.mapFromObject(userMessage);

        message.userType.forEach((item, index) => {
          switch (index) {
            case UserType.CountryAdmin:
              this.deleteAgencyUserTypeMessage(countryId, messageId, 'countryadmins', messageRefData);
              break;
            case UserType.CountryDirector:
              this.deleteAgencyUserTypeMessage(countryId, messageId, 'countrydirectors', messageRefData);
              break;
            case UserType.ErtLeader:
              this.deleteCountryUserTypeMessage(countryId, messageId, 'ertleads', messageRefData);
              break;
            case UserType.Ert:
              this.deleteCountryUserTypeMessage(countryId, messageId, 'erts', messageRefData);
              break;
            case UserType.Donor:
              this.deleteCountryUserTypeMessage(countryId, messageId, 'donor', messageRefData);
              break;
            case UserType.NonAlert:
              this.deleteCountryUserTypeMessage(countryId, messageId, 'partner', messageRefData);
              break;
          }
        });
      });
    return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
  }

  private saveCountryUserTypeMessage(countryId: string, message: MessageModel, messageKey: string, userType: string, messageRefData: Object) {
    return this.af.database.list(Constants.APP_STATUS + '/group/country/' + countryId + '/' + userType)
      .map(items => {
        items.forEach(item => {
          messageRefData['/messageRef/country/' + countryId + '/' + userType + '/' + item.$key + '/' + messageKey] = message.time;
        });
        return messageRefData;
      });
  }

  private saveAgencyUserTypeMessage(agencyId: string, message: MessageModel, messageKey: string, userType: string, messageRefData: Object) {
    this.af.database.list(Constants.APP_STATUS + '/group/agency/' + agencyId + '/' + userType)
      .map(items => {
        items.forEach(item => {
          messageRefData['/messageRef/agency/' + agencyId + '/' + userType + '/' + item.$key + '/' + messageKey] = message.time;
        });
        return messageRefData;
      });
  }

  private deleteCountryUserTypeMessage(countryId: string, messageKey: string, userType: string, messageRefData: Object) {
    this.af.database.list(Constants.APP_STATUS + '/group/country/' + countryId + '/' + userType)
      .subscribe(items => {
        items.forEach(item => {
          messageRefData['/messageRef/country/' + countryId + '/' + userType + '/' + item.$key + '/' + messageKey] = null;
        });
      });
  }

  private deleteAgencyUserTypeMessage(agencyId: string, messageKey: string, userType: string, messageRefData: Object) {
    this.af.database.list(Constants.APP_STATUS + '/group/agency/' + agencyId + '/' + userType)
      .subscribe(items => {
        items.forEach(item => {
          messageRefData['/messageRef/agency/' + agencyId + '/' + userType + '/' + item.$key + '/' + messageKey] = null;
        });
      });
  }

  private buildMessageRef(countryId, message: MessageModel, messageId, messageRefData): Promise<any> {
    return new Promise<Object>((resolve, reject) => {
      let i = 0;
      message.userType.forEach((item, index) => {
        switch (index) {
          case UserType.CountryAdmin:
            this.saveAgencyUserTypeMessage(countryId, message, messageId, 'countryadmins', messageRefData)
            break;
          case UserType.CountryDirector:
            this.saveAgencyUserTypeMessage(countryId, message, messageId, 'countrydirectors', messageRefData);
            break;
          case UserType.ErtLeader:
            this.saveCountryUserTypeMessage(countryId, message, messageId, 'ertleads', messageRefData);
            break;
          case UserType.Ert:
            this.saveCountryUserTypeMessage(countryId, message, messageId, 'erts', messageRefData);
            break;
          case UserType.Donor:
            this.saveCountryUserTypeMessage(countryId, message, messageId, 'donor', messageRefData);
            break;
          case UserType.NonAlert:
            this.saveCountryUserTypeMessage(countryId, message, messageId, 'partner', messageRefData);
            break;
        }

        i++;

        if (i == Object.keys(message.userType).length) {
          resolve(messageRefData);
        }
      });
    });
  }
}
