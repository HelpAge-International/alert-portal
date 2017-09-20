import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertLevels, Countries, CountriesMapsSearchInterface, HazardScenario} from "../utils/Enums";
import {DepHolder, SDepHolder, SuperMapComponents} from "../utils/MapHelper";
import {Subject} from "rxjs/Subject";
import {UserService} from "../services/user.service";
import {PageControlService} from "../services/pagecontrol.service";
import {MapService} from "../services/map.service";
import GeocoderStatus = google.maps.GeocoderStatus;
import GeocoderResult = google.maps.GeocoderResult;
import {HazardImages} from "../utils/HazardImages";
declare var jQuery: any;

@Component({
  selector: 'app-donor-module',
  templateUrl: './donor-module.component.html',
  styleUrls: ['./donor-module.component.css']
})

// TODO  - Notifications

export class DonorModuleComponent implements OnInit, OnDestroy {
  private map: google.maps.Map;
  private geocoder: google.maps.Geocoder;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private loaderInactive: boolean;

  public uid: string;
  public mapHelper: SuperMapComponents;
  public department: SDepHolder;
  private mDepartmentMap: Map<string, SDepHolder>;
  private agencyMap: Map<string, string> = new Map<string, string>();
  private departments: SDepHolder[];

  public minThreshYellow: number;
  public minThreshGreen: number;

  // Maps location -> [hazards]
  private countryToHazardScenarioList: Map<number, Set<number>> = new Map<number, Set<number>>();

  private userTypePath: string;

  @ViewChild("globalMap") globalMap: ElementRef;
  private hazardMap = new Map<number, Set<number>>();
  private countryLocationMap = new Map<string, number>();
  private countryAgencyRefMap = new Map<number, any>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService) {
    this.mapHelper = SuperMapComponents.init(af, this.ngUnsubscribe);
    this.geocoder = new google.maps.Geocoder;
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
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.userTypePath = Constants.USER_PATHS[userType];
    });
  }

  ngAfterViewInit() {
    this.initBlankMap();
    this.loaderInactive = true;
    this.initData();
  }

  private initData() {
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/", {preserveSnapshot: true})
      .map(snap => {
        let locations = [];
        if (snap && snap.val()) {
          let countryObjects = Object.keys(snap.val()).map(key => {
            let countryWithAgencyId = snap.val()[key];
            countryWithAgencyId["agencyId"] = key;
            return countryWithAgencyId;
          });
          countryObjects.forEach(item => {
            let countries = Object.keys(item).filter(key => key != "agencyId").map(key => {
              let country = item[key];
              country["countryId"] = key;
              country["agencyId"] = item.agencyId;
              return country;
            });
            countries.forEach(country => {
              locations.push(country.location);
              this.hazardMap.set(Number(country.location), new Set<number>());
              this.countryAgencyRefMap.set(Number(country.location), country);
            });
            countries.forEach(country => {
              this.getHazardInfo(country);
            });
          });
        }
        return locations;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(allLocations => {
        this.doneWithEmbeddedStyles(country => {
          let navRef = this.countryAgencyRefMap.get(Countries[country]);
          this.router.navigate(["donor-module/donor-country-index", {
            "countryId": navRef.countryId,
            "agencyId": navRef.agencyId
          }]);
        }, allLocations);
      });
  }

  private getHazardInfo(country: any) {
    console.log(country);
    this.af.database.list(Constants.APP_STATUS + "/alert/" + country.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snap => {
        let hazardRedAlert: Map<HazardScenario, boolean> = new Map<HazardScenario, boolean>();
        snap.forEach((snapshot) => {
          if (snapshot.val().alertLevel == AlertLevels.Red) {
            let res: boolean = false;
            for (const userTypes in snapshot.val().approval) {
              for (const thisUid in snapshot.val().approval[userTypes]) {
                if (snapshot.val().approval[userTypes][thisUid] != 0) {
                  res = true;
                }
              }
            }
            if (hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              hazardRedAlert.set(snapshot.val().hazardScenario, res);
            }
          }
          else {
            if (hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              hazardRedAlert.set(snapshot.val().hazardScenario, false);
            }
          }
        });
        let listOfActiveHazards: Set<number> = new Set<number>();
        if (this.countryToHazardScenarioList.get(country.location) != null) {
          listOfActiveHazards = this.countryToHazardScenarioList.get(country.location);
        }
        hazardRedAlert.forEach((value, key) => {
          if (value) {
            listOfActiveHazards.add(key);
          }
        });
        if (listOfActiveHazards.size != 0) {
          this.countryToHazardScenarioList.set(country.location, listOfActiveHazards);
        }
        this.drawHazardMarkers();
      });
  }

  private drawHazardMarkers() {
    this.countryToHazardScenarioList.forEach((v, k) => {
      if (v.size > 0) {
        let position = 0;
        let scenarios = Array.from(v);
        scenarios.forEach(item => {

          this.geocoder.geocode({"address": CountriesMapsSearchInterface.getEnglishLocationFromEnumValue(k)}, (geoResult: GeocoderResult[], status: GeocoderStatus) => {
            if (status == GeocoderStatus.OK && geoResult.length >= 1) {
              let pos = {
                lng: geoResult[0].geometry.location.lng() + position,
                lat: geoResult[0].geometry.location.lat()
              };
              let marker = new google.maps.Marker({
                position: pos,
                icon: HazardImages.init().get(item)
              });
              marker.setMap(this.map);
              position += 1.2;
            }
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

  /** Function for where **/
  private doneWithEmbeddedStyles(countryClicked: (country: string) => void, locations) {

    let blue: string[] = [];

    locations.forEach(location => {
      blue.push(Countries[location]);
    });

    let layer = new google.maps.FusionTablesLayer({
      suppressInfoWindows: true,
      query: {
        select: '*',
        from: '1Y4YEcr06223cs93DmixwCGOsz4jzXW_p4UTWzPyi',
        where: this.arrayToQuote(blue)
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
            fillColor: '#66A8C6',
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
  public initBlankMap() {
    let uluru = {lat: 20, lng: 0};
    this.map = new google.maps.Map(this.globalMap.nativeElement, {
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
