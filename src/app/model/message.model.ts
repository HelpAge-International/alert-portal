import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class MessageModel extends BaseModel {
  public id: string;
  public senderId: string;
  public title: string;
  public content: string;
  public time: number;
  public userType: any[];

  constructor() { 
    super(); 
    this.userType = [];
}

  validate(excludedFields = []): AlertMessageModel {
    if (!this.title && !this.isExcluded('title', excludedFields)) {
      return new AlertMessageModel('MESSAGES.NO_TITLE_ERROR');
    }
    if (!this.content && !this.isExcluded('content', excludedFields)) {
      return new AlertMessageModel('MESSAGES.NO_CONTENT_ERROR');
    }
    if(this.userType.length < 1 && !this.isExcluded('content', excludedFields)){
      return new AlertMessageModel('MESSAGES.NO_RECIPIENTS_ERROR');
    }
    return null;
  }
}
