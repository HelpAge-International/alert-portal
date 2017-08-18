import {AlertMessageModel} from "../../../model/alert-message.model";
import {BaseModel} from "../../../model/base.model";

export class NetworkOfficeModel extends BaseModel {
  public location;

  validate(excludedFields = []): AlertMessageModel {
    if (!this.location && !this.isExcluded('location', excludedFields)) {
      return new AlertMessageModel("No country selected for network office!");
    }

    return null;
  }
}