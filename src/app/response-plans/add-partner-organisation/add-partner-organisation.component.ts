import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {AlertMessageType, ResponsePlanSectors} from "../../utils/Enums";
import {PartnerOrganisationService} from "../../services/partner-organisation.service";
import {UserService} from "../../services/user.service";
import {AlertMessageModel} from '../../model/alert-message.model';
import {PartnerOrganisationModel, PartnerOrganisationProjectModel} from '../../model/partner-organisation.model';
import {ModelUserPublic} from '../../model/user-public.model';
import {OperationAreaModel} from "../../model/operation-area.model";
import {DisplayError} from "../../errors/display.error";
import {PartnerModel} from "../../model/partner.model";
import {SessionService} from "../../services/session.service";
import {CommonService} from "../../services/common.service";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import * as moment from "moment";
import {AngularFire} from "angularfire2";

declare var jQuery: any;

@Component({
  selector: 'app-add-partner-organisation',
  templateUrl: './add-partner-organisation.component.html',
  styleUrls: ['./add-partner-organisation.component.css'],
  providers: [PartnerOrganisationService, UserService]
})

export class AddPartnerOrganisationComponent implements OnInit, OnDestroy {
  private defaultCountry: any;
  private isEdit = false;
  private isActive = false;
  private uid: string;
  private agencyId: string;
  private countryId: string;
  private viewProject: string = "View project";

  // Constants and enums
  alertMessageType = AlertMessageType;
  responsePlansSectors = ResponsePlanSectors;
  responsePlansSectorsSelection = Constants.RESPONSE_PLANS_SECTORS;
  countryEnum = Constants.COUNTRIES;
  userTitle = Constants.PERSON_TITLE;
  userTitleSelection = Constants.PERSON_TITLE_SELECTION;

  // Models
  private alertMessage: AlertMessageModel = null;
  private partnerOrganisation: PartnerOrganisationModel;
  private countryLevelsValues = [];

