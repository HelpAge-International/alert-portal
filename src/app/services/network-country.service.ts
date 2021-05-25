import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Constants} from "../utils/Constants";
import {NetworkOfficeModel} from "../network-admin/network-offices/add-edit-network-office/network-office.model";
import {Observable} from "rxjs";
import {NetworkCountryModel} from "../network-country-admin/network-country.model";

@Injectable()
export class NetworkCountryService {

  constructor(private afd: AngularFireDatabase) {
  }

  getNetworkCountryDetail(networkId, networkCountryId) {
    return this.afd.object<NetworkOfficeModel>(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId)
      .snapshotChanges()
      .map(office => {
        let modelCountryOffice = new NetworkOfficeModel();
        modelCountryOffice.mapFromObject(office.payload.val());
        modelCountryOffice.id = office.key;
        return modelCountryOffice;
      });
  }

  getAssignedCountries(networkId, networkCountryId): Observable<number[]> {
    return this.afd.list<NetworkCountryModel>(Constants.APP_STATUS + "/networkCountry/" + networkId)
      .snapshotChanges()
      .map(networkObjs => {
        return networkCountryId ? networkObjs.filter(networkObj => networkObj.key != networkCountryId).map(networkObj => Number(networkObj.payload.val().location)) : networkObjs.map(networkObj => Number(networkObj.payload.val().location));
      });
  }

}
