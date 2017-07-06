import {Injectable} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {ActionLevel, ActionType, AlertLevels, AlertStatus, ApprovalStatus} from "../utils/Enums";
import {ModelAlert} from "../model/alert.model";
import {ModelAffectedArea} from "../model/affectedArea.model";
import {UserService} from "./user.service";
import {Subject} from "rxjs/Subject";
import {CommonService} from "./common.service";
import {ModelJsonLocation} from "../model/json-location.model";
import {Router} from "@angular/router";
import { NotificationService } from "./notification.service";
import {TranslateService} from "@ngx-translate/core";
import { MessageModel } from "../model/message.model";

@Injectable()
export class ActionsService {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private areaContent: any;

  constructor(private af: AngularFire,
              private userService: UserService,
              private jsonService: CommonService,
              private router: Router,
              private commonService: CommonService,
              private translate: TranslateService,
              private notificationService: NotificationService) {
    this.getAreaValues();
  }

  getActionsDueInWeek(countryId, uid: string): Observable<any> {
    return this.af.database.list(Constants.APP_STATUS + "/action/" + countryId, {
      query: {
        orderByChild: "dueDate",
        startAt: moment().startOf('day').valueOf()
      }
    })
      .map(actions => {
        let filteredActions = [];
        actions.forEach(action => {
          // TODO - Change to 'assignee' in db
          if (action.asignee === uid) {
            filteredActions.push(action);
          }
        });
        return filteredActions;
      })
  }

  getIndicatorsDueInWeek(countryId, uid) {
    let startOfToday = moment().startOf('day').valueOf();
    let countryContextIndicators = this.af.database.list(Constants.APP_STATUS + "/indicator/" + countryId, {
      query: {
        orderByChild: "dueDate",
        startAt: startOfToday
      }
    })
      .map(indicators => {
        let filteredIndicators = [];
        indicators.forEach(indicator => {
          if (indicator.assignee === uid) {
            filteredIndicators.push(indicator);
          }
        });
        return filteredIndicators;
      });

    let countryIndicators = this.af.database.list(Constants.APP_STATUS + "/hazard/" + countryId)
      .flatMap(hazards => {
        return Observable.from(hazards.map(hazard => hazard.$key));
      })
      .flatMap(hazardId => {
        return this.af.database.list(Constants.APP_STATUS + "/indicator/" + hazardId, {
          query: {
            orderByChild: "dueDate",
            startAt: startOfToday
          }
        })
      })
      .map(indicators => {
        let filteredIndicators = [];
        indicators.forEach(indicator => {
          if (indicator.assignee === uid) {
            filteredIndicators.push(indicator);
          }
        });
        return filteredIndicators;
      });

    return countryContextIndicators.merge(countryIndicators);
  }

  isExist(key: string, list: any[]): boolean {
    return list.some(item => item.$key === key);
  }

  indexOfItem(key: string, list: any[]): number {
    for (let i = 0; i < list.length; i++) {
      if (list[i].$key === key) {
        return i;
      }
    }
    return -1;
  }

  getActionTitle(action): string {
    let title = "";
    if (action.type == ActionType.chs) {
      title = "A CHS preparedness action needs to be completed"
    } else if (action.level == ActionLevel.MPA) {
      title = "A minimum preparedness action needs to be completed"
    } else if (action.level == ActionLevel.APA) {
      title = "An advanced preparedness action needs to be completed"
    }
    return title;
  }

  getIndicatorTitle(indicator): string {
    let title = "";
    if (indicator.triggerSelected == AlertLevels.Green) {
      title = "A green level indicator needs to be completed"
    } else if (indicator.triggerSelected == AlertLevels.Amber) {
      title = "An amber level indicator needs to be completed"
    } else if (indicator.triggerSelected == AlertLevels.Red) {
      title = "A red level indicator needs to be completed"
    }
    return title;
  }

