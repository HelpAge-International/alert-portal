import {Injectable} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {ModelFaceToFce} from "../dashboard/facetoface-meeting-request/facetoface.model";
import {CountryOfficeAddressModel} from "../model/countryoffice.address.model";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AgencyService {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private agencyId: string;

  constructor(private af: AngularFire) {
  }

  getAgencyId(agencyAdminId) {
    return this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/agencyId")
      .map(id => {
        if (id.$value) {
          return id.$value;
        }
      });
  }

  getAgency(agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId);
  }

  getSystemId(agencyAdminId): Observable<any> {
    return this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/systemAdmin/", {preserveSnapshot: true})
      .map(system => {
        return Object.keys(system.val()).shift();
      });
  }

  getAgencyModuleSetting(agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/module/" + agencyId);
  }

  getCountryOffice(countryId, agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId);
  }

  getAllCountryOffices() {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/");
  }

  getCountryDirector(countryId) {
    return this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + countryId)
      .flatMap(directorId => {
        return this.af.database.object(Constants.APP_STATUS + "/userPublic/" + directorId.$value);
      });
  }

  getAllAgencySameCountry(countryId, agencyId) {

    let displayList: ModelFaceToFce[] = [];
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(country => {


        this.af.database.list(Constants.APP_STATUS + "/countryOffice/")
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agencies => {
            agencies = agencies.filter(agency => agency.$key != agencyId);
            // console.log(agencies);
            agencies.forEach(agency => {
              // console.log(agency);
              let countries = Object.keys(agency).map(key => {
                let temp = agency[key];
                temp["countryId"] = key;
                return temp;
              });
              countries = countries.filter(countryItem => countryItem.location == country.location);
              // console.log(countries);
              if (countries.length > 0) {
                let faceToface = new ModelFaceToFce();
                faceToface.agencyId = agency.$key;
                faceToface.countryId = countries[0].countryId;
                displayList.push(faceToface);
              }
            });
          });
      });
    return displayList;
  }

  public saveCountryOfficeAddress(agencyId: string, countryId: string, countryOfficeAddress: CountryOfficeAddressModel): firebase.Promise<any>{
    if(!agencyId || !countryId || !countryOfficeAddress)
    {
      return Promise.reject('Missing agencyId, countryId or countryOfficeAddress');
    }

    return this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId).set(countryOfficeAddress);
  }

  unSubscribeNow() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
