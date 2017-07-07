/**
 * Created by Fei on 21/03/2017.
 */
import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class ModelStaff extends BaseModel {
  public id: string;
  public userType: number;
  public region: string;
  public countryOffice: string;
  public department: string;
  public position: string;
  public officeType: number;
  public skill: string[] =[];
  public training: string;
  public notification: number[] =[];
  public isResponseMember: boolean;
  public updatedAt:number;
  public notes = {};

  validate(excludedFields = []): AlertMessageModel {
    // TODO add validation
    return null;
  }
}
