import { AlertMessageModel } from './alert-message.model';
import { BaseModel } from './base.model';

export class CountryAdminModel extends BaseModel {
  public countryId: string;
  public agencyAdmin: Map<string, boolean>;
  public systemAdmin: Map<string, boolean>;
  public agencyId?: string;
  public firstLogin?: boolean;

  // TODO implement validation
  validate(excludedFields = []): AlertMessageModel {
    return null;
  }
}
