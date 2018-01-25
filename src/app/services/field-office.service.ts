import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {fieldOffice} from "../model/fieldOffice.model";
import {Constants} from "../utils/Constants";

@Injectable()
export class FieldOfficeService {

  constructor(private af: AngularFire) { }

  public getFieldOffices(countryId: string){
    return this.af.database.list(Constants.APP_STATUS + '/fieldOffice/' + countryId)
      .map(fieldOffices =>{
        console.log(fieldOffices)
        fieldOffices.forEach(office => {
          office.id = office.$key
        })
        return fieldOffices
      })
  }

  public getFieldOffice(countryId: string, fieldOfficeId: string){
    return this.af.database.object(Constants.APP_STATUS + '/fieldOffice/' + countryId + '/' + fieldOfficeId)
  }

  public addFieldOffice(fieldOffice: fieldOffice, countryId: string){
    return this.af.database.list(Constants.APP_STATUS + '/fieldOffice/' + countryId)
      .push(fieldOffice)
  }

  public updateFieldOffice(fieldOffice: fieldOffice, countryId: string){
    console.log(fieldOffice)
    return this.af.database.object(Constants.APP_STATUS + '/fieldOffice/' + countryId + '/' + fieldOffice.id)
      .update(fieldOffice)
  }

  public removeFieldOffice(countryId: string, fieldOfficeId: string){
    return this.af.database.object(Constants.APP_STATUS + '/fieldOffice/' + countryId + '/' + fieldOfficeId)
      .remove();
  }

}
