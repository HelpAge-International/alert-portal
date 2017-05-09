/**
 * Created by Fei on 08/03/2017.
 */

export class ModelAgency {
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

  constructor(name:string) {
    this.name = name;
  }
}
