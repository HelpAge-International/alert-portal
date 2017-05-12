import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";
import { AlertMessageType, ResponsePlanSectors, Country } from "../../utils/Enums";

import { PartnerOrganisationService } from "../../services/partner-organisation.service";
import { UserService } from "../../services/user.service";
import { AlertMessageModel } from '../../model/alert-message.model';
import { PartnerOrganisationModel, PartnerOrganisationProjectModel } from '../../model/partner-organisation.model';
import { ModelUserPublic } from '../../model/user-public.model';
import { CommonService } from "../../services/common.service";

@Component({
  selector: 'app-add-partner-organisation',
  templateUrl: './add-partner-organisation.component.html',
  styleUrls: ['./add-partner-organisation.component.css'],
  providers: [PartnerOrganisationService, UserService, CommonService]
})

export class AddPartnerOrganisationComponent implements OnInit, OnDestroy {

  private uid: string;

  // Constants and enums
  alertMessageType = AlertMessageType;
  responsePlansSectors = ResponsePlanSectors;
  responsePlansSectorsSelection = Constants.RESPONSE_PLANS_SECTORS;
  countryEnum = Country;


  // Models
  private alertMessage: AlertMessageModel = null;
  private partnerOrganisation: PartnerOrganisationModel;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];

  constructor( private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _commonService: CommonService,
              private router: Router,
              private subscriptions: RxHelper) {
                this.partnerOrganisation = new PartnerOrganisationModel();
  }

  ngOnInit() {
    const authSubscription = this._userService.getAuthUser().subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      // get the country levels
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_FILE)
        .subscribe(content => { this.countryLevels = content; console.log(content),
                        err => console.log(err); });

      // get the country levels values
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
        .subscribe(content => { this.countryLevelsValues = content; console.log(content),
                        err => console.log(err); });

    });
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  
  validateForm(): boolean {
    this.alertMessage = this.partnerOrganisation.validate();


    /*
    *  Specific component validation BELOW
    *
    * if(this.partner.projectName === this.userPublic.firstName  )
    * {
    *   this.alertMessage = new AlertMessageModel('ERROR message');
    * }
    */

    return !this.alertMessage;
  }

  submit() {
  }

  goBack() {
    this.router.navigateByUrl('response-plans/create-edit-response-plan');
  }

  // TO DELETE
  areaChanged(){
    console.log(this.partnerOrganisation);
  }
}
