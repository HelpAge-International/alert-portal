/**
 * Created by Sanjaya on 09/03/2017.
 */
import {ActionType} from '../utils/Enums';
import {AlertMessageModel} from "./alert-message.model";
import {BaseModel} from "./base.model";

// TODO - Modify data types when the enums are created
export class Action extends BaseModel {
    public id: string;
    public task: string;
    public level: number;
    public department: number;
    public asignee: string;
    public dueDate: number;
    public budget: number;
    public requireDoc: any;
    public documentId: string;
    public frequencyBase: number;
    public frequencyValue: number;
    public isActive: boolean;
    public isComplete: boolean;
    public progressState: number;
    public type: ActionType;
    public assignHazard: any = [];
    public actionStatus: number;


    validate(excludedFields = []): AlertMessageModel {
        if (!this.task && !this.isExcluded('task', excludedFields)) {
            return new AlertMessageModel('PREPAREDNESS.NO_TASK');
        }

        if (typeof (this.level) == 'undefined' && !this.isExcluded('level', excludedFields)) {
            return new AlertMessageModel('PREPAREDNESS.NO_LEVEL');
        }

        if (typeof (this.department) == 'undefined' && !this.isExcluded('department', excludedFields)) {
            return new AlertMessageModel('PREPAREDNESS.NO_DEPARTMENT');
        }

        if (!this.dueDate && !this.isExcluded('dueDate', excludedFields)) {
            return new AlertMessageModel('PREPAREDNESS.NO_DUE_DATE');
        }

        if (!this.budget && !this.isExcluded('budget', excludedFields)) {
            return new AlertMessageModel('PREPAREDNESS.NO_BUDGET');
        }

        if (typeof (this.requireDoc) == 'undefined' && !this.isExcluded('requireDoc', excludedFields)) {
            return new AlertMessageModel('PREPAREDNESS.NO_REQUIRE_DOC');
        }

        return null;
    }

}



