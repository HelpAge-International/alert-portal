import {Injectable} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import {NetworkOfficeModel} from "../network-admin/network-offices/add-edit-network-office/network-office.model";
import {Observable} from "rxjs/Observable";

@Injectable()
export class NetworkCountryService {

  constructor(private af: AngularFire) {
  }

  getNetworkCountryDetail(networkId, networkCountryId) {
    return this.af.database.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId)
      .map(office => {
        let modelCountryOffice = new NetworkOfficeModel();
        modelCountryOffice.mapFromObject(office);
        modelCountryOffice.id = office.$key;
        return modelCountryOffice;
      });
  }

  getAssignedCountries(networkId, networkCountryId): Observable<number[]> {
    return this.af.database.list(Constants.APP_STATUS + "/networkCountry/" + networkId)
      .map(networkObjs => {
        return networkCountryId ? networkObjs.filter(networkObj => networkObj.$key != networkCountryId).map(networkObj => Number(networkObj.location)) : networkObjs.map(networkObj => Number(networkObj.location));
      });
  }

}
