import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {Observable} from 'rxjs';

import {PartnerOrganisationModel} from "../model/partner-organisation.model";

@Injectable()
export class PartnerOrganisationService {

  constructor(private af: AngularFire) {
  }

  getPartnerOrganisations(): Observable<PartnerOrganisationModel[]> {

    const partnerOrganisationsSubscription = this.af.database.list(Constants.APP_STATUS + '/partnerOrganisation')
      .map(items => {
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
    if (!id) {
      return null;
    }
    const partnerOrganisationSubscription = this.af.database.object(Constants.APP_STATUS + '/partnerOrganisation/' + id)
      .map(item => {
        if (item.$key) {
          let partnerOrganisation = new PartnerOrganisationModel();
          partnerOrganisation.id = id;
          partnerOrganisation.mapFromObject(item);

          return partnerOrganisation;
        }
        return null;
      });

    return partnerOrganisationSubscription;
  }

  savePartnerOrganisation(partnerOrganisation: PartnerOrganisationModel): firebase.Promise<any> {
    if (partnerOrganisation.id) {
      return this.af.database.object(Constants.APP_STATUS + '/partnerOrganisation' + partnerOrganisation.id).update(partnerOrganisation);
    } else {
      return this.af.database.list(Constants.APP_STATUS + '/partnerOrganisation').push(partnerOrganisation);
    }
  }
}
