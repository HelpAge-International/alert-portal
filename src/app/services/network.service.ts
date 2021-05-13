
import {empty as observableEmpty, of as observableOf, Observable} from 'rxjs';

import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {
  ActionLevel, AlertLevels, AlertMessageType, DurationType, NetworkMessageRecipientType, NetworkUserAccountType,
  Privacy
} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {NetworkAgencyModel} from "../network-admin/network-agencies/network-agency.model";
import * as moment from "moment";
import * as firebase from "firebase/app";
import {NetworkOfficeModel} from "../network-admin/network-offices/add-edit-network-office/network-office.model";
import {ModelNetwork} from "../model/network.model";
import {NetworkActionModel} from "../network-admin/network-mpa/network-create-edit-mpa/network-mpa.model";
import {GenericActionModel} from "../network-admin/network-mpa/network-add-generic-action/generic-action.model";
import {NetworkMessageModel} from "../network-admin/network-message/network-create-edit-message/network-message.model";
import {NetworkCountryModel} from "../network-country-admin/network-country.model";
import {NetworkModulesEnabledModel} from "./pagecontrol.service";
import {isEmptyObject} from "angularfire2/utils";
import {NetworkWithCountryModel} from "../country-admin/country-admin-header/network-with-country.model";
import {ClockSettingsModel} from "../model/clock-settings.model";
import {ModelAgencyPrivacy} from "../model/agency-privacy.model";
import {NetworkPrivacyModel} from "../model/network-privacy.model";
import {LogModel} from "../model/log.model";
import {AlertMessageModel} from "../model/alert-message.model";

@Injectable()
export class NetworkService {

  constructor(private af: AngularFire) {
  }

  checkNetworkUserFirstLogin(uid: string, type: NetworkUserAccountType) {
    if (type == NetworkUserAccountType.NetworkAdmin) {
      return this.af.database.object(Constants.APP_STATUS + "/administratorNetwork/" + uid)
        .map(networkAdmin => {
          return networkAdmin.firstLogin ? networkAdmin.firstLogin : false;
        });
    } else {
      return this.af.database.object(Constants.APP_STATUS + "/administratorNetworkCountry/" + uid)
        .map(networkCountryAdmin => {
          return networkCountryAdmin.firstLogin ? networkCountryAdmin.firstLogin : false;
        });
    }
  }

  getNetworkUserType(uid) {
    return this.af.database.object(Constants.APP_STATUS + "/administratorNetwork/" + uid, {preserveSnapshot: true})
      .map(snap => {
        return snap.val() ? NetworkUserAccountType.NetworkAdmin : NetworkUserAccountType.NetworkCountryAdmin;
      })
  }

