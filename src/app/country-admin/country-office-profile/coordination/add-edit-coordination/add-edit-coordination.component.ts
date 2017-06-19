import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../../utils/Constants';
import { AlertMessageType, ResponsePlanSectors } from '../../../../utils/Enums';
import { RxHelper } from '../../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../../model/alert-message.model';
import { DisplayError } from "../../../../errors/display.error";
import { UserService } from "../../../../services/user.service";
import { EquipmentService } from "../../../../services/equipment.service";
import { EquipmentModel } from "../../../../model/equipment.model";
import { CoordinationArrangementService } from "../../../../services/coordination-arrangement.service";
import { CoordinationArrangementModel } from "../../../../model/coordination-arrangement.model";
import { ModelStaff } from "../../../../model/staff.model";
import { AgencyService } from "../../../../services/agency-service.service";
import { ModelAgency } from "../../../../model/agency.model";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-add-edit-coordination',
  templateUrl: './add-edit-coordination.component.html',
  styleUrls: ['./add-edit-coordination.component.css'],
})

export class CountryOfficeAddEditCoordinationComponent implements OnInit, OnDestroy {
  private uid: string;
  private countryId: string;
  private agencyId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  responsePlansSectors = ResponsePlanSectors;
  responsePlansSectorsSelection = Constants.RESPONSE_PLANS_SECTORS;
  
  // Models
  private alertMessage: AlertMessageModel = null;
  private coordinationArrangement: CoordinationArrangementModel;
  private staffList: ModelStaff[];
  private staffNamesList: any[];
  private agency: ModelAgency;
  
  constructor(private _userService: UserService,
              private _coordinationArrangementService: CoordinationArrangementService,
              private _agencyService: AgencyService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper) {
                this.coordinationArrangement = new CoordinationArrangementModel();
                this.staffList = [];
                this.staffNamesList = [];
  }

  ngOnDestroy() {
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
        this.countryId = countryAdminUser.countryId;
        this.agencyId = countryAdminUser.agencyAdmin ? Object.keys(countryAdminUser.agencyAdmin)[0] : '';

        this._agencyService.getAgency(this.agencyId)
              .map(agency => {
                return agency as ModelAgency;
              })
              .subscribe(agency => {
                this.agency = agency;

                this._userService.getStaffList(this.countryId).subscribe(staffList => {
                this.staffList = staffList;
                this.staffList.forEach(staff => {
                  
                  this._userService.getUser(staff.id).subscribe(user => {
                    this.staffNamesList[staff.id] = user.firstName + ' ' + user.lastName;
                  });
                });
              });
              
              const editSubscription = this.route.params.subscribe((params: Params) => {
                    if (params['id']) {
                      this._coordinationArrangementService.getCoordinationArrangement(this.countryId, params['id'])
                            .subscribe(coordinationArrangement => { this.coordinationArrangement = coordinationArrangement; });
                    }
              });
            });
      });
    })
    this.subscriptions.add(authSubscription);
  }

  validateForm(): boolean {
    this.alertMessage = this.coordinationArrangement.validate();

    return !this.alertMessage;
  }

  submit() {
      this._coordinationArrangementService.saveCoordinationArrangement(this.countryId, this.coordinationArrangement)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.SUCCESS_SAVED', AlertMessageType.Success);
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
    this.router.navigateByUrl('/country-admin/country-office-profile/coordination');
  }

  deleteCoordinationArrangement() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();

    this._coordinationArrangementService.deleteCoordinationArrangement(this.countryId, this.coordinationArrangement)
      .then(() => {
        this.goBack();
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
 }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }
}