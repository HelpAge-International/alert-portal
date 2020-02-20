import { Location } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { AngularFire } from "angularfire2";
import * as moment from "moment";
import { Subject } from "rxjs";
import { AlertMessageModel } from '../../../../model/alert-message.model';
import { Indicator } from "../../../../model/indicator";
import { OperationAreaModel } from "../../../../model/operation-area.model";
import { ProgrammeMappingModel } from '../../../../model/programme-mapping.model';
import { AgencyService } from "../../../../services/agency-service.service";
import { CommonService } from "../../../../services/common.service";
import { PageControlService } from "../../../../services/pagecontrol.service";
import { UserService } from "../../../../services/user.service";
import { Constants } from '../../../../utils/Constants';
import { AlertMessageType, Month, ResponsePlanSectors } from '../../../../utils/Enums';

declare var jQuery: any;

@Component({
  selector: 'app-country-office-add-edit-mapping-programme',
  templateUrl: './add-edit-mapping.component.html',
  styleUrls: ['./add-edit-mapping.component.css']
})

export class AddEditMappingProgrammeComponent implements OnInit, OnDestroy {

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  private uid: string;
  private countryID: string;
  private agencyID: string;
  private userType;
  private ResponsePlanSectors = Constants.RESPONSE_PLANS_SECTORS;
  public ResponsePlansEnum = ResponsePlanSectors;
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

  private waSHSectorSelected: boolean = false;
  private healthSectorSelected: boolean = false;
  private shelterSectorSelected: boolean = false;
  private nutritionSectorSelected: boolean = false;
  private foodSecAndLivelihoodsSectorSelected: boolean = false;
  private protectionSectorSelected: boolean = false;
  private educationSectorSelected: boolean = false;
  private campManagementSectorSelected: boolean = false;
  private otherSectorSelected: boolean = false;

  private Month = Constants.MONTH;
  private MonthList: number[] = [
    Month.january, Month.february, Month.march, Month.april,
    Month.may, Month.june, Month.july, Month.august, Month.september,
    Month.october, Month.november, Month.december
  ];

  private mapping: any[] = [];
  private sectorExpertise: any[] = [];
  private selectedSectors: string[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private programmeId: string;
  private programme: any;

  // Variables for ALT-2039
  private copyIndicatorId: string;
  public indicatorData: Indicator;
  private countries = Constants.COUNTRIES;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;
  private countrySelection: any[] = [];
  private curCountrySelection: any[] = this.countrySelection;
  private countryLocation: number;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];
  private levelOneDisplay: any[] = [];
  private levelTwoDisplay: any[] = [];
  private levelOneShow: any;
  private selectedCountry: any;
  private selectedCountryArr: any[] = [];
  private geoLocation = Constants.GEO_LOCATION;
  private isEdit: boolean = false;
  private selectedValue: any;
  private selectedValueL2: any;
  private presetId: any;
  private isPreset: boolean = true;
  private isPresetValue: any;

