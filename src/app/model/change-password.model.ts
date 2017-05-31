import { AlertMessageModel } from './alert-message.model';
import { BaseModel } from './base.model';
import { CustomerValidator } from "../utils/CustomValidator";

export class ChangePasswordModel extends BaseModel {
  public currentPassword: string;
  public newPassword: string;
  public confirmPassword: string;

  validate(excludedFields = []): AlertMessageModel {
    if (!this.currentPassword && !this.isExcluded('currentPassword', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_CURRENT_PASSWORD');
    }
    if (!this.newPassword && !this.isExcluded('newPassword', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_NEW_PASSWORD');
    }
    if (!this.confirmPassword && !this.isExcluded('confirmPassword', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_CONFIRM_PASSWORD');
    }
    if (this.newPassword !== this.confirmPassword) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.UNMATCHED_PASSWORD');
    }
    if (this.currentPassword === this.newPassword) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.SAME_PASSWORD');
    }
    if (!CustomerValidator.PasswordValidator(this.newPassword)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.INVALID_PASSWORD');
    }
    return null;
  }
}
