import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import { StockCapacityModel } from "../model/stock-capacity.model";

@Injectable()
export class StockService {

  constructor(private afd: AngularFireDatabase) { }

    public getStockCapacities(countryId: string): Observable<StockCapacityModel[]> {
      if (!countryId) {
        return;
      }

      const stockCapacitiesSubscription =
            this.afd.list(Constants.APP_STATUS + '/countryOfficeProfile/capacity/stockCapacity/' + countryId)
              .snapshotChanges()
                      .map(items => {
                        const stockCapacities: StockCapacityModel[] = [];
                        items.forEach(item => {
                          console.log("item:", item);
                          let stockCapacity = new StockCapacityModel();
                          stockCapacity.mapFromObject(item.payload.val());
                          stockCapacity.id = item.key;
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
      this.afd.list(Constants.APP_STATUS + '/localAgencyProfile/capacity/stockCapacity/' + agencyId)
        .snapshotChanges()
        .map(items => {
          const stockCapacities: StockCapacityModel[] = [];
          items.forEach(item => {
            let stockCapacity = new StockCapacityModel();
            stockCapacity.mapFromObject(item.payload.val());
            stockCapacity.id = item.key;
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
      this.afd.list(Constants.APP_STATUS + '/localNetworkProfile/capacity/stockCapacity/' + networkId)
        .snapshotChanges()
        .map(items => {
          const stockCapacities: StockCapacityModel[] = [];
          items.forEach(item => {
            let stockCapacity = new StockCapacityModel();
            stockCapacity.mapFromObject(item.payload.val());
            stockCapacity.id = item.key;
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
      this.afd.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/capacity/stockCapacity/' + networkId)
        .snapshotChanges()
        .map(items => {
          const stockCapacities: StockCapacityModel[] = [];
          items.forEach(item => {
            let stockCapacity = new StockCapacityModel();
            stockCapacity.mapFromObject(item.payload.val());
            stockCapacity.id = item.key;
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
              this.afd.object(Constants.APP_STATUS + '/countryOfficeProfile/capacity/stockCapacity/' + countryId + '/' + stockCapacityId)
                .snapshotChanges()
      .map(item => {
        let stockCapacity = new StockCapacityModel();
        stockCapacity.mapFromObject(item.payload.val());
        stockCapacity.id = item.key;
        return stockCapacity;
      });

    return getStockCapacitySubscription;
  }

  public getStockCapacityLocalAgency(agencyId: string, stockCapacityId: string): Observable<StockCapacityModel> {
    if (!agencyId || !stockCapacityId) {
      return;
    }

    const getStockCapacitySubscription =
      this.afd.object(Constants.APP_STATUS + '/localAgencyProfile/capacity/stockCapacity/' + agencyId + '/' + stockCapacityId)
        .snapshotChanges()
        .map(item => {
          let stockCapacity = new StockCapacityModel();
          stockCapacity.mapFromObject(item.payload.val());
          stockCapacity.id = item.key;
          return stockCapacity;
        });

    return getStockCapacitySubscription;
  }

  public getStockCapacityLocalNetwork(networkId: string, stockCapacityId: string): Observable<StockCapacityModel> {
    if (!networkId || !stockCapacityId) {
      return;
    }

    const getStockCapacitySubscription =
      this.afd.object(Constants.APP_STATUS + '/localNetworkProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacityId)
        .snapshotChanges()
        .map(item => {
          let stockCapacity = new StockCapacityModel();
          stockCapacity.mapFromObject(item.payload.val());
          stockCapacity.id = item.key;
          return stockCapacity;
        });

    return getStockCapacitySubscription;
  }

  public getStockCapacityLocalNetworkCountry(networkId: string, stockCapacityId: string): Observable<StockCapacityModel> {
    if (!networkId || !stockCapacityId) {
      return;
    }

    const getStockCapacitySubscription =
      this.afd.object(Constants.APP_STATUS + '/networkCountryOfficeProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacityId)
        .snapshotChanges()
        .map(item => {
          let stockCapacity = new StockCapacityModel();
          stockCapacity.mapFromObject(item.payload.val());
          stockCapacity.id = item.key;
          return stockCapacity;
        });

    return getStockCapacitySubscription;
  }

  public saveStockCapacity(countryId: string, stockCapacity: StockCapacityModel): Promise<any>{
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
      return this.afd.object(Constants.APP_STATUS).update(stockCapacityData);
    }else{
      return this.afd.list(Constants.APP_STATUS + '/countryOfficeProfile/capacity/stockCapacity/' + countryId).push(stockCapacity).then();
    }
  }

  public saveStockCapacityLocalAgency(agencyId: string, stockCapacity: StockCapacityModel): Promise<any>{
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
      return this.afd.object(Constants.APP_STATUS).update(stockCapacityData);
    }else{
      return this.afd.list(Constants.APP_STATUS + '/localAgencyProfile/capacity/stockCapacity/' + agencyId).push(stockCapacity).then();
    }
  }

  public saveStockCapacityLocalNetwork(networkId: string, stockCapacity: StockCapacityModel): Promise<any>{
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
      return this.afd.object(Constants.APP_STATUS).update(stockCapacityData);
    }else{
      // console.log(stockCapacity)
      return this.afd.list(Constants.APP_STATUS + '/localNetworkProfile/capacity/stockCapacity/' + networkId).push(stockCapacity).then();
    }
  }

  public saveStockCapacityNetworkCountry(networkId: string, stockCapacity: StockCapacityModel): Promise<any>{
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
      return this.afd.object(Constants.APP_STATUS).update(stockCapacityData);
    }else{
      // console.log(stockCapacity)
      return this.afd.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/capacity/stockCapacity/' + networkId).push(stockCapacity).then();
    }
  }

  public deleteStockCapacity(countryId: string, stockCapacity: StockCapacityModel): Promise<any>{
    if(!countryId || !stockCapacity || !stockCapacity.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    const stockCapacityData = {};

    stockCapacityData['/countryOfficeProfile/capacity/stockCapacity/' + countryId + '/' + stockCapacity.id] = null;

    return this.afd.object(Constants.APP_STATUS).update(stockCapacityData);
  }

  public deleteStockCapacityLocalAgency(agencyId: string, stockCapacity: StockCapacityModel): Promise<any>{
    if(!agencyId || !stockCapacity || !stockCapacity.id )
    {
      return Promise.reject('Missing agencyId or coordinationArrangement');
    }

    const stockCapacityData = {};

    stockCapacityData['/localAgencyProfile/capacity/stockCapacity/' + agencyId + '/' + stockCapacity.id] = null;

    return this.afd.object(Constants.APP_STATUS).update(stockCapacityData);
  }

  public deleteStockCapacityLocalNetwork(networkId: string, stockCapacity: StockCapacityModel): Promise<any>{
    if(!networkId || !stockCapacity || !stockCapacity.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    const stockCapacityData = {};

    stockCapacityData['/localNetworkProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacity.id] = null;

    return this.afd.object(Constants.APP_STATUS).update(stockCapacityData);
  }

  public deleteStockCapacityNetworkCountry(networkId: string, stockCapacity: StockCapacityModel): Promise<any>{
    if(!networkId || !stockCapacity || !stockCapacity.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    const stockCapacityData = {};

    stockCapacityData['/networkCountryOfficeProfile/capacity/stockCapacity/' + networkId + '/' + stockCapacity.id] = null;

    return this.afd.object(Constants.APP_STATUS).update(stockCapacityData);
  }
}
