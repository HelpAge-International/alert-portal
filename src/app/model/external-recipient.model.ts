/**
 * Created by Fei on 07/03/2017.
 */
import { AlertMessageModel } from '../model/alert-message.model';
import { CustomerValidator } from "../utils/CustomValidator";
import { BaseModel } from "./base.model";

export class ExternalRecipientModel extends BaseModel {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  title: number;
  email: string;
  organisation: string;
  notificationsSettings: any[];

  constructor() {
    super();
    this.notificationsSettings = [];
}

  validate(excludedFields = []): AlertMessageModel {
    if (!this.title && !this.isExcluded('title', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_TITLE');
    }
    if (!this.firstName && !this.isExcluded('firstName', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_F_NAME');
    }
    if (!this.lastName && !this.isExcluded('lastName', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_L_NAME');
    }
    if (!this.email && !this.isExcluded('email', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_EMAIL');
    }
    if (!CustomerValidator.EmailValidator(this.email) && !this.isExcluded('email', excludedFields)) {
      return new AlertMessageModel('GLOBAL.EMAIL_NOT_VALID');
    }
    if (!this.phone && !this.isExcluded('phone', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.UPDATE_DETAILS.NO_PHONE');
    }
    if (!this.organisation && !this.isExcluded('organisation', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.NOTIFICATIONS.NO_ORGANISATION');
    }

    return null;
  }
}
