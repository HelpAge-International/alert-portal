import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";
import { AlertMessageType, ResponsePlanSectors, Country } from "../../utils/Enums";
declare var jQuery: any;

import { PartnerOrganisationService } from "../../services/partner-organisation.service";
import { UserService } from "../../services/user.service";
import { AlertMessageModel } from '../../model/alert-message.model';
import { PartnerOrganisationModel, PartnerOrganisationProjectModel } from '../../model/partner-organisation.model';
import { ModelUserPublic } from '../../model/user-public.model';
import { CommonService } from "../../services/common.service";
import { OperationAreaModel } from "../../model/operation-area.model";
import { DisplayError } from "../../errors/display.error";

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
  userTitle = Constants.PERSON_TITLE;
  userTitleSelection = Constants.PERSON_TITLE_SELECTION;


  // Models
  private alertMessage: AlertMessageModel = null;
  private partnerOrganisation: PartnerOrganisationModel;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];

  // Other
  private activeProject: PartnerOrganisationProjectModel;

  constructor( private _userService: UserService,
              private _partnerOrganisationService: PartnerOrganisationService,
              private _commonService: CommonService,
              private router: Router,
              private subscriptions: RxHelper) {
                this.partnerOrganisation = new PartnerOrganisationModel();
                this.activeProject = this.partnerOrganisation.projects[0];
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
        .subscribe(content => { this.countryLevels = content;
                        err => console.log(err); });

      // get the country levels values
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
        .subscribe(content => { this.countryLevelsValues = content;
                        err => console.log(err); });

    });
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  validateForm(): boolean {
    this.alertMessage = this.partnerOrganisation.validate();

    if(!this.alertMessage) {
      // Validate organisation projects
      this.partnerOrganisation.projects.forEach(project => {
        this.alertMessage = this.validateProject(project);
      });
    }

    return !this.alertMessage;
  }

  submit() {
    this._partnerOrganisationService.savePartnerOrganisation(this.partnerOrganisation)
          .then(result => {
            this.alertMessage = new AlertMessageModel('ADD_PARTNER.SUCCESS_SAVED', AlertMessageType.Success);

            this._userService.getUserByEmail(this.partnerOrganisation.email).subscribe(user => {
              
              if(!user)
              {
                jQuery('#redirect-partners').modal('show');
              }else{
                setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
              }
            });

          })
          .catch(err => {
              if(err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              }else{
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
  }

  saveSector(pin: number, i: number)
  {
    let project = this.partnerOrganisation.projects[pin]; 
    
    if (project.sector[i])
    {
      delete project.sector[i];
    }else{
      project.sector[i] = true;
    }
  }

  addProject() {
    let newProject = new PartnerOrganisationProjectModel();
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
    this.partnerOrganisation.projects[pin].operationAreas.push(new OperationAreaModel());
  }

  removeProjectLocation(pin: number, opin: number) {
    this.partnerOrganisation.projects[pin].operationAreas.splice(opin, 1);
  }

  goBack() {
    this.router.navigateByUrl('response-plans/create-edit-response-plan');
  }

  redirectToPartnersPage() {
    this.closeModal();
    this.router.navigateByUrl('country-admin/country-staff/country-add-edit-partner');
  }

  closeModal() {
    jQuery('#redirect-partners').modal('hide');
    this.goBack();
  }
  
  private validateProject(project: PartnerOrganisationProjectModel): AlertMessageModel{
     this.alertMessage = project.validate();

     if(!this.alertMessage)
     {
        project.operationAreas.forEach(operationArea => {
          this.alertMessage = this.validateOperationArea(operationArea);
        });
     }

      if(this.alertMessage){
        this.setActiveProject(project);
        return this.alertMessage;
      }

      return null;
  }

  private validateOperationArea(operationArea: OperationAreaModel): AlertMessageModel
  {
    let excludeFields = [];
    let countryLevel1Exists = operationArea.country 
                                && this.countryLevelsValues[operationArea.country].levelOneValues 
                                && this.countryLevelsValues[operationArea.country].levelOneValues.length > 0;
    if( !countryLevel1Exists ){
      excludeFields.push("level1", "level2");
    }else if( countryLevel1Exists && operationArea.level1
          && (!this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].levelTwoValues 
                || this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].length < 1)){
        excludeFields.push("level2");
    }

    return operationArea.validate(excludeFields);
  }
}
