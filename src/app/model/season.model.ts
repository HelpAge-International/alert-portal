export class ModelSeason {
  public colorCode: string;
  public endTime: number;
  public startTime: number;
  public name: string;

  constructor(colorCode: string, name: string, startTime: number, endTime: number) {
    this.colorCode = colorCode;
    this.endTime = endTime;
    this.startTime = startTime;
    this.name = name;
  }
}
