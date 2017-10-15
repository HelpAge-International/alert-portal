import {Injectable} from '@angular/core';
import {Constants} from '../utils/Constants';
import {Subject} from 'rxjs/Subject';
import {AngularFire} from 'angularfire2';

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

  // Holding variable for mapping country ids to locations
  private countryIdToLocation: Map<string, number> = new Map<string, number>();
  private mCountryOfficeCounter: number = 0;

  constructor() {
  }

  public init(af: AngularFire, ngUnsubscribe: Subject<void>, networkId: string, networkCountryId: string) {
    this.af = af;
    this.ngUnsubscribe = ngUnsubscribe;
    // Get the agencies of a network
    this.getAgencyCountriesOfNetwork(networkId, networkCountryId,
      (agencyHasCountriesMap => {
        agencyHasCountriesMap.forEach((value, key) => {
          value.forEach(item => {
            // Fire off a request to get the countryOffice for every country
            this.getCountryOffice(key, item, () => {
              /* ALL COUNTRY OFFICES FINISHED PULLING */
              this.initHazards();
            });
          });
        });
      }));
  }
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
        mapCountry.agencies.set(agencyId, new NetworkMapAgency(agencyId, countryId));
        return this.af.database.object(Constants.APP_STATUS + '/agency/' + agencyId, {preserveSnapshot: true});
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        let mapCountry: NetworkMapCountry = this.findOrCreateNetworkMapCountry(this.countryIdToLocation.get(countryId));
        let agency: NetworkMapAgency = mapCountry.agencies.get(snap.key);
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
  public agencies: Map<string, NetworkMapAgency>;
  public hazards: NetworkMapHazard[] = [];

  constructor() {
    this.agencies = new Map<string, NetworkMapAgency>();
  }
}

export class NetworkMapAgency {
  public id: string;
  public name: string;
  public image: string;
  public countryId: string;
  public mpaValue: number;

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

