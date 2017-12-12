export class NetworkPrivacyModel {
  public mpa:number;
  public apa:number;
  public chs:number;
  public riskMonitoring:number;
  public conflictIndicators:number
  public officeProfile:number;
  public responsePlan:number;

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
