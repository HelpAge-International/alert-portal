import {Component, OnInit, OnDestroy} from '@angular/core';
import {Indicator} from "../../model/indicator";
import {AlertLevels, GeoLocation, Country, DurationType, HazardScenario, AlertMessageType} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {RxHelper} from "../../utils/RxHelper";
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {CommonService} from "../../services/common.service";
import {OperationAreaModel} from "../../model/operation-area.model";
import {IndicatorSourceModel} from "../../model/indicator-source.model";
import {IndicatorTriggerModel} from "../../model/indicator-trigger.model";
import {AlertMessageModel} from '../../model/alert-message.model';
import {ModelUserPublic} from "../../model/user-public.model";
import {LocalStorageService} from 'angular-2-local-storage';
import {Subject} from "rxjs";

@Component({
  selector: 'app-add-indicator',
  templateUrl: './add-indicator.component.html',
  styleUrls: ['./add-indicator.component.css'],
  providers: [CommonService]
})

export class AddIndicatorRiskMonitoringComponent implements OnInit, OnDestroy {

  alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  public uid: string;
  public countryID: string;

  public indicatorData: any;

  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertImages = Constants.ALERT_IMAGES;
  private alertLevelsList: number[] = [AlertLevels.Green, AlertLevels.Amber, AlertLevels.Red];

  private durationType = Constants.DURATION_TYPE;
  private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];

  private geoLocation = Constants.GEO_LOCATION;
  private geoLocationList: number[] = [GeoLocation.national, GeoLocation.subnational];


    private countries = Constants.COUNTRIES;
    private countriesList: number[] = Constants.COUNTRY_SELECTION;
    private frequency = new Array(100);

  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];

  private hazardScenario = Constants.HAZARD_SCENARIOS;
  private hazardScenariosList: number[] = [
    HazardScenario.HazardScenario0,
    HazardScenario.HazardScenario1,
    HazardScenario.HazardScenario2,
    HazardScenario.HazardScenario3,
    HazardScenario.HazardScenario4,
    HazardScenario.HazardScenario5,
    HazardScenario.HazardScenario6,
    HazardScenario.HazardScenario7,
    HazardScenario.HazardScenario8,
    HazardScenario.HazardScenario9,
    HazardScenario.HazardScenario10,
    HazardScenario.HazardScenario11,
    HazardScenario.HazardScenario12,
    HazardScenario.HazardScenario13,
    HazardScenario.HazardScenario14,
    HazardScenario.HazardScenario15,
    HazardScenario.HazardScenario16,
    HazardScenario.HazardScenario17,
    HazardScenario.HazardScenario18,
    HazardScenario.HazardScenario19,
    HazardScenario.HazardScenario20,
    HazardScenario.HazardScenario21,
    HazardScenario.HazardScenario22,
    HazardScenario.HazardScenario23,
    HazardScenario.HazardScenario24,
    HazardScenario.HazardScenario25,
    HazardScenario.HazardScenario26,
  ];

  private usersForAssign: any = [];
  private isEdit: boolean = false;
  private hazardID: any;
  private indicatorID: any;
  private url: string;
  private hazards: Array<any> = [];
  private hazardsObject: any = {};

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private route: ActivatedRoute,
              private storage: LocalStorageService) {
    this.initIndicatorData();
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.getCountryID().then(() => {
          this._getHazards();
          this.getUsersForAssign();
        });

        // get the country levels values
        this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(content => {
            this.countryLevelsValues = content;
            err => console.log(err);
          });

      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initIndicatorData() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        this.indicatorData = new Indicator();
        if (!params['hazardID']) {
          console.log('hazardID cannot be empty');
          this.router.navigate(["/risk-monitoring"]);
          return false;
        }

        this.hazardID = params['hazardID'];

        if (params['indicatorID']) {
          this.isEdit = true;
          this.hazardID = params['hazardID'];
          this.indicatorID = params['indicatorID'];

          this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
            if (auth) {
              this.uid = auth.uid;
              this.getCountryID().then(() => {
                this._getIndicator(this.hazardID, this.indicatorID);
              });

            } else {
              this.navigateToLogin();
            }
          });

        } else {
          this.addAnotherSource();
          this.addAnotherLocation();
          this.addIndicatorTrigger();
        }

      });
  }

  stateGeoLocation(event: any) {
    var geoLocation = parseInt(event.target.value);
    this.indicatorData.geoLocation = geoLocation;
  }


  addAnotherSource() {
    this.indicatorData.source.push(new IndicatorSourceModel());
  }

  removeAnotherSource(key: number) {
    this.indicatorData.source.splice(key, 1);
  }

  addAnotherLocation() {
    this.indicatorData.affectedLocation.push(new OperationAreaModel());
  }

  removeAnotherLocation(key: number,) {
    this.indicatorData.affectedLocation.splice(key, 1);
  }

  addIndicatorTrigger() {
    for (let alertLevelKey in this.alertLevelsList) {
      this.indicatorData.trigger.push(new IndicatorTriggerModel());
    }
  }

  getUsersForAssign() {
    /* TODO if user ERT OR Partner, assign only me */
    this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryID).subscribe((data: any) => {
      for (let userID in data) {
        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID).subscribe((user: ModelUserPublic) => {
          var userToPush = {userID: userID, firstName: user.firstName};
          this.usersForAssign.push(userToPush);
        });
      }
    });
  }

  getCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/countryId').subscribe((countryID: any) => {
        this.countryID = countryID.$value ? countryID.$value : "";
        res(true);
      });
    });
    return promise;
  }

  saveIndicator() {
    if (typeof (this.indicatorData.hazardScenario) == 'undefined') {
      this.indicatorData.hazardScenario = this.hazardsObject[this.hazardID];
    }
    this._validateData().then((isValid: boolean) => {
      if (isValid) {
        this.indicatorData.triggerSelected = 0;
        this.indicatorData.category = parseInt(this.indicatorData.category);
        this.indicatorData.dueDate = this._calculationDueDate(this.indicatorData.trigger[this.indicatorData.triggerSelected].durationType, this.indicatorData.trigger[this.indicatorData.triggerSelected].frequencyValue);
        var dataToSave = this.indicatorData;

        var urlToPush;
        var urlToEdit;

        if (this.hazardID == 'countryContext') {
          urlToPush = Constants.APP_STATUS + '/indicator/' + this.countryID;
          ;
          urlToEdit = Constants.APP_STATUS + '/indicator/' + this.countryID + '/' + this.indicatorID;
          ;
        } else {
          urlToPush = Constants.APP_STATUS + '/indicator/' + this.hazardID;
          urlToEdit = Constants.APP_STATUS + '/indicator/' + this.hazardID + '/' + this.indicatorID;
        }

        if (!this.isEdit) {
          this.af.database.list(urlToPush)
            .push(dataToSave)
            .then(() => {
              this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.SUCCESS_MESSAGE_ADD_INDICATOR', AlertMessageType.Success);
              this.indicatorData = new Indicator();
              this.addAnotherSource();
              this.addAnotherLocation();
              this.addIndicatorTrigger();
            }).catch((error: any) => {
            console.log(error, 'You do not have access!')
          });
        } else {
          delete dataToSave.id;
          this.af.database.object(urlToEdit)
            .set(dataToSave)
            .then(() => {
              this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.SUCCESS_MESSAGE_UPDATE_INDICATOR', AlertMessageType.Success);
              return true;
            }).catch((error: any) => {
            console.log(error, 'You do not have access!')
          });
        }

      }
    });

  }

  setNewHazardID(event: any) {
    var hazardID = event.target.value ? event.target.value : false;
    if (!hazardID) {
      console.log('hazardID cannot be empty');
      return false;
    }
    this.hazardID = hazardID;
    this.indicatorData.hazardScenario = this.hazardsObject[hazardID].hazardScenario;
  }

  _getHazards() {
    this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.countryID).subscribe((hazards: any) => {
      this.hazards = [];
      this.hazardsObject = {};
      for (let hazard in hazards) {
        hazards[hazard].key = hazard;
        this.hazards.push(hazards[hazard]);
        this.hazardsObject[hazard] = hazards[hazard];
      }

    });
  }

  _getIndicator(hazardID: string, indicatorID: string) {

    //this.indicatorData = new Indicator();

    if (this.hazardID == 'countryContext') {
      this.url = Constants.APP_STATUS + "/indicator/" + this.countryID + '/' + indicatorID;
    } else {
      this.url = Constants.APP_STATUS + "/indicator/" + hazardID + "/" + indicatorID;
    }

    this.af.database.object(this.url).subscribe((indicator: any) => {
      if (indicator.$value === null) {
        this.router.navigate(['/risk-monitoring']);
        return false;
      }
      indicator.id = indicatorID;
      this.indicatorData.setData(indicator);
    });
  }

  _validateData() {

    let promise = new Promise((res, rej) => {
      this.alertMessage = this.indicatorData.validate();
      if (this.alertMessage) {
        res(false);
      }
      if (!this.alertMessage) {
        this.indicatorData.source.forEach((val, key) => {
          this._validateIndicatorSource(val);
          if (this.alertMessage) {
            res(false);
          }
        });
        this.indicatorData.trigger.forEach((val, key) => {
          this._validateIndicatorTrigger(val);
          if (this.alertMessage) {
            res(false);
          }
        });

        if (!this.alertMessage) {
          if (this.indicatorData.geoLocation == 1) {
            this.indicatorData.affectedLocation.forEach((val, key) => {
              this._validateOperationArea(val);
              if (this.alertMessage) {
                res(false);
              }
            });
          }
        }

        if (!this.alertMessage) {
          res(true);
        }

      }
    });
    return promise;
  }

  _validateIndicatorSource(indicatorSource: IndicatorSourceModel): AlertMessageModel {
    this.alertMessage = indicatorSource.validate();
    return this.alertMessage;
  }

  _validateIndicatorTrigger(indicatorTrigger: IndicatorTriggerModel): AlertMessageModel {
    this.alertMessage = indicatorTrigger.validate();
    return this.alertMessage;
  }

  _validateOperationArea(operationArea: OperationAreaModel): AlertMessageModel {
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
    this.alertMessage = operationArea.validate(excludeFields);
    return this.alertMessage;
  }


  _calculationDueDate(durationType: number, frequencyValue: number) {

    var currentUnixTime = new Date().getTime();
    var CurrentDate = new Date();
    var currentYear = new Date().getFullYear();

    var day = 86400;
    var week = 604800;

    if (durationType == 0) {
      var differenceTime = frequencyValue * week;
    } else if (durationType == 1) {
      var resultDate = CurrentDate.setMonth(CurrentDate.getMonth() + frequencyValue);
      var differenceTime = resultDate - currentUnixTime;
    } else if (durationType == 2) {
      differenceTime = this._getDifferenceTimeByYear(frequencyValue);
    }

    var dueDate = currentUnixTime + differenceTime;
    return dueDate;

  }

  _getDifferenceTimeByYear(years: number) {

    var currentYear = new Date().getFullYear();
    var year = 315036000;
    var leapYear = 31622400;

    var i;
    var differenceTime = 0;
    for (i = 0; i < years; i++) {
      currentYear = currentYear + 1;
      var seconds = this._isLeapYear(currentYear) ? leapYear : year;
      differenceTime = differenceTime + seconds;
    }
    return differenceTime;
  }

  _isLeapYear(year: number) {
    var isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    if (!isLeapYear) {
      return false;
    }
    return true;
  }

  checkTypeof(param: any) {
    if (typeof (param) == 'undefined') {
      return false;
    } else {
      return true;
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
