/**
 * Created by Fei on 20/03/2017.
 */
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class ModelCountryOffice extends BaseModel {

  public location: number;
  public adminId: string;
  public isActive: boolean;
  public defaultNotificationSettings: any = [];
  public permissionSettings = {};
  public clockSettings = {};
  public id: string;

  validate(excludedFields): AlertMessageModel {
    return undefined;
  }
}
