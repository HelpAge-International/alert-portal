import {Injectable} from '@angular/core';
import {AngularFire, AuthMethods, AuthProviders, FirebaseAuthState} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable, Subject} from 'rxjs';
import {firebaseConfig} from '../app.module';
import {UUID} from '../utils/UUID';
import * as firebase from "firebase";

import {CountryAdminModel} from "../model/country-admin.model";
import {PartnerModel} from "../model/partner.model";
import {ModelUserPublic} from "../model/user-public.model";
import {DisplayError} from "../errors/display.error";
import {UserType} from "../utils/Enums";
import {Subscription} from "rxjs/Subscription";
import {ChangePasswordModel} from "../model/change-password.model";
import {recognize} from "@angular/router/src/recognize";
import {ModelStaff} from "../model/staff.model";
import {subscribeOn} from "rxjs/operator/subscribeOn";
import {ModelAgency} from "../model/agency.model";
import * as XLSX from "xlsx";
import * as moment from "moment";

@Injectable()
export class UserService {
  private secondApp: firebase.app.App;
  public anonymousUserPath: any;

  public user: ModelUserPublic;
  public partner: PartnerModel;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire) {
    this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
  }

  releaseAll() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // FIREBASE
  createNewFirebaseUser(email: string, password: string): firebase.Promise<any> {
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
    const userSubscription = this.af.database.object(Constants.APP_STATUS + '/userPublic/' + uid)
      .map(user => {
        if (user.$key) {
          let userPublic = new ModelUserPublic(null, null, null, null);
          userPublic.id = uid;
          userPublic.mapFromObject(user);

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
    const userSubscription = this.af.database.list(Constants.APP_STATUS + '/userPublic', {
      query: {
        orderByChild: "email",
        equalTo: email
      }
    })
      .first()
      .map(item => {
        if (item.length > 0) {
          let userPublic = new ModelUserPublic(null, null, null, null);
          userPublic.id = item[0].$key;
          userPublic.mapFromObject(item[0]);
          return userPublic;
        } else {
          return null;
        }
      });

    return userSubscription;
  }

  saveUserPublic(userPublic: ModelUserPublic, authState: FirebaseAuthState): firebase.Promise<any> {
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
        return authState.auth.updateEmail(userPublic.email).then(bool => {
            return this.saveUserPublic(userPublic, authState);
          },
          error => () => {
            throw new Error('Cannot update user email')
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }
    });

    userPublicData['/userPublic/' + uid + '/'] = userPublic;

    return this.af.database.object(Constants.APP_STATUS).update(userPublicData);
    //}
  }

  changePassword(email: string, password: ChangePasswordModel, authState: FirebaseAuthState): firebase.Promise<any> {
    return this.af.auth.login({
        email: email,
        password: password.currentPassword
      },
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password,
      })
      .then(() => {
        authState.auth.updatePassword(password.newPassword).then(() => {
        }, error => {
          throw new Error('Cannot update password');
        });
      }, error => {
        throw new DisplayError('GLOBAL.ACCOUNT_SETTINGS.INCORRECT_CURRENT_PASSWORD')
      })
  }

  // COUNTRY ADMIN USER
  getCountryAdminUser(uid: string): Observable<CountryAdminModel> {
    if (!uid) {
      return null;
    }
    const countryAdminSubscription = this.af.database.object(Constants.APP_STATUS + '/administratorCountry/' + uid)
      .map(item => {
        if (item.$key) {
          return item as CountryAdminModel;
        }
        return null;
      });

    return countryAdminSubscription;
  }

  getCountryAdmin(agencyId: string, countryId: string) : Observable<ModelUserPublic> {
    return this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + "/" + countryId)
      .flatMap(country => {
        return this.getUser(country.adminId)
      });

  }

  getLocalAgencyAdminUser(uid: string) {
    if (!uid) {
      return null;
    }
    const countryAdminSubscription = this.af.database.object(Constants.APP_STATUS + '/administratorLocalAgency/' + uid)
      .map(item => {
        if (item.$key) {
          return item;
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

    const partnerUserSubscription = this.af.database.object(Constants.APP_STATUS + '/partner/' + uid)
      .map(item => {
        if (item.$key) {
          let partner = new PartnerModel();
          partner.mapFromObject(item);
          partner.id = uid;
          return partner;
        }
        return null;
      });

    return partnerUserSubscription;
  }

  getPartnerUsers(agencyId, countryId): Observable<PartnerModel[]> {
    const partnerUsersSubscription = this.af.database.list(Constants.APP_STATUS + '/partner')
      .map(items => {
        let partners: PartnerModel[] = [];
        items.forEach(item => {

          // Add the organisation ID
          let partner = item as PartnerModel;
          partner.id = item.$key;

          partners.push(partner);
        });
        return partners;
      });

    return partnerUsersSubscription;
  }

  getPartnerUserIds(agencyId, countryId): Observable<string[]> {
    return this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/partners')
      .map(partners => {
        let partnerIds = [];
        partners.forEach(partner => {
          partnerIds.push(partner.$key);
        });
        return partnerIds;
      })
  }

  getPartnerUserIdsForAgency(agencyId): Observable<string[]> {
    return this.af.database.list(Constants.APP_STATUS + '/agency/' + agencyId + '/partners')
      .map(partners => {
        let partnerIds = [];
        partners.forEach(partner => {
          partnerIds.push(partner.$key);
        });
        return partnerIds;
      })
  }

  getPartnerUserById(partnerId): Observable<PartnerModel> {
    return this.af.database.object(Constants.APP_STATUS + '/partner/' + partnerId)
      .map(partner => {
        let user = partner as PartnerModel;
        user.id = partner.$key;
        return user;
      });

  }


  getPartnerUsersBy(key: string, value: string): Observable<PartnerModel[]> {
    const partnerUsersSubscription = this.af.database.list(Constants.APP_STATUS + '/partner', {
      query: {
        orderByChild: key,
        equalTo: value
      }
    })
      .map(items => {
        let partners: PartnerModel[] = [];
        items.forEach(item => {

          // Add the organisation ID
          let partner = item as PartnerModel;
          partner.id = item.$key;

          partners.push(partner);
        });
        return partners;
      });

    return partnerUsersSubscription;
  }

  savePartnerUser(systemId: string, agencyId: string, countryId: string, partner: PartnerModel, userPublic: ModelUserPublic, partnerData = {}): firebase.Promise<any> {
    let uid = partner.id || userPublic.id;

    if (!uid) {
      return this.createNewFirebaseUser(userPublic.email, Constants.TEMP_PASSWORD)
        .then(newUser => {
          partner.id = newUser.uid;
          return this.savePartnerUser(systemId, agencyId, countryId, partner, userPublic);
        })
        .catch(err => {
          // console.log((err as firebase.FirebaseError).code)
          // console.log(err.message)
          if (err['code'] && err['code'].match(Constants.EMAIL_DUPLICATE_ERROR)) {
            // console.log('email in use')
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
                return firebase.Promise.reject(err);
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

      console.log(partnerData);
      return this.af.database.object(Constants.APP_STATUS).update(partnerData);
    }
  }

  savePartnerUserLocalAgency(systemId: string, agencyId: string, partner: PartnerModel, userPublic: ModelUserPublic, partnerData = {}): firebase.Promise<any> {
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
                return firebase.Promise.reject(err);
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

      console.log(partnerData);
      return this.af.database.object(Constants.APP_STATUS).update(partnerData);
    }
  }

  findPartnerId(email) {
    return this.af.database.list(Constants.APP_STATUS + "/userPublic", {
      query: {
        orderByChild: "email",
        equalTo: email
      }
    })
      .flatMap(users => {
        if (users.length > 0) {
          return this.af.database.object(Constants.APP_STATUS + "/partner/" + users[0].$key, {preserveSnapshot: true})
        } else {
          return Observable.empty;
        }
      })
  }

  deletePartnerUser(partner: PartnerModel): firebase.Promise<any> {
    const partnerData = {};
    if (!partner) {
      throw new Error('Partner not present');
    }

    partnerData['/userPublic/' + partner.id + '/'] = null; // remove public profile
    partnerData['/partner/' + partner.id + '/'] = null; // remove partner profile
    partnerData['/partnerOrganisation/' + partner.partnerOrganisationId
    + '/partners/' + partner.id] = null; // remove the partner from the partner organisation

    return this.af.database.object(Constants.APP_STATUS).update(partnerData);
  }

  // STAFF MEMBER

  getStaffList(countryId: string): Observable<ModelStaff[]> {
    if (!countryId) {
      return;
    }

    const staffListSubscription = this.af.database.list(Constants.APP_STATUS + '/staff/' + countryId)
      .map(items => {
        let staffList: ModelStaff[] = [];
        items.forEach(item => {

          let staff = new ModelStaff();
          staff.mapFromObject(item);
          staff.id = item.$key;
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

    const globalStaffListSubscription = this.af.database.list(Constants.APP_STATUS + '/staff/globalUser/' + agencyId)
      .map(items => {
        let staffList: ModelStaff[] = [];
        items.forEach(item => {

          let staff = new ModelStaff();
          staff.mapFromObject(item);
          staff.id = item.$key;
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

    const staffSubscription = this.af.database.object(Constants.APP_STATUS + '/staff/' + countryId + '/' + staffId)
      .map(item => {

        let staff = new ModelStaff();
        staff.mapFromObject(item);
        staff.id = item.$key;

        return staff;
      });

    return staffSubscription;

  }

  /**
   * Static method for getting the user type
   */
  static getUserType(af: AngularFire, uid: string): Observable<any> {
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
    return af.database.object(Constants.APP_STATUS + "/system/" + uid, {preserveSnapshot: true})
      .flatMap((snap) => {
        if (snap.val() != null) {
          return Observable.of(UserType.SystemAdmin);
        }
        else {
          console.log(uid)
          return af.database.object(Constants.APP_STATUS + "/administratorLocalAgency/" + uid, {preserveSnapshot: true})
            .flatMap((mySnap) => {
              if (mySnap.val() != null) {

                console.log('local agency return')

                return Observable.of(UserType.LocalAgencyAdmin);

              }
              else {

                //TODO: for this to work we need to push the local agency admins to /administratorLocalAgency when creating the local agency within system admin.
                return af.database.object(Constants.APP_STATUS + "/administratorAgency/" + uid, {preserveSnapshot: true})
                  .flatMap((snap) => {
                    if (snap.val() != null) {
                      console.log('agency return')
                      return Observable.of(UserType.AgencyAdmin);
                    } else {
                      console.log('returning the other thing')
                      return UserService.recursiveUserMap(af, paths, 0);
                    }
                  })
              }
            });
        }
      });
  }

  private static recursiveUserMap(af: AngularFire, paths, index: number) {
    if (index == paths.length) {
      return Observable.of(null);
    }
    return af.database.object(paths[index].path)
      .flatMap(obj => {
        if (obj.systemAdmin) {
          return Observable.of(paths[index].type);
        }
        else {
          return UserService.recursiveUserMap(af, paths, index + 1);
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

    return this.af.database.object(Constants.APP_STATUS + "/system/" + uid, {preserveSnapshot: true})
      .flatMap((snap) => {
        if (snap.val() != null) {
          return Observable.of(UserType.SystemAdmin);
        }
        else {
          return this.af.database.object(Constants.APP_STATUS + "/administratorLocalAgency/" + uid, {preserveSnapshot: true})
            .flatMap((mySnap) => {

              if (mySnap.val() != null) {
                return Observable.of(UserType.AgencyAdmin);
              }
              else {

                return this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + uid, {preserveSnapshot: true})
                  .flatMap((snap) => {
                    if (snap.val() != null) {
                      return Observable.of(UserType.AgencyAdmin);
                    } else {
                      return UserService.recursiveUserMap(this.af, paths, 0);
                    }
                  })

              }
            });
        }
      });
  }

  //get user country id
  getCountryId(userType: string, uid): Observable<string> {
    return this.af.database.object(Constants.APP_STATUS + "/" + userType + "/" + uid + "/countryId")
      .map(countryId => {
        if (countryId.$value) {
          return countryId.$value
        }
      });
  }

  getAgencyId(userType: string, uid): Observable<string> {
    if (userType == "administratorAgency") {
      return this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + uid + '/agencyId')
        .map(agencyId => {
          return agencyId.$value;
        });
    } else {
      return this.af.database.list(Constants.APP_STATUS + "/" + userType + "/" + uid + '/agencyAdmin')
        .map(agencyIds => {
          if (agencyIds.length > 0 && agencyIds[0].$value) {
            return agencyIds[0].$key;
          }
        });
    }
  }

  getSystemAdminId(userType: string, uid): Observable<string> {
    console.log(Constants.APP_STATUS + "/" + userType + "/" + uid + '/systemAdmin')
    let subscription = this.af.database.list(Constants.APP_STATUS + "/" + userType + "/" + uid + '/systemAdmin')
      .map(systemIds => {
        if (systemIds.length > 0 && systemIds[0].$value) {
          return systemIds[0].$key;
        }
      });
    return subscription;
  }

  // Get region id os the regional director
  getRegionId(userType: string, uid): Observable<string> {
    return this.af.database.object(Constants.APP_STATUS + "/" + userType + "/" + uid + "/regionId")
      .map(regionId => {
        if (regionId.$value) {
          return regionId.$value
        }
      });
  }

  getAllCountryIdsForAgency(agencyId: string): Observable<any> {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .map(countries => {
        let countryIds = [];
        countries.forEach(country => {
          countryIds.push(country.$key);
        });
        return countryIds;
      })
  }

  getAllCountryOfficesForAgency(agencyId: string): Observable<any> {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .map(countries => {
        let countryOffices = [];
        countries.forEach(country => {
          countryOffices.push(country);
        });
        return countryOffices;
      })
  }

  getAllCountryAlertLevelsForAgency(agencyId: string): Observable<any> {
    return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyId)
      .map(countries => {
        let countryAlertLevels = [];
        countries.forEach(country => {
          countryAlertLevels[country.$key] = country.alertLevel;
        });
        return countryAlertLevels;
      })
  }

  getOrganisationName(id) {
    return this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + id)
  }

  getCountryDetail(countryId, agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId);
  }

  getAgencyDetail(agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId);
  }

  getAgencyModel(agencyId) {
    return this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId)
      .map(agency => {
        let model = new ModelAgency(null);
        model.mapFromObject(agency);
        model.id = agency.$key;
        return model;
      });
  }

  checkFirstLoginRegular(uid, type) {
    return this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[type] + "/" + uid)
      .map(user => {
        return user.firstLogin ? user.firstLogin : false;
      });
  }

  getUserName(uid): Observable<string> {
    return this.getUser(uid)
      .map(user => {
        return user.firstName + " " + user.lastName;
      });
  }

  logout() {
    return this.af.auth.logout();
  }

  saveUserNetworkSelection(uid, userType, networkId) {
    return this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid + "/selectedNetwork").set(networkId);
  }

  deleteUserNetworkSelection(uid, userType) {
    return this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid + "/selectedNetwork").remove();
  }

  getUserNetworkSelection(uid, userType) {
    return this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid + "/selectedNetwork")
      .map(selectedObj => {
        if (selectedObj.$value) {
          return selectedObj.$value;
        }
      })
  }

  getSkill(skillId) {
    return this.af.database.object(Constants.APP_STATUS + "/skill/" + skillId)
  }
}
