import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";

import { PartnerOrganisationService } from "../../services/partner-organisation.service";
import { UserService } from "../../services/user.service";
import { AlertMessageModel } from '../../model/alert-message.model';
import { PartnerOrganisationModel, PartnerOrganisationProjectModel } from '../../model/partner-organisation.model';
import { ModelUserPublic } from '../../model/user-public.model';
import { AlertMessageType } from "../../utils/Enums";

@Component({
  selector: 'app-add-partner-organisation',
  templateUrl: './add-partner-organisation.component.html',
  styleUrls: ['./add-partner-organisation.component.css'],
  providers: [PartnerOrganisationService, UserService]
})

export class AddPartnerOrganisationComponent implements OnInit, OnDestroy {

  private uid: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;


  // Models
  private alertMessage: AlertMessageModel = null;
  private partnerOrganisation: PartnerOrganisationModel;

  constructor( private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
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

}
