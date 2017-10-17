import {Injectable} from '@angular/core';
import {Constants} from '../utils/Constants';
import {Subject} from 'rxjs/Subject';
import {AngularFire} from 'angularfire2';
import {MapService} from "./map.service";
import {Countries} from "../utils/Enums";

/**
 * Network map service
 *
 * This will build up a data structure to handle showing the agency and country information
 *   on a map.
 *
 * Read the `countries` variable directly! It was made public intentionally for this! There's too much going on
 *   to attempt to figure this notify a component + needs to be reused in the list
 *
 * >> EXPLANATION OF THE DATA STRUCTURE IS IN A BLOCK COMMENT BELOW! PLEASE READ
 *
 * Responsibilities of this service are:
 *
 * GET all the countries their respective agencies of a given network
 * FOR (all countries in network)
 *     GET countryOffice and agency details
 * FOR (all countries in network)
 *     GET all hazards related to these items
 *     SAVE all hazards under the country
 *
 * READ system settings for MPA values
 * GET all actions in related countries
 * FOR (all actions)
 *     SAVE to agency under country (countries.get(agencyX))
 *     CALCULATE their average MPA value
 */

@Injectable()
export class NetworkMapService {

  private ngUnsubscribe: Subject<void>;
  private af: AngularFire;

  /* list of countries that will be populated by this service! */
  public countries: NetworkMapCountry[] = [];

  /* System settings */
  public minGreen: number = 70;
  public minYellow: number = 40;

  // Holding variable for mapping country ids to locations
  private countryIdToLocation: Map<string, number> = new Map<string, number>();
  private mCountryOfficeCounter: number = 0;

  public map: google.maps.Map;
  private geocoder: google.maps.Geocoder;

  constructor() {
  }

  public init(elementId: string, af: AngularFire, ngUnsubscribe: Subject<void>, systemAdminId: string, networkId: string, networkCountryId: string,
              done: () => void, countryClicked: (country: string) => void) {
    this.af = af;
    this.ngUnsubscribe = ngUnsubscribe;
    // Get the agencies of a network
    this.initMap(elementId);
    this.systemMpaGreenYellow(systemAdminId, (green, yellow) => {
      this.minGreen = green;
      this.minYellow = yellow;
      this.getAgencyCountriesOfNetwork(networkId, networkCountryId,
        (agencyHasCountriesMap => {
          agencyHasCountriesMap.forEach((value, key) => {
            value.forEach(item => {
              // Fire off a request to get the countryOffice for every country
              this.getCountryOffice(key, item, () => {
                /* ALL COUNTRY OFFICES FINISHED PULLING */
                this.initHazards();

                /**
                 * SAMPLE DATA
                 */
                this.countries = [];
                let mapNetwork = new NetworkMapCountry();
                mapNetwork.location = 0;

                let hazard1 = new NetworkMapHazard();
                hazard1.hazardScenario = 11;
                let hazard1i1 = new NetworkMapHazardRaised();
                hazard1i1.affectedAreas.push("China", "Taiwan");
                hazard1i1.agencyId = "3HtfeBm0c3WZoWgzATKNtLmDcWS2";
                hazard1i1.population = 1000;
                hazard1.instancesOfHazard.push(hazard1i1);
                let hazard1i2 = new NetworkMapHazardRaised();
                hazard1i2.affectedAreas.push("Tereneze", "Bangladesh");
                hazard1i2.agencyId = "3HtfeBm0c3WZoWgzATKNtLmDcWS2";
                hazard1i2.population = 43434;
                hazard1.instancesOfHazard.push(hazard1i2);
                mapNetwork.hazards.push(hazard1);


                let hazard2 = new NetworkMapHazard();
                hazard2.hazardScenario = 11;
                let hazard2i1 = new NetworkMapHazardRaised();
                hazard2i1.affectedAreas.push("AnotherTest", "Test");
                hazard2i1.agencyId = "3HtfeBm0c3WZoWgzATKNtLmDcWS2";
                hazard2i1.population = 2434234;
                hazard2.instancesOfHazard.push(hazard2i1);
                mapNetwork.hazards.push(hazard2);

                let agency = new NetworkMapAgency("3HtfeBm0c3WZoWgzATKNtLmDcWS2", "sgtbi94dm6dWLUbn2RtCbs9sm492addclose");
                agency.name = "Test Agency";
                agency.mpaComplete = 2;
                agency.mpaTotal = 3;
                mapNetwork.setAgency("3HtfeBm0c3WZoWgzATKNtLmDcWS2", agency);

                this.countries.push(mapNetwork);
                this.loadColoredLayers(countryClicked);
                done();
              });
            });
          });
        }));
      });
  }

