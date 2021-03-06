import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Constants} from "../../../../utils/Constants";
import {AlertMessageType, ResponsePlanSectors} from "../../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import {UserService} from "../../../../services/user.service";
import {CoordinationArrangementService} from "../../../../services/coordination-arrangement.service";
import {CoordinationArrangementModel} from "../../../../model/coordination-arrangement.model";
import {ModelStaff} from "../../../../model/staff.model";
import {AgencyService} from "../../../../services/agency-service.service";
import {ModelAgency} from "../../../../model/agency.model";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
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
  public responsePlansSectors = ResponsePlanSectors;
  private responsePlansSectorsSelection = Constants.RESPONSE_PLANS_SECTORS;
  private ResponsePlanSectorsList: number[] = [
    ResponsePlanSectors.wash,
    ResponsePlanSectors.health,
    ResponsePlanSectors.shelter,
    ResponsePlanSectors.nutrition,
    ResponsePlanSectors.foodSecurityAndLivelihoods,
    ResponsePlanSectors.protection,
    ResponsePlanSectors.education,
    ResponsePlanSectors.campmanagement,
    ResponsePlanSectors.other
  ];

  // Models
  private alertMessage: AlertMessageModel = null;
  private coordinationArrangement: CoordinationArrangementModel;
  private staffList: ModelStaff[];
  private staffNamesList: any[];
  private agency: ModelAgency;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _coordinationArrangementService: CoordinationArrangementService,
              private _agencyService: AgencyService,
              private router: Router,
              private route: ActivatedRoute) {
    this.coordinationArrangement = new CoordinationArrangementModel();
    this.staffList = [];
    this.staffNamesList = [];
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice();
  }

  initLocalAgency(){
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryId = countryId;
      this.agencyId = agencyId;


      this._agencyService.getAgency(this.agencyId)
        .map(agency => {
          return agency as ModelAgency;
        })
        .subscribe(agency => {
          this.agency = agency;

          this._userService.getStaffList(this.agencyId).subscribe(staffList => {
            this.staffList = staffList;
            this.staffList.forEach(staff => {

              this._userService.getUser(staff.id).subscribe(user => {
                this.staffNamesList[staff.id] = user.firstName + ' ' + user.lastName;
              });
            });
          });

          this.route.params.subscribe((params: Params) => {
            if (params['id']) {
              this._coordinationArrangementService.getCoordinationArrangementLocalAgency(this.agencyId, params['id'])
                .subscribe(coordinationArrangement => {
                  this.coordinationArrangement = coordinationArrangement;
                });
            }
          });
        });
    })
  }

  initCountryOffice(){
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryId = countryId;
      this.agencyId = agencyId;


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

          this.route.params.subscribe((params: Params) => {
            if (params['id']) {
              this._coordinationArrangementService.getCoordinationArrangement(this.countryId, params['id'])
                .subscribe(coordinationArrangement => {
                  this.coordinationArrangement = coordinationArrangement;
                });
            }
          });
        });
    })
  }

  validateForm(): boolean {
    this.alertMessage = this.coordinationArrangement.validate();

    return !this.alertMessage;
  }

  submit() {
    if(this.isLocalAgency){
      this._coordinationArrangementService.saveCoordinationArrangementLocalAgency(this.agencyId, this.coordinationArrangement)
        .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.SUCCESS_SAVED', AlertMessageType.Success);
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
      this._coordinationArrangementService.saveCoordinationArrangement(this.countryId, this.coordinationArrangement)
        .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.SUCCESS_SAVED', AlertMessageType.Success);
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
    if (this.isLocalAgency) {
      this.router.navigateByUrl('/local-agency/profile/coordination');
    }else{
      this.router.navigateByUrl('/country-admin/country-office-profile/coordination');
    }
  }

  deleteCoordinationArrangement() {
    jQuery('#delete-action').modal('show');
  }

  setSelectorClass(sectorID: any) {
    var selected = '';
    if (this.coordinationArrangement.sector == sectorID) {
      selected = 'Selected';
    }
    return selected;
  }

  isActive(sectorID: any) {
    this.coordinationArrangement.sector = sectorID;
  }

  deleteAction() {
    this.closeModal();

    if(this.isLocalAgency){
      this._coordinationArrangementService.deleteCoordinationArrangementLocalAgency(this.agencyId, this.coordinationArrangement)
        .then(() => {
          this.goBack();
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
    }else{
      this._coordinationArrangementService.deleteCoordinationArrangement(this.countryId, this.coordinationArrangement)
        .then(() => {
          this.goBack();
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.SUCCESS_DELETED', AlertMessageType.Success);
        })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
    }
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }
}
