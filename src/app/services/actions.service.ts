import {Injectable} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {ActionLevel, ActionType, AlertLevels} from "../utils/Enums";
import {ModelAlert} from "../model/alert.model";
import {ModelAffectedArea} from "../model/affectedArea.model";
import {UserService} from "./user.service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ActionsService {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private userService: UserService) {
  }

  getActionsDueInWeek(countryId, uid: string): Observable<any> {
    return this.af.database.list(Constants.APP_STATUS + "/action/" + countryId, {
      query: {
        orderByChild: "dueDate",
        startAt: moment().startOf('day').valueOf()
      }
    })
      .filter(action => action.assignee === uid);
  }

  getIndicatorsDueInWeek(countryId, uid) {
    let startOfToday = moment().startOf('day').valueOf();
    let countryContextIndicators = this.af.database.list(Constants.APP_STATUS + "/indicator/" + countryId, {
      query: {
        orderByChild: "dueDate",
        startAt: startOfToday
      }
    })
      .filter(indicator => indicator.assignee === uid);

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
        return indicators.filter(indicator => indicator.assignee === uid);
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

          let affectedAreas: ModelAffectedArea[] = [];
          let countries: string[] = Object.keys(alert.affectedAreas);
          countries.forEach(country => {
            let modelAffectedArea = new ModelAffectedArea();
            modelAffectedArea.affectedCountry = Number(country);
            modelAffectedArea.affectedLevel1 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level1location'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level1location'] : '';
            modelAffectedArea.affectedLevel2 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level2location'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level2location'] : '';
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
          alert.affectedAreas.forEach(area => {
            if (area.affectedLevel2) {
              displayArea.push(area.affectedLevel2);
            } else if (area.affectedLevel1) {
              displayArea.push(area.affectedLevel1);
            } else {
              displayArea.push(area.affectedCountry);
            }
          });
          alert.affectedAreasDisplay = displayArea;
        });
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
          modelAffectedArea.affectedLevel1 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level1location'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level1location'] : '';
          modelAffectedArea.affectedLevel2 = alert.affectedAreas[modelAffectedArea.affectedCountry]['level2location'] ? alert.affectedAreas[modelAffectedArea.affectedCountry]['level2location'] : '';
          affectedAreas.push(modelAffectedArea);
        });
        modelAlert.affectedAreas = affectedAreas;

        modelAlert.approvalDirectorId = Object.keys(alert.approval['countryDirector'])[0];
        modelAlert.approvalStatus = alert.approval['countryDirector'][modelAlert.approvalDirectorId];

        return modelAlert;
      })
      .do(modelAlert => {
        this.userService.getUser(modelAlert.createdBy)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
            modelAlert.createdByName = user.firstName + " " + user.lastName
          });
      });
  }

  unSubscribeNow() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}