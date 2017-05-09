import {Component, OnInit} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Router} from '@angular/router';
import {Constants} from '../../../utils/Constants';
import {RxHelper} from '../../../utils/RxHelper';

import { PartnerOrganisationService } from '../../../services/partner-organisation.service';
import { PartnerOrganisationModel } from '../../../model/partner-organisation.model';

@Component({
  selector: 'app-country-add-edit-partner',
  templateUrl: './country-add-edit-partner.component.html',
  styleUrls: ['./country-add-edit-partner.component.css'],
  providers: [PartnerOrganisationService]
})

export class CountryAddEditPartnerComponent implements OnInit {

  private isEdit: false;

  // Constants and enum definitions
  private userTitle = Constants.PERSON_TITLE;
  private userTitleSelection = Constants.PERSON_TITLE_SELECTION;

  // Models
  private partnerOrganisations: PartnerOrganisationModel[] = [];

  constructor(private _partnerOrganisationService: PartnerOrganisationService) { }

  ngOnInit() {
    this._partnerOrganisationService.getPartnerOrganisations()
        .subscribe(partnerOrganisations => { this.partnerOrganisations = partnerOrganisations; });
  }

}
