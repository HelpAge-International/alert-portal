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
    // if (surgeId) {
    //   const surgeCapacityData = {};
    //   surgeCapacityData['/countryOfficeProfile/capacity/surgeCapacity/' + countryId + '/' + surgeId] = model;
    //   return this.af.database.object(Constants.APP_STATUS).update(surgeCapacityData);
    // } else {
    return this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/surgeCapacity/" + countryId).push(model);
    // }
  }

  updateSurgeCapacity(model: ModelSurgeCapacity, countryId: string, surgeId: string) {
    const surgeCapacityData = {};
    surgeCapacityData['/countryOfficeProfile/capacity/surgeCapacity/' + countryId + '/' + surgeId] = model;
    return this.af.database.object(Constants.APP_STATUS).update(surgeCapacityData);
  }

  deleteSurgeCapacity(countryId: string, surgeId: string) {
    return this.af.database.object(Constants.APP_STATUS+"/countryOfficeProfile/capacity/surgeCapacity/"+countryId+"/"+surgeId).remove();
  }

  getSuregeCapacity(countryId) {
    return this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/surgeCapacity/" + countryId);
  }

  getSurgeInfo(surgeId, countryId) {
    return this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/capacity/surgeCapacity/" + countryId + "/" + surgeId);
  }

}
