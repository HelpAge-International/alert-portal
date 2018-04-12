import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";
import { CustomerValidator } from "../utils/CustomValidator";

export class CoordinationArrangementNetworkModel extends BaseModel {
    public id: string;
    public sector: number;
    public sectorLead: string;
    public contactName: string;
    public contactEmail: string;
    public contactPhone: string;
    public updatedAt: number;
    public agencies?: object;
    public otherName?: string;

    validate(excludedFields = []): AlertMessageModel {
        if (!this.sector && !this.isExcluded('sector', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.NO_SECTOR');
        }
        if (!this.sectorLead && !this.isExcluded('sectorLead', excludedFields)) {
          return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.NO_SECTOR_LEAD');
        }
        if (!this.contactName && !this.isExcluded('contactName', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.NO_CONTACT_NAME');
        }
        if (!this.contactEmail && !this.isExcluded('contactEmail', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.NO_CONTACT_EMAIL');
        }
        if (!CustomerValidator.EmailValidator(this.contactEmail) && !this.isExcluded('contactEmail', excludedFields)) {
          return new AlertMessageModel('GLOBAL.EMAIL_NOT_VALID');
        }
        if (!this.contactPhone && !this.isExcluded('contactPhone', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.COORDINATION.NO_CONTACT_PHONE');
        }

        return null;
    }
}
