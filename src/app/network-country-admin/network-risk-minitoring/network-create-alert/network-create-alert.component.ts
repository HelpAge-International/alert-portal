
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from "@angular/core";
import {AlertLevels, AlertMessageType, DurationType, PermissionsAgency, UserType} from "../../../utils/Enums";
import {Constants} from "../../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CommonService} from "../../../services/common.service";
import {NetworkService} from "../../../services/network.service";
import {OperationAreaModel} from "../../../model/operation-area.model";
import {ModelAlert} from "../../../model/alert.model";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {AgencyPermissionObject, PageControlService} from "../../../services/pagecontrol.service";
import {NotificationService} from "../../../services/notification.service";
import {MessageModel} from "../../../model/message.model";
import {HazardImages} from "../../../utils/HazardImages";
import {LocalStorageService} from "angular-2-local-storage";
import {PrepActionService} from "../../../services/prepactions.service";
import {Location} from "@angular/common";


@Component({
  selector: 'app-network-create-alert',
  templateUrl: './network-create-alert.component.html',
  styleUrls: ['./network-create-alert.component.scss']
})
export class NetworkCreateAlertComponent implements OnInit, OnDestroy {
  leadAgencyCountryOffice: string;
  leadAgencyId: any;
  networkCountryId: any;

  private networkViewValues: {}
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
  public permRiskMonitoring = false;

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
  private networkId: any;
  private isViewing: boolean;
  private systemId: string;
  private preSelectCountry: number;

