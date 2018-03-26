
import { UserType } from './../../utils/Enums';
import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Subject} from "rxjs/Subject";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {AlertLevels, AlertStatus} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {UserService} from "../../services/user.service";
import {OperationAreaModel} from "../../model/operation-area.model";
import {CommonService} from "../../services/common.service";
import {HazardImages} from "../../utils/HazardImages";
import {NetworkService} from "../../services/network.service";
import * as moment from "moment";
import {PrepActionService} from "../../services/prepactions.service";


@Component({
  selector: 'app-dashboard-update-alert-level',
  templateUrl: './dashboard-update-alert-level.component.html',
  styleUrls: ['./dashboard-update-alert-level.component.css'],
  providers: [ActionsService]
})
export class DashboardUpdateAlertLevelComponent implements OnInit, OnDestroy {

  private HAZARDS: string[] = Constants.HAZARD_SCENARIOS;
  private COUNTRIES: string[] = Constants.COUNTRIES;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private uid: string;
  private alertId: string;
  private countryId: string;
  private agencyId: string;
  private loadedAlert: ModelAlert;
  private reasonForRedAlert: string;
  private infoNotes: string;
  private estimatedPopulation: number;
  private geoMap = new Map();
  private temp = [];
  private preAlertLevel: AlertLevels;
  private isDirector: boolean;
  private isLocalAgency: boolean = false;

