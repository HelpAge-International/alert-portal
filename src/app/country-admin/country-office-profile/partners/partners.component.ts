import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../utils/Constants';
import { AlertMessageType, ResponsePlanSectors } from '../../../utils/Enums';
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
import { CommonService } from "../../../services/common.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css'],
  providers: [PartnerOrganisationService]
})

export class CountryOfficePartnersComponent implements OnInit, OnDestroy {
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private agencyId: string;
  private countryId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  filterOrganisation = null;
  filterSector = null;
  filterLocation = null;
  
  PARTNER_STATUS = Constants.PARTNER_STATUS;
  RESPONSE_PLAN_SECTORS = ResponsePlanSectors;
  RESPONSE_PLAN_SECTORS_SELECTION = Constants.RESPONSE_PLANS_SECTORS;

  // Models
  private alertMessage: AlertMessageModel = null;
  private partners: PartnerModel[];
  private partnerOrganisations: PartnerOrganisationModel[] = [];
  private countryAdmin: CountryAdminModel;
  private areasOfOperation: string[];
  private countryLevelsValues: any;

  constructor(private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _commonService: CommonService,
              private _sessionService: SessionService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
    this.areasOfOperation = [];
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
                                .subscribe(partnerOrganisation => { this.partnerOrganisations[partner.partnerOrganisationId] = partnerOrganisation; });
                    }
                  })
                });

        // get the country levels values
        this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
          .subscribe(content => {
            this.countryLevelsValues = content;
            err => console.log(err);
          });
      });
    })
    this.subscriptions.add(authSubscription);
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-staff');
  }

  getAreasOfOperation(partnerOrganisation: PartnerOrganisationModel) {
    let areasOfOperation: string[] = [];
    if(partnerOrganisation && partnerOrganisation.projects && this.countryLevelsValues) {
      partnerOrganisation.projects.forEach(project => {
        project.operationAreas.forEach(location => { 
          const locationName = 
              this.countryLevelsValues[location.country]['levelOneValues'][location.level1]['levelTwoValues'][location.level2].value;
          areasOfOperation.push(locationName);
          if(!this.areasOfOperation.find(x => x == locationName))
          {
            this.areasOfOperation.push(locationName);
            this.areasOfOperation.sort();
          }
        });
      })
      return areasOfOperation.join(',');
    }
  }

  editPartners() {
    this.isEdit = true;
  }

  showPartners() {
    this.isEdit = false;
  }

  addPartnerOrganisation() {
    this.router.navigateByUrl('/response-plans/add-partner-organisation');
  }

  editPartnerOrganisation(partnerOrganisationId) {
    this.router.navigate(['/response-plans/add-partner-organisation', {id: partnerOrganisationId}]);
  }

  hideFilteredPartners(partner: PartnerModel): boolean{
    let hide = false;

    if(!partner) { return hide; }
        
    if(this.filterOrganisation && this.filterOrganisation != "null" && partner.partnerOrganisationId !== this.filterOrganisation){
      hide = true;
   }

   if(this.filterSector && this.filterSector != "null" 
            && !this.hasOrganisationProjectSector(this.partnerOrganisations[partner.partnerOrganisationId], this.filterSector)){
      hide = true;
   }

   if(this.filterLocation && this.filterLocation != "null" && !this.hasAreaOfOperation(partner, this.filterLocation)) {
     hide = true;
   }

    return hide;
  }

  private hasOrganisationProjectSector(partnerOrganisation: PartnerOrganisationModel, sector: string): boolean {
    let exists = false;
    partnerOrganisation.projects.forEach(project => {
      Object.keys(project.sector).forEach(key => {
        if(key == sector && project.sector[key])
        {
           exists = true;
        }
      });
    })
    return exists;
  }

  private hasAreaOfOperation(partner: PartnerModel, locationName: string): boolean {
    let exists = false;
    
    let areasOfOperation = this.getAreasOfOperation(this.partnerOrganisations[partner.partnerOrganisationId]);

    if(areasOfOperation.search(locationName) !== -1)
    {
      exists = true;
    }

    return exists;
  }
}
