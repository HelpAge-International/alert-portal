
import {mergeMap, map} from 'rxjs/operators';

import {from as observableFrom, Subject, Observable} from 'rxjs';
import {Injectable} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFireDatabase, AngularFireObject, SnapshotAction} from "@angular/fire/database";
import {ModelFaceToFce} from "../dashboard/facetoface-meeting-request/facetoface.model";
import {CountryOfficeAddressModel} from "../model/countryoffice.address.model";
import {DurationType} from "../utils/Enums";
import {ModelAgencyPrivacy} from "../model/agency-privacy.model";
import {ModelAgency} from "../model/agency.model";
import {ModelCountryOffice} from "../model/countryoffice.model";
import {takeUntil} from "rxjs/operators";

@Injectable()
export class AgencyService {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private agencyId: string;

  constructor(private afd: AngularFireDatabase) {
  }

  getAgencyId(agencyAdminId) {
    return this.afd.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/agencyId")
      .valueChanges().pipe(
      map((id:string) => {
        if (id) {
          return id;
        }
      }));
  }

  getAgency(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId);
  }

  getAgencyModel(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId)
      .snapshotChanges().pipe(
      map((agencySnap: SnapshotAction<ModelAgency>) => {
        const agency = agencySnap.payload.val()
        let model = new ModelAgency(agency.name);
        model.mapFromObject(agency);
        model.id = agencySnap.key;
        return model;
      }));
  }

  getAgencyResponsePlanClockSettingsDuration(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId + "/clockSettings/responsePlans")
      .valueChanges().pipe(
      map((settings: {durationType: number, value :number}) => {
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
      }));
  }

  getSystemId(agencyAdminId): Observable<any> {
    return this.afd.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId + "/systemAdmin/")
      .valueChanges().pipe(
      map((system: any) => {
        return Object.keys(system).shift();
      }));
  }

  getAgencyModuleSetting(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/module/" + agencyId);
  }

  getCountryOffice(countryId, agencyId): AngularFireObject<CountryOfficeAddressModel>{
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
      .valueChanges().pipe(
      mergeMap((directorId: any) => {
        return this.afd.object(Constants.APP_STATUS + "/userPublic/" + directorId.$value).valueChanges();
      }));
  }

  getAllAgencySameCountry(countryId, agencyId) {

    let displayList: ModelFaceToFce[] = [];
    this.afd.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId)
      .valueChanges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((country:ModelCountryOffice) => {
        this.afd.list(Constants.APP_STATUS + "/countryOffice/")
          .snapshotChanges()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((agencies: SnapshotAction<ModelAgency>[]) => {
            agencies = agencies.filter(agency => agency.key != agencyId);
            // console.log(agencies);
            agencies.forEach(agencySnap => {
              const agency = agencySnap.payload.val()
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
                faceToface.agencyId = agencySnap.key;
                faceToface.countryId = countries[0].countryId;
                displayList.push(faceToface);
              }
            });
          });
      });
    return displayList;
  }

  getAllAgencyByNetworkCountry(countryCode, agencyId) {

    return this.afd.list(Constants.APP_STATUS + "/countryOffice/" + agencyId, ref => ref.orderByChild('location').equalTo(countryCode) )

  }

  getAllLocalAgencyByNetworkCountry(countryCode, agencyId) {

    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId)

  }


  public saveCountryOfficeAddress(agencyId: string, countryId: string, countryOfficeAddress: CountryOfficeAddressModel): Promise<any> {
    if (!agencyId || !countryId || !countryOfficeAddress) {
      return Promise.reject('Missing agencyId, countryId or countryOfficeAddress');
    }

    return this.afd.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId).set(countryOfficeAddress);
  }

  public saveLocalAgencyAddress(agencyId: string, countryOfficeAddress: CountryOfficeAddressModel): Promise<any> {
    if (!agencyId || !countryOfficeAddress) {
      return Promise.reject('Missing agencyId or countryOfficeAddress');
    }

    return this.afd.object(Constants.APP_STATUS + '/agency/' + agencyId).set(countryOfficeAddress);
  }

  public getPrivacySettingForAgency(agencyId): Observable<any> {
    return this.afd.object(Constants.APP_STATUS + "/module/" + agencyId)
      .snapshotChanges().pipe(
      map((snap:SnapshotAction<any>) => {
        if (snap.payload.val()) {
          let privacy = new ModelAgencyPrivacy();
          privacy.mpa = snap.payload.val()[0].privacy;
          privacy.apa = snap.payload.val()[1].privacy;
          privacy.chs = snap.payload.val()[2].privacy;
          privacy.riskMonitoring = snap.payload.val()[3].privacy;
          privacy.officeProfile = snap.payload.val()[4].privacy;
          privacy.responsePlan = snap.payload.val()[5].privacy;
          return privacy;
        }
      }));
  }

  public getAllAgencyFromPlatform() {
    return this.afd.list(Constants.APP_STATUS + "/agency")
      .snapshotChanges()
      .pipe(
        map((agencies:SnapshotAction<ModelAgency>[]) => {
          let models: ModelAgency[] = [];
          agencies.forEach(snap => {
            const agency = snap.payload.val()
            let modelAgency = new ModelAgency(agency.name);
            modelAgency.mapFromObject(agency);
            modelAgency.id = snap.key;
            models.push(modelAgency);
          });
          return models;
        })
      )
  }

  public getApprovedAgenciesByNetwork(networkId) {
    return this.afd.list(Constants.APP_STATUS + "/network/" + networkId + "/agencies")
      .snapshotChanges().pipe(
      map((agencies: SnapshotAction<ModelAgency>[]) => {
        return agencies.filter(agencySnap => agencySnap.payload.val().isApproved);
      }),
      map(filteredAgencies => {
        return filteredAgencies.map(agencySnap => {
          return this.afd.object(Constants.APP_STATUS + "/agency/" + agencySnap.key)
            .snapshotChanges()
            .pipe(
              map((agencySnap: SnapshotAction<ModelAgency>) => {
                const agency = agencySnap.payload.val()
                let modelAgency = new ModelAgency(agency.name);
                modelAgency.mapFromObject(agency);
                modelAgency.id = agencySnap.key;
                return modelAgency;
              })
            )
        });
      }),)
  }

  public countryExistInAgency(countryLocation, agencyId) {
    return this.afd.list(Constants.APP_STATUS + "/countryOffice/" + agencyId, ref => ref.orderByChild('location').equalTo(Number(countryLocation)))
      .snapshotChanges()
      .map((list:SnapshotAction<ModelCountryOffice>[]) => {
        if (list.length > 0) {
          let model = new ModelCountryOffice();
          model.mapFromObject(list[0].payload.val());
          model.id = list[0].key;
          return model;
        } else {
          return null;
        }
      });
  }

  getSkillsForAgency(agencyId) {
    return this.afd.list(Constants.APP_STATUS + "/agency/" + agencyId + "/skills")
      .snapshotChanges()
      .pipe(
        mergeMap((skills: SnapshotAction<any>[]) => {
          let mapedSkills = skills.map((itemSnap) => {
            const item = itemSnap.payload.val()
            item["id"] = itemSnap.key
            return item
          })
          return observableFrom(mapedSkills)
        }),
        mergeMap(skill =>{
          return this.afd.object(Constants.APP_STATUS + "/skill/" + skill["id"]).valueChanges()
        }),
      )
  }

  getAllCountryIdsForAgency(agencyId) {
    return this.afd.list<AgencyService>(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .valueChanges().pipe(
      map((offices: any) =>{
        return offices.map(office => office.$key)
      }))
  }

  getAgencyNotificationSettings(agencyId:string) {
    return this.getAgency(agencyId)
      .valueChanges().pipe(
      map((agency: ModelAgency) => agency.notificationSetting))
  }

  unSubscribeNow() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
