import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";
import { CustomerValidator } from "../utils/CustomValidator";
import { NoteModel } from "./note.model";

export class SurgeEquipmentModel extends BaseModel {
    public id: string;
    public equipmentProvided: string;
    public supplier: string;
    public relationship: string;
    public contactName: string;
    public contactEmail: string;
    public contactPhone: string;
    public notes: NoteModel[];
    public updatedAt: number;

    validate(excludedFields = []): AlertMessageModel {
        if (!this.equipmentProvided && !this.isExcluded('equipmentProvided', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.NO_EQUIPMENT_PROVIDED');
        }
        if (!this.supplier && !this.isExcluded('supplier', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.NO_SUPPLIER');
        }
        if (!this.relationship && !this.isExcluded('quantity', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.NO_RELATIONSHIP');
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
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.NO_CONTACT_PHONE');
        }

        return null;
    }
}
