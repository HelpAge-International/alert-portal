import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";
import { CustomerValidator } from "../utils/CustomValidator";

export class PointOfContactModel extends BaseModel {
    public id: string;
    public staffMember: string;
    public phone: string;
    public skypeName: string;
    public updatedAt: number;

    validate(excludedFields = []): AlertMessageModel {
        if (!this.staffMember && !this.isExcluded('staffMember', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.CONTACTS.NO_STAFF_MEMBER');
        }
        if (!this.phone && !this.isExcluded('phone', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.UPDATE_DETAILS.NO_PHONE');
        }
        if (!this.skypeName && !this.isExcluded('skypeName', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.CONTACTS.NO_SKYPE');
        }
        return null;
    }
}
