import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AngularFire } from "angularfire2";
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import Tile from "ol/layer/Tile";
import VectorLayer from 'ol/layer/Vector';
import OlMap from "ol/Map";
import 'ol/ol.css';
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import Icon from 'ol/style/Icon';
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import View from "ol/View";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { AgencyService } from "../services/agency-service.service";
import { MapCountry, MapService } from "../services/map.service";
import { AgencyModulesEnabled, PageControlService } from "../services/pagecontrol.service";
import { SettingsService } from "../services/settings.service";
import { UserService } from "../services/user.service";
import { Constants } from "../utils/Constants";
import { Countries, CountriesMapsSearchInterface } from "../utils/Enums";
import { HazardImages } from "../utils/HazardImages";
import { DepHolder, SDepHolder, SuperMapComponents } from "../utils/MapHelper";

import GeocoderResult = google.maps.GeocoderResult;
import GeocoderStatus = google.maps.GeocoderStatus;

declare var jQuery: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {
  public uid: string;
  public mapHelper: SuperMapComponents;
  public mapService: MapService;
  public department: SDepHolder;
  public agencyLogo: string;
  public minThreshYellow: number;
  public minThreshGreen: number;
  public DEPARTMENT_MAP: Map<string, string> = new Map<string, string>();
  public moduleAccess: AgencyModulesEnabled = new AgencyModulesEnabled();

  private isDirector: boolean;
  private userTypePath: string;
  private hazardExist = false
  private countries: MapCountry[] = [];
  private vector: VectorLayer = new VectorLayer()
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private agencyMap: Map<string, string> = new Map<string, string>();
  private geocoder: google.maps.Geocoder = new google.maps.Geocoder;

  constructor(private pageControl: PageControlService,
    private af: AngularFire,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private settingService: SettingsService,
    private agencyService: AgencyService,
    private translate: TranslateService) {
    this.mapHelper = SuperMapComponents.init(af, this.ngUnsubscribe);
  }

  goToListView() {
    this.isDirector ? this.router.navigate(['map/map-countries-list', { 'isDirector': true }]) : this.router.navigateByUrl('map/map-countries-list');
  }

  ngOnInit() {
    this.loadMapData()
  }

  loadMapData() {
    this.department = new SDepHolder("Something");
    this.department.location = -1;
    this.department.departments.push(new DepHolder("Loading", 100, 1));

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["isDirector"]) {
          this.isDirector = params["isDirector"];
        }

        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.userTypePath = Constants.USER_PATHS[userType];

          this.mapService = MapService.init(this.af, this.ngUnsubscribe);
          this.mapService.init(this.uid, userType, countryId, agencyId, systemId,
            ((countries, green, yellow) => {
              this.countries = countries;
              this.minThreshGreen = green;
              this.minThreshYellow = yellow;
              this.setLocation(countries)
            }));

          this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/departments", { preserveSnapshot: true })
            .takeUntil(this.ngUnsubscribe)
            .subscribe((snap) => {
              this.DEPARTMENT_MAP.clear();
              this.DEPARTMENT_MAP.set("unassigned", this.translate.instant("UNASSIGNED"));
              for (let x of snap) {
                this.DEPARTMENT_MAP.set(x.key, x.val().name);
              }

              if (this.isDirector) {
                this.agencyService.getAllCountryIdsForAgency(agencyId)
                  .mergeMap(ids => Observable.from(ids))
                  .mergeMap(id => this.settingService.getCountryLocalDepartments(agencyId, id))
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(depts => depts.forEach(dep => this.DEPARTMENT_MAP.set(dep.id, dep.name)))
              } else {
                this.settingService.getCountryLocalDepartments(agencyId, countryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(localDepts => {
                    localDepts.forEach(dep => this.DEPARTMENT_MAP.set(dep.id, dep.name))
                  })
              }
            });

          /** Load in the markers on the map! */
          PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[userType], isEnabled => {
            this.moduleAccess = isEnabled;
            if (isEnabled.riskMonitoring) {
              this.mapHelper.markersForAgencyAdmin(this.uid, Constants.USER_PATHS[userType], (marker) => {
                marker.setMap(this.mapHelper.map);
              });
            }
          });

          /** Get the Agency logo */
          this.mapHelper.logoForAgencyAdmin(this.uid, Constants.USER_PATHS[userType], (logo) => {
            this.agencyLogo = logo;
          });
        });
      });
  }

  private setLocation(countries) {
    let position = 0;

    var promise = new Promise((resolve, reject) => {
      countries.forEach(country => {
        let count: number = 0;
        this.countries = countries

        if (country.hazards.size != 0) {
          this.hazardExist = true
          country.hazards.forEach((_, hazard) => {
            this.geocoder.geocode({ "address": CountriesMapsSearchInterface.getEnglishLocationFromEnumValue(country.location) }, (geoResult: GeocoderResult[], status: GeocoderStatus) => {
              if (status == GeocoderStatus.OK && geoResult.length >= 1) {
                let pos = {
                  lng: geoResult[0].geometry.location.lng() + position,
                  lat: geoResult[0].geometry.location.lat()
                };

                var iconFeature = new Feature({
                  geometry: new Point(fromLonLat([pos.lng, pos.lat])),
                  name: '',
                  population: 4000,
                  rainfall: 500
                });

                var iconStyle = new Style({
                  image: new Icon({
                    anchor: [0.5, 0.5],
                    anchorXUnits: IconAnchorUnits.FRACTION,
                    anchorYUnits: IconAnchorUnits.FRACTION,
                    src: HazardImages.init().get(hazard)
                  })
                });
                iconFeature.setStyle(iconStyle);

                this.vector = new VectorLayer({
                  source: new VectorSource({
                    features: [iconFeature],
                    format: new GeoJSON(),
                    url: 'https://raw.githubusercontent.com/openlayers/ol3/6838fdd4c94fe80f1a3c98ca92f84cf1454e232a/examples/data/geojson/countries.geojson'
                  }),
                  style: this.mapStyle()
                });

                count++;
                if (count % 2 == 0) {
                  position *= -1;
                }
                else {
                  position += 1.2;
                }

                if (count == country.hazards.size) {
                  resolve();
                }
              }
            })
          })
        }
      })
    })

    promise.then(() => {
      this.initialiseMap(countries)
    });

    if (!this.hazardExist) {
      this.vector = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: 'https://raw.githubusercontent.com/openlayers/ol3/6838fdd4c94fe80f1a3c98ca92f84cf1454e232a/examples/data/geojson/countries.geojson'
        }),
        style: this.mapStyle()
      });
      this.initialiseMap(countries)
    }
  }

  initialiseMap(countries) {
    var raster = new Tile({
      source: new OSM(),
    });

    var map = new OlMap({
      target: 'map',
      layers: [raster, this.vector],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    var featureOverlay = new VectorLayer({
      source: new VectorSource(),
      map: map,
      style: this.mapStyle()
    });

    var highlight, feature;

    var displayFeatureInfo = function (pixel) {
      feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });

      var info = document.getElementById('info');
      if (feature) {
        info.innerHTML = feature.get('name');
      } else {
        info.innerHTML = '&nbsp;';
      }

      if (feature !== highlight) {
        if (highlight) {
          featureOverlay.getSource().removeFeature(highlight);
        }
        if (feature) {
          featureOverlay.getSource().addFeature(feature);
        }
        highlight = feature;
      }
    };

    map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      var pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });

    map.on('click', function (evt) {
      if (feature != undefined) {
        displayFeatureInfo(evt.pixel)

        for (let x of countries) {
          var name = CountriesMapsSearchInterface.getEnglishLocationFromEnumValue(x.location)

          if (feature.get("name") == name) {
            jQuery("#minimum-prep-modal-" + Countries[x.location]).modal("show");
          }
        }
      }
    });
  }

  private mapStyle() {
    let countries = this.getAffectedCountries() as [Country]
    return function (feature, res) {
      for (var country of countries) {
        if (feature.get("name") == country.name) {
          return new Style({
            stroke: new Stroke({
              color: String(country.colour),
              width: 2
            }),
            fill: new Fill({
              color: String(country.colour)
            })
          });
        }
      }
    }
  }

  private getAffectedCountries() {
    var countries = new Array()

    for (let x of this.countries) {
      var name = CountriesMapsSearchInterface.getEnglishLocationFromEnumValue(x.location)
      let country: Country = new Country('', '')
      country.name = name

      if (x.overall() == -1) {
        country.colour = 'blue'
      } else if (x.overall() >= this.minThreshGreen) {
        country.colour = 'red'
      } else if (x.overall() >= this.minThreshYellow) {
        country.colour = 'yellow'
      } else {
        country.colour = 'red'
      }
      countries.push(country)
    }
    return countries
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

  public openMinimumPreparednessModal(countryCode: string) {
    if (this.moduleAccess.minimumPreparedness) {
      jQuery("#minimum-prep-modal-" + countryCode).modal("show");
    }
  }
}

export class Country {
  public name: String
  public colour: String

  constructor(name: String, colour: String) {
    this.name = name
    this.colour = colour
  }
}