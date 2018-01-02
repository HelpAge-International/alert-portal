import {Privacy} from "../utils/Enums";

export class NetworkPrivacyModel {
  public mpa:number = Privacy.Private;
  public apa:number = Privacy.Private;
  public chs:number = Privacy.Private;
  public riskMonitoring:number = Privacy.Private;
  public conflictIndicators:number = Privacy.Private
  public officeProfile:number = Privacy.Private;
  public responsePlan:number = Privacy.Private;

  public mapObject(item:any) {
    this.mpa = item[0].privacy;
    this.apa = item[1].privacy;
    this.chs = item[2].privacy;
    this.riskMonitoring = item[3].privacy;
    this.conflictIndicators = item[4].privacy
    this.officeProfile = item[5].privacy;
    this.responsePlan = item[6].privacy;
  }
}
