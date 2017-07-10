import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../../utils/Constants";
import {AlertMessageType} from "../../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import {UserService} from "../../../../services/user.service";
import {EquipmentService} from "../../../../services/equipment.service";
import {EquipmentModel} from "../../../../model/equipment.model";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-add-edit-equipment',
  templateUrl: './add-edit-equipment.component.html',
  styleUrls: ['./add-edit-equipment.component.css'],
})

export class CountryOfficeAddEditEquipmentComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private equipment: EquipmentModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _equipmentService: EquipmentService,
              private router: Router,
              private route: ActivatedRoute) {
    this.equipment = new EquipmentModel();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;

      this.countryId = countryId;

      // this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
      //   this.countryId = countryAdminUser.countryId;

      this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
        if (params['id']) {
          this._equipmentService.getEquipment(this.countryId, params['id'])
            .takeUntil(this.ngUnsubscribe)
            .subscribe(equipment => {
              this.equipment = equipment;
            });
        }
      });
      // });
    })
  }

  validateForm(): boolean {
    this.alertMessage = this.equipment.validate();

    return !this.alertMessage;
  }

  submit() {
    this._equipmentService.saveEquipment(this.countryId, this.equipment)
      .then(() => {
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SUCCESS_SAVED', AlertMessageType.Success);
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

  goBack() {
    this.router.navigateByUrl('/country-admin/country-office-profile/equipment');
  }

  deleteEquipment() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

    this._equipmentService.deleteEquipment(this.countryId, this.equipment)
      .then(() => {
        this.goBack();
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }
}
