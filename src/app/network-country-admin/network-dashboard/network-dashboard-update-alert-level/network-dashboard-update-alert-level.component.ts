import { UserType } from './../../../utils/Enums';
import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Subject} from "rxjs/Subject";
import {ActionsService} from "../../../services/actions.service";
import {ModelAlert} from "../../../model/alert.model";
import {AlertLevels, AlertStatus} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {UserService} from "../../../services/user.service";
import {NetworkService} from "../../../services/network.service";
import {OperationAreaModel} from "../../../model/operation-area.model";
import {CommonService} from "../../../services/common.service";
import {HazardImages} from "../../../utils/HazardImages";
import {LocalStorageService} from "angular-2-local-storage";
import * as moment from "moment";
import {PrepActionService} from "../../../services/prepactions.service";


@Component({
  selector: 'app-network-dashboard-update-alert-level',
  templateUrl: './network-dashboard-update-alert-level.component.html',
  styleUrls: ['./network-dashboard-update-alert-level.component.scss'],
  providers: [ActionsService]
})
export class NetworkDashboardUpdateAlertLevelComponent implements OnInit, OnDestroy {
  leadAgencyCountryOffice: string;
  leadAgencyId: any;
  networkCountryId: any;
  networkId: any;

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

  private countries = Constants.COUNTRIES;
  private countriesList = Constants.COUNTRY_SELECTION;
  private countryLevels: any[] = [];
  private countryLevelsValues: any[] = [];
  private networkViewValues: {};
  private isViewing: boolean;
  private countryID: string;
  private systemId: string;

  private userType: number;
  private hazards: any[] = [];
  private nonMonitoredHazards = Constants.HAZARD_SCENARIO_ENUM_LIST
  private loadedAlertLevel: AlertLevels;
  private alerts

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private _commonService: CommonService,
              private route: ActivatedRoute,
              private alertService: ActionsService,
              private userService: UserService,
              private storage: LocalStorageService,
              private networkService: NetworkService,
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
    this.networkViewValues = this.storage.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params
      .takeUntil(this.ngUnsubscribe)
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

