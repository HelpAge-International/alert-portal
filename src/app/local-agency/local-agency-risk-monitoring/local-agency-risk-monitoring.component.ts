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
import {Subject} from "rxjs/Subject";
import {CountryPermissionsMatrix, PageControlService} from "../../services/pagecontrol.service";
import * as moment from "moment";
import {HazardImages} from "../../utils/HazardImages";
import {WindowRefService} from "../../services/window-ref.service";
import * as jsPDF from 'jspdf'
import {ModelUserPublic} from "../../model/user-public.model";
import * as firebase from "firebase/app";
import App = firebase.app.App;
import {subscribeOn} from "rxjs/operator/subscribeOn";

declare var jQuery: any;
@Component({
  selector: 'app-local-agency-risk-monitoring',
  templateUrl: './local-agency-risk-monitoring.component.html',
  styleUrls: ['./local-agency-risk-monitoring.component.scss']
})
export class LocalAgencyRiskMonitoringComponent implements OnInit {

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

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private storage: LocalStorageService,
              private translate: TranslateService,
              private userService: UserService,
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

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.agencyId = agencyId;
      this.uid = user.uid;


      this._getHazards();
      this.getAgencyLocation();
      this._getCountryContextIndicators();
    })

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getAgencyLocation() {
    let promise = new Promise((res, rej) => {
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/country")
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
    this.af.database.list(Constants.APP_STATUS + "/indicator/" + this.agencyId).takeUntil(this.ngUnsubscribe).subscribe((indicators: any) => {
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
      console.log(Constants.APP_STATUS + "/hazard/" + this.agencyId)
      this.af.database.list(Constants.APP_STATUS + "/hazard/" + this.agencyId).takeUntil(this.ngUnsubscribe).subscribe((hazards: any) => {
        console.log(hazards)
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
    this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyId + '/localNetworks')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyLocalNetworks => {
        agencyLocalNetworks.forEach(localNetwork => {
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
                                          if (indicator.agencyId == this.agencyId) {
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
                                              if(!(this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))){
                                                this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                              } else{
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
                                          if (indicator.agencyId == this.agencyId) {
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
                                            if(!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                              hazard.indicators.push(indicator)
                                            }else{
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
                                          if (indicator.agencyId == this.agencyId) {
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
                                              if(!(this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                                this.archivedHazards[archivedHazard].indicators.push(indicator)
                                              }else{
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
                                          if (indicator.agencyId == this.agencyId) {
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
                                            if(!(hazard.indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                              hazard.indicators.push(indicator)
                                            }else{
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
                                    if (indicator.agencyId == this.agencyId) {
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
                                        if(!(this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                          this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                        }else{
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
                                    if (indicator.agencyId == this.agencyId) {
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
                                      if(!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                        hazard.indicators.push(indicator)
                                      }else{
                                        var indicatorIndex = hazard.indicators.indexOf(indicator)
                                        console.log(indicatorIndex)
                                        hazard.indicators.splice(indicatorIndex, 1)
                                        hazard.indicators.push(indicator)
                                      }
                                    }
                                  })
                                  console.log(this.activeHazards.some(activeHazard => activeHazard.$key == hazard.$key))
                                  if ( hazard.indicators && hazard.indicators.length > 0 && !(this.activeHazards.some(activeHazard => activeHazard.hazardScenario == hazard.hazardScenario))) {
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
                                    if (indicator.agencyId == this.agencyId) {

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
                                        if(!(this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                          this.archivedHazards[archivedHazard].indicators.push(indicator)
                                        }else{
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
                                    if (indicator.agencyId == this.agencyId) {
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
                                      if(!(hazard.indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                        hazard.indicators.push(indicator)
                                      }else{
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
                                if (indicator.agencyId == this.agencyId) {
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
                                  if(!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                    hazard.indicators.push(indicator)
                                  }else{
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
                                if (indicator.agencyId == this.agencyId) {
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
                                  if(!(hazard.indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                    hazard.indicators.push(indicator)
                                  }else{
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
    this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyId + '/networks')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyNetworks => {
        agencyNetworks.forEach(network => {
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
                                          if (indicator.agencyId == this.agencyId) {
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
                                              if(!(this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                                this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                              }else{
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
                                          if (indicator.agencyId == this.agencyId) {
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
                                            if(!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                              hazard.indicators.push(indicator)
                                            }else{
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
                                          if (indicator.agencyId == this.agencyId) {
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
                                              if(!(this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                                this.archivedHazards[archivedHazard].indicators.push(indicator)
                                              }else{
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
                                          if (indicator.agencyId == this.agencyId) {
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
                                            if(!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                              hazard.indicators.push(indicator)
                                            }else{
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
                                    if (indicator.agencyId == this.agencyId) {
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
                                        if(!(this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                          this.activeHazards[this.activeHazards.indexOf(activeHazard)].indicators.push(indicator)
                                        }else{
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
                                    if (indicator.agencyId == this.agencyId) {
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
                                      if(!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                        hazard.indicators.push(indicator)
                                      }else{
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
                                    if (indicator.agencyId == this.agencyId) {
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
                                        if(!(this.archivedHazards[this.archivedHazards.indexOf(archivedHazard)].indicators.some(archivedIndicator => archivedIndicator.$key == indicator.$key))) {
                                          this.archivedHazards[archivedHazard].indicators.push(indicator)
                                        }else{
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
                                    if (indicator.agencyId == this.agencyId) {
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
                                if (indicator.agencyId == this.agencyId) {
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
                                  if(!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                    hazard.indicators.push(indicator)
                                  }else{
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
                                if (indicator.agencyId == this.agencyId) {
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
                                  if(!(hazard.indicators.some(activeIndicator => activeIndicator.$key == indicator.$key))) {
                                    hazard.indicators.push(indicator)
                                  }else{
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
    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.agencyId + '/' + this.tmpHazardData['ID']).remove().then(() => {
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

    if (hazardID == 'countryContext') {
      urlToUpdate = Constants.APP_STATUS + '/indicator/' + this.agencyId + '/' + indicatorID;
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
      console.log(dataToSave)

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
    this.af.database.object(Constants.APP_STATUS + '/hazard/' + this.agencyId + '/' + this.tmpHazardData['ID'])
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
        this.router.navigate(["/local-agency/risk-monitoring/add-indicator/countryContext", {
          "countryId": this.countryID,
          "agencyId": this.agencyId,
          "systemId": this.systemId,
          "indicatorId": indicator.$key,
          "isContext": isContext,
          "agencyOverview": true
        }]);
      } else {
        this.router.navigate(["/local-agency/risk-monitoring/add-indicator/countryContext", {
          "countryId": this.countryID,
          "agencyId": this.agencyId,
          "systemId": this.systemId,
          "indicatorId": indicator.$key,
          "isContext": isContext
        }]);
      }

    } else {
      let hazardScenario = hazard.hazardScenario;
      this.userService.getAgencyId(Constants.USER_PATHS[this.UserType], this.uid)
        .take(1)
        .subscribe(ownAgencyId => {
          console.log(ownAgencyId);
          this.af.database.list(Constants.APP_STATUS + "/hazard/" + ownAgencyId, {
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
                  this.router.navigate(["/local-agency/risk-monitoring/add-indicator/" + hazards[0].$key, {
                    "countryId": this.countryID,
                    "agencyId": this.agencyId,
                    "systemId": this.systemId,
                    "indicatorId": indicator.$key,
                    "hazardId": hazard.$key,
                    "isContext": isContext,
                    "agencyOverview": true
                  }]);
                } else {
                  this.router.navigate(["/local-agency/risk-monitoring/add-indicator/" + hazards[0].$key, {
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
      this.af.database.object(Constants.APP_STATUS + "/staff/" + this.agencyId + "/" + this.uid)
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
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId ).takeUntil(this.ngUnsubscribe).subscribe((data: any) => {
        if (data.adminId) {
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + data.adminId).takeUntil(this.ngUnsubscribe).subscribe((user: ModelUserPublic) => {
            var userToPush = {userID: data.adminId, name: user.firstName + " " + user.lastName};
            this.usersForAssign.push(userToPush);
          });
        }
      });

      //Obtaining other staff data
      this.af.database.object(Constants.APP_STATUS + "/staff/" + this.agencyId).takeUntil(this.ngUnsubscribe).subscribe((data: {}) => {
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
      this.assignedHazard = this.agencyId;
    }
    let data = {};
    data["/indicator/" + this.assignedHazard + "/" + this.assignedIndicator.$key + "/assignee"] = this.assignedUser;
    this.af.database.object(Constants.APP_STATUS).update(data).then(() => {
      this.assignedHazard = null;
      this.assignedIndicator = null;
      this.assignedUser = "undefined";
    });
  }

}
