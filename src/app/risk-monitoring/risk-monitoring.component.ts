import {Component, OnDestroy, OnInit} from "@angular/core";
import {AlertMessageType, Countries, DetailedDurationType, HazardScenario, UserType} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../model/alert-message.model";
import {LogModel} from "../model/log.model";
import {LocalStorageService} from "angular-2-local-storage";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../services/user.service";
import {Subject} from "rxjs/Subject";
import {CountryPermissionsMatrix, PageControlService} from "../services/pagecontrol.service";
import * as moment from "moment";
import {HazardImages} from "../utils/HazardImages";
import {WindowRefService} from "../services/window-ref.service";
import * as jsPDF from 'jspdf'
import {ModelUserPublic} from "../model/user-public.model";
import {ModelStaff} from "../model/staff.model";
import {Observable} from "rxjs/Observable";
import {AgencyService} from "../services/agency-service.service";

declare var jQuery: any;


@Component({
  selector: 'app-risk-monitoring',
  templateUrl: './risk-monitoring.component.html',
  styleUrls: ['./risk-monitoring.component.css']
})

export class RiskMonitoringComponent implements OnInit, OnDestroy {

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
  private staffMap = new Map()

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private storage: LocalStorageService,
              private translate: TranslateService,
              private userService: UserService,
              private agencyService: AgencyService,
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
        console.log(params)
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
        if (params["uid"]) {
          this.uid = params["uid"];
        }
        if (params["userType"]) {
          this.UserType = params["userType"];
        }

