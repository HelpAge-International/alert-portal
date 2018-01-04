import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable, Subject} from 'rxjs';
import {PointOfContactModel} from '../model/point-of-contact.model';

@Injectable()
export class ContactService {

  constructor(private af: AngularFire) { }

    public getPointsOfContact(countryId: string): Observable<PointOfContactModel[]> {
      if (!countryId) {
        return;
      }

      const getPointsOfContactSubscription = this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/contacts/' + countryId)
      .map(items => {
        const pointsOfContact: PointOfContactModel[] = [];
        items.forEach(item => {
          let pointOfContact = new PointOfContactModel();
          pointOfContact.mapFromObject(item);
          pointOfContact.id = item.$key;
          pointsOfContact.push(pointOfContact);
        });
        return pointsOfContact;
      });

    return getPointsOfContactSubscription;
  }

  public getPointsOfContactLocalAgency(agencyId: string): Observable<PointOfContactModel[]> {
    if (!agencyId) {
      return;
    }

    const getPointsOfContactSubscription = this.af.database.list(Constants.APP_STATUS + '/localAgencyProfile/contacts/' + agencyId)
      .map(items => {
        const pointsOfContact: PointOfContactModel[] = [];
        items.forEach(item => {
          let pointOfContact = new PointOfContactModel();
          pointOfContact.mapFromObject(item);
          pointOfContact.id = item.$key;
          pointsOfContact.push(pointOfContact);
        });
        return pointsOfContact;
      });

    return getPointsOfContactSubscription;
  }

  public getPointOfContact(countryId: string, pointOfContactId: string): Observable<PointOfContactModel> {
      if (!countryId || !pointOfContactId) {
        return;
      }

      const getPointsOfContactubscription =
              this.af.database.object(Constants.APP_STATUS + '/countryOfficeProfile/contacts/' + countryId + '/' + pointOfContactId)
      .map(item => {
        let pointOfContact = new PointOfContactModel();
        pointOfContact.mapFromObject(item);
        pointOfContact.id = item.$key;
        return pointOfContact;
      });

    return getPointsOfContactubscription;
  }

  public getPointOfContactLocalAgency(agencyId: string, pointOfContactId: string): Observable<PointOfContactModel> {
    if (!agencyId || !pointOfContactId) {
      return;
    }

    const getPointsOfContactubscription =
      this.af.database.object(Constants.APP_STATUS + '/localAgencyProfile/contacts/' + agencyId + '/' + pointOfContactId)
        .map(item => {
          let pointOfContact = new PointOfContactModel();
          pointOfContact.mapFromObject(item);
          pointOfContact.id = item.$key;
          return pointOfContact;
        });

    return getPointsOfContactubscription;
  }

  public savePointOfContact(countryId: string, pointOfContact: PointOfContactModel): firebase.Promise<any>{
    if(!countryId || !pointOfContact)
    {
      return Promise.reject('Missing countryId or point of contact');
    }

    // Update the timestamp
    pointOfContact.updatedAt = new Date().getTime();

    if(pointOfContact.id)
    {
      const pointOfContactData = {};

      pointOfContactData['/countryOfficeProfile/contacts/' + countryId + '/' + pointOfContact.id] = pointOfContact;

      return this.af.database.object(Constants.APP_STATUS).update(pointOfContactData);
    }else{
      return this.af.database.list(Constants.APP_STATUS + '/countryOfficeProfile/contacts/' + countryId).push(pointOfContact);
    }
  }

  public savePointOfContactLocalAgency(agencyId: string, pointOfContact: PointOfContactModel): firebase.Promise<any>{
    if(!agencyId || !pointOfContact)
    {
      return Promise.reject('Missing countryId or point of contact');
    }

    // Update the timestamp
    pointOfContact.updatedAt = new Date().getTime();

    if(pointOfContact.id)
    {
      const pointOfContactData = {};

      pointOfContactData['/localAgencyProfile/contacts/' + agencyId + '/' + pointOfContact.id] = pointOfContact;

      return this.af.database.object(Constants.APP_STATUS).update(pointOfContactData);
    }else{
      return this.af.database.list(Constants.APP_STATUS + '/localAgencyProfile/contacts/' + agencyId).push(pointOfContact);
    }
  }

  public deletePointOfContact(countryId: string, pointOfContact: PointOfContactModel): firebase.Promise<any>{
    if(!countryId || !pointOfContact || !pointOfContact.id )
    {
      return Promise.reject('Missing countryId or pointOfContact');
    }

    const pointOfContactData = {};

    pointOfContactData['/countryOfficeProfile/contacts/' + countryId + '/' + pointOfContact.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(pointOfContactData);
 }

  public deletePointOfContactLocalAgency(agencyId: string, pointOfContact: PointOfContactModel): firebase.Promise<any>{
    if(!agencyId || !pointOfContact || !pointOfContact.id )
    {
      return Promise.reject('Missing countryId or pointOfContact');
    }

    const pointOfContactData = {};

    pointOfContactData['/localAgencyProfile/contacts/' + agencyId + '/' + pointOfContact.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(pointOfContactData);
  }
}
