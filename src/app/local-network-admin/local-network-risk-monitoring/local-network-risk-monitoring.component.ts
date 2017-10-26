import {Component, OnDestroy, OnInit} from "@angular/core";
import {AlertMessageType, Countries, DetailedDurationType, HazardScenario, UserType} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../model/alert-message.model";
import {LogModel} from "../../model/log.model";
import {LocalStorageService} from "angular-2-local-storage";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../../services/user.service";
import {CommonService} from "../../services/common.service";
import {NetworkService} from "../../services/network.service";
import {AgencyService} from "../../services/agency-service.service";
import {Subject} from "rxjs/Subject";
import {CountryPermissionsMatrix, PageControlService} from "../../services/pagecontrol.service";
import * as moment from "moment";
import {HazardImages} from "../../utils/HazardImages";
import {WindowRefService} from "../../services/window-ref.service";
import * as jsPDF from 'jspdf'
import {ModelUserPublic} from "../../model/user-public.model";
import * as firebase from "firebase/app";
import App = firebase.app.App;

declare var jQuery: any;


@Component({
  selector: 'app-local-network-risk-monitoring',
  templateUrl: './local-network-risk-monitoring.component.html',
  styleUrls: ['./local-network-risk-monitoring.component.scss']
})
export class LocalNetworkRiskMonitoringComponent implements OnInit, OnDestroy {

  public agencies = []
  public eventFilter = -1;
  public locationFilter = -1;
  public agencyFilter = -1;
  public indicatorLevelFilter = -1;

  networkCountryId: any;

  private USER_TYPE = UserType;
  private UserType: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  public uid: string;
  public countryID: string;
  private isViewing: boolean;
  private agencyId: string;
  private systemId: string;
  public hazards: any[] = [];
  private canCopy: boolean;
  private agencyOverview: boolean;

  private countryLocation: any;
  private Countries = Countries;

  public activeHazards: any[] = [];
  public archivedHazards: any[] = [];

  public indicators: any = {};
  public indicatorsCC: any[] = [];

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

  private isIndicatorUpdate: any[] = [];

  private durationType = Constants.DETAILED_DURATION_TYPE;
  private durationTypeList: number[] = [DetailedDurationType.Hour, DetailedDurationType.Day, DetailedDurationType.Week, DetailedDurationType.Month, DetailedDurationType.Year];
  private indicatorTrigger: any[] = [];
  private alertImages = Constants.ALERT_IMAGES;
  private logContent: any[] = [];
  private isIndicatorCountryUpdate: any[] = [];

  private tmpHazardData: any[] = [];
  private tmpLogData: any[] = [];

  private successAddHazardMsg: any;
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  private logsToExport: any;
  private fromDate: string;
  private fromDateTimeStamp: number;
  private toDate: string;
  private toDateTimeStamp: number;

