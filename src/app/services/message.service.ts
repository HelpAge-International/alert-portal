
import {takeUntil} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFireDatabase, SnapshotAction} from '@angular/fire/database';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import {ExternalRecipientModel} from "../model/external-recipient.model";
import {MessageModel} from "../model/message.model";
import {UserType} from '../utils/Enums';
import {CommonUtils} from "../utils/CommonUtils";

@Injectable()
export class MessageService {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private afd: AngularFireDatabase) {
  }

  // COUNTRY ADMIN

  getCountryExternalRecipients(countryId: string): Observable<ExternalRecipientModel[]> {

    const externalRecipientSubscription = this.afd.list(Constants.APP_STATUS + '/externalRecipient/' + countryId)
      .snapshotChanges()
      .map((items: SnapshotAction<ExternalRecipientModel>[]) => {
        const externalRecipients: ExternalRecipientModel[] = [];
        items.forEach(item => {
          let externalRecipient = new ExternalRecipientModel();
          externalRecipient.mapFromObject(item.payload.val());
          externalRecipient.id = item.key;
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

    const externalRecipientSubscription = this.afd.object(Constants.APP_STATUS + '/externalRecipient/' + countryId + '/' + recipientId)
      .snapshotChanges()
      .map((item: SnapshotAction<ExternalRecipientModel>) => {
        let externalRecipient = new ExternalRecipientModel();

        if (item.key) {
          externalRecipient.mapFromObject(item.payload.val());
          externalRecipient.id = item.key;
        }

        return externalRecipient;
      });

    return externalRecipientSubscription;
  }

  saveCountryExternalRecipient(externalRecipient: ExternalRecipientModel, countryId: string): Promise<any> {
    const externalRecipientData = {};

    if (!countryId) {
      throw new Error('No countryID');
    }

    let uid = externalRecipient.id;

    if (!uid) {
      const recipientList = this.afd.list(Constants.APP_STATUS + '/externalRecipient/' + countryId + '/');
      return recipientList.push(externalRecipient).then();
    } else {
      externalRecipientData['/externalRecipient/' + countryId + '/' + uid] = externalRecipient;
      return this.afd.object(Constants.APP_STATUS).update(externalRecipientData);
    }
  }

  deleteCountryExternalRecipient(countryId: string, uid: string): Promise<any> {
    const externalRecipientData = {};

    if (!uid || !countryId) {
      throw new Error('UserID or countryID not present');
    }
    externalRecipientData['/externalRecipient/' + countryId + '/' + uid] = null;
    return this.afd.object(Constants.APP_STATUS).update(externalRecipientData);
  }

  getCountrySentMessages(countryId: string): Observable<MessageModel[]> {
    if (!countryId) {
      throw new Error('No countryID');
    }

    const countrySentMessagesSubsciption = this.afd.list(Constants.APP_STATUS + '/administratorCountry/' + countryId + '/sentmessages')
      .snapshotChanges()
      .map((items: SnapshotAction<MessageModel>[]) => {
        let sentMessages = [];
        if (items) {
          items.forEach(item => {
            this.afd.object(Constants.APP_STATUS + '/message/' + item.key)
              .snapshotChanges()
              .subscribe((message: SnapshotAction<MessageModel>) => {
                  if (message.payload.val().content) {
                    let sentMessage = new MessageModel();
                    sentMessage.mapFromObject(message.payload.val());
                    sentMessage.id = message.key;
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

    const countrySentMessagesSubsciption = this.afd.list(Constants.APP_STATUS + '/administratorNetworkCountry/' + uid + '/sentmessages')
      .snapshotChanges()
      .map((items: SnapshotAction<MessageModel>[]) => {
        let sentMessages = [];
        if (items) {
          items.forEach(item => {
            this.afd.object(Constants.APP_STATUS + '/message/' + item.key)
              .snapshotChanges()
              .subscribe((message: SnapshotAction<MessageModel>) => {
                  if (message.payload.val().content) {
                    let sentMessage = new MessageModel();
                    sentMessage.mapFromObject(message.payload.val());
                    sentMessage.id = message.key;
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

    const countrySentMessagesSubsciption = this.afd.list(Constants.APP_STATUS + '/administratorNetwork/' + uid + '/sentmessages')
      .snapshotChanges()
      .map((items:SnapshotAction<MessageModel>[]) => {
        let sentMessages = [];
        if (items) {
          items.forEach(item => {
            this.afd.object(Constants.APP_STATUS + '/message/' + item.key)
              .snapshotChanges()
              .subscribe((message: SnapshotAction<MessageModel>) => {
                  if (message.payload.val().content) {
                    let sentMessage = new MessageModel();
                    sentMessage.mapFromObject(message.payload.val());
                    sentMessage.id = message.key;
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

  saveCountryMessage(countryId: string, agencyId: string, message: MessageModel): Promise<any> {
    return this.afd.list(Constants.APP_STATUS + '/message').push(message)
      .then(msgId => {
        let messageRefData = {};

        messageRefData['/administratorCountry/' + countryId + '/sentmessages/' + msgId.key] = true;

        if (message.userType[UserType.All]) {
          this.afd.list(Constants.APP_STATUS + '/group/country/' + countryId + '/countryallusersgroup')
            .snapshotChanges()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((countryAllUsersIds: SnapshotAction<any>[]) => {
              countryAllUsersIds.forEach(countryAllUsersId => {
                messageRefData['/messageRef/country/' + countryId + '/countryallusersgroup/' + countryAllUsersId.key + '/' + msgId.key] = true;
              });

              if (message.userType[UserType.CountryAdmin]) {
                const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryAdmin);
                this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData).pipe(
                  takeUntil(this.ngUnsubscribe))
                  .subscribe(refData => {
                    this.afd.object(Constants.APP_STATUS).update(refData);
                  });
              }

              if (message.userType[UserType.CountryDirector]) {
                const countryDirectorUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryDirector);
                this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryDirectorUserTypeIndex], messageRefData).pipe(
                  takeUntil(this.ngUnsubscribe))
                  .subscribe(refData => {
                    this.afd.object(Constants.APP_STATUS).update(refData);
                  });
              }

              return this.afd.object(Constants.APP_STATUS).update(messageRefData);
            });
        } else {
          let i = 1;
          for (let value in message.userType) {
            if (value) {
              const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));
              if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
                this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData).pipe(
                  takeUntil(this.ngUnsubscribe))
                  .subscribe(refData => {
                    this.afd.object(Constants.APP_STATUS).update(refData);
                  });
              } else {
                this.saveCountryUserTypeMessage(countryId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe(refData => {
                    this.afd.object(Constants.APP_STATUS).update(refData);
                  });
              }

              if (i == Object.keys(message.userType).length) {
                return this.afd.object(Constants.APP_STATUS).update(messageRefData);
              }

              i++;
            }
          }
        }
      });

  }

  saveCountryMessageNetwork(uid: string, agencyCountryMap: Map<string, string>, message: MessageModel): Promise<any> {
    let countryAgencyMap = CommonUtils.reverseMap(agencyCountryMap);
    return this.afd.list(Constants.APP_STATUS + '/message').push(message)
      .then(msgId => {
        let messageRefData = {};

        messageRefData['/administratorNetworkCountry/' + uid + '/sentmessages/' + msgId.key] = true;

        if (message.userType[UserType.All]) {
          CommonUtils.convertMapToValuesInArray(agencyCountryMap).forEach(countryId => {
            this.afd.list(Constants.APP_STATUS + '/group/country/' + countryId + '/countryallusersgroup')
              .snapshotChanges()
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((countryAllUsersIds:SnapshotAction<any>[]) => {
                countryAllUsersIds.forEach(countryAllUsersId => {
                  messageRefData['/messageRef/country/' + countryId + '/countryallusersgroup/' + countryAllUsersId.key + '/' + msgId.key] = true;
                });

                if (message.userType[UserType.CountryAdmin]) {
                  const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryAdmin);
                  this.saveAgencyUserTypeMessage(countryAgencyMap.get(countryId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe(refData => {
                      this.afd.object(Constants.APP_STATUS).update(refData);
                    });
                }

                if (message.userType[UserType.CountryDirector]) {
                  const countryDirectorUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryDirector);
                  this.saveAgencyUserTypeMessage(countryAgencyMap.get(countryId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryDirectorUserTypeIndex], messageRefData).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(refData => {
                      this.afd.object(Constants.APP_STATUS).update(refData);
                    });
                }

                this.afd.object(Constants.APP_STATUS).update(messageRefData);

              });
          });

        } else {
          CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
            // let i = 1;
            for (let value in message.userType) {
              if (value) {
                const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));
                if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
                  this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(refData => {
                      this.afd.object(Constants.APP_STATUS).update(refData);
                    });
                } else {
                  this.saveCountryUserTypeMessage(agencyCountryMap.get(agencyId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe(refData => {
                      this.afd.object(Constants.APP_STATUS).update(refData);
                    });
                }

                // if (i == Object.keys(message.userType).length) {
                //   return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
                // }
                //
                // i++;
                this.afd.object(Constants.APP_STATUS).update(messageRefData);
              }
            }
          });

        }
      });

  }

  saveMessageLocalNetwork(uid: string, agencyCountryMap: Map<string, string>, message: MessageModel): Promise<any> {
    let countryAgencyMap = CommonUtils.reverseMap(agencyCountryMap);
    return this.afd.list(Constants.APP_STATUS + '/message').push(message)
      .then(msgId => {
        let messageRefData = {};

        messageRefData['/administratorNetwork/' + uid + '/sentmessages/' + msgId.key] = true;

        if (message.userType[UserType.All]) {
          CommonUtils.convertMapToValuesInArray(agencyCountryMap).forEach(countryId => {
            this.afd.list(Constants.APP_STATUS + '/group/country/' + countryId + '/countryallusersgroup')
              .snapshotChanges()
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((countryAllUsersIds: SnapshotAction<any>[]) => {
                countryAllUsersIds.forEach(countryAllUsersId => {
                  messageRefData['/messageRef/country/' + countryId + '/countryallusersgroup/' + countryAllUsersId.key + '/' + msgId.key] = true;
                });

                if (message.userType[UserType.CountryAdmin]) {
                  const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryAdmin);
                  this.saveAgencyUserTypeMessage(countryAgencyMap.get(countryId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(refData => {
                      this.afd.object(Constants.APP_STATUS).update(refData);
                    });
                }

                if (message.userType[UserType.CountryDirector]) {
                  const countryDirectorUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(UserType.CountryDirector);
                  this.saveAgencyUserTypeMessage(countryAgencyMap.get(countryId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryDirectorUserTypeIndex], messageRefData).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(refData => {
                      this.afd.object(Constants.APP_STATUS).update(refData);
                    });
                }

                this.afd.object(Constants.APP_STATUS).update(messageRefData);

              });
          });

        } else {
          CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
            // let i = 1;
            for (let value in message.userType) {
              if (value) {
                const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));
                if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
                  this.saveAgencyUserTypeMessage(agencyId, message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(refData => {
                      this.afd.object(Constants.APP_STATUS).update(refData);
                    });
                } else {
                  this.saveCountryUserTypeMessage(agencyCountryMap.get(agencyId), message, msgId.key, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe(refData => {
                      this.afd.object(Constants.APP_STATUS).update(refData);
                    });
                }

                // if (i == Object.keys(message.userType).length) {
                //   return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
                // }
                //
                // i++;
                this.afd.object(Constants.APP_STATUS).update(messageRefData);
              }
            }
          });

        }
      });

  }

  deleteCountryMessage(countryId: string, agencyId: string, message: MessageModel): Promise<any> {

    let messageRefData = {};

    messageRefData['/message/' + message.id] = null;
    messageRefData['/administratorCountry/' + countryId + '/sentmessages/' + message.id] = null;

    let i = 1;
    for (let value in message.userType) {
      if (value) {
        const countryAdminUserTypeIndex = Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION.indexOf(Number(value));

        if (Number(value) === UserType.CountryAdmin || Number(value) === UserType.CountryDirector) {
          this.deleteAgencyUserTypeMessage(agencyId, message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(refData => {
              this.afd.object(Constants.APP_STATUS).update(refData);
            });
        } else {
          this.deleteCountryUserTypeMessage(countryId, message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(refData => {
              this.afd.object(Constants.APP_STATUS).update(refData);
            });
        }

        if (i == Object.keys(message.userType).length) {
          return this.afd.object(Constants.APP_STATUS).update(messageRefData);
        }

        i++;
      }
    }
  }

  deleteCountryMessageNetwork(uid: string, agencyCountryMap: Map<string, string>, message: MessageModel): Promise<any> {
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
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(refData => {
                this.afd.object(Constants.APP_STATUS).update(refData);
              });
          } else {
            this.deleteCountryUserTypeMessage(agencyCountryMap.get(agencyId), message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(refData => {
                this.afd.object(Constants.APP_STATUS).update(refData);
              });
          }

          // if (i == Object.keys(message.userType).length) {
          // return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
          // }

          // i++;
        }
      }
    });

    return this.afd.object(Constants.APP_STATUS).update(messageRefData);

  }

  deleteMessageLocalNetwork(uid: string, agencyCountryMap: Map<string, string>, message: MessageModel): Promise<any> {
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
              .pipe(takeUntil(this. ngUnsubscribe))
              .subscribe(refData => {
                this.afd.object(Constants.APP_STATUS).update(refData);
              });
          } else {
            this.deleteCountryUserTypeMessage(agencyCountryMap.get(agencyId), message.id, Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES[countryAdminUserTypeIndex], messageRefData)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(refData => {
                this.afd.object(Constants.APP_STATUS).update(refData);
              });
          }

          // if (i == Object.keys(message.userType).length) {
          // return this.af.database.object(Constants.APP_STATUS).update(messageRefData);
          // }

          // i++;
        }
      }
    });

    return this.afd.object(Constants.APP_STATUS).update(messageRefData);

  }

  private saveCountryUserTypeMessage(countryId: string, message: MessageModel, messageKey: string, userType: string, messageRefData: {}) {
    return this.afd.list(Constants.APP_STATUS + '/group/country/' + countryId + '/' + userType)
      .snapshotChanges()
      .map((items: SnapshotAction<any>[]) => {
        items.forEach(item => {
          messageRefData['/messageRef/country/' + countryId + '/' + userType + '/' + item.key + '/' + messageKey] = true;
        });
        return messageRefData;
      });
  }

  private saveAgencyUserTypeMessage(agencyId: string, message: MessageModel, messageKey: string, userType: string, messageRefData: {}): Observable<Object> {
    return this.afd.list(Constants.APP_STATUS + '/group/agency/' + agencyId + '/' + userType)
      .snapshotChanges()
      .map((items: SnapshotAction<any>[]) => {
        items.forEach(item => {
          messageRefData['/messageRef/agency/' + agencyId + '/' + userType + '/' + item.key + '/' + messageKey] = true;
        });
        return messageRefData;
      });
  }

  private deleteCountryUserTypeMessage(countryId: string, messageKey: string, userType: string, messageRefData: Object) {
    return this.afd.list(Constants.APP_STATUS + '/group/country/' + countryId + '/' + userType)
      .snapshotChanges()
      .map((items: SnapshotAction<any>[]) => {
        items.forEach(item => {
          messageRefData['/messageRef/country/' + countryId + '/' + userType + '/' + item.key + '/' + messageKey] = null;
        });
        return messageRefData;
      });
  }

  private deleteAgencyUserTypeMessage(agencyId: string, messageKey: string, userType: string, messageRefData: Object) {
    return this.afd.list(Constants.APP_STATUS + '/group/agency/' + agencyId + '/' + userType)
      .snapshotChanges()
      .map((items: SnapshotAction<any>[]) => {
        items.forEach(item => {
          messageRefData['/messageRef/agency/' + agencyId + '/' + userType + '/' + item.key + '/' + messageKey] = null;
        });
        return messageRefData;
      });
  }

}
