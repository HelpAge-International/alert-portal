import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Constants} from "../utils/Constants";

@Injectable()
export class CommonService {

  constructor(private _http: Http) {
  }


  getJsonContent(path: string): Observable<any> {
    return this._http.get(path).map(res => {
      return res.json() || {}
    });
  }

  getAreaNameList(jsonContent: {}, areas: string[]): string[] {
    let names = [];
    if (areas.length == 1) {
      let country = areas[0];
      let countryName = Constants.COUNTRIES[country];
      names.push(countryName);
    }
    if (areas.length == 2) {
      let level1 = areas[0];
      let country = areas[1];
      let countryName = Constants.COUNTRIES[country];
      let level1Name = jsonContent[country]["levelOneValues"][level1]["value"];
      names.push(level1Name, countryName);
    }
    if (areas.length == 3) {
      let level2 = areas[0];
      let level1 = areas[1];
      let country = areas[2];
      let countryName = Constants.COUNTRIES[country];
      let level1Name = jsonContent[country]["levelOneValues"][level1]["value"];
      let level2Name = jsonContent[country]["levelOneValues"][level2]["levelTwoValues"]["value"];
      names.push(level2Name, level1Name, countryName);
    }

    return names;
  }
}