  private countries = Constants.COUNTRIES;
  private countriesList = Constants.COUNTRY_SELECTION;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];
  private userType: number;
  private hazards: any[] = [];
  private nonMonitoredHazards = Constants.HAZARD_SCENARIO_ENUM_LIST
  private loadedAlertLevel: AlertLevels;
  private systemId
  private alerts

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private route: ActivatedRoute,
              private alertService: ActionsService,
              private networkService: NetworkService,
              private userService: UserService,
              private prepActionService: PrepActionService) {
    this.initAlertData();
  }

  initAlertData() {
    this.loadedAlert = new ModelAlert();
    this.addAnotherAreas();
  }

  addAnotherAreas() {
    console.log(this.loadedAlert.affectedAreas);
    this.loadedAlert.affectedAreas.push(new OperationAreaModel());
  }

  removeAnotherArea(key: number,) {
    this.loadedAlert.affectedAreas.splice(key, 1);
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.systemId = systemId
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.userType = userType;
      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((param: Params) => {
          if (param['agencyId']) {
            this.agencyId = param['agencyId'];
            this.isLocalAgency = true;
          }
          if (param['id']) {
            this.alertId = param['id'];
            this.countryId = param['countryId'];
            this.isDirector = param['isDirector'];
            this.isLocalAgency ? this.loadAlertLocalAgency(this.alertId, this.agencyId) : this.loadAlert(this.alertId, this.countryId);
          }

          this._getHazards()

        });

      // get the country levels values
      this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
        .takeUntil(this.ngUnsubscribe).subscribe(content => {
        this.countryLevelsValues = content;
        err => console.log(err);
      });
    });
  }

  private loadAlert(alertId: string, countryId: string) {


    this.prepActionService.initActionsWithInfo(this.af, this.ngUnsubscribe, this.uid, this.userType, false, this.countryId, this.agencyId, this.systemId)

    this.alertService.getAlerts(this.countryId, false)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(alerts => {
        this.alerts = alerts;

      this.alertService.getAlert(alertId, countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((alert: ModelAlert) => {
          console.log(alert)
          this.loadedAlertLevel = alert.alertLevel;
          this.loadedAlert = alert;
          this.estimatedPopulation = this.loadedAlert.estimatedPopulation;
          this.infoNotes = this.loadedAlert.infoNotes;
          this.reasonForRedAlert = this.loadedAlert.reasonForRedAlert;
          this.preAlertLevel = this.loadedAlert.alertLevel;
          let x: any[] = [];
          for (let y of this.loadedAlert.affectedAreas) {
            let operationArea: OperationAreaModel = new OperationAreaModel();
            operationArea.country = y.affectedCountry;
            operationArea.level1 = y.affectedLevel1;
            operationArea.level2 = y.affectedLevel2;
            x.push(operationArea);
          }

          this.loadedAlert.affectedAreas.forEach(area => {
            this.alertService.getAllLevelInfo(area.affectedCountry)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(geoInfo => {
                this.geoMap.set(area.affectedCountry, geoInfo);
              });
          });

          this.loadedAlert.affectedAreas = x;

          console.log(this.loadedAlert);
        });
    })
  }

  private loadAlertLocalAgency(alertId: string, agencyId: string) {


    this.prepActionService.initActionsWithInfoLocalAgency(this.af, this.ngUnsubscribe, this.uid, this.userType, false, this.countryId, this.agencyId, this.systemId)

    this.alertService.getAlerts(this.countryId, false)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(alerts => {
        this.alerts = alerts;

        this.alertService.getAlertLocalAgency(alertId, agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((alert: ModelAlert) => {
            this.loadedAlertLevel = alert.alertLevel;
            this.loadedAlert = alert;
            this.estimatedPopulation = this.loadedAlert.estimatedPopulation;
            this.infoNotes = this.loadedAlert.infoNotes;
            this.reasonForRedAlert = this.loadedAlert.reasonForRedAlert;
            this.preAlertLevel = this.loadedAlert.alertLevel;
            let x: any[] = [];
            for (let y of this.loadedAlert.affectedAreas) {
              let operationArea: OperationAreaModel = new OperationAreaModel();
              operationArea.country = y.affectedCountry;
              operationArea.level1 = y.affectedLevel1;
              operationArea.level2 = y.affectedLevel2;
              x.push(operationArea);
            }

            this.loadedAlert.affectedAreas.forEach(area => {
              this.alertService.getAllLevelInfo(area.affectedCountry)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(geoInfo => {
                  this.geoMap.set(area.affectedCountry, geoInfo);
                });
            });

            this.loadedAlert.affectedAreas = x;

          });
    })
  }


  selectedAlertLevel(selection) {
    this.loadedAlert.alertLevel = selection;
  }


  submit() {


    let hazard = this.hazards.find(x => x.hazardScenario == this.loadedAlert.hazardScenario)
    let hazardTrackingNode;

    if(hazard && hazard.timeTracking && hazard.timeTracking[this.loadedAlert.id]){
      hazardTrackingNode = hazard ? hazard.timeTracking[this.loadedAlert.id] : undefined;
    }

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1,level: this.loadedAlert.alertLevel};
    let id = this.isLocalAgency ? this.agencyId : this.countryId;



    let apaActions = this.prepActionService.actions.filter(action => action.level == 2)

    if(this.loadedAlertLevel != this.loadedAlert.alertLevel && (this.userType == UserType.CountryDirector || this.userType == UserType.LocalAgencyDirector)){

        apaActions.forEach( action => {

          if(!action["redAlerts"]){
            action["redAlerts"] = [];
          }

          if(!action["timeTracking"]){
            action["timeTracking"] = {};
          }

          // Update action tracking inactive -> some active state

          if(action.assignedHazards && action.assignedHazards.length == 0 || action.assignedHazards.includes(this.loadedAlert.hazardScenario)){
            if(action["timeTracking"]["timeSpentInGrey"] && action["timeTracking"]["timeSpentInGrey"].find(x => x.finish == -1)){
                action["redAlerts"].push(this.loadedAlert.id);

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

                if(this.loadedAlert.alertLevel == AlertLevels.Red){
                  this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id)
                  .update(action)
                }
              }
          }

          //update action tracking active -> inactive
          if(this.loadedAlertLevel == AlertLevels.Red){
            let isOtherRedAlert = false;
            if(this.isLocalAgency){

                this.alerts.forEach( alert => {
                  if(alert.hazardScenario == this.loadedAlert.hazardScenario && alert.$key != this.loadedAlert.id && alert.alertLevel == AlertLevels.Red){
                    isOtherRedAlert == true;
                  }
                })

                if(!isOtherRedAlert){
                  if(action.assignedHazards && action.assignedHazards.length == 0 || action.assignedHazards.includes(this.loadedAlert.hazardScenario)){
                    if(action["timeTracking"]["timeSpentInRed"] && action["timeTracking"]["timeSpentInRed"].find(x => x.finish == -1)){
                      action["timeTracking"]["timeSpentInRed"][action["timeTracking"]["timeSpentInRed"].findIndex(x => x.finish == -1)].finish = currentTime;
                    }

                    if(action["timeTracking"]["timeSpentInAmber"] && action["timeTracking"]["timeSpentInAmber"].find(x => x.finish == -1)){
                      action["timeTracking"]["timeSpentInAmber"][action["timeTracking"]["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime;
                    }

                    if(action["timeTracking"]["timeSpentInGreen"] && action["timeTracking"]["timeSpentInGreen"].find(x => x.finish == -1)){
                      action["timeTracking"]["timeSpentInGreen"][action["timeTracking"]["timeSpentInGreen"].findIndex(x => x.finish == -1)].finish = currentTime;
                    }

                    if(!action["timeTracking"]["timeSpentInGrey"]){
                      action['timeTracking']['timeSpentInGrey'] = [];
                    }
                    action['timeTracking']['timeSpentInGrey'].push(newTimeObject)

                  }

                  this.af.database.object(Constants.APP_STATUS + '/action/' + this.agencyId + '/' + action.id)
                    .update(action)
              }

            }else{
                this.alerts.forEach( alert => {
                  if(alert.hazardScenario == this.loadedAlert.hazardScenario && alert.$key != this.loadedAlert.id && alert.alertLevel == AlertLevels.Red){
                    isOtherRedAlert == true;
                  }
                })

                if(!isOtherRedAlert){
                    if(action.assignedHazards && action.assignedHazards.length == 0 || action.assignedHazards.includes(this.loadedAlert.hazardScenario)){
                      if(action["timeTracking"]["timeSpentInRed"] && action["timeTracking"]["timeSpentInRed"].find(x => x.finish == -1)){
                        action["timeTracking"]["timeSpentInRed"][action["timeTracking"]["timeSpentInRed"].findIndex(x => x.finish == -1)].finish = currentTime;
                      }

                      if(action["timeTracking"]["timeSpentInAmber"] && action["timeTracking"]["timeSpentInAmber"].find(x => x.finish == -1)){
                        action["timeTracking"]["timeSpentInAmber"][action["timeTracking"]["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime;
                      }

                      if(action["timeTracking"]["timeSpentInGreen"] && action["timeTracking"]["timeSpentInGreen"].find(x => x.finish == -1)){
                        action["timeTracking"]["timeSpentInGreen"][action["timeTracking"]["timeSpentInGreen"].findIndex(x => x.finish == -1)].finish = currentTime;
                      }

                      if(!action["timeTracking"]["timeSpentInGrey"]){
                        action['timeTracking']['timeSpentInGrey'] = [];
                      }
                      action['timeTracking']['timeSpentInGrey'].push(newTimeObject)

                    }

                    this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryId + '/' + action.id)
                      .update(action)
                }
            }
          }
        })
    }


    //Checks to see if hazards exists on the country office
    if(hazard){
      if(this.loadedAlertLevel != this.loadedAlert.alertLevel){

        if(hazardTrackingNode){
          if(this.loadedAlertLevel == AlertLevels.Red){
            hazardTrackingNode["timeSpentInRed"][hazardTrackingNode["timeSpentInRed"].findIndex(x => x.finish == -1)].finish = currentTime
          }

          if(this.loadedAlertLevel == AlertLevels.Amber){
            hazardTrackingNode["timeSpentInAmber"][hazardTrackingNode["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime
          }
        }

        if(this.loadedAlert.alertLevel == AlertLevels.Red){
          if(this.userType == UserType.CountryDirector || this.userType == UserType.LocalAgencyDirector){
            if(hazardTrackingNode){
              if(!hazardTrackingNode["timeSpentInRed"]){
                hazardTrackingNode["timeSpentInRed"] = [];
              }
              hazardTrackingNode["timeSpentInRed"].push(newTimeObject)
              this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.id + '/timeTracking/' + this.loadedAlert.id)
              .update(hazardTrackingNode)
            }else{
              this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.id + '/timeTracking/' + this.loadedAlert.id)
              .update({timeSpentInRed: [newTimeObject]})
            }

          }

        }else if(this.loadedAlert.alertLevel == AlertLevels.Amber || this.loadedAlert.alertLevel == AlertLevels.Green){
          if(hazardTrackingNode){
            if(!hazardTrackingNode["timeSpentInAmber"]){
              hazardTrackingNode["timeSpentInAmber"] = [];
            }

            if(this.loadedAlert.alertLevel == AlertLevels.Amber){
              hazardTrackingNode["timeSpentInAmber"].push(newTimeObject)
            }
            this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.id + '/timeTracking/' + this.loadedAlert.id)
              .update(hazardTrackingNode)

          }else{
            this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.id + '/timeTracking/' + this.loadedAlert.id)
            .update({timeSpentInAmber: [newTimeObject]})
          }

        }
      }
    }

    // Alert tracking
    if(this.loadedAlertLevel != this.loadedAlert.alertLevel){

      if(this.loadedAlert["timeTracking"]){
        if(this.loadedAlertLevel == AlertLevels.Red && this.loadedAlert["timeTracking"]["timeSpentInRed"] && this.loadedAlert["timeTracking"]["timeSpentInRed"].findIndex(x => x.finish == -1) != -1){
          this.loadedAlert["timeTracking"]["timeSpentInRed"][this.loadedAlert["timeTracking"]["timeSpentInRed"].findIndex(x => x.finish == -1)].finish = currentTime
        }

        if(this.loadedAlertLevel == AlertLevels.Amber && this.loadedAlert["timeTracking"]["timeSpentInAmber"] && this.loadedAlert["timeTracking"]["timeSpentInAmber"].findIndex(x => x.finish == -1) != -1){
          this.loadedAlert["timeTracking"]["timeSpentInAmber"][this.loadedAlert["timeTracking"]["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime
        }
      }



      if(this.loadedAlert.alertLevel == AlertLevels.Red){
        if(this.userType == UserType.CountryDirector || this.userType == UserType.LocalAgencyDirector){
          if(this.loadedAlert["timeTracking"]){
            if(!this.loadedAlert["timeTracking"]["timeSpentInRed"]){
              this.loadedAlert["timeTracking"]["timeSpentInRed"] = [];
            }
            this.loadedAlert["timeTracking"]["timeSpentInRed"].push(newTimeObject)
          }else{
            this.loadedAlert.timeTracking = {};
            this.loadedAlert.timeTracking["timeSpentInRed"] = [];
            this.loadedAlert.timeTracking["timeSpentInRed"].push(newTimeObject);
          }

        }

      }else if(this.loadedAlert.alertLevel == AlertLevels.Amber || this.loadedAlert.alertLevel == AlertLevels.Green){
        if(this.loadedAlert["timeTracking"]){
          if(!this.loadedAlert["timeTracking"]["timeSpentInAmber"]){
            this.loadedAlert["timeTracking"]["timeSpentInAmber"] = [];
          }

          if(this.loadedAlert.alertLevel == AlertLevels.Amber){
            this.loadedAlert["timeTracking"]["timeSpentInAmber"].push(newTimeObject)
          }

        }else{
          this.loadedAlert.timeTracking = {};
            this.loadedAlert.timeTracking["timeSpentInRed"] = [];
            this.loadedAlert.timeTracking["timeSpentInRed"].push(newTimeObject);
        }

      }
    }



    this.loadedAlert.estimatedPopulation = this.estimatedPopulation;
    this.loadedAlert.infoNotes = this.infoNotes;
    this.loadedAlert.timeUpdated = Date.now();
    this.loadedAlert.updatedBy = this.uid;
    this.loadedAlert.approvalCountryId = this.countryId;

    if (this.preAlertLevel == AlertLevels.Red && this.loadedAlert.alertLevel == AlertLevels.Amber) {
      this.loadedAlert.reasonForRedAlert = null;
    } else {
      this.loadedAlert.reasonForRedAlert = this.reasonForRedAlert;
    }

    if (this.loadedAlert.alertLevel != this.preAlertLevel && this.loadedAlert.alertLevel == AlertLevels.Red) {
      if (this.isDirector) {
        this.loadedAlert.approvalStatus = AlertStatus.Approved;
      } else {
        this.loadedAlert.approvalStatus = AlertStatus.WaitingResponse;
      }
    }

    //if alert change state from red to other, reset apa actions with this assigned hazard
    if (this.preAlertLevel == AlertLevels.Red && this.loadedAlert.alertLevel != this.preAlertLevel) {
      console.log("alert changed from red to other")
      this.alertService.getApaActionsNeedResetForThisAlert(this.countryId, this.loadedAlert)
        .first()
        .subscribe(apasToReset => {
          apasToReset.forEach(apa => {
            let obj = {}
            obj["action/" + this.countryId + "/" + apa.$key + "/isComplete"] = null
            obj["action/" + this.countryId + "/" + apa.$key + "/isCompleteAt"] = null
            obj["action/" + this.countryId + "/" + apa.$key + "/actualCost"] = null
            obj["action/" + this.countryId + "/" + apa.$key + "/updatedAt"] = moment.utc().valueOf()
            this.networkService.updateNetworkField(obj)
          })
        })
    }

    //new property "previousIsAmber" will be pushed if updated from amber, otherwise, this property will be deleted
    if (this.preAlertLevel == AlertLevels.Amber && this.loadedAlert.alertLevel == AlertLevels.Red) {
      this.loadedAlert.previousIsAmber = true
    } else {
      this.loadedAlert.previousIsAmber = null
    }

    if(this.isLocalAgency){
      this.alertService.updateAlertLocalAgency(this.loadedAlert, this.preAlertLevel, this.agencyId);
    }else{
      this.alertService.updateAlert(this.loadedAlert, this.preAlertLevel, this.countryId, this.agencyId);
    }

  }


  _getHazards() {

    let id = this.isLocalAgency ? this.agencyId : this.countryId;

    this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.countryId, {preserveSnapshot: true})
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



  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.alertService.unSubscribeNow();
  }

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

}
