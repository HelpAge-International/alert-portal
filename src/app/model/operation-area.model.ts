import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class OperationAreaModel extends BaseModel {
  public country: number;
  public level1: number;
  public level2: number;

  validate(excludedFields = []): AlertMessageModel {
    if (!this.country && !this.isExcluded('country', excludedFields)) {
      return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_COUNTRY');
    }
    if (!this.level1 && !this.isExcluded('level1', excludedFields)) {
      return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_LEVEL1');
    }
    if (!this.level2 && !this.isExcluded('level2', excludedFields)) {
      return new AlertMessageModel('ADD_PARTNER.NO_OPERATION_AREA_LEVEL2');
    }
    return null;
  }
}