  getAlerts(countryId) {

    return this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId, {
      query: {
        orderByChild: "alertLevel",
        startAt: AlertLevels.Amber
      }
    })
      .map(alerts => {
        let alertList = [];
        alerts.forEach(alert => {
          let modelAlert = new ModelAlert();
          modelAlert.id = alert.$key;
          modelAlert.alertLevel = alert.alertLevel;
          modelAlert.hazardScenario = alert.hazardScenario;
          modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
          modelAlert.infoNotes = alert.infoNotes;
          modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
          modelAlert.timeCreated = alert.timeCreated;
          modelAlert.createdBy = alert.createdBy;
          if (alert.updatedBy) {
            modelAlert.updatedBy = alert.updatedBy;
          }

          let affectedAreas: ModelAffectedArea[] = [];
          let countries: string[] = Object.keys(alert.affectedAreas);
          countries.forEach(country => {
            let modelAffectedArea = new ModelAffectedArea();
            modelAffectedArea.affectedCountry = Number(country);
            modelAffectedArea.affectedLevel1 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] : -1;
            modelAffectedArea.affectedLevel2 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] : -1;
            affectedAreas.push(modelAffectedArea);
          });
          modelAlert.affectedAreas = affectedAreas;

          modelAlert.approvalDirectorId = Object.keys(alert.approval['countryDirector'])[0];
          modelAlert.approvalStatus = alert.approval['countryDirector'][modelAlert.approvalDirectorId];

          alertList.push(modelAlert);
        });
        return alertList;
      })
      .do(alertList => {
        alertList.forEach(alert => {
          this.userService.getUser(alert.createdBy)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              alert.createdByName = user.firstName + " " + user.lastName
            });
        });
      })
      .do(alertList => {
        alertList.forEach(alert => {
          if (alert.updatedBy) {
            this.userService.getUser(alert.updatedBy)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(user => {
                alert.updatedByName = user.firstName + " " + user.lastName
              });
          }
        });
      })
      .do(alertList => {
        alertList.forEach(alert => {
          let displayArea: string[] = [];
          // let displayArea: UpdateArea[] = [];
          alert.affectedAreas.forEach(area => {
            if (area.affectedLevel2 && area.affectedLevel2 != -1) {
              // let temp:UpdateArea = {"country":area.affectedCountry, "level1":-1, "level2":-1};

              displayArea.push(area.affectedLevel2);
            } else if (area.affectedLevel1 && area.affectedLevel1 != -1) {
              displayArea.push(area.affectedLevel1);
            } else {
              displayArea.push(area.affectedCountry);
            }
          });
          alert.affectedAreasDisplay = displayArea;
        });
      });
  }

  getRedAlerts(countryId) {

    return this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId, {
      query: {
        orderByChild: "alertLevel",
        startAt: AlertLevels.Red
      }
    })
      .map(alerts => {
        let alertList = [];
        alerts.forEach(alert => {
          let modelAlert = new ModelAlert();
          modelAlert.id = alert.$key;
          modelAlert.alertLevel = alert.alertLevel;
          modelAlert.hazardScenario = alert.hazardScenario;
          modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
          modelAlert.infoNotes = alert.infoNotes;
          modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
          modelAlert.timeCreated = alert.timeCreated;
          modelAlert.createdBy = alert.createdBy;
          if (alert.updatedBy) {
            modelAlert.updatedBy = alert.updatedBy;
          }

          let affectedAreas: ModelAffectedArea[] = [];
          let countries: string[] = Object.keys(alert.affectedAreas);
          countries.forEach(country => {
            let modelAffectedArea = new ModelAffectedArea();
            modelAffectedArea.affectedCountry = Number(country);
            modelAffectedArea.affectedLevel1 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] : -1;
            modelAffectedArea.affectedLevel2 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] : -1;
            affectedAreas.push(modelAffectedArea);
          });
          modelAlert.affectedAreas = affectedAreas;

          modelAlert.approvalDirectorId = Object.keys(alert.approval['countryDirector'])[0];
          modelAlert.approvalStatus = alert.approval['countryDirector'][modelAlert.approvalDirectorId];

          alertList.push(modelAlert);
        });
        return alertList;
      })
      .do(alertList => {
        alertList.forEach(alert => {
          this.userService.getUser(alert.createdBy)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              alert.createdByName = user.firstName + " " + user.lastName
            });
        });
      })
      .do(alertList => {
        alertList.forEach(alert => {
          if (alert.updatedBy) {
            this.userService.getUser(alert.updatedBy)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(user => {
                alert.updatedByName = user.firstName + " " + user.lastName
              });
          }
        });
      })
      .do(alertList => {
        alertList.forEach(alert => {
          let displayArea: string[] = [];
          // let displayArea: UpdateArea[] = [];
          alert.affectedAreas.forEach(area => {
            if (area.affectedLevel2 && area.affectedLevel2 != -1) {
              // let temp:UpdateArea = {"country":area.affectedCountry, "level1":-1, "level2":-1};

              displayArea.push(area.affectedLevel2);
            } else if (area.affectedLevel1 && area.affectedLevel1 != -1) {
              displayArea.push(area.affectedLevel1);
            } else {
              displayArea.push(area.affectedCountry);
            }
          });
          alert.affectedAreasDisplay = displayArea;
        });
      });
  }

  private getAreaValues() {
    // get the country levels values
    this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(content => {
        this.areaContent = content;
      });
  }

  getAlert(alertId, countryId) {
    return this.af.database.object(Constants.APP_STATUS + "/alert/" + countryId + "/" + alertId)
      .map(alert => {
        let modelAlert = new ModelAlert();
        modelAlert.id = alert.$key;
        modelAlert.alertLevel = alert.alertLevel;
        modelAlert.hazardScenario = alert.hazardScenario;
        modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
        modelAlert.infoNotes = alert.infoNotes;
        modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
        modelAlert.timeCreated = alert.timeCreated;
        modelAlert.timeUpdated = alert.timeUpdated ? alert.timeUpdated : -1;
        modelAlert.createdBy = alert.createdBy;

        let affectedAreas: ModelAffectedArea[] = [];
        let countries: string[] = Object.keys(alert.affectedAreas);
        countries.forEach(country => {
          let modelAffectedArea = new ModelAffectedArea();
          modelAffectedArea.affectedCountry = Number(country);
          modelAffectedArea.affectedLevel1 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'];
          modelAffectedArea.affectedLevel2 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'];
          affectedAreas.push(modelAffectedArea);
        });
        modelAlert.affectedAreas = affectedAreas;

        modelAlert.approvalDirectorId = Object.keys(alert.approval['countryDirector'])[0];
        modelAlert.approvalStatus = alert.approval['countryDirector'][modelAlert.approvalDirectorId];

        return modelAlert;
      })
      .do(modelAlert => {
        this.userService.getUser(modelAlert.updatedBy ? modelAlert.updatedBy : modelAlert.createdBy)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
            modelAlert.createdByName = user.firstName + " " + user.lastName
          });
      });
  }

  getAllLevelInfo(country: number) {
    return this.jsonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .map(result => {
        let level1values: ModelJsonLocation[] = [];
        if (result[country] && result[country]['levelOneValues']) {
          result[country]['levelOneValues'].forEach(item => {
            let modelLevel1 = new ModelJsonLocation();
            modelLevel1.id = item.id;
            modelLevel1.value = item.value;
            let level2models: ModelJsonLocation[] = [];
            if (item.levelTwoValues) {
              item.levelTwoValues.forEach(item => {
                let modelLevel2 = new ModelJsonLocation();
                modelLevel2.id = item.id;
                modelLevel2.value = item.value;
                level2models.push(modelLevel2);
              });
            }
            modelLevel1.levelTwoValues = level2models;
            level1values.push(modelLevel1);
          });
        }
        return level1values;
      });
  }

  updateAlert(alert: ModelAlert, alertLevelBefore: number, countryId: string, agencyId: string) {
    console.log("update alert");
    let updateData = {};
    let areaData = {};
    alert.affectedAreas.forEach(area => {
      let subData = {};
      subData["country"] = Number(area.affectedCountry);
      if (area.affectedLevel1) {
        subData["level1"] = Number(area.affectedLevel1);
      }
      if (area.affectedLevel2) {
        subData["level2"] = Number(area.affectedLevel2);
      }
      areaData[area.affectedCountry] = subData;
    });
    updateData["affectedAreas"] = areaData;
    updateData["alertLevel"] = alert.alertLevel;
    let countryDirectorData = {};
    countryDirectorData[alert.approvalDirectorId] = alert.approvalStatus;
    let countryDirector = {};
    countryDirector["countryDirector"] = countryDirectorData;
    updateData["approval"] = countryDirector;
    updateData["createdBy"] = alert.createdBy;
    updateData["estimatedPopulation"] = alert.estimatedPopulation;
    updateData["hazardScenario"] = alert.hazardScenario;
    updateData["infoNotes"] = alert.infoNotes;
    updateData["reasonForRedAlert"] = alert.reasonForRedAlert;
    updateData["timeCreated"] = alert.timeCreated;
    updateData["timeUpdated"] = alert.timeUpdated;
    updateData["updatedBy"] = alert.updatedBy;

    this.af.database.object(Constants.APP_STATUS + "/alert/" + countryId + "/" + alert.id).set(updateData).then(() => {
      // Send notification to users with Alert level changed notification
      const alertChangedNotificationSetting = 0;
      const riskNameTranslated = this.translate.instant(Constants.HAZARD_SCENARIOS[alert.hazardScenario]);
      const levelBefore = this.translate.instant(Constants.ALERTS[alertLevelBefore]);
      const levelAfter = this.translate.instant(Constants.ALERTS[alert.alertLevel]);
      
      let notification = new MessageModel();
      notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.ALERT_LEVEL_UPDATED_TITLE", { riskName: riskNameTranslated});
      notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.ALERT_LEVEL_UPDATED_CONTENT", { riskName: riskNameTranslated, levelBefore: levelBefore, levelAfter: levelAfter});
      notification.time = new Date().getTime();
      
      this.notificationService.saveUserNotificationBasedOnNotificationSetting(notification, alertChangedNotificationSetting, agencyId, countryId);
      
      this.router.navigateByUrl(Constants.COUNTRY_ADMIN_HOME);
    }, error => {
      console.log(error.message);
    });
  }

  getAlertsForDirectorToApprove(uid, countryId) {

    return this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId, {
      query: {
        orderByChild: "approval/countryDirector/" + uid,
        equalTo: AlertStatus.WaitingResponse
      }
    })
      .map(alerts => {
        let alertList = [];
        alerts.forEach(alert => {
          let modelAlert = new ModelAlert();
          modelAlert.id = alert.$key;
          modelAlert.alertLevel = alert.alertLevel;
          modelAlert.hazardScenario = alert.hazardScenario;
          modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
          modelAlert.infoNotes = alert.infoNotes;
          modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
          modelAlert.timeCreated = alert.timeCreated;
          modelAlert.createdBy = alert.createdBy;

          let affectedAreas: ModelAffectedArea[] = [];
          let countries: string[] = Object.keys(alert.affectedAreas);
          countries.forEach(country => {
            let modelAffectedArea = new ModelAffectedArea();
            modelAffectedArea.affectedCountry = Number(country);
            modelAffectedArea.affectedLevel1 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level1'] : -1;
            modelAffectedArea.affectedLevel2 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level2'] : -1;
            affectedAreas.push(modelAffectedArea);
          });
          modelAlert.affectedAreas = affectedAreas;

          modelAlert.approvalDirectorId = Object.keys(alert.approval['countryDirector'])[0];
          modelAlert.approvalStatus = alert.approval['countryDirector'][modelAlert.approvalDirectorId];

          alertList.push(modelAlert);
        });
        return alertList;
      })
      .do(alertList => {
        alertList.forEach(alert => {
          this.userService.getUser(alert.createdBy)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              alert.createdByName = user.firstName + " " + user.lastName
            });
        });
      })
      .do(alertList => {
        alertList.forEach(alert => {
          let displayArea: string[] = [];
          // let displayArea: UpdateArea[] = [];
          alert.affectedAreas.forEach(area => {
            if (area.affectedLevel2 && area.affectedLevel2 != -1) {
              // let temp:UpdateArea = {"country":area.affectedCountry, "level1":-1, "level2":-1};

              displayArea.push(area.affectedLevel2);
            } else if (area.affectedLevel1 && area.affectedLevel1 != -1) {
              displayArea.push(area.affectedLevel1);
            } else {
              displayArea.push(area.affectedCountry);
            }
          });
          alert.affectedAreasDisplay = displayArea;
        });
      });
  }

  approveRedAlert(countryId, alertId, uid) {
    this.af.database.object(Constants.APP_STATUS + "/alert/" + countryId + "/" + alertId + "/approval/countryDirector/" + uid).set(AlertStatus.Approved);
  }

  rejectRedAlert(countryId, alertId, uid) {
    let update = {};
    update["/alert/" + countryId + "/" + alertId + "/approval/countryDirector/" + uid] = AlertStatus.Rejected;
    update["/alert/" + countryId + "/" + alertId + "/alertLevel/"] = AlertLevels.Amber;
    this.af.database.object(Constants.APP_STATUS).update(update);
  }

  getResponsePlanForCountryDirectorToApproval(countryId, uid) {
    return this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId, ({
      query: {
        orderByChild: "/approval/countryDirector/" + uid,
        equalTo: ApprovalStatus.WaitingApproval
      }
    }))
      .map(plans => {
        plans.forEach(plan => {
          let userId = plan.updatedBy ? plan.updatedBy : plan.createdBy;
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              plan["displayName"] = user.firstName + " " + user.lastName;
            });
        });
        return plans;
      });
  }

  getResponsePlanFoGlobalDirectorToApproval(countryId, uid) {
    return this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId, ({
      query: {
        orderByChild: "/approval/globalDirector/" + uid,
        equalTo: ApprovalStatus.WaitingApproval
      }
    }))
      .map(plans => {
        plans.forEach(plan => {
          let userId = plan.updatedBy ? plan.updatedBy : plan.createdBy;
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              plan["displayName"] = user.firstName + " " + user.lastName;
              plan["countryId"] = countryId;
            });
        });
        return plans;
      });
  }


  unSubscribeNow() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
