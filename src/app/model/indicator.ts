/**
 * Created by ser-j on 15/05/2017.
 */
import {HazardScenario, GeoLocation} from '../utils/Enums';
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class Indicator extends BaseModel {
    public id: string;
    public category: HazardScenario;
    public name: string;
    public source: any[] = [];
    public assignee: string;
    public geoLocation: GeoLocation;
    public affectedLocation: any[] = [];
    public trigger: any = [];


    validate(excludedFields = []): AlertMessageModel {
        if (typeof (this.category) == 'undefined' && !this.isExcluded('category', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_CATEGORY');
        }

        if (!this.name && !this.isExcluded('name', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_NAME');
        }

        if (typeof (this.geoLocation) == 'undefined' && !this.isExcluded('geoLocation', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_GEO_LOCATION');
        }

        return null;
    }
}
