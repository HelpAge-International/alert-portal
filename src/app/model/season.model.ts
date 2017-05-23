export class ModelSeason {
  public colorCode: string;
  public endTime: number;
  public startTime: number;
  public name: string;

  constructor(colorCode: string, endTime: number, startTime: number, name: string) {
    this.colorCode = colorCode;
    this.endTime = endTime;
    this.startTime = startTime;
    this.name = name;
  }
}
