import {Component, OnDestroy, OnInit, Output} from "@angular/core";
import {AlertLevels, AlertMessageType, DurationType, UserType} from "../../../utils/Enums";
import {Constants} from "../../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../../../services/common.service";
import {OperationAreaModel} from "../../../model/operation-area.model";
import {ModelAlert} from "../../../model/alert.model";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs/Subject";
import {UserService} from "../../../services/user.service";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NotificationService} from "../../../services/notification.service";
import {MessageModel} from "../../../model/message.model";
import {HazardImages} from "../../../utils/HazardImages";
declare var jQuery: any;

@Component({
  selector: 'app-local-agency-create-alert',
  templateUrl: './local-agency-create-alert.component.html',
  styleUrls: ['./local-agency-create-alert.component.scss']
})
export class LocalAgencyCreateAlertComponent implements OnInit {

  private UserType: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private alertMessageType = AlertMessageType;
  private AlertLevels = AlertLevels;
  private alertMessage: AlertMessageModel = null;

  public uid: string;
  private countryID: string;
  private agencyId: string;
  private directorCountryID: string;
  private alertData: any;

  private alertLevels = Constants.ALERT_LEVELS;
  private alertColors = Constants.ALERT_COLORS;
  private alertButtonsClass = Constants.ALERT_BUTTON_CLASS;
  private alertLevelsList: number[] = [AlertLevels.Amber, AlertLevels.Red];

  private durationType = Constants.DURATION_TYPE;
  private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];

  private countries = Constants.COUNTRIES;
  private countriesList = Constants.COUNTRY_SELECTION;
  private frequency = new Array(100);

  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];

  private hazardScenario = Constants.HAZARD_SCENARIOS;

  private hazards: any[] = [];

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private translate: TranslateService,
              private userService: UserService,
              private notificationService: NotificationService) {
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

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.UserType = userType;
      this.agencyId = agencyId;
      this.countryID = countryId;
      this._getHazards();
      this._getDirectorCountryID();



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
        this.alertData.approval['countryDirector'][this.countryID] = (this.alertData.alertLevel == AlertLevels.Red ? this.UserType == UserType.CountryDirector ? 1 : 0 : 1);
        this.alertData.estimatedPopulation = parseInt(this.alertData.estimatedPopulation);

        var dataToSave = this.alertData;

        if (Number.isNaN(+dataToSave.hazardScenario)) {
          // It's a other hazard
          dataToSave.otherName = this.alertData.hazardScenario;
          dataToSave.hazardScenario = -1;
        }
        console.log(dataToSave);

        this.af.database.list(Constants.APP_STATUS + '/alert/' + this.countryID)
          .push(dataToSave)
          .then(() => {

            if (dataToSave.alertLevel == 2) {
              // Send notification to users with Red alert notification
              const redAlertNotificationSetting = 1;
              let riskNameTranslated;
              if (dataToSave.hazardScenario != -1) {
                riskNameTranslated = this.translate.instant(Constants.HAZARD_SCENARIOS[dataToSave.hazardScenario]);
              }
              else {
                riskNameTranslated = dataToSave.otherName;
              }

              let notification = new MessageModel();
              notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RED_ALERT_REQUESTED_TITLE", {riskName: riskNameTranslated});
              notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RED_ALERT_REQUESTED_CONTENT", {riskName: riskNameTranslated});
              notification.time = new Date().getTime();

              this.notificationService.saveUserNotificationBasedOnNotificationSetting(notification, redAlertNotificationSetting, this.agencyId, this.countryID);
            }

            this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_ALERT.SUCCESS_MESSAGE_ADD_ALERT', AlertMessageType.Success);
            this.router.navigateByUrl('dashboard');
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    });
  }


  highlightRadio(){


    console.log(this.alertData.alertLevel);

  }

  _validateOperationArea(operationArea: OperationAreaModel): AlertMessageModel {

    this.alertMessage = operationArea.validate([]);
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
    this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.countryID, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snapshot) => {
        for (let x of snapshot) {
          let value = x.val();
          if (value.hazardScenario == -1) {
            this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + value.otherName, {preserveSnapshot: true})
              .takeUntil(this.ngUnsubscribe)
              .subscribe((snap) => {
                value.hazardName = snap.val().name;
              });
          }
          this.hazards.push(value);
        }
        console.log(this.hazards);
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

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

}
