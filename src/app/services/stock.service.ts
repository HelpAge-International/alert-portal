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

  public getStockCapacitiesLocalAgency(agencyId: string): Observable<StockCapacityModel[]> {
    if (!agencyId) {
      return;
    }

    const stockCapacitiesSubscription =
      this.af.database.list(Constants.APP_STATUS + '/localAgencyProfile/capacity/stockCapacity/' + agencyId)
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

  public getStockCapacitiesLocalNetwork(networkId: string): Observable<StockCapacityModel[]> {
    if (!networkId) {
      return;
    }

    const stockCapacitiesSubscription =
      this.af.database.list(Constants.APP_STATUS + '/localNetworkProfile/capacity/stockCapacity/' + networkId)
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

  public getStockCapacitiesLocalNetworkCountry(networkId: string): Observable<StockCapacityModel[]> {
    if (!networkId) {
      return;
    }

    const stockCapacitiesSubscription =
      this.af.database.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/capacity/stockCapacity/' + networkId)
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

  public getStockCapacityLocalAgency(agencyId: string, stockCapacityId: string): Observable<StockCapacityModel> {
    if (!agencyId || !stockCapacityId) {
      return;
    }

    const getStockCapacitySubscription =
      this.af.database.object(Constants.APP_STATUS + '/localAgencyProfile/capacity/stockCapacity/' + agencyId + '/' + stockCapacityId)
        .map(item => {
          let stockCapacity = new StockCapacityModel();
          stockCapacity.mapFromObject(item);
          stockCapacity.id = item.$key;
          return stockCapacity;
        });

    return getStockCapacitySubscription;
  }

  public getStockCapacityLocalNetwork(networkId: string, stockCapacityId: string): Observable<StockCapacityModel> {
    if (!networkId || !stockCapacityId) {
      return;
    }

    const getStockCapacitySubscription =
      this.af.database.object(Constants.APP_STATUS + '/localNetworkProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacityId)
        .map(item => {
          let stockCapacity = new StockCapacityModel();
          stockCapacity.mapFromObject(item);
          stockCapacity.id = item.$key;
          return stockCapacity;
        });

    return getStockCapacitySubscription;
  }

  public getStockCapacityLocalNetworkCountry(networkId: string, stockCapacityId: string): Observable<StockCapacityModel> {
    if (!networkId || !stockCapacityId) {
      return;
    }

    const getStockCapacitySubscription =
      this.af.database.object(Constants.APP_STATUS + '/networkCountryOfficeProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacityId)
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

  public saveStockCapacityLocalAgency(agencyId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!agencyId || !stockCapacity)
    {
      return Promise.reject('Missing agencyId or stockCapacity');
    }

    // Update the timestamp
    stockCapacity.updatedAt = new Date().getTime();

    if(stockCapacity.id)
    {
      const stockCapacityData = {};
      stockCapacityData['/localAgencyProfile/capacity/stockCapacity/' + agencyId + '/' + stockCapacity.id] = stockCapacity;
      return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
    }else{
      return this.af.database.list(Constants.APP_STATUS + '/localAgencyProfile/capacity/stockCapacity/' + agencyId).push(stockCapacity);
    }
  }

  public saveStockCapacityLocalNetwork(networkId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!networkId || !stockCapacity)
    {
      return Promise.reject('Missing countryId or stockCapacity');
    }

    // Update the timestamp
    stockCapacity.updatedAt = new Date().getTime();

    if(stockCapacity.id)
    {
      const stockCapacityData = {};

      stockCapacityData['/localNetworkProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacity.id] = stockCapacity;
      return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
    }else{
      // console.log(stockCapacity)
      return this.af.database.list(Constants.APP_STATUS + '/localNetworkProfile/capacity/stockCapacity/' + networkId).push(stockCapacity);
    }
  }

  public saveStockCapacityNetworkCountry(networkId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!networkId || !stockCapacity)
    {
      return Promise.reject('Missing countryId or stockCapacity');
    }

    // Update the timestamp
    stockCapacity.updatedAt = new Date().getTime();

    if(stockCapacity.id)
    {
      const stockCapacityData = {};

      stockCapacityData['/networkCountryOfficeProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacity.id] = stockCapacity;
      return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
    }else{
      // console.log(stockCapacity)
      return this.af.database.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/capacity/stockCapacity/' + networkId).push(stockCapacity);
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

  public deleteStockCapacityLocalAgency(agencyId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!agencyId || !stockCapacity || !stockCapacity.id )
    {
      return Promise.reject('Missing agencyId or coordinationArrangement');
    }

    const stockCapacityData = {};

    stockCapacityData['/localAgencyProfile/capacity/stockCapacity/' + agencyId + '/' + stockCapacity.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
  }

  public deleteStockCapacityLocalNetwork(networkId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!networkId || !stockCapacity || !stockCapacity.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    const stockCapacityData = {};

    stockCapacityData['/localNetworkProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacity.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
  }

  public deleteStockCapacityNetworkCountry(networkId: string, stockCapacity: StockCapacityModel): firebase.Promise<any>{
    if(!networkId || !stockCapacity || !stockCapacity.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    const stockCapacityData = {};

    stockCapacityData['/networkCountryOfficeProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacity.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(stockCapacityData);
  }
}
