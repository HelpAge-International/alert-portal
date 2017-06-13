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

  public getCoordinationArrangement(countryId: string, coordinationArrangementId: string): Observable<CoordinationArrangementModel> {
      if (!countryId || !coordinationArrangementId) {
        return;
      }

      const getCoordinationArrangementSubscription = 
              this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/coordination/' + countryId + '/' + coordinationArrangementId)
      .map(item => {
        let coordinationArrangement = new CoordinationArrangementModel();
        coordinationArrangement.mapFromObject(item);
        coordinationArrangement.id = item.$key;
        return coordinationArrangement;
      });

    return getCoordinationArrangementSubscription;
  }

  public saveCoordinationArrangement(countryId: string, coordinationArrangement: CoordinationArrangementModel): firebase.Promise<any>{
    if(!countryId || !coordinationArrangement)
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }
    
    // Update the timestamp
    coordinationArrangement.updatedAt = new Date().getTime();
    
    if(coordinationArrangement.id)
    {
      const equipmentData = {};
      equipmentData['/countryOfficeProfile/coordination/' + countryId + '/' + coordinationArrangement.id] = coordinationArrangement;
      return this.af.database.object(Constants.APP_STATUS).update(equipmentData);
    }else{
      return this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/coordination/' + countryId).push(coordinationArrangement);
    }
  }

  public deleteCoordinationArrangement(countryId: string, coordinationArrangement: CoordinationArrangementModel): firebase.Promise<any>{
    if(!countryId || !coordinationArrangement || !coordinationArrangement.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }
    
    const coordinationArrangementData = {};

    coordinationArrangementData['/countryOfficeProfile/coordination/' + countryId + '/' + coordinationArrangement.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(coordinationArrangementData);
  }
}