  //phase 2
  private nonMonitoredHazards = Constants.HAZARD_SCENARIO_ENUM_LIST

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private translate: TranslateService,
              private userService: UserService,
              private storage: LocalStorageService,
              private locationService : Location,
              private networkService: NetworkService,
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
    if (this.preSelectCountry >= 0) {
      model.country = this.preSelectCountry
    }
    this.alertData.affectedAreas.push(model);
  }

  removeAnotherArea(key: number,) {
    this.alertData.affectedAreas.splice(key, 1);
  }

  ngOnInit() {

    this.networkViewValues = this.storage.get(Constants.NETWORK_VIEW_VALUES);
    console.log(this.networkViewValues)

    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryID = params["countryId"];
        }
        if (params["networkCountryId"]) {
          this.networkCountryId = params["networkCountryId"];
        }
        if (params["networkId"]) {
          this.networkId = params["networkId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
        if (params["systemId"]) {
          this.systemId = params["systemId"];
        }
        if (params["uid"]) {
          this.uid = params["uid"];
        }

        PageControlService.agencyModuleListMatrix(this.af, this.ngUnsubscribe, this.agencyId , (list: AgencyPermissionObject[]) => {
          for (const value of list) {

            if (value.permission === PermissionsAgency.RiskMonitoring) {
              this.permRiskMonitoring = !value.isAuthorized;
            }

            //PageControlService.agencySelfCheck(this.UserType, this.route, this.router, value);
          }
        });


        if(this.isViewing){
          console.log('viewing')
          this.networkService.getNetworkCountry(this.networkId, this.networkCountryId).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(network => {
              this.leadAgencyId = network.leadAgencyId
              Object.keys(network.agencyCountries[this.leadAgencyId]).forEach(key => {
                this.leadAgencyCountryOffice = key
              })
              this._getHazards();
              this._getDirectorCountryID();

              this.initPreSelection(network)

              this.prepActionService.initActionsWithInfoNetwork(this.af, this.ngUnsubscribe, this.uid,  false, this.networkCountryId, this.networkId, this.systemId)
              console.log('-------if-------')
              console.log(this.prepActionService.actions)
            })

            // get the country levels values
            this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).pipe(
              takeUntil(this.ngUnsubscribe)).subscribe(content => {
              this.countryLevelsValues = content;
              err => console.log(err);
            });
        } else {
          this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
            this.uid = user.uid;

            //get network id
            this.networkService.getSelectedIdObj(user.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(selection => {
                console.log(selection)
                this.networkId = selection["id"];
                this.networkCountryId = selection["networkCountryId"];
                this.UserType = selection["userType"];


                this.networkService.getNetworkCountry(this.networkId, this.networkCountryId).pipe(
                  takeUntil(this.ngUnsubscribe))
                  .subscribe(network => {
                    this.leadAgencyId = network.leadAgencyId
                    Object.keys(network.agencyCountries[this.leadAgencyId]).forEach(key => {
                      this.leadAgencyCountryOffice = key
                    })

                    this._getHazards();
                    this._getDirectorCountryID();

                    //get pre-select country and default to this location
                    this.initPreSelection(network);

                    this.prepActionService.initActionsWithInfoNetwork(this.af, this.ngUnsubscribe, this.uid,  false, this.networkCountryId, this.networkId, this.systemId)
                    console.log('-------else-------')
                    console.log(this.prepActionService.actions)
                  })
              })

            // get the country levels values
            this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).pipe(
              takeUntil(this.ngUnsubscribe)).subscribe(content => {
              this.countryLevelsValues = content;
              err => console.log(err);
            });
          });
        }


      })

  }

  private initPreSelection(network) {
    this.preSelectCountry = network.location
    this.alertData.affectedAreas.forEach(area => {
      area.country = network.location
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
        this.alertData.approval['countryDirector'][this.leadAgencyCountryOffice] = (this.alertData.alertLevel == AlertLevels.Red ? this.UserType == UserType.CountryDirector ? 1 : 0 : 1);
        this.alertData.estimatedPopulation = parseInt(this.alertData.estimatedPopulation);

        var dataToSave = this.alertData;

        if (Number.isNaN(+dataToSave.hazardScenario)) {
          // It's a other hazard
          dataToSave.otherName = this.alertData.hazardScenario;
          dataToSave.hazardScenario = -1;
        }
        console.log(dataToSave);



        this.af.database.list(Constants.APP_STATUS + '/alert/' + this.networkCountryId)
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
                    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.networkCountryId + '/' + hazard.id + '/timeTracking/' + alert.key)
                    .update(hazardTrackingNode)
                  }else{
                    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.networkCountryId + '/' + hazard.id + '/timeTracking/' + alert.key)
                    .update({timeSpentInRed: [newTimeObject]})
                  }

                }
              }else{
                if(hazardTrackingNode){
                  hazardTrackingNode.push(newTimeObject)
                  this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.networkCountryId + '/' + hazard.id + '/timeTracking/' + alert.key)
                  .update(hazardTrackingNode)
                }else{
                  this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.networkCountryId + '/' + hazard.id + '/timeTracking/' + alert.key)
                  .update({timeSpentInAmber: [newTimeObject]})
                }

              }
            }

            if(dataToSave.alertLevel == AlertLevels.Red){
              if(this.UserType == UserType.CountryDirector){
                  this.af.database.object(Constants.APP_STATUS + '/alert/' + this.networkCountryId + '/' + alert.key + '/timeTracking/')
                  .update({timeSpentInRed: [newTimeObject]})
              }
            }else{
                this.af.database.object(Constants.APP_STATUS + '/alert/' + this.networkCountryId + '/' + alert.key + '/timeTracking/')
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

              let affectedActions = this.prepActionService.actions.filter(action => action.assignedHazards.includes(dataToSave.hazardScenario) || action.assignedHazards && action.assignedHazards.length == 0)

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
                      this.af.database.object(Constants.APP_STATUS + '/action/' + this.networkCountryId + '/' + action.id)
                      .update(action)
                    }
                  }

                })
              }

              affectedActions.forEach( affectedAction => {
                // push activated datetime to each apa
                let action = this.prepActionService.findAction(affectedAction.id);
                action["raisedAt"] = new Date().getTime();
                console.log(action)
                console.log(Constants.APP_STATUS + '/action/' + this.networkCountryId + affectedAction.id)
                this.af.database.object(Constants.APP_STATUS + '/action/' + this.networkCountryId + '/' + affectedAction.id)
                  .update(action)

              })

              let notification = new MessageModel();
              notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RED_ALERT_REQUESTED_TITLE", {riskName: riskNameTranslated});
              notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RED_ALERT_REQUESTED_CONTENT", {riskName: riskNameTranslated});
              notification.time = new Date().getTime();

              this.notificationService.saveUserNotificationBasedOnNotificationSetting(notification, redAlertNotificationSetting, this.leadAgencyId, this.leadAgencyCountryOffice);
            }

            this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_ALERT.SUCCESS_MESSAGE_ADD_ALERT', AlertMessageType.Success);
            this.router.navigate(this.networkViewValues ? ['/network-country/network-dashboard', this.networkViewValues] : ['/network-country/network-dashboard']);
          }).catch((error: any) => {
          console.log(error, 'You do not have access!')
        });
      }
    });
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
    this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.networkCountryId, {preserveSnapshot: true})
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

  _getDirectorCountryID() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + this.leadAgencyCountryOffice).takeUntil(this.ngUnsubscribe).subscribe((directorCountryID: any) => {
        console.log(directorCountryID)

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

  goBack(){
    if(this.permRiskMonitoring){
      this.locationService.back();
    }else{
      if(this.networkViewValues){
        this.router.navigate(['/network-country/network-risk-monitoring', this.networkViewValues])
      }else{
        this.router.navigateByUrl('/network-country/network-risk-monitoring')
      }
    }
  }

}
