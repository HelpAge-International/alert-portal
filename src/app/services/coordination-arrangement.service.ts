import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import { CoordinationArrangementModel } from "../model/coordination-arrangement.model";

@Injectable()
export class CoordinationArrangementService {

  constructor(private af: AngularFire) { }

    public getCoordinationArrangements(countryId: string): Observable<CoordinationArrangementModel[]> {
      if (!countryId) {
        return;
      }

      const getCoordinationArrangementsSubscription = this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/coordination/' + countryId)
      .map(items => {
          console.log(items);
        const coordinationArrangements: CoordinationArrangementModel[] = [];
        items.forEach(item => {
          let coordinationArrangement = new CoordinationArrangementModel();
          coordinationArrangement.mapFromObject(item);
          coordinationArrangement.id = item.$key;
          coordinationArrangements.push(coordinationArrangement);
        });
        return coordinationArrangements;
      });

    return getCoordinationArrangementsSubscription;
  }
}