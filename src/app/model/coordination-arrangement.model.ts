import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class CoordinationArrangementModel extends BaseModel {
    public id: string;
    public sector: number;
    public sectorLead: string;
    public isAMember: boolean;
    public staffMember: string;
    public contactName: string;
    public contactEmail: string;
    public contactPhone: string;
    public updatedAt: number;

    validate(excludedFields = []): AlertMessageModel {

        return null;
    }
}