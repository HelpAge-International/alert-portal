import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import {ExternalRecipientModel} from "../model/external-recipient.model";
import {MessageModel} from "../model/message.model";
import {UserType} from '../utils/Enums';
import {CommonUtils} from "../utils/CommonUtils";

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

  getCountrySentMessagesNetwork(uid: string): Observable<MessageModel[]> {
    if (!uid) {
      throw new Error('No countryID');
    }

    const countrySentMessagesSubsciption = this.af.database.list(Constants.APP_STATUS + '/administratorNetworkCountry/' + uid + '/sentmessages')
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

  getSentMessagesLocalNetwork(uid: string): Observable<MessageModel[]> {
    if (!uid) {
      throw new Error('No id');
    }

    const countrySentMessagesSubsciption = this.af.database.list(Constants.APP_STATUS + '/administratorNetwork/' + uid + '/sentmessages')
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
          return this.af.database.list(Constants.APP_STATUS + '/group/country/' + countryId + '/countryallusersgroup')
            .takeUntil(this.ngUnsubscribe)
            .subscribe(countryAllUsersIds => {
              countryAllUsersIds.forEach(countryAllUsersId => {
                messageRefData['/messageRef/country/' + countryId + '/countryallusersgroup/' + countryAllUsersId.$key + '/' + msgId.key] = true;
              });

              if (message.userType[UserType.CountryAdmin]) {
                const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryAdmin);
                this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(refData => {
                    this.af.database.object(Constants.APP_STATUS).update(refData);
                  });
              }

              if (message.userType[UserType.CountryDirector]) {
                const countryDirectorUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryDirector);
                this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryDirectorUserTypeIndex], messageRefData)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(refData => {
                    this.af.database.object(Constants.APP_STATUS).update(refData);
                  });
              }

              return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
            });
        } else {
          let i = 1;
          for (let value in message.userType) {
            if (value) {
              const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));
              if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
                this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(refData => {
                    this.af.database.object(Constants.APP_STATUS).update(refData);
                  });
              } else {
                this.saveCountryUserTypeMessage(countryId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(refData => {
                    this.af.database.object(Constants.APP_STATUS).update(refData);
                  });
              }

              if (i == Object.keys(message.userType).length) {
                return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
              }

              i++;
            }
          }
        }
      });

  }

  saveCountryMessageNetwork(uid: string, agencyCountryMap: Map<string, string>, message: MessageModel): firebase.Promise<any> {
    let countryAgencyMap = CommonUtils.reverseMap(agencyCountryMap);
    return this.af.database.list(Constants.APP_STATUS + '/message').push(message)
      .then(msgId => {
        let messageRefData = {};

        messageRefData['/administratorNetworkCountry/' + uid + '/sentmessages/' + msgId.key] = true;

        if (message.userType[UserType.All]) {
          CommonUtils.convertMapToValuesInArray(agencyCountryMap).forEach(countryId => {
            this.af.database.list(Constants.APP_STATUS + '/group/country/' + countryId + '/countryallusersgroup')
              .takeUntil(this.ngUnsubscribe)
              .subscribe(countryAllUsersIds => {
                countryAllUsersIds.forEach(countryAllUsersId => {
                  messageRefData['/messageRef/country/' + countryId + '/countryallusersgroup/' + countryAllUsersId.$key + '/' + msgId.key] = true;
                });

                if (message.userType[UserType.CountryAdmin]) {
                  const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryAdmin);
                  this.saveAgencyUserTypeMessage(countryAgencyMap.get(countryId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(refData => {
                      this.af.database.object(Constants.APP_STATUS).update(refData);
                    });
                }

                if (message.userType[UserType.CountryDirector]) {
                  const countryDirectorUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryDirector);
                  this.saveAgencyUserTypeMessage(countryAgencyMap.get(countryId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryDirectorUserTypeIndex], messageRefData)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(refData => {
                      this.af.database.object(Constants.APP_STATUS).update(refData);
                    });
                }

                this.af.database.object(Constants.APP_STATUS).update(messageRefData);

              });
          });

        } else {
          CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
            // let i = 1;
            for (let value in message.userType) {
              if (value) {
                const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));
                if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
                  this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(refData => {
                      this.af.database.object(Constants.APP_STATUS).update(refData);
                    });
                } else {
                  this.saveCountryUserTypeMessage(agencyCountryMap.get(agencyId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(refData => {
                      this.af.database.object(Constants.APP_STATUS).update(refData);
                    });
                }

                // if (i == Object.keys(message.userType).length) {
                //   return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
                // }
                //
                // i++;
                this.af.database.object(Constants.APP_STATUS).update(messageRefData);
              }
            }
          });

        }
      });

  }

  saveMessageLocalNetwork(uid: string, agencyCountryMap: Map<string, string>, message: MessageModel): firebase.Promise<any> {
    let countryAgencyMap = CommonUtils.reverseMap(agencyCountryMap);
    return this.af.database.list(Constants.APP_STATUS + '/message').push(message)
      .then(msgId => {
        let messageRefData = {};

        messageRefData['/administratorNetwork/' + uid + '/sentmessages/' + msgId.key] = true;

        if (message.userType[UserType.All]) {
          CommonUtils.convertMapToValuesInArray(agencyCountryMap).forEach(countryId => {
            this.af.database.list(Constants.APP_STATUS + '/group/country/' + countryId + '/countryallusersgroup')
              .takeUntil(this.ngUnsubscribe)
              .subscribe(countryAllUsersIds => {
                countryAllUsersIds.forEach(countryAllUsersId => {
                  messageRefData['/messageRef/country/' + countryId + '/countryallusersgroup/' + countryAllUsersId.$key + '/' + msgId.key] = true;
                });

                if (message.userType[UserType.CountryAdmin]) {
                  const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryAdmin);
                  this.saveAgencyUserTypeMessage(countryAgencyMap.get(countryId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(refData => {
                      this.af.database.object(Constants.APP_STATUS).update(refData);
                    });
                }

                if (message.userType[UserType.CountryDirector]) {
                  const countryDirectorUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryDirector);
                  this.saveAgencyUserTypeMessage(countryAgencyMap.get(countryId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryDirectorUserTypeIndex], messageRefData)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(refData => {
                      this.af.database.object(Constants.APP_STATUS).update(refData);
                    });
                }

                this.af.database.object(Constants.APP_STATUS).update(messageRefData);

              });
          });

        } else {
          CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
            // let i = 1;
            for (let value in message.userType) {
              if (value) {
                const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));
                if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
                  this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(refData => {
                      this.af.database.object(Constants.APP_STATUS).update(refData);
                    });
                } else {
                  this.saveCountryUserTypeMessage(agencyCountryMap.get(agencyId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(refData => {
                      this.af.database.object(Constants.APP_STATUS).update(refData);
                    });
                }

                // if (i == Object.keys(message.userType).length) {
                //   return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
                // }
                //
                // i++;
                this.af.database.object(Constants.APP_STATUS).update(messageRefData);
              }
            }
          });

        }
      });

  }

  deleteCountryMessage(countryId: string, agencyId: string, message: MessageModel): firebase.Promise<any> {

    let messageRefData = {};

    messageRefData['/message/' + message.id] = null;
    messageRefData['/administratorCountry/' + countryId + '/sentmessages/' + message.id] = null;

    let i = 1;
    for (let value in message.userType) {
      if (value) {
        const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));

        if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
          this.deleteAgencyUserTypeMessage(agencyId, message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(refData => {
              this.af.database.object(Constants.APP_STATUS).update(refData);
            });
        } else {
          this.deleteCountryUserTypeMessage(countryId, message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(refData => {
              this.af.database.object(Constants.APP_STATUS).update(refData);
            });
        }

        if (i == Object.keys(message.userType).length) {
          return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
        }

        i++;
      }
    }
  }

  deleteCountryMessageNetwork(uid: string, agencyCountryMap: Map<string, string>, message: MessageModel): firebase.Promise<any> {
    let messageRefData = {};

    messageRefData['/message/' + message.id] = null;
    messageRefData['/administratorNetworkCountry/' + uid + '/sentmessages/' + message.id] = null;

    CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
      // let i = 1;
      for (let value in message.userType) {
        if (value) {
          const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));

          if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
            this.deleteAgencyUserTypeMessage(agencyId, message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(refData => {
                this.af.database.object(Constants.APP_STATUS).update(refData);
              });
          } else {
            this.deleteCountryUserTypeMessage(agencyCountryMap.get(agencyId), message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(refData => {
                this.af.database.object(Constants.APP_STATUS).update(refData);
              });
          }

          // if (i == Object.keys(message.userType).length) {
          // return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
          // }

          // i++;
        }
      }
    });

    return this.af.database.object(Constants.APP_STATUS).update(messageRefData);

  }

  deleteMessageLocalNetwork(uid: string, agencyCountryMap: Map<string, string>, message: MessageModel): firebase.Promise<any> {
    let messageRefData = {};

    messageRefData['/message/' + message.id] = null;
    messageRefData['/administratorNetwork/' + uid + '/sentmessages/' + message.id] = null;

    CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
      // let i = 1;
      for (let value in message.userType) {
        if (value) {
          const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));

          if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
            this.deleteAgencyUserTypeMessage(agencyId, message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(refData => {
                this.af.database.object(Constants.APP_STATUS).update(refData);
              });
          } else {
            this.deleteCountryUserTypeMessage(agencyCountryMap.get(agencyId), message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(refData => {
                this.af.database.object(Constants.APP_STATUS).update(refData);
              });
          }

          // if (i == Object.keys(message.userType).length) {
          // return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
          // }

          // i++;
        }
      }
    });

    return this.af.database.object(Constants.APP_STATUS).update(messageRefData);

  }

  private saveCountryUserTypeMessage(countryId: string, message: MessageModel, messageKey: string, userType: string, messageRefData: {}) {
    return this.af.database.list(Constants.APP_STATUS + '/group/country/' + countryId + '/' + userType)
      .map(items => {
        items.forEach(item => {
          messageRefData['/messageRef/country/' + countryId + '/' + userType + '/' + item.$key + '/' + messageKey] = true;
        });
        return messageRefData;
      });
  }

  private saveAgencyUserTypeMessage(agencyId: string, message: MessageModel, messageKey: string, userType: string, messageRefData: {}): Observable<Object> {
    return this.af.database.list(Constants.APP_STATUS + '/group/agency/' + agencyId + '/' + userType)
      .map(items => {
        items.forEach(item => {
          messageRefData['/messageRef/agency/' + agencyId + '/' + userType + '/' + item.$key + '/' + messageKey] = true;
        });
        return messageRefData;
      });
  }

  private deleteCountryUserTypeMessage(countryId: string, messageKey: string, userType: string, messageRefData: Object) {
    return this.af.database.list(Constants.APP_STATUS + '/group/country/' + countryId + '/' + userType)
      .map(items => {
        items.forEach(item => {
          messageRefData['/messageRef/country/' + countryId + '/' + userType + '/' + item.$key + '/' + messageKey] = null;
        });
        return messageRefData;
      });
  }

  private deleteAgencyUserTypeMessage(agencyId: string, messageKey: string, userType: string, messageRefData: Object) {
    return this.af.database.list(Constants.APP_STATUS + '/group/agency/' + agencyId + '/' + userType)
      .map(items => {
        items.forEach(item => {
          messageRefData['/messageRef/agency/' + agencyId + '/' + userType + '/' + item.$key + '/' + messageKey] = null;
        });
        return messageRefData;
      });
  }

}
