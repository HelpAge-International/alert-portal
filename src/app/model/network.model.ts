/**
 * Created by Fei on 24/03/2017.
 */
import {BaseModel} from "./base.model";
import {AlertMessageModel} from "./alert-message.model";

export class ModelNetwork extends BaseModel{

  public networkAdminId: string;
  public name: string;
  public isActive: boolean;
  public logoPath: string;
  public isInitialisedNetwork: boolean;
  public addressLine1: string;
  public addressLine2: string;
  public addressLine3: string;
  public countryId: number;
  public city: string;
  public postcode: string;
  public telephone: string;
  public websiteAddress: string;
  public isGlobal: boolean;
  public countryCode: number;
  public clockSettings:{} = {};
  public responsePlanSettings:{} = {};
  public id:string;
  public agencies?: string[];
  public leadAgencyId?: string;

  validate(excludedFields: any): AlertMessageModel {
    throw new Error("Method not implemented.");
  }

}
