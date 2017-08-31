import {Injectable} from '@angular/core';
import {AngularFire} from "angularfire2";
import {ActionLevel, NetworkUserAccountType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Observable} from "rxjs/Observable";
import {NetworkAgencyModel} from "../network/network-agencies/network-agency.model";
import * as moment from "moment";
import * as firebase from "firebase/app";
import {NetworkOfficeModel} from "../network/network-offices/add-edit-network-office/network-office.model";
import {ModelNetwork} from "../model/network.model";
import {NetworkActionModel} from "../network/network-mpa/network-create-edit-mpa/network-mpa.model";
import {GenericActionModel} from "../network/network-mpa/network-add-generic-action/generic-action.model";
import {NetworkAdminAccount} from "../network/network-account-selection/Models/network-admin-account";

@Injectable()
export class NetworkService {

  constructor(private af: AngularFire) {
  }

  checkNetworkUserFirstLogin(uid: string, type: NetworkUserAccountType) {
    if (type == NetworkUserAccountType.NetworkAdmin) {
      return this.af.database.object(Constants.APP_STATUS + "/networkAdmin/" + uid)
        .map(networkAdmin => {
          return networkAdmin.firstLogin ? networkAdmin.firstLogin : false;
        });
    } else {
      return this.af.database.object(Constants.APP_STATUS + "/networkCountryAdmin/" + uid)
        .map(networkCountryAdmin => {
          return networkCountryAdmin.firstLogin ? networkCountryAdmin.firstLogin : false;
        });
    }
  }

  checkNetworkUserSelection(uid: string): Observable<any> {
    return this.af.database.object(Constants.APP_STATUS + "/networkAdmin/" + uid + "/selectedNetwork")
      .flatMap(networkId => {
        if (networkId.$value) {
          let data = {};
          data["isNetworkAdmin"] = true;
          data["networkId"] = networkId.$value;
          return Observable.of(data);
        } else {
          return this.af.database.object(Constants.APP_STATUS + "/networkCountryAdmin/" + uid + "/selectedNetwork")
            .map(networkCountryId => {
              let data = {};
              data["isNetworkAdmin"] = false;
              data["networkCountryId"] = networkCountryId.$value;
              return Observable.of(data);
            })
        }
      })
  }

  getNetworkUserType(uid) {
    return this.af.database.object(Constants.APP_STATUS + "/networkAdmin/" + uid, {preserveSnapshot: true})
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

  //TODO ADD FOR NETWORK COUNTRY
  getNetworkDetailByUid(uid) {
    return this.checkNetworkUserSelection(uid)
      .flatMap(data => {
        return data.isNetworkAdmin ? this.getNetworkDetail(data.networkId) : null;
      })
  }

  getSelectedIdObj(uid: string) {
    return this.af.database.object(Constants.APP_STATUS + "/networkUserSelection/" + uid, {preserveSnapshot: true})
      .flatMap(snap => {
        if (snap.val()) {
          let selection = snap.val();
          let selectData = {};
          if (selection.selectedNetwork) {
            selectData["userType"] = NetworkUserAccountType.NetworkAdmin;
            selectData["id"] = selection.selectedNetwork;
          } else {
            selectData["userType"] = NetworkUserAccountType.NetworkCountryAdmin;
            selectData["id"] = selection.selectedNetworkCountry;
          }
          return Observable.of(selectData);
        } else {
          return Observable.empty();
        }
      })
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

  updateNetworkField(data) {
    return this.af.database.object(Constants.APP_STATUS).update(data);
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
    return this.af.database.object(Constants.APP_STATUS + "/networkAdmin/" + uid + "/systemAdmin")
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

}