  /**
   * Find all the hazards for a given country and store them in relation to the country
   */
  private initHazards() {
    for (const country of this.countries) {
      country.agencies.forEach((value, key) => {
        this.af.database.list(Constants.APP_STATUS + '/alert/' + value.countryId, {preserveSnapshot: true})
          .takeUntil(this.ngUnsubscribe)
          .subscribe((snap) => {
            for (let element of snap) {
              console.log(element.key);
              console.log(element.val());
            }
          });
      });
    }
  }

  /**
   * Will build a Map<string, Set<string>> mapping which countries are mapped to which agencies
   * Environment variable this is stored in is countryHasAgenciesMap
   * @param networkId
   * @param networkCountryId
   * @param done - Called when the agencies to countries call has been mapped
   */
  private getAgencyCountriesOfNetwork(networkId: string, networkCountryId: string,
                                      done: (agencyHasCountriesMap: Map<string, Set<string>>) => void) {
    console.log('Accessing ' + Constants.APP_STATUS + '/networkCountry/' + networkId + '/' + networkCountryId);
    this.af.database.object(Constants.APP_STATUS + '/networkCountry/' + networkId + '/' + networkCountryId,
      {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        // snap.val() contains object under networkCountry/<networkId>/<networkCountryId>
        if (snap.val() == null) {
          console.log('TODO: Show an error here. No network countries found');
        }
        else {
          const agencyHasCountriesMap: Map<string, Set<string>> = new Map<string, Set<string>>();
          if (snap.val().hasOwnProperty('agencyCountries')) {
            for (const agencyId in snap.val().agencyCountries) {
              for (const countryId in snap.val().agencyCountries[agencyId]) {
                if (snap.val().agencyCountries[agencyId][countryId].hasOwnProperty('isApproved')) {
                  if (snap.val().agencyCountries[agencyId][countryId].isApproved) {
                    let countriesSet: Set<string> = agencyHasCountriesMap.get(agencyId);
                    if (countriesSet == null) {
                      countriesSet = new Set<string>();
                    }
                    countriesSet.add(countryId);
                    agencyHasCountriesMap.set(agencyId, countriesSet);
                  }
                  else {
                    // Country is not approved. Leave it from the set
                  }
                }
                else {
                  // Reference doesn't have an 'isApproved' flag. We don't know if it's approved it not
                  // - Assume not, leave the set
                }
              }
            }
          }
          else {
            // Network country doesn't have any countries ! Set should remain empty
            agencyHasCountriesMap.clear();
          }

          /* At the end of this method;
            this.agencyHasCountriesMap should contain a list of agency -> [countries] that are approved!
           */
          done(agencyHasCountriesMap);
        }
      });
  }

