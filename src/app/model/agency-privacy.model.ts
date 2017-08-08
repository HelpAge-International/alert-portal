export class ModelAgencyPrivacy {
  public mpa:number;
  public apa:number;
  public chs:number;
  public riskMonitoring:number;
  public officeProfile:number;
  public responsePlan:number;
  public id:string;

  public mapObject(item:any) {
    this.mpa = item[0].privacy;
    this.apa = item[1].privacy;
    this.chs = item[2].privacy;
    this.riskMonitoring = item[3].privacy;
    this.officeProfile = item[4].privacy;
    this.responsePlan = item[5].privacy;
    this.id = item.$key;
  }
}
