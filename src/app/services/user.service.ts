import {Injectable} from '@angular/core';
import {AngularFire, FirebaseAuthState, AuthProviders, AuthMethods} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable} from 'rxjs';
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

@Injectable()
export class UserService {
  private secondApp: firebase.app.App;
  private authState: FirebaseAuthState;

  public user: ModelUserPublic;
  public partner: PartnerModel;

  constructor(private af: AngularFire) {
    this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
  }

  // FIREBASE
  getAuthUser(): Observable<firebase.User> {
    const userAuthSubscription = this.af.auth.map(user => {
      this.authState = user;
      return user.auth;
    });

    return userAuthSubscription;
  }

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
    ;
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
          userPublic.id = item.$key;
          userPublic.mapFromObject(item);
          return userPublic;
        } else {
          return null;
        }
      });

    return userSubscription;
  }

  saveUserPublic(userPublic: ModelUserPublic): firebase.Promise<any> {
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
        this.getAuthUser();
        return this.authState.auth.updateEmail(userPublic.email).then(bool => {
            return this.saveUserPublic(userPublic);
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

  changePassword(email: string, password: ChangePasswordModel): firebase.Promise<any> {
    return this.af.auth.login({
        email: email,
        password: password.currentPassword
      },
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password,
      })
      .then(() => {
        this.authState.auth.updatePassword(password.newPassword).then(() => {
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

  getPartnerUsers(): Observable<PartnerModel[]> {
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

  savePartnerUser(partner: PartnerModel, userPublic: ModelUserPublic, partnerData = {}): firebase.Promise<any> {
    let uid = partner.id || userPublic.id;

    if (!uid) {
      return this.createNewFirebaseUser(userPublic.email, Constants.TEMP_PASSWORD)
        .then(newUser => {
          partner.id = newUser.uid;
          return this.savePartnerUser(partner, userPublic);
        })
        .catch(err => {
          return Promise.reject('FIREBASE.' + (err as firebase.FirebaseError).code);
        });
    } else {
      // Check to see the email is changed
      this.getUser(uid).subscribe(oldUser => {
        if (oldUser.email && oldUser.email !== userPublic.email) {
          return this.getPartnerUser(oldUser.id).subscribe(partner => {

            let oldPartner = Object.assign(partner);

            partner.id = null; // force new user creation
            userPublic.id = null;

            return this.savePartnerUser(partner, userPublic).then(delUser => {
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
          return this.savePartnerUser(partner, userPublic, partnerData);
        }
      });

      partner.modifiedAt = Date.now();

      partnerData['/userPublic/' + uid + '/'] = userPublic; // Add the public user profile
      partnerData['/partner/' + uid + '/'] = partner; // Add the partner profile
      partnerData['/partnerOrganisation/' + partner.partnerOrganisationId
      + '/partners/' + partner.id] = true; // add the partner to the partner organisation

      return this.af.database.object(Constants.APP_STATUS).update(partnerData);
    }
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

  //return current user type enum number
  getUserType(uid: string): Observable<any> {

    const paths = [Constants.APP_STATUS + "/administratorCountry/" + uid, Constants.APP_STATUS + "/countryDirector/" + uid,
      Constants.APP_STATUS + "/regionDirector/" + uid, Constants.APP_STATUS + "/globalDirector/" + uid,
      Constants.APP_STATUS + "/globalUser/" + uid, Constants.APP_STATUS + "/countryUser/" + uid, Constants.APP_STATUS + "/ertLeader/" + uid,
      Constants.APP_STATUS + "/ert/" + uid];

    if (!uid) {
      return null;
    }
    const userTypeSubscription = this.af.database.object(paths[0])
      .flatMap(adminCountry => {
        if (adminCountry.agencyAdmin) {
          return Observable.of(UserType.CountryAdmin);
        } else {
          return this.af.database.object(paths[1])
            .flatMap(directorCountry => {
              if (directorCountry.agencyAdmin) {
                return Observable.of(UserType.CountryDirector);
              } else {
                return this.af.database.object(paths[2])
                  .flatMap(regionDirector => {
                    if (regionDirector.agencyAdmin) {
                      return Observable.of(UserType.RegionalDirector);
                    } else {
                      return this.af.database.object(paths[3])
                        .flatMap(globalDirector => {
                          if (globalDirector.agencyAdmin) {
                            return Observable.of(UserType.GlobalDirector);
                          } else {
                            return this.af.database.object(paths[4])
                              .flatMap(globalUser => {
                                if (globalUser.agencyAdmin) {
                                  return Observable.of(UserType.GlobalUser);
                                } else {
                                  return this.af.database.object(paths[5])
                                    .flatMap(countryUser => {
                                      if (countryUser.agencyAdmin) {
                                        return Observable.of(UserType.CountryUser);
                                      } else {
                                        return this.af.database.object(paths[6])
                                          .flatMap(ertLeader => {
                                            if (ertLeader.agencyAdmin) {
                                              return Observable.of(UserType.ErtLeader);
                                            } else {
                                              return this.af.database.object(paths[7])
                                                .flatMap(ert => {
                                                  if (ert.agencyAdmin) {
                                                    return Observable.of(UserType.Ert);
                                                  } else {
                                                    return Observable.empty();
                                                  }
                                                });
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                          }
                        });
                    }
                  })
              }
            });
        }
      });
    return userTypeSubscription;
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

  getAgencyId(userType, uid): Observable<string> {
    let subscription = this.af.database.list(Constants.APP_STATUS + "/" + userType + "/" + uid + '/agencyAdmin')
      .map(agencyIds => {
        if (agencyIds.length > 0 && agencyIds[0].$value) {
          return agencyIds[0].$key;
        }
      });
    return subscription;
  }

  getSystemAdminId(userType, uid): Observable<string> {
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
}
