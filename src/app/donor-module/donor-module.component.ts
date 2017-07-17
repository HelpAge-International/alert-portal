import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Countries} from "../utils/Enums";
import {DepHolder, SDepHolder, SuperMapComponents} from "../utils/MapHelper";
import {Subject} from "rxjs/Subject";
import {UserService} from "../services/user.service";
import {PageControlService} from "../services/pagecontrol.service";
import {MapService} from "../services/map.service";
declare var jQuery: any;

@Component({
  selector: 'app-donor-module',
  templateUrl: './donor-module.component.html',
  styleUrls: ['./donor-module.component.css']
})

// TODO  - Notifications

export class DonorModuleComponent implements OnInit, OnDestroy {
  private map: google.maps.Map;
  private mapService: MapService;
  private clickedCountry: (country: string) => void;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private loaderInactive: boolean = true;

  public uid: string;
  public mapHelper: SuperMapComponents;
  public department: SDepHolder;
  private mDepartmentMap: Map<string, SDepHolder>;
  private agencyMap: Map<string, string> = new Map<string, string>();
  private departments: SDepHolder[];

  public minThreshYellow: number;
  public minThreshGreen: number;

  private userTypePath: string;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService) {
    this.mapHelper = SuperMapComponents.init(af, this.ngUnsubscribe);
    this.mapService = MapService.init(this.af, this.ngUnsubscribe);
  }

  goToListView() {
    console.log('Here');
    this.router.navigate(['/donor-module/donor-list-view']);
    // this.router.navigateByUrl('/donor-module/donor-list-view');
  }

  ngOnInit() {
    this.department = new SDepHolder("Something");
    this.department.location = -1;
    this.department.departments.push(new DepHolder("Loading", 100, 1));
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.userTypePath = Constants.USER_PATHS[userType];

      // this.mapHelper.initMapFrom("global-map", this.uid, Constants.USER_PATHS[userType],
      //   (departments) => {
      //     this.mDepartmentMap = departments;
      //     this.departments = [];
      //     this.minThreshYellow = this.mapHelper.minThreshYellow;
      //     this.minThreshGreen = this.mapHelper.minThreshGreen;
      //     this.mDepartmentMap.forEach((value, key) => {
      //       this.departments.push(value);
      //     });
      //     this.loaderInactive = true;
      //   },
      //   (mapCountryClicked) => {
      //     if (this.mDepartmentMap != null) {
      //       let countryIdToSend: string = this.mDepartmentMap.get(mapCountryClicked).countryId;
      //       this.router.navigate(["donor-module/donor-country-index", {
      //         countryId: countryIdToSend,
      //         agencyId: this.mapHelper.agencyAdminId
      //       }]);
      //     }
      //     else {
      //       // Map country behaviour broken. Do nothing.
      //     }
      //   }
      // );
    });
  }

  ngAfterViewInit() {
    this.initBlankMap("global-map");
    this.doneWithEmbeddedStyles(this.clickedCountry);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

  /** Function for where **/
  private doneWithEmbeddedStyles(countryClicked: (country: string) => void) {

    let blue: string[] = [];
    let red: string[] = [];
    let yellow: string[] = [];
    let green: string[] = [];

    blue.push(Countries[0]);
    blue.push(Countries[1]);

    // for (let x of this.listCountries) {
    //   if (x.overall() == -1) {
    //     blue.push(Countries[x.location]);
    //   }
    //   else if (x.overall() >= this.threshGreen) {
    //     green.push(Countries[x.location]);
    //   }
    //   else if (x.overall() >= this.threshYellow) {
    //     yellow.push(Countries[x.location]);
    //   }
    //   else {
    //     red.push(Countries[x.location]);
    //   }
    // }

    let layer = new google.maps.FusionTablesLayer({
      suppressInfoWindows: true,
      query: {
        select: '*',
        from: '1Y4YEcr06223cs93DmixwCGOsz4jzXW_p4UTWzPyi',
        where: this.arrayToQuote(red.concat(yellow.concat(green.concat(blue))))
      },
      styles: [
        {
          polygonOptions: {
            fillColor: '#f00ff9',
            strokeOpacity: 0.0
          }
        },
        {
          where: this.arrayToQuote(blue),
          polygonOptions: {
            fillColor: MapService.COLOUR_BLUE,
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
          where: this.arrayToQuote(red),
          polygonOptions: {
            fillColor: MapService.COLOUR_RED,
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
            fillColor: MapService.COLOUR_YELLOW,
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
            fillColor: MapService.COLOUR_GREEN,
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
    layer.setMap(this.map);
    google.maps.event.addListener(layer, 'click', function (e) {
      console.log(e.row.ISO_2DIGIT.value);
      countryClicked(e.row.ISO_2DIGIT.value);
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

  /**
   * Map initialisation stuff
   */
  public initBlankMap(elementId: string) {
    let uluru = {lat: 20, lng: 0};
    this.map = new google.maps.Map(document.getElementById(elementId), {
      zoom: 2,
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

}
