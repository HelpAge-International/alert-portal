import { Component, OnInit, OnDestroy } from '@angular/core';
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {RxHelper} from "../utils/RxHelper";
import {} from '@types/googlemaps';
declare var jQuery: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {

  private uid: string;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        console.log(this.uid);

        // Query firebase for country information
        this.initMap(["GB"], ["FR"], ["DE"]);

      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);

  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  public initMap(red, yellow, green) {
    // require('google-maps')('AIzaSyD1Bc3slcPsdbH2EhAxyhyoJlrrBs6_P_M', function(maps) {
    //   console.log("inside initmaps");
    //   console.log(maps);
    // });
    let uluru = {lat: 33.443861, lng: 105.891683};
    let map = new google.maps.Map(document.getElementById("global-map"), {
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

    var marker = new google.maps.Marker({
        position: uluru,
        icon: "https://lh4.ggpht.com/Tr5sntMif9qOPrKV_UVl7K8A_V3xQDgA7Sw_qweLUFlg76d_vGFA7q1xIKZ6IcmeGqg=w300",
        map: map
    });
    this.doneWithEmbeddedStyles(red, "#CD2811", yellow, "#E3A700", green, "#5BA920", map);
  }

  /** Function for where **/
  public doneWithEmbeddedStyles(red, redCol, yellow, yellowCol, green, greenCol, map) {
    console.log(this.arrayToQuote(red.concat(yellow.concat(green))));
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
    google.maps.event.addListener(layer, 'click', function(e) {
      e.infoWindowHtml = e.row['ISO_2DIGIT'].value + "<br/>";
      e.infoWindowHtml += "Clicked!";
    });
    console.log(layer);
  }

  /** Configure colour string **/
  public colorOptions(whereString, colour) {
    let options = {
      styles: []
    };
    options.styles.push({
      where: whereString,
      polygonOptions: {
        fillColor: "#0000FF"
      }
    });
    return options;
  }

  /** Convert array of countries to string list **/
  public arrayToQuote(array) {
    if (array.length == 1) {
      return "'ISO_2DIGIT' = '" + array[0] + "'";
    } else {
      let s = "'ISO_2DIGIT' IN (";
      for (let i = 0; i < array.length; i++) {
        s += "'" + array[i] + "',";
      }
      if (array.length != 0) {
        s = s.substring(0, s.length-1);
      }
      s += ")";
      return s;
    }
  }

}
