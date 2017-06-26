import {BaseModel} from "../../../../model/base.model";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {CustomerValidator} from "../../../../utils/CustomValidator";
/**
 * Created by fei on 22/06/2017.
 */

export class ModelSurgeCapacity extends BaseModel {
  public orgnization: string;
  public relationship: string;
  public name: string;
  public position: string;
  public email: string;
  public location: string;
  public arrivalTimeValue: number;
  public arrivalTimeType: number;
  public durationOfDeployment: string;
  public updatedAt:number;
  public sectors: number[] = [];

  validate(excludedFields): AlertMessageModel {
    if (!this.orgnization && !this.isExcluded('orgnization', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_ORGANIZATION');
    }
    if (!this.relationship && !this.isExcluded('relationship', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_RELATIONSHIP');
    }
    if (!this.name && !this.isExcluded('name', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_NAME');
    }
    if (!this.position && !this.isExcluded('position', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_POSITION');
    }
    if (!this.email && !this.isExcluded('email', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_EMAIL');
    }
    if (!CustomerValidator.EmailValidator(this.email) && !this.isExcluded('email', excludedFields)) {
      return new AlertMessageModel('GLOBAL.EMAIL_NOT_VALID');
    }
    if (!this.location && !this.isExcluded('location', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_LOCATION');
    }
    if (!this.arrivalTimeValue && !this.isExcluded('arrivalTimeValue', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_TIME_VALUE');
    }
    if (this.arrivalTimeValue < 0 && !this.isExcluded('arrivalTimeValue', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.TIME_VALUE_INVALID');
    }
    if (!this.arrivalTimeType && !this.isExcluded('arrivalTimeType', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_TIME_TYPE');
    }
    if (!this.durationOfDeployment && !this.isExcluded('durationOfDeployment', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_DEPLOYMENT');
    }
    if (this.sectors.length <= 0 && !this.isExcluded('sectors', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.NO_SECTORS');
    }

    return null;
  }

}
