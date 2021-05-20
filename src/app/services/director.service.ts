
import {map, mergeMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Constants} from "../utils/Constants";
import {UserService} from "./user.service";
import {from} from "rxjs";

@Injectable()
export class DirectorService {

  constructor(private afd: AngularFireDatabase, private userService: UserService) {
  }

  getCountryIdBySearchResponsePlan(responsePlanId: string, agencyId: string) {
    this.userService.getAllCountryIdsForAgency(agencyId).pipe(
      mergeMap(countryIds => {
        return from(countryIds);
      }),
      mergeMap(countryId => {
        return this.afd.list(Constants.APP_STATUS + "/responsePlan/" + countryId).snapshotChanges()
      }),
      map(plans =>{
        plans.forEach(plan =>{
          if (plan.key == responsePlanId) {

          }
        })
      }),)
  }

}
