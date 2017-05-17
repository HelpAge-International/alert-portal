import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
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

@Injectable()
export class UserService {
  private secondApp: firebase.app.App;

  public user: ModelUserPublic;
  public partner: PartnerModel;

  constructor(private af: AngularFire, private subscriptions: RxHelper) {
    this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
  }

  // FIREBASE
  getAuthUser(): Observable<firebase.User> {
    const userAuthSubscription = this.af.auth.map(user => {
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
    if(!email) { return null };
    const userSubscription = this.af.database.list(Constants.APP_STATUS + '/userPublic', {
        query: {
          orderByChild: "email",
          equalTo: email
        }
      })
      .first()
      .map(item => {
        if(item.length > 0){
          let userPublic = new ModelUserPublic(null, null, null, null);
          userPublic.id = item.$key;
          userPublic.mapFromObject(item);
          return userPublic;
        }else{
          return null;
        }
      });

    return userSubscription;
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

  savePartnerUser(partner: PartnerModel, userPublic: ModelUserPublic): firebase.Promise<any> {
    const partnerData = {};

    let uid = partner.id || userPublic.id;

    console.log(partner);

    if (!uid) {
      return this.createNewFirebaseUser(userPublic.email, Constants.TEMP_PASSWORD)
        .then(newUser => {
          partner.id = newUser.uid;
          return this.savePartnerUser(partner, userPublic);
        })
        .catch(err => {
          throw new DisplayError('FIREBASE.' + (err as firebase.FirebaseError).code);
        });
    } else {
      this.getUser(uid).subscribe(oldUser => {
        if (oldUser.email && oldUser.email !== userPublic.email) {
          return this.deletePartnerUser(uid).then(bool => {
            if (bool) {
              partner.id = null; // force new user creation
              return this.savePartnerUser(partner, userPublic);
            }
          })
            .catch(err => {
              throw new Error(err.message);
            });
        }
      })
      
      partnerData['/userPublic/' + uid + '/'] = userPublic;
      partnerData['/partner/' + uid + '/'] = partner;
      return this.af.database.object(Constants.APP_STATUS).update(partnerData);

    }
  }

  deletePartnerUser(uid: string): firebase.Promise<any> {
    const partnerData = {};

    if (!uid) {
      throw new Error('User id not present');
    }

    partnerData['/userPublic/' + uid + '/'] = null;
    partnerData['/partner/' + uid + '/'] = null;

    return this.af.database.object(Constants.APP_STATUS).update(partnerData);
  }

  //return current user type enum number
  getUserType(uid: string): Observable<any> {
    const paths = [Constants.APP_STATUS + "/administratorCountry", Constants.APP_STATUS + "/directorCountry",
      Constants.APP_STATUS + "/directorRegion"];
    if (!uid) {
      return null;
    }
    const userTypeSubscription = this.af.database.object(paths[0])
      .flatMap(adminCountry => {
        if (adminCountry.$key) {
          return Observable.of(UserType.CountryAdmin);
        } else {
          this.af.database.object(paths[1])
            .flatMap(directorCountry => {
              if (directorCountry.$key) {
                return Observable.of(UserType.CountryDirector);
              } else {
                this.af.database.object(paths[2])
                  .flatMap(regionDirector => {
                    if (regionDirector.$key) {
                      return Observable.of(UserType.RegionalDirector);
                    } else {
                      return Observable.empty();
                    }
                  })
              }
            });
        }
      });
    return userTypeSubscription;
  }
}
