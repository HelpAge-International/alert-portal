import {BaseModel} from "../../../model/base.model";
import {AlertMessageModel} from "../../../model/alert-message.model";

export class NetworkMessageModel extends BaseModel{

  public id: string;
  public senderId: string;
  public title: string;
  public content: string;
  public time: number;

  validate(excludedFields): AlertMessageModel {
    if (!this.title && !this.isExcluded('title', excludedFields)) {
      return new AlertMessageModel('MESSAGES.NO_TITLE_ERROR');
    }
    if (!this.content && !this.isExcluded('content', excludedFields)) {
      return new AlertMessageModel('MESSAGES.NO_CONTENT_ERROR');
    }
    return null;
  }

}
