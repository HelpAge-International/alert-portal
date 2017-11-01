import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import { CoordinationArrangementModel } from "../model/coordination-arrangement.model";
import { CoordinationArrangementNetworkModel } from "../model/coordination-arrangement-network.model";

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

  public getCoordinationArrangementsNetwork(networkId: string): Observable<CoordinationArrangementNetworkModel[]> {
    if (!networkId) {
      return;
    }

    const getCoordinationArrangementsSubscription = this.af.database.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId)
      .map(items => {
        const coordinationArrangements: CoordinationArrangementNetworkModel[] = [];
        items.forEach(item => {
          let coordinationArrangement = new CoordinationArrangementNetworkModel();
          coordinationArrangement.mapFromObject(item);
          coordinationArrangement.id = item.$key;
          coordinationArrangements.push(coordinationArrangement);
        });
        return coordinationArrangements;
      });

    return getCoordinationArrangementsSubscription;
  }

  public getCoordinationArrangementsNetworkCountry(countryId: string): Observable<CoordinationArrangementNetworkModel[]> {
    if (!countryId) {
      return;
    }

    const getCoordinationArrangementsSubscription = this.af.database.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + countryId)
      .map(items => {
        const coordinationArrangements: CoordinationArrangementNetworkModel[] = [];
        items.forEach(item => {
          let coordinationArrangement = new CoordinationArrangementNetworkModel();
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

  public getCoordinationArrangementNetwork(networkId: string, coordinationArrangementId: string): Observable<CoordinationArrangementNetworkModel> {
    if (!networkId || !coordinationArrangementId) {
      return;
    }

    const getCoordinationArrangementSubscription =
      this.af.database.object(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangementId)
        .map(item => {
          let coordinationArrangement = new CoordinationArrangementNetworkModel();
          coordinationArrangement.mapFromObject(item);
          coordinationArrangement.id = item.$key;
          return coordinationArrangement;
        });

    return getCoordinationArrangementSubscription;
  }

  public getCoordinationArrangementNetworkCountry(networkCountryId: string, coordinationArrangementId: string): Observable<CoordinationArrangementNetworkModel> {
    if (!networkCountryId || !coordinationArrangementId) {
      return;
    }

    const getCoordinationArrangementSubscription =
      this.af.database.object(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkCountryId + '/' + coordinationArrangementId)
        .map(item => {
          let coordinationArrangement = new CoordinationArrangementNetworkModel();
          coordinationArrangement.mapFromObject(item);
          coordinationArrangement.id = item.$key;
          return coordinationArrangement;
        });

    return getCoordinationArrangementSubscription;
  }

  public getCoordinationArrangementNonAlertMembers(networkId: string, coordinationArrangementId: string){
    if (!networkId || !coordinationArrangementId) {
      return;
    }
    return this.af.database.object(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangementId )


  }

  public getCoordinationArrangementNonAlertMembersNetworkCountry(networkCountryId: string, coordinationArrangementId: string){
    if (!networkCountryId || !coordinationArrangementId) {
      return;
    }
    return this.af.database.object(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkCountryId + '/' + coordinationArrangementId )


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

  public saveCoordinationArrangementNetwork(networkId: string, coordinationArrangement: CoordinationArrangementNetworkModel, nonAlertMembers: string[]): firebase.Promise<any>{
    if(!networkId || !coordinationArrangement)
    {
      return Promise.reject('Missing networkId or coordinationArrangement');
    }

    // Update the timestamp
    coordinationArrangement.updatedAt = new Date().getTime();


    if(coordinationArrangement.id)
    {
      const equipmentData = {};
      equipmentData['/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangement.id] = coordinationArrangement;
      return this.af.database.object(Constants.APP_STATUS).update(equipmentData)
        .then(( ) => {


              this.af.database.object(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").remove()
              if(nonAlertMembers){
                nonAlertMembers.forEach( member => {
                  if(member){
                    this.af.database.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").push({"name": member});
                  }
                })
              }

        });


    }else{
      return this.af.database.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId).push(coordinationArrangement)
        .then((newCoordination => {
          if(nonAlertMembers){
              nonAlertMembers.forEach( member => {
                if(member){
                  console.log('uyyyt')
                  this.af.database.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + newCoordination.key + "/nonAlertMembers").push({"name": member});
                }
              })
            }
        }))

    }
  }

  public saveCoordinationArrangementNetworkCountry(networkId: string, coordinationArrangement: CoordinationArrangementNetworkModel, nonAlertMembers: string[]): firebase.Promise<any>{
    if(!networkId || !coordinationArrangement)
    {
      return Promise.reject('Missing networkId or coordinationArrangement');
    }

    // Update the timestamp
    coordinationArrangement.updatedAt = new Date().getTime();


    if(coordinationArrangement.id)
    {
      const equipmentData = {};
      equipmentData['/networkCountryOfficeProfile/coordination/' + networkId + '/' + coordinationArrangement.id] = coordinationArrangement;
      return this.af.database.object(Constants.APP_STATUS).update(equipmentData)
        .then(( ) => {


          this.af.database.object(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").remove()
          if(nonAlertMembers){
            nonAlertMembers.forEach( member => {
              if(member){
                this.af.database.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").push({"name": member});
              }
            })
          }

        });


    }else{
      return this.af.database.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkId).push(coordinationArrangement)
        .then((newCoordination => {
          if(nonAlertMembers){
            nonAlertMembers.forEach( member => {
              if(member){
                this.af.database.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkId + '/' + newCoordination.key + "/nonAlertMembers").push({"name": member});
              }
            })
          }
        }))

    }
  }

  public addNonAlertMembers(networkId: string, coordinationArrangement: CoordinationArrangementNetworkModel, nonAlertMembers: string[]){
    if(coordinationArrangement.id) {
      if (nonAlertMembers) {
        nonAlertMembers.forEach(member => {
          if (member) {
            this.af.database.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").push(member);
          }
        })
      }
    } else {
      nonAlertMembers.forEach( member => {
        if(member){
          console.log('uyyyt')
          this.af.database.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").push(member);
        }
      })
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

  public deleteCoordinationArrangementLocalNetwork(countryId: string, coordinationArrangement: CoordinationArrangementNetworkModel): firebase.Promise<any>{
    if(!countryId || !coordinationArrangement || !coordinationArrangement.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    const coordinationArrangementData = {};

    coordinationArrangementData['/localNetworkProfile/coordination/' + countryId + '/' + coordinationArrangement.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(coordinationArrangementData);
  }

  public deleteCoordinationArrangementNetworkCountry(countryId: string, coordinationArrangement: CoordinationArrangementNetworkModel): firebase.Promise<any>{
    if(!countryId || !coordinationArrangement || !coordinationArrangement.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    console.log('/networkCountryOfficeProfile/coordination/' + countryId + '/' + coordinationArrangement.id)
    const coordinationArrangementData = {};

    coordinationArrangementData['/networkCountryOfficeProfile/coordination/' + countryId + '/' + coordinationArrangement.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(coordinationArrangementData);
  }
}
