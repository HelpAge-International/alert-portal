import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class IndicatorTriggerModel extends BaseModel {
    public durationType: number;
    public frequencyValue: number;
    public triggerValue: string;

    validate(excludedFields = []): AlertMessageModel {
        console.log('excluded ' + excludedFields);
        if (!this.durationType && !this.isExcluded('durationType', excludedFields)) {
            return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_COUNTRY');
        }
        if (!this.frequencyValue && !this.isExcluded('frequencyValue', excludedFields)) {
            return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_LEVEL1');
        }
        if (!this.triggerValue && !this.isExcluded('triggerValue', excludedFields)) {
            return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_LEVEL1');
        }
        return null;
    }
}
