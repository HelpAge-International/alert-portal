import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class ModuleSettingsModel extends BaseModel{
  public privacy: number;
  public status: boolean;


  validate(excludedFields = []): AlertMessageModel {
    if (!this.privacy && !this.isExcluded('privacy', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.MODULES.NO_PRIVACY');
    }
    if (!this.status && !this.isExcluded('status', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.MODULES.NO_STATUS');
    }
    return null;
  }
}