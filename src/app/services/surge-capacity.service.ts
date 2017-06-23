import {Injectable} from '@angular/core';
import {AngularFire} from "angularfire2";
import {ModelSurgeCapacity} from "../country-admin/country-office-profile/office-capacity/add-edit-surge-capacity/surge-capacity.model";
import {Constants} from "../utils/Constants";
import {Router} from "@angular/router";

@Injectable()
export class SurgeCapacityService {

  constructor(private af: AngularFire) {
  }

  saveSurgeCapacity(model: ModelSurgeCapacity, countryId: string) {
    return this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/surgeCapacity/" + countryId).push(model);
  }

  getSuregeCapacity(countryId) {
    return this.af.database.list(Constants.APP_STATUS+"/countryOfficeProfile/capacity/surgeCapacity/" + countryId);
  }

}
