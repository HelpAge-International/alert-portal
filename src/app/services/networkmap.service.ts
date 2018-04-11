import {Injectable} from '@angular/core';
import {Constants} from '../utils/Constants';
import {Subject} from 'rxjs/Subject';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {MapService} from './map.service';
import {ActionLevel, ActionType, AlertLevels, Countries, CountriesMapsSearchInterface} from '../utils/Enums';
import {CommonService} from './common.service';
import GeocoderResult = google.maps.GeocoderResult;
import GeocoderStatus = google.maps.GeocoderStatus;
import {HazardImages} from '../utils/HazardImages';
import {PrepActionService} from './prepactions.service';
import {Observable} from "rxjs/Observable";

/**
 * Network map service
 *
 * This will build up a data structure to handle showing the agency and country information
 *   on a map.
 *
 * Read the `countries` variable directly! It was made public intentionally for this! There's too much going on
 *   to attempt to figure this notify a component + needs to be reused in the list
 *
 * >> EXPLANATION OF THE DATA STRUCTURE IS IN A BLOCK COMMENT BELOW (bottom of file)! PLEASE READ
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

  // AgencyId -> Name map. Used for the list of hazards in the UI
  public AGENCY_ID_NAME_MAP: Map<string, string> = new Map<string, string>();

  public map: google.maps.Map;
  private geocoder: google.maps.Geocoder;

  private networkId: String;
  private networkCountryId: String;

  constructor(private jsonService: CommonService) {
    this.AGENCY_ID_NAME_MAP = new Map<string, string>();
    this.geocoder = new google.maps.Geocoder;
  }

  /**
   * Get system MPA values
   * (minYellow, minGreen) =>
   *      Gets the agencies => [countries] of the network
   *          Gets the CO of every country
   *               (ALL DONE)
   *               Initialises the hazards of everywhere
   *               Loads the coloured layer with the countries
   *                   Get the MPA values for each (mpaComplete / mpaTotal)
   */
  public init(elementId: string, af: AngularFire, ngUnsubscribe: Subject<void>, systemAdminId: string, networkId: string, networkCountryId: string,
              done: () => void, countryClicked: (country: string) => void) {
    console.log("NetworkId: " + networkId);
    console.log("Network Country Id: " + networkCountryId);
    this.networkId = networkId;
    this.networkCountryId = networkCountryId;
    this.af = af;
    this.ngUnsubscribe = ngUnsubscribe;
    // Get the agencies of a network
    //TODO: When Network
    if (elementId != null) {
      this.initMap(elementId);
    }
    this.systemMpaGreenYellow(systemAdminId, (green, yellow) => {
      this.minGreen = green;
      this.minYellow = yellow;
      console.log("Min Green: " + this.minGreen);
      console.log("Min Yellow: " + this.minYellow);
      if (networkCountryId == null || networkCountryId == undefined) {
        this.getAgencyCountriesOfNetwork(networkId,
          ((agencyHasCountriesMap, cVal) => {
            this.process(agencyHasCountriesMap, cVal, systemAdminId, done, countryClicked)
          }));
      }
      else {
        this.getAgencyCountriesOfNetworkCountry(networkId, networkCountryId,
          ((agencyHasCountriesMap, cVal) => {
            this.process(agencyHasCountriesMap, cVal, systemAdminId, done, countryClicked)
          }));
      }
    });
  }

  private process(agencyHasCountriesMap: Map<string, Set<string>>, cVal: number, systemAdminId: string,
                  done: () => void, countryClicked: (country: string) => void) {
    console.log(agencyHasCountriesMap);
    agencyHasCountriesMap.forEach((value, key) => {
      value.forEach(item => {
        // Fire off a request to get the countryOffice for every country
        this.getCountryOffice(key, item, cVal, () => {
          /* ALL COUNTRY OFFICES FINISHED PULLING
           *   Even though we're in a forEach, counter is maintained so this method fires when
           *   they are all done */
          this.initHazards();
          this.loadColoredLayers(countryClicked);
          for (const x of this.countries) {
            for (const agencyX of x.agencies) {
              this.getAllMPAValuesToCountries(agencyX.countryId, agencyX.id, systemAdminId, () => {
                /* ALL MPA VALUES FOUND FOR ALL COUNTRY OFFICES
                 *   Even though we're in a two for loops, counter is maintained inside getAllMPAValuesToCountries
                 *   so this method fires when they are all done */
                done();
              });
            }
          }
        });
      });
    });
  }

  /**
   * Find all the MPA values of a given country office.
   * - Use the id (agency) and countryId (country) inside the NetworkMapAgency object
   *   to query the actions nodes and figure out how many are completed
   */
  private mpaCounter: number = 0;
  private getAllMPAValuesToCountries(countryId: string, agencyId: string, systemId: string, done: () => void) {
    for (const x of this.countries) {
      this.mpaCounter++;

      this.getActionsFor(countryId, agencyId, systemId, (holder) => {
        const nMA: NetworkMapAgency = x.getAgency(agencyId);
        nMA.mpaTotal = holder.mpaTotal.size;
        nMA.mpaComplete = holder.mpaComplete.size;


        this.mpaCounter--;
        if (this.mpaCounter == 0) {
          done();
        }
      });
    }
  }

  /**
   * Get all the action objects for a given country id and callback when done!
   * - actionCHS. Import and store all data
   *    - actionMandated. Import and store all data
   *        - action. Import and merge all data with previous
   *            - Callback with entire list to show it's done
   */
  private getActionsFor(countryId: string, agencyId: string, systemId: string, done: (holder: NetworkMapActionHolder) => void) {
    const holder: NetworkMapActionHolder = new NetworkMapActionHolder();
    this.downloadDefaultClockSettings(agencyId, (value, durationType) => {
      // this.af.database.list(Constants.APP_STATUS + '/actionCHS/' + systemId, {preserveSnapshot: true})
      //   .flatMap((chsSnap) => {
      //     for (const x of chsSnap) {
      //       holder.mpaTotal.add(x.key);
      //     }
      //     return this.af.database.list(Constants.APP_STATUS + '/actionMandated/' + agencyId, {preserveSnapshot: true});
      //   })
      this.af.database.list(Constants.APP_STATUS + '/actionMandated/' + agencyId, {preserveSnapshot: true})
        .flatMap((mandatedSnap) => {
          for (const x of mandatedSnap) {
            if (x.val().level == ActionLevel.MPA) {
              holder.mpaTotal.add(x.key);
            }
          }
          return this.af.database.list(Constants.APP_STATUS + '/action/' + countryId, {preserveSnapshot: true});
        })
        .map((actionSnap) => {
          for (const x of actionSnap) {
            if (x.val().level == ActionLevel.MPA || holder.mpaTotal.has(x.key)) {
              let calculatedClock: number = new Date().getTime();
              if (x.val().hasOwnProperty('frequencyBase') && x.val().hasOwnProperty('frequencyValue')) {
                calculatedClock = PrepActionService.clockCalculation(x.val().frequencyValue, x.val().frequencyBase);
              }
              else {
                calculatedClock = PrepActionService.clockCalculation(value, durationType);
              }
              if (x.val().isComplete && x.val().isCompleteAt != null &&                    // Has a completed date!
                !x.val().isArchived &&                                                      // Isn't archived
                x.val().isCompleteAt + calculatedClock > (new Date()).getTime()) {         // Hasn't expired
                holder.mpaComplete.add(x.key);
              }
              holder.mpaTotal.add(x.key);
            }
          }
          return holder;
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe((holder) => {
          done(holder);
        });
    });
  }
  private downloadDefaultClockSettings(agencyId: string, fun: (value: number, durationType: number) => void) {
    this.af.database.object(Constants.APP_STATUS + '/agency/' + agencyId + '/clockSettings/preparedness', {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          fun(snap.val().value, snap.val().durationType);
        }
      });
  }

  /**
   * Find all the hazards for a given country and store them in relation to the country
   */
  private initHazards() {
    for (const country of this.countries) {
      for (const agency of country.agencies) {
        this.af.database.list(Constants.APP_STATUS + '/alert/' + agency.countryId, {preserveSnapshot: true})
          .takeUntil(this.ngUnsubscribe)
          .subscribe((snap) => {
            for (const element of snap) {
              let res: boolean = true;
              // let lock: boolean = false;
              for (const userTypes in element.val().approval) {
                for (const thisUid in element.val().approval[userTypes]) {
                  if (element.val().approval[userTypes][thisUid] != 1) {
                    res = false;
                  }
                }
              }
              if (element.val().alertLevel != AlertLevels.Red) {
                res = false
              }
              //if (!lock && res) {
              if (res) {
                // Everyone on the approval list has approved it. Uncomment the three 'lock' comments if you require ALL
                //   on the approval list to approve
                const networkMapHazard: NetworkMapHazard = country.getHazard(element.val().hazardScenario, element.val().customHazard);
                if (element.val().hazardScenario == -1) {
                  // TODO: Check that the custom hazard fields are stored under customHazard!
                  // Swap it out as the reference to it
                  this.af.database.object(Constants.APP_STATUS + '/hazardOther/' + element.val().customHazard, {preserveSnapshot: true})
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((hazardSnap) => {
                      if (hazardSnap.val() != null) {
                        networkMapHazard.customHazard = hazardSnap.val().name;
                      }
                    });
                }
                const raised: NetworkMapHazardRaised = new NetworkMapHazardRaised();
                let lengthOfHazard = networkMapHazard.instancesOfHazard.length;
                raised.population = element.val().estimatedPopulation;
                raised.agencyName = agency.name;
                if (lengthOfHazard != 1) {
                  this.jsonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).subscribe((value) => {
                    for (const x of element.val().affectedAreas) {
                      const obj = {
                        country: '',
                        areas: ''
                      };
                      if (x.country > -1) {
                        obj.country = this.getCountryNameById(x.country);
                      }
                      if (x.level1 > -1) {
                        obj.areas = ', ' + value[x.country].levelOneValues[x.level1].value;
                      }
                      if (x.level2 > -1) {
                        obj.areas = obj.areas + ', ' + value[x.country].levelOneValues[x.level1].levelTwoValues[x.level2].value;
                      }
                      raised.affectedAreas.push({country: obj.country, areas: obj.areas});

                    }
                    let alreadyAdded = false;
                    for (let x of networkMapHazard.instancesOfHazard) {
                      if (raised.population == x.population && raised.agencyName == x.agencyName
                          && ((x.affectedAreas == null && raised.affectedAreas == null) || (x.affectedAreas.length == raised.affectedAreas.length))) {
                        alreadyAdded = true;
                      }
                    }
                    if (!alreadyAdded) {
                      networkMapHazard.instancesOfHazard.push(raised);
                    }
                    this.placeMarker(country.location, networkMapHazard.hazardScenario);
                  });
                } else {
                  console.log('do nothing!');
                }
              }
            }
          });
      }
    }
  }
  private getCountryNameById(countryId: number) {
    return Constants.COUNTRIES[countryId];
  }

  /**
   * Place a marker at countryLocation (location) with the following hazardScenario!
   * - Infers it from a GPS search
   */
  private placeMarker(location: number, hazardScenario: number) {
    let position: number = 0;
    let count: number = 0;
    this.geocoder.geocode({'address': CountriesMapsSearchInterface.getEnglishLocationFromEnumValue(location)}, (geoResult: GeocoderResult[], status: GeocoderStatus) => {
      if (status == GeocoderStatus.OK && geoResult.length >= 1) {
        const pos = {
          lng: geoResult[0].geometry.location.lng() + position,
          lat: geoResult[0].geometry.location.lat()
        };
        const marker = new google.maps.Marker({
          position: pos,
          icon: HazardImages.init().get(hazardScenario)
        });
        marker.setMap(this.map);
        count++;

        // Attempts to pseudo-randomise the markers on the map so they don't appear in the same place and get hidden
        if (count % 2 == 0) {
          position *= -1;
        }
        else {
          position += 1.2;
        }
      }
    });
  }
  /**
   * Find all the countries and their agencies from the networkCountry node!
   * Same callback as getAgencyCountriesOfNetwork method, to keep the underlying structure consistent (see method below)
   *
   * If the network country ID is specified, the maps requirement as I understand it is
   *   that it shows "all network countries under _my_ network", which would be the network ID
   *   This method will query all nodes under `/networkCountry/<network_id/` and process all network countries
   *   under there
   */
  private getAgencyCountriesOfNetworkCountry(networkId: string, networkCountryId: string, done: (agencyHasCountriesMap: Map<string, Set<string>>, countryCodeLimiter?: number) => void) {
    console.log(">> NETWORK + NETWORK COUNTRY <<");
    this.af.database
      .list(Constants.APP_STATUS + "/networkCountry/" + networkId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snapshot) => {
        const agencyHasCountriesMap: Map<string, Set<string>> = new Map<string, Set<string>>();
        for (let snap of snapshot) {
          if (snap.val().isActive) {
            if (snap.val().hasOwnProperty("agencyCountries")) {
              for (const agency in snap.val().agencyCountries) {
                for (const country in snap.val().agencyCountries[agency]) {
                  if (snap.val().agencyCountries[agency][country].hasOwnProperty("isApproved") && snap.val().agencyCountries[agency][country].isApproved) {
                    // agency / country is approved from the Network Country
                    let set: Set<string> = new Set<string>();
                    set.add(country);
                    agencyHasCountriesMap.set(agency, set);
                  }
                }
              }
            }
          }
        }
        done(agencyHasCountriesMap);
      });
  }


  /**
   * Will build a Map<string, Set<string>> mapping agencies have which countries
   * Environment variable this is stored in is countryHasAgenciesMap
   * @param networkId
   * @param done - Called when the agencies to countries call has been mapped
   */
  private getAgencyCountriesOfNetwork(networkId: string, done: (agencyHasCountriesMap: Map<string, Set<string>>, countryCodeLimiter?: number) => void) {
    console.log(">> NETWORK <<");
    this.af.database
      .object(Constants.APP_STATUS + "/network/" + networkId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        let cVal: number = -1;
        if (snap.val().hasOwnProperty("isGlobal") && !snap.val().isGlobal) {
          // LOCAL NETWORK. Get the country constraint from the leadAgencyId and agency > countryCode
          cVal = snap.val().countryCode;
        }
        this.countryIdFromAgencyIdCounter = 0;
        const agencyHasCountriesMap: Map<string, Set<string>> = new Map<string, Set<string>>();
        if (snap.val().hasOwnProperty("agencies") != null) {
          let validAgencyIds: string[] = [];
          for (let x in snap.val().agencies) {
            if (snap.val().agencies[x].isApproved) {
              validAgencyIds.push(x);
            }
          }

          // Process the info
          for (let x of validAgencyIds) {
            this.countryIdFromAgencyIdCounter++;
            this.getCountryIdsFromAgencyId(x, (countries) => {
              this.countryIdFromAgencyIdCounter--;
              agencyHasCountriesMap.set(x, countries);
              if (this.countryIdFromAgencyIdCounter == 0) {
                done(agencyHasCountriesMap, cVal == -1 ? null : cVal);
              }
            });
          }
        }
      });
  }
  private countryIdFromAgencyIdCounter = 0;
  private getCountryIdsFromAgencyId(agencyId: string, done: (countries: Set<string>) => void) {
    this.af.database
      .list(Constants.APP_STATUS + "/countryOffice/" + agencyId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        let keys: Set<string> = new Set<string>();
        for (let x of snap) {
          keys.add(x.key);
        }
        done(keys);
      })
  }
  // private getAgencyCountriesOfNetwork(networkId: string, networkCountryId: string,
  //                                     done: (agencyHasCountriesMap: Map<string, Set<string>>) => void) {
    // console.log('Accessing ' + Constants.APP_STATUS + '/networkCountry/' + networkId + '/');
    // this.af.database.object(Constants.APP_STATUS + '/networkCountry/' + networkId + '/' + networkCountryId,
    //   {preserveSnapshot: true})
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe((snap) => {
    //     // snap.val() contains object under networkCountry/<networkId>/<networkCountryId>
    //     if (snap.val() == null) {
    //       console.log('TODO: Show an error here. No network countries found');
    //     }
    //     else {
    //       const agencyHasCountriesMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    //       if (snap.val().hasOwnProperty('agencyCountries')) {
    //         for (const agencyId in snap.val().agencyCountries) {
    //           for (const countryId in snap.val().agencyCountries[agencyId]) {
    //             if (snap.val().agencyCountries[agencyId][countryId].hasOwnProperty('isApproved')) {
    //               if (snap.val().agencyCountries[agencyId][countryId].isApproved) {
    //                 let countriesSet: Set<string> = agencyHasCountriesMap.get(agencyId);
    //                 if (countriesSet == null) {
    //                   countriesSet = new Set<string>();
    //                 }
    //                 countriesSet.add(countryId);
    //                 agencyHasCountriesMap.set(agencyId, countriesSet);
    //               }
    //               else {
    //                 // Country is not approved. Leave it from the set
    //               }
    //             }
    //             else {
    //               // Reference doesn't have an 'isApproved' flag. We don't know if it's approved it not
    //               // - Assume not, leave the set
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         // Network country doesn't have any countries ! Set should remain empty
    //         agencyHasCountriesMap.clear();
    //       }
    //
    //       /* At the end of this method;
    //         this.agencyHasCountriesMap should contain a list of agency -> [countries] that are approved!
    //        */
    //       done(agencyHasCountriesMap);
    //     }
    //   });
  // }

  /**
   * Get the country office of a given country id.
   *  This will build the country -> agency portion of the data structure, populating any data required
   *  from the agency (logo, name, id);
   *
   * done() is only called once, counter is maintained so done() is only fired when all requests come back
   */
  private getCountryOffice(agencyId: string, countryId: string, onlyPickCountryLocationEnum: number, done: () => void) {
    this.mCountryOfficeCounter++;
    this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId,
        {preserveSnapshot: true})
      .flatMap((snap) => {
        console.log(onlyPickCountryLocationEnum);
        console.log(snap.val());
        if (onlyPickCountryLocationEnum == null || onlyPickCountryLocationEnum == undefined || onlyPickCountryLocationEnum == snap.val().location) {
          this.countryIdToLocation.set(snap.key, snap.val().location);
          // Ensure a country object for this country office is created
          const mapCountry: NetworkMapCountry = this.findOrCreateNetworkMapCountry(snap.val().location);
          mapCountry.setAgency(agencyId, new NetworkMapAgency(agencyId, countryId));
        }
        return this.af.database.object(Constants.APP_STATUS + '/agency/' + agencyId, {preserveSnapshot: true});
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap != null && snap.val() != null) {
          console.log(snap.val());
          const mapCountry: NetworkMapCountry = this.findNetworkMapCountry(this.countryIdToLocation.get(countryId));
          if (mapCountry != null) {
            const agency: NetworkMapAgency = mapCountry.getAgency(snap.key);
            if (agency != null) {
              agency.name = snap.val().name;
              agency.image = snap.val().logoPath;
              // Save this relationship to the map as well for the potential hazards!
              this.AGENCY_ID_NAME_MAP.set(snap.key, agency.name);
            }
          }
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
    this.af.database.object(Constants.APP_STATUS + '/system/' + systemAdminId + '/minThreshold', {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        results(snap.val()[0], snap.val()[1]);
      });
  }

  //region Map initialisation and fusion layer logic

  /**
   * Load the coloured layers onto the map based on this.countries
   */
  public loadColoredLayers(countryClicked: (country: string) => void) {
    const blue: string[] = [];
    const red: string[] = [];
    const yellow: string[] = [];
    const green: string[] = [];
    console.log(this.countries);
    for (const x of this.countries) {
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
      console.log(x.location);
    }

    const layer = new google.maps.FusionTablesLayer({
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
            strokeColor: '#FFFFFF'
          },
          polylineOptions: {
            strokeColor: '#FFFFFF',
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
            strokeColor: '#FFFFFF'
          },
          polylineOptions: {
            strokeColor: '#FFFFFF',
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
            strokeColor: '#FFFFFF'
          },
          polylineOptions: {
            strokeColor: '#FFFFFF',
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
            strokeColor: '#FFFFFF'
          },
          polylineOptions: {
            strokeColor: '#FFFFFF',
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
    const uluru = {lat: 20, lng: 0};
    this.map = new google.maps.Map(document.getElementById(elementId), {
      zoom: 2,
      center: uluru,
      mapTypeControlOptions: {
        mapTypeIds: []
      },
      streetViewControl: false,
      styles: [
        {
          elementType: 'geometry',
          stylers: [
            {
              'color': '#b0b1b3'
            }
          ]
        },
        {
          elementType: 'labels',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [
            {
              'color': '#523735'
            }
          ]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [
            {
              'color': '#c9b2a6'
            }
          ]
        },
        {
          featureType: 'administrative.country',
          elementType: 'geometry.stroke',
          stylers: [
            {
              'color': '#f0f0f1'
            }
          ]
        },
        {
          featureType: 'administrative.country',
          elementType: 'labels',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'administrative.land_parcel',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'geometry.stroke',
          stylers: [
            {
              'color': '#dcd2be'
            }
          ]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [
            {
              'color': '#ae9e90'
            }
          ]
        },
        {
          featureType: 'administrative.locality',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'administrative.neighborhood',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'administrative.province',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'landscape.man_made',
          stylers: [
            {
              'color': '#b0b1b3'
            }
          ]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry.fill',
          stylers: [
            {
              'color': '#b0b1b3'
            }
          ]
        },
        {
          featureType: 'landscape.natural.terrain',
          stylers: [
            {
              'color': '#b0b1b3'
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              'color': '#dfd2ae'
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [
            {
              'color': '#93817c'
            }
          ]
        },
        {
          featureType: 'poi.park',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'poi.business',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [
            {
              'color': '#a5b076'
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [
            {
              'color': '#447530'
            }
          ]
        },
        {
          featureType: 'road',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [
            {
              'color': '#f5f1e6'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'labels',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'labels.icon',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [
            {
              'color': '#fdfcf8'
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [
            {
              'color': '#f8c967'
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            {
              'color': '#e9bc62'
            }
          ]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [
            {
              'color': '#e98d58'
            }
          ]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [
            {
              'color': '#db8555'
            }
          ]
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [
            {
              'color': '#806b63'
            }
          ]
        },
        {
          featureType: 'transit',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [
            {
              'color': '#dfd2ae'
            }
          ]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.fill',
          stylers: [
            {
              'color': '#8f7d77'
            }
          ]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              'color': '#ebe3cd'
            }
          ]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [
            {
              'color': '#dfd2ae'
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [
            {
              'color': '#e5eff7'
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'labels.text',
          stylers: [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [
            {
              'color': '#92998d'
            }
          ]
        }
      ]
    });
  }

  //end region

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

  public findNetworkMapCountry(location: number): NetworkMapCountry {
    for (const x of this.countries) {
      if (x.location === location) {
        return x;
      }
    }
    return null;
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
      for (const x of this.agencies) {
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

  public getHazard(hazardScenario: number, otherHazard: string) {
    for (const hz of this.hazards) {
      if (hz.hazardScenario == hazardScenario && hazardScenario != -1) {
        return hz;
      }
    }
    const hz: NetworkMapHazard = new NetworkMapHazard(hazardScenario, otherHazard);
    this.hazards.push(hz);
    return hz;
  }

  public getAgency(key: string): NetworkMapAgency {
    for (const agency of this.agencies) {
      if (agency.id == key) {
        return agency;
      }
    }
    return null;
  }
  public setAgency(key: string, agency: NetworkMapAgency) {
    const ag: NetworkMapAgency = this.getAgency(key);
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
    let returnVal: number = (this.mpaComplete * 100) / this.mpaTotal;
    if (isNaN(returnVal)) {
      return 0;
    }
    else {
      return returnVal;
    }
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

  constructor(hS: number, cH: string) {
    this.hazardScenario = hS;
    this.customHazard = cH;
  }
}

export class NetworkMapHazardRaised {
  public population: number;
  public agencyName: string;
  public affectedAreas: any[] = [];
}

/**
 * Network Map Action Holder
 */
export class NetworkMapActionHolder {
  public mpaComplete: Set<string>;
  public mpaTotal: Set<string>;

  constructor() {
    this.mpaTotal = new Set<string>();
    this.mpaComplete = new Set<string>();
  }
}
