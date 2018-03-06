import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Constants} from "../utils/Constants";
import {TranslateService} from "@ngx-translate/core";
import {AngularFire} from "angularfire2";

@Injectable()
export class CommonService {

  constructor(private _http: Http,
              private af:AngularFire,
              private translate:TranslateService) {
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

  getAreaNameListFromObj(jsonContent: {}, areas: any): string {
    let areaList = Object.keys(areas).map(key => Object.keys(areas[key]).map(id => areas[key][id]).reverse())
    let names = "";
    areaList.forEach(area => {
      if (area.length == 1 || (area.length == 2 && area[0] == -1) || (area.length == 3 && area[0] == -1 && area[1] == -1)) {
        let country = area[0];
        if (area.length == 2) {
          country = area[1]
        } else if (area.length == 3) {
          country = area[2]
        }
        let key = Constants.COUNTRIES[country]
        names += this.translate.instant(key)
        names += "\n"
      }
      else if (area.length == 2 || (area.length ==3 && area[0] == -1)) {
        let level1 = area[0];
        let country = area[1];
        if (area.length == 3) {
          level1 = area[1]
          country = area[2]
        }
        let countryName = Constants.COUNTRIES[country];
        let level1Name = jsonContent[country]["levelOneValues"][level1]["value"] ? jsonContent[country]["levelOneValues"][level1]["value"] + ", " : ""
        console.log(level1Name)
        names += level1Name + this.translate.instant(countryName)
        names += "\n"
      }
      else if (area.length == 3) {
        let level2 = area[0];
        let level1 = area[1];
        let country = area[2];
        let countryName = Constants.COUNTRIES[country];
        let level1Name = jsonContent[country]["levelOneValues"][level1]["value"] ? jsonContent[country]["levelOneValues"][level1]["value"] + ", " : ""
        let level2Name = jsonContent[country]["levelOneValues"][level1]["levelTwoValues"][level2]["value"] ? jsonContent[country]["levelOneValues"][level1]["levelTwoValues"][level2]["value"] + ", " : ""
        names += level2Name + level1Name + this.translate.instant(countryName)
        names += "\n"
      }
    })

    return names;
  }

  getCountryTotalForSystem() {
    let totalCountries = 0
    let totalAgency = 9
    this.af.database.list(Constants.APP_STATUS + "/agency/")
      .flatMap(agencies => {
        totalAgency = agencies.length
        return Observable.from(agencies)
      })
      .flatMap(agencyId =>{
        return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      })
      .take(totalAgency)
      .subscribe(countries => {
        totalCountries += countries.length
      })
    return totalCountries
  }
}
