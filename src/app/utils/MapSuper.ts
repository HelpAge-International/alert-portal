import {Component, OnInit, OnDestroy} from '@angular/core';
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {RxHelper} from "../utils/RxHelper";
import {} from '@types/googlemaps';
import {ModelAdministratorCountry} from "../model/administrator.country.model";
import {ModelCountryOffice} from "../model/countryoffice.model";
import {ModelHazard} from "../model/hazard.model";
import {HazardScenario} from "../utils/Enums";
import {HazardImages} from "../utils/HazardImages";
import Marker = google.maps.Marker;
import {FirebaseWrapper, SubscriptionHandler} from "./SubscriptionHandler";
import {forEach} from "@angular/router/src/utils/collection";
/**
 * Created by jordan on 05/05/2017.
 */

export class SuperMapComponents {

  private af: AngularFire;
  private handler: RxHelper;

  public static init(af: AngularFire, handler: RxHelper) {
    let components = new SuperMapComponents();
    components.af = af;
    components.handler = handler;
    return components;
  }

  public markersForAgencyAdmin(uid: string, folder: string, funct: (holder: Map<string, google.maps.Marker>) => void) {

    this.af.database.object(Constants.APP_STATUS + "/" + folder + "/" + uid + "/")
      .map(result => {
        return "countrypd";
      })
      .flatMap(agencyAdmin => {
        return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin)
      })
      .flatMap(countryIds => {
        return this.af.database.object(Constants.APP_STATUS + "/hazard/" + countryIds);
      })
      .subscribe((result) => {

      });

