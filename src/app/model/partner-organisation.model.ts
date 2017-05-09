import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class PartnerOrganisationModel extends BaseModel {
  public id: string;
  public title: string;
  public projectName: string;

  // TODO implement validation
  validate(excludedFields = []): AlertMessageModel {
    return null;
  }
}
