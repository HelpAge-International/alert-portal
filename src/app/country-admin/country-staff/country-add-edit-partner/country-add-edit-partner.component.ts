import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../../../utils/Constants';
import {AlertMessageType} from '../../../utils/Enums';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {AlertMessageModel} from '../../../model/alert-message.model';
import {PartnerOrganisationService} from '../../../services/partner-organisation.service';
import {PartnerOrganisationModel} from '../../../model/partner-organisation.model';
import {PartnerModel} from '../../../model/partner.model';
import {NotificationSettingsService} from '../../../services/notification-settings.service';
import {ModelUserPublic} from '../../../model/user-public.model';
import {UserService} from "../../../services/user.service";
import {CountryAdminModel} from "../../../model/country-admin.model";
import {DisplayError} from "../../../errors/display.error";
import {SessionService} from "../../../services/session.service";
import {Subject} from "rxjs";
declare var jQuery: any;

@Component({
  selector: 'app-country-add-edit-partner',
  templateUrl: './country-add-edit-partner.component.html',
  styleUrls: ['./country-add-edit-partner.component.css'],
  providers: [PartnerOrganisationService, NotificationSettingsService, UserService]
})

export class CountryAddEditPartnerComponent implements OnInit, OnDestroy {

  private isEdit = false;
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

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _notificationSettingsService: NotificationSettingsService,
              private _sessionService: SessionService,
              private router: Router,
              private route: ActivatedRoute) {
    this.partner = this._sessionService.partner || new PartnerModel();
    this.partnerOrganisations = [];
    this.userPublic = this._sessionService.user || new ModelUserPublic(null, null, null, null); // no parameterless constructor
  }

  ngOnDestroy() {
    this._sessionService.partner = null;
    this._sessionService.user = null;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this._userService.getAuthUser().takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      try {
        this._userService.getCountryAdminUser(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(countryAdminUser => {

            this.countryAdmin = countryAdminUser;

            this._partnerOrganisationService.getPartnerOrganisations()
              .takeUntil(this.ngUnsubscribe)
              .subscribe(partnerOrganisations => {
                this.partnerOrganisations = partnerOrganisations;
              });

            this.route.params
              .takeUntil(this.ngUnsubscribe)
              .subscribe((params: Params) => {
                if (params['id']) {
                  this.isEdit = true;

                  this._userService.getUser(params['id'])
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(user => {
                      if (user) {
                        if (user) {
                          this.userPublic = user;
                        }
                      }
                    });

                  this._userService.getPartnerUser(params['id'])
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(partner => {
                      if (partner) {
                        if (partner) {
                          this.partner = partner;
                        }
                      }
                    });
                } else {
                  this._notificationSettingsService.getNotificationSettings(Object.keys(this.countryAdmin.agencyAdmin)[0])
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(notificationSettings => {
                      this.partner.notificationSettings = notificationSettings
                    });
                }
              })
          });
      }
      catch (err) {
        console.log(err);
      }
    })
  }


  setPartnerOrganisation(optionSelected) {
    if (optionSelected === 'addNewPartnerOrganisation') {
      this.router.navigateByUrl('response-plans/add-partner-organisation');
    }
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
    this._userService.savePartnerUser(this.partner, this.userPublic)
      .then(user => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PARTNER.SUCCESS_SAVED', AlertMessageType.Success);
        setTimeout(() => this.router.navigateByUrl('/country-admin/country-staff'), Constants.ALERT_REDIRECT_DURATION);
      })
      .catch(err => {
        if (err instanceof DisplayError) {
          this.alertMessage = new AlertMessageModel(err.message);
        } else {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
        }
      });
  }

  deletePartner() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();
    this._userService.deletePartnerUser(this.partner.id)
      .then(() => {
        this.router.navigateByUrl('/country-admin/country-staff');
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PARTNER.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-staff');
  }
}
