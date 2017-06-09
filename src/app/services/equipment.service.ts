import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import { EquipmentModel } from "../model/equipment.model";
import { SurgeEquipmentModel } from "../model/equipment-surge.model";

@Injectable()
export class EquipmentService {

  constructor(private af: AngularFire) { }

    public getEquipments(countryId: string): Observable<EquipmentModel[]> {
      if (!countryId) {
        return;
      }

      const getEquipmentsSubscription = this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/equipment/' + countryId)
      .map(items => {
        const equipments: EquipmentModel[] = [];
        items.forEach(item => {
          let equipment = new EquipmentModel();
          equipment.mapFromObject(item);
          equipment.id = item.$key;
          equipments.push(equipment);
        });
        return equipments;
      });

    return getEquipmentsSubscription;
  }

   public getEquipment(countryId: string, equipmentId: string): Observable<EquipmentModel> {
      if (!countryId || !equipmentId) {
        return;
      }

      const getEquipmentSubscription = this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/equipment/' + countryId + '/' + equipmentId)
      .map(item => {
        let equipment = new EquipmentModel();
        equipment.mapFromObject(item);
        equipment.id = item.$key;
        return equipment;
      });

    return getEquipmentSubscription;
  }

  public saveEquipment(countryId: string, equipment: EquipmentModel): firebase.Promise<any>{
    if(!countryId || !equipment)
    {
      return Promise.reject('Missing countryId or equipment');
    }
    
    // Update the timestamp
    equipment.updatedAt = new Date().getTime();
    
    if(equipment.id)
    {
      const equipmentData = {};
      equipmentData['/countryOfficeProfile/equipment/' + countryId + '/' + equipment.id] = equipment;
      return this.af.database.object(Constants.APP_STATUS).update(equipmentData);
    }else{
      return this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/equipment/' + countryId).push(equipment);
    }
  }

  public deleteEquipment(countryId: string, equipment: EquipmentModel): firebase.Promise<any>{
    if(!countryId || !equipment || !equipment.id )
    {
      return Promise.reject('Missing countryId or equipment');
    }

    const equipmentData = {};

    equipmentData['/countryOfficeProfile/equipment/' + countryId + '/' + equipment.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(equipmentData);
  }

  public getSurgeEquipments(countryId: string): Observable<SurgeEquipmentModel[]> {
      if (!countryId) {
        return;
      }

      const getSurgeEquipmentSubscription = this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/surgeEquipment/' + countryId)
      .map(items => {
        const equipments: SurgeEquipmentModel[] = [];
        items.forEach(item => {
          let equipment = new SurgeEquipmentModel();
          equipment.mapFromObject(item);
          equipment.id = item.$key;
          equipments.push(equipment);
        });
        return equipments;
      });

    return getSurgeEquipmentSubscription;
  }
  
   public getSurgeEquipment(countryId: string, surgeEquipmentId: string): Observable<SurgeEquipmentModel> {
      if (!countryId || !surgeEquipmentId) {
        return;
      }

      const getSurgeEquipmentSubscription = this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/surgeEquipment/' + countryId + '/' + surgeEquipmentId)
      .map(item => {
        let equipment = new SurgeEquipmentModel();
        equipment.mapFromObject(item);
        equipment.id = item.$key;
        return equipment;
      });

    return getSurgeEquipmentSubscription;
  }

  public saveSurgeEquipment(countryId: string, surgeEquipment: SurgeEquipmentModel): firebase.Promise<any>{
    if(!countryId || !surgeEquipment)
    {
      return Promise.reject('Missing countryId or surge equipment');
    }
    
    // Update the timestamp
    surgeEquipment.updatedAt = new Date().getTime();
    
    if(surgeEquipment.id)
    {
      const surgeEquipmentData = {};
      surgeEquipmentData['/countryOfficeProfile/surgeEquipment/' + countryId + '/' + surgeEquipment.id] = surgeEquipment;
      return this.af.database.object(Constants.APP_STATUS).update(surgeEquipmentData);
    }else{
      return this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/surgeEquipment/' + countryId).push(surgeEquipment);
    }
  }

  public deleteSurgeEquipment(countryId: string, surgeEquipment: SurgeEquipmentModel): firebase.Promise<any>{
    if(!countryId || !surgeEquipment || !surgeEquipment.id )
    {
      return Promise.reject('Missing countryId or surgeEquipment');
    }
    
    const surgeEquipmentData = {};

    surgeEquipmentData['/countryOfficeProfile/surgeEquipment/' + countryId + '/' + surgeEquipment.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(surgeEquipmentData);
  }
}
