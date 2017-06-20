import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../../utils/Constants';
import { AlertMessageType } from '../../../../utils/Enums';
import { RxHelper } from '../../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../../model/alert-message.model';
import { DisplayError } from "../../../../errors/display.error";
import { UserService } from "../../../../services/user.service";
import { EquipmentService } from "../../../../services/equipment.service";
import { SurgeEquipmentModel } from "../../../../model/equipment-surge.model";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-add-edit-surge-equipment',
  templateUrl: './add-edit-surge-equipment.component.html',
  styleUrls: ['./add-edit-surge-equipment.component.css'],
})

export class CountryOfficeAddEditSurgeEquipmentComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private surgeEquipment: SurgeEquipmentModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _equipmentService: EquipmentService,
              private router: Router,
              private route: ActivatedRoute) {
                this.surgeEquipment = new SurgeEquipmentModel();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;

      this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
        this.countryId = countryAdminUser.countryId;

        const editSubscription = this.route.params.subscribe((params: Params) => {
              if (params['id']) {
                this._equipmentService.getSurgeEquipment(this.countryId, params['id'])
                      .subscribe(equipment => { this.surgeEquipment = equipment; });
              }
        });
      });
    })
  }

  validateForm(): boolean {
    this.alertMessage = this.surgeEquipment.validate();

    return !this.alertMessage;
  }

  submit() {
      this._equipmentService.saveSurgeEquipment(this.countryId, this.surgeEquipment)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SURGE_SUCCESS_SAVED', AlertMessageType.Success);
              setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
            },
            err =>
            {
              if(err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              }else{
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-office-profile/equipment');
  }

  deleteEquipment() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

    this._equipmentService.deleteSurgeEquipment(this.countryId, this.surgeEquipment)
      .then(() => {
        this.goBack();
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SURGE_SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
 }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }
}