        this._getHazards()
        if(this.isViewing){

                this.route.params
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((param: Params) => {
                    if (param['id']) {
                      this.alertId = param['id'];

                      this.loadAlert(this.alertId, this.networkCountryId);
                    }
                  });

                this.networkService.getNetworkCountry(this.networkId, this.networkCountryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(network => {
                    this.leadAgencyId = network.leadAgencyId
                    Object.keys(network.agencyCountries[this.leadAgencyId]).forEach(key => {
                      this.leadAgencyCountryOffice = key
                    })
                  })


            // get the country levels values
            this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
              .takeUntil(this.ngUnsubscribe).subscribe(content => {
              this.countryLevelsValues = content;
              err => console.log(err);
            });

        } else {
          this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
            this.uid = user.uid;
            this.userType = userType

            //get network id
            this.networkService.getSelectedIdObj(user.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(selection => {
                this.networkId = selection["id"];
                this.networkCountryId = selection["networkCountryId"];
                this.route.params
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((param: Params) => {
                    if (param['id']) {
                      this.alertId = param['id'];


                      this.loadAlert(this.alertId, this.networkCountryId);
                    }
                  });

                this.networkService.getNetworkCountry(this.networkId, this.networkCountryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(network => {
                    this.leadAgencyId = network.leadAgencyId
                    Object.keys(network.agencyCountries[this.leadAgencyId]).forEach(key => {
                      this.leadAgencyCountryOffice = key
                    })
                  })
              })

            // get the country levels values
            this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
              .takeUntil(this.ngUnsubscribe).subscribe(content => {
              this.countryLevelsValues = content;
              err => console.log(err);
            });
          });
        }

      })
  }

  private loadAlert(alertId: string, countryId: string) {


    this.prepActionService.initActionsWithInfoNetwork(this.af, this.ngUnsubscribe, this.uid, false,
      this.networkCountryId, this.networkId, '');

      this.alertService.getAlerts(this.networkCountryId, false)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(alerts => {
        this.alerts = alerts;
        this.alertService.getAlert(alertId, countryId)
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

            console.log(this.loadedAlert);
          });
    })
  }

  // addNewArea() {
  //   let area: ModelAffectedArea = new ModelAffectedArea();
  //   this.loadedAlert.affectedAreas.push(area);
  // }
  //
  // removeArea(index) {
  //   console.log(index);
  //   let temp: ModelAffectedArea[] = [];
  //   for (let i = 0; i < this.loadedAlert.affectedAreas.length; i++) {
  //     if (i != index) {
  //       temp.push(this.loadedAlert.affectedAreas[i]);
  //     }
  //   }
  //   this.loadedAlert.affectedAreas = temp;
  // }

  selectedAlertLevel(selection) {
    this.loadedAlert.alertLevel = selection;
  }

  // changeCountry(index, value) {
  //   if (this.loadedAlert.affectedAreas[index].affectedCountry != this.COUNTRIES.indexOf(value)) {
  //     this.loadedAlert.affectedAreas[index].affectedLevel1 = null;
  //     this.loadedAlert.affectedAreas[index].affectedLevel2 = null;
  //   }
  //   this.loadedAlert.affectedAreas[index].affectedCountry = this.COUNTRIES.indexOf(value);
  //   console.log(this.loadedAlert);
  // }
  //
  // changeLevel1(index, value) {
  //   this.loadedAlert.affectedAreas[index].affectedLevel1 = Number(value);
  //   if (this.loadedAlert.affectedAreas[index].affectedLevel1 != Number(value)) {
  //     this.loadedAlert.affectedAreas[index].affectedLevel2 = null;
  //   }
  //   console.log(this.loadedAlert);
  // }
  //
  // changeLevel2(index, value) {
  //   this.loadedAlert.affectedAreas[index].affectedLevel2 = Number(value);
  //   console.log(this.loadedAlert);
  // }

  submit() {



    let hazard = this.hazards.find(x => x.hazardScenario == this.loadedAlert.hazardScenario)
    let hazardTrackingNode;

    if(hazard && hazard.timeTracking && hazard.timeTracking[this.loadedAlert.id]){
      hazardTrackingNode = hazard.timeTracking ? hazard.timeTracking[this.loadedAlert.id] : undefined;
    }

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1,level: this.loadedAlert.alertLevel};
    let id = this.networkCountryId;

    let apaActions = this.prepActionService.actions.filter(action => action.level == 2)
    if(this.loadedAlertLevel != this.loadedAlert.alertLevel && this.userType == UserType.CountryDirector){
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

                  this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id)
                    .update(action)
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



    // let hazard = this.hazards.find(x => x.hazardScenario == this.loadedAlert.hazardScenario)
    // let hazardTrackingNode = hazard ? hazard.timeTracking : undefined;
    // let currentTime = new Date().getTime()
    // let newTimeObject = {raisedAt: currentTime, level: this.loadedAlert.alertLevel};
    // let id = this.networkCountryId;

    // //Checks to see if hazards exists on the network
    // if(hazard){
    //   if(this.loadedAlertLevel != this.loadedAlert.alertLevel && (this.loadedAlert.alertLevel == AlertLevels.Red || this.loadedAlert.alertLevel == AlertLevels.Amber || this.loadedAlert.alertLevel == AlertLevels.Green)){
    //     if(this.loadedAlert.alertLevel == AlertLevels.Red){
    //       if(this.userType == UserType.CountryDirector){
    //         if(hazardTrackingNode){
    //           hazardTrackingNode.push(newTimeObject)
    //           this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.id)
    //           .update({timeTracking: hazardTrackingNode})
    //         }else{
    //           this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.id)
    //           .update({timeTracking: [newTimeObject]})
    //         }

    //       }
    //     }else if(this.loadedAlert.alertLevel == AlertLevels.Amber || this.loadedAlert.alertLevel == AlertLevels.Green){
    //       if(hazardTrackingNode){
    //         hazardTrackingNode.push(newTimeObject)
    //         this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.id)
    //         .update({timeTracking: hazardTrackingNode})
    //       }else{
    //         this.af.database.object(Constants.APP_STATUS + '/hazard/' + id + '/' + hazard.id)
    //         .update({timeTracking: [newTimeObject]})
    //       }

    //     }
    //   }
    // }

    // Alert tracking
    if(this.loadedAlertLevel != this.loadedAlert.alertLevel){

      if(this.loadedAlert["timeTracking"]){
        if(this.loadedAlertLevel == AlertLevels.Red && this.loadedAlert["timeTracking"]["timeSpentInRed"]){
          this.loadedAlert["timeTracking"]["timeSpentInRed"][this.loadedAlert["timeTracking"]["timeSpentInRed"].findIndex(x => x.finish == -1)].finish = currentTime
        }

        if(this.loadedAlertLevel == AlertLevels.Amber && this.loadedAlert["timeTracking"]["timeSpentInAmber"]){
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
      this.alertService.getApaActionsNeedResetForThisAlert(this.networkCountryId, this.loadedAlert)
        .first()
        .subscribe(apasToReset => {
          apasToReset.forEach(apa => {
            let obj = {}
            obj["action/"+this.networkCountryId+"/"+apa.$key+"/isComplete"] = null
            obj["action/"+this.networkCountryId+"/"+apa.$key+"/isCompleteAt"] = null
            obj["action/" + this.networkCountryId + "/" + apa.$key + "/actualCost"] = null
            obj["action/"+this.networkCountryId+"/"+apa.$key+"/updatedAt"] = moment.utc().valueOf()
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

    if(this.networkViewValues){
      console.log(true)
      this.alertService.updateAlert(this.loadedAlert, this.preAlertLevel, this.leadAgencyCountryOffice, this.leadAgencyId, this.networkCountryId, null, this.networkViewValues);
    } else {
      console.log(true)
      this.alertService.updateAlert(this.loadedAlert, this.preAlertLevel, this.leadAgencyCountryOffice, this.leadAgencyId, this.networkCountryId);
    }

  }



  _getHazards() {

    let id = this.networkCountryId;

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

  getCSSHazard(hazard: any) {
    let value = (typeof hazard == "string") ? parseInt(hazard) : hazard
    return HazardImages.init().getCSS(value);
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

}
