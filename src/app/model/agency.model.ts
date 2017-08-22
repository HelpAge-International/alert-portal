/**
 * Created by Fei on 08/03/2017.
 */
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class ModelAgency extends BaseModel{

  public id:string;
  public adminId:string;
  public name:string;
  public addressLine1:string;
  public addressLine2:string;
  public addressLine3:string;
  public city:string;
  public country:number;
  public currency:number;
  public isActive:boolean;
  public isDonor:boolean;
  public logoPath:string;
  public systemAdmin: Map<string, boolean>;
  public phone:string;
  public postCode:string;
  public website:string;
  public remainApproved:number;
  public sentmessages:{};
  public notificationSetting: any = [];
  public clockSettings:{} = {};
  public responsePlanSettings:{} = {};

  constructor(name:string) {
    super();
    this.name = name;
  }

  validate(excludedFields): AlertMessageModel {
    return undefined;
  }
}
