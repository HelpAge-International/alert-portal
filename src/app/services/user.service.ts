import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Constants} from '../utils/Constants';
import {RxHelper} from '../utils/RxHelper';
import {Observable} from 'rxjs';
import {firebaseConfig} from '../app.module';
import {UUID} from '../utils/UUID';
import * as firebase from "firebase";

import { CountryAdminModel } from "../model/country-admin.model";
import { PartnerModel } from "../model/partner.model";
import { ModelUserPublic } from "../model/user-public.model";

@Injectable()
export class UserService {
  
  private secondApp: firebase.app.App;

  constructor(private af: AngularFire, private subscriptions: RxHelper) {
    this.secondApp = firebase.initializeApp(firebaseConfig, UUID.createUUID());
  }

  getAuthUser(): Observable<firebase.User> {
    const userAuthSubscription = this.af.auth.map(user => {
      return user.auth;
    });

    return userAuthSubscription;
  }

  createNewFirebaseUser(email: string, password: string): firebase.Promise<any> {
    return this.secondApp.auth().createUserWithEmailAndPassword(email, password)
                .then(newUser => { this.secondApp.auth().signOut(); return } );
  }

  getCountryAdminUser(uid: string): Observable<CountryAdminModel> {
    const countryAdminSubscription = this.af.database.object(Constants.APP_STATUS + '/administratorCountry/' + uid)
      .map(item =>
        {
            return item as CountryAdminModel;
        });

    return countryAdminSubscription;
  }

  savePartnerUser(partner: PartnerModel, userPublic: ModelUserPublic): firebase.Promise<any> {
    const partnerData = {};

    let uid = partner.id || userPublic.id;

    partner.id = null;
    userPublic.id = null;

    partnerData['/userPublic/' + uid + '/'] = userPublic;
    partnerData['/partner/' + uid + '/'] = partner;

    return this.af.database.object(Constants.APP_STATUS).update(partnerData);
  }
}