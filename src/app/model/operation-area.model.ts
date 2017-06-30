import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class OperationAreaModel extends BaseModel {
    public country: number;
    public level1: number;
    public level2: number;

    validate(excludedFields = []): AlertMessageModel {
        if (typeof (this.country) == 'undefined' && !this.isExcluded('country', excludedFields)) {
            return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_COUNTRY');
        }
        //Commented out because one should be able to select country only
        /*if (typeof (this.level1) == 'undefined' && !this.isExcluded('level1', excludedFields)) {
            return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_LEVEL1');
        }
        if (typeof (this.level2) == 'undefined' && !this.isExcluded('level2', excludedFields)) {
            return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_LEVEL2');
        }*/
        return null;
    }

    setData(location) {
        this.country = location.country;
        this.level1 = location.level1;
        this.level2 = location.level2;
    }
}
