
import {of as observableOf, Observable, Subject, Subscription, EMPTY} from 'rxjs';

import {first, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFireDatabase, SnapshotAction} from "@angular/fire/database";
import {AngularFireAuth, } from "@angular/fire/auth";
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {firebaseConfig} from '../app.module';
import {UUID} from '../utils/UUID';
import firebase from "firebase";

import {CountryAdminModel} from "../model/country-admin.model";
import {PartnerModel} from "../model/partner.model";
import {ModelUserPublic} from "../model/user-public.model";
import {DisplayError} from "../errors/display.error";
import {UserType} from "../utils/Enums";
import {ChangePasswordModel} from "../model/change-password.model";
//import {recognize} from "@angular/router/src/recognize";
import {ModelStaff} from "../model/staff.model";
import {subscribeOn} from "rxjs/operator/subscribeOn";
import {ModelAgency} from "../model/agency.model";
import * as XLSX from "xlsx";
import * as moment from "moment";
import {CountryOfficeAddressModel} from "../model/countryoffice.address.model";
import {ModelCountryOffice} from "../model/countryoffice.model";

@Injectable()
export class UserService {
  private secondApp: firebase.app.App;
  public anonymousUserPath: any;

  public user: ModelUserPublic;
  public partner: PartnerModel;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private afd: AngularFireDatabase, private afa: AngularFireAuth) {
    this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
  }

  releaseAll() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // FIREBASE
  createNewFirebaseUser(email: string, password: string): Promise<any> {
    return this.secondApp.auth().createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        this.secondApp.auth().signOut();
        return newUser;
      });
  }

  // PUBLIC USER
  getUser(uid): Observable<ModelUserPublic> {
    if (!uid) {
      return null
    }
    const userSubscription = this.afd.object(Constants.APP_STATUS + '/userPublic/' + uid)
      .snapshotChanges()
      .map(user => {
        if (user.key) {
          let userPublic = new ModelUserPublic(null, null, null, null);
          userPublic.id = uid;
          userPublic.mapFromObject(user.payload.val());

          return userPublic;
        }
        return null;
      });

    return userSubscription;
  }

  getUserByEmail(email): Observable<ModelUserPublic> {
    if (!email) {
      return null;
    }
    const userSubscription = this.afd.list(Constants.APP_STATUS + '/userPublic', ref => ref.orderByChild('email').equalTo(email))
      .snapshotChanges()
      .pipe(first())
      .map(item => {
        if (item.length > 0) {
          let userPublic = new ModelUserPublic(null, null, null, null);
          userPublic.id = item[0].key;
          userPublic.mapFromObject(item[0].payload.val());
          return userPublic;
        } else {
          return null;
        }
      });

    return userSubscription;
  }

  saveUserPublic(userPublic: ModelUserPublic): Promise<any> {
    const userPublicData = {};

    let uid = userPublic.id;

    // if (!uid) {
    //   // return this.createNewFirebaseUser(userPublic.email, Constants.TEMP_PASSWORD)
    //   //   .then(newUser => {
    //   //     partner.id = newUser.uid;
    //   //     return this.savePartnerUser(partner, userPublic);
    //   //   })
    //   //   .catch(err => {
    //   //     throw new DisplayError('FIREBASE.' + (err as firebase.FirebaseError).code);
    //   //   });
    // } else {
    this.getUser(uid).subscribe(oldUser => {
      if (oldUser.email && oldUser.email !== userPublic.email) {
        // this.getAuthUser();
        return this.afa.authState.map(
          user=>
          user.updateEmail(userPublic.email).then(bool => {
            return this.saveUserPublic(userPublic);
          },
          error => () => {
            throw new Error('Cannot update user email')
          })
          .catch(err => {
            throw new Error(err.message);
          })
        )
      }
    });

    userPublicData['/userPublic/' + uid + '/'] = userPublic;

    return this.afd.object(Constants.APP_STATUS).update(userPublicData);
    //}
  }

  changePassword(email: string, password: ChangePasswordModel): Promise<any> {
    return this.afa.signInWithEmailAndPassword(email,password.currentPassword)
      .then(() => {
        this.afa.authState.map(
          user=>
          user.updatePassword(password.newPassword).then(() => {
        }, error => {
          throw new Error('Cannot update password');
        }))
      }, error => {
        throw new DisplayError('GLOBAL.ACCOUNT_SETTINGS.INCORRECT_CURRENT_PASSWORD')
      })
  }

  // COUNTRY ADMIN USER
  getCountryAdminUser(uid: string): Observable<CountryAdminModel> {
    if (!uid) {
      return null;
    }
    const countryAdminSubscription = this.afd.object(Constants.APP_STATUS + '/administratorCountry/' + uid)
      .snapshotChanges()
      .map(item => {
        if (item.key) {
          return item.payload.val() as CountryAdminModel;
        }
        return null;
      });

    return countryAdminSubscription;
  }

  getCountryAdmin(agencyId: string, countryId: string) : Observable<ModelUserPublic> {
    return this.afd.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + "/" + countryId)
      .valueChanges()
      .flatMap((country: any) => {
        return this.getUser(country.adminId)
      });

  }

  getLocalAgencyAdmin(agencyId: string) : Observable<ModelUserPublic> {
    return this.afd.object(Constants.APP_STATUS + '/agency/' + agencyId)
      .valueChanges()
      .flatMap((localAgency: ModelAgency) => {
        return this.getUser(localAgency.adminId)
      });

  }

  getLocalAgencyAdminUser(uid: string) {
    if (!uid) {
      return null;
    }
    const countryAdminSubscription = this.afd.object(Constants.APP_STATUS + '/administratorLocalAgency/' + uid)
      .snapshotChanges()
      .map(item => {
        if (item.key) {
          return item.payload.val();
        }
        return null;
      });

    return countryAdminSubscription;
  }

  // PARTNER USER
  getPartnerUser(uid: string): Observable<PartnerModel> {
    if (!uid) {
      return null;
    }

    const partnerUserSubscription = this.afd.object(Constants.APP_STATUS + '/partner/' + uid)
      .snapshotChanges()
      .map(item => {
        if (item.key) {
          let partner = new PartnerModel();
          partner.mapFromObject(item.payload.val());
          partner.id = uid;
          return partner;
        }
        return null;
      });

    return partnerUserSubscription;
  }

  getPartnerUsers(agencyId, countryId): Observable<PartnerModel[]> {
    const partnerUsersSubscription = this.afd.list(Constants.APP_STATUS + '/partner')
      .snapshotChanges()
      .map(items => {
        let partners: PartnerModel[] = [];
        items.forEach(item => {

          // Add the organisation ID
          let partner = item.payload.val() as PartnerModel;
          partner.id = item.key;

          partners.push(partner);
        });
        return partners;
      });

    return partnerUsersSubscription;
  }

  getPartnerUserIds(agencyId, countryId): Observable<string[]> {
    return this.afd.list(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/partners')
      .snapshotChanges()
      .map(partners => {
        let partnerIds: string[] = [];
        partners.forEach(partner => {
          partnerIds.push(partner.key);
        });
        return partnerIds;
      })
  }

  getPartnerUserIdsForAgency(agencyId): Observable<string[]> {
    return this.afd.list(Constants.APP_STATUS + '/agency/' + agencyId + '/partners')
      .snapshotChanges()
      .map(partners => {
        let partnerIds: string[] = [];
        partners.forEach(partner => {
          partnerIds.push(partner.key);
        });
        return partnerIds;
      })
  }

  getPartnerUserById(partnerId): Observable<PartnerModel> {
    return this.afd.object(Constants.APP_STATUS + '/partner/' + partnerId)
      .snapshotChanges()
      .map(partner => {
        let user = partner.payload.val() as PartnerModel;
        user.id = partner.key;
        return user;
      });

  }


  getPartnerUsersBy(key: string, value: string): Observable<PartnerModel[]> {
    const partnerUsersSubscription = this.afd.list(Constants.APP_STATUS + '/partner', ref => ref.orderByChild(key).equalTo(value))
      .snapshotChanges()
      .map(items => {
        let partners: PartnerModel[] = [];
        items.forEach(item => {

          // Add the organisation ID
          let partner = item.payload.val() as PartnerModel;
          partner.id = item.key;

          partners.push(partner);
        });
        return partners;
      });

    return partnerUsersSubscription;
  }

  savePartnerUser(systemId: string, agencyId: string, countryId: string, partner: PartnerModel, userPublic: ModelUserPublic, partnerData = {}): Promise<any> {
    let uid = partner.id || userPublic.id;

    if (!uid) {
      return this.createNewFirebaseUser(userPublic.email, Constants.TEMP_PASSWORD)
        .then(newUser => {
          partner.id = newUser.uid;
          return this.savePartnerUser(systemId, agencyId, countryId, partner, userPublic);
        })
        .catch(err => {

          if (err['code'] && err['code'].match(Constants.EMAIL_DUPLICATE_ERROR)) {
            return Promise.reject(err);
          } else {
            return Promise.reject('FIREBASE.' + (err as firebase.FirebaseError).code);
          }
        });
    } else {
      // Check to see the email is changed
      this.getUser(uid).subscribe(oldUser => {
        if (oldUser.email && oldUser.email !== userPublic.email) {
          return this.getPartnerUser(oldUser.id).subscribe(partner => {

            let oldPartner = Object.assign(partner);

            partner.id = null; // force new user creation
            userPublic.id = null;

            return this.savePartnerUser(systemId, agencyId, countryId, partner, userPublic).then(delUser => {
              return this.deletePartnerUser(oldPartner);
            })
              .catch(err => {
                return Promise.reject(err);
              });
          });
        }
      });

      // Check to see the partner organisation is changed
      this.getPartnerUser(uid).subscribe(oldPartner => {
        if (oldPartner.partnerOrganisationId !== partner.partnerOrganisationId
          && !partnerData.hasOwnProperty('/partnerOrganisation/' + oldPartner.partnerOrganisationId + '/partners/' + partner.id)) {
          partnerData['/partnerOrganisation/' + oldPartner.partnerOrganisationId + '/partners/' + partner.id] = null;
          return this.savePartnerUser(systemId, agencyId, countryId, partner, userPublic, partnerData);
        }
      });

      partner.modifiedAt = Date.now();

      //add partnerUser group node

      partnerData['/partnerUser/' + uid + '/systemAdmin/' + systemId] = true;
      partnerData['/partnerUser/' + uid + '/agencies/' + agencyId] = countryId;

      //update country office partners node
      partnerData['/countryOffice/' + agencyId + '/' + countryId + '/partners/' + uid] = true;

      partnerData['/userPublic/' + uid + '/'] = userPublic; // Add the public user profile
      partnerData['/partner/' + uid + '/'] = partner; // Add the partner profile
      partnerData['/partnerOrganisation/' + partner.partnerOrganisationId
      + '/partners/' + partner.id] = true; // add the partner to the partner organisation

      if (partner.hasValidationPermission) {
        partnerData['/partnerOrganisation/' + partner.partnerOrganisationId
        + '/validationPartnerUserId/'] = partner.id; // add the partner who as permission to organisation validationPartnerUserId node
      }

      return this.afd.object(Constants.APP_STATUS).update(partnerData);
    }
  }

  savePartnerUserLocalAgency(systemId: string, agencyId: string, partner: PartnerModel, userPublic: ModelUserPublic, partnerData = {}): Promise<any> {
    let uid = partner.id || userPublic.id;

    if (!uid) {
      return this.createNewFirebaseUser(userPublic.email, Constants.TEMP_PASSWORD)
        .then(newUser => {
          partner.id = newUser.uid;
          return this.savePartnerUserLocalAgency(systemId, agencyId, partner, userPublic);
        })
        .catch(err => {
          if (err['code'] && err['code'].match(Constants.EMAIL_DUPLICATE_ERROR)) {
            return Promise.reject(err);
          } else {
            return Promise.reject('FIREBASE.' + (err as firebase.FirebaseError).code);
          }
        });
    } else {
      // Check to see the email is changed
      this.getUser(uid).subscribe(oldUser => {
        if (oldUser.email && oldUser.email !== userPublic.email) {
          return this.getPartnerUser(oldUser.id).subscribe(partner => {

            let oldPartner = Object.assign(partner);

            partner.id = null; // force new user creation
            userPublic.id = null;

            return this.savePartnerUserLocalAgency(systemId, agencyId, partner, userPublic).then(delUser => {
              return this.deletePartnerUser(oldPartner);
            })
              .catch(err => {
                return Promise.reject(err);
              });
          });
        }
      });

      // Check to see the partner organisation is changed
      this.getPartnerUser(uid).subscribe(oldPartner => {
        if (oldPartner.partnerOrganisationId !== partner.partnerOrganisationId
          && !partnerData.hasOwnProperty('/partnerOrganisation/' + oldPartner.partnerOrganisationId + '/partners/' + partner.id)) {
          partnerData['/partnerOrganisation/' + oldPartner.partnerOrganisationId + '/partners/' + partner.id] = null;
          return this.savePartnerUserLocalAgency(systemId, agencyId, partner, userPublic, partnerData);
        }
      });

      partner.modifiedAt = Date.now();

      //add partnerUser group node

      partnerData['/partnerUser/' + uid + '/systemAdmin/' + systemId] = true;
      partnerData['/partnerUser/' + uid + '/agencies/'] = agencyId;

      //update country office partners node
      partnerData['/agency/' + agencyId + '/partners/' + uid] = true;

      partnerData['/userPublic/' + uid + '/'] = userPublic; // Add the public user profile
      partnerData['/partner/' + uid + '/'] = partner; // Add the partner profile
      partnerData['/partnerOrganisation/' + partner.partnerOrganisationId
      + '/partners/' + partner.id] = true; // add the partner to the partner organisation

      if (partner.hasValidationPermission) {
        partnerData['/partnerOrganisation/' + partner.partnerOrganisationId
        + '/validationPartnerUserId/'] = partner.id; // add the partner who as permission to organisation validationPartnerUserId node
      }

      return this.afd.object(Constants.APP_STATUS).update(partnerData);
    }
  }

  findPartnerId(email) {
    return this.afd.list(Constants.APP_STATUS + "/userPublic", ref => ref.orderByChild('email').equalTo(email))
      .snapshotChanges()
      .flatMap(users => {
        if (users.length > 0) {
          return this.afd.object(Constants.APP_STATUS + "/partner/" + users[0].key).valueChanges()
        } else {
          return EMPTY;
        }
      })
  }

  deletePartnerUser(partner: PartnerModel): Promise<any> {
    const partnerData = {};
    if (!partner) {
      throw new Error('Partner not present');
    }

    partnerData['/userPublic/' + partner.id + '/'] = null; // remove public profile
    partnerData['/partner/' + partner.id + '/'] = null; // remove partner profile
    partnerData['/partnerOrganisation/' + partner.partnerOrganisationId
    + '/partners/' + partner.id] = null; // remove the partner from the partner organisation

    return this.afd.object(Constants.APP_STATUS).update(partnerData);
  }

  // STAFF MEMBER

  getStaffList(countryId: string): Observable<ModelStaff[]> {
    if (!countryId) {
      return;
    }

    const staffListSubscription = this.afd.list(Constants.APP_STATUS + '/staff/' + countryId)
      .snapshotChanges()
      .map(items => {
        let staffList: ModelStaff[] = [];
        items.forEach(item => {

          let staff = new ModelStaff();
          staff.mapFromObject(item.payload.val());
          staff.id = item.key;
          staffList.push(staff);
        });
        return staffList;
      });

    return staffListSubscription;
  }

  getGlobalStaffList(agencyId: string): Observable<ModelStaff[]> {
    if (!agencyId) {
      return;
    }

    const globalStaffListSubscription = this.afd.list(Constants.APP_STATUS + '/staff/globalUser/' + agencyId)
      .snapshotChanges()
      .map(items => {
        let staffList: ModelStaff[] = [];
        items.forEach(item => {

          let staff = new ModelStaff();
          staff.mapFromObject(item.payload.val());
          staff.id = item.key;
          staffList.push(staff);
        });
        return staffList;
      });

    return globalStaffListSubscription;
  }

  getStaff(countryId: string, staffId: string): Observable<ModelStaff> {
    if (!countryId || !staffId) {
      return;
    }

    const staffSubscription = this.afd.object(Constants.APP_STATUS + '/staff/' + countryId + '/' + staffId)
      .snapshotChanges()
      .map(item => {

        let staff = new ModelStaff();
        staff.mapFromObject(item.payload.val());
        staff.id = item.key;

        return staff;
      });

    return staffSubscription;

  }

  /**
   * Static method for getting the user type
   */
  static getUserType(afd: AngularFireDatabase  , uid: string): Observable<any> {
    const paths = [
      {path: Constants.APP_STATUS + "/administratorCountry/" + uid, type: UserType.CountryAdmin},
      {path: Constants.APP_STATUS + "/countryDirector/" + uid, type: UserType.CountryDirector},
      {path: Constants.APP_STATUS + "/regionDirector/" + uid, type: UserType.RegionalDirector},
      {path: Constants.APP_STATUS + "/globalDirector/" + uid, type: UserType.GlobalDirector},
      {path: Constants.APP_STATUS + "/globalUser/" + uid, type: UserType.GlobalUser},
      {path: Constants.APP_STATUS + "/countryUser/" + uid, type: UserType.CountryUser},
      {path: Constants.APP_STATUS + "/ertLeader/" + uid, type: UserType.ErtLeader},
      {path: Constants.APP_STATUS + "/ert/" + uid, type: UserType.Ert},
      {path: Constants.APP_STATUS + "/donor/" + uid, type: UserType.Donor},
      {path: Constants.APP_STATUS + "/partnerUser/" + uid, type: UserType.PartnerUser},
      {path: Constants.APP_STATUS + "/localAgencyDirector/" + uid, type: UserType.LocalAgencyDirector}
      // {path: Constants.APP_STATUS + "/administratorAgency/" + uid, type: UserType.AgencyAdmin}
    ];
    // Check if it's a system admin
    return afd.object(Constants.APP_STATUS + "/system/" + uid) //, {preserveSnapshot: true})
      .snapshotChanges()
      .flatMap((snap) => {
        if (snap.payload.val() != null) {
          return observableOf(UserType.SystemAdmin);
        }
        else {
          return afd.object(Constants.APP_STATUS + "/localAgencyDirector/" + uid) //, {preserveSnapshot: true})
            .snapshotChanges()
            .flatMap((mySnap) => {
              if (mySnap.payload.val() != null) {

                return observableOf(UserType.LocalAgencyDirector);

              }
              else {

                return afd.object(Constants.APP_STATUS + "/administratorLocalAgency/" + uid) //, {preserveSnapshot: true})
                  .snapshotChanges()
                .flatMap((mySnap) => {
                  if (mySnap.payload.val() != null) {

                    return observableOf(UserType.LocalAgencyAdmin);

                  }else{


                    //TODO: for this to work we need to push the local agency admins to /administratorLocalAgency when creating the local agency within system admin.
                    return afd.object(Constants.APP_STATUS + "/administratorAgency/" + uid) //, {preserveSnapshot: true})
                      .snapshotChanges()
                      .flatMap((snap) => {
                        if (snap.payload.val() != null) {
                          return observableOf(UserType.AgencyAdmin);
                        } else {
                          return UserService.recursiveUserMap(afd, paths, 0);
                        }
                      })
                    }
                  })
              }
            });
        }
      });
  }

  private static recursiveUserMap(afd: AngularFireDatabase, paths, index: number) {
    if (index == paths.length) {
      return observableOf(null);
    }
    return afd.object(paths[index].path)
      .valueChanges()
      .flatMap((obj: any) => {
        if (obj.systemAdmin) {
          return observableOf(paths[index].type);
        }
        else {
          return UserService.recursiveUserMap(afd, paths, index + 1);
        }
      });
  }

  //return current user type enum number
  // TODO: Do this recursively!
  getUserType(uid: string): Observable<any> {

    const paths = [
      {path: Constants.APP_STATUS + "/administratorCountry/" + uid, type: UserType.CountryAdmin},
      {path: Constants.APP_STATUS + "/countryDirector/" + uid, type: UserType.CountryDirector},
      {path: Constants.APP_STATUS + "/regionDirector/" + uid, type: UserType.RegionalDirector},
      {path: Constants.APP_STATUS + "/globalDirector/" + uid, type: UserType.GlobalDirector},
      {path: Constants.APP_STATUS + "/globalUser/" + uid, type: UserType.GlobalUser},
      {path: Constants.APP_STATUS + "/countryUser/" + uid, type: UserType.CountryUser},
      {path: Constants.APP_STATUS + "/ertLeader/" + uid, type: UserType.ErtLeader},
      {path: Constants.APP_STATUS + "/ert/" + uid, type: UserType.Ert},
      {path: Constants.APP_STATUS + "/donor/" + uid, type: UserType.Donor},
      {path: Constants.APP_STATUS + "/partnerUser/" + uid, type: UserType.PartnerUser}
      // {path: Constants.APP_STATUS + "/administratorAgency/" + uid, type: UserType.AgencyAdmin}
    ];

    if (!uid) {
      return null;
    }

    return this.afd.object(Constants.APP_STATUS + "/system/" + uid) //, {preserveSnapshot: true})
      .snapshotChanges()
      .flatMap((snap) => {
        if (snap.payload.val() != null) {
          return observableOf(UserType.SystemAdmin);
        }
        else {
          return this.afd.object(Constants.APP_STATUS + "/administratorLocalAgency/" + uid) //, {preserveSnapshot: true})
            .snapshotChanges()
            .flatMap((mySnap) => {

              if (mySnap.payload.val() != null) {
                return observableOf(UserType.AgencyAdmin);
              }
              else {

                return this.afd.object(Constants.APP_STATUS + "/administratorAgency/" + uid) //, {preserveSnapshot: true})
                  .snapshotChanges()
                  .flatMap((snap) => {
                    if (snap.payload.val() != null) {
                      return observableOf(UserType.AgencyAdmin);
                    } else {
                      return UserService.recursiveUserMap(this.afd, paths, 0);
                    }
                  })

              }
            });
        }
      });
  }

  //get user country id
  getCountryId(userType: string, uid): Observable<string> {
    return this.afd.object(Constants.APP_STATUS + "/" + userType + "/" + uid + "/countryId")
      .valueChanges()
      .map((countryId: string | null) => {
        if (countryId) {
          return countryId
        }
      });
  }

  getAgencyId(userType: string, uid): Observable<string> {
    if (userType == "administratorAgency") {
      return this.afd.object(Constants.APP_STATUS + "/administratorAgency/" + uid + '/agencyId')
        .valueChanges()
        .map((agencyId: string) => {
          return agencyId;
        });
    } else {
      return this.afd.list(Constants.APP_STATUS + "/" + userType + "/" + uid + '/agencyAdmin')
        .snapshotChanges()
        .map((agencyIds: SnapshotAction<string>[]) => {
          if (agencyIds.length > 0 && agencyIds[0].payload.val()) {
            return agencyIds[0].key;
          }
        });
    }
  }

  getSystemAdminId(userType: string, uid): Observable<string> {
    let subscription = this.afd.list(Constants.APP_STATUS + "/" + userType + "/" + uid + '/systemAdmin')
      .snapshotChanges()
      .map(systemIds => {
        if (systemIds.length > 0 && systemIds[0].payload.val()) {
          return systemIds[0].key;
        }
      });
    return subscription;
  }

  // Get region id os the regional director
  getRegionId(userType: string, uid): Observable<string> {
    return this.afd.object(Constants.APP_STATUS + "/" + userType + "/" + uid + "/regionId")
      .valueChanges()
      .map((regionId: string | null) => {
        if (regionId) {
          return regionId
        }
      });
  }

  getAllCountryIdsForAgency(agencyId: string): Observable<any> {
    return this.afd.list(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .snapshotChanges()
      .map(countries => {
        let countryIds = [];
        countries.forEach(country => {
          countryIds.push(country.key);
        });
        return countryIds;
      })
  }

  getAllCountryOfficesForAgency(agencyId: string): Observable<any> {
    return this.afd.list(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .valueChanges()
      .map(countries => {
        let countryOffices = [];
        countries.forEach(country => {
          countryOffices.push(country);
        });
        return countryOffices;
      })
  }

  getAllCountryAlertLevelsForAgency(agencyId: string): Observable<any> {
    return this.afd.list(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .snapshotChanges()
      .map((countries: SnapshotAction<any>[]) => {
        let countryAlertLevels = [];
        countries.forEach(country => {
          countryAlertLevels[country.key] = country.payload.val().alertLevel;
        });
        return countryAlertLevels;
      })
  }

  getOrganisationName(id) {
    return this.afd.object(Constants.APP_STATUS + "/partnerOrganisation/" + id)
  }

  getCountryDetail(countryId, agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId);
  }

  getAgencyDetail(agencyId) {
    return this.afd.object<ModelAgency>(Constants.APP_STATUS + "/agency/" + agencyId);
  }

  getNetworkAdminDetail(networkId) {
    return this.afd.object(Constants.APP_STATUS + "/network/" + networkId);
  }

  getNetworkCountryDetail(networkId, networkCountryId) {
    return this.afd.object(Constants.APP_STATUS + "/networkCountry/" + networkId + "/" + networkCountryId);
  }


  getAgencyModel(agencyId) {
    return this.afd.object(Constants.APP_STATUS + "/agency/" + agencyId)
      .snapshotChanges()
      .map(agency => {
        let model = new ModelAgency(null);
        model.mapFromObject(agency.payload.val());
        model.id = agency.key;
        return model;
      });
  }

  checkFirstLoginRegular(uid, type) {
    return this.afd.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[type] + "/" + uid)
      .valueChanges()
      .map((user: any) => {
        return user.firstLogin ? user.firstLogin : false;
      });
  }

  getUserName(uid): Observable<string> {
    return this.getUser(uid).pipe(
      map(user => {
        return user.firstName + " " + user.lastName;
      }));
  }

  logout() {
    return this.afa.signOut();
  }

  saveUserNetworkSelection(uid, userType, networkId) {
    return this.afd.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid + "/selectedNetwork").set(networkId);
  }

  deleteUserNetworkSelection(uid, userType) {
    return this.afd.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid + "/selectedNetwork").remove();
  }

  getUserNetworkSelection(uid, userType) {
    return this.afd.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid + "/selectedNetwork")
      .valueChanges()
      .map(selectedObj => {
        if (selectedObj) {
          return selectedObj;
        }
      })
  }

  getSkill(skillId) {
    return this.afd.object(Constants.APP_STATUS + "/skill/" + skillId)
  }

  getCountryAdminOrLocalAgencyAdmin(agencyId:string, countryId?:string) : Observable<ModelUserPublic> {
    return countryId ? this.getCountryAdmin(agencyId, countryId) : this.getLocalAgencyAdmin(agencyId)
  }

}
