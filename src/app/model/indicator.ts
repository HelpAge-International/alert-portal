/**
 * Created by ser-j on 15/05/2017.
 */
import {HazardScenario, GeoLocation} from '../utils/Enums';
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";
import {IndicatorSourceModel} from "./indicator-source.model";
import {IndicatorTriggerModel} from "./indicator-trigger.model";
import {OperationAreaModel} from "./operation-area.model";

export class Indicator extends BaseModel {
  public id: string;
  public category: HazardScenario = 0;
  public triggerSelected: number;
  public name: string = '';
  public source: any[] = [];
  public assignee: string;
  public hazardScenario:any
  public geoLocation: GeoLocation;
  public affectedLocation: any[] = [];
  public trigger: any[] = [];
  public dueDate:number
  public updatedAt:number


  validate(excludedFields = []): AlertMessageModel {
    if (typeof (this.category) == 'undefined' && !this.isExcluded('category', excludedFields)) {
      return new AlertMessageModel('RISK_MONITORING.ADD_HAZARD.NO_HAZARD');
    }

    if (!this.name && !this.isExcluded('name', excludedFields)) {
      return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_NAME');
    }

    if (typeof (this.geoLocation) == 'undefined' && !this.isExcluded('geoLocation', excludedFields)) {
      return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_GEO_LOCATION');
    }

    return null;
  }

  setData(indicator) {

    this.id = indicator.id;
    this.category = indicator.category;
    this.name = indicator.name;
    this.assignee = indicator.assignee;
    this.geoLocation = indicator.geoLocation;
    this.source = [];
    this.affectedLocation = [];
    this.trigger = [];
    indicator.triggerSelected ? this.triggerSelected = indicator.triggerSelected : this.triggerSelected = 0;

    indicator.source.forEach((source, key) => {
      this.source.push(new IndicatorSourceModel());
      this.source[key].setData(source);
    });

    indicator.trigger.forEach((trigger, key) => {
      this.trigger.push(new IndicatorTriggerModel());
      this.trigger[key].setData(trigger);
    });

    if (this.geoLocation == 1) {
      indicator.affectedLocation.forEach((location, key) => {
        this.affectedLocation.push(new OperationAreaModel());
        this.affectedLocation[key].setData(location);
      });
    }

  }
}
