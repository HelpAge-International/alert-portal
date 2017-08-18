import {Injectable} from '@angular/core';
import {AngularFire} from "angularfire2";
import {NetworkUserAccountType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Observable} from "rxjs/Observable";

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

  getSelectedId(uid: string) {
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

}