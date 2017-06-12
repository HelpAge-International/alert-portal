import {Injectable} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import {UserService} from "./user.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DirectorService {

  constructor(private af: AngularFire, private userService: UserService) {
  }

  getCountryIdBySearchResponsePlan(responsePlanId: string, agencyId: string) {
    this.userService.getAllCountryIdsForAgency(agencyId)
      .flatMap(countryIds => {
        return Observable.from(countryIds);
      })
      .flatMap(countryId => {
        return this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId)
      })
      .map(plans =>{
        plans.forEach(plan =>{
          if (plan.$key == responsePlanId) {

          }
        })
      })
  }

}
