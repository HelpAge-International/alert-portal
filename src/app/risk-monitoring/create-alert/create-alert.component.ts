
import {Component, OnDestroy, OnInit} from "@angular/core";
import {AlertLevels, AlertMessageType, DurationType, UserType} from "../../utils/Enums";
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
import {NotificationService} from "../../services/notification.service";
import {MessageModel} from "../../model/message.model";
import {HazardImages} from "../../utils/HazardImages";
import {PrepActionService} from "../../services/prepactions.service";

declare var jQuery: any;

@Component({
  selector: 'app-create-alert',
  templateUrl: './create-alert.component.html',
  styleUrls: ['./create-alert.component.css']
})

export class CreateAlertRiskMonitoringComponent implements OnInit, OnDestroy {

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
  private hazardScenarioEnum = Constants.HAZARD_SCENARIO_ENUM_LIST;

  private hazards: any[] = [];
  private preSelectedCountry: number;

  //phase 2
  private nonMonitoredHazards = Constants.HAZARD_SCENARIO_ENUM_LIST


  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private translate: TranslateService,
              private userService: UserService,
              private prepActionService: PrepActionService,
              private notificationService: NotificationService) {
    this.initAlertData();
  }

  initAlertData() {
    this.alertData = new ModelAlert();
    this.addAnotherAreas();
  }

  addAnotherAreas() {
    let model = new OperationAreaModel()
    if (this.preSelectedCountry >= 0) {
      model.country = this.preSelectedCountry
    }
    this.alertData.affectedAreas.push(model);
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

      //init country location
      this.userService.getCountryDetail(this.countryID, this.agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(country => {
          this.preSelectedCountry = country.location
          this.alertData.affectedAreas.forEach(area => {
            area.country = country.location
          })
        })

      this.prepActionService.initActionsWithInfo(this.af, this.ngUnsubscribe, this.uid, this.UserType, false, this.countryID, this.agencyId, systemId)
      console.log(this.prepActionService.actions)
    })

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
        dataToSave.hazardScenario = parseInt(dataToSave.hazardScenario)


        this.af.database.list(Constants.APP_STATUS + '/alert/' + this.countryID)
          .push(dataToSave)
          .then(alert => {

            let hazard = this.hazards.find(x => x.hazardScenario == dataToSave.hazardScenario)
            let hazardTrackingNode;

            if(hazard && hazard.timeTracking && hazard.timeTracking[alert.key]){
              hazardTrackingNode = hazard.timeTracking ? hazard.timeTracking[alert.key] : undefined;
            }

            let currentTime = new Date().getTime()
            let newTimeObject = {start: currentTime, finish: -1,level: dataToSave.alertLevel};

            if(hazard){
              if(dataToSave.alertLevel == AlertLevels.Red){
                if(this.UserType == UserType.CountryDirector){
                  if(hazardTrackingNode){
                    hazardTrackingNode.push(newTimeObject)
                    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.countryID + '/' + hazard.id + '/timeTracking/' + alert.key)
                    .update({timeSpentInRed: hazardTrackingNode})
                  }else{
                    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.countryID + '/' + hazard.id + '/timeTracking/' + alert.key)
                    .update({timeSpentInRed: [newTimeObject]})
                  }

                }
              }else{
                if(hazardTrackingNode){
                  hazardTrackingNode.push(newTimeObject)
                  this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.countryID + '/' + hazard.id + '/timeTracking/' + alert.key)
                  .update({timeSpentInAmber: hazardTrackingNode})
                }else{
                  this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.countryID + '/' + hazard.id + '/timeTracking/' + alert.key)
                  .update({timeSpentInAmber: [newTimeObject]})
                }

              }
            }

            if(dataToSave.alertLevel == AlertLevels.Red){
              if(this.UserType == UserType.CountryDirector){
                  this.af.database.object(Constants.APP_STATUS + '/alert/' + this.countryID + '/' + alert.key + '/timeTracking/')
                  .update({timeSpentInRed: [newTimeObject]})
              }
            }else{
                this.af.database.object(Constants.APP_STATUS + '/alert/' + this.countryID + '/' + alert.key + '/timeTracking/')
                .update({timeSpentInAmber: [newTimeObject]})
            }


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

              let affectedActions = this.prepActionService.actions.filter(action => action.assignedHazards.includes(dataToSave.hazardScenario))

              affectedActions.forEach( affectedAction => {
                // push activated datetime to each apa
                let action = this.prepActionService.findAction(affectedAction.id);
                action["raisedAt"] = new Date().getTime();

                this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryID + '/' + affectedAction.id)
                  .update(action)

              })


              let apaActions = this.prepActionService.actions.filter(action => action.level == 2)

              if(this.UserType == UserType.CountryDirector){
                apaActions.forEach( action => {
                  if(!action["redAlerts"]){
                    action["redAlerts"] = [];
                  }

                  if(!action["timeTracking"]){
                    action["timeTracking"] = {};
                  }

                  if(action.assignedHazards && action.assignedHazards.length == 0 || action.assignedHazards.includes(dataToSave.hazardScenario)){
                    if(action["timeTracking"]["timeSpentInGrey"] && action["timeTracking"]["timeSpentInGrey"].find(x => x.finish == -1)){
                      action["redAlerts"].push(alert.key);


                      action["timeTracking"]["timeSpentInGrey"][action["timeTracking"]["timeSpentInGrey"].findIndex(x => x.finish == -1)].finish = currentTime;

                      if(!action.asignee){
                        if(!action["timeTracking"]["timeSpentInRed"]){
                          action['timeTracking']['timeSpentInRed'] = [];
                        }
                        action['timeTracking']['timeSpentInRed'].push(newTimeObject)
                      }else if(action.isComplete){
                        if(!action["timeTracking"]["timeSpentInGreen"]){
                          action['timeTracking']['timeSpentInGreen'] = [];
                        }
                        action['timeTracking']['timeSpentInGreen'].push(newTimeObject)
                      }else{
                        if(!action["timeTracking"]["timeSpentInAmber"]){
                          action['timeTracking']['timeSpentInAmber'] = [];
                        }
                        action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
                      }
                      this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryID + '/' + action.id)
                      .update(action)
                    }
                  }
                })
              }



              let notification = new MessageModel();
              notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RED_ALERT_REQUESTED_TITLE", {riskName: riskNameTranslated});
              notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RED_ALERT_REQUESTED_CONTENT", {riskName: riskNameTranslated});
              notification.time = new Date().getTime();

              this.notificationService.saveUserNotificationBasedOnNotificationSetting(notification, redAlertNotificationSetting, this.agencyId, this.countryID);
            }


            this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_ALERT.SUCCESS_MESSAGE_ADD_ALERT', AlertMessageType.Success);
            this.router.navigateByUrl('dashboard');
          })
          .catch((error: any) => {
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

  highlightRadio() {


    console.log(this.alertData.alertLevel);

  }

  _validateOperationArea(operationArea: OperationAreaModel): AlertMessageModel {
    // let excludeFields = [];
    // let countryLevel1Exists = operationArea.country
    //   && this.countryLevelsValues[operationArea.country].levelOneValues
    //   && this.countryLevelsValues[operationArea.country].levelOneValues.length > 0;
    // if (!countryLevel1Exists) {
    //   excludeFields.push("level1", "level2");
    // } else if (countryLevel1Exists && operationArea.level1
    //   && (!this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].levelTwoValues
    //   || this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level2].length < 1)) {
    //   excludeFields.push("level2");
    // }
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
          } else {
            let index = this.nonMonitoredHazards.indexOf(value.hazardScenario)
            if (index != -1) {
              this.nonMonitoredHazards.splice(index, 1)
            }
          }
          console.log(x)
          value.id = x.key
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
