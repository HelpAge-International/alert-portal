import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable} from 'rxjs';

import { PartnerOrganisationModel } from "../model/partner-organisation.model";

@Injectable()
export class PartnerOrganisationService {

  constructor(private af: AngularFire, private subscriptions: RxHelper) {}

  getCountryOfficePartnerOrganisations(agencyId: string, countryId: string): Observable<PartnerOrganisationModel[]> {
     let partnerOrganisationsList: PartnerOrganisationModel[] = [];
     const partnerOrganisationSubscription =
          this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/partnerOrganisations')
      .flatMap(partnerOrganisations => {
        return Observable.from(partnerOrganisations.map(organisation => organisation.$key));
        })
      .flatMap( organisationId => {
        return this.getPartnerOrganisation(organisationId as string);
      })
      .map( organisation => {
        partnerOrganisationsList.push(organisation);
        return partnerOrganisationsList;
      })

      return partnerOrganisationSubscription;
  }

  getPartnerOrganisations(): Observable<PartnerOrganisationModel[]> {

    const partnerOrganisationsSubscription = this.af.database.list(Constants.APP_STATUS + '/partnerOrganisation')
      .map(items =>
        {
            let partnerOrganisations: PartnerOrganisationModel[] = [];
            items.forEach(item => {
              // Add the organisation ID
              let partnerOrganisation = item as PartnerOrganisationModel;
              partnerOrganisation.id = item.$key;

              partnerOrganisations.push(partnerOrganisation);
            });
            return partnerOrganisations;
        });

    return partnerOrganisationsSubscription;
  }

  getPartnerOrganisation(id: string): Observable<PartnerOrganisationModel> {
    if(!id) { return null; }
    const partnerOrganisationSubscription = this.af.database.object(Constants.APP_STATUS + '/partnerOrganisation/' + id)
      .map(item => {
        if(item.$key) {
          let partnerOrganisation = new PartnerOrganisationModel();
          partnerOrganisation.id = id;
          partnerOrganisation.mapFromObject(item);

          return partnerOrganisation;
        }
        return null;
    });

    return partnerOrganisationSubscription;
  }

  savePartnerOrganisation(agencyId: string, countryId: string, partnerOrganisation: PartnerOrganisationModel): firebase.Promise<any>{
    if(!agencyId || !countryId)
    {
      throw new Error('Missing agencyId or countryId');
    }

    partnerOrganisation.modifiedAt = new Date().getTime();

    if(partnerOrganisation.id)
    {
      const partnerOrganisationData = {};

      // Add partner organisation to the countryOffice
      partnerOrganisationData['/countryOffice/' + agencyId + '/' + countryId + '/partnerOrganisations/' + partnerOrganisation.id] = true;

      partnerOrganisationData['/partnerOrganisation/' + partnerOrganisation.id] = partnerOrganisation;

      return this.af.database.object(Constants.APP_STATUS).update(partnerOrganisationData);
    } else {
      return this.af.database.list(Constants.APP_STATUS + '/partnerOrganisation').push(partnerOrganisation).then(organisation => {
        // update organisation Id
        partnerOrganisation.id = organisation.key;

        return this.savePartnerOrganisation(agencyId, countryId, partnerOrganisation);
      });
    }
  }

  deletePartnerOrganisation(agencyId: string, countryId: string, partnerOrganisation: PartnerOrganisationModel): firebase.Promise<any>{
    if (!partnerOrganisation) {
      throw new Error('Organisation not present');
    }
    const partnerOrganisationData = {};

    // Remove all partners associated with this partner organisation
    Object.keys(partnerOrganisation.partners).forEach(key => {
      partnerOrganisationData['/partner/' + key] = null;
    });

    // Remove the partner organisation from the country office
    partnerOrganisationData['/countryOffice/' + agencyId + '/' + countryId + '/partnerOrganisations/' + partnerOrganisation.id] = null;

    partnerOrganisationData['/partnerOrganisation/' + partnerOrganisation.id] = null;

    return this.af.database.object(Constants.APP_STATUS).update(partnerOrganisationData);
  }
}
