
import {takeUntil} from 'rxjs/operators';
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
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {AgencyService} from "../../../services/agency-service.service"
import {PageControlService} from "../../../services/pagecontrol.service";
import {NotificationService} from "../../../services/notification.service";
import {MessageModel} from "../../../model/message.model";
import {HazardImages} from "../../../utils/HazardImages";
import {PrepActionService} from "../../../services/prepactions.service";
import {INT_TYPE} from "@angular/compiler/src/output/output_ast";
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
  private initialLocation : number;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];

  private hazardScenario = Constants.HAZARD_SCENARIOS;

  private hazards: any[] = [];

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
              private notificationService: NotificationService,
              private agencyService : AgencyService) {

    this.initAlertData();
  }

  initAlertData() {
    this.alertData = new ModelAlert();
    this.addAnotherAreas();
  }

  addAnotherAreas() {
    var area = new OperationAreaModel()
    area.country = this.initialLocation
    this.alertData.affectedAreas.push(area);
  }

  removeAnotherArea(key: number,) {
    this.alertData.affectedAreas.splice(key, 1);
  }

  ngOnInit() {

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.UserType = userType;
      this.agencyId = agencyId;

      this._getHazards();
      this._getDirectorLocalAgencyId();

      this.prepActionService.initActionsWithInfoLocalAgency(this.af, this.ngUnsubscribe, this.uid, this.UserType, false, this.agencyId, systemId)
      
      this.agencyService.getAgency(this.agencyId).takeUntil(this.ngUnsubscribe).subscribe(agency => {
        this.initialLocation = agency.countryCode;
        this.alertData.affectedAreas[0].country = this.initialLocation;
      })
      // this.userService.getCountryDetail(this.countryID, this.agencyId).takeUntil(this.ngUnsubscribe).subscribe(detail => {
      //   console.log(detail)
      //   this.initialLocation = detail.location;
      // });


      console.log(this.prepActionService.actions)
      this.prepActionService.initActionsWithInfoLocalAgency(this.af, this.ngUnsubscribe, this.uid, this.UserType, false, this.agencyId, systemId);

      // get the country levels values
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).pipe(
        takeUntil(this.ngUnsubscribe)).subscribe(content => {
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
        this.alertData.approval['localAgencyDirector'] = [];
        this.alertData.approval['localAgencyDirector'][this.agencyId] = (this.alertData.alertLevel == AlertLevels.Red ? this.UserType == UserType.LocalAgencyDirector ? 1 : 0 : 1);
        this.alertData.estimatedPopulation = parseInt(this.alertData.estimatedPopulation);

        var dataToSave = this.alertData;

        if (Number.isNaN(+dataToSave.hazardScenario)) {
          // It's a other hazard
          dataToSave.otherName = this.alertData.hazardScenario;
          dataToSave.hazardScenario = -1;
        }
        console.log(dataToSave);



        this.af.database.list(Constants.APP_STATUS + '/alert/' + this.agencyId)
          .push(dataToSave)
          .then(alert => {
            
            let hazard = this.hazards.find(x => x.hazardScenario == dataToSave.hazardScenario)
            let hazardTrackingNode;

            if(hazard && hazard.timeTracking && hazard.timeTracking[alert.key]){
              hazardTrackingNode = hazard.timeTracking ? hazard.timeTracking[alert.key] : null;
            }

            let currentTime = new Date().getTime()
            let newTimeObject = {start: currentTime, finish: -1,level: dataToSave.alertLevel};


            if(hazard){
              if(dataToSave.alertLevel == AlertLevels.Red){
                if(this.UserType == UserType.CountryDirector){
                  if(hazardTrackingNode){
                    hazardTrackingNode.push(newTimeObject)
                    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.agencyId + '/' + hazard.id + '/timeTracking/' + alert.key)
                    .update(hazardTrackingNode)
                  }else{
                    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.agencyId + '/' + hazard.id + '/timeTracking/' + alert.key)
                    .update({timeSpentInRed: [newTimeObject]})
                  }

                }
              }else{
                if(hazardTrackingNode){
                  hazardTrackingNode.push(newTimeObject)
                  this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.agencyId + '/' + hazard.id + '/timeTracking/' + alert.key)
                  .update(hazardTrackingNode)
                }else{
                  this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.agencyId + '/' + hazard.id + '/timeTracking/' + alert.key)
                  .update({timeSpentInAmber: [newTimeObject]})
                }

              }
            }

            if(dataToSave.alertLevel == AlertLevels.Red){
              if(this.UserType == UserType.CountryDirector){
                  this.af.database.object(Constants.APP_STATUS + '/alert/' + this.agencyId + '/' + alert.key + '/timeTracking/')
                  .update({timeSpentInRed: [newTimeObject]})
              }
            }else{
                this.af.database.object(Constants.APP_STATUS + '/alert/' + this.agencyId + '/' + alert.key + '/timeTracking/')
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

              console.log(this.prepActionService.actions)
              console.log(dataToSave.hazardScenario)
              let affectedActions = this.prepActionService.actions.filter(action => action.assignedHazards.includes(dataToSave.hazardScenario) || action.assignedHazards && action.assignedHazards.length == 0)

              let apaActions = this.prepActionService.actions.filter(action => action.level == 2)


              if(this.UserType == UserType.LocalAgencyDirector){
                apaActions.forEach( action => {
                  if(!action["redAlerts"]){
                    action["redAlerts"] = [];
                  }
                  if(!action["timeTracking"]){
                    action["timeTracking"] = {};
                  }

                  if(action.assignedHazards && (action.assignedHazards.length == 0 || action.assignedHazards.includes(dataToSave.hazardScenario))){
                    if(action["timeTracking"]["timeSpentInGrey"] && action["timeTracking"]["timeSpentInGrey"].find(x => x.finish == -1) != -1){
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
                      this.af.database.object(Constants.APP_STATUS + '/action/' + this.agencyId + '/' + action.id)
                      .update(action)
                    }
                  }
                })
              }

              let raisedAt = new Date().getTime();

              affectedActions.forEach( affectedAction => {
                // push activated datetime to each apa
                let action = this.prepActionService.findAction(affectedAction.id);
                action["raisedAt"] = raisedAt;
                console.log(action)
                console.log(Constants.APP_STATUS + '/action/' + this.agencyId + affectedAction.id)
                this.af.database.object(Constants.APP_STATUS + '/action/' + this.agencyId + '/' + affectedAction.id)
                  .update(action)

              })

              let notification = new MessageModel();
              notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RED_ALERT_REQUESTED_TITLE", {riskName: riskNameTranslated});
              notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RED_ALERT_REQUESTED_CONTENT", {riskName: riskNameTranslated});
              notification.time = new Date().getTime();

              this.notificationService.saveUserNotificationBasedOnNotificationSettingLocalAgency(notification, redAlertNotificationSetting, this.agencyId);
            }

            this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_ALERT.SUCCESS_MESSAGE_ADD_ALERT', AlertMessageType.Success);
            this.router.navigateByUrl('local-agency/dashboard');
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    });
  }


  highlightRadio(isRed : boolean){

    if(isRed) {
      this.alertData.alertLevel = 2
    }
    else {
      this.alertData.alertLevel = 1
    }

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
    this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.agencyId, {preserveSnapshot: true})
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
          value.id = x.key
          this.hazards.push(value);
        }
        console.log(this.hazards);
      });
  }

  _getDirectorLocalAgencyId() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/directorLocalAgency/" + this.agencyId).takeUntil(this.ngUnsubscribe).subscribe((directorLocalAgencyId: any) => {
        this.directorCountryID = directorLocalAgencyId.$value ? directorLocalAgencyId.$value : false;

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

  getCSSHazard(hazard: any) {
    let value = (typeof hazard == "string") ? parseInt(hazard) : hazard
    return HazardImages.init().getCSS(value);
  }

}
