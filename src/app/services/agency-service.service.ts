
import {from as observableFrom, Subject, Observable} from 'rxjs';
import {Injectable} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFireDatabase } from "@angular/fire/database";
import {ModelFaceToFce} from "../dashboard/facetoface-meeting-request/facetoface.model";
import {CountryOfficeAddressModel} from "../model/countryoffice.address.model";
import {DurationType, SkillType} from "../utils/Enums";
import {ModelAgencyPrivacy} from "../model/agency-privacy.model";
import {ModelAgency} from "../model/agency.model";
import {ModelCountryOffice} from "../model/countryoffice.model";
import {takeUntil} from "rxjs/operator/takeUntil";

@Injectable()
export class AgencyService {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private agencyId: string;

  constructor(private afd: AngularFireDatabase) {
  }

  getAgencyId(agencyAdminId) {
    return this.afd.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/agencyId")
      .valueChanges()
      .map((id:any) => {
        if (id.$value) {
          return id.$value;
        }
      });
  }

  getAgency(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId);
  }

  getAgencyModel(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId)
      .valueChanges()
      .map((agency:any) => {
        let model = new ModelAgency(agency.name);
        model.mapFromObject(agency);
        model.id = agency.$key;
        return model;
      });
  }

  getAgencyResponsePlanClockSettingsDuration(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId + "/clockSettings/responsePlans")
      .valueChanges()
      .map((settings:any) => {
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
    return this.afd.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/systemAdmin/")
      .valueChanges()
      .map((system:any) => {
        return Object.keys(system.val()).shift();
      });
  }

  getAgencyModuleSetting(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/module/" + agencyId);
  }

  getCountryOffice(countryId, agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId);
  }

  getLocalAgency(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId);
  }

  getAllCountryOffices() {
    return this.afd.list(Constants.APP_STATUS + "/countryOffice/");
  }


  getCountryDirector(countryId) {
    return this.afd.object(Constants.APP_STATUS + "/directorCountry/" + countryId)
      .valueChanges()
      .flatMap((directorId: any) => {
        return this.afd.object(Constants.APP_STATUS + "/userPublic/" + directorId.$value).valueChanges();
      });
  }

  getAllAgencySameCountry(countryId, agencyId) {

    let displayList: ModelFaceToFce[] = [];
    this.afd.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId)
      .valueChanges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((country:any) => {


        this.afd.list(Constants.APP_STATUS + "/countryOffice/")
          .valueChanges()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((agencies: any) => {
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

    return this.afd.list(Constants.APP_STATUS + "/countryOffice/" + agencyId, {
      query: {
        orderByChild: "location",
        equalTo: countryCode
      }
    })

  }

  getAllLocalAgencyByNetworkCountry(countryCode, agencyId) {

    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId)

  }


  public saveCountryOfficeAddress(agencyId: string, countryId: string, countryOfficeAddress: CountryOfficeAddressModel): firebase.Promise<any> {
    if (!agencyId || !countryId || !countryOfficeAddress) {
      return Promise.reject('Missing agencyId, countryId or countryOfficeAddress');
    }

    return this.afd.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId).set(countryOfficeAddress);
  }

  public saveLocalAgencyAddress(agencyId: string, countryOfficeAddress: CountryOfficeAddressModel): firebase.Promise<any> {
    if (!agencyId || !countryOfficeAddress) {
      return Promise.reject('Missing agencyId or countryOfficeAddress');
    }

    return this.afd.object(Constants.APP_STATUS + '/agency/' + agencyId).set(countryOfficeAddress);
  }

  public getPrivacySettingForAgency(agencyId): Observable<any> {
    return this.afd.object(Constants.APP_STATUS + "/module/" + agencyId)
      .valueChanges()
      .map((snap:any) => {
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
    return this.afd.list(Constants.APP_STATUS + "/agency")
      .valueChanges()
      .map((agencies:any) => {
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
    return this.afd.list(Constants.APP_STATUS + "/network/" + networkId + "/agencies")
      .valueChanges()
      .map((agencies:any) => {
        return agencies.filter(agency => agency.isApproved);
      })
      .map(filteredAgencies => {
        return filteredAgencies.map(agency => {
          return this.afd.object(Constants.APP_STATUS + "/agency/" + agency.$key)
            .valueChanges()
            .map((agency: any) => {
              let modelAgency = new ModelAgency(agency.name);
              modelAgency.mapFromObject(agency);
              modelAgency.id = agency.$key;
              return modelAgency;
            })
        });
      })
  }

  public countryExistInAgency(countryLocation, agencyId) {
    return this.afd.list(Constants.APP_STATUS + "/countryOffice/" + agencyId, {
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
    return this.afd.list(Constants.APP_STATUS + "/agency/" + agencyId + "/skills")
      .valueChanges()
      .flatMap(skills => {
        let mapedSkills = skills.map((item:any) => {
          item["id"] = item.$key
          return item
        })
        return observableFrom(mapedSkills)
      })
      .flatMap(skill =>{
        return this.afd.object(Constants.APP_STATUS + "/skill/" + skill["id"]).valueChanges()
      })
  }

  getAllCountryIdsForAgency(agencyId) {
    return this.afd.list<AgencyService>(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .valueChanges()
      .map((offices: any) =>{
        return offices.map(office => office.$key)
      })
  }

  getAgencyNotificationSettings(agencyId:string) {
    return this.getAgency(agencyId)
      .valueChanges()
      .map((agency:any) => agency.notificationSetting)
  }

  unSubscribeNow() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
