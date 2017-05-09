import { BaseModel } from "./base.model";
import { AlertMessageType } from '../utils/Enums';

export class AlertMessageModel extends BaseModel{
  public type: number;
  public message: string;

  constructor(message, type = AlertMessageType.Error) {
    super();
    this.type = type;
    this.message = message;
  }

  // No validation required
  validate(excludedFields = []): AlertMessageModel {
    return null;
  }
}