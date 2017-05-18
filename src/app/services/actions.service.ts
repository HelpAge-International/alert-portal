import {Injectable} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {ActionLevel, ActionType, AlertLevels} from "../utils/Enums";

@Injectable()
export class ActionsService {

  constructor(private af: AngularFire) {
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

}
