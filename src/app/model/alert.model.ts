/**
 * Created by ser-j on 15/05/2017.
 */
import {HazardScenario, GeoLocation} from '../utils/Enums';
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class AlertModel extends BaseModel {
    public id: string;
    public hazardScenario: HazardScenario;
    public alertLevel: number;
    public estimatedPopulation: string;
    public infoNotes: string;
    public reasonForRedAlert: string;
    public affectedAreas: any[] = [];
    public createdBy: string;
    public timeCreated: number;
    public approval: any[] = [];

    validate(excludedFields = []): AlertMessageModel {
        if (typeof (this.hazardScenario) == 'undefined' && !this.isExcluded('hazardScenario', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_HAZARD');
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
