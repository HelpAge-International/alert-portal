import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from "../../../../services/user.service";
import {Constants} from '../../../../utils/Constants';
import {ResponsePlanSectors, AlertMessageType, Month, GeoLocation} from '../../../../utils/Enums';
import {AlertMessageModel} from '../../../../model/alert-message.model';
import {ProgrammeMappingModel} from '../../../../model/programme-mapping.model';
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {PageControlService} from "../../../../services/pagecontrol.service";
import * as moment from "moment";
import {OperationAreaModel} from "../../../../model/operation-area.model";
import {Location} from "@angular/common";
import {CommonService} from "../../../../services/common.service";
import { CountryAdminHeaderComponent } from "../../../country-admin-header/country-admin-header.component";
import {NetworkService} from "../../../../services/network.service";

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
  private userType;
  private ResponsePlanSectors = Constants.RESPONSE_PLANS_SECTORS;
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
  public indicatorData: any;
  private countries = Constants.COUNTRIES;
  private countriesList: number[] = Constants.COUNTRY_SELECTION;
  private agencyId: string;
  private countrySelection: any[] = [];
  private curCountrySelection: any = this.countrySelection;
  private countryLocation: number;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];

  private when: any[] = [];


  constructor(private pageControl: PageControlService,
              private router: Router,
              private route: ActivatedRoute,
              private _userService: UserService,
              private af: AngularFire,
              private _location: Location,
              private _commonService: CommonService,
              private userService: UserService,) {
    this.programme = new ProgrammeMappingModel();
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.countryID = countryId;
      this.initData();
    });


  }

  initData() {
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

    // get the country levels values
    this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(content => {
        this.countryLevelsValues = content;
        console.log(content[0]); // this displays the array of areas.
        err => console.log(err);
      });



  }

  _getProgramme(programmeID: string) {
    this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/' + programmeID)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((programme: any) => {
        this.programme = new ProgrammeMappingModel();
        programme.id = programme.$key;
        this.programme.setData(programme);
        this._convertTimestampToDate(programme.when);
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
    this.router.navigate(['/country-admin/country-office-profile/programme']);
  }

  saveMapping() {
    this.setDate();
    this.alertMessage = this.programme.validate();
    if (!this.alertMessage) {
      var dataToSave = this.programme;

      if (!this.programmeId) {
        if (this.countryID) {
          this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/')
            .push(dataToSave)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_SAVE_MAPPING', AlertMessageType.Success);
              this.programme = new ProgrammeMappingModel();
              this.when = [];
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
          .update(dataToSave)
          .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.PROGRAMME.SUCCESS_EDIT_MAPPING', AlertMessageType.Success);
            this.router.navigate(['/country-admin/country-office-profile/programme/']);
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    }
  }

  setMonth(event: any) {
    this.when['month'] = parseInt(event.target.value);
  }

  setYear(event: any) {
    this.when['year'] = parseInt(event.target.value);
  }

  setDate() {
    if (this.when['month'] && this.when['year']) {
      let year = this.when['year'];
      let month = Number(this.when['month'] - 1);
      let timeStamp = moment({'year': year, 'month': month, 'day': 15}).valueOf();
      // var timeStamp = new Date(this.when['year'], this.when['month'], 15).getTime();
      this.programme.when = 0;
      this.programme.when = timeStamp;
    }
  }

  deleteMapping() {
    jQuery("#deleteMapping").modal("hide");
    this.af.database.object(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + this.countryID + '/4WMapping/' + this.programmeId)
      .remove().then(() => {
      this.router.navigate(['/country-admin/country-office-profile/programme/']);
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

  // This function below is to determine the country selected *INCOMPLETE*
  // TODO: Return the array of level1 areas in the country selected.
  setCountryLevel(id: any){
    console.log(id);
    this.curCountrySelection(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(content => {
        this.countryLevelsValues = content;
        err => console.log(err);
        // TODO: Below needs to return the level1 array of the id selected
        this.curCountrySelection = this.countryLevelsValues.filter(value => value.id === parseInt(id));
      });

    console.log(this.curCountrySelection, 'end of countryLevel function'); // this displays the array of areas.

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

  _convertTimestampToDate(timestamp: number) {
    this.when = [];
    let date = moment(timestamp);
    this.when['month'] = date.month() + 1;
    this.when['year'] = date.year();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}