        if (this.agencyId && this.countryID) {
          this._getHazards();
          this.getCountryLocation();
          this._getCountryContextIndicators();
        } else {
          this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
            this.uid = user.uid;
            this.UserType = userType;
            this.agencyId = agencyId;
            this.countryID = countryId;
            this.systemId = systemId;
            this._getHazards();
            this.getCountryLocation();
            this._getCountryContextIndicators();
            this.getUsersForAssign();
            PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
              this.countryPermissionsMatrix = isEnabled;
            }));
            this.initStaffs()
          });
        }
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
    this.af.database.list(Constants.APP_STATUS + "/indicator/" + this.countryID).takeUntil(this.ngUnsubscribe).subscribe((indicators: any) => {
      indicators.forEach((indicator, key) => {
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
    });
  }

  _getHazards() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.countryID).takeUntil(this.ngUnsubscribe).subscribe((hazards: any) => {
        console.log(this.countryID)
        this.activeHazards = [];
        this.archivedHazards = [];
        hazards.forEach((hazard: any, key) => {
          hazard.id = hazard.$key;
          if (hazard.hazardScenario != -1) {
            hazard.imgName = this.translate.instant(this.hazardScenario[hazard.hazardScenario]).replace(" ", "_");
          }

          this.getIndicators(hazard.id).subscribe((indicators: any) => {
            indicators.forEach((indicator, key) => {
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
          });

          hazard.existsOnAgency = true

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
        res(true);

        this.getLocalNetworkIndicators()


      });
    });
    return promise;
  }


  getLocalNetworkIndicators() {
    this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyId + '/' + this.countryID + '/localNetworks')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryOfficeLocalNetworks => {
        countryOfficeLocalNetworks.forEach(localNetwork => {
          this.af.database.object(Constants.APP_STATUS + '/network/' + localNetwork.$key)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(localNetworkDetails => {

              this.af.database.list(Constants.APP_STATUS + '/hazard/' + localNetwork.$key)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(hazards => {

                  hazards.forEach(hazard => { //loop through hazards from local network

                    // ***** Start custom hazard *****
                    if (hazard.hazardScenario == -1) { // hazard is custom
                      console.log('first')
                      var filteredActiveHazards = this.activeHazards.filter(activeHazard => activeHazard.hazardScenario == -1)
                      var filteredArchivedHazards = this.archivedHazards.filter(archivedHazard => archivedHazard.hazardScenario == -1)
                      this.af.database.object(Constants.APP_STATUS + '/hazardOther/' + hazard.otherName)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(hazardName => {
                          if (hazard.isActive) {
                            filteredActiveHazards.forEach(activeHazard => {

                              this.af.database.object(Constants.APP_STATUS + '/hazardOther/' + activeHazard.otherName)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(activeHazardName => {
                                  if (hazardName.name == activeHazardName.name && hazard.isSeasonal == activeHazard.isSeasonal) { // hazard matches an existing one
                                    console.log('test')
                                    //add indicators from hazard to this active hazard
                                    this.getIndicators(hazard.$key)
                                      .takeUntil(this.ngUnsubscribe)
                                      .subscribe(indicators => {
                                        indicators.forEach(indicator => {
                                          if (indicator.countryOfficeId == this.countryID) {
                                            this.getLogs(indicator.$key).subscribe((logs: any) => {
                                              logs.forEach((log, key) => {
                                                this.getUsers(log.addedBy).subscribe((user: any) => {
                                                  log.addedByFullName = user.firstName + ' ' + user.lastName;
                                                })
                                              });
                                              indicator.logs = this._sortLogsByDate(logs);
                                              indicator.hazardId = hazard.$key
                                              indicator.networkName = localNetworkDetails.name
                                              indicator.fromNetwork = true
                                              indicator.networkId = localNetwork.$key
                                              if (!(this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                                this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                              } else {
                                                var indicatorIndex = this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.indexOf(indicator)
                                                console.log(indicatorIndex)
                                                this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.splice(indicatorIndex, 1)
                                                this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                              }

                                            });
                                          }
                                        })
                                      })
                                  } else { // hazard doesn't exactly match an existing one
                                    this.getIndicators(hazard.$key)
                                      .takeUntil(this.ngUnsubscribe)
                                      .subscribe(indicators => {
                                        indicators.forEach(indicator => {
                                          hazard.indicators = []
                                          if (indicator.countryOfficeId == this.countryID) {
                                            this.getLogs(indicator.$key).subscribe((logs: any) => {
                                              logs.forEach((log, key) => {
                                                this.getUsers(log.addedBy).subscribe((user: any) => {
                                                  log.addedByFullName = user.firstName + ' ' + user.lastName;
                                                })
                                              });
                                              indicator.logs = this._sortLogsByDate(logs);
                                              indicator.hazardId = hazard.$key
                                              indicator.networkName = localNetworkDetails.name
                                              indicator.fromNetwork = true
                                              indicator.networkId = localNetwork.$key

                                            })
                                            if (!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                              hazard.indicators.push(indicator)
                                            } else {
                                              var indicatorIndex = hazard.indicators.indexOf(indicator)
                                              console.log(indicatorIndex)
                                              hazard.indicators.splice(indicatorIndex, 1)
                                              hazard.indicators.push(indicator)
                                            }
                                          }
                                        })
                                        console.log(this.activeHazards.some(activeHazard => activeHazard.$key == hazard.$key))
                                        if (hazard.indicators && hazard.indicators.length > 0 && !(this.activeHazards.some(activeHazard => activeHazard.hazardScenario == hazard.hazardScenario))) {
                                          hazard.fromNetwork = true;
                                          hazard.networkId = localNetwork.$key
                                          hazard.existsOnAgency = false
                                          this.activeHazards.push(hazard)
                                        }
                                      })
                                  }
                                })
                            })

                          } else { // hazard is archived
                            filteredArchivedHazards.forEach(archivedHazard => {

                              this.af.database.object(Constants.APP_STATUS + '/hazardOther/' + archivedHazard.otherName)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(archivedHazardName => {
                                  if (hazardName.name == archivedHazardName.name && hazard.isSeasonal == archivedHazard.isSeasonal) { // hazard matches an existing one
                                    console.log('test')
                                    //add indicators from hazard to this active hazard
                                    this.getIndicators(hazard.$key)
                                      .takeUntil(this.ngUnsubscribe)
                                      .subscribe(indicators => {
                                        indicators.forEach(indicator => {
                                          if (indicator.countryOfficeId == this.countryID) {
                                            this.getLogs(indicator.$key).subscribe((logs: any) => {
                                              logs.forEach((log, key) => {
                                                this.getUsers(log.addedBy).subscribe((user: any) => {
                                                  log.addedByFullName = user.firstName + ' ' + user.lastName;
                                                })
                                              });
                                              indicator.logs = this._sortLogsByDate(logs);
                                              indicator.hazardId = hazard.$key
                                              indicator.networkName = localNetworkDetails.name
                                              indicator.fromNetwork = true
                                              indicator.networkId = localNetwork.$key
                                              if (!(this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                                this.archivedHazards[archivedHazard].indicators.push(indicator)
                                              } else {
                                                var indicatorIndex = this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.indexOf(indicator)
                                                console.log(indicatorIndex)
                                                this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.splice(indicatorIndex, 1)
                                                this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.push(indicator)
                                              }
                                            })
                                          }
                                        })
                                      })
                                  } else { // hazard doesn't exactly match an existing one
                                    this.getIndicators(hazard.$key)
                                      .takeUntil(this.ngUnsubscribe)
                                      .subscribe(indicators => {
                                        indicators.forEach(indicator => {
                                          hazard.indicators = []
                                          if (indicator.countryOfficeId == this.countryID) {
                                            this.getLogs(indicator.$key).subscribe((logs: any) => {
                                              logs.forEach((log, key) => {
                                                this.getUsers(log.addedBy).subscribe((user: any) => {
                                                  log.addedByFullName = user.firstName + ' ' + user.lastName;
                                                })
                                              });
                                              indicator.logs = this._sortLogsByDate(logs);
                                              indicator.hazardId = hazard.$key
                                              indicator.netowrkName = localNetworkDetails.name
                                              indicator.fromNetwork = true
                                              indicator.networkId = localNetwork.$key
                                            })
                                            if (!(hazard.indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                              hazard.indicators.push(indicator)
                                            } else {
                                              var indicatorIndex = hazard.indicators.indexOf(indicator)
                                              console.log(indicatorIndex)
                                              hazard.indicators.splice(indicatorIndex, 1)
                                              hazard.indicators.push(indicator)
                                            }
                                          }
                                        })
                                        console.log(this.archivedHazards)
                                        console.log(hazard)
                                        if (hazard.indicators && hazard.indicators.length > 0 && !(this.archivedHazards.some(archivedHazard => archivedHazard.hazardScenario == hazard.hazardScenario))) {
                                          hazard.fromNetwork = true;
                                          hazard.networkId = localNetwork.$key
                                          hazard.existsOnAgency = false
                                          this.archivedHazards.push(hazard)
                                        }
                                      })
                                  }
                                })
                            })
                          }
                        })
                      // ***** End custom hazard *****
                    } else { // hazard is not custom

                      if (this.activeHazards.some(activeHazard => activeHazard.hazardScenario == hazard.hazardScenario && activeHazard.isSeasonal == hazard.isSeasonal)) { // hazard matches an existing one

                        if (hazard.isActive) {
                          this.activeHazards.forEach(activeHazard => {
                            console.log(hazard)

                            if (hazard.isSeasonal == activeHazard.isSeasonal && hazard.hazardScenario == activeHazard.hazardScenario) {
                              console.log('test')
                              //add indicators from hazard to this active hazard
                              this.getIndicators(hazard.$key)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(indicators => {
                                  indicators.forEach(indicator => {
                                    if (indicator.countryOfficeId == this.countryID) {
                                      this.getLogs(indicator.$key).subscribe((logs: any) => {
                                        logs.forEach((log, key) => {
                                          this.getUsers(log.addedBy).subscribe((user: any) => {
                                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                                          })
                                        });
                                        indicator.logs = this._sortLogsByDate(logs);
                                        indicator.hazardId = hazard.$key
                                        indicator.networkName = localNetworkDetails.name
                                        indicator.fromNetwork = true
                                        indicator.networkId = localNetwork.$key
                                        if (!(this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                          this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                        } else {
                                          var indicatorIndex = this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.indexOf(indicator)
                                          console.log(indicatorIndex)
                                          this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.splice(indicatorIndex, 1)
                                          this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                        }
                                      })

                                    }
                                  })
                                })
                            } else {
                              this.getIndicators(hazard.$key)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(indicators => {
                                  indicators.forEach(indicator => {
                                    hazard.indicators = []
                                    if (indicator.countryOfficeId == this.countryID) {
                                      this.getLogs(indicator.$key).subscribe((logs: any) => {
                                        logs.forEach((log, key) => {
                                          this.getUsers(log.addedBy).subscribe((user: any) => {
                                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                                          })
                                        });
                                        indicator.logs = this._sortLogsByDate(logs);
                                        indicator.hazardId = hazard.$key
                                        indicator.netowrkName = localNetworkDetails.name
                                        indicator.fromNetwork = true
                                        indicator.networkId = localNetwork.$key

                                      })
                                      if (!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                        hazard.indicators.push(indicator)
                                      } else {
                                        var indicatorIndex = hazard.indicators.indexOf(indicator)
                                        console.log(indicatorIndex)
                                        hazard.indicators.splice(indicatorIndex, 1)
                                        hazard.indicators.push(indicator)
                                      }
                                    }
                                  })
                                  console.log(this.activeHazards.some(activeHazard => activeHazard.$key == hazard.$key))
                                  if (hazard.indicators && hazard.indicators.length > 0 && !(this.activeHazards.some(activeHazard => activeHazard.hazardScenario == hazard.hazardScenario))) {
                                    hazard.fromNetwork = true;
                                    hazard.networkId = localNetwork.$key
                                    hazard.existsOnAgency = false
                                    this.activeHazards.push(hazard)
                                  }
                                })
                            }

                          })

                        } else {
                          this.archivedHazards.forEach(archivedHazard => {

                            if (hazard.isSeasonal == archivedHazard.isSeasonal && hazard.hazardScenario == archivedHazard.hazardScenario) {
                              console.log('test')
                              //add indicators from hazard to this active hazard
                              this.getIndicators(hazard.$key)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(indicators => {
                                  indicators.forEach(indicator => {
                                    if (indicator.countryOfficeId == this.countryID) {

                                      this.getLogs(indicator.$key).subscribe((logs: any) => {
                                        logs.forEach((log, key) => {
                                          this.getUsers(log.addedBy).subscribe((user: any) => {
                                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                                          })
                                        });
                                        indicator.logs = this._sortLogsByDate(logs);
                                        indicator.hazardId = hazard.$key
                                        indicator.networkName = localNetworkDetails.name
                                        indicator.fromNetwork = true
                                        indicator.networkId = localNetwork.$key
                                        if (!(this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                          this.archivedHazards[archivedHazard].indicators.push(indicator)
                                        } else {
                                          var indicatorIndex = this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.indexOf(indicator)
                                          console.log(indicatorIndex)
                                          this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.splice(indicatorIndex, 1)
                                          this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.push(indicator)
                                        }
                                      })
                                    }
                                  })
                                })
                            } else {
                              this.getIndicators(hazard.$key)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(indicators => {
                                  indicators.forEach(indicator => {
                                    hazard.indicators = []
                                    if (indicator.countryOfficeId == this.countryID) {
                                      this.getLogs(indicator.$key).subscribe((logs: any) => {
                                        logs.forEach((log, key) => {
                                          this.getUsers(log.addedBy).subscribe((user: any) => {
                                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                                          })
                                        });
                                        indicator.logs = this._sortLogsByDate(logs);
                                        indicator.hazardId = hazard.$key
                                        indicator.networkName = localNetworkDetails.name
                                        indicator.fromNetwork = true
                                        indicator.networkId = localNetwork.$key

                                      })
                                      if (!(hazard.indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                        hazard.indicators.push(indicator)
                                      } else {
                                        var indicatorIndex = hazard.indicators.indexOf(indicator)
                                        console.log(indicatorIndex)
                                        hazard.indicators.splice(indicatorIndex, 1)
                                        hazard.indicators.push(indicator)
                                      }
                                    }
                                  })

                                  if (hazard.indicators && hazard.indicators.length > 0 && !(this.archivedHazards.some(archivedHazard => archivedHazard.hazardScenario == hazard.hazardScenario))) {
                                    hazard.fromNetwork = true;
                                    hazard.networkId = localNetwork.$key
                                    hazard.existsOnAgency = false
                                    this.archivedHazards.push(hazard)
                                  }
                                })
                            }

                          })
                        }
                      } else { // hazard doesn't match an existing one


                        if (hazard.isActive) {
                          this.getIndicators(hazard.$key)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe(indicators => {
                              indicators.forEach(indicator => {
                                hazard.indicators = []
                                if (indicator.countryOfficeId == this.countryID) {
                                  this.getLogs(indicator.$key).subscribe((logs: any) => {
                                    logs.forEach((log, key) => {
                                      this.getUsers(log.addedBy).subscribe((user: any) => {
                                        log.addedByFullName = user.firstName + ' ' + user.lastName;
                                      })
                                    });
                                    indicator.logs = this._sortLogsByDate(logs);
                                    indicator.hazardId = hazard.$key
                                    indicator.networkName = localNetworkDetails.name
                                    indicator.fromNetwork = true
                                    indicator.networkId = localNetwork.$key

                                  })
                                  if (!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                    hazard.indicators.push(indicator)
                                  } else {
                                    var indicatorIndex = hazard.indicators.indexOf(indicator)
                                    console.log(indicatorIndex)
                                    hazard.indicators.splice(indicatorIndex, 1)
                                    hazard.indicators.push(indicator)
                                  }
                                }
                              })

                              if (hazard.indicators && hazard.indicators.length > 0 && !(this.activeHazards.some(activeHazard => activeHazard.hazardScenario == hazard.hazardScenario))) {
                                hazard.fromNetwork = true;
                                hazard.networkId = localNetwork.$key
                                hazard.existsOnAgency = false
                                this.activeHazards.push(hazard)
                              }
                            })
                        } else {
                          this.getIndicators(hazard.$key)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe(indicators => {
                              indicators.forEach(indicator => {
                                hazard.indicators = []
                                if (indicator.countryOfficeId == this.countryID) {
                                  this.getLogs(indicator.$key).subscribe((logs: any) => {
                                    logs.forEach((log, key) => {
                                      this.getUsers(log.addedBy).subscribe((user: any) => {
                                        log.addedByFullName = user.firstName + ' ' + user.lastName;
                                      })
                                    });
                                    indicator.logs = this._sortLogsByDate(logs);
                                    indicator.hazardId = hazard.$key
                                    indicator.networkName = localNetworkDetails.name
                                    indicator.fromNetwork = true
                                    indicator.networkId = localNetwork.$key

                                  })
                                  if (!(hazard.indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                    hazard.indicators.push(indicator)
                                  } else {
                                    var indicatorIndex = hazard.indicators.indexOf(indicator)
                                    console.log(indicatorIndex)
                                    hazard.indicators.splice(indicatorIndex, 1)
                                    hazard.indicators.push(indicator)
                                  }
                                }
                              })
                              if (hazard.indicators && hazard.indicators.length > 0 && !(this.archivedHazards.some(archivedHazard => archivedHazard.hazardScenario == hazard.hazardScenario))) {
                                hazard.fromNetwork = true;
                                hazard.networkId = localNetwork.$key
                                hazard.existsOnAgency = false
                                this.archivedHazards.push(hazard)
                              }
                            })
                        }

                      }
                    }
                  })
                })

            })
        })
        this.getNetworkIndicators()
      })
  }

  getNetworkIndicators() {
    this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyId + '/' + this.countryID + '/networks')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryOfficeNetworks => {
        countryOfficeNetworks.forEach(network => {
          this.af.database.object(Constants.APP_STATUS + '/network/' + network.$key)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(networkDetails => {
              this.af.database.list(Constants.APP_STATUS + '/hazard/' + network.networkCountryId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(hazards => {

                  hazards.forEach(hazard => { //loop through hazards from local network

                    // ***** Start custom hazard *****
                    if (hazard.hazardScenario == -1) { // hazard is custom
                      var filteredActiveHazards = this.activeHazards.filter(activeHazard => activeHazard.hazardScenario == -1)
                      var filteredArchivedHazards = this.archivedHazards.filter(archivedHazard => archivedHazard.hazardScenario == -1)
                      this.af.database.object(Constants.APP_STATUS + '/hazardOther/' + hazard.otherName)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(hazardName => {
                          if (hazard.isActive) {
                            filteredActiveHazards.forEach(activeHazard => {

                              this.af.database.object(Constants.APP_STATUS + '/hazardOther/' + activeHazard.otherName)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(activeHazardName => {
                                  if (hazardName.name == activeHazardName.name && hazard.isSeasonal == activeHazard.isSeasonal) { // hazard matches an existing one
                                    //add indicators from hazard to this active hazard
                                    this.getIndicators(hazard.$key)
                                      .takeUntil(this.ngUnsubscribe)
                                      .subscribe(indicators => {
                                        indicators.forEach(indicator => {
                                          if (indicator.countryOfficeId == this.countryID) {
                                            this.getLogs(indicator.$key).subscribe((logs: any) => {
                                              logs.forEach((log, key) => {
                                                this.getUsers(log.addedBy).subscribe((user: any) => {
                                                  log.addedByFullName = user.firstName + ' ' + user.lastName;
                                                })
                                              });
                                              indicator.logs = this._sortLogsByDate(logs);
                                              indicator.hazardId = hazard.$key
                                              indicator.networkName = networkDetails.name
                                              indicator.fromNetwork = true
                                              indicator.networkId = network.$key
                                              indicator.networkCountryId = network.networkCountryId
                                              if (!(this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                                this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                              } else {
                                                var indicatorIndex = this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.indexOf(indicator)
                                                console.log(indicatorIndex)
                                                this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.splice(indicatorIndex, 1)
                                                this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                              }
                                            })
                                          }
                                        })
                                      })
                                  } else { // hazard doesn't exactly match an existing one
                                    this.getIndicators(hazard.$key)
                                      .takeUntil(this.ngUnsubscribe)
                                      .subscribe(indicators => {
                                        indicators.forEach(indicator => {
                                          hazard.indicators = []
                                          if (indicator.countryOfficeId == this.countryID) {
                                            this.getLogs(indicator.$key).subscribe((logs: any) => {
                                              logs.forEach((log, key) => {
                                                this.getUsers(log.addedBy).subscribe((user: any) => {
                                                  log.addedByFullName = user.firstName + ' ' + user.lastName;
                                                })
                                              });
                                              indicator.logs = this._sortLogsByDate(logs);
                                              indicator.hazardId = hazard.$key
                                              indicator.networkName = networkDetails.name
                                              indicator.fromNetwork = true
                                              indicator.networkId = network.$key
                                              indicator.networkCountryId = network.networkCountryId
                                            })
                                            if (!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                              hazard.indicators.push(indicator)
                                            } else {
                                              var indicatorIndex = hazard.indicators.indexOf(indicator)
                                              console.log(indicatorIndex)
                                              hazard.indicators.splice(indicatorIndex, 1)
                                              hazard.indicators.push(indicator)
                                            }
                                          }
                                        })
                                        if (hazard.indicators && hazard.indicators.length > 0 && !(this.activeHazards.some(activeHazard => activeHazard.hazardScenario == hazard.hazardScenario))) {

                                          hazard.fromNetwork = true;
                                          hazard.networkId = network.$key
                                          hazard.networkCountryId = network.networkCountryId
                                          hazard.existsOnAgency = false
                                          this.activeHazards.push(hazard)
                                        }
                                      })
                                  }
                                })
                            })

                          } else { // hazard is archived
                            filteredArchivedHazards.forEach(archivedHazard => {

                              this.af.database.object(Constants.APP_STATUS + '/hazardOther/' + archivedHazard.otherName)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(archivedHazardName => {
                                  if (hazardName.name == archivedHazardName.name && hazard.isSeasonal == archivedHazard.isSeasonal) { // hazard matches an existing one

                                    //add indicators from hazard to this active hazard
                                    this.getIndicators(hazard.$key)
                                      .takeUntil(this.ngUnsubscribe)
                                      .subscribe(indicators => {
                                        indicators.forEach(indicator => {
                                          if (indicator.countryOfficeId == this.countryID) {
                                            this.getLogs(indicator.$key).subscribe((logs: any) => {
                                              logs.forEach((log, key) => {
                                                this.getUsers(log.addedBy).subscribe((user: any) => {
                                                  log.addedByFullName = user.firstName + ' ' + user.lastName;
                                                })
                                              });
                                              indicator.logs = this._sortLogsByDate(logs);
                                              indicator.hazardId = hazard.$key
                                              indicator.networkName = networkDetails.name
                                              indicator.fromNetwork = true
                                              indicator.networkId = network.$key
                                              indicator.networkCountryId = network.networkCountryId
                                              if (!(this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                                this.archivedHazards[archivedHazard].indicators.push(indicator)
                                              } else {
                                                var indicatorIndex = this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.indexOf(indicator)
                                                console.log(indicatorIndex)
                                                this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.splice(indicatorIndex, 1)
                                                this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.push(indicator)
                                              }
                                            })
                                          }
                                        })
                                      })
                                  } else { // hazard doesn't exactly match an existing one
                                    this.getIndicators(hazard.$key)
                                      .takeUntil(this.ngUnsubscribe)
                                      .subscribe(indicators => {
                                        indicators.forEach(indicator => {
                                          hazard.indicators = []
                                          if (indicator.countryOfficeId == this.countryID) {
                                            this.getLogs(indicator.$key).subscribe((logs: any) => {
                                              logs.forEach((log, key) => {
                                                this.getUsers(log.addedBy).subscribe((user: any) => {
                                                  log.addedByFullName = user.firstName + ' ' + user.lastName;
                                                })
                                              });
                                              indicator.logs = this._sortLogsByDate(logs);
                                              indicator.hazardId = hazard.$key
                                              indicator.networkName = networkDetails.name
                                              indicator.fromNetwork = true
                                              indicator.networkId = network.$key
                                              indicator.networkCountryId = network.networkCountryId

                                            })
                                            if (!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                              hazard.indicators.push(indicator)
                                            } else {
                                              var indicatorIndex = hazard.indicators.indexOf(indicator)
                                              console.log(indicatorIndex)
                                              hazard.indicators.splice(indicatorIndex, 1)
                                              hazard.indicators.push(indicator)
                                            }
                                          }
                                        })
                                        if (hazard.indicators && hazard.indicators.length > 0 && !(this.archivedHazards.some(archivedHazard => archivedHazard.hazardScenario == hazard.hazardScenario))) {
                                          hazard.fromNetwork = true;
                                          hazard.networkId = network.$key
                                          hazard.networkCountryId = network.networkCountryId
                                          hazard.existsOnAgency = false
                                          this.archivedHazards.push(hazard)
                                        }
                                      })
                                  }
                                })
                            })
                          }
                        })
                      // ***** End custom hazard *****
                    } else { // hazard is not custom

                      if (this.activeHazards.some(activeHazard => activeHazard.hazardScenario == hazard.hazardScenario && activeHazard.isSeasonal == hazard.isSeasonal)) { // hazard matches an existing one


                        if (hazard.isActive) {
                          this.activeHazards.forEach(activeHazard => {


                            if (hazard.isSeasonal == activeHazard.isSeasonal && hazard.hazardScenario == activeHazard.hazardScenario) {

                              //add indicators from hazard to this active hazard
                              this.getIndicators(hazard.$key)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(indicators => {
                                  indicators.forEach(indicator => {
                                    if (indicator.countryOfficeId == this.countryID) {
                                      this.getLogs(indicator.$key).subscribe((logs: any) => {
                                        logs.forEach((log, key) => {
                                          this.getUsers(log.addedBy).subscribe((user: any) => {
                                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                                          })
                                        });
                                        indicator.logs = this._sortLogsByDate(logs);
                                        indicator.hazardId = hazard.$key
                                        indicator.networkName = networkDetails.name
                                        indicator.fromNetwork = true
                                        indicator.networkId = network.$key
                                        indicator.networkCountryId = network.networkCountryId
                                        if (!(this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                          this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                        } else {
                                          var indicatorIndex = this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.indexOf(indicator)
                                          console.log(indicatorIndex)
                                          this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.splice(indicatorIndex, 1)
                                          this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                        }
                                      })
                                    }
                                  })
                                })
                            } else {
                              this.getIndicators(hazard.$key)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(indicators => {
                                  indicators.forEach(indicator => {
                                    hazard.indicators = []
                                    if (indicator.countryOfficeId == this.countryID) {
                                      this.getLogs(indicator.$key).subscribe((logs: any) => {
                                        logs.forEach((log, key) => {
                                          this.getUsers(log.addedBy).subscribe((user: any) => {
                                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                                          })
                                        });
                                        indicator.logs = this._sortLogsByDate(logs);
                                        indicator.hazardId = hazard.$key
                                        indicator.networkName = networkDetails.name
                                        indicator.fromNetwork = true
                                        indicator.networkId = network.$key
                                        indicator.networkCountryId = network.networkCountryId

                                      })
                                      if (!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                        hazard.indicators.push(indicator)
                                      } else {
                                        var indicatorIndex = hazard.indicators.indexOf(indicator)
                                        console.log(indicatorIndex)
                                        hazard.indicators.splice(indicatorIndex, 1)
                                        hazard.indicators.push(indicator)
                                      }
                                    }
                                  })
                                  if (hazard.indicators && hazard.indicators.length > 0 && !(this.activeHazards.some(activeHazard => activeHazard.hazardScenario == hazard.hazardScenario))) {

                                    hazard.fromNetwork = true;
                                    hazard.networkId = network.$key
                                    hazard.networkCountryId = network.networkCountryId
                                    hazard.existsOnAgency = false
                                    this.activeHazards.push(hazard)
                                  }
                                })
                            }

                          })

                        } else {
                          this.archivedHazards.forEach(archivedHazard => {

                            if (hazard.isSeasonal == archivedHazard.isSeasonal && hazard.hazardScenario == archivedHazard.hazardScenario) {

                              //add indicators from hazard to this active hazard
                              this.getIndicators(hazard.$key)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(indicators => {
                                  indicators.forEach(indicator => {
                                    if (indicator.countryOfficeId == this.countryID) {
                                      this.getLogs(indicator.$key).subscribe((logs: any) => {
                                        logs.forEach((log, key) => {
                                          this.getUsers(log.addedBy).subscribe((user: any) => {
                                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                                          })
                                        });
                                        indicator.logs = this._sortLogsByDate(logs);
                                        indicator.hazardId = hazard.$key
                                        indicator.networkName = networkDetails.name
                                        indicator.fromNetwork = true
                                        indicator.networkId = network.$key
                                        indicator.networkCountryId = network.networkCountryId
                                        if (!(this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                          this.archivedHazards[archivedHazard].indicators.push(indicator)
                                        } else {
                                          var indicatorIndex = this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.indexOf(indicator)
                                          console.log(indicatorIndex)
                                          this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.splice(indicatorIndex, 1)
                                          this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.push(indicator)
                                        }
                                      })
                                    }
                                  })
                                })
                            } else {
                              this.getIndicators(hazard.$key)
                                .takeUntil(this.ngUnsubscribe)
                                .subscribe(indicators => {
                                  indicators.forEach(indicator => {
                                    hazard.indicators = []
                                    if (indicator.countryOfficeId == this.countryID) {
                                      this.getLogs(indicator.$key).subscribe((logs: any) => {
                                        logs.forEach((log, key) => {
                                          this.getUsers(log.addedBy).subscribe((user: any) => {
                                            log.addedByFullName = user.firstName + ' ' + user.lastName;
                                          })
                                        });
                                        indicator.logs = this._sortLogsByDate(logs);
                                        indicator.hazardId = hazard.$key
                                        indicator.networkName = networkDetails.name
                                        indicator.fromNetwork = true
                                        indicator.networkId = network.$key
                                        indicator.networkCountryId = network.networkCountryId

                                      })
                                      hazard.indicators.push(indicator)
                                    }
                                  })
                                  if (hazard.indicators && hazard.indicators.length > 0 && !(this.archivedHazards.some(archivedHazard => archivedHazard.hazardScenario == hazard.hazardScenario))) {
                                    hazard.fromNetwork = true;
                                    hazard.networkId = network.$key
                                    hazard.networkCountryId = network.networkCountryId
                                    hazard.existsOnAgency = false
                                    this.archivedHazards.push(hazard)
                                  }
                                })
                            }

                          })
                        }
                      } else { // hazard doesn't match an existing one

                        if (hazard.isActive) {
                          this.getIndicators(hazard.$key)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe(indicators => {
                              indicators.forEach(indicator => {
                                hazard.indicators = []
                                if (indicator.countryOfficeId == this.countryID) {
                                  this.getLogs(indicator.$key).subscribe((logs: any) => {
                                    logs.forEach((log, key) => {
                                      this.getUsers(log.addedBy).subscribe((user: any) => {
                                        log.addedByFullName = user.firstName + ' ' + user.lastName;
                                      })
                                    });
                                    indicator.logs = this._sortLogsByDate(logs);
                                    indicator.hazardId = hazard.$key
                                    indicator.networkName = networkDetails.name
                                    indicator.fromNetwork = true
                                    indicator.networkId = network.$key
                                    indicator.networkCountryId = network.networkCountryId

                                  })
                                  if (!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                    hazard.indicators.push(indicator)
                                  } else {
                                    var indicatorIndex = hazard.indicators.indexOf(indicator)
                                    console.log(indicatorIndex)
                                    hazard.indicators.splice(indicatorIndex, 1)
                                    hazard.indicators.push(indicator)
                                  }
                                }
                              })
                              if (hazard.indicators && hazard.indicators.length > 0 && !(this.activeHazards.some(activeHazard => activeHazard.hazardScenario == hazard.hazardScenario))) {
                                hazard.fromNetwork = true;
                                hazard.networkId = network.$key
                                hazard.networkCountryId = network.networkCountryId
                                hazard.existsOnAgency = false
                                this.activeHazards.push(hazard)
                              }
                            })
                        } else {
                          this.getIndicators(hazard.$key)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe(indicators => {
                              indicators.forEach(indicator => {
                                hazard.indicators = []
                                if (indicator.countryOfficeId == this.countryID) {
                                  this.getLogs(indicator.$key).subscribe((logs: any) => {
                                    logs.forEach((log, key) => {
                                      this.getUsers(log.addedBy).subscribe((user: any) => {
                                        log.addedByFullName = user.firstName + ' ' + user.lastName;
                                      })
                                    });
                                    indicator.logs = this._sortLogsByDate(logs);
                                    indicator.hazardId = hazard.$key
                                    indicator.networkName = networkDetails.name
                                    indicator.fromNetwork = true
                                    indicator.networkId = network.$key
                                    indicator.networkCountryId = network.networkCountryId
                                  })
                                  if (!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                    hazard.indicators.push(indicator)
                                  } else {
                                    var indicatorIndex = hazard.indicators.indexOf(indicator)
                                    console.log(indicatorIndex)
                                    hazard.indicators.splice(indicatorIndex, 1)
                                    hazard.indicators.push(indicator)
                                  }
                                }
                              })
                              if (hazard.indicators && hazard.indicators.length > 0 && !(this.archivedHazards.some(archivedHazard => archivedHazard.hazardScenario == hazard.hazardScenario))) {
                                hazard.fromNetwork = true;
                                hazard.networkId = network.$key
                                hazard.networkCountryId = network.networkCountryId
                                hazard.existsOnAgency = false
                                this.archivedHazards.push(hazard)
                              }
                            })
                        }

                      }
                    }
                  })
                })
            })
        })
      })
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
    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.countryID + '/' + this.tmpHazardData['ID']).remove().then(() => {
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
    var dataToSave = {triggerSelected: triggerSelected, updatedAt: new Date().getTime()};
    dataToSave['dueDate'] = this._getIndicatorFutureTimestamp(indicator); // update the due date

    var urlToUpdate;

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1,level: triggerSelected};
    let id = hazardID == 'countryContext' ? this.countryID : hazardID;

    if(indicator["timeTracking"]){
      dataToSave["timeTracking"] = indicator["timeTracking"];

      if(indicator.triggerSelected == 0){
        if(!dataToSave["timeTracking"]["timeSpentInGreen"]){
          dataToSave["timeTracking"]["timeSpentInGreen"] = [];
        }
          dataToSave["timeTracking"]["timeSpentInGreen"][dataToSave["timeTracking"]["timeSpentInGreen"].findIndex(x => x.finish == -1)].finish = currentTime

      }
      if(indicator.triggerSelected == 1){
        if(!dataToSave["timeTracking"]["timeSpentInAmber"]){
          dataToSave["timeTracking"]["timeSpentInAmber"] = [];
        }
          dataToSave["timeTracking"]["timeSpentInAmber"][dataToSave["timeTracking"]["timeSpentInAmber"].findIndex(x => x.finish == -1)].finish = currentTime

      }
      if(indicator.triggerSelected == 2){
        if(!dataToSave["timeTracking"]["timeSpentInRed"]){
          dataToSave["timeTracking"]["timeSpentInRed"] = [];
        }
          dataToSave["timeTracking"]["timeSpentInRed"][dataToSave["timeTracking"]["timeSpentInRed"].findIndex(x => x.finish == -1)].finish = currentTime
      }


      if(triggerSelected == 0){
        if(!dataToSave["timeTracking"]["timeSpentInGreen"]){
          dataToSave["timeTracking"]["timeSpentInGreen"] = [];
        }
        dataToSave["timeTracking"]["timeSpentInGreen"].push(newTimeObject)
      }
      if(triggerSelected == 1){
        if(!dataToSave["timeTracking"]["timeSpentInAmber"]){
          dataToSave["timeTracking"]["timeSpentInAmber"] = [];
        }
        dataToSave["timeTracking"]["timeSpentInAmber"].push(newTimeObject)
      }
      if(triggerSelected == 2){
        if(!dataToSave["timeTracking"]["timeSpentInRed"]){
          dataToSave["timeTracking"]["timeSpentInRed"] = [];
        }
        dataToSave["timeTracking"]["timeSpentInRed"].push(newTimeObject)
      }

      
    }else{

      dataToSave["timeTracking"] = {}
      if(triggerSelected == 0){
        dataToSave["timeTracking"]["timeSpentInGreen"] = []
        dataToSave["timeTracking"]["timeSpentInGreen"].push(newTimeObject)
      }

      if(triggerSelected == 1){
        dataToSave["timeTracking"]["timeSpentInAmber"] = []
        dataToSave["timeTracking"]["timeSpentInAmber"].push(newTimeObject)
      }

      if(triggerSelected == 2){
        dataToSave["timeTracking"]["timeSpentInRed"] = []
        dataToSave["timeTracking"]["timeSpentInRed"].push(newTimeObject)
      }

    }


    if (hazardID == 'countryContext') {
      urlToUpdate = Constants.APP_STATUS + '/indicator/' + this.countryID + '/' + indicatorID;
    } else {
      urlToUpdate = Constants.APP_STATUS + '/indicator/' + hazardID + '/' + indicatorID;
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
    if (!hazardID) {
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
    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.countryID + '/' + this.tmpHazardData['ID'])
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
        this.router.navigate(["/risk-monitoring/add-indicator/countryContext", {
          "countryId": this.countryID,
          "agencyId": this.agencyId,
          "systemId": this.systemId,
          "indicatorId": indicator.$key,
          "isContext": isContext,
          "agencyOverview": true,
          "userType": this.UserType,
          "uid": this.uid
        }]);
      } else {
        this.router.navigate(["/risk-monitoring/add-indicator/countryContext", {
          "countryId": this.countryID,
          "agencyId": this.agencyId,
          "systemId": this.systemId,
          "indicatorId": indicator.$key,
          "isContext": isContext,
          "userType": this.UserType,
          "uid": this.uid
        }]);
      }

    } else {
      let hazardScenario = hazard.hazardScenario;
      console.log(this.UserType)
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
                  this.router.navigate(["/risk-monitoring/add-indicator/" + hazards[0].$key, {
                    "countryId": this.countryID,
                    "agencyId": this.agencyId,
                    "systemId": this.systemId,
                    "indicatorId": indicator.$key,
                    "hazardId": hazard.$key,
                    "isContext": isContext,
                    "agencyOverview": true,
                    "userType": this.UserType,
                    "uid": this.uid
                  }]);
                } else {
                  this.router.navigate(["/risk-monitoring/add-indicator/" + hazards[0].$key, {
                    "countryId": this.countryID,
                    "agencyId": this.agencyId,
                    "systemId": this.systemId,
                    "indicatorId": indicator.$key,
                    "hazardId": hazard.$key,
                    "isContext": isContext,
                    "userType": this.UserType,
                    "uid": this.uid
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
      if ((!this.fromDate || log['timeStamp'] >= this.fromDateTimeStamp) && (!this.toDate || log['timeStamp'] <= this.toDateTimeStamp)) {
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

  private initStaffs() {
    this.userService.getStaffList(this.countryID)
      .flatMap(staffList => {
        return Observable.from(staffList.map(staff => staff.id))
      })
      .flatMap(staffId => {
        return this.userService.getUser(staffId)
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        this.staffMap.set(user.id, user)
      })

    //get country admin
    this.agencyService.getCountryOffice(this.countryID, this.agencyId)
      .flatMap(office => {
        return this.userService.getUser(office.adminId)
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(countryAdmin => {
        this.staffMap.set(countryAdmin.id, countryAdmin)
      })
  }
}
