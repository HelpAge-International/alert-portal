import {Component, OnInit, OnDestroy} from '@angular/core';
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {RxHelper} from "../utils/RxHelper";
import {} from '@types/googlemaps';
import {ModelAdministratorCountry} from "../model/administrator.country.model";
import {ModelCountryOffice} from "../model/countryoffice.model";
import {ModelHazard} from "../model/hazard.model";
import {Countries, HazardScenario} from "../utils/Enums";
import {HazardImages} from "../utils/HazardImages";
import Marker = google.maps.Marker;
import {FirebaseWrapper, SubscriptionHandler} from "./SubscriptionHandler";
import {forEach} from "@angular/router/src/utils/collection";
import {ModelAgency} from "../model/agency.model";
import Geocoder = google.maps.Geocoder;
import GeocoderResult = google.maps.GeocoderResult;
import GeocoderStatus = google.maps.GeocoderStatus;
import {current} from "codelyzer/util/syntaxKind";
import {ModelSystem} from "../model/system.model";
/**
 * Created by jordan on 05/05/2017.
 */

export class SuperMapComponents {

  private af: AngularFire;
  private subscriptions: RxHelper;
  public map: google.maps.Map;

  public minThreshRed: number;
  public minThreshYellow: number;
  public minThreshGreen: number;

  private geocoder: google.maps.Geocoder;

  public static init(af: AngularFire, handler: RxHelper) {
    let components = new SuperMapComponents();
    components.af = af;
    components.subscriptions = handler;
    components.geocoder = new google.maps.Geocoder;
    return components;
  }


  /**
   *   Get the list of countries to highlight on the map based on the folder
   */
  public highlightedCountriesAgencyAdmin(uid: string, folder: string, funct: (red: string[], yellow: string[], green: string[]) => void) {
    let sub = this
      .getCountryOffice(uid, folder)
      .subscribe((countryIds) => {
        let red: string[] = [];
        let yellow: string[] = [];
        let green: string[] = [];
        for (let obj in countryIds) {
          green.push(Countries[countryIds[obj].location]);
        }
        funct(red, yellow, green);
      });

    this.subscriptions.add(sub);
  }


  /**
   *    Markers for the map based on a node (ie. administratorCountry, administratorAdmin, etc.
   */
  private markersForAgencyAdminMap: Map<string, number> = new Map<string, number>();
  public markersForAgencyAdmin(uid: string, folder: string, funct: (holder: google.maps.Marker) => void) {
    let sub = this
      .getCountryOffice(uid, folder)
      .flatMap((countryOffice) => {
        for (let key of countryOffice) {
          this.markersForAgencyAdminMap.set(key.$key, key.location);
          return this.af.database.object(Constants.APP_STATUS + "/hazard/" + key.$key, { preserveSnapshot: true});
        }
      })
      .subscribe((result) => {
        result.forEach(snapshot => {
          this.geocoder.geocode({"address": Countries[this.markersForAgencyAdminMap.get(result.key)]}, (geoResult: GeocoderResult[], status: GeocoderStatus) => {
            if (status == GeocoderStatus.OK && geoResult.length >= 1) {
              let marker = new google.maps.Marker({
                position: geoResult[0].geometry.location,
                icon: HazardImages.init().get(snapshot.val().hazardScenario)
              });
              funct(marker);
            }
          })
        });
      });

    this.subscriptions.add(sub);
  };


  /**
   * Get the system information
   */
  public getSystemInfo(uid: string, folder:string, funct: (red: number, yellow: number, green: number) => void) {
    let sub = this.getSystemAdminId(uid, folder)
      .flatMap((systemAdmin) => {
        return this.af.database.object(Constants.APP_STATUS + "/system/" + systemAdmin);
      })
      .subscribe((model: ModelSystem) => {
        let green: number = model.minThreshold[0];
        let yellow: number = model.minThreshold[1];
        let red: number = model.minThreshold[2];
        funct(red, yellow, green);
      });
    this.subscriptions.add(sub);
  }


