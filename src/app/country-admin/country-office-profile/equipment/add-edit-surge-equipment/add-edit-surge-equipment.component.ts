import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Constants} from "../../../../utils/Constants";
import {AlertMessageType} from "../../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import {UserService} from "../../../../services/user.service";
import {EquipmentService} from "../../../../services/equipment.service";
import {SurgeEquipmentModel} from "../../../../model/equipment-surge.model";
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
  private agencyId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private surgeEquipment: SurgeEquipmentModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

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
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice;
  }

  initLocalAgency(){
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;


      this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
        if (params['id']) {
          this._equipmentService.getSurgeEquipmentLocalAgency(this.agencyId, params['id'])
            .takeUntil(this.ngUnsubscribe)
            .subscribe(equipment => {
              this.surgeEquipment = equipment;
            });
        }
      });
    })
  }

  initCountryOffice(){
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryId = countryId;


      this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
        if (params['id']) {
          this._equipmentService.getSurgeEquipment(this.countryId, params['id'])
            .takeUntil(this.ngUnsubscribe)
            .subscribe(equipment => {
              this.surgeEquipment = equipment;
            });
        }
      });
    })
  }

  validateForm(): boolean {
    this.alertMessage = this.surgeEquipment.validate();

    return !this.alertMessage;
  }

  submit() {
    if(this.isLocalAgency){
      this._equipmentService.saveSurgeEquipmentLocalAgency(this.agencyId, this.surgeEquipment)
        .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SURGE_SUCCESS_SAVED', AlertMessageType.Success);
            setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
          },
          err => {
            if (err instanceof DisplayError) {
              this.alertMessage = new AlertMessageModel(err.message);
            } else {
              this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
          });
    }else{
      this._equipmentService.saveSurgeEquipment(this.countryId, this.surgeEquipment)
        .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SURGE_SUCCESS_SAVED', AlertMessageType.Success);
            setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
          },
          err => {
            if (err instanceof DisplayError) {
              this.alertMessage = new AlertMessageModel(err.message);
            } else {
              this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
          });
    }

  }

  goBack() {
    if(this.isLocalAgency){
      this.router.navigateByUrl('/local-agency/profile/equipment');
    }else{
      this.router.navigateByUrl('/country-admin/country-office-profile/equipment');
    }
  }

  deleteEquipment() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

    if(this.isLocalAgency){
      this._equipmentService.deleteSurgeEquipmentLocalAgency(this.agencyId, this.surgeEquipment)
        .then(() => {
          this.goBack();
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SURGE_SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
    }else{
      this._equipmentService.deleteSurgeEquipment(this.countryId, this.surgeEquipment)
        .then(() => {
          this.goBack();
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SURGE_SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
    }
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }
}