  // Other
  private activeProject: PartnerOrganisationProjectModel;
  private isNewProject: boolean = false;
  private fromResponsePlans: boolean = false;
  private projectEndDate: any[] = [];
  private todayDayMonth = new Date(new Date().getFullYear(), new Date().getMonth());

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: Boolean;

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _commonService: CommonService,
              private _sessionService: SessionService,
              private af: AngularFire,
              private router: Router, private route: ActivatedRoute) {
    this.partnerOrganisation = new PartnerOrganisationModel();
    this.activeProject = this.partnerOrganisation.projects[0];
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice();
  }

  initLocalAgency() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;

      this.partnerOrganisation.userId = this.uid;
      this.partnerOrganisation.agencyId = this.agencyId;

      // get the country levels values
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(content => {
          this.countryLevelsValues = content;
          this._userService.getAgencyDetail(this.agencyId)
            .first()
            .subscribe(agency => {
              this.defaultCountry = agency.country;

              this.route.params
                .takeUntil(this.ngUnsubscribe)
                .subscribe((params: Params) => {
                  if (params["fromResponsePlans"]) {
                    this.fromResponsePlans = true;
                  }
                  if (params['id']) {
                    this.isEdit = true;
                    this._partnerOrganisationService.getPartnerOrganisation(params['id']).takeUntil(this.ngUnsubscribe).subscribe(partnerOrganisation => {
                      this.partnerOrganisation = partnerOrganisation;
                    })
                  }
                  if (!this.isEdit) {
                    this.activeProject.operationAreas.forEach(area => {
                      area.country = this.defaultCountry.location;
                    });
                  }
                });
            });
        });
    });
  }

  initCountryOffice() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.countryId = countryId;

      this.partnerOrganisation.userId = this.uid;
      this.partnerOrganisation.agencyId = this.agencyId;
      this.partnerOrganisation.countryId = this.countryId;

      // get the country levels values
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(content => {
          this.countryLevelsValues = content;

          this._userService.getCountryDetail(this.countryId, this.agencyId)
            .first()
            .subscribe(country => {
              this.defaultCountry = country;

              this.route.params
                .takeUntil(this.ngUnsubscribe)
                .subscribe((params: Params) => {
                  if (params["fromResponsePlans"]) {
                    this.fromResponsePlans = true;
                  }
                  if (params['id']) {
                    this.isEdit = true;
                    this._partnerOrganisationService.getPartnerOrganisation(params['id'])
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(partnerOrganisation => {
                        this.partnerOrganisation = partnerOrganisation;
                      })
                  }
                  if (!this.isEdit) {
                    this.activeProject.operationAreas.forEach(area => {
                      area.country = this.defaultCountry.location;
                    });
                  }
                });

            });
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  validateForm(): boolean {
    this.alertMessage = this.partnerOrganisation.validate();

    // if (!this.alertMessage) {
    //   // Validate organisation projects
    //   this.partnerOrganisation.projects.forEach(project => {
    //     let modelProject = new PartnerOrganisationProjectModel();
    //     modelProject.mapFromObject(project);
    //     //this.alertMessage = this.validateProject(modelProject);
    //   });
    // }

    return !this.alertMessage;
  }

  submit() {
    // Transforms projects endDate to timestamp
    console.log(this.partnerOrganisation.projects)

console.log("in partner org")
      this.partnerOrganisation.projects.forEach(project => {
        if(!isNaN(project.endDate)) {
          project.endDate = new Date(project.endDate).getTime()
        }
      });

    if (this.isLocalAgency) {
      this._partnerOrganisationService.savePartnerOrganisationLocalAgency(this.agencyId, this.partnerOrganisation)
        .then(result => {
          this.partnerOrganisation.id = this.partnerOrganisation.id || result.key;

          this.alertMessage = new AlertMessageModel('ADD_PARTNER.SUCCESS_SAVED', AlertMessageType.Success);

          if (this.isLocalAgency) {
            setTimeout(() => this.router.navigateByUrl("local-agency/profile/partners"), Constants.ALERT_REDIRECT_DURATION);
          } else {
            setTimeout(() => this.router.navigateByUrl("country-admin/country-office-profile/partners"), Constants.ALERT_REDIRECT_DURATION);
          }


        })
        .catch(err => {
          if (err instanceof DisplayError) {
            this.alertMessage = new AlertMessageModel(err.message);
          } else {
            console.log(err);
            this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
          }
        });
    } else {
      if(this.activeProject.title == null && this.activeProject.endDate == null){
        this.activeProject.operationAreas = null
      }

      this._partnerOrganisationService.savePartnerOrganisation(this.agencyId, this.countryId, this.partnerOrganisation)
        .then(result => {
          this.partnerOrganisation.id = this.partnerOrganisation.id || result.key;

          this.alertMessage = new AlertMessageModel('ADD_PARTNER.SUCCESS_SAVED', AlertMessageType.Success);

          if (this.isLocalAgency) {

          } else {
            setTimeout(() => this.router.navigateByUrl("country-admin/country-office-profile/partners"), Constants.ALERT_REDIRECT_DURATION);
          }


        })
        .catch(err => {
          if (err instanceof DisplayError) {
            this.alertMessage = new AlertMessageModel(err.message);
          } else {
            console.log(err);
            this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
          }
        });
    }
  }

  saveSector(pin: number, i: number) {
    console.log(this.partnerOrganisation.projects[pin])
    if (this.partnerOrganisation.projects[pin]) {
      let project = this.partnerOrganisation.projects[pin];

      if (project.sector[i]) {
        this.isEdit ? project.sector[i] = !project.sector[i] : project.sector.splice(i, 1);
      } else {
        project.sector[i] = true;
      }
    }
  }

  addProject() {
    let newProject = new PartnerOrganisationProjectModel();
    newProject.operationAreas[0].country = this.defaultCountry.location;
    this.partnerOrganisation.projects.push(newProject);
    this.setActiveProject(newProject);

  }

  removeProject(pin: number) {
    this.partnerOrganisation.projects.splice(pin, 1);
    this.setActiveProject(this.partnerOrganisation.projects[0]);
  }

  setActiveProject(project: PartnerOrganisationProjectModel) {
    this.activeProject = project;
  }

  addProjectLocation(pin: number) {
    let operationAreaModel = new OperationAreaModel();
    operationAreaModel.country = this.defaultCountry.location;
    this.partnerOrganisation.projects[pin].operationAreas.push(operationAreaModel);
  }

  removeProjectLocation(pin: number, opin: number) {
    this.partnerOrganisation.projects[pin].operationAreas.splice(opin, 1);
  }

  selectDate(project: PartnerOrganisationProjectModel, pin: number) {
    let newEndDate = moment(this.projectEndDate[pin]).valueOf();
    project.endDate = newEndDate;
  }

  setActiveState() {
    jQuery("#confirm-active").modal("hide");
    this.isActive = true;
    this.partnerOrganisation.isActive = this.isActive;
    console.log("Active State: " + this.partnerOrganisation.isActive);
    this.submit();
  }

  setInactiveState() {
    jQuery("#confirm-inactive").modal("hide");
    this.isActive = false;
    this.partnerOrganisation.isActive = this.isActive;
    console.log("InActive State: " + this.partnerOrganisation.isActive);
    this.submit();
  }

  openConfirmationModel() {
    console.log("openConfirmationModel(): " + this.partnerOrganisation.isActive);
    if (!this.partnerOrganisation.isActive) {
      jQuery("#confirm-active").modal("show");
    } else {
      jQuery("#confirm-inactive").modal("show");
    }
  }

  closeConfirmationModel(key) {
    jQuery("#" + key).modal("hide");
  }

  goBack() {
    if (this.isLocalAgency) {
      this.router.navigateByUrl("local-agency/profile/partners")
    } else {
      this.router.navigateByUrl("country-admin/country-office-profile/partners")
    }

  }

  redirectToPartnersPage() {
    const user = new ModelUserPublic(this.partnerOrganisation.firstName, this.partnerOrganisation.lastName,
      this.partnerOrganisation.title, this.partnerOrganisation.email);
    user.phone = this.partnerOrganisation.phone;
    this._sessionService.user = user;

    const partner = new PartnerModel();
    partner.partnerOrganisationId = this.partnerOrganisation.id;
    partner.position = this.partnerOrganisation.position;
    this._sessionService.partner = partner;

    if (this.isLocalAgency) {
      this.router.navigateByUrl('local-agency/agency-staff/add-edit-partner');
    } else {
      this.router.navigateByUrl('country-admin/country-staff/country-add-edit-partner');
    }
  }

  closeRedirectModal() {
    jQuery('#redirect-partners').modal('hide');
    this.goBack();
  }

  private validateProject(project: PartnerOrganisationProjectModel): AlertMessageModel {
   // this.alertMessage = project.validate();

    if (!this.alertMessage) {
      project.operationAreas.forEach(operationArea => {
        let modelArea = new OperationAreaModel();
        modelArea.mapFromObject(operationArea);
       // this.alertMessage = this.validateOperationArea(modelArea);
      });
    }

   // if (this.alertMessage) {
      //this.setActiveProject(project);
      return this.alertMessage;
  //  }

    ///return null;
  }

  private validateOperationArea(operationArea: OperationAreaModel): AlertMessageModel {
    let excludeFields = [];
    let countryLevel1Exists = operationArea.country
      && this.countryLevelsValues[operationArea.country].levelOneValues
      && this.countryLevelsValues[operationArea.country].levelOneValues.length > 0;
    if (!countryLevel1Exists) {
      excludeFields.push("level1", "level2");
    } else if (countryLevel1Exists && operationArea.level1
      && (!this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].levelTwoValues
        || this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].length < 1)) {
      excludeFields.push("level2");
    }

    return operationArea.validate(excludeFields);
  }

  deletePartnerOrganisation() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();
    this._partnerOrganisationService.deletePartnerOrganisation(this.agencyId, this.countryId, this.partnerOrganisation)
      .then(() => {
          this.goBack();
          this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PARTNER.SUCCESS_DELETED', AlertMessageType.Success);
        },
        err => {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
        });
  }

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

  hasLevel1(country): boolean {
    let hasLevel1 = false;
    if (this.countryLevelsValues[country] && this.countryLevelsValues[country]["levelOneValues"] && this.countryLevelsValues[country]["levelOneValues"].length > 0) {
      hasLevel1 = true;
    }
    return hasLevel1;
  }
}
