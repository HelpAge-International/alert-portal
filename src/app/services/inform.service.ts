import {Countries, Countries3ISO, HazardScenario, InformCodes} from "../utils/Enums";
import {Constants} from "../utils/Constants";
import {Http, RequestOptions, Response, Headers} from "@angular/http";
declare var jQuery: any;

export class InformService {

  public info: Countries3ISO;
  public informInfo: InformCodes;
  private http: Http;

  constructor(http: Http) {
    this.http = http;
    this.info = Countries3ISO.init();
    this.informInfo = InformCodes.init();
  }

  public getTopResultsCC(countryCode: Countries, numberOfItems: number, fun: (list: InformHolder[]) => void) {
    console.log('here')
    console.log(countryCode)
    this.sendForTopHazards3digit(this.info.get(countryCode), numberOfItems, fun);
  }
  public getTopResults(countryCode: string, numberOfItems: number, fun: (list: InformHolder[]) => void,) {
    this.sendForTopHazards3digit(countryCode, numberOfItems, fun);
  }
  private sendForTopHazards3digit(countryCode: string, numberOfItems: number, fun: (list: InformHolder[]) => void) {
    console.log(countryCode)
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('accept', '*/*');
    let options = new RequestOptions({ headers: headers });
    console.log('here2')
    this.http.get(this.buildUrl(countryCode), options)
      .map((res: Response) => {
        console.log(res)
        return res.json();
      })
      .subscribe(response => {
        console.log('here4')
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
      }, err => {
        fun([]);
      });
  }
  private buildUrl(countryCode: string) {
    return 'https://alert-190fa.appspot.com/inform/' + countryCode;
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
  public otherHazard: string;

  public static create(scenario: HazardScenario, value: number, otherHazard?: string): InformHolder {
    let holder = new InformHolder();
    holder.hazardScenario = scenario;
    holder.value = value;
    if (otherHazard != null) {
      holder.otherHazard = otherHazard;
    }
    return holder;
  }
}
