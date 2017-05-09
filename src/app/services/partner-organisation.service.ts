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

    const partnerOrganisationSubscription = this.af.database.list(Constants.APP_STATUS + '/partnerOrganisation')
      .map(items =>
        {
            let partnerOrganisations: PartnerOrganisationModel[] = [];
            items.forEach(item => { 
              // Add the organisation ID
              let partnerOrganisation = item as PartnerOrganisationModel;
              partnerOrganisation.id = item.$key;

              partnerOrganisations.push(item as PartnerOrganisationModel);
            });
            return partnerOrganisations;
        });

    return partnerOrganisationSubscription;
  }
}