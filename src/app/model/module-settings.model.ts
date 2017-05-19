import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class ModuleSettingsModel extends BaseModel{
  public privacy: number;
  public status: boolean;


  // No validation required
  validate(excludedFields = []): AlertMessageModel {
    return null;
  }
}