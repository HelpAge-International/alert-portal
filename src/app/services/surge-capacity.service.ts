import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {ModelSurgeCapacity} from "../country-admin/country-office-profile/office-capacity/add-edit-surge-capacity/surge-capacity.model";
import {Constants} from "../utils/Constants";
import {Router} from "@angular/router";

@Injectable()
export class SurgeCapacityService {

  constructor(private afd: AngularFireDatabase) {
  }

  saveSurgeCapacity(model: ModelSurgeCapacity, countryId: string) {
    // if (surgeId) {
    //   const surgeCapacityData = {};
    //   surgeCapacityData['/countryOfficeProfile/capacity/surgeCapacity/' + countryId + '/' + surgeId] = model;
    //   return this.af.database.object(Constants.APP_STATUS).update(surgeCapacityData);
    // } else {
    return this.afd.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/surgeCapacity/" + countryId).push(model);
    // }
  }

  updateSurgeCapacity(model: ModelSurgeCapacity, countryId: string, surgeId: string) {
    const surgeCapacityData = {};
    surgeCapacityData['/countryOfficeProfile/capacity/surgeCapacity/' + countryId + '/' + surgeId] = model;
    return this.afd.object(Constants.APP_STATUS).update(surgeCapacityData);
  }

  deleteSurgeCapacity(countryId: string, surgeId: string) {
    return this.afd.object(Constants.APP_STATUS+"/countryOfficeProfile/capacity/surgeCapacity/"+countryId+"/"+surgeId).remove();
  }

  getSuregeCapacity(countryId) {
    return this.afd.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/surgeCapacity/" + countryId);
  }

  getSurgeInfo(surgeId, countryId) {
    return this.afd.object(Constants.APP_STATUS + "/countryOfficeProfile/capacity/surgeCapacity/" + countryId + "/" + surgeId);
  }

}
