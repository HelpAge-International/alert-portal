
import {map} from 'rxjs/operators/map';

import {mergeMap} from 'rxjs/operators/mergeMap';
import {Injectable} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import {UserService} from "./user.service";
import {Observable} from "rxjs";

@Injectable()
export class DirectorService {

  constructor(private af: AngularFire, private userService: UserService) {
  }

  getCountryIdBySearchResponsePlan(responsePlanId: string, agencyId: string) {
    this.userService.getAllCountryIdsForAgency(agencyId).pipe(
      mergeMap(countryIds => {
        return Observable.from(countryIds);
      }),
      mergeMap(countryId => {
        return this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId)
      }),
      map(plans =>{
        plans.forEach(plan =>{
          if (plan.$key == responsePlanId) {

          }
        })
      }),)
  }

}
