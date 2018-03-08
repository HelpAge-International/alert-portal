import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from "../../../../services/user.service";
import {Constants} from '../../../../utils/Constants';
import {ResponsePlanSectors, AlertMessageType, Month} from '../../../../utils/Enums';
import {AlertMessageModel} from '../../../../model/alert-message.model';
import {ProgrammeMappingModel} from '../../../../model/programme-mapping.model';
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {PageControlService} from "../../../../services/pagecontrol.service";
import * as moment from "moment";
import {CommonService} from "../../../../services/common.service";
import {OperationAreaModel} from "../../../../model/operation-area.model";
import {Location} from "@angular/common";
import {CountryAdminHeaderComponent} from "../../../country-admin-header/country-admin-header.component";
import {NetworkService} from "../../../../services/network.service";
import {Indicator} from "../../../../model/indicator";
import {TranslateService} from "@ngx-translate/core";
import {
  ModelJsonLocation
} from "../../../../model/json-location.model";
import {PartnerOrganisationProjectModel} from "../../../../model/partner-organisation.model";

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

  private Month = Constants.MONTH;
  private MonthList: number[] = [
    Month.january, Month.february, Month.march, Month.april,
    Month.may, Month.june, Month.july, Month.august, Month.september,
    Month.october, Month.november, Month.december
  ];

  private mapping: any[] = [];
  private sectorExpertise: any[] = [];
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
  private  toDate: any;

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService,
              private router: Router,
              private route: ActivatedRoute,
              private _userService: UserService,
              private af: AngularFire,
              private _location: Location,
              private _commonService: CommonService,
              private _translate: TranslateService,
              private userService: UserService) {
    this.programme = new ProgrammeMappingModel();
  }

  ngOnInit() {

    if (this.isLocalAgency) {
      this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
        this.uid = user.uid;
        this.countryID = countryId;
        this.agencyID = agencyId;
        this.initLocalAgency();
      });
    } else {
      this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
        this.uid = user.uid;
        this.countryID = countryId;
        this.agencyID = agencyId;
        this.initCountryOffice();
        this.initCountrySelection();
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
        console.log("agencyId", this.agencyID);
        console.log("countryID", this.countryID);
        console.log("getCountry", getCountry);

        this.selectedCountry = getCountry.$value;
        console.log(getCountry.$value, 'initCountrySelection');

        /**
         * Pass country to the level one values for selection
         */
        this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(pre => {
            console.log("selected country:");
            console.log(this.selectedCountry);
            this.levelOneDisplay = pre[this.selectedCountry].levelOneValues;
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
        console.log(this.programme)
         this.setWhenDate(programme.when);
         this.setToDate(programme.toDate)
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
        this.setToDate(programme.toDate)
        // this._convertTimestampToDate(programme.when);
        // this._convertTimestampToDate(programme.toDate)
      });
  }

  setSelectorClass(sectorID: any) {
    var selected = '';
    if (this.programme.sector == sectorID) {
      selected = 'Selected';
    }
    return selected;
  }

  isActive(sectorID: any) {
    this.programme.sector = sectorID;
  }

  backButton() {
    this.router.navigate(this.isLocalAgency ? ['/local-agency/profile/programme'] : ['/country-admin/country-office-profile/programme']);
  }

  saveMapping() {
    //this.setDate();
    this.alertMessage = this.programme.validate();
    var dataToSave = this.programme;
    dataToSave.updatedAt = new Date().getTime();

    if (!this.alertMessage) {
      let dataToSave = this.programme;
      let postData = {
        where: this.selectedCountry,
        level1: this.selectedValue ? this.levelOneDisplay[this.selectedValue].id : null,
        level2: this.selectedValueL2 ? this.selectedValueL2 : null,
        agencyId: this.agencyID
      };
      dataToSave.updatedAt = new Date().getTime();
      if (!this.programmeId) {
        if (this.countryID) {
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
        this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/' + this.programmeId)
          .update(dataToSave && postData)
          .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_EDIT_MAPPING', AlertMessageType.Success);
            this.router.navigate(['/country-admin/country-office-profile/programme/']);
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    }
  }

  saveMappingLocalAgency() {
   // this.setDate();
    this.alertMessage = this.programme.validate();
    if (!this.alertMessage) {
      var dataToSave = this.programme;

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
        this.af.database.object(Constants.APP_STATUS + "/localAgencyProfile/programme/" + this.agencyID + '/4WMapping/' + this.programmeId)
          .update(dataToSave)
          .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_EDIT_MAPPING', AlertMessageType.Success);
            this.router.navigate(['/local-agency/profile/programme/']);
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    }
  }

  setWhenDate(when) {
    when = moment(when).valueOf();
  }

  setToDate(to) {
    to = moment(to).valueOf();
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

  // This function below is to determine the country selected
  // TODO: Return the array of level1 areas in the country selected.
  // setCountryLevel(id: any){
  //   console.log(id);
  //   this.curCountrySelection(Constants.COUNTRY_LEVELS_VALUES_FILE)
  //     .takeUntil(this.ngUnsubscribe)
  //     .subscribe(content => {
  //       this.countryLevelsValues = content;
  //       err => console.log(err);
  //       // TODO: Below needs to return the level1 array of the id selected
  //       this.curCountrySelection = this.countryLevelsValues.filter(value => value.id === parseInt(id));
  //     });
  //
  // }


  resetValue() {

    console.log('reset selection');
    // Reset Values to remove level 2 drop down
    this.levelTwoDisplay.length = 0;

  }

  // This function below is to determine the country selected
  // TODO: Return the array of level1 areas in the country selected.
  setCountryLevel() {
    this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(content => {
        err => console.log(err);
        // TODO: Below needs to return the level1 array of the id selected
        this.levelOneDisplay = content[this.selectedCountry].levelOneValues;


      });

  }

  setLevel1Value() {

    console.log(this.selectedValue, 'preset value');
    this.levelTwoDisplay = this.levelOneDisplay[this.selectedValue].levelTwoValues;

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




