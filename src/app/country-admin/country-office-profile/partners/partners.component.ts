import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../utils/Constants';
import { AlertMessageType } from '../../../utils/Enums';
import { RxHelper } from '../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../model/alert-message.model';
import { PartnerOrganisationService } from '../../../services/partner-organisation.service';
import { PartnerOrganisationModel } from '../../../model/partner-organisation.model';
import { PartnerModel } from '../../../model/partner.model';
import { ModelUserPublic } from '../../../model/user-public.model';
import { UserService } from "../../../services/user.service";
import { CountryAdminModel } from "../../../model/country-admin.model";
import { DisplayError } from "../../../errors/display.error";
import { SessionService } from "../../../services/session.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css'],
  providers: [PartnerOrganisationService]
})

export class CountryOfficePartnersComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyId: string;
  private countryId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private partners: PartnerModel[];
  private partnerOrganisations: PartnerOrganisationModel[] = [];
  private countryAdmin: CountryAdminModel;

  constructor(private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _sessionService: SessionService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
    //this.partners = [];
    this.partnerOrganisations = [];
  }

  ngOnDestroy() {
    this._sessionService.partner = null;
    this._sessionService.user = null;
    this.subscriptions.releaseAll();
  }

  ngOnInit() {
    const authSubscription = this._userService.getAuthUser().subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {

        this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];
        this.countryId = countryAdminUser.countryId;

        this._userService.getCountryOfficePartnerUsers(this.agencyId, this.countryId)
                .subscribe(partners => {
                  this.partners = partners;
                  this.partners.forEach(partner => {
                    if( !this.partnerOrganisations.find( x => x.id == partner.partnerOrganisationId))
                    {
                      this._partnerOrganisationService.getPartnerOrganisation(partner.partnerOrganisationId)
                                .subscribe(partnerOrganisation => { this.partnerOrganisations[partner.partnerOrganisationId] = partnerOrganisation; })
                    }
                  })
                });
        });
    })
    this.subscriptions.add(authSubscription);
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-staff');
  }
}
