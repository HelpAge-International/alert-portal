import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class NoteModel extends BaseModel {
    public id: string;
    public content: string;
    public time: number;
    public uploadedBy: string;
    public uploadBy?: string;
    public agencyId?: string;
    public agencyName?: string;

    validate(excludedFields = []): AlertMessageModel {
        if (!this.content && !this.isExcluded('content', excludedFields)) {
            return new AlertMessageModel('NOTES.NO_CONTENT');
        }

        return null;
    }
}
