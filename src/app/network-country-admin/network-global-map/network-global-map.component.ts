import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
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
import { Subject } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { NetworkMapCountry, NetworkMapService } from '../../services/networkmap.service';
import { PageControlService } from '../../services/pagecontrol.service';
import { Constants } from '../../utils/Constants';
import { Countries, CountriesMapsSearchInterface } from "../../utils/Enums";
import { HazardImages } from '../../utils/HazardImages';

import GeocoderResult = google.maps.GeocoderResult;
import GeocoderStatus = google.maps.GeocoderStatus;

declare var jQuery: any;

@Component({
  selector: 'app-network-global-map',
  templateUrl: './network-global-map.component.html',
  styleUrls: ['./network-global-map.component.css']
})

export class NetworkGlobalMapComponent implements OnInit, OnDestroy {
  @Input() isLocalNetworkAdmin: boolean;

  public isViewing: boolean;
  public uid: string;
  public networkId: string;
  public networkCountryId: string;
  public systemAdminId: string;

  private hazardExist = false;
  private paramString: string;
  private agencyId: string;
  private countryId: string;
  private minYellow: number;
  private minGreen: number;
  private countries: NetworkMapCountry[] = [];
  private HazardScenario = Constants.HAZARD_SCENARIOS;
  private vector: VectorLayer = new VectorLayer()
  private geocoder: google.maps.Geocoder = new google.maps.Geocoder;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              public networkMapService: NetworkMapService,
              private networkService: NetworkService) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.route.params
        .subscribe((params: Params) => {
          if (params != null) {
            for (let x in params) {
              if (this.paramString == null) {
                this.paramString = "";
              }
              this.paramString += ";" + x + "=" + params[x];
            }
          }
          if (params["networkId"]) {
            this.networkId = params["networkId"];
          }
          if (params["networkCountryId"]) {
            this.networkCountryId = params["networkCountryId"];
          }
          if (params["uid"]) {
            this.uid = params["uid"];
          }
          if (params["systemId"]) {
            this.systemAdminId = params["systemId"];
          }
          if (params["agencyId"]) {
            this.agencyId = params["agencyId"];
          }
          if (params["countryId"]) {
            this.countryId = params["countryId"];
          }
          if (params["isViewing"]) {
            this.isViewing = params["isViewing"];
          }
          if (this.networkId != null && this.uid != null && this.systemAdminId) {
            this.networkMapService.init(this.af, this.ngUnsubscribe, this.systemAdminId, this.networkId, this.networkCountryId, 
            (countries, minGreen, minYellow) => {              
              this.countries = countries;
              this.minGreen = minGreen;
              this.minYellow = minYellow;
              this.setLocation(countries)
            }, (country) => {
              this.showDialog(country);
            });
          }
          else {
            this.uid = user.uid;
            this.networkService.getSelectedIdObj(this.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(selection => {

                this.networkId = selection['id'];
                this.networkCountryId = selection['networkCountryId'];

                // TODO: Delete this method when page control does auth properly

                this.getSystemAdmin(this.uid, (systemAdminId => {
                  this.networkMapService.init(this.af, this.ngUnsubscribe, systemAdminId, this.networkId, this.networkCountryId,
                    (countries, minGreen, minYellow) => {              
                      this.countries = countries;
                      this.minGreen = minGreen;
                      this.minYellow = minYellow;
                      this.setLocation(countries)
                    }, (country) => {
                      this.showDialog(country);
                    });
                }));
              });
          }
        });
    });
  }

  private setLocation(countries) {
    let position = 0;

    var promise = new Promise((resolve, reject) => {
      countries.forEach(country => {
        let count: number = 0;

        if (country.hazards.length > 0) {
          this.hazardExist = true

            for(let hazard of country.hazards) {
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
                    src: HazardImages.init().get(hazard.hazardScenario)
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

                if (count == country.hazards.length) {
                  resolve();
                }
              }
            })
          }
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
            jQuery('#minimum-prep-modal-' + Countries[x.location]).modal('show');
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

      if (x.overall(this.minGreen) == -1) {
        country.colour = 'blue'
      } else if (x.overall(this.minGreen) >= this.minGreen) {
        country.colour = 'red'
      } else if (x.overall(this.minGreen) >= this.minYellow) {
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

  gotoMapList(): void {
    if (this.isLocalNetworkAdmin) {
      this.router.navigateByUrl('/network/local-network-global-maps-list' + this.paramString)
    } else {
      if (this.paramString == null) {
        this.router.navigateByUrl('/network-country/network-global-map-list');
      }
      else {
        this.router.navigateByUrl('/network-country/network-global-map-list' + this.paramString);
      }
    }
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

  /**
   * Method to pull the system admin ID
   * TODO: Remove this when pagecontrol does the user permissions and returns this value
   */
  private getSystemAdmin(uid: string, done: (systemAdminId: string) => void) {
    this.af.database.object(Constants.APP_STATUS + "/administratorNetwork/" + uid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          // We're a Network Admin
          for (const key in snap.val().systemAdmin) {
            done(key);
          }
        }
        else {
          this.af.database.object(Constants.APP_STATUS + "/administratorNetworkCountry/" + uid, {preserveSnapshot: true})
            .takeUntil(this.ngUnsubscribe)
            .subscribe((anSnap) => {
              if (anSnap.val() != null) {
                // We're a Network Country Admin
                for (const key in anSnap.val().systemAdmin) {
                  done(key);
                }
              }
              else {
                // Not found?
                done(null);
              }
            });
        }
      });
  }

  public showDialog(countryCode: string) {
    jQuery('#minimum-prep-modal-' + countryCode).modal('show');
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