  /**
   * Get the country office of a given country id.
   *  This will build the country -> agency portion of the data structure, populating any data required
   *  from the agency (logo, name, id);
   *
   * done() is only called once, counter is maintained so done() is only fired when all requests come back
   */
  private getCountryOffice(agencyId: string, countryId: string, done: () => void) {
    this.mCountryOfficeCounter++;
    this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId,
        {preserveSnapshot: true})
      .flatMap((snap) => {
        this.countryIdToLocation.set(snap.key, snap.val().location);
        // Ensure a country object for this country office is created
        const mapCountry: NetworkMapCountry = this.findOrCreateNetworkMapCountry(snap.val().location);
        mapCountry.setAgency(agencyId, new NetworkMapAgency(agencyId, countryId));
        return this.af.database.object(Constants.APP_STATUS + '/agency/' + agencyId, {preserveSnapshot: true});
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        let mapCountry: NetworkMapCountry = this.findOrCreateNetworkMapCountry(this.countryIdToLocation.get(countryId));
        let agency: NetworkMapAgency = mapCountry.getAgency(snap.key);
        if (agency != null) {
          agency.name = snap.val().name;
          agency.image = snap.val().logoPath;
        }
        this.mCountryOfficeCounter--;
        if (this.mCountryOfficeCounter == 0) {
          done();
        }
      });
  }

  /**
   * Get the System level settings for mpa GREEN and YELLOW
   */
  systemMpaGreenYellow(systemAdminId: string, results: (green: number, yellow: number) => void) {
    this.af.database.object(Constants.APP_STATUS + "/system/" + systemAdminId + "/minThreshold", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        results(snap.val()[0], snap.val()[1]);
      });
  }

  /**
   * Load the coloured layers onto the map based on this.countries
   */
  public loadColoredLayers(countryClicked: (country: string) => void) {
    let blue: string[] = [];
    let red: string[] = [];
    let yellow: string[] = [];
    let green: string[] = [];

    for (let x of this.countries) {
      if (x.overall(this.minGreen) == -1) {
        blue.push(Countries[x.location]);
      }
      else if (x.overall(this.minGreen) >= this.minGreen) {
        green.push(Countries[x.location]);
      }
      else if (x.overall(this.minGreen) >= this.minYellow) {
        yellow.push(Countries[x.location]);
      }
      else {
        red.push(Countries[x.location]);
      }
    }

    let layer = new google.maps.FusionTablesLayer({
      suppressInfoWindows: true,
      query: {
        select: '*',
        from: '1Y4YEcr06223cs93DmixwCGOsz4jzXW_p4UTWzPyi',
        where: MapService.arrayToQuote(red.concat(yellow.concat(green.concat(blue))))
      },
      styles: [
        {
          polygonOptions: {
            fillColor: '#f00ff9',
            strokeOpacity: 0.0
          }
        },
        {
          where: MapService.arrayToQuote(blue),
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
          where: MapService.arrayToQuote(red),
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
          where: MapService.arrayToQuote(yellow),
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
          where: MapService.arrayToQuote(green),
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

  /**
   * Initialise a blank map
   */
  private initMap(elementId: string) {
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

  /**
   * Utility methods to interact with the below datastructure
   */
  public findOrCreateNetworkMapCountry(location: number): NetworkMapCountry {
    for (const x of this.countries) {
      if (x.location === location) {
        return x;
      }
    }
    const newCountry: NetworkMapCountry = new NetworkMapCountry();
    newCountry.location = location;
    this.countries.push(newCountry);
    return newCountry;
  }
}

/**
 * Below are classes to help display the network map data. It works via
 *   the following data structure. In essence, a country can have
 *  - Many hazards (including same agency reporting multiple hazards)
 *  - Many agencies
 *
 * Data structure below should handle this
 *
 * NetworkMapCountry
 *  - location
 *  - agencies: Map of agencyId => NetworkMapAgency
 *                                  - name
 *                                  - agencyId
 *                                  - countryId          << stored here because in this object we're relating to a
 *                                                          specific object, NetworkMapCountry is generic as a 'country'
 *                                  - image
 *                                  - mpaValue
 *  - hazards: List of NetworkMapHazard
 *                      - hazardScenario
 *                      - customHazard
 *                      - List of NetworkMapHazardRaised
 *                                 - population
 *                                 - agencyId
 *                                 - affectedAreas: List
 *
 * The same hazard can be reported by multiple agencies to the same country with
 *   different parameters every time. This is accounted for with the
 *   NetworkMapHazardRaised object, these detail specific hazards reported!
 *
 * The box at the top of the dialog should look like this to accommodate the
 *   above scenario
 * +-------------------------------------------------------------+
 * | Risk:        Affected Area:    Population:     Raised by:   |
 * | Typhoon      London            2000            Agency A     |
 * |              Birmingham        3000            Agency B     |
 * |-------------------------------------------------------------|
 * | Risk:        Affected Area:    Population:     Raised by:   |
 * | Earthquake   Nottingham        4000            Agency A     |
 * +-------------------------------------------------------------+
 */

export class NetworkMapCountry {
  public location: number;
  public agencies: NetworkMapAgency[] = []; // ARRAY DUE TO ANGULAR ITERATING
  public hazards: NetworkMapHazard[] = [];

  public overall(minGreen: number): number {
    if (this.agencies.length > 0) {
      let complete: number = 0;
      let total: number = 0;
      for (let x of this.agencies) {
        if (x.overall() >= minGreen) {
          complete++;
        }
        total++;
      }
      return (complete * 100) / total;
    }
    else {
      return 0;
    }
  }

  public getAgency(key: string): NetworkMapAgency {
    for (let agency of this.agencies) {
      if (agency.id == key) {
        return agency;
      }
    }
    return null;
  }
  public setAgency(key: string, agency: NetworkMapAgency) {
    let ag: NetworkMapAgency = this.getAgency(key);
    if (ag == null) {
      this.agencies.push(agency);
    }
    else {
      ag.mpaTotal = agency.mpaTotal;
      ag.mpaComplete = agency.mpaComplete;
      ag.name = agency.name;
      ag.countryId = agency.countryId;
      ag.image = agency.image;
    }
  }

  constructor() {
  }
}

export class NetworkMapAgency {
  public id: string;
  public name: string;
  public image: string;
  public countryId: string;
  public mpaComplete: number;
  public mpaTotal: number;

  public overall(): number {
    return (this.mpaComplete * 100) / this.mpaTotal;
  }

  constructor(id: string, countryId: string) {
    this.countryId = countryId;
    this.id = id;
  }
}

export class NetworkMapHazard {
  public hazardScenario: number;
  public customHazard: string;
  public instancesOfHazard: NetworkMapHazardRaised[] = [];
}

export class NetworkMapHazardRaised {
  public population: number;
  public agencyId: string;
  public affectedAreas: string[] = [];
}

