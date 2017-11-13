/**
 * Created by ser-j on 15/05/2017.
 */
import {HazardScenario, GeoLocation, AlertLevels, AlertStatus, Countries} from '../utils/Enums';
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

//import {ModelAffectedArea} from "./affectedArea.model";

export class ModelAlert extends BaseModel {
  public id: string;
  public alertLevel: AlertLevels;
  public affectedAreas: any[] = [];
  public affectedAreasDisplay: string[];
  public approvalDirectorId: string;
  public approvalCountryId: string;
  public approvalStatus: AlertStatus;
  public approval: any[] = [];
  public createdBy: string;
  public createdByName: string;
  public estimatedPopulation: number;
  public hazardScenario: number;
  public infoNotes: string;
  public reasonForRedAlert: string;
  public timeCreated: number;
  public timeUpdated: number;
  public updatedBy: string;
  public updatedByName: string;
  public otherName: string;
  public displayName: string;
  public networkCountryId?: string
  public networkId?: string

  constructor() {
    super();
    this.affectedAreas = [];
  }

  validate(excludedFields = []): AlertMessageModel {
    if (typeof (this.hazardScenario) == 'undefined' && !this.isExcluded('hazardScenario', excludedFields)) {
      return new AlertMessageModel('RISK_MONITORING.ADD_HAZARD.NO_HAZARD');
    }

    if (typeof (this.alertLevel) == 'undefined' && !this.isExcluded('alertLevel', excludedFields)) {
      return new AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_ALERT_LEVEL');
    }

    if (!this.reasonForRedAlert && !this.isExcluded('reasonForRedAlert', excludedFields)) {
      return new AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_REASONS_FOR_REQUEST');
    }

    if (!this.estimatedPopulation && !this.isExcluded('estimatedPopulation', excludedFields)) {
      return new AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_ESTIMATED');
    }

    if (!this.infoNotes && !this.isExcluded('infoNotes', excludedFields)) {
      return new AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_NOTES');
    }

    return null;
  }
}
