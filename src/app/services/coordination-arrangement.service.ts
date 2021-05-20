import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import { CoordinationArrangementModel } from "../model/coordination-arrangement.model";
import { CoordinationArrangementNetworkModel } from "../model/coordination-arrangement-network.model";

@Injectable()
export class CoordinationArrangementService {

  constructor(private afd: AngularFireDatabase) { }

    public getCoordinationArrangements(countryId: string): Observable<CoordinationArrangementModel[]> {
      if (!countryId) {
        return;
      }

      const getCoordinationArrangementsSubscription = this.afd.list(Constants.APP_STATUS + '/countryOfficeProfile/coordination/' + countryId)
        .snapshotChanges()
      .map(items => {
        const coordinationArrangements: CoordinationArrangementModel[] = [];
        items.forEach(item => {
          let coordinationArrangement = new CoordinationArrangementModel();
          coordinationArrangement.mapFromObject(item.payload.val());
          coordinationArrangement.id = item.key;
          coordinationArrangements.push(coordinationArrangement);
        });
        return coordinationArrangements;
      });

    return getCoordinationArrangementsSubscription;
  }

  public getCoordinationArrangementsLocalAgency(agencyId: string): Observable<CoordinationArrangementModel[]> {
    if (!agencyId) {
      return;
    }

    const getCoordinationArrangementsSubscription = this.afd.list(Constants.APP_STATUS + '/localAgencyProfile/coordination/' + agencyId)
      .snapshotChanges()
      .map(items => {
        const coordinationArrangements: CoordinationArrangementModel[] = [];
        items.forEach(item => {
          let coordinationArrangement = new CoordinationArrangementModel();
          coordinationArrangement.mapFromObject(item.payload.val());
          coordinationArrangement.id = item.key;
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

    const getCoordinationArrangementsSubscription = this.afd.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId)
      .snapshotChanges()
      .map(items => {
        const coordinationArrangements: CoordinationArrangementNetworkModel[] = [];
        items.forEach(item => {
          let coordinationArrangement = new CoordinationArrangementNetworkModel();
          coordinationArrangement.mapFromObject(item.payload.val());
          coordinationArrangement.id = item.key;
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

    const getCoordinationArrangementsSubscription = this.afd.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + countryId)
      .snapshotChanges()
      .map(items => {
        const coordinationArrangements: CoordinationArrangementNetworkModel[] = [];
        items.forEach(item => {
          let coordinationArrangement = new CoordinationArrangementNetworkModel();
          coordinationArrangement.mapFromObject(item.payload.val());
          coordinationArrangement.id = item.key;
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
              this.afd.object(Constants.APP_STATUS + '/countryOfficeProfile/coordination/' + countryId + '/' + coordinationArrangementId)
                .snapshotChanges()
      .map(item => {
        let coordinationArrangement = new CoordinationArrangementModel();
        coordinationArrangement.mapFromObject(item.payload.val());
        coordinationArrangement.id = item.key;
        return coordinationArrangement;
      });

    return getCoordinationArrangementSubscription;
  }

  public getCoordinationArrangementLocalAgency(agencyId: string, coordinationArrangementId: string): Observable<CoordinationArrangementModel> {
    if (!agencyId || !coordinationArrangementId) {
      return;
    }

    const getCoordinationArrangementSubscription =
      this.afd.object(Constants.APP_STATUS + '/localAgencyProfile/coordination/' + agencyId + '/' + coordinationArrangementId)
        .snapshotChanges()
        .map(item => {
          let coordinationArrangement = new CoordinationArrangementModel();
          coordinationArrangement.mapFromObject(item.payload.val());
          coordinationArrangement.id = item.key;
          return coordinationArrangement;
        });

    return getCoordinationArrangementSubscription;
  }

  public getCoordinationArrangementNetwork(networkId: string, coordinationArrangementId: string): Observable<CoordinationArrangementNetworkModel> {
    if (!networkId || !coordinationArrangementId) {
      return;
    }

    const getCoordinationArrangementSubscription =
      this.afd.object(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangementId)
        .snapshotChanges()
        .map(item => {
          let coordinationArrangement = new CoordinationArrangementNetworkModel();
          coordinationArrangement.mapFromObject(item.payload.val());
          coordinationArrangement.id = item.key;
          return coordinationArrangement;
        });

    return getCoordinationArrangementSubscription;
  }

  public getCoordinationArrangementNetworkCountry(networkCountryId: string, coordinationArrangementId: string): Observable<CoordinationArrangementNetworkModel> {
    if (!networkCountryId || !coordinationArrangementId) {
      return;
    }

    const getCoordinationArrangementSubscription =
      this.afd.object(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkCountryId + '/' + coordinationArrangementId)
        .snapshotChanges()
        .map(item => {
          let coordinationArrangement = new CoordinationArrangementNetworkModel();
          coordinationArrangement.mapFromObject(item.payload.val());
          coordinationArrangement.id = item.key;
          return coordinationArrangement;
        });

    return getCoordinationArrangementSubscription;
  }

  public getCoordinationArrangementNonAlertMembersCountry(networkCountryId: string, coordinationArrangementId: string){
    if (!networkCountryId || !coordinationArrangementId) {
      return;
    }
    return this.afd.object(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkCountryId + '/' + coordinationArrangementId )


  }

  public getCoordinationArrangementNonAlertMembers(networkId: string, coordinationArrangementId: string){
    if (!networkId || !coordinationArrangementId) {
      return;
    }
    return this.afd.object(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangementId )


  }

  public getCoordinationArrangementNonAlertMembersNetworkCountry(networkCountryId: string, coordinationArrangementId: string){
    if (!networkCountryId || !coordinationArrangementId) {
      return;
    }
    return this.afd.object(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkCountryId + '/' + coordinationArrangementId )


  }

  public saveCoordinationArrangement(countryId: string, coordinationArrangement: CoordinationArrangementModel): Promise<any>{
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
      return this.afd.object(Constants.APP_STATUS).update(equipmentData);
    }else{
      return this.afd.list(Constants.APP_STATUS + '/countryOfficeProfile/coordination/' + countryId).push(coordinationArrangement).then();
    }
  }

  public saveCoordinationArrangementLocalAgency(agencyId: string, coordinationArrangement: CoordinationArrangementModel): Promise<any>{
    if(!agencyId || !coordinationArrangement)
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    // Update the timestamp
    coordinationArrangement.updatedAt = new Date().getTime();

    if(coordinationArrangement.id)
    {
      const equipmentData = {};
      equipmentData['/localAgencyProfile/coordination/' + agencyId + '/' + coordinationArrangement.id] = coordinationArrangement;
      return this.afd.object(Constants.APP_STATUS).update(equipmentData);
    }else{
      return this.afd.list(Constants.APP_STATUS + '/localAgencyProfile/coordination/' + agencyId).push(coordinationArrangement).then();
    }
  }

  public saveCoordinationArrangementNetwork(networkId: string, coordinationArrangement: CoordinationArrangementNetworkModel, nonAlertMembers: string[]): Promise<any>{
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
      return this.afd.object(Constants.APP_STATUS).update(equipmentData)
        .then(( ) => {
              this.afd.object(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").remove()
              if(nonAlertMembers){
                nonAlertMembers.forEach( member => {
                  if(member){
                    this.afd.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").push({"name": member});
                  }
                })
              }

        });


    }else{
      return this.afd.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId).push(coordinationArrangement)
        .then((newCoordination => {
          if(nonAlertMembers){
              nonAlertMembers.forEach( member => {
                if(member){
                  this.afd.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + newCoordination.key + "/nonAlertMembers").push({"name": member});
                }
              })
            }
        }))

    }
  }

  public saveCoordinationArrangementNetworkCountry(networkId: string, coordinationArrangement: CoordinationArrangementNetworkModel, nonAlertMembers: string[]): Promise<any>{
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
      return this.afd.object(Constants.APP_STATUS).update(equipmentData)
        .then(( ) => {
          this.afd.object(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").remove()
          if(nonAlertMembers){
            nonAlertMembers.forEach( member => {
              if(member){
                this.afd.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").push({"name": member});
              }
            })
          }

        });


    }else{
      return this.afd.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkId).push(coordinationArrangement)
        .then((newCoordination => {
          if(nonAlertMembers){
            nonAlertMembers.forEach( member => {
              if(member){
                this.afd.list(Constants.APP_STATUS + '/networkCountryOfficeProfile/coordination/' + networkId + '/' + newCoordination.key + "/nonAlertMembers").push({"name": member});
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
            this.afd.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").push(member);
          }
        })
      }
    } else {
      nonAlertMembers.forEach( member => {
        if(member){
          this.afd.list(Constants.APP_STATUS + '/localNetworkProfile/coordination/' + networkId + '/' + coordinationArrangement.id + "/nonAlertMembers").push(member);
        }
      })
    }
  }

  public deleteCoordinationArrangement(countryId: string, coordinationArrangement: CoordinationArrangementModel): Promise<any>{
    if(!countryId || !coordinationArrangement || !coordinationArrangement.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    const coordinationArrangementData = {};

    coordinationArrangementData['/countryOfficeProfile/coordination/' + countryId + '/' + coordinationArrangement.id] = null;

    return this.afd.object(Constants.APP_STATUS).update(coordinationArrangementData);
  }

  public deleteCoordinationArrangementLocalAgency(agencyId: string, coordinationArrangement: CoordinationArrangementModel): Promise<any>{
    if(!agencyId || !coordinationArrangement || !coordinationArrangement.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    const coordinationArrangementData = {};

    coordinationArrangementData['/localAgencyProfile/coordination/' + agencyId + '/' + coordinationArrangement.id] = null;

    return this.afd.object(Constants.APP_STATUS).update(coordinationArrangementData);
  }

  public deleteCoordinationArrangementLocalNetwork(countryId: string, coordinationArrangement: CoordinationArrangementNetworkModel): Promise<any>{
    if(!countryId || !coordinationArrangement || !coordinationArrangement.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }

    const coordinationArrangementData = {};

    coordinationArrangementData['/localNetworkProfile/coordination/' + countryId + '/' + coordinationArrangement.id] = null;

    return this.afd.object(Constants.APP_STATUS).update(coordinationArrangementData);
  }

  public deleteCoordinationArrangementNetworkCountry(countryId: string, coordinationArrangement: CoordinationArrangementNetworkModel): Promise<any>{
    if(!countryId || !coordinationArrangement || !coordinationArrangement.id )
    {
      return Promise.reject('Missing countryId or coordinationArrangement');
    }


    const coordinationArrangementData = {};

    coordinationArrangementData['/networkCountryOfficeProfile/coordination/' + countryId + '/' + coordinationArrangement.id] = null;

    return this.afd.object(Constants.APP_STATUS).update(coordinationArrangementData);
  }
}
