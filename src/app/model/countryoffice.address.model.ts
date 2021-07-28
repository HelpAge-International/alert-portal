/**
 * Created by LuCiAN on 04/05/2017.
 */
import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";
import { CustomerValidator } from "../utils/CustomValidator";

export class CountryOfficeAddressModel extends BaseModel {
  public addressLine1: string;
  public addressLine2: string;
  public addressLine3: string;
  public city: string;
  public postCode: string;
  public phone: string;
  public location: number; // Country
  public email: string;
  public countryCode : number

  validate(excludedFields = []): AlertMessageModel {
    if (!this.addressLine1 && !this.isExcluded('addressLine1', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.UPDATE_DETAILS.NO_ADDRESS_1');
    }
    if (!this.city && !this.isExcluded('city', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.UPDATE_DETAILS.NO_CITY');
    }
    if (!this.phone && !this.isExcluded('phone', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.UPDATE_DETAILS.NO_PHONE');
    }
    if (this.location < 0 && !this.isExcluded('location', excludedFields)) {
      return new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.NO_COUNTRY');
    }
    if (this.email && !CustomerValidator.EmailValidator(this.email) && !this.isExcluded('email', excludedFields)) {
      return new AlertMessageModel('GLOBAL.EMAIL_NOT_VALID');
    }
    return null;
  }
}
