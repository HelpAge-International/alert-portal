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
/**
 * Created by jordan on 05/05/2017.
 */

export class SuperMapComponents {

  private af: AngularFire;
  private handler: RxHelper;
  public map: google.maps.Map;

  private geocoder: google.maps.Geocoder;

  public static init(af: AngularFire, handler: RxHelper) {
    let components = new SuperMapComponents();
    components.af = af;
    components.handler = handler;
    components.geocoder = new google.maps.Geocoder;
    return components;
  }


  /**
   *   Get the list of countries to highlight on the map based on the folder
   */
  public highlightedCountriesAgencyAdmin(uid: string, folder: string, funct: (red: string[], yellow: string[], green: string[]) => void) {
    let sub = this.af.database.object(Constants.APP_STATUS + "/" + folder + "/" + uid + "/")
      .map((result: AgencyAdminPlaceholder) => {
        let s: string;
        for (let key in result.agencyAdmin) {
          s = key;
        }
        return s;
      })
      .flatMap((agencyAdmin: string) => {
        return this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin);
      })
      .subscribe((countryIds: Map<string, ModelCountryOffice>) => {
        let red: string[] = [];
        let yellow: string[] = [];
        let green: string[] = [];
        for (let obj in countryIds) {
          red.push(Countries[countryIds[obj].location]);
        }
        funct(red, yellow, green);
      });

    this.handler.add(sub);
  }


  /**
   *    Markers for the map based on a node (ie. administratorCountry, administratorAdmin, etc.
   */
  private markersForAgencyAdminMap: Map<string, number> = new Map<string, number>();

  public markersForAgencyAdmin(uid: string, folder: string, funct: (holder: google.maps.Marker) => void) {
    let sub = this.af.database.object(Constants.APP_STATUS + "/" + folder + "/" + uid)
      .map((result: AgencyAdminPlaceholder) => {
        let s: string;
        for (let key in result.agencyAdmin) {
          s = key;
        }
        return s;
      })
      .flatMap((agencyAdmin: string) => {
        return this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyAdmin)
      })
      .flatMap((countryIds: Map<string, ModelCountryOffice>) => {
        for (let key in countryIds) {
          this.markersForAgencyAdminMap.set(key, countryIds[key].location);
          return this.af.database.list(Constants.APP_STATUS + "/hazard/" + key);
        }
      })
      .subscribe((result: ModelHazard[]) => {
        console.log(result);
        for (let i = 0; i < result.length; i++) {
          let cur = result[i];
          this.geocoder.geocode({"address": Countries[0]}, (geoResult: GeocoderResult[], status: GeocoderStatus) => {
            if (status == GeocoderStatus.OK && geoResult.length >= 1) {
              console.log("Adding marker at " + geoResult[0].geometry.location);
              let marker = new google.maps.Marker({
                position: geoResult[0].geometry.location,
                icon: HazardImages.init().get(cur.category, true)
              });
              funct(marker);
            }
          });
        }
      });

    this.handler.add(sub);
    ;
  };


  /**
   * Utility methods for initialising the map and handling colouring and theming of it
   */

  public initBlankMap(elementId: string) {
    let uluru = {lat: 33.443861, lng: 105.891683};
    this.map = new google.maps.Map(document.getElementById(elementId), {
      zoom: 4,
      center: uluru,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP]
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
          "elementType": "labels",
          "stylers": [
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
          "stylers": [
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
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "administrative.neighborhood",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "administrative.province",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          featureType: "landscape.man_made",
          "stylers": [
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
          "stylers": [
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
          "stylers": [
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
          "stylers": [
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

  public initMapFrom(elementId: string, uid: string, folder: string) {
    if (this.map == null) {
      this.initBlankMap(elementId);
    }
    this.highlightedCountriesAgencyAdmin(uid, folder, (red, yellow, green) => {
      this.doneWithEmbeddedStyles(red, "#CD2811", yellow, "#E3A700", green, "#5BA920", this.map);
    });
  }


  /** Function for where **/
  public doneWithEmbeddedStyles(red, redCol, yellow, yellowCol, green, greenCol, map) {
    let layer = new google.maps.FusionTablesLayer({
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
      e.infoWindowHtml = e.row['ISO_2DIGIT'].value + "<br/>";
      e.infoWindowHtml += "Clicked!";
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

export class Holder<T, S> {
  private t: T;
  private s: S;

  public init(t: T, s: S) {
    this.t = t;
    this.s = s;
  }
}

export class MarkerHolder {
  public i: string;
  public p;

  constructor(private icon: string, private position) {
    this.i = icon;
  }
}

export class AgencyAdminPlaceholder {
  public agencyAdmin: Map<string, boolean>;
}
