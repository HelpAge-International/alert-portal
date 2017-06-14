import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import { StockCapacityModel } from "../model/stock-capacity.model";

@Injectable()
export class StockService {

  constructor(private af: AngularFire) { }

    public getStockCapacities(agencyId: string, countryId: string): Observable<StockCapacityModel[]> {
      if (!countryId || !agencyId) {
        return;
      }

      const stockCapacitiesSubscription = this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/stock')
      .map(items => {
        const stockCapacities: StockCapacityModel[] = [];
        items.forEach(item => {
          let stockCapacity = new StockCapacityModel();
          stockCapacity.mapFromObject(item);
          stockCapacity.id = item.$key;
          stockCapacities.push(stockCapacity);
        });
        return stockCapacities;
      });

    return stockCapacitiesSubscription;
  }


  public getStockCapacity(agencyId: string, countryId: string, stockCapacityId: string): Observable<StockCapacityModel> {
      if (!countryId || !stockCapacityId) {
        return;
      }

      const getStockCapacitySubscription = 
              this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/stock/' + stockCapacityId)
      .map(item => {
        let stockCapacity = new StockCapacityModel();
        stockCapacity.mapFromObject(item);
        stockCapacity.id = item.$key;
        return stockCapacity;
      });

    return getStockCapacitySubscription;
  }

  public saveStockCapacity(agencyId: string, countryId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!agencyId || !countryId || !stockCapacity)
    {
      return Promise.reject('Missing agencyId, countryId or coordinationArrangement');
    }
    
    // Update the timestamp
    stockCapacity.updatedAt = new Date().getTime();
    
    if(stockCapacity.id)
    {
      const stockCapacityData = {};
      stockCapacityData['/countryOffice/' + agencyId + '/' + countryId + '/stock/' + stockCapacity.id] = stockCapacity;
      return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
    }else{
      return this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/stock').push(stockCapacity);
    }
  }

  public deleteStockCapacity(agencyId: string, countryId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!agencyId || !countryId || !stockCapacity || !stockCapacity.id )
    {
      return Promise.reject('Missing agencyId, countryId or coordinationArrangement');
    }
    
    const stockCapacityData = {};

    stockCapacityData['/countryOffice/' + agencyId + '/' + countryId + '/stock/' + stockCapacity.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
  }
}