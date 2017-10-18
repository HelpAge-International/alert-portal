import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {ActionLevel, DurationType, NetworkMessageRecipientType, NetworkUserAccountType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Observable} from "rxjs/Observable";
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

  // checkNetworkUserSelection(uid: string): Observable<any> {
  //   return this.af.database.object(Constants.APP_STATUS + "/administratorNetwork/" + uid + "/selectedNetwork")
  //     .flatMap(networkId => {
  //       if (networkId.$value) {
  //         let data = {};
  //         data["isNetworkAdmin"] = true;
  //         data["networkId"] = networkId.$value;
  //         return Observable.of(data);
  //       } else {
  //         return this.af.database.object(Constants.APP_STATUS + "/administratorNetworkCountry/" + uid + "/selectedNetwork")
  //           .map(networkCountryId => {
  //             let data = {};
  //             data["isNetworkAdmin"] = false;
  //             data["networkCountryId"] = networkCountryId.$value;
  //             return Observable.of(data);
  //           })
  //       }
  //     })
  // }

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

  //TODO ADD FOR NETWORK COUNTRY
  // getNetworkDetailByUid(uid) {
  //   return this.checkNetworkUserSelection(uid)
  //     .flatMap(data => {
  //       return data.isNetworkAdmin ? this.getNetworkDetail(data.networkId) : null;
  //     })
  // }

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
          return Observable.of(selectData);
        } else {
          return Observable.empty();
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

  updateAgenciesForLocalNetwork(networkId: string, leadAgencyId: string, selectedAgencies: string[], countryCode: object) {
    let data = {};
    data["/network/" + networkId + "/leadAgencyId"] = leadAgencyId;
    selectedAgencies.forEach(agencyId => {

      let item = {};
      if (!isEmptyObject(countryCode)) {
        item["countryCode"] = countryCode
      }
      item["isApproved"] = false;
      data["/network/" + networkId + "/agencies/" + agencyId] = item;

    });
    return this.af.database.object(Constants.APP_STATUS).update(data);
  }


  getCountryCodeForAgency(agencyId: string, networkId: number) {
    let data = ''
    console.log(Constants.APP_STATUS + "/countryOffice/" + agencyId)
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
    return this.af.database.object(Constants.APP_STATUS + path).update(model);
  }

  setNetworkField(path, value) {
    this.af.database.object(Constants.APP_STATUS + path).set(value)
  }

  deleteNetworkField(path) {
    return this.af.database.object(Constants.APP_STATUS + path).set(null);
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

  resendEmail(networkId, agencyId) {
    let data = {};
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
        console.log("Message created successfully");
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
        console.log("No group name available for this type of user: " + recipientType);
        return null;
    }
  }

  getNetworkModuleMatrix(networkId) {
    return this.af.database.list(Constants.APP_STATUS + "/module/" + networkId)
      .map(matrix => {
        let model = new NetworkModulesEnabledModel();
        model.minimumPreparedness = matrix[0].status;
        model.advancedPreparedness = matrix[1].status;
        model.chsPreparedness = matrix[2].status;
        model.riskMonitoring = matrix[3].status;
        model.conflictIndicator = matrix[4].status;
        model.networkOffice = matrix[5].status;
        model.responsePlan = matrix[6].status;
        return model;
      });
  }

  getNetworkResponsePlanClockSettingsDuration(networkId) {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId + "/clockSettings/responsePlans")
      .map(settings => {
        console.log(settings);
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


  /**
   * NETWORK COUNTRY OFFICE ADMIN
   */
  getNetworkCountryAdminDetail(uid): FirebaseObjectObservable<any> {
    return this.af.database.object(Constants.APP_STATUS + "/administratorNetworkCountry/" + uid)
  }

  getAllNetworkCountries(uid) {
    return this.af.database.list(Constants.APP_STATUS + "/administratorNetworkCountry/" + uid + "/networkCountryIds", {preserveSnapshot: true})
      .map(snaps => {
        console.log(snaps)
        return snaps.map(snap => {
          let officeObj = {};
          officeObj["networkId"] = snap.key;
          officeObj["networkCountryIds"] = snap.val() ? Object.keys(snap.val()) : [];
          console.log(officeObj);
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
        return model;
      })
  }

  getAgencyIdsForNetworkCountryOffice(networkId, networkCountryId) {
    return this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries", {preserveSnapshot: true})
      .map(snap => {
        if (snap && snap.val()) {
          return Object.keys(snap.val());
        }
      })
  }

  updateAgenciesForNetworkCountry(networkId: string, networkCountryId: string, leadAgencyId: string, selectedAgencyCountryMap: Map<string, string>) {
    let data = {};
    data["/networkCountry/" + networkId + "/" + networkCountryId + "/leadAgencyId"] = leadAgencyId;
    selectedAgencyCountryMap.forEach((v, k) => {
      data["/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries/" + v + "/" + k + "/isApproved"] = false;
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
    return this.af.database.list(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries")
      .map(agencies => {
        if (agencies) {
          let agencyModels = [];
          agencies.forEach(agency => {
            console.log(agency);
            let model = new NetworkAgencyModel();
            model.id = agency.$key;
            model.isApproved = agencyCountryMap.get(agency.$key) && agency[agencyCountryMap.get(agency.$key)] ? agency[agencyCountryMap.get(agency.$key)]["isApproved"] : false;
            agencyModels.push(model);
          });
          return agencyModels;
        }
      });
  }

  resendEmailNetworkCountry(networkId, networkCountryId, agencyId, countryId) {
    let data = {};
    data["isApproved"] = false;
    this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries/" + agencyId + "/" + countryId).set(null).then(() => {
      this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId + "/agencyCountries/" + agencyId + "/" + countryId).set(data);
    });
  }

  mapAgencyCountryForNetworkCountry(networkId, networkCountryId) {
    return this.getNetworkCountry(networkId, networkCountryId)
      .map(networkCountry => {
        if (networkCountry.agencyCountries) {
          let agencyCountries = networkCountry.agencyCountries;
          let agencyCountryList = Object.keys(agencyCountries).map(key => {
            let obj = {};
            obj["agencyId"] = key;
            obj["countryId"] = Object.keys(agencyCountries[key])[0];
            return obj;
          });
          let agencyCountryMap = new Map<string, string>();
          agencyCountryList.forEach(item => {
            agencyCountryMap.set(item["agencyId"], item["countryId"]);
          });
          return agencyCountryMap;
        }
      });
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
          return Object.keys(snap.val()).map(key => snap.val()[key]);
        }
        return ids;
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
          return Observable.of(null);
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


}
