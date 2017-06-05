import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";
import { PermissionsModel } from "./permissions.model";
import { PartnerStatus } from "../utils/Enums";

export class PartnerModel extends BaseModel {
  public id: string;
  public partnerOrganisationId: string;
  public position: string;
  public notificationSettings: any[];
  public permissions: PermissionsModel;
  public hasValidationPermission: string;
  public status: number;
  public createdAt: number;
  public modifiedAt: number;

  constructor() {
    super();
    this.permissions = new PermissionsModel();

    // set the default status to awaiting validations
    this.status = PartnerStatus.AwaitingValidation;
  }

  validate(excludedFields = []): AlertMessageModel {
    if(!this.partnerOrganisationId && !this.isExcluded('partnerOrganisationId', excludedFields))
    {
      return new AlertMessageModel('COUNTRY_ADMIN.PARTNER.NO_PARTNER_ORGANISATION');
    }
    if(!this.position && !this.isExcluded('position', excludedFields))
    {
      return new AlertMessageModel('COUNTRY_ADMIN.PARTNER.NO_POSITION');
    }
    if(typeof(this.hasValidationPermission) !== typeof(true) && !this.isExcluded('hasValidationPermission', excludedFields))
    {
      return new AlertMessageModel('COUNTRY_ADMIN.PARTNER.NO_VALIDATION_PERMISSION');
    }
  }
}