    // let root = this.getAgencyAdminId(null, folder, uid, (handler1, agencyAdminId) => {
    //   this.getCountriesForAgencyAdmin(handler1, agencyAdminId, (handler2, map: Map<string, ModelCountryOffice>) => {
    //     console.log("YABADABADOOOOOOOOO!");
    //   });
    // });
    // this.handler.add(root);
  };

  private getAgencyAdminId(handler: SubscriptionHandler,
                           folder: string,
                           uid: string,
                           funct: (parentHandler: SubscriptionHandler, agencyAdminId: string) => void) {
    return FirebaseWrapper.objectAndSubscribe(
      handler,
      this.af.database.object(Constants.APP_STATUS + "/" + folder + "/" + uid + "/"),
      (pHandler: SubscriptionHandler, adminCountry: ModelAdministratorCountry) => {
        let s;
        for (let key in adminCountry.agencyAdmin) {
          s = key;
        }
        funct(pHandler, s);
      }
    );
  }

  private getCountriesForAgencyAdmin(handler: SubscriptionHandler, agencyAdmin: string, funct: (parentHandler: SubscriptionHandler, map: Map<string, ModelCountryOffice>) => void) {
    return FirebaseWrapper.objectAndSubscribe(
      handler,
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin),
      funct);
  };


  /** Version 2 **/
  // private getCountriesForAgencyAdmin(handler: SubscriptionHandler, agencyAdmin: string, funct: (map: Map<string, ModelCountryOffice>) => void) {
  //   return FirebaseWrapper.objectAndSubscribe(
  //     handler,
  //     this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin),
  //     funct);
  // };
  //
  // public static init(af: AngularFire, subscriptions: RxHelper) {
  //   let components = new SuperMapComponents();
  //   components.af = af;
  //   components.subscriptions = subscriptions;
  //   return components;
  // }
  //
  // public markersForAgencyAdmin(uid: string, folder: string, funct: (holder: Map<string, google.maps.Marker>) => void) {
  //   let p1 = this.getAgencyAdminId(null, folder, uid, (agencyAdminId) => {
  //     let p2 = this.getCountriesForAgencyAdmin(p1, agencyAdminId, (map: Map<string, ModelCountryOffice>) => {
  //       console.log("YABADABADOOOOOOO");
  //     });
  //   });
  //   // this.subscriptions.add(p1);
  // };
  //
  // private getAgencyAdminId(handler: SubscriptionHandler, folder: string, uid: string, funct: (agencyAdminId: string) => void) {
  //   return FirebaseWrapper.objectAndSubscribe(
  //     handler,
  //     this.af.database.object(Constants.APP_STATUS + "/" + folder + "/" + uid + "/"),(adminCountry: ModelAdministratorCountry) => {
  //       let s;
  //       for (let key in adminCountry.agencyAdmin) {
  //         s = key;
  //       }
  //       funct(s);
  //     });
  // }
  //
  // private getCountriesForAgencyAdmin(handler: SubscriptionHandler, agencyAdmin: string, funct: (map: Map<string, ModelCountryOffice>) => void) {
  //   return FirebaseWrapper.objectAndSubscribe(
  //     handler,
  //     this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin),
  //     funct);
  // };
  /** EOV2 **/

  // private getHazardsForCountries(handler: SubscriptionHandler, countryId: string, funct: (map: Map<String,ModelHazard>) => void) {
  //   return FirebaseWrapper.objectAndSubscribe(
  //     handler,
  //     this.af.database.object()
  //   )
  // }

  // public markersForAgencyAdmin(uid: string, folder: string, funct: (holder: Map<string, google.maps.Marker>) => void) {
  //   this.getAgencyAdminId(folder, uid, (agencyAdminId: string) => {
  //     // AgencyAdminId is returned. Pass it on to the countries for AgencyAdmin
  //
  //     this.getCountriesOnAgencyAdmin(agencyAdminId, (countryMap: Map<string, ModelCountryOffice>) => {
  //       // For every country office that an Agency Admin has
  //
  //       for (let key in countryMap) {
  //         this.getHazards(key, (hazardsMap: Map<String, ModelHazard>) => {
  //           let markerMap = new Map<string, google.maps.Marker>();
  //           for (let key in hazardsMap) {
  //             markerMap.set(key, new google.maps.Marker({
  //               icon: HazardImages.init().get(hazardsMap.get(key).category, true),
  //               position: {lat: 0.0, lng: 0.0},
  //             }));
  //           }
  //           funct(markerMap);
  //         });
  //       }
  //     });
  //   });
  // }

  public countriesInAgencyAdmin(uid: string, folder: string, funct: (red: [string], yellow: [string], green: [string]) => void) {
    let findRed: Set<string>;
    let findYellow: Set<string>;
    let findGreen: Set<string>;
  //   this.getAgencyAdminId(folder, uid, (agencyAdminId => {
  //     this.getCountriesOnAgencyAdmin(agencyAdminId, (map) => {
  //       for (let key in map) {
  //
  //       }
  //     });
  //   }));
  }
  //
  // private getAgencyAdminIdFromAdminCountry(uid: string, funct: (agencyAdminId: string) => void) {
  //   this.getAgencyAdminId("administratorCountry", uid, funct);
  // }

  // private getAgencyAdminId(folder: string, uid: string, funct: (agencyAdminId: string,) => void) {
  //   if (uid == null) {
  //     funct(null);
  //   }
  //   let sub = this.af.database.object(Constants.APP_STATUS + "/" + folder + "/" + uid).subscribe((admin: ModelAdministratorCountry) => {
  //     if (admin == null || admin.agencyAdmin == null || admin.agencyAdmin.size == 0) {
  //       console.log("No agencyAdmin field defined");
  //     } else {
  //       let myKey: string;
  //       for (let key in admin.agencyAdmin) {
  //         myKey = key;
  //       }
  //       funct(myKey);
  //     }
  //   });
  //   this.subscriptions.add(sub);
  // }

  // private getCountriesOnAgencyAdmin(agencyAdmin: string, funct: (map: Map<String, ModelCountryOffice>) => void) {
  //   let sub = this
  //     .af
  //     .database
  //     .object(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin)
  //     .subscribe((countryOffice: Map<string, ModelCountryOffice>) => {
  //       funct(countryOffice);
  //     });
  //
  //   let handlerSub = FirebaseWrapper.objectAndSubscribe(
  //     null,
  //     this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin),
  //     () => {
  //       let childSub = FirebaseWrapper.objectAndSubscribe(
  //         handlerSub,
  //         this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin),
  //         () => {
  //         }
  //       );
  //
  //     });
  //
  //   this.subscriptions.add(sub);
  // }

  private getHazards(countryId: string, funct: (map: Map<string, ModelHazard>) => void) {
    let sub = this.af.database.object(Constants.APP_STATUS + "/hazard/" + countryId).subscribe((hazards: Map<string, ModelHazard>) => {
      funct(hazards);
    });
    // this.subscriptions.add(sub);
  }
}


export class MarkerHolder {
  public i: string;
  public p;

  constructor(private icon: string, private position) {
    this.i = icon;
    this.p = position;
  }
}