  /**
   * Get the list of departments for the country
   */
  public getDepForCountry(uid: string, folder: string, country: number, funct: (holder: SDepHolder) => void) {
    let sub = this.af.database.object(Constants.APP_STATUS + "/" + folder + "/" + uid)
      .map((result: AgencyAdminPlaceholder) => {
        let s: string;
        for (let key in result.agencyAdmin) {
          s = key;
        }
        return s;
      })
      .flatMap((agencyAdmin: string) => {
        return this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin);
      })
      .flatMap((result) => {
        for (let x of result) {
          if (x.location == country) {
            return this.af.database.object(Constants.APP_STATUS + "/action/" + x.$key, { preserveSnapshot: true });
          }
        }
      })
      .subscribe((result) => {
        console.log("subscribe result");
        let returnObj = new SDepHolder();
        returnObj.departments = [];
        returnObj.location = country;
        result.forEach(snapshot => {
          returnObj.departments.push(new DepHolder(
            snapshot.val().department,
            snapshot.val().actionStatus == null ? 0 : snapshot.val().actionStatus,
            snapshot.val().level));
        });
        funct(returnObj);
      });
    this.subscriptions.add(sub);
  }


  /** Get all the countries **/
  private mDepCounter;
  private mDepHolder: SDepHolder[];
  private flagToClear: boolean = false;
  public getDepsForAllCountries(uid: string, folder: string, funct: (holder: SDepHolder[]) => void) {
    this.mDepCounter = 0;
    this.mDepHolder = [];
    let sub = this.getCountryOffice(uid, folder)
      .subscribe((result) => {
        for (let r of result) {
          this.mDepCounter++;
          this.mDepHolder = [];
          this.getDepForCountry(uid, folder, r.location, (holder) => {
            holder = this.processDepHolder(holder, 1);
            this.getDepsForAllCountriesCounterMethod(holder, funct);
          })
        }
      });
    this.subscriptions.add(sub);
  }
  private getDepsForAllCountriesCounterMethod(holder: SDepHolder, funct: (holder: SDepHolder[]) => void) {
    if (!this.flagToClear) {
      this.mDepHolder = [];
      this.flagToClear = true;
    }
    this.mDepCounter--;
    if (holder != null) {
      this.mDepHolder.push(holder);
    }
    if (this.mDepCounter == 0) {
      funct(this.mDepHolder);
      this.flagToClear = false;
    }
  }
  private processDepHolder(holder: SDepHolder, levelToSelect: number) {
    let newHolder: Map<string, DepHolder> = new Map<string, DepHolder>();
    let counterMap: Map<string, number> = new Map<string, number>();
    for (let x of holder.departments) {
      if (x.level == levelToSelect) {
        let mHolder = newHolder.get(x.department);
        if (mHolder != null) {
          mHolder.actionStatus += (x.actionStatus == 2 ? 100 : 0);
          counterMap.set(x.department, counterMap.get(x.department) + 1);
        }
        else {
          counterMap.set(x.department, 1);
          newHolder.set(x.department, new DepHolder(x.department, (x.actionStatus == 2 ? 100 : 0), x.level));
        }
      }
    }

    // Convert the maps to a list
    let mHolders: DepHolder[] = [];
    newHolder.forEach((value, key) => {
      let obj = newHolder.get(key);
      obj.actionStatus /= counterMap.get(key);
      newHolder.set(key, obj);
      mHolders.push(newHolder.get(key));
    });
    holder.departments = mHolders;
    return holder;
  }


  /**
   * Get the country office
   */
  private getAgency(uid: string, agencyAdminRefFolder: string) {
    return this.getObjectBasedOnAgencyAdmin(uid, agencyAdminRefFolder, "agency");
  }
  private getCountryOffice(uid: string, agencyAdminRefFolder: string) {
    return this.getObjectBasedOnAgencyAdmin(uid, agencyAdminRefFolder, "countryOffice");
  }
  private getAdministratorAgency(uid: string, agencyAdminRefFolder: string) {
    return this.getObjectBasedOnAgencyAdmin(uid, agencyAdminRefFolder, "administratorAgency");
  }
  private getObjectBasedOnAgencyAdmin(uid: string, agencyAdminRefFolder: string, objectFolder: string) {
    return this.af.database.object(Constants.APP_STATUS + "/" + agencyAdminRefFolder + "/" + uid)
      .map((result: AgencyAdminPlaceholder) => {
        let s: string;
        for (let key in result.agencyAdmin) {
          s = key;
        }
        return s;
      })
      .flatMap((agencyAdmin: string) => {
        return this.af.database.list(Constants.APP_STATUS + "/" + objectFolder + "/" + agencyAdmin)
      });
  }


  /**
   * Get system admin id
   */
  private getSystemAdminId(uid: string, folder: string) {
    return this.af.database.object(Constants.APP_STATUS + "/" + folder + "/" + uid)
      .map((result: AgencyAdminPlaceholder) => {
        let s: string;
        for (let key in result.agencyAdmin) {
          s = key;
        }
        return s;
      })
      .flatMap((agencyAdminId: string) => {
        return this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId);
      })
      .map((agency: ModelAgency) => {
        let s: string;
        for (let key in agency.systemAdmin) {
          s = key;
        }
        return s;
      });
  }


  /**
   * Utility methods for initialising the map and handling colouring and theming of it
   */
  public initBlankMap(elementId: string) {
    let uluru = {lat: 54.339089, lng: -2.140014};
    this.map = new google.maps.Map(document.getElementById(elementId), {
      zoom: 4,
      center: uluru,
      mapTypeControlOptions: {
        mapTypeIds: []
      },
      streetViewControl: false,
      styles: [
        {
          elementType: "geometry",
          stylers: [
            {
              "color": "#b0b1b3"
            }
          ]
        },
        {
          elementType: "labels",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          elementType: "labels.text.fill",
          stylers: [
            {
              "color": "#523735"
            }
          ]
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          featureType: "administrative.country",
          elementType: "geometry.stroke",
          stylers: [
            {
              "color": "#f0f0f1"
            }
          ]
        },
        {
          featureType: "administrative.country",
          elementType: "labels",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "administrative.land_parcel",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "geometry.stroke",
          stylers: [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          featureType: "administrative.locality",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "administrative.neighborhood",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "administrative.province",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "landscape.man_made",
          stylers: [
            {
              "color": "#b0b1b3"
            }
          ]
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry.fill",
          stylers: [
            {
              "color": "#b0b1b3"
            }
          ]
        },
        {
          featureType: "landscape.natural.terrain",
          stylers: [
            {
              "color": "#b0b1b3"
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "labels.text",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          featureType: "poi.park",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "poi.business",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [
            {
              "color": "#447530"
            }
          ]
        },
        {
          featureType: "road",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "labels.icon",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "geometry",
          stylers: [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "geometry.stroke",
          stylers: [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          featureType: "transit",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          featureType: "transit.line",
          elementType: "labels.text.fill",
          stylers: [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          featureType: "transit.line",
          elementType: "labels.text.stroke",
          stylers: [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [
            {
              "color": "#e5eff7"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "labels.text",
          stylers: [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
    });
  }

  public initMapFrom(elementId: string, uid: string, folder: string,
                     done: (departments: Map<string,SDepHolder>) => void,
                     mapIconClicked: (countryCode: string) => void) {
    if (this.map == null) {
      this.initBlankMap(elementId);
    }
    this.getSystemInfo(uid, folder, (redThresh, yellowThresh, greenThresh) => {
      this.minThreshGreen = greenThresh;
      this.minThreshRed = redThresh;
      this.minThreshYellow = yellowThresh;
      console.log(this.minThreshGreen);
      console.log(this.minThreshYellow);
      console.log(this.minThreshRed);
      this.getDepsForAllCountries(uid, folder, (holder: SDepHolder[]) => {
        let red: string[] = [];
        let yellow: string[] = [];
        let green: string[] = [];
        for (let h of holder) {
          if (h.overallAction() >= greenThresh) {
            green.push(Countries[h.location]);
          }
          else if (h.overallAction() >= yellowThresh) {
            yellow.push(Countries[h.location]);
          }
          else {
            red.push(Countries[h.location]);
          }
        }

        let returnMap: Map<string, SDepHolder> = new Map<string, SDepHolder>();
        for (let h of holder) {
          returnMap.set(Countries[h.location].toString(), h);
        }
        this.doneWithEmbeddedStyles(red, "#CD2811", yellow, "#E3A700", green, "#5BA920", this.map, mapIconClicked);
        done(returnMap);
      });
    });
  }


  /** Function for where **/
  public doneWithEmbeddedStyles(red, redCol, yellow, yellowCol, green, greenCol, map, funct: (countryCode: string) => void) {
    let layer = new google.maps.FusionTablesLayer({
      suppressInfoWindows: true,
      query: {
        select: '*',
        from: '1Y4YEcr06223cs93DmixwCGOsz4jzXW_p4UTWzPyi',
        where: this.arrayToQuote(red.concat(yellow.concat(green)))
      },
      styles: [
        {
          polygonOptions: {
            fillColor: '#f00ff9',
            strokeOpacity: 0.0
          }
        },
        {
          where: this.arrayToQuote(red),
          polygonOptions: {
            fillColor: redCol,
            fillOpacity: 1.0,
            strokeOpacity: 0.0,
            strokeColor: "#FFFFFF"
          },
          polylineOptions: {
            strokeColor: "#FFFFFF",
            strokeOpacity: 1.0,
            strokeWeight: 1.0
          }
        },
        {
          where: this.arrayToQuote(yellow),
          polygonOptions: {
            fillColor: yellowCol,
            fillOpacity: 1.0,
            strokeOpacity: 0.0,
            strokeColor: "#FFFFFF"
          },
          polylineOptions: {
            strokeColor: "#FFFFFF",
            strokeOpacity: 1.0,
            strokeWeight: 1.0
          }
        },
        {
          where: this.arrayToQuote(green),
          polygonOptions: {
            fillColor: greenCol,
            fillOpacity: 1.0,
            strokeOpacity: 0.0,
            strokeColor: "#FFFFFF"
          },
          polylineOptions: {
            strokeColor: "#FFFFFF",
            strokeOpacity: 1.0,
            strokeWeight: 1.0
          }
        }
      ]
    });
    layer.setMap(map);
    google.maps.event.addListener(layer, 'click', function (e) {
      console.log("Clicked!");
      e.infoWindowHtml = "";
      console.log(e);
      funct(e.row.ISO_2DIGIT.value);
      // let c: Countries = <Countries>Countries["GB"];

    });
  }

  /** Convert array of countries to string list **/
  private arrayToQuote(array) {
    if (array.length <= 1) {
      return "'ISO_2DIGIT' = '" + array[0] + "'";
    } else {
      let s = "'ISO_2DIGIT' IN (";
      for (let i = 0; i < array.length; i++) {
        s += "'" + array[i] + "',";
      }
      if (array.length != 0) {
        s = s.substring(0, s.length - 1);
      }
      s += ")";
      return s;
    }
  }
}

export class DepHolder {
  constructor(department, actionStatus, level) {
    this.department = department;
    this.actionStatus = actionStatus;
    this.level = level;
  }

  public level: number;
  public department: string;
  public actionStatus: number;
}
export class SDepHolder {
  constructor() {
    this.departments = [];
  }

  public departments: DepHolder[];
  public location: number;
  public overallAction() {
    let diviser = 0;
    for (let dep of this.departments) {
      diviser += dep.actionStatus;
    }
    let x = (diviser) / (this.departments.length);
    return x;
  }
}

export class AgencyAdminPlaceholder {
  public agencyAdmin: Map<string, boolean>;
}