  getNetworkDetail(networkId): Observable<ModelNetwork> {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId)
      .map(network => {
        let model = new ModelNetwork();
        model.mapFromObject(network);
        model.id = network.$key;
        return model;
      });
  }

  getNetworkAdmin(uid) {
    return this.af.database.object(Constants.APP_STATUS + "/administratorNetwork/" + uid)
  }

  getSelectedIdObj(uid: string) {
    return this.af.database.object(Constants.APP_STATUS + "/networkUserSelection/" + uid, {preserveSnapshot: true})
      .flatMap(snap => {
        if (snap.val()) {
          let selection = snap.val();
          let selectData = {};
          if (!selection.selectedNetworkCountry) {
            selectData["userType"] = NetworkUserAccountType.NetworkAdmin;
            selectData["id"] = selection.selectedNetwork;
          } else {
            selectData["userType"] = NetworkUserAccountType.NetworkCountryAdmin;
            selectData["id"] = selection.selectedNetwork;
            selectData["networkCountryId"] = selection.selectedNetworkCountry;
          }
          return observableOf(selectData);
        } else {
          return observableEmpty();
        }
      })
  }

  getSystemIdForNetwork(uid: string, userType: NetworkUserAccountType) {
    return userType == NetworkUserAccountType.NetworkAdmin ? this.getSystemIdForNetworkAdmin(uid) : this.getSystemIdForNetworkCountryAdmin(uid);
  }

  getLeadAgencyId(networkId) {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId + "/leadAgencyId")
      .map(data => {
        return data.$value;
      });
  }

  updateAgenciesForNetwork(networkId: string, leadAgencyId: string, selectedAgencies: string[]) {
    let data = {};
    data["/network/" + networkId + "/leadAgencyId"] = leadAgencyId;
    selectedAgencies.forEach(agencyId => {
      let item = {};
      item["isApproved"] = false;
      data["/network/" + networkId + "/agencies/" + agencyId] = item;
    });
    return this.af.database.object(Constants.APP_STATUS).update(data);
  }

  updateAgencyForLocalNetwork(networkId: string, leadAgencyId: string, agencyId: string, countryCode: string) {
    let data = {};
    data["/network/" + networkId + "/leadAgencyId"] = leadAgencyId;

    let item = {};
    item["countryCode"] = countryCode ? countryCode : agencyId
    item["isApproved"] = false;
    data["/network/" + networkId + "/agencies/" + agencyId] = item;

    return this.af.database.object(Constants.APP_STATUS).update(data);
  }


  getCountryCodeForAgency(agencyId: string, networkId: number) {
    let data = ''
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .map(countryOffices => {
        countryOffices.forEach(office => {
          if (office.location == networkId) {
            data = office.$key;
          }
        })
        return data;
      })
  }

  getAgenciesForNetwork(networkId) {
    return this.af.database.list(Constants.APP_STATUS + "/network/" + networkId + "/agencies")
      .map(agencies => {
        if (agencies.length > 0) {
          let agencyModels = [];
          agencies.forEach(agency => {
            let model = new NetworkAgencyModel();
            model.id = agency.$key;
            model.isApproved = agency.isApproved;
            agencyModels.push(model);
          });
          return agencyModels;
        }
      });
  }


  getAgencyIdsForNetwork(networkId) {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId + "/agencies", {preserveSnapshot: true})
      .map(snap => {
        if (snap && snap.val()) {
          return Object.keys(snap.val());
        }
      })
  }

  getApprovedAgencyIdsForNetwork(networkId) {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId + "/agencies", {preserveSnapshot: true})
      .map(snap => {
        let agencyIds = [];
        if (snap && snap.val()) {
          snap.forEach(agencySnap => {
            if (agencySnap.val().isApproved) {
              agencyIds.push(Object.keys(agencySnap));
            }
          });
          return agencyIds;
        }
      })
  }

  updateNetworkField(data) {
    return this.af.database.object(Constants.APP_STATUS).update(data);
  }

  updateNetworkFieldByObject(path, model) {
    console.log(model)
    return this.af.database.object(Constants.APP_STATUS + path).update(model);
  }

  setNetworkField(path, value) {
    this.af.database.object(Constants.APP_STATUS + path).set(value)
  }

  deleteNetworkField(path) {
    return this.af.database.object(Constants.APP_STATUS + path).set(null);

  }

  deleteNetworks(countryOfficePath) {
    return this.af.database.list(Constants.APP_STATUS + countryOfficePath).remove();
  }

  validateNetworkAgencyToken(agencyId, token) {
    return this.af.database.object(Constants.APP_STATUS + "/networkAgencyValidation/" + agencyId + "/validationToken")
      .map(tokenObj => {
        if (tokenObj) {
          if (token === tokenObj.token) {
            let expiry = tokenObj.expiry;
            let currentTime = moment.utc();
            let tokenExpiryTime = moment.utc(expiry);
            return !currentTime.isAfter(tokenExpiryTime);
          }
        } else {
          return false;
        }
      })
  }

  getNetworkOffices(networkId) {
    return this.af.database.list(Constants.APP_STATUS + "/networkCountry/" + networkId)
      .map(officeObjs => {
        let officeModels: NetworkOfficeModel[] = [];
        officeObjs.forEach(obj => {
          let office = new NetworkOfficeModel();
          office.mapFromObject(obj);
          office.id = obj.$key;
          officeModels.push(office);
        });
        return officeModels;
      });
  }

  resendEmail(networkId, agencyId, countryCode?) {
    let data = {};
    if (countryCode) {
      data["countryCode"] = countryCode
    }
    data["isApproved"] = false;
    this.af.database.object(Constants.APP_STATUS + "/network/" + networkId + "/agencies/" + agencyId).set(null).then(() => {
      this.af.database.object(Constants.APP_STATUS + "/network/" + networkId + "/agencies/" + agencyId).set(data);
    });
  }

  public generateKeyForNetworkCountry(): string {
    return firebase.database().ref(Constants.APP_STATUS + "/networkCountry/").push().key;
  }

  public generateKeyUserPublic(): string {
    return firebase.database().ref(Constants.APP_STATUS + "/userPublic/").push().key;
  }

  public generateKeyNetworkMpa(networkId): string {
    return firebase.database().ref(Constants.APP_STATUS + "/actionMandated/" + networkId).push().key;
  }

  getNetworkActions(networkId): Observable<NetworkActionModel[]> {
    return this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + networkId)
      .map(mpaObjs => {
        let actions = mpaObjs.map(obj => {
          let model = new NetworkActionModel();
          model.mapFromObject(obj);
          model.id = obj.$key;
          return model;
        });
        actions.sort((a, b) => b.createdAt - a.createdAt);
        return actions;
      });
  }

  getNetworkMpa(networkId) {
    return this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + networkId, {
      query: {
        orderByChild: "level",
        equalTo: String(ActionLevel.MPA)
      }
    })
      .map(mpaObjs => {
        let actions = mpaObjs.map(obj => {
          let model = new NetworkActionModel();
          model.mapFromObject(obj);
          model.id = obj.$key;
          return model;
        });
        actions.sort((a, b) => b.createdAt - a.createdAt);
        return actions;
      });
  }

  getNetworkApa(networkId) {
    return this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + networkId, {
      query: {
        orderByChild: "level",
        equalTo: String(ActionLevel.APA)
      }
    })
      .map(mpaObjs => {
        let actions = mpaObjs.map(obj => {
          let model = new NetworkActionModel();
          model.mapFromObject(obj);
          model.id = obj.$key;
          return model;
        });
        actions.sort((a, b) => b.createdAt - a.createdAt);
        return actions;
      });
  }

  getUnassignedNetworkActionsForAgency(agencyId: string, networkId: string): Observable<any> {
    return this.af.database.list(Constants.APP_STATUS + "/action/" + networkId, {
      query: {
        orderByChild: "agencyAssign",
        equalTo: agencyId
      }
    })
      .map(actions => actions.filter(action => !action.asignee).map(action => {
        let obj = action
        obj["idToQuery"] = networkId
        return obj
      }))
  }

  getNetworkActionDetail(networkId, actionId): Observable<NetworkActionModel> {
    return this.af.database.object(Constants.APP_STATUS + "/actionMandated/" + networkId + "/" + actionId)
      .map(obj => {
        let model = new NetworkActionModel();
        model.mapFromObject(obj);
        model.id = obj.$key;
        return model;
      });
  }

  saveNetworkAction(networkId: string, action: NetworkActionModel) {
    return this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + networkId).push(action);
  }

  updateNetworkAction(networkId: string, actionId: string, action: NetworkActionModel) {
    return this.af.database.object(Constants.APP_STATUS + "/actionMandated/" + networkId + "/" + actionId).update(action);
  }

  deleteNetworkAction(networkId: string, actionId: string) {
    return this.af.database.object(Constants.APP_STATUS + "/actionMandated/" + networkId + "/" + actionId).remove();
  }

  getGenericActions(systemId): Observable<GenericActionModel[]> {
    return this.af.database.list(Constants.APP_STATUS + "/actionGeneric/" + systemId)
      .map(actions => {
        return actions.map(action => {
          let model = new GenericActionModel();
          model.mapFromObject(action);
          model.id = action.$key;
          return model;
        });
      })
  }

  getGenericActionsByFilter(systemId: string, level: ActionLevel): Observable<GenericActionModel[]> {
    return this.af.database.list(Constants.APP_STATUS + "/actionGeneric/" + systemId, {
      query: {
        orderByChild: "level",
        equalTo: Number(level)
      }
    })
      .map(actions => {
        return actions.map(action => {
          let model = new GenericActionModel();
          model.mapFromObject(action);
          model.id = action.$key;
          return model;
        });
      })
  }

  getSystemIdForNetworkAdmin(uid): Observable<string> {
    return this.af.database.object(Constants.APP_STATUS + "/administratorNetwork/" + uid + "/systemAdmin")
      .map(obj => {
        return Object.keys(obj).shift();
      })
  }

  getSystemIdForNetworkCountryAdmin(uid): Observable<string> {
    return this.af.database.object(Constants.APP_STATUS + "/administratorNetworkCountry/" + uid + "/systemAdmin")
      .map(obj => {
        return Object.keys(obj).shift();
      })
  }

  addGenericActionsToNetwork(networkId: string, actionMap: Map<string, GenericActionModel>, actionSelectionMap: Map<string, boolean>) {
    const idsToPush = Array.from(actionSelectionMap.keys()).filter(key => actionSelectionMap.get(key));
    let update = {};
    idsToPush.forEach(id => {
      let key = this.generateKeyNetworkMpa(networkId);
      let model = actionMap.get(id);
      model.category = null;
      model.id = null;
      model.createdAt = moment.utc().valueOf();
      update["/actionMandated/" + networkId + "/" + key] = model;
    });
    return this.updateNetworkField(update);
  }

  hasNetworkLevelUsers(networkId: string): Observable<boolean> {
    let networkGroupPath = Constants.APP_STATUS + '/group/network/' + networkId;
    return this.af.database.list(networkGroupPath)
      .map(userGroups => {
        return (userGroups != null && userGroups.length > 0);
      });
  }

  hasAgencyLevelUsers(agencyIds: string[]) {
    return agencyIds != null && agencyIds.length != 0;
  }

  createMessage(context: any, uid: string, networkId: string, agencyIds: string[], recipientTypes: NetworkMessageRecipientType[], message: NetworkMessageModel, callback: any) {
    let messagePath = Constants.APP_STATUS + '/message';
    message.senderId = uid;
    message.time = NetworkService.getUnixTimestampMilliseconds();

    this.af.database.list(messagePath).push(message)
      .then(msg => {
        this.createMessageReferences(context, uid, networkId, agencyIds, recipientTypes, msg.key, callback);
      })
      .catch(error => {
        callback(error, context);
      });
  }

  private createMessageReferences(context: any, uid: string, networkId: string, agencyIds: string[], recipientTypes: NetworkMessageRecipientType[], msgId: string, callback: any) {

    let msgRefData = {};
    let agencyGroupPath = Constants.APP_STATUS + '/group/agency/';
    let agencyMessageRefPath = '/messageRef/agency/';
    let networkGroupPath = Constants.APP_STATUS + '/group/network/';
    let networkMessageRefPath = '/messageRef/network/';

    msgRefData['/administratorNetwork/' + uid + '/sentmessages/' + msgId] = true;

    if (NetworkService.recipientTypeExists(NetworkMessageRecipientType.AllUsers, recipientTypes)) {
      if (agencyIds != null) {
        agencyIds.forEach(agencyId => {
          let groupPathName = 'agencyallusersgroup';
          let agencyAllUsersSelected: string = agencyGroupPath + agencyId + '/' + groupPathName;
          this.af.database.list(agencyAllUsersSelected, {preserveSnapshot: true})
            .subscribe((snapshots) => {
              snapshots.forEach(snapshot => {
                msgRefData[agencyMessageRefPath + agencyId + '/' + groupPathName + '/' + snapshot.key + '/' + msgId] = true;
              });
              this.af.database.object(Constants.APP_STATUS).update(msgRefData).then(() => {
                callback(null, context);
              }).catch(error => {
                callback(error, context);
              });
            });
        });
      }
      let groupPathName = 'networkallusersgroup';
      let networkAllUsersSelected: string = networkGroupPath + networkId + '/' + groupPathName;
      this.af.database.list(networkAllUsersSelected, {preserveSnapshot: true})
        .subscribe((snapshots) => {
          snapshots.forEach(snapshot => {
            msgRefData[networkMessageRefPath + networkId + '/' + groupPathName + '/' + snapshot.key + '/' + msgId] = true;
          });
          this.af.database.object(Constants.APP_STATUS).update(msgRefData).then(() => {
            callback(null, context);
          }).catch(error => {
            callback(error, context);
          });
        });
    } else {
      if (agencyIds != null) {
        agencyIds.forEach(agencyId => {
          recipientTypes.forEach(recipient => {
            if (recipient != NetworkMessageRecipientType.NetworkCountryAdmins) {
              let groupPathName = NetworkService.getGroupPathNameForRecipientType(recipient);
              if (groupPathName == null) {
                return;
              }
              let usersSelected: string = agencyGroupPath + agencyId + '/' + groupPathName;
              this.af.database.list(usersSelected, {preserveSnapshot: true})
                .subscribe((snapshots) => {
                  snapshots.forEach(snapshot => {
                    msgRefData[agencyMessageRefPath + agencyId + '/' + groupPathName + '/' + snapshot.key + '/' + msgId] = true;
                  });
                  this.af.database.object(Constants.APP_STATUS).update(msgRefData).then(() => {
                    callback(null, context);
                  }).catch(error => {
                    callback(error, context);
                  });
                });
            }
          });
        });
      }

      if (NetworkService.recipientTypeExists(NetworkMessageRecipientType.NetworkCountryAdmins, recipientTypes)) {
        let groupPathName = NetworkService.getGroupPathNameForRecipientType(NetworkMessageRecipientType.NetworkCountryAdmins);
        let networkCountryAdmins: string = networkGroupPath + networkId + '/' + groupPathName;

        this.af.database.list(networkCountryAdmins, {preserveSnapshot: true})
          .subscribe((snapshots) => {
            snapshots.forEach(snapshot => {
              msgRefData[networkMessageRefPath + networkId + '/' + groupPathName + '/' + snapshot.key + '/' + msgId] = true;
            });
            this.af.database.object(Constants.APP_STATUS).update(msgRefData).then(() => {
              callback(null, context);
            }).catch(error => {
              callback(error, context);
            });
          });
      }
    }
  }

  private static getUnixTimestampMilliseconds() {
    return new Date().getTime();
  }

  private static recipientTypeExists(recipientType: NetworkMessageRecipientType, recipientTypes: NetworkMessageRecipientType[]): boolean {
    let exists: boolean = false;
    recipientTypes.forEach(recipient => {
      if (recipient == recipientType) {
        exists = true;
      }
    });
    return exists;
  }

  private static getGroupPathNameForRecipientType(recipientType: NetworkMessageRecipientType): string {
    switch (recipientType) {
      case NetworkMessageRecipientType.NetworkCountryAdmins:
        return 'networkcountryadmins';
      case NetworkMessageRecipientType.Donors:
        return 'donor';
      case NetworkMessageRecipientType.Partners:
        return 'partner';
      case NetworkMessageRecipientType.ERTs:
        return 'erts';
      case NetworkMessageRecipientType.ERTLeaders:
        return 'ertleads';
      case NetworkMessageRecipientType.CountryDirectors:
        return 'countrydirectors';
      case NetworkMessageRecipientType.CountryAdmins:
        return 'countryadmins';
      case NetworkMessageRecipientType.RegionalDirectors:
        return 'regionaldirector';
      case NetworkMessageRecipientType.GlobalUsers:
        return 'globaluser';
      case NetworkMessageRecipientType.GlobalDirectors:
        return 'globaldirector';
      default:
        return null;
    }
  }

  getNetworkModuleMatrix(networkId) {
    return this.af.database.list(Constants.APP_STATUS + "/module/" + networkId)
      .map(matrix => {
        let model = new NetworkModulesEnabledModel();
        model.minimumPreparedness = matrix[0].privacy;
        model.advancedPreparedness = matrix[1].privacy;
        model.chsPreparedness = matrix[2].privacy;
        model.riskMonitoring = matrix[3].privacy;
        model.conflictIndicator = matrix[4].privacy;
        model.networkOffice = matrix[5].privacy;
        model.responsePlan = matrix[6].privacy;
        return model;
      });
  }

  getNetworkResponsePlanClockSettingsDuration(networkId) {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId + "/clockSettings/responsePlans")
      .map(settings => {
        let duration = 0;
        let oneDay = 24 * 60 * 60 * 1000;
        let durationType = Number(settings.durationType);
        let value = Number(settings.value);
        if (durationType === DurationType.Week) {
          duration = value * 7 * oneDay;
        } else if (durationType === DurationType.Month) {
          duration = value * 30 * oneDay;
        } else if (durationType === DurationType.Year) {
          duration = value * 365 * oneDay;
        }
        return duration;
      });
  }

  getNetworkCountryResponsePlanClockSettingsDuration(networkId, networkCountryId) {
    return this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/clockSettings/responsePlans")
      .map(settings => {
        let duration = 0;
        let oneDay = 24 * 60 * 60 * 1000;
        let durationType = Number(settings.durationType);
        let value = Number(settings.value);
        if (durationType === DurationType.Week) {
          duration = value * 7 * oneDay;
        } else if (durationType === DurationType.Month) {
          duration = value * 30 * oneDay;
        } else if (durationType === DurationType.Year) {
          duration = value * 365 * oneDay;
        }
        return duration;
      });
  }

  getAllNetworkCountriesByNetwork(networkId) {
    return this.af.database.list(Constants.APP_STATUS + "/networkCountry/" + networkId)
  }

  getNetworkClockSettings(networkId) {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId + "/clockSettings")
      .map(obj => {
        let setting = new ClockSettingsModel()
        setting.mapFromObject(obj)
        return setting
      })
  }


  /**
   * NETWORK COUNTRY OFFICE ADMIN
   */
  getNetworkCountryAdminDetail(uid): FirebaseObjectObservable<any> {
    return this.af.database.object(Constants.APP_STATUS + "/administratorNetworkCountry/" + uid)
  }

  getListOfAllNetworkCountries() {
    return this.af.database.list(Constants.APP_STATUS + "/networkCountry/");
  }

  getGlobalNetwork(globalNetworkId) {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + globalNetworkId);
  }

  getAllNetworkCountries(uid) {
    return this.af.database.list(Constants.APP_STATUS + "/administratorNetworkCountry/" + uid + "/networkCountryIds", {preserveSnapshot: true})
      .map(snaps => {
        return snaps.map(snap => {
          let officeObj = {};
          officeObj["networkId"] = snap.key;
          officeObj["networkCountryIds"] = snap.val() ? Object.keys(snap.val()) : [];
          return officeObj;
        })
      })
  }

  getNetworkCountry(networkId, networkCountryId): Observable<NetworkCountryModel> {
    return this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId)
      .map(networkCountry => {
        let model = new NetworkCountryModel();
        model.mapFromObject(networkCountry);
        model.id = networkCountry.$key;
        model.networkId = networkId
        return model;
      })
  }

  getLocalNetwork(networkId): Observable<any> {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId)
  }

  getAgencyIdsForNetworkCountryOffice(networkId, networkCountryId) {
    return this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries", {preserveSnapshot: true})
      .map(snap => {
        if (snap && snap.val()) {
          return Object.keys(snap.val());
        }
      })
  }

  updateAgenciesForNetworkCountry(networkId: string, networkCountryId: string, leadAgencyId: string, agencyCountryMap: Map<string, string>, selectedAgencyMap: Map<string, boolean>) {
    let data = {};
    data["/networkCountry/" + networkId + "/" + networkCountryId + "/leadAgencyId"] = leadAgencyId;
    selectedAgencyMap.forEach((v, k) => {
      if (v) {
        if (agencyCountryMap.get(k)) {
          data["/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries/" + k + "/" + agencyCountryMap.get(k) + "/isApproved"] = false;
        } else {
          data["/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries/" + k + "/" + k + "/isApproved"] = false;
          data["/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries/" + k + "/" + k + "/isLocalAgency"] = true;
        }
      }
    });
    return this.af.database.object(Constants.APP_STATUS).update(data);
  }

  getLeadAgencyIdForNetworkCountry(networkId, networkCountryId) {
    return this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/leadAgencyId")
      .map(data => {
        return data.$value;
      });
  }

  getAgenciesForNetworkCountry(networkId, networkCountryId, agencyCountryMap) {
    console.log(networkId)
    console.log(networkCountryId)
    console.log(agencyCountryMap)
    return this.af.database.list(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries")
      .map(agencies => {
        if (agencies) {
          let agencyModels = [];
          agencies.forEach(agency => {
            console.log(agency)
            let model = new NetworkAgencyModel();
            model.id = agency.$key;
            model.isApproved = agencyCountryMap.get(agency.$key) ? (agency.$key !== agencyCountryMap.get(agency.$key) ? agency[agencyCountryMap.get(agency.$key)]["isApproved"] : agency[agency.$key]["isApproved"]) : false
            agencyModels.push(model);
          });
          return agencyModels;
        }
      });
  }

  resendEmailNetworkCountry(networkId, networkCountryId, agencyId, countryId) {
    let data = {};
    data["isApproved"] = false;
    if (!countryId) {
      data["isLocalAgency"] = true;
    }
    this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries/" + agencyId + "/" + (countryId ? countryId : agencyId)).set(null).then(() => {
      this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries/" + agencyId + "/" + (countryId ? countryId : agencyId)).set(data);
    });
  }

  mapAgencyCountryForNetworkCountry(networkId, networkCountryId) {
    return this.getNetworkCountry(networkId, networkCountryId).pipe(
      map(networkCountry => {
        if (networkCountry.agencyCountries) {
          let agencyCountries = networkCountry.agencyCountries;
          let agencyCountryList = Object.keys(agencyCountries).map(key => {
            let obj = {};
            obj["agencyId"] = key;
            obj["countryId"] = Object.keys(agencyCountries[key])[0];
            obj["approved"] = agencyCountries[key][obj["countryId"]]
            // obj["approved"] = Object.keys(agencyCountries[key]).map(id => agencyCountries[key][id])[0]
            return obj;
          }).filter(item => item["approved"]["isApproved"] == true)
          let agencyCountryMap = new Map<string, string>();
          agencyCountryList.forEach(item => {
            agencyCountryMap.set(item["agencyId"], item["countryId"]);
          });
          return agencyCountryMap;
        }
      }));
  }

  mapAgencyCountryForNetworkCountryWithNotApproved(networkId, networkCountryId) {
    return this.getNetworkCountry(networkId, networkCountryId).pipe(
      map(networkCountry => {
        if (networkCountry.agencyCountries) {
          let agencyCountries = networkCountry.agencyCountries;
          let agencyCountryList = Object.keys(agencyCountries).map(key => {
            let obj = {};
            obj["agencyId"] = key;
            obj["countryId"] = Object.keys(agencyCountries[key])[0];
            obj["approved"] = agencyCountries[key][obj["countryId"]]
            // obj["approved"] = Object.keys(agencyCountries[key]).map(id => agencyCountries[key][id])[0]
            return obj;
          })
          let agencyCountryMap = new Map<string, string>();
          agencyCountryList.forEach(item => {
            agencyCountryMap.set(item["agencyId"], item["countryId"]);
          });
          return agencyCountryMap;
        }
      }));
  }

  mapAgencyCountryForLocalNetworkCountry(networkId) {
    return this.getLocalNetwork(networkId).pipe(
      map(localNetwork => {
        if (localNetwork.agencies) {
          let agencyCountries = localNetwork.agencies;
          let agencyCountryList = Object.keys(agencyCountries).map(key => {
            let obj = {};
            obj["agencyId"] = key;
            obj["countryId"] = agencyCountries[key].countryCode;
            obj["approved"] = agencyCountries[key].isApproved
            return obj;
          }).filter(item => item["approved"] == true)
          let agencyCountryMap = new Map<string, string>();
          agencyCountryList.forEach(item => {
            agencyCountryMap.set(item["agencyId"], item["countryId"]);
          });
          return agencyCountryMap;
        }
      }));
  }

  mapAgencyCountryForLocalNetworkCountryWithNotApproved(networkId) {
    return this.getLocalNetwork(networkId).pipe(
      map(localNetwork => {
        if (localNetwork.agencies) {
          let agencyCountries = localNetwork.agencies;
          let agencyCountryList = Object.keys(agencyCountries).map(key => {
            let obj = {};
            obj["agencyId"] = key;
            obj["countryId"] = agencyCountries[key].countryCode;
            obj["approved"] = agencyCountries[key].isApproved
            return obj;
          })
          let agencyCountryMap = new Map<string, string>();
          agencyCountryList.forEach(item => {
            agencyCountryMap.set(item["agencyId"], item["countryId"]);
          });
          return agencyCountryMap;
        }
      }));
  }

  validateNetworkCountryToken(countryId, token) {
    return this.af.database.object(Constants.APP_STATUS + "/networkCountryValidation/" + countryId + "/validationToken")
      .map(tokenObj => {
        if (tokenObj) {
          if (token === tokenObj.token) {
            let expiry = tokenObj.expiry;
            let currentTime = moment.utc();
            let tokenExpiryTime = moment.utc(expiry);
            return !currentTime.isAfter(tokenExpiryTime);
          }
        } else {
          return false;
        }
      })
  }

  getNetworksForCountry(agencyId, countryId) {
    return this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId + "/networks", {preserveSnapshot: true})
      .map(snap => {
        let ids = [];
        if (snap.val()) {
          return Object.keys(snap.val()).map(key => snap.val()[key]["networkCountryId"]);
        }
        return ids;
      })
  }

  getNetworkWithCountryModelsForCountry(agencyId, countryId) {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId + "/networks")
      .map(networks => {
        return networks.map(network => {
          let model = new NetworkWithCountryModel();
          model.networkId = network.$key;
          model.networkCountryId = network.networkCountryId;
          return model;
        })
      })
  }

  getNetworkWithCountryModelsForLocalAgency(agencyId) {
    return this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/networksCountry")
      .map(networks => {
        return networks.map(network => {
          let model = new NetworkWithCountryModel();
          model.networkId = network.$key;
          model.networkCountryId = network.networkCountryId;
          return model;
        })
      })
  }

  getLocalNetworkModelsForCountry(agencyId, countryId) {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId + "/localNetworks")
      .map(networks => {
        return networks.map(network => {
          let model = new ModelNetwork();
          model.id = network.$key;
          return model;
        })
      })
  }

  getLocalNetworkModelsForLocalAgency(agencyId: string) {
    return this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/localNetworks")
      .map(networks => {
        return networks.map(network => {
          let model = new ModelNetwork();
          model.id = network.$key;
          return model;
        })
      })
  }

  mapNetworkWithCountryForCountry(agencyId, countryId) {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId + "/networks")
      .map(networks => {
        let map = new Map<string, string>();
        networks.forEach(network => {
          map.set(network.$key, network.networkCountryId)
        })
        return map
      })
  }

  mapNetworkCountryForLocalAgency(agencyId) {
    return this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/networksCountry")
      .map(networks => {
        let map = new Map<string, string>();
        networks.forEach(network => {
          map.set(network.$key, network.networkCountryId)
        })
        return map
      })
  }

  getLocalNetworksWithCountryForCountry(agencyId, countryId) {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId + "/localNetworks")
      .map(networks => {
        let networkKeys = []
        networks.forEach(network => {
          networkKeys.push(network.$key)
        })
        return networkKeys
      })
  }

  getLocalNetworksWithCountryForLocalAgency(agencyId) {
    return this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/localNetworks")
      .map(networks => {
        let networkKeys = []
        networks.forEach(network => {
          networkKeys.push(network.$key)
        })
        return networkKeys
      })
  }

  getNetworksForAgency(agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId + "/networks", {preserveSnapshot: true})
      .map(snap => {
        let ids = [];
        if (snap.val()) {
          return Object.keys(snap.val());
        }
        return ids;
      })
  }

  getRegionIdForCountry(countryId) {
    return this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + countryId)
      .flatMap(id => {
        if (id && id.$value && id.$value != "null") {
          return this.af.database.object(Constants.APP_STATUS + "/regionDirector/" + id.$value + "/regionId", {preserveSnapshot: true});
        } else {
          return observableOf(null);
        }
      })
      .map(snap => {
        if (snap && snap.val()) {
          return snap.val();
        }
      });
  }

  getAgencyCountryOfficesByNetwork(networkId: string) {
    let countryOfficeAgencyMap = new Map<string, string>()
    return this.af.database.list(Constants.APP_STATUS + '/network/' + networkId + '/agencies')
      .map(agencies => {
        agencies.forEach(agency => {
          if (agency.countryCode && agency.isApproved) {
            countryOfficeAgencyMap.set(agency.$key, agency.countryCode)
          }
        })
        return countryOfficeAgencyMap;
      })
  }


  getAgencyCountryOfficesByNetworkCountry(networkCountryId: string, networkId: string) {
    let countryOfficeAgencyMap = new Map<string, string>()
    return this.af.database.list(Constants.APP_STATUS + '/networkCountry/' + networkId + '/' + networkCountryId + '/agencyCountries')
      .map(agencies => {
        agencies.forEach(agency => {
          Object.keys(agency).forEach(function (key) {
            if (agency[key].isApproved == true) {
              countryOfficeAgencyMap.set(agency.$key, key)
            }
          });
        })
        return countryOfficeAgencyMap;
      })
  }

  getNetworkCountryAgencies(networkId, networkCountryId) {
    return this.af.database.list(Constants.APP_STATUS + '/networkCountry/' + networkId + '/' + networkCountryId + '/agencyCountries')

  }

  getNetworkCountriesForNetwork(networkId: string): Observable<string[]> {
    return this.af.database.list(Constants.APP_STATUS + "/networkCountry/" + networkId)
      .map(networkCountries => {
        return networkCountries.map(country => country.$key)
      })
  }

  getPrivacySettingForNetworkCountry(networkCountryId): Observable<NetworkPrivacyModel> {
    return this.af.database.object(Constants.APP_STATUS + "/module/" + networkCountryId, {preserveSnapshot: true})
      .map(snap => {
        if (snap.val()) {
          let privacy = new NetworkPrivacyModel();
          privacy.mpa = snap.val()[0].privacy;
          privacy.apa = snap.val()[1].privacy;
          privacy.chs = snap.val()[2].privacy;
          privacy.riskMonitoring = snap.val()[3].privacy;
          privacy.conflictIndicators = snap.val()[4].privacy
          privacy.officeProfile = snap.val()[5].privacy;
          privacy.responsePlan = snap.val()[6].privacy;
          return privacy;
        }
      });
  }

  updateNetworkCountryPrivacy(countryId: string, module: NetworkPrivacyModel, countryPrivacy: NetworkPrivacyModel) {
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
    if (module.conflictIndicators == Privacy.Private) {
      countryPrivacy.conflictIndicators = Privacy.Private;
    } else if (module.conflictIndicators == Privacy.Network && countryPrivacy.conflictIndicators == Privacy.Public) {
      countryPrivacy.conflictIndicators = Privacy.Network;
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
    update["/module/" + countryId + "/4/privacy"] = countryPrivacy.conflictIndicators;
    update["/module/" + countryId + "/5/privacy"] = countryPrivacy.officeProfile;
    update["/module/" + countryId + "/6/privacy"] = countryPrivacy.responsePlan;

    this.af.database.object(Constants.APP_STATUS).update(update);
  }

  getPrivacySettingForNetwork(networkId: string): Observable<NetworkPrivacyModel> {
    return this.af.database.object(Constants.APP_STATUS + "/module/" + networkId, {preserveSnapshot: true})
      .map(snap => {
        if (snap.val()) {
          let privacy = new NetworkPrivacyModel();
          privacy.mpa = snap.val()[0].privacy;
          privacy.apa = snap.val()[1].privacy;
          privacy.chs = snap.val()[2].privacy;
          privacy.riskMonitoring = snap.val()[3].privacy;
          privacy.conflictIndicators = snap.val()[4].privacy;
          privacy.officeProfile = snap.val()[5].privacy;
          privacy.responsePlan = snap.val()[6].privacy;
          return privacy;
        }
      });
  }

  getAllNetworkCountriesWithSameAgencyMember(networkId, agencyId) {
    return this.getAllNetworkCountriesByNetwork(networkId)
      .map(networkCountries => {
        return networkCountries.filter(networkCountry => networkCountry.agencyCountries && Object.keys(networkCountry.agencyCountries).indexOf(agencyId) != -1)
      })
  }

  mapNetworkOfficesWithSameLocationsInOtherNetworks(location: number) {
    return this.af.database.object(Constants.APP_STATUS + "/networkCountry")
      .map(allNetworksObj => {
        let map = new Map()
        if (allNetworksObj) {
          let networkCountryObjs = Object.keys(allNetworksObj).filter(key => !key.startsWith("$")).map(networkId => {
            let tempObj = {}
            tempObj["networkCountries"] = Object.keys(allNetworksObj[networkId]).map(countryId => {
              let tempCountryObj = allNetworksObj[networkId][countryId]
              tempCountryObj["id"] = countryId
              return tempCountryObj
            }).filter(country => country.location == location && country.isActive)
            tempObj["networkId"] = networkId
            return tempObj
          })
          networkCountryObjs.forEach(obj => {
            if (obj["networkCountries"].length > 0) {
              obj["networkCountries"].forEach(country => {
                map.set(obj["networkId"], country.id)
              })
            }
          })
        }
        return map
      })
  }

  getLocalNetworksWithSameLocationsInOtherNetworks(location: number) {

    return this.af.database.object(Constants.APP_STATUS + "/network")
      .map(allNetworksObj => {
        let localNetworks = []
        if (allNetworksObj) {
          let networkObjs = Object.keys(allNetworksObj).filter(key => !key.startsWith("$")).map(networkId => {
            let tempObj = allNetworksObj[networkId]
            tempObj["networkId"] = networkId
            return tempObj
          }).filter(network => network.countryCode == location && network.isActive)
          localNetworks = networkObjs
        }
        console.log(localNetworks)
        return localNetworks
      })
  }

  saveIndicatorLog(indicatorId: string, log: LogModel) {
    return this.af.database.list(Constants.APP_STATUS + '/log/' + indicatorId)
      .push(log)
      .catch((error: any) => {
        console.log(error, 'push log failed')
      });
  }

  saveIndicatorLogMoreParams(previousTrigger: number, triggerSelected: number, uid: string, indicatorId: string) {
    if (previousTrigger != -1 && previousTrigger != triggerSelected) {
      let content = ""
      switch (triggerSelected) {
        case AlertLevels.Green:
          content = "Indicator level was updated to GREEN"
          break
        case AlertLevels.Amber:
          content = "Indicator level was updated to AMBER"
          break
        case AlertLevels.Red:
          content = "Indicator level was updated to RED"
          break
      }

      let log = new LogModel()
      log.addedBy = uid
      log.timeStamp = moment.utc().valueOf()
      log.triggerAtCreation = triggerSelected
      log.content = content

      return this.saveIndicatorLog(indicatorId, log)

    }
  }

}
