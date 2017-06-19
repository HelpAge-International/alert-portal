import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import { StockCapacityModel } from "../model/stock-capacity.model";

@Injectable()
export class StockService {

  constructor(private af: AngularFire) { }

    public getStockCapacities(countryId: string): Observable<StockCapacityModel[]> {
      if (!countryId) {
        return;
      }

      const stockCapacitiesSubscription = 
            this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/capacity/stockCapacity/' + countryId)
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


  public getStockCapacity(countryId: string, stockCapacityId: string): Observable<StockCapacityModel> {
      if (!countryId || !stockCapacityId) {
        return;
      }

      const getStockCapacitySubscription = 
              this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/capacity/stockCapacity/' + countryId + '/' + stockCapacityId)
      .map(item => {
        let stockCapacity = new StockCapacityModel();
        stockCapacity.mapFromObject(item);
        stockCapacity.id = item.$key;
        return stockCapacity;
      });

    return getStockCapacitySubscription;
  }

  public saveStockCapacity(countryId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!countryId || !stockCapacity)
    {
      return Promise.reject('Missing countryId or stockCapacity');
    }
    
    // Update the timestamp
    stockCapacity.updatedAt = new Date().getTime();
    
    if(stockCapacity.id)
    {
      const stockCapacityData = {};
      stockCapacityData['/countryOfficeProfile/capacity/stockCapacity/' + countryId + '/' + stockCapacity.id] = stockCapacity;
      return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
    }else{
      return this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/capacity/stockCapacity/' + countryId).push(stockCapacity);
    }
  }

  public deleteStockCapacity(countryId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!countryId || !stockCapacity || !stockCapacity.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }
    
    const stockCapacityData = {};

    stockCapacityData['/countryOfficeProfile/capacity/stockCapacity/' + countryId + '/' + stockCapacity.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
  }
}