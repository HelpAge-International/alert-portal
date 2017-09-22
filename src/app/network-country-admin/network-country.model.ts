import {BaseModel} from "../model/base.model";
import {AlertMessageModel} from "../model/alert-message.model";

export class NetworkCountryModel extends BaseModel {

  public id: string;
  public adminId: string;
  public isActive: boolean;
  public location: number;
  public clockSettings: any;

  validate(excludedFields): AlertMessageModel {
    return undefined;
  }

}
