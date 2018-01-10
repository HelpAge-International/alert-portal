import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";
import { NoteModel } from "./note.model";

export class EquipmentModel extends BaseModel {
    public id: string;
    public name: string;
    public location: number;
    public level1: number;
    public level2: string;
    public quantity: number;
    public status: string;
    public notes: NoteModel[];
    public updatedAt: number;

    validate(excludedFields = []): AlertMessageModel {
        if (!this.name && !this.isExcluded('name', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.NO_NAME');
        }
        /*if (!this.location && !this.isExcluded('location', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.NO_LOCATION');
        }*/
        if ((!this.quantity || this.quantity < 1) && !this.isExcluded('quantity', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.NO_QUANTITY');
        }
        if (!this.status && !this.isExcluded('status', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.EQUIPMENT.NO_STATUS');
        }

        return null;
    }
}