  private when: any;
  private toDate: any;

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService,
              private router: Router,
              private route: ActivatedRoute,
              private _userService: UserService,
              private af: AngularFire,
              private _location: Location,
              private _commonService: CommonService,
              private _translate: TranslateService,
              private agencyService: AgencyService,
              private userService: UserService) {
    this.programme = new ProgrammeMappingModel();
  }

  ngOnInit() {

    if (this.isLocalAgency) {
      this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
        this.uid = user.uid;
        this.agencyID = agencyId;
        this.agencyService.getAgency(agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((agency) => {
            this.selectedCountry = agency.countryCode;
            this.initLocalAgency();
            this.initCountrySelection();
          });
      });
    } else {
      this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
        this.uid = user.uid;
        this.countryID = countryId;
        this.agencyID = agencyId;
        this.agencyService.getAgency(agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((agency) => {
            this.selectedCountry = agency.countryCode;
            this.initCountryOffice();
            this.initCountrySelection();
          });
      });
    }

  }

  initLocalAgency() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {

        if (params && params['programmeId']) {
          this.programmeId = params['programmeId'];
          this._getProgrammeLocalAgency(params['programmeId']);
        }

      });
  }

  initCountryOffice() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        // this._getCountryID().then(() => {
        if (params && params['programmeId']) {
          this.programmeId = params['programmeId'];
          this._getProgramme(params['programmeId']);
        }
        // });
      });
  }

  initCountrySelection() {
    /**
     * Preset the first drop down box to the country office
     */
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyID + "/" + this.countryID + "/location")
      .takeUntil(this.ngUnsubscribe)
      .subscribe(getCountry => {
        this.selectedCountry = getCountry.$value;
        /**
         * Pass country to the level one values for selection
         */
        this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(pre => {
            this.levelOneDisplay = pre[this.selectedCountry].levelOneValues;
            this.setCountryLevel(this.selectedCountry);
          })
      });
  }

  checkLevel2() {
    if (this.levelTwoDisplay.length == 1) {
      console.log('do nothing');
    } else {
      jQuery('#level2Show').hide();
    }
  }

  _getProgramme(programmeID: string) {
    this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/' + programmeID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((programme: any) => {
        this.programme = new ProgrammeMappingModel();
        programme.id = programme.$key;
        this.programme.setData(programme);
        this.setWhenDate(programme.when);
        this.setToDate(programme.toDate)
        this.selectedCountry = programme.where;
        this.selectedValue = programme.level1;
        this.selectedValueL2 = programme.level2;
        this.updateSectorSelections(programme.sector)
      });
  }

  _getProgrammeLocalAgency(programmeID: string) {
    this.af.database.object(Constants.APP_STATUS + "/localAgencyProfile/programme/" + this.agencyID + '/4WMapping/' + programmeID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((programme: any) => {
        this.programme = new ProgrammeMappingModel();
        programme.id = programme.$key;
        this.programme.setData(programme);
        this.setWhenDate(programme.when);
        this.setToDate(programme.toDate);
        this.selectedCountry = programme.where;
        this.selectedValue = programme.level1;
        this.selectedValueL2 = programme.level2;
        this.updateSectorSelections(programme.sector)
      });
  }

  private updateSectorSelections(sectors: any[]) {
    if (sectors.length > 0) {
      sectors.forEach(sector => {
        this.switchSelectedSector(sector)
        this.selectedSectors.push(sector)
      });
    } else {
      this.switchSelectedSector(sectors)
      this.selectedSectors.push(String(sectors))
    }
  }

  private switchSelectedSector(sector: any) {
    switch (Number(sector)) {
      case ResponsePlanSectors.wash: {
        this.waSHSectorSelected = true;
        break;
      }
      case ResponsePlanSectors.health: {
        this.healthSectorSelected = true; 
        break;
      }
      case ResponsePlanSectors.shelter: {
        this.shelterSectorSelected = true; 
        break;
      }
      case ResponsePlanSectors.nutrition: {
        this.nutritionSectorSelected = true; 
        break;
      }
      case ResponsePlanSectors.foodSecurityAndLivelihoods: {
        this.foodSecAndLivelihoodsSectorSelected = true; 
        break;
      }
      case ResponsePlanSectors.protection: {
        this.protectionSectorSelected = true; 
        break;
      }
      case ResponsePlanSectors.education: {
        this.educationSectorSelected = true; 
        break;
      }
      case ResponsePlanSectors.campmanagement: {
        this.campManagementSectorSelected = true; 
        break;
      }
      case ResponsePlanSectors.other: {
        this.otherSectorSelected = true; 
        break;
      }
      default: {
        break;
      }
    }
  }

  backButton() {
    this.router.navigate(this.isLocalAgency ? ['/local-agency/profile/programme'] : ['/country-admin/country-office-profile/programme']);
  }

  saveMapping() {
    this.programme.sector = this.selectedSectors
    this.alertMessage = this.programme.validate();

    if (!this.alertMessage) {
      let dataToSave = this.programme;
      let postData = {
        where: this.programme.where,
        level1: this.programme.level1 ? this.programme.level1 : null,
        level2: this.programme.level2 ? this.programme.level2 : null,
        agencyId: this.agencyID
      };

      if (!this.programmeId) {
        if (this.countryID) {
          dataToSave.updatedAt = new Date().getTime();

          this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/')
            .push(dataToSave)
            .update(postData)
            .then(() => {

              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_MAPPING', AlertMessageType.Success);
              this.programme = new ProgrammeMappingModel();
              this.router.navigate(['/country-admin/country-office-profile/programme/']);
            }).catch((error: any) => {
            console.log(error, 'You do not have access!')
          });
        } else {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR', AlertMessageType.Error);
        }
      } else {
        dataToSave.updatedAt = new Date().getTime();
        delete dataToSave.id;

        const newData = {};
        Object.keys(dataToSave).forEach((key) => {
          if (dataToSave[key]) {
            newData[key] = dataToSave[key]
          }
        });

        this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/' + this.programmeId)
          .update(newData)
          .then((newData) => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_EDIT_MAPPING', AlertMessageType.Success);
            this.router.navigate(['/country-admin/country-office-profile/programme/']);
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    }
  }

  saveMappingLocalAgency() {
    this.alertMessage = this.programme.validate();
    if (!this.alertMessage) {
      var dataToSave = this.programme;
      let postData = {
        where: this.programme.where,
        level1: this.programme.level1 ? this.programme.level1 : null,
        level2: this.programme.level2 ? this.programme.level2 : null,
        agencyId: this.agencyID
      };

      if (!this.programmeId) {
        if (this.agencyID) {
          this.af.database.list(Constants.APP_STATUS + "/localAgencyProfile/programme/" + this.agencyID + '/4WMapping/')
            .push(dataToSave)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_MAPPING', AlertMessageType.Success);
              this.programme = new ProgrammeMappingModel();
              this.router.navigate(['/local-agency/profile/programme/']);
            }).catch((error: any) => {
            console.log(error, 'You do not have access!')
          });
        } else {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR', AlertMessageType.Error);
        }
      } else {
        dataToSave.updatedAt = new Date().getTime();
        delete dataToSave.id;

        const newData = {};
        Object.keys(dataToSave).forEach((key) => {
          if (dataToSave[key]) {
            newData[key] = dataToSave[key]
          }
        });

        this.af.database.object(Constants.APP_STATUS + "/localAgencyProfile/programme/" + this.agencyID + '/4WMapping/' + this.programmeId)
          .update(newData)
          .then((newData) => {
            console.log('saved', newData);
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_EDIT_MAPPING', AlertMessageType.Success);
            this.router.navigate(['/local-agency/profile/programme/']);
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    }
  }

  private updateSectorsList(sectorSelected, sectorEnum) {
    if (sectorSelected) {
      // Add
      if (!(this.selectedSectors.includes(sectorEnum))) {
        this.selectedSectors.push(sectorEnum);
      }
    } 
    else {
      // Remove
      if (this.selectedSectors.includes(sectorEnum)) {
        let index: number = this.selectedSectors.indexOf(sectorEnum, 0);
        if (index > -1) {
          this.selectedSectors.splice(index, 1);
        }
      }
    }    
  }

  isWaSHSectorSelected() {
    this.waSHSectorSelected = !this.waSHSectorSelected;
    this.updateSectorsList(this.waSHSectorSelected, ResponsePlanSectors.wash);
  }

  isHealthSectorSelected() {
    this.healthSectorSelected = !this.healthSectorSelected;
    this.updateSectorsList(this.healthSectorSelected, ResponsePlanSectors.health);
  }

  isShelterSectorSelected() {
    this.shelterSectorSelected = !this.shelterSectorSelected;
    this.updateSectorsList(this.shelterSectorSelected, ResponsePlanSectors.shelter);
  }

  isNutritionSectorSelected() {
    this.nutritionSectorSelected = !this.nutritionSectorSelected;
    this.updateSectorsList(this.nutritionSectorSelected, ResponsePlanSectors.nutrition);
  }

  isFoodSecAndLivelihoodsSectorSelected() {
    this.foodSecAndLivelihoodsSectorSelected = !this.foodSecAndLivelihoodsSectorSelected;
    this.updateSectorsList(this.foodSecAndLivelihoodsSectorSelected, ResponsePlanSectors.foodSecurityAndLivelihoods);
  }

  isProtectionSectorSelected() {
    this.protectionSectorSelected = !this.protectionSectorSelected;
    this.updateSectorsList(this.protectionSectorSelected, ResponsePlanSectors.protection);
  }

  isEducationSectorSelected() {
    this.educationSectorSelected = !this.educationSectorSelected;
    this.updateSectorsList(this.educationSectorSelected, ResponsePlanSectors.education);
  }

  isCampManagementSectorSelected() {
    this.campManagementSectorSelected = !this.campManagementSectorSelected;
    this.updateSectorsList(this.campManagementSectorSelected, ResponsePlanSectors.campmanagement);
  }

  isOtherSectorSelected() {
    this.otherSectorSelected = !this.otherSectorSelected;
    this.updateSectorsList(this.otherSectorSelected, ResponsePlanSectors.other);
  }

  setWhenDate(when) {
    this.programme.when = moment(when).valueOf();
  }

  setToDate(to) {
    this.programme.toDate = moment(to).valueOf();
  }

  deleteMapping() {
    jQuery("#deleteMapping").modal("hide");
    this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/' + this.programmeId)
      .remove().then(() => {
      this.router.navigate(['/country-admin/country-office-profile/programme/']);
    });
  }

  deleteMappingLocalAgency() {
    jQuery("#deleteMapping").modal("hide");
    this.af.database.object(Constants.APP_STATUS + "/localAgencyProfile/programme/" + this.agencyID + '/4WMapping/' + this.programmeId)
      .remove().then(() => {
      this.router.navigate(['/local-agency/profile/programme/']);
    });
  }


  // Dan || ALT-2039 functions
  // #start
  addAnotherLocation() {
    let modelArea = new OperationAreaModel();
    modelArea.country = this.countryLocation;
    this.indicatorData.affectedLocation.push(modelArea);
    console.log(this.indicatorData)
  }

  resetValue() {
    this.levelTwoDisplay.length = 0;
  }

  setCountryLevel(selectedC) {
    this.programme.where = selectedC;
    this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(content => {
        err => console.log(err);
        this.levelOneDisplay = content[selectedC].levelOneValues;
      });
  }

  setLevel1Value(selected) {
    this.programme.level1 = selected;
    for (var i = 0; i < this.levelOneDisplay.length; i++) { 
      var x = this.levelOneDisplay[i];
      if (x['id'] == selected) {
        this.levelTwoDisplay = this.levelOneDisplay[i].levelTwoValues;
      }
    }
  }

  setLevel2Value(selected){
    this.programme.level2 = selected;
  }

  checkTypeof(param: any) {
    if (typeof (param) == 'undefined') {
      return false;
    } else {
      return true;
    }
  }

  removeAnotherLocation(key: number,) {
    this.indicatorData.affectedLocation.splice(key, 1);
  }

// #end
  _convertTimestampToDate(programme) {
    let whenDate =  moment(this.when).valueOf();
    console.log(whenDate)
    programme.when = whenDate;
  }

  _convertToDate(timestamp: number) {
    this.toDate = [];

    let date = moment(timestamp);
    this.toDate['month'] = date.month() + 1;
    this.toDate['year'] = date.year();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}



