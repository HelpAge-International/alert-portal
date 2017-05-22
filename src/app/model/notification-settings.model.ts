import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class NotificationSettingsModel extends BaseModel{
  public usersNotified: any[];


  validate(excludedFields = []): AlertMessageModel {
    return null;
  }
}