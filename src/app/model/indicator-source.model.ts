import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class IndicatorSourceModel extends BaseModel {
    public link: number;
    public name: number;

    validate(excludedFields = []): AlertMessageModel {
        console.log('excluded ' + excludedFields);
        if (!this.name && !this.isExcluded('name', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_SOURCE_NAME');
        }
        if (!this.link && !this.isExcluded('link', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.ADD_INDICATOR.NO_SOURCE_LINK');
        }

        return null;
    }

    setData(source) {
        this.link = source.link;
        this.name = source.name;
    }
}
