/**
 * Created by jordan on 05/05/2017.
 */

import {HazardScenario, GeoLocation} from '../utils/Enums';
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class ModelHazard extends BaseModel {
    public id: string;

    public category: number;
    public isSeasonal: boolean;
    public location: Map<number, number>;
    public risk: number;
    public hazardType: string;
    public seasons = [];
    public isActive: boolean;
    public hazardScenario: string;


    validate(excludedFields): AlertMessageModel {
        if (typeof (this.hazardScenario) == 'undefined' || this.hazardScenario.length == 0 || this.hazardScenario == 'Other' && !this.isExcluded('hazardType', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_HAZARD.NO_HAZARD');
        }
        if (this.isActive == false && !this.isExcluded('hazardType', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_HAZARD.HAZARD_DETECTED');
        }
        if (excludedFields > 1) {
            if (typeof (this.isSeasonal) == 'undefined' && !this.isExcluded('isSeasonal', excludedFields)) {
                return new AlertMessageModel('RISK_MONITORING.ADD_HAZARD.NO_SEASONAL');
            }
            if (this.isSeasonal == true) {
                if (typeof (this.seasons) == 'undefined' || this.seasons.length == 0 && !this.isExcluded('isSeasonal', excludedFields)) {
                    return new AlertMessageModel('RISK_MONITORING.ADD_HAZARD.NO_SEASONAL');
                }
            }
        }
        return null;
    }
}
