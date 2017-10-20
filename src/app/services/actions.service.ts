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
import {NotificationService} from "./notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MessageModel} from "../model/message.model";

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
    // Only retrieve a 7 days period actions
    let today = new Date();
    let limitDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    return this.af.database.list(Constants.APP_STATUS + "/action/" + countryId, {
      query: {
        orderByChild: "dueDate",
        //startAt: moment().startOf('day').valueOf(),  SHOW ALSO EXPIRED ACTIONS
        endAt: limitDate.getTime()
      }
    })
      .map(actions => {
        let filteredActions = [];
        actions.forEach(action => {
          if (action.asignee === uid && !action.isComplete) {
            filteredActions.push(action);
          }
        });
        return filteredActions;
      })
  }

  getIndicatorsDueInWeek(countryId, uid) {
    let startOfToday = moment().startOf('day').valueOf();

    // Only retrieve a 7 days period indicator
    let today = new Date();
    let limitDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    let countryContextIndicators = this.af.database.list(Constants.APP_STATUS + "/indicator/" + countryId, {
      query: {
        orderByChild: "dueDate",
        // startAt: startOfToday, SHOW ALSO EXPIRED INDICATORS
        endAt: limitDate.getTime()
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
            // startAt: startOfToday, SHOW ALSO EXPIRED INDICATORS
            endAt: limitDate.getTime()
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

  getCHSActionTask(action, systemId: string) {

    return this.af.database.object(Constants.APP_STATUS + "/actionCHS/" + systemId + "/" + action.$key)
      .takeUntil(this.ngUnsubscribe)
      .map(chsAction => {
        if (chsAction != null) {
          return chsAction.task;
        }
      });
  }

  getActionTitle(action): string {
    let title = "";
    let today = moment().startOf('day').valueOf();

    if (action.type == ActionType.chs) {
      title = this.translate.instant("A_CHS_PREP_ACTION")
    } else if (action.level == ActionLevel.MPA) {
      title = this.translate.instant("A_MIN_PREP_ACTION")
    } else if (action.level == ActionLevel.APA) {
      title = this.translate.instant("AN_ADVANCED_PREP_ACTION")
    }

    if (action.dueDate && today > action.dueDate) {
      title += "  "+this.translate.instant("WAS_DUE_ON");
    } else {
      title += "  "+this.translate.instant("NEEDS_TO_BE_COMPLETED");
    }

    return title;
  }

  getIndicatorTitle(indicator): string {
    let title = "";
    let today = moment().startOf('day').valueOf();

    if (indicator.triggerSelected == AlertLevels.Green) {
      title = this.translate.instant("A_GREEN_LEVEL_INDICATOR");
    } else if (indicator.triggerSelected == AlertLevels.Amber) {
      title = this.translate.instant("AN_AMBER_LEVEL_INDICATOR");
    } else if (indicator.triggerSelected == AlertLevels.Red) {
      title = this.translate.instant("A_RED_LEVEL_INDICATOR");
    }

    if (indicator.dueDate && today > indicator.dueDate) {
      title += "  "+this.translate.instant("WAS_DUE_ON");
    } else {
      title += "  "+this.translate.instant("NEEDS_TO_BE_COMPLETED");
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
          modelAlert.otherName = alert.otherName;
          modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
          modelAlert.infoNotes = alert.infoNotes;
          modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
          modelAlert.timeCreated = alert.timeCreated;
          modelAlert.createdBy = alert.createdBy;
          if (alert.updatedBy) {
            modelAlert.updatedBy = alert.updatedBy;
          }

          let affectedAreas: ModelAffectedArea[] = [];
          let ids: string[] = Object.keys(alert.affectedAreas);
          ids.forEach(id => {
            let modelAffectedArea = new ModelAffectedArea();
            let affectedCountry = alert.affectedAreas[id]['country'];
            let affectedLevel1 = alert.affectedAreas[id]['level1'];
            let affectedLevel2 = alert.affectedAreas[id]['level2'];

            modelAffectedArea.affectedCountry = affectedCountry;
            modelAffectedArea.affectedLevel1 = affectedLevel1 != null ? affectedLevel1 : -1;
            modelAffectedArea.affectedLevel2 = affectedLevel2 != null ? affectedLevel2 : -1;

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
          if (alert.hazardScenario == -1) {
            this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + alert.otherName)
              .first()
              .subscribe(nameObj => {
                alert.otherName = nameObj.name;
              });
          }
        });
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
          let affectedAreasToDisplay: any[] = [];
          alert.affectedAreas.forEach(affectedArea => {
            this.jsonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).subscribe((value) => {
              let obj = {
                country: "",
                areas: ""
              };
              if (affectedArea.affectedCountry > -1) {
                obj.country = this.getCountryNameById(affectedArea.affectedCountry);
              }
              if (affectedArea.affectedLevel1 > -1) {
                obj.areas = ", " + value[affectedArea.affectedCountry].levelOneValues[affectedArea.affectedLevel1].value
              }
              if (affectedArea.affectedLevel2 > -1) {
                obj.areas = obj.areas + ", " + value[affectedArea.affectedCountry].levelOneValues[affectedArea.affectedLevel1].levelTwoValues[affectedArea.affectedLevel2].value;
              }
              affectedAreasToDisplay.push(obj);
            });
          });
          alert.affectedAreasDisplay = affectedAreasToDisplay;
        });
      });
  }

  private getCountryNameById(countryId: number) {
    return Constants.COUNTRIES[countryId];
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
          modelAlert.otherName = alert.otherName;
          modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
          modelAlert.infoNotes = alert.infoNotes;
          modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
          modelAlert.timeCreated = alert.timeCreated;
          modelAlert.createdBy = alert.createdBy;
          if (alert.updatedBy) {
            modelAlert.updatedBy = alert.updatedBy;
          }

          let affectedAreas: ModelAffectedArea[] = [];
          let ids: string[] = Object.keys(alert.affectedAreas);
          ids.forEach(id => {
            let modelAffectedArea = new ModelAffectedArea();
            let affectedCountry = alert.affectedAreas[id]['country'];
            let affectedLevel1 = alert.affectedAreas[id]['level1'];
            let affectedLevel2 = alert.affectedAreas[id]['level2'];

            modelAffectedArea.affectedCountry = affectedCountry;
            modelAffectedArea.affectedLevel1 = affectedLevel1 != null ? affectedLevel1 : -1;
            modelAffectedArea.affectedLevel2 = affectedLevel2 != null ? affectedLevel2 : -1;

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
          if (alert.hazardScenario == -1) {
            this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + alert.otherName)
              .first()
              .subscribe(nameObj => {
                alert.otherName = nameObj.name;
              });
          }
        });
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
          let affectedAreasToDisplay: any[] = [];
          alert.affectedAreas.forEach(affectedArea => {
            this.jsonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).subscribe((value) => {
              let obj = {
                country: "",
                areas: ""
              };
              if (affectedArea.affectedCountry > -1) {
                obj.country = this.getCountryNameById(affectedArea.affectedCountry);
              }
              if (affectedArea.affectedLevel1 > -1) {
                obj.areas = ", " + value[affectedArea.affectedCountry].levelOneValues[affectedArea.affectedLevel1].value
              }
              if (affectedArea.affectedLevel2 > -1) {
                obj.areas = obj.areas + ", " + value[affectedArea.affectedCountry].levelOneValues[affectedArea.affectedLevel1].levelTwoValues[affectedArea.affectedLevel2].value;
              }
              affectedAreasToDisplay.push(obj);
            });
          });
          alert.affectedAreasDisplay = affectedAreasToDisplay;
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
        modelAlert.otherName = alert.otherName;
        modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
        modelAlert.infoNotes = alert.infoNotes;
        modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
        modelAlert.timeCreated = alert.timeCreated;
        modelAlert.timeUpdated = alert.timeUpdated ? alert.timeUpdated : -1;
        modelAlert.createdBy = alert.createdBy;

        let affectedAreas: ModelAffectedArea[] = [];
        let ids: string[] = Object.keys(alert.affectedAreas);
        ids.forEach(id => {
          let modelAffectedArea = new ModelAffectedArea();
          let affectedCountry = alert.affectedAreas[id]['country'];
          let affectedLevel1 = alert.affectedAreas[id]['level1'];
          let affectedLevel2 = alert.affectedAreas[id]['level2'];

          modelAffectedArea.affectedCountry = affectedCountry;
          modelAffectedArea.affectedLevel1 = affectedLevel1 != null ? affectedLevel1 : -1;
          modelAffectedArea.affectedLevel2 = affectedLevel2 != null ? affectedLevel2 : -1;

          affectedAreas.push(modelAffectedArea);
        });
        modelAlert.affectedAreas = affectedAreas;

        modelAlert.approvalDirectorId = Object.keys(alert.approval['countryDirector'])[0];
        modelAlert.approvalStatus = alert.approval['countryDirector'][modelAlert.approvalDirectorId];

        return modelAlert;
      })
      .do(modelAlert => {
        if (modelAlert.hazardScenario == -1) {
          this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + modelAlert.otherName)
            .first()
            .subscribe(nameObj => {
              modelAlert.displayName = nameObj.name;
            })
        }
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

  updateAlert(alert: ModelAlert, alertLevelBefore: number, countryId: string, agencyId: string, networkCountryId?) {
    console.log("update alert");
    let updateData = {};
    let areaData = {};
    let index: number = 0;
    alert.affectedAreas.forEach(area => {
      let subData = {};
      subData["country"] = Number(area.country);
      if (area.level1) {
        subData["level1"] = Number(area.level1);
      }
      if (area.level2) {
        subData["level2"] = Number(area.level2);
      }
      areaData[index] = subData;
      index++;
    });
    updateData["affectedAreas"] = areaData;
    updateData["alertLevel"] = alert.alertLevel;
    let countryDirectorData = {};
    // countryDirectorData[alert.approvalDirectorId] = alert.approvalStatus;
    countryDirectorData[alert.approvalCountryId] = alert.approvalStatus;
    let countryDirector = {};
    countryDirector["countryDirector"] = countryDirectorData;
    updateData["approval"] = countryDirector;
    updateData["createdBy"] = alert.createdBy;
    updateData["estimatedPopulation"] = alert.estimatedPopulation;
    updateData["hazardScenario"] = alert.hazardScenario;
    if (alert.hazardScenario == -1) {
      updateData["otherName"] = alert.otherName;
    }
    updateData["infoNotes"] = alert.infoNotes;
    if (alert.reasonForRedAlert) {
      updateData["reasonForRedAlert"] = alert.reasonForRedAlert;
    }
    updateData["timeCreated"] = alert.timeCreated;
    updateData["timeUpdated"] = alert.timeUpdated;
    updateData["updatedBy"] = alert.updatedBy;

    console.log(updateData);
    this.af.database.object(networkCountryId ? Constants.APP_STATUS + "/alert/" +  networkCountryId + "/" + alert.id : Constants.APP_STATUS + "/alert/" +  countryId + "/" + alert.id).set(updateData).then(() => {
      // Send notification to users with Alert level changed notification
      const alertChangedNotificationSetting = 0;
      let riskNameTranslated = "";
      if (alert.hazardScenario != -1) {
        riskNameTranslated = this.translate.instant(Constants.HAZARD_SCENARIOS[alert.hazardScenario]);
      } else {
        riskNameTranslated = this.translate.instant(alert.displayName);
      }
      const levelBefore = this.translate.instant(Constants.ALERTS[alertLevelBefore]);
      const levelAfter = this.translate.instant(Constants.ALERTS[alert.alertLevel]);

      let notification = new MessageModel();
      notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.ALERT_LEVEL_UPDATED_TITLE", {riskName: riskNameTranslated});
      notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.ALERT_LEVEL_UPDATED_CONTENT", {
        riskName: riskNameTranslated,
        levelBefore: levelBefore,
        levelAfter: levelAfter
      });
      notification.time = new Date().getTime();

      this.notificationService.saveUserNotificationBasedOnNotificationSetting(notification, alertChangedNotificationSetting, agencyId, countryId);

      networkCountryId ? this.router.navigateByUrl('/network-country/network-dashboard') : this.router.navigateByUrl(Constants.COUNTRY_ADMIN_HOME);
    }, error => {
      console.log(error.message);
    });
  }

  getAlertsForDirectorToApprove(uid, countryId) {

    return this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId, {
      query: {
        orderByChild: "approval/countryDirector/" + countryId,
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
          modelAlert.otherName = alert.otherName;
          modelAlert.otherName = alert.otherName;
          modelAlert.estimatedPopulation = Number(alert.estimatedPopulation);
          modelAlert.infoNotes = alert.infoNotes;
          modelAlert.reasonForRedAlert = alert.reasonForRedAlert;
          modelAlert.timeCreated = alert.timeCreated;
          modelAlert.createdBy = alert.createdBy;

          let affectedAreas: ModelAffectedArea[] = [];
          let ids: string[] = Object.keys(alert.affectedAreas);
          ids.forEach(id => {
            let modelAffectedArea = new ModelAffectedArea();
            let affectedCountry = alert.affectedAreas[id]['country'];
            let affectedLevel1 = alert.affectedAreas[id]['level1'];
            let affectedLevel2 = alert.affectedAreas[id]['level2'];

            modelAffectedArea.affectedCountry = affectedCountry;
            modelAffectedArea.affectedLevel1 = affectedLevel1 != null ? affectedLevel1 : -1;
            modelAffectedArea.affectedLevel2 = affectedLevel2 != null ? affectedLevel2 : -1;

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
          if (alert.hazardScenario == -1) {
            this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + alert.otherName)
              .first()
              .subscribe(nameObj => {
                alert.otherName = nameObj.name;
              });
          }
        });
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
          let affectedAreasToDisplay: any[] = [];
          alert.affectedAreas.forEach(affectedArea => {
            this.jsonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).subscribe((value) => {
              let obj = {
                country: "",
                areas: ""
              };
              if (affectedArea.affectedCountry > -1) {
                obj.country = this.getCountryNameById(affectedArea.affectedCountry);
              }
              if (affectedArea.affectedLevel1 > -1) {
                obj.areas = ", " + value[affectedArea.affectedCountry].levelOneValues[affectedArea.affectedLevel1].value
              }
              if (affectedArea.affectedLevel2 > -1) {
                obj.areas = obj.areas + ", " + value[affectedArea.affectedCountry].levelOneValues[affectedArea.affectedLevel1].levelTwoValues[affectedArea.affectedLevel2].value;
              }
              affectedAreasToDisplay.push(obj);
            });
          });
          alert.affectedAreasDisplay = affectedAreasToDisplay;
        });
      });
  }

  approveRedAlert(countryId, alertId, uid) {
    this.af.database.object(Constants.APP_STATUS + "/alert/" + countryId + "/" + alertId + "/approval/countryDirector/" + countryId).set(AlertStatus.Approved);
  }

  rejectRedAlert(countryId, alertId, uid) {
    let update = {};
    update["/alert/" + countryId + "/" + alertId + "/approval/countryDirector/" + countryId] = AlertStatus.Rejected;
    update["/alert/" + countryId + "/" + alertId + "/alertLevel/"] = AlertLevels.Amber;
    this.af.database.object(Constants.APP_STATUS).update(update);
  }

  getResponsePlanForCountryDirectorToApproval(countryId, uid, isPartnerUser) {
    return this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId, ({
      query: {
        orderByChild: isPartnerUser ? "/approval/partner/" + uid : "/approval/countryDirector/" + countryId,
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

  getResponsePlanForCountryDirectorToApprovalNetwork(countryId, networkCountryId) {
    return this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + networkCountryId, ({
      query: {
        orderByChild: "/approval/countryDirector/" + countryId,
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

  getResponsePlanFoGlobalDirectorToApproval(countryId, uid, agencyId) {
    return this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId, ({
      query: {
        orderByChild: "/approval/globalDirector/" + agencyId,
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

  getResponsePlanFoRegionalDirectorToApproval(countryId, uid, regionId) {
    return this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId, ({
      query: {
        orderByChild: "/approval/regionDirector/" + regionId,
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
