import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Constants } from '../../../utils/Constants';
import { AlertMessageType } from '../../../utils/Enums';
import { RxHelper } from '../../../utils/RxHelper';
import {ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../model/alert-message.model';
import { PartnerOrganisationService } from '../../../services/partner-organisation.service';
import { PartnerOrganisationModel } from '../../../model/partner-organisation.model';
import { PartnerModel } from '../../../model/partner.model';
import { NotificationSettingsService } from '../../../services/notification-settings.service';
import { ModelUserPublic } from '../../../model/user-public.model';
import { UserService } from "../../../services/user.service";
import { CountryAdminModel } from "../../../model/country-admin.model";

@Component({
  selector: 'app-country-add-edit-partner',
  templateUrl: './country-add-edit-partner.component.html',
  styleUrls: ['./country-add-edit-partner.component.css'],
  providers: [PartnerOrganisationService, UserService, NotificationSettingsService]
})

export class CountryAddEditPartnerComponent implements OnInit {

  private isEdit: false;
  private uid: string;

  // Constants and enums
  private userTitle = Constants.PERSON_TITLE;
  private userTitleSelection = Constants.PERSON_TITLE_SELECTION;
  private notificationsSettingsSelection = Constants.NOTIFICATION_SETTINGS;
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private partner: PartnerModel;
  private partnerOrganisations: PartnerOrganisationModel[] = [];
  private userPublic: ModelUserPublic;
  private countryAdmin: CountryAdminModel;

  constructor(private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _notificationSettingsService: NotificationSettingsService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper ){
    this.partner = new PartnerModel();
    this.partnerOrganisations = [];
    this.userPublic = new ModelUserPublic(null, null, null, null); // no parameterless constructor
  }

  ngOnInit() {
    this._userService.getAuthUser().subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      try{
        this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {

          this.countryAdmin = countryAdminUser;

          this._partnerOrganisationService.getPartnerOrganisations()
            .subscribe(partnerOrganisations => { this.partnerOrganisations = partnerOrganisations; });

          this._notificationSettingsService.getNotificationSettings(Object.keys(this.countryAdmin.agencyAdmin)[0])
            .subscribe(notificationSettings => { this.partner.notificationSettings = notificationSettings });
          })
      }
      catch(err){ console.log(err); }
    })
  }

  validateForm(): boolean {
    this.alertMessage = this.partner.validate() || this.userPublic.validate(['city']);


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
      console.log('submit called');
      console.log(this.partner);

      if( !(this.partner.id || this.userPublic.id ) )
      {
        this._userService.createNewFirebaseUser(this.userPublic.email, Constants.TEMP_PASSWORD)
          .then(newUser => {
            this.partner.id = newUser.uid;
            this._userService.savePartnerUser(this.partner, this.userPublic)
              .then(user => {
                this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PARTNER.SUCCESS_SAVED', AlertMessageType.Success);
              })
              .catch(err => { this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'); });
          })
          .catch(err => {  this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'); });
      }else{
        this._userService.savePartnerUser(this.partner, this.userPublic)
          .then(user => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PARTNER.SUCCESS_SAVED', AlertMessageType.Success);
          })
          .catch(err => { this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'); });
      }
  }
}
