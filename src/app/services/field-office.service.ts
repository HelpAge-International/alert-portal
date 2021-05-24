import { Injectable } from '@angular/core';
import {AngularFireDatabase, SnapshotAction} from "@angular/fire/database";
import {fieldOffice} from "../model/fieldOffice.model";
import {Constants} from "../utils/Constants";

@Injectable()
export class FieldOfficeService {

  constructor(private afd: AngularFireDatabase) { }

  public getFieldOffices(countryId: string){
    return this.afd.list(Constants.APP_STATUS + '/fieldOffice/' + countryId)
      .snapshotChanges()
      .map((fieldOfficesSnaps: SnapshotAction<fieldOffice>[]) =>{
        return fieldOfficesSnaps.map(officeSnap => {
          const office = officeSnap.payload.val()
          office.id = officeSnap.key
          return office
        })
      })
  }

  public getFieldOffice(countryId: string, fieldOfficeId: string){
    return this.afd.object(Constants.APP_STATUS + '/fieldOffice/' + countryId + '/' + fieldOfficeId).valueChanges()
  }

  public addFieldOffice(fieldOffice: fieldOffice, countryId: string){
    return this.afd.list(Constants.APP_STATUS + '/fieldOffice/' + countryId)
      .push(fieldOffice)
  }

  public updateFieldOffice(fieldOffice: fieldOffice, countryId: string){
    console.log(fieldOffice)
    return this.afd.object(Constants.APP_STATUS + '/fieldOffice/' + countryId + '/' + fieldOffice.id)
      .update(fieldOffice)
  }

  public removeFieldOffice(countryId: string, fieldOfficeId: string){
    return this.afd.object(Constants.APP_STATUS + '/fieldOffice/' + countryId + '/' + fieldOfficeId)
      .remove();
  }

}
