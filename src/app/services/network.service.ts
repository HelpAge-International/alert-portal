import {Injectable} from '@angular/core';
import {AngularFire} from "angularfire2";
import {NetworkUserAccountType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Observable} from "rxjs/Observable";
import {NetworkAgencyModel} from "../network/network-agencies/network-agency.model";
import * as moment from "moment";
import * as firebase from "firebase/app";

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

  getNetworkDetail(networkId) {
    return this.af.database.object(Constants.APP_STATUS + "/network/" + networkId);
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

  public generateKeyForNetworkCountry():string {
    return firebase.database().ref(Constants.APP_STATUS+"/networkCountry/").push().key;
  }

  public generateKeyUserPublic():string {
    return firebase.database().ref(Constants.APP_STATUS + "/userPublic/").push().key;
  }


}
