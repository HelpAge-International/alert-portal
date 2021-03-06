import {BaseModel} from "../model/base.model";
import {AlertMessageModel} from "../model/alert-message.model";

export class NetworkCountryModel extends BaseModel {

  public id: string;
  public adminId: string;
  public isActive: boolean;
  public location: number;
  public clockSettings: any;
  public leadAgencyId: any;
  public agencyCountries: any;
  public networkId: string

  validate(excludedFields): AlertMessageModel {
    return undefined;
  }

}