  private usersForAssign: any;
  private assignedIndicator: any;
  private assignedHazard: any;
  private assignedUser: string;
  private networkId: any;
  private countryLevelsValues: any;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private storage: LocalStorageService,
              private translate: TranslateService,
              private userService: UserService,
              private commonService: CommonService,
              private agencyService: AgencyService,
              private networkService: NetworkService,
              private windowService: WindowRefService) {
    this.tmpLogData['content'] = '';
    this.successAddNewHazardMessage();
  }

  successAddNewHazardMessage() {
    this.successAddHazardMsg = this.storage.get('successAddHazard');
    this.storage.remove('successAddHazard');
    if (typeof (this.successAddHazardMsg) != 'undefined') {
      setTimeout(() => {
        this.successAddHazardMsg = 'waiting';
        return;
      }, 4000);
    }
  }

  ngOnInit() {

    this.usersForAssign = [];

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryID = params["countryId"];
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
        if (params["canCopy"]) {
          this.canCopy = params["canCopy"];
        }
        if (params["agencyOverview"]) {
          this.agencyOverview = params["agencyOverview"];
        }


        this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
          this.uid = user.uid;

          //get network id
          this.networkService.getSelectedIdObj(user.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(selection => {
              console.log(selection)
              this.networkId = selection["id"];
              this.UserType = selection["userType"];

              console.log(selection)


              this.networkService.getNetworkDetail(this.networkId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe( network => {
                  Object.keys(network.agencies).forEach(key => {

                    this.agencyService.getAgency(key)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(agency => {
                        console.log(agency)
                        this.agencies.push(agency)
                      })
                  });

                })





              this._getHazards()
              this.getCountryLocation()
                .then(_ => {
                  // get the country levels values
                  this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(content => {

                      this.countryLevelsValues = content[this.countryLocation];
                      console.log(this.countryLevelsValues)
                      err => console.log(err);
                    });
                })
              this._getCountryContextIndicators();
              this.getUsersForAssign();


            });
        })
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  changeLocationFilter(location){
    console.log(location)
    if(location){
      if(location == 'location'){
        this.locationFilter = -1;
      } else {
        this.locationFilter = location;
      }
    } else {
      return
    }
  }

  changeEventFilter(event){
    console.log(event)
    if(event){
      if(event == 'event'){
        this.eventFilter = -1;
      } else {
        this.eventFilter = event;
      }
    } else {
      return
    }
  }

  changeAgencyFilter(agency){
    console.log(agency)
    if(agency == 'agency'){
      this.agencyFilter = -1;
    } else {
      this.agencyFilter = agency;
    }
  }

  changeIndicatorLevelFilter(indicatorLevel){
    console.log(indicatorLevel)
    if(indicatorLevel == 'indicator'){
      this.indicatorLevelFilter = -1;
    } else {
      this.indicatorLevelFilter = indicatorLevel;
    }
  }

  private getCountryLocation() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + '/' + this.countryID + "/location")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((location: any) => {
          this.countryLocation = location.$value ? location.$value : 0;
          res(true);
        });
    });
    return promise;
  }

  _getIndicatorFutureTimestamp(indicator) {
    let triggers: any[] = indicator.trigger;
    let trigger = triggers[indicator.triggerSelected];
    if (indicator.updatedAt != null) {
      let updatedAt = new Date(indicator.updatedAt);
      if (trigger.durationType == DetailedDurationType.Hour) {
        return updatedAt.setTime(updatedAt.getTime() + (trigger.frequencyValue * Constants.UTC_ONE_HOUR * 1000));
      } else if (trigger.durationType == DetailedDurationType.Day) {
        return updatedAt.setTime(updatedAt.getTime() + (trigger.frequencyValue * Constants.UTC_ONE_DAY * 1000));
      } else if (trigger.durationType == DetailedDurationType.Week) {
        return updatedAt.setTime(updatedAt.getTime() + (trigger.frequencyValue * 7 * Constants.UTC_ONE_DAY * 1000));
      }
      else if (trigger.durationType == DetailedDurationType.Month) {
        return updatedAt.setMonth(updatedAt.getUTCMonth() + (+trigger.frequencyValue));
      }
      else if (trigger.durationType == DetailedDurationType.Year) {
        return updatedAt.setFullYear(updatedAt.getFullYear() + (+trigger.frequencyValue));
      }
      else {
        // Error
        return updatedAt;
      }
    }
    else {
      return new Date();
    }
  }

  _getCountryContextIndicators() {
    this.af.database.list(Constants.APP_STATUS + "/indicator/" + this.networkId).takeUntil(this.ngUnsubscribe).subscribe((indicators: any) => {
      indicators.forEach((indicator, key) => {
        console.log(indicator)
        indicator.fromAgency = false;
        this.getLogs(indicator.$key).subscribe((logs: any) => {
          logs.forEach((log, key) => {
            this.getUsers(log.addedBy).subscribe((user: any) => {
              log.addedByFullName = user.firstName + ' ' + user.lastName;
            })
          });
          indicator.logs = this._sortLogsByDate(logs);
        });
      });

      this.indicatorsCC = indicators;

      //gets all relevant country office indicator data from country context
      this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe( officeAgencyMap => {
          console.log(officeAgencyMap)
          officeAgencyMap.forEach((value: string, agencyKey: string) => {

            this.af.database.list(Constants.APP_STATUS + "/indicator/" + value).takeUntil(this.ngUnsubscribe).subscribe((indicators: any) => {
              indicators.forEach( indicator => {
                indicator.fromAgency = true;
                indicator.countryOfficeCode = value
                this.agencyService.getAgency(agencyKey)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe( agency => {
                    indicator.agency = agency;

                  })
                this.getLogs(indicator.$key).subscribe((logs: any) => {
                  logs.forEach((log, key) => {
                    this.getUsers(log.addedBy).subscribe((user: any) => {
                      log.addedByFullName = user.firstName + ' ' + user.lastName;
                    })
                  });
                  indicator.logs = this._sortLogsByDate(logs);
                  this.indicatorsCC.push(indicator)
                });
              });
            });
          })
        })
    });
  }

  _getHazards() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.networkId).takeUntil(this.ngUnsubscribe).subscribe((hazards: any) => {
        this.activeHazards = [];
        this.archivedHazards = [];
        console.log(hazards)
        hazards.forEach((hazard: any, key) => {
          hazard.id = hazard.$key;
          if (hazard.hazardScenario != -1) {
            hazard.imgName = this.translate.instant(this.hazardScenario[hazard.hazardScenario]).replace(" ", "_");
          }

          this.getIndicators(hazard.id).subscribe((indicators: any) => {
            indicators.forEach((indicator, key) => {
              console.log(indicator)
              indicator.fromAgency = false;
              this.getLogs(indicator.$key).subscribe((logs: any) => {
                logs.forEach((log, key) => {
                  this.getUsers(log.addedBy).subscribe((user: any) => {
                    log.addedByFullName = user.firstName + ' ' + user.lastName;
                  })
                });
                indicator.logs = this._sortLogsByDate(logs);
              });
            });
            hazard.indicators = indicators;
            hazard.existsOnNetwork = true;
          });

          if (hazard.isActive) {
            this.activeHazards.push(hazard);
            if (hazard.hazardScenario == -1) {
              this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName, {preserveSnapshot: true})
                .takeUntil(this.ngUnsubscribe)
                .subscribe((snap) => {
                  hazard.hazardName = snap.val().name;
                });
            }
          } else {
            this.archivedHazards.push(hazard);
          }


        });
        //gets all relevant country office hazard and indicator data from non-country context hazards
        this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe( officeAgencyMap => {

            officeAgencyMap.forEach((value: string, agencyKey: string) => {



              this.af.database.list(Constants.APP_STATUS + "/hazard/" + value).takeUntil(this.ngUnsubscribe).subscribe((hazards: any) => {
                hazards.forEach((hazard: any, key) => {
                  hazard.id = hazard.$key;
                  if (hazard.hazardScenario != -1) {
                    hazard.imgName = this.translate.instant(this.hazardScenario[hazard.hazardScenario]).replace(" ", "_");
                  }
                  this.getIndicators(hazard.id).subscribe((indicators: any) => {indicators.forEach((indicator, key) => {


                    indicator.fromAgency = true;
                    indicator.countryOfficeCode = value
                    this.agencyService.getAgency(agencyKey)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe( agency => {
                        indicator.agency = agency;
                      })
                    this.getLogs(indicator.$key).subscribe((logs: any) => {
                      logs.forEach((log, key) => {
                        this.getUsers(log.addedBy).subscribe((user: any) => {
                          log.addedByFullName = user.firstName + ' ' + user.lastName;
                        })
                      });
                      indicator.logs = this._sortLogsByDate(logs);
                    });
                  });
                    hazard.indicators = indicators;
                    hazard.existsOnNetwork = false;



                    if(hazard.isActive) {

                      var containsHazard = false;
                      var hasIndicators = false;
                      var activeHazardIndex = null;
                      this.activeHazards.forEach((activeHazard, index) => {
                        if (activeHazard.hazardScenario == hazard.hazardScenario) {
                          if (hazard.hasOwnProperty('indicators') && activeHazard.hasOwnProperty('indicators')) {
                            containsHazard = true;
                            hasIndicators = true;
                            activeHazardIndex = index
                          } else if (hazard.hasOwnProperty('indicators') && !activeHazard.hasOwnProperty('indicators')) {
                            containsHazard = true;
                            activeHazardIndex = index
                          }
                        }

                      })
                      if(hazard.isSeasonal){
                        if (hazard.isActive) {
                          this.activeHazards.push(hazard);
                          if (hazard.hazardScenario == -1) {
                            this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName, {preserveSnapshot: true})
                              .takeUntil(this.ngUnsubscribe)
                              .subscribe((snap) => {
                                hazard.hazardName = snap.val().name;
                              });
                          }
                        }

                      } else if (containsHazard) {
                        if (hazard.hasOwnProperty('indicators') && hasIndicators) {


                          hazard.indicators.forEach(indicator => {

                            if(this.activeHazards[activeHazardIndex].indicators.map(item=>item.$key).indexOf(indicator.$key) == -1){
                              this.activeHazards[activeHazardIndex].indicators.push(indicator)
                            } else {
                              this.activeHazards[activeHazardIndex].indicators.splice(this.activeHazards[activeHazardIndex].indicators.map(item=>item.$key).indexOf(indicator.$key), 1)
                              this.activeHazards[activeHazardIndex].indicators.push(indicator)
                            }


                          })
                        } else if (hazard.hasOwnProperty('indicators') && !hasIndicators) {
                          hazard.indicators = []
                          hazard.indicators.forEach(indicator => {

                            this.activeHazards[activeHazardIndex].indicators.push(indicator)
                          })
                        }
                        containsHazard = false;
                        hasIndicators = false;
                        activeHazardIndex = null;

                      } else {
                        this.activeHazards.push(hazard);
                        if (hazard.hazardScenario == -1) {
                          this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName, {preserveSnapshot: true})
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe((snap) => {
                              hazard.hazardName = snap.val().name;
                            });
                        }
                        containsHazard = false;
                        hasIndicators = false;
                        activeHazardIndex = null;
                      }
                    } else {

                      var containsHazard = false;
                      var hasIndicators = false;
                      var archivedHazardIndex = null;
                      this.archivedHazards.forEach((archivedHazard, index) => {
                        if (archivedHazard.hazardScenario == hazard.hazardScenario) {
                          if (hazard.hasOwnProperty('indicators') && archivedHazard.hasOwnProperty('indicators')) {
                            containsHazard = true;
                            hasIndicators = true;
                            archivedHazardIndex = index
                          } else if (hazard.hasOwnProperty('indicators') && !archivedHazard.hasOwnProperty('indicators')) {
                            containsHazard = true;
                            archivedHazardIndex = index
                          }
                        }

                      })
                      if(hazard.isSeasonal){
                        if (hazard.isActive) {
                          this.archivedHazards.push(hazard);
                        }
                      } else if (containsHazard) {
                        if (hazard.hasOwnProperty('indicators') && hasIndicators) {


                          hazard.indicators.forEach(indicator => {

                            this.archivedHazards[archivedHazardIndex].indicators.push(indicator)
                          })
                        } else if (hazard.hasOwnProperty('indicators') && !hasIndicators) {
                          hazard.indicators = []
                          hazard.indicators.forEach(indicator => {

                            this.archivedHazards[archivedHazardIndex].indicators.push(indicator)
                          })
                        }
                        containsHazard = false;
                        hasIndicators = false;
                        archivedHazardIndex = null;

                      } else {
                        if (hazard.isActive) {
                          this.archivedHazards.push(hazard);
                          if (hazard.hazardScenario == -1) {
                            this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + hazard.otherName, {preserveSnapshot: true})
                              .takeUntil(this.ngUnsubscribe)
                              .subscribe((snap) => {
                                hazard.hazardName = snap.val().name;
                              });
                          }
                        } else {
                          this.archivedHazards.push(hazard);
                        }
                        containsHazard = false;
                        hasIndicators = false;
                        activeHazardIndex = null;
                      }
                    }
                  });
                });
              });
            })
          })
        res(true);
      });
    });
    return promise;
  }

  getIndicators(hazardID: string) {
    return this.af.database.list(Constants.APP_STATUS + "/indicator/" + hazardID);
  }

  getLogs(indicatorID: string) {
    return this.af.database.list(Constants.APP_STATUS + "/log/" + indicatorID, {
      query: {
        orderByChild: 'timeStamp'
      }
    });
  }

  getUsers(userID: string) {
    return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID);
  }

  deleteHazard(modalID: string) {
    if (!this.tmpHazardData['ID']) {
      console.log('hazardID cannot be empty');
      return false;
    }
    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.networkId + '/' + this.tmpHazardData['ID']).remove().then(() => {
      this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_DELETE_HAZARD', AlertMessageType.Success);
      this.removeTmpHazardID();
    });
    jQuery("#" + modalID).modal("hide");
  }

  collapseAll(mode: string) {
    if (mode == 'expand') {
      jQuery('.Accordion__Content').collapse('show');
    } else {
      jQuery('.Accordion__Content').collapse('hide');
    }
  }

  changeIndicatorState(state: boolean, hazardID: string, indicatorKey: number) {

    var key = hazardID + '_' + indicatorKey;
    if (state) {
      this.isIndicatorUpdate[key] = true;
      return true;
    }
    this.isIndicatorUpdate[key] = false;
  }

  setCheckedTrigger(indicatorID: string, triggerSelected: number) {
    this.indicatorTrigger[indicatorID] = triggerSelected;
  }

  setClassForIndicator(trigger: number, triggerSelected: number) {
    var indicatorClass = 'btn btn-ghost';
    if (trigger == 0 && trigger == triggerSelected) {
      indicatorClass = 'btn btn-primary';
    }
    if (trigger == 1 && trigger == triggerSelected) {
      indicatorClass = 'btn btn-amber';
    }
    if (trigger == 2 && trigger == triggerSelected) {
      indicatorClass = 'btn btn-red';
    }

    return indicatorClass;
  }

  updateIndicatorStatus(hazardID: string, indicator, indicatorKey: number) {
    const indicatorID = indicator.$key;



    if (!hazardID || !indicatorID) {
      console.log('hazardID or indicatorID cannot be empty');
      return false;
    }

    var triggerSelected = this.indicatorTrigger[indicatorID];
    console.log(triggerSelected)
    var dataToSave = {triggerSelected: triggerSelected, updatedAt: new Date().getTime()};
    dataToSave['dueDate'] = this._getIndicatorFutureTimestamp(indicator); // update the due date

    var urlToUpdate;


    if(indicator.countryOfficeCode && hazardID == 'countryContext'){
      urlToUpdate = Constants.APP_STATUS + "/indicator/" + indicator.countryOfficeCode + '/' + indicatorID;
    } else if (hazardID == 'countryContext') {
      urlToUpdate = Constants.APP_STATUS + '/indicator/' + this.networkId + '/' + indicatorID;
    } else {
      urlToUpdate = Constants.APP_STATUS + '/indicator/' + indicator.hazardScenario.key + '/' + indicatorID;
    }


    this.af.database.object(urlToUpdate)
      .update(dataToSave)
      .then(_ => {

        this.changeIndicatorState(false, hazardID, indicatorKey);
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });

  }

  saveLog(indicatorID: string, triggerSelected: number) {
    var log = new LogModel();
    log.content = this.logContent[indicatorID] ? this.logContent[indicatorID] : '';
    log.addedBy = this.uid;
    log.timeStamp = this._getCurrentTimestamp();
    log.triggerAtCreation = triggerSelected;

    this.alertMessage = log.validate();
    if (!this.alertMessage) {
      var dataToSave = log;

      this.af.database.list(Constants.APP_STATUS + '/log/' + indicatorID)
        .push(dataToSave)
        .then(() => {
          this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_ADDED_LOG', AlertMessageType.Success);
          this.logContent[indicatorID] = '';
        }).catch((error: any) => {
        console.log(error, 'You do not have access!')
      });
    }
    return true;
  }

  setTmpHazard(hazardID: string, activeStatus: boolean, hazardScenario: number) {
    console.log('enter set')
    if (!hazardID) {
      console.log('enter false if')
      return false;
    }

    this.tmpHazardData['ID'] = hazardID;
    this.tmpHazardData['activeStatus'] = activeStatus;
    this.tmpHazardData['scenario'] = hazardScenario;
  }

  setTmpLog(logID: string, logData: string, indicatorID: string) {
    if (!logID) {
      return false;
    }

    this.tmpLogData['ID'] = logID;
    this.tmpLogData['content'] = logData;
    this.tmpLogData['indicatorID'] = indicatorID;
  }

  removeTmpHazardID() {
    this.tmpHazardData = [];
  }

  removeTmpLog() {
    this.tmpLogData = [];
  }

  editLog(modalID: string) {

    var dataToUpdate = {content: this.tmpLogData['content']};
    this.af.database.object(Constants.APP_STATUS + '/log/' + this.tmpLogData['indicatorID'] + '/' + this.tmpLogData['ID'])
      .update(dataToUpdate)
      .then(_ => {
        this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_UPDATE_LOG', AlertMessageType.Success);
        this.removeTmpLog();
        return true;
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });

    jQuery("#" + modalID).modal("hide");
  }

  deleteLog(modalID: string) {
    if (!this.tmpLogData || !this.tmpLogData['ID'] || !this.tmpLogData['indicatorID']) {
      console.log('logID cannot be empty');
      return false;
    }
    this.af.database.object(Constants.APP_STATUS + '/log/' + this.tmpLogData['indicatorID'] + '/' + this.tmpLogData['ID']).remove().then(() => {
      this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCCESS_DELETE_LOG', AlertMessageType.Success);
      this.tmpLogData = [];
    });
    jQuery("#" + modalID).modal("hide");
  }

  updateHazardActiveStatus(modalID: string) {

    if (!this.tmpHazardData['ID']) {
      console.log('hazardID cannot be empty!');
      return false;
    }

    var dataToUpdate = {isActive: this.tmpHazardData['activeStatus']};
    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.networkId + '/' + this.tmpHazardData['ID'])
      .update(dataToUpdate)
      .then(_ => {
        this.alertMessage = new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.SUCESS_UPDATE_HAZARD', AlertMessageType.Success);
        return true;
      }).catch(error => {
      console.log("Message creation unsuccessful" + error);
    });
    jQuery("#" + modalID).modal("hide");

  }

  getTimeStamp(utc: number) {
    let myDate: Date = new Date(utc);
    return myDate;
  }

  _getCurrentTimestamp() {
    var currentTimeStamp = new Date().getTime();
    return currentTimeStamp;
  }

  _sortLogsByDate(array: any) {
    var byDate = array.slice(0);
    var result = byDate.sort(function (a, b) {
      return b.timeStamp - a.timeStamp;
    });

    return result;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  copyIndicator(indicator: any, isContext: boolean, hazard: any) {
    console.log(indicator.$key);
    console.log(this.countryID)
    console.log("isContext: " + isContext);
    console.log(hazard);
    if (isContext) {
      if (this.agencyOverview) {
        this.router.navigate(["/network/local-network-risk-monitoring/add-indicator/countryContext", {
          "countryId": this.countryID,
          "agencyId": this.agencyId,
          "systemId": this.systemId,
          "indicatorId": indicator.$key,
          "isContext": isContext,
          "agencyOverview": true
        }]);
      } else {
        this.router.navigate(["/network/local-network-risk-monitoring/add-indicator/countryContext", {
          "countryId": this.countryID,
          "agencyId": this.agencyId,
          "systemId": this.systemId,
          "indicatorId": indicator.$key,
          "isContext": isContext
        }]);
      }

    } else {
      let hazardScenario = hazard.hazardScenario;
      this.userService.getCountryId(Constants.USER_PATHS[this.UserType], this.uid)
        .take(1)
        .subscribe(ownCountryId => {
          console.log(ownCountryId);
          this.af.database.list(Constants.APP_STATUS + "/hazard/" + ownCountryId, {
            query: {
              orderByChild: "hazardScenario",
              equalTo: hazardScenario,
              limitToFirst: 1
            }
          })
            .take(1)
            .subscribe(hazards => {
              let activeHazards = hazards.filter(hazard => hazard.isActive == true);
              if (activeHazards.length == 0) {
                console.log("no hazard exist!!");
                this.alertMessage = new AlertMessageModel("No same active hazard exist in your country !");
              } else {
                console.log("do the hazard copy action");
                if (this.agencyOverview) {
                  this.router.navigate(["/network/local-network-risk-monitoring/add-indicator/" + hazards[0].$key, {
                    "countryId": this.countryID,
                    "agencyId": this.agencyId,
                    "systemId": this.systemId,
                    "indicatorId": indicator.$key,
                    "hazardId": hazard.$key,
                    "isContext": isContext,
                    "agencyOverview": true
                  }]);
                } else {
                  this.router.navigate(["/network/local-network-risk-monitoring/add-indicator/" + hazards[0].$key, {
                    "countryId": this.countryID,
                    "agencyId": this.agencyId,
                    "systemId": this.systemId,
                    "indicatorId": indicator.$key,
                    "hazardId": hazard.$key,
                    "isContext": isContext
                  }]);
                }
              }
            });
        });
    }
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  setExportLog(logs: any[]) {
    this.logsToExport = logs;
    console.log(this.logsToExport);
  }

  selectDate(value, dateType) {
    if (dateType === 'fromDate') {
      this.fromDateTimeStamp = moment(value).startOf("day").valueOf();
    } else {
      this.toDateTimeStamp = moment(value).endOf("day").valueOf();
    }
  }

  exportLog(logs: any[]) {
    var doc = new jsPDF();
    doc.setFontType("normal");
    doc.setFontSize("12");

    var totalPageHeight = doc.internal.pageSize.height;
    var pageHeight = totalPageHeight - 20;

    let x = 10;
    let y = 10;

    logs.forEach(log => {
      if ((!this.fromDate || log['timeStamp'] >= this.fromDateTimeStamp  ) && (!this.toDate || log['timeStamp'] <= this.toDateTimeStamp )) {
        if (y > pageHeight) {
          y = 10;
          doc.addPage();
        }
        doc.text(x, y += 10, this.translate.instant('RISK_MONITORING.EXPORT_LOG.DATE') + ' ' + moment(log['timeStamp']).format("DD/MM/YYYY"));

        if (y > pageHeight) {
          y = 10;
          doc.addPage();
        }
        doc.text(x, y += 10, this.translate.instant('RISK_MONITORING.EXPORT_LOG.INDICATOR_STATUS') + ' ' + this.translate.instant(Constants.INDICATOR_STATUS[log.triggerAtCreation]));

        if (y > pageHeight) {
          y = 10;
          doc.addPage();
        }
        doc.text(x, y += 10, this.translate.instant('RISK_MONITORING.EXPORT_LOG.AUTHOR') + ' ' + log.addedByFullName);

        let message = doc.splitTextToSize(log['content'], 180);
        message.forEach((m, index) => {
          if (y > pageHeight) {
            y = 10;
            doc.addPage();
          }
          doc.text(x, y += 10, index === 0 ? this.translate.instant('RISK_MONITORING.EXPORT_LOG.MESSAGE') + ' ' + m : m);
        })

        doc.text(x, y += 10, ' ');
      }
    });

    // Save the PDF
    doc.save('logs.pdf');
  }

  sourceClick(source) {
    console.log(source.link);
    let url = source.link;
    let pattern = /^(http|https)/;
    if (!pattern.test(url)) {
      url = "http://" + url;
    }
    this.windowService.getNativeWindow().open(url);
  }

  greenSelected(key) {
    this.indicatorTrigger[key] = 0;
  }

  amberSelected(key) {
    this.indicatorTrigger[key] = 1;
  }

  redSelected(key) {
    this.indicatorTrigger[key] = 2;
  }

  assignIndicatorTo(hazard, indicator) {
    console.log(indicator);
    this.assignedHazard = hazard;
    this.assignedIndicator = indicator;
  }

  getUsersForAssign() {
    if (this.UserType == UserType.Ert || this.UserType == UserType.PartnerUser) {
      this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryID + "/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(staff => {
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + staff.$key)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((user: ModelUserPublic) => {
              let userToPush = {userID: staff.$key, name: user.firstName + " " + user.lastName};
              this.usersForAssign.push(userToPush);
            });
        });
    } else {
      //Obtaining the country admin data
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryID).takeUntil(this.ngUnsubscribe).subscribe((data: any) => {
        if (data.adminId) {
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + data.adminId).takeUntil(this.ngUnsubscribe).subscribe((user: ModelUserPublic) => {
            var userToPush = {userID: data.adminId, name: user.firstName + " " + user.lastName};
            this.usersForAssign.push(userToPush);
          });
        }
      });

      //Obtaining other staff data
      this.af.database.object(Constants.APP_STATUS + "/staff/" + this.countryID).takeUntil(this.ngUnsubscribe).subscribe((data: {}) => {
        for (let userID in data) {
          if (!userID.startsWith('$')) {
            this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID).takeUntil(this.ngUnsubscribe).subscribe((user: ModelUserPublic) => {
              var userToPush = {userID: userID, name: user.firstName + " " + user.lastName};
              this.usersForAssign.push(userToPush);
            });
          }
        }
      });
    }
  }

  saveAssignedUser() {
    jQuery("#assignIndicator").modal("hide");
    if (this.assignedHazard === "countryContext") {
      this.assignedHazard = this.countryID;
    }
    let data = {};
    data["/indicator/" + this.assignedHazard + "/" + this.assignedIndicator.$key + "/assignee"] = this.assignedUser;
    this.af.database.object(Constants.APP_STATUS).update(data).then(() => {
      this.assignedHazard = null;
      this.assignedIndicator = null;
      this.assignedUser = "undefined";
    });
  }

  createNewHazardFromCountry(hazard){
    var newHazard = {}
    newHazard['timeCreated'] = this._getCurrentTimestamp()
    newHazard['existsOnNetwork'] = hazard.existsOnNetwork
    newHazard['hazardScenario'] = hazard.hazardScenario
    newHazard['isActive'] = hazard.isActive
    newHazard['isSeasonal'] = hazard.isSeasonal
    newHazard['risk'] = hazard.risk
    console.log(newHazard)

    console.log(hazard)
    this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.networkId)
      .push(newHazard)
      .then((hazard) => {

        this.router.navigate(['/network/local-network-risk-monitoring/add-indicator/' + hazard.key])
      })
  }

}