import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";
import { NoteModel } from "./note.model";

export class StockCapacityModel extends BaseModel {
    public id: string;
    public description: string;
    public quantity: number;
    public location: string;
    public level1: number;
    public level2: string;
    public leadTime: string;
    public stockType: number;
    public notes: NoteModel[];
    public updatedAt: number;

    validate(excludedFields = []): AlertMessageModel {
        if (!this.description && !this.isExcluded('description', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_DESCRIPTION');
        }
        if (!this.quantity && !this.isExcluded('quantity', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_QUANTITY');
        }
        /*if (!this.location && !this.isExcluded('location', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_LOCATION');
        }*/
        if (!this.leadTime && !this.isExcluded('leadTime', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_ETA');
        }
        if (this.stockType == null && !this.isExcluded('stockType', excludedFields)) {
            return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.STOCK_CAPACITY.NO_stockType');
        }
        return null;
    }
}
