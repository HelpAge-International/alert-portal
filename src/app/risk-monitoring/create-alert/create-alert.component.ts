import {Component, OnDestroy, OnInit} from "@angular/core";
import {AlertLevels, AlertMessageType, Countries, DurationType} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../../services/common.service";
import {OperationAreaModel} from "../../model/operation-area.model";
import {ModelAlert} from "../../model/alert.model";
import {AlertMessageModel} from "../../model/alert-message.model";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs/Subject";
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-create-alert',
  templateUrl: './create-alert.component.html',
  styleUrls: ['./create-alert.component.css']
})
export class CreateAlertRiskMonitoringComponent implements OnInit, OnDestroy {

  private UserType: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  public uid: string;
  private countryID: string;
  private directorCountryID: string;
  private alertData: any;

  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertButtonsClass = Constants.ALERT_BUTTON_CLASS;
  private alertLevelsList: number[] = [AlertLevels.Amber, AlertLevels.Red];

  private durationType = Constants.DURATION_TYPE;
  private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];

  private countries = Constants.COUNTRIES;
  private countriesList: number[] = [
    Countries.GB, Countries.FR, Countries.DE, Countries.AF, Countries.AX,
    Countries.AX, Countries.DZ, Countries.AS, Countries.AD, Countries.AO,
    Countries.AI, Countries.AQ, Countries.AG, Countries.AR, Countries.AM,
    Countries.AW, Countries.AU, Countries.AT, Countries.AZ, Countries.BS,
    Countries.BH, Countries.BD, Countries.BB, Countries.BY, Countries.BY,
    Countries.BZ, Countries.BJ, Countries.BM, Countries.BT, Countries.BO,
    Countries.BQ, Countries.BA, Countries.BW, Countries.BV, Countries.BR,
    Countries.IO, Countries.BN, Countries.BG, Countries.BF, Countries.BI,
    Countries.KH, Countries.CM, Countries.CA, Countries.CV, Countries.KY,
    Countries.CF, Countries.TD, Countries.CL, Countries.CN, Countries.CX,
    Countries.CC, Countries.CO, Countries.KM, Countries.CG, Countries.CD,
    Countries.CK, Countries.CR, Countries.CI, Countries.HR, Countries.CU,
    Countries.CW, Countries.CY, Countries.CZ, Countries.DK, Countries.DJ,
    Countries.DM, Countries.DO, Countries.EC, Countries.EG, Countries.SV,
    Countries.GQ, Countries.ER, Countries.EE, Countries.ET, Countries.FK,
    Countries.FO, Countries.FJ, Countries.FI, Countries.GF, Countries.PF,
    Countries.TF, Countries.GA, Countries.GM, Countries.GE, Countries.GH,
    Countries.GI, Countries.GR, Countries.GL, Countries.GD, Countries.GP,
    Countries.GU, Countries.GT, Countries.GG, Countries.GN, Countries.GW,
    Countries.GY, Countries.HT, Countries.HM, Countries.VA, Countries.HN,
    Countries.HK, Countries.HU, Countries.IS, Countries.IN, Countries.ID,
    Countries.IR, Countries.IQ, Countries.IE, Countries.IM, Countries.IL,
    Countries.IT, Countries.JM, Countries.JP, Countries.JE, Countries.JO,
    Countries.KZ, Countries.KE, Countries.KE, Countries.KI, Countries.KP,
    Countries.KR, Countries.KW, Countries.KG, Countries.LA, Countries.LV,
    Countries.LB, Countries.LS, Countries.LR, Countries.LY, Countries.LI,
    Countries.LT, Countries.LU, Countries.MO, Countries.MK, Countries.MG,
    Countries.MW, Countries.MY, Countries.MV, Countries.ML, Countries.MT,
    Countries.MH, Countries.MQ, Countries.MR, Countries.MU, Countries.YT,
    Countries.MX, Countries.FM, Countries.MD, Countries.MC, Countries.MN,
    Countries.ME, Countries.MS, Countries.MA, Countries.MZ, Countries.MM,
    Countries.NA, Countries.NR, Countries.NP, Countries.NL, Countries.NC,
    Countries.NZ, Countries.NI, Countries.NE, Countries.NG, Countries.NU,
    Countries.NF, Countries.MP, Countries.NO, Countries.OM, Countries.PK,
    Countries.PW, Countries.PS, Countries.PA, Countries.PG, Countries.PY,
    Countries.PE, Countries.PH, Countries.PN, Countries.PL, Countries.PT,
    Countries.PR, Countries.QA, Countries.RE, Countries.RO, Countries.RU,
    Countries.RW, Countries.BL, Countries.SH, Countries.KN, Countries.LC,
    Countries.MF, Countries.PM, Countries.VC, Countries.WS, Countries.SM,
    Countries.ST, Countries.SA, Countries.SN, Countries.RS, Countries.SC,
    Countries.SL, Countries.SG, Countries.SX, Countries.SK, Countries.SI,
    Countries.SB, Countries.SO, Countries.ZA, Countries.GS, Countries.SS,
    Countries.ES, Countries.LK, Countries.SD, Countries.SR, Countries.SJ,
    Countries.SZ, Countries.SE, Countries.CH, Countries.SY, Countries.TW,
    Countries.TJ, Countries.TZ, Countries.TH, Countries.TL, Countries.TG,
    Countries.TK, Countries.TO, Countries.TT, Countries.TN, Countries.TR,
    Countries.TM, Countries.TC, Countries.TV, Countries.UG, Countries.UA,
    Countries.AE, Countries.US, Countries.UM, Countries.UY, Countries.UZ,
    Countries.VU, Countries.VE, Countries.VN, Countries.VG, Countries.VI,
    Countries.WF, Countries.EH, Countries.YE, Countries.ZM, Countries.ZW
  ];
  private frequency = new Array(100);

  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];

  private hazardScenario = Constants.HAZARD_SCENARIOS;

  private hazards: any[] = [];

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private _commonService: CommonService, private translate: TranslateService, private userService: UserService) {
    this.initAlertData();
  }

  initAlertData() {
    this.alertData = new ModelAlert();
    this.addAnotherAreas();
  }

  addAnotherAreas() {
    this.alertData.affectedAreas.push(new OperationAreaModel());
  }

  removeAnotherArea(key: number,) {
    this.alertData.affectedAreas.splice(key, 1);
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.UserType = userType;

      this._getCountryID().then(() => {
        this._getHazards();
        this._getDirectorCountryID();
      });

      // get the country levels values
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
        .takeUntil(this.ngUnsubscribe).subscribe(content => {
        this.countryLevelsValues = content;
        err => console.log(err);
      });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  saveAlert() {

    if (!this.directorCountryID) {
      this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_DIRECTOR_COUNTRY_ID');
      return false;
    }

    this._validateData().then((isValid: boolean) => {
      if (isValid) {

        this.alertData.createdBy = this.uid;
        this.alertData.timeCreated = this._getCurrentTimestamp();
        this.alertData.approval['countryDirector'] = [];
        this.alertData.approval['countryDirector'][this.directorCountryID] = 0;
        this.alertData.estimatedPopulation = parseInt(this.alertData.estimatedPopulation);

        var dataToSave = this.alertData;

        this.af.database.list(Constants.APP_STATUS + '/alert/' + this.countryID)
          .push(dataToSave)
          .then(() => {
            this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_ALERT.SUCCESS_MESSAGE_ADD_ALERT', AlertMessageType.Success);
            this.initAlertData();
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    });
  }

  _getCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.UserType] + "/" + this.uid + '/countryId').takeUntil(this.ngUnsubscribe).subscribe((countryID: any) => {
        this.countryID = countryID.$value ? countryID.$value : "";
        res(true);
      });
    });
    return promise;
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
      || this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level2].length < 1)) {
      excludeFields.push("level2");
    }
    this.alertMessage = operationArea.validate(excludeFields);
    return this.alertMessage;
  }

  _validateData() {
    let promise = new Promise((res, rej) => {

      var excludedFields = [];
      if (typeof (this.alertData.alertLevel) == 'undefined' || this.alertData.alertLevel == 1) {
        excludedFields.push('reasonForRedAlert');
      }

      this.alertMessage = this.alertData.validate(excludedFields);
      if (this.alertMessage) {
        res(false);
      }
      if (!this.alertMessage) {
        if (!this.alertMessage) {
          this.alertData.affectedAreas.forEach((val, key) => {
            this._validateOperationArea(val);
            if (this.alertMessage) {
              res(false);
            }
          });
        }

        if (!this.alertMessage) {
          res(true);
        }

      }
    });
    return promise;
  }

  _getHazards() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.countryID).takeUntil(this.ngUnsubscribe).subscribe((hazards: any) => {
        this.hazards = [];
        for (let hazard in hazards) {
          hazards[hazard].imgName = this.translate.instant(this.hazardScenario[hazards[hazard].hazardScenario]).replace(" ", "_");
          this.hazards.push(hazards[hazard]);
        }
      });
    });
  }

  _getDirectorCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + this.countryID).takeUntil(this.ngUnsubscribe).subscribe((directorCountryID: any) => {
        this.directorCountryID = directorCountryID.$value ? directorCountryID.$value : false;

      });
    });
    return promise;
  }

  _getCurrentTimestamp() {
    var currentTimeStamp = new Date().getTime();
    return currentTimeStamp;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  checkTypeof(param: any) {
    if (typeof (param) == 'undefined') {
      return false;
    } else {
      return true;
    }
  }

  _keyPress(event: any) {
    const pattern = /[0-9\.\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar) && event.charCode) {
      // invalid character, prevent input
      event.preventDefault();
      this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_ALERT.ERROR_ONLY_NUMBERS', AlertMessageType.Error);
    }
  }


}
