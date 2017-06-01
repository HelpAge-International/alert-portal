/**
 * Created by ser-j on 25/05/2017.
 */

import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class LogModel extends BaseModel {
    public id: string;
    public content: string;
    public addedBy: string;
    public timeStamp: number;
    public triggerAtCreation: number;

    validate(excludedFields = []): AlertMessageModel {

        if (!this.content && !this.isExcluded('content', excludedFields)) {
            return new AlertMessageModel('RISK_MONITORING.MAIN_PAGE.LOGS_NO_CONTENT');
        }

        return null;
    }

}
