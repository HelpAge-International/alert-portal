import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class IndicatorSourceModel extends BaseModel {
    public link: number;
    public name: number;

    validate(excludedFields = []): AlertMessageModel {
        console.log('excluded ' + excludedFields);
        if (!this.link && !this.isExcluded('link', excludedFields)) {
            return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_COUNTRY');
        }
        if (!this.name && !this.isExcluded('name', excludedFields)) {
            return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_LEVEL1');
        }

        return null;
    }
}
