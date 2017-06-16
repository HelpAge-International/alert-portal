import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";
import { NoteModel } from "./note.model";
import { StockType } from "../utils/Enums";

export class StockCapacityModel extends BaseModel {
    public id: string;
    public description: string;
    public quantity: number;
    public location: string;
    public eta: string;
    public type: number;
    public notes: NoteModel[];
    public updatedAt: number;

    validate(excludedFields = []): AlertMessageModel {
        if (!this.description && !this.isExcluded('description', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_DESCRIPTION');
        }
        if (!this.quantity && !this.isExcluded('quantity', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_QUANTITY');
        }
        if (!this.location && !this.isExcluded('location', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_LOCATION');
        }
        if (!this.eta && !this.isExcluded('eta', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_ETA');
        }
        if (this.type == null && !this.isExcluded('type', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_TYPE');
        }
        return null;
    }
}