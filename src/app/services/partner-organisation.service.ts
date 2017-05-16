import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable} from 'rxjs';

import { PartnerOrganisationModel } from "../model/partner-organisation.model";

@Injectable()
export class PartnerOrganisationService {

  constructor(private af: AngularFire, private subscriptions: RxHelper) {}

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
          return item as PartnerOrganisationModel; 
        }
        return null;
    });

    return partnerOrganisationSubscription;
  }

  savePartnerOrganisation(partnerOrganisation: PartnerOrganisationModel): firebase.Promise<any>{
    return this.af.database.list(Constants.APP_STATUS + '/partnerOrganisation').push(partnerOrganisation);
  }
}