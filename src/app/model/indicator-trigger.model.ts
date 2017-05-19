import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class IndicatorTriggerModel extends BaseModel {
    public durationType: number;
    public frequencyValue: number;
    public triggerValue: string;

    validate(excludedFields = []): AlertMessageModel {
        if (!this.triggerValue && !this.isExcluded('triggerValue', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_TRIGGER_VALUE');
        }
        if (!this.frequencyValue && !this.isExcluded('frequencyValue', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_TRIGGER_FREQUENCY_VALUE');
        }
        if (!this.durationType && !this.isExcluded('durationType', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_TRIGGER_DURATION_TYPE');
        }
        return null;
    }
}
