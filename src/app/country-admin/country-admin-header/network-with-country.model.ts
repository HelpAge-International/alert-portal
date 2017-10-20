import {BaseModel} from "../../model/base.model";
import {AlertMessageModel} from "../../model/alert-message.model";

export class NetworkWithCountryModel extends BaseModel{

  public networkId:string;
  public networkCountryId:string

  validate(excludedFields): AlertMessageModel {
    return undefined;
  }
}
