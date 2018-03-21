import {Injectable} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {ModelFaceToFce} from "../dashboard/facetoface-meeting-request/facetoface.model";
import {CountryOfficeAddressModel} from "../model/countryoffice.address.model";
import {Observable} from "rxjs/Observable";
import {DurationType} from "../utils/Enums";
import {ModelAgencyPrivacy} from "../model/agency-privacy.model";
import {ModelAgency} from "../model/agency.model";
import {ModelCountryOffice} from "../model/countryoffice.model";

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

  getAgencyModel(agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId)
      .map(agency => {
        let model = new ModelAgency(agency.name);
        model.mapFromObject(agency);
        model.id = agency.$key;
        return model;
      });
  }

  getAgencyResponsePlanClockSettingsDuration(agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId + "/clockSettings/responsePlans")
      .map(settings => {
        console.log(settings);
        let duration = 0;
        let oneDay = 24 * 60 * 60 * 1000;
        let durationType = Number(settings.durationType);
        let value = Number(settings.value);
        if (durationType === DurationType.Week) {
          duration = value * 7 * oneDay;
        } else if (durationType === DurationType.Month) {
          duration = value * 30 * oneDay;
        } else if (durationType === DurationType.Year) {
          duration = value * 365 * oneDay;
        }
        return duration;
      });
  }

  getSystemId(agencyAdminId): Observable<any> {
    return this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/systemAdmin/", {preserveSnapshot: true})
      .map(system => {
        return Object.keys(system.val()).shift();
      });
  }

  getAgencyModuleSetting(agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/module/" + agencyId, {preserveSnapshot: true});
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

  getAllAgencyByNetworkCountry(countryCode, agencyId) {

    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId, {
      query: {
        orderByChild: "location",
        equalTo: countryCode
      }
    })

  }

  getAllLocalAgencyByNetworkCountry(countryCode, agencyId) {

    return this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId)

  }


  public saveCountryOfficeAddress(agencyId: string, countryId: string, countryOfficeAddress: CountryOfficeAddressModel): firebase.Promise<any> {
    if (!agencyId || !countryId || !countryOfficeAddress) {
      return Promise.reject('Missing agencyId, countryId or countryOfficeAddress');
    }

    return this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId).set(countryOfficeAddress);
  }

  public saveLocalAgencyAddress(agencyId: string, countryOfficeAddress: CountryOfficeAddressModel): firebase.Promise<any> {
    if (!agencyId || !countryOfficeAddress) {
      return Promise.reject('Missing agencyId or countryOfficeAddress');
    }

    return this.af.database.object(Constants.APP_STATUS + '/agency/' + agencyId).set(countryOfficeAddress);
  }

  public getPrivacySettingForAgency(agencyId): Observable<any> {
    return this.af.database.object(Constants.APP_STATUS + "/module/" + agencyId, {preserveSnapshot: true})
      .map(snap => {
        if (snap.val()) {
          let privacy = new ModelAgencyPrivacy();
          privacy.mpa = snap.val()[0].privacy;
          privacy.apa = snap.val()[1].privacy;
          privacy.chs = snap.val()[2].privacy;
          privacy.riskMonitoring = snap.val()[3].privacy;
          privacy.officeProfile = snap.val()[4].privacy;
          privacy.responsePlan = snap.val()[5].privacy;
          return privacy;
        }
      });
  }

  public getAllAgencyFromPlatform() {
    return this.af.database.list(Constants.APP_STATUS + "/agency")
      .map(agencies => {
        let models: ModelAgency[] = [];
        agencies.forEach(item => {
          let modelAgency = new ModelAgency(item.name);
          modelAgency.mapFromObject(item);
          modelAgency.id = item.$key;
          models.push(modelAgency);
        });
        return models;
      })
  }

  public getApprovedAgenciesByNetwork(networkId) {
    return this.af.database.list(Constants.APP_STATUS + "/network/" + networkId + "/agencies")
      .map(agencies => {
        return agencies.filter(agency => agency.isApproved);
      })
      .map(filteredAgencies => {
        return filteredAgencies.map(agency => {
          return this.af.database.object(Constants.APP_STATUS + "/agency/" + agency.$key)
            .map(agency => {
              let modelAgency = new ModelAgency(agency.name);
              modelAgency.mapFromObject(agency);
              modelAgency.id = agency.$key;
              return modelAgency;
            })
        });
      })
  }

  public countryExistInAgency(countryLocation, agencyId) {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId, {
      query: {
        orderByChild: "location",
        equalTo: Number(countryLocation)
      }
    })
      .map(list => {
        if (list.length > 0) {
          let model = new ModelCountryOffice();
          model.mapFromObject(list[0]);
          model.id = list[0].$key;
          return model;
        } else {
          return null;
        }
      });
  }

  getSkillsForAgency(agencyId) {
    return this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/skills")
      .flatMap(skills => {
        let mapedSkills = skills.map(item => {
          item["id"] = item.$key
          return item
        })
        return Observable.from(mapedSkills)
      })
      .flatMap(skill =>{
        return this.af.database.object(Constants.APP_STATUS + "/skill/" + skill["id"])
      })
  }

  getAllCountryIdsForAgency(agencyId) {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .map(offices =>{
        return offices.map(office => office.$key)
      })
  }

  unSubscribeNow() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
