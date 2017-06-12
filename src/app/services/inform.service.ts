import {Countries, Countries3ISO, HazardScenario, InformCodes} from "../utils/Enums";
import {Constants} from "../utils/Constants";
declare var jQuery: any;

export class InformService {

  public info: Countries3ISO;
  public informInfo: InformCodes;

  constructor() {
    this.info = Countries3ISO.init();
    this.informInfo = InformCodes.init();
  }

  public getTopResultsCC(countryCode: Countries, numberOfItems: number, fun: (list: InformHolder[]) => void) {
    this.sendForTopHazards3digit(this.info.get(countryCode), numberOfItems, fun);
  }
  public getTopResults(countryCode: string, numberOfItems: number, fun: (list: InformHolder[]) => void,) {
    this.sendForTopHazards3digit(countryCode, numberOfItems, fun);
  }
  private sendForTopHazards3digit(countryCode: string, numberOfItems: number, fun: (list: InformHolder[]) => void) {
    jQuery.getJSON('http://inform.jrc.ec.europa.eu/gnasystem/api001.aspx?' +
        'service=InfoRM' +
        '&workflow=' + Constants.INFORM_WORKFLOW +
        '&request=GetData' +
        '&iso3=' + countryCode +
        '&indicators=all' +
        '&format=json', (response) => {
      let holder: InformHolder[] = [];
      for (let x of this.informInfo.list) {
        let val = this.getFromResponse(response, x);
        if (val != null) {
          holder.push(InformHolder.create(this.informInfo.get(x), val));
        }
      }
      holder = holder
        .sort((a,b) => {
          if (a.value < b.value) {
            return 1;
          }
          if (a.value > b.value) {
            return -1;
          }
          return 0;
        })
        .slice(0, numberOfItems);
      fun(holder);
    });
  }
  private validResponse(response) {
    return response != null && response.data != null && response.data.length === 1;
  }
  private getFromResponse(response, code: string): number {
    if (this.validResponse(response)) {
      return response.data[0][code];
    }
    else {
      return null;
    }
  }
}

export class InformHolder {
  public hazardScenario: number;
  public value: number;

  public static create(scenario: HazardScenario, value: number): InformHolder {
    let holder = new InformHolder();
    holder.hazardScenario = scenario;
    holder.value = value;
    return holder;
  }
}
