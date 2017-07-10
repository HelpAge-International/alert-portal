import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import {ActionLevel, ActionType, AlertLevels, Countries, HazardScenario, UserType} from "../utils/Enums";
import {PrepActionService} from "./prepactions.service";
import {ModelDepartment} from "../model/department.model";
import {AgencyModulesEnabled, PageControlService} from "./pagecontrol.service";
import {ModelRegion} from "../model/region.model";
import GeocoderStatus = google.maps.GeocoderStatus;
import {HazardImages} from "../utils/HazardImages";
import GeocoderResult = google.maps.GeocoderResult;
/**
 * Created by jordan on 09/07/2017.
 */

export class MapService {

  public static COLOUR_BLUE = "#2F3270";
  public static COLOUR_RED = "#CD2811";
  public static COLOUR_YELLOW = "#E3A700";
  public static COLOUR_GREEN = "#5BA920";

  private uid: string;
  private agencyId: string;
  private systemId: string;
  private initMapEnabled: boolean = false;

  private af: AngularFire;
  private ngUnsubscribe: Subject<void>;
  public map: google.maps.Map;
  private geocoder: google.maps.Geocoder;

  // Values for all the calculations
  // Threshold
  private threshGreen: number;
  private threshYellow: number;
  // Clock settings
  private defaultClockValue: number;
  private defaultClockType: number;
  // Departments
  private departmentMap: Map<string, string> = new Map<string, string>();
  private departments: ModelDepartment[] = [];
  private date: number = (new Date()).getTime();

  private mapCountries: Map<string, MapCountry> = new Map<string, MapCountry>();
  public listCountries: MapCountry[] = [];
  private holderCHSActions: Map<string, MapPrepAction> = new Map<string, MapPrepAction>();
  private holderMandatedActions: Map<string, MapPrepAction> = new Map<string, MapPrepAction>();
  private modulesEnabled: AgencyModulesEnabled = new AgencyModulesEnabled();

  private done: (countries: MapCountry[], green: number, yellow: number) => void;
  private clickedCountry: (country: string) => void;



  public static init(af: AngularFire, ngUnsubscribe: Subject<void>): MapService {
    let x: MapService = new MapService();
    x.af = af;
    x.ngUnsubscribe = ngUnsubscribe;
    x.geocoder = new google.maps.Geocoder;
    return x;
  }

  public initMap(elementId: string, uid: string, userType: UserType, agencyId: string, systemId: string, done:(countries: MapCountry[], minGreen: number, minYellow: number) => void, countryClicked: (country: string) => void)  {
    // Download everything we need then set the parallel actions calls going
    this.clickedCountry = countryClicked;
    this.initMapEnabled = true;
    if (this.map == null) {
      this.initBlankMap(elementId);
    }
    this.init(uid, userType, agencyId, systemId, done);
  }

  public initCountry(uid: string, userType: UserType, agencyId: string, systemId: string, done: (countries: MapCountry[], minGreen: number, minYellow: number) => void) {
    this.initMapEnabled = false;
    this.clickedCountry = null;
    this.init(uid, userType, agencyId, systemId, done);
  }

  private init(uid: string, userType: UserType, agencyId: string, systemId: string, done: (countries: MapCountry[], minGreen: number, minYellow: number) => void) {
    this.uid = uid;
    this.agencyId = agencyId;
    this.systemId = systemId;
    this.done = done;

    this.downloadThreshold(() => {
      this.downloadDefaultClockSettings(() => {
        this.downloadDepartments(() => {
          PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[userType], (isEnabled) => {
            this.modulesEnabled = isEnabled;
            this.beginDownloadAllActions();
          });
        })
      });
    });
  }

  /**
   * Method that's run when beginDownloadAllActions() above fully completes.
   * mapCountries will be fully populated
   *
   * - mapCountires is a map containing all countries and all actions underneath that country. This needs to
   *   be converted into a list and the actions isolated into departments
   */
  public doneDownloadingAllActions() {
    this.listCountries = [];
    this.mapCountries.forEach((value, key) => {
      value.calculateDepartments();
      this.listCountries.push(value);
      if (this.initMapEnabled) {
        let position = 0;
        value.hazards.forEach((_, hazardScenario) => {
          this.geocoder.geocode({"address": Countries[value.location]}, (geoResult: GeocoderResult[], status: GeocoderStatus) => {
            if (status == GeocoderStatus.OK && geoResult.length >= 1) {
              let pos = {
                lng: geoResult[0].geometry.location.lng() + position,
                lat: geoResult[0].geometry.location.lat()
              };
              let marker = new google.maps.Marker({
                position: pos,
                icon: HazardImages.init().get(hazardScenario)
              });
              marker.setMap(this.map);
              position += 1.2;
            }
          });
        });
      }
    });
    if (this.initMapEnabled) {
      this.doneWithEmbeddedStyles(this.clickedCountry);
    }
    this.done(this.listCountries, this.threshGreen, this.threshYellow);
  }

  private downloadThreshold(fun: () => void) {
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.systemId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val().minThreshold.length >= 2) {
          this.threshGreen = snap.val().minThreshold[0];
          this.threshYellow = snap.val().minThreshold[1];
          fun();
        }
      });
  }
  private downloadDefaultClockSettings(fun: () => void) {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/clockSettings/preparedness", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.defaultClockValue = snap.val().value;
          this.defaultClockType = snap.val().durationType;
          fun();
        }
      });
  }
  private downloadDepartments(fun: () => void) {
    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.departments = [];
        this.departmentMap.clear();
        for (let x of snap) {
          this.departmentMap.set(x.key, x.val());
          this.departments.push(ModelDepartment.create(x.key, x.val()));
        }
        fun();
      });
  }

  /**
   * Get all the actions
   *
   * There's a series of parallel methods and waiting that happens on this set of calls, the structure for which looks like
   *
   *      downloadAllCHSActions()       |                             |    downloadAllCountries(x)  -> processActions()  |
   *                                    |                             |                                                  |
   *  =>                                |=>   downloadAllCountries()  |=>  downloadAllCountries(x)  -> processActions()  |=> initMap();
   *                                    |                             |                                                  |
   *      downloadAllMandatedActions()  |                             |    downloadAllCountries(x)  -> processActions()  |
   *
   */
  private asyncWaitActionsCount: number = 0;
  private asyncWaitCount: number = 2;

  private beginDownloadAllActions() {
    this.downloadAllCHSActions();
    this.downloadAllMandatedActions();
  }

  private downloadAllCHSActions() {
    if (this.modulesEnabled.chsPreparedness) {
      this.af.database.list(Constants.APP_STATUS + "/actionCHS/" + this.systemId, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          for (let x of snap) {
            this.holderCHSActions.set(x.key, MapPrepAction.CHS(x.key, ActionLevel.MPA));
          }
          this.downloadAllCountries();
        });
    } else {
      this.downloadAllCountries();
    }
  }

  private downloadAllMandatedActions() {
    this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + this.agencyId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        for (let x of snap) {
          if (x.val().level == ActionLevel.MPA) {
            this.holderMandatedActions.set(x.key, MapPrepAction.Mandated(x.key, ActionLevel.MPA, x.val().department));
          }
        }
        this.downloadAllCountries()
      });
  }

  private downloadAllCountries() {
    this.asyncWaitCount--;
    if (this.asyncWaitCount == 0) {
      this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyId, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          this.asyncWaitActionsCount = snap.length * 2; // Two because downloadActions and initHazards
          for (let x of snap) {
            let mapCountry: MapCountry = new MapCountry(x.key, x.val().location);
            this.holderCHSActions.forEach((value, key) => {
              let copy: MapPrepAction = MapPrepAction.CHS(value.id, value.level);
              mapCountry.actionMap.set(key, copy);
            });
            this.holderMandatedActions.forEach((value, key) => {
              let copy: MapPrepAction = MapPrepAction.Mandated(value.id, value.level, value.department);
              mapCountry.actionMap.set(key, copy);
            });
            this.mapCountries.set(x.key, mapCountry);
            this.initAlerts(x.key);
            this.downloadActions(x.key);
          }
        });
    }
  }

  private downloadActions(id: string) {
    this.af.database.list(Constants.APP_STATUS + "/action/" + id, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        for (let x of snap) {
          if (x.val().level != ActionLevel.APA && (this.modulesEnabled.minimumPreparedness)) {
            this.processAction(id, x.key, x.val());
          }
        }
        this.doneDownloadingAndProcessingActions();
      });
  }

  private processAction(countryId: string, actionId: string, action: any) {
    let country: MapCountry = this.mapCountries.get(countryId);
    if (country.actionMap.get(actionId) != null) {
      let existing: MapPrepAction = country.actionMap.get(actionId);
      if (existing.department == null) {
        existing.department = action.department;
      }
      country.actionMap.set(actionId, existing);
    }
    else {
      let newItem: MapPrepAction = MapPrepAction.Custom(actionId, action.level, action.department);
      country.actionMap.set(actionId, newItem);
    }

    let val: MapPrepAction = country.actionMap.get(actionId);
    if (action.hasOwnProperty('isComplete')) {
      val.isComplete = action.isComplete;
      val.isCompleteAt = action.isCompleteAt;
    }
    if (action.hasOwnProperty('isArchived')) {
      val.isArchived = action.isArchived;
    }
    if (action.hasOwnProperty('frequencyBase') && action.hasOwnProperty('frequencyValue')) {
      val.calculatedClock = PrepActionService.clockCalculation(action.frequencyValue, action.frequencyBase);
    }
    else {
      val.calculatedClock = PrepActionService.clockCalculation(this.defaultClockValue, this.defaultClockType);
    }
    val.setIsComplete(this.date);
    country.actionMap.set(actionId, val);
  }

  private doneDownloadingAndProcessingActions() {
    this.asyncWaitActionsCount--;
    if (this.asyncWaitActionsCount == 0) {
      // Everything is done. Init the map!
      this.doneDownloadingAllActions();
    }
  }

  private initAlerts(countryId: string) {
    this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
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
        if (hazardRedAlert.size > 0) {
          let country: MapCountry = this.mapCountries.get(countryId);
          hazardRedAlert.forEach((value, key) => {
            if (value) {
              country.hazards.set(key, true);
            }
          });
          this.mapCountries.set(countryId, country);
        }
        this.doneDownloadingAndProcessingActions();
      });

    // Populate actions
  }

  public getRegionsForAgency(agencyId: string, funct: (key: string, region: ModelRegion) => void) {
    this.af.database.object(Constants.APP_STATUS + "/region/" + agencyId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((result) => {
        if (result.childCount == 0) {
          funct("", null);
        }
        result.forEach((snapshot) => {
          funct(snapshot.key, snapshot.val());
        })
      });
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

  /** Function for where **/
  private doneWithEmbeddedStyles(countryClicked: (country: string) => void) {

    let blue: string[] = [];
    let red: string[] = [];
    let yellow: string[] = [];
    let green: string[] = [];

    for (let x of this.listCountries) {
      if (x.overall() == -1) {
        blue.push(Countries[x.location]);
      }
      else if (x.overall() >= this.threshGreen) {
        green.push(Countries[x.location]);
      }
      else if (x.overall() >= this.threshYellow) {
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
}


export class MapCountry {
  public location: number;
  public countryId: string;

  public actionMap: Map<string, MapPrepAction> = new Map<string, MapPrepAction>();
  public departments: MapDepartment[] = [];
  public hazards: Map<HazardScenario, boolean> = new Map<HazardScenario, boolean>();

  constructor(countryId: string, location: number) {
    this.location = location;
    this.countryId = countryId;
  }

  public calculateDepartments() {
    let depMap: Map<string, MapDepartment> = new Map<string, MapDepartment>();
    this.actionMap.forEach((value, key) => {
      let department = (value.department ? value.department : 'unassigned');
      let dep: MapDepartment = this.findOrCreateByDepartment(depMap, department);
      dep.numberTotal++;
      if (value.calculatedIsComplete) {
        dep.numberGreen++;
      }
      depMap.set(department, dep);
    });
    depMap.forEach((value, key) => {
      this.departments.push(value);
    });
  }

  public overall() {
    if (this.departments.length == 0) {
      return -1;
    }
    let total = 0;
    for (let x of this.departments) {
      total += x.overall();
    }
    total /= this.departments.length;
    return total;
  }

  private findOrCreateByDepartment(depMap: Map<string, MapDepartment>, department: string) {
    if (depMap.get(department) != null) {
      return depMap.get(department);
    }
    let x: MapDepartment = new MapDepartment(department);
    depMap.set(department, x);
    return depMap.get(department);
  }
}

export class MapDepartment {

  constructor(id: string) {
    this.id = id;
  }

  public id: string;
  public numberGreen: number = 0;
  public numberTotal: number = 0;

  public overall() {
    return (this.numberGreen * 100) / this.numberTotal;
  }
}

export class MapPrepAction {
  public id: string;
  public level: number;
  public type: number;
  public department: string;
  public isArchived: boolean;

  public isCompleteAt: number = 0;
  public isComplete: boolean = false;
  public calculatedClock: number = 0;

  public calculatedIsComplete: boolean = false;

  static CHS(id: string, level: number): MapPrepAction {
    let x: MapPrepAction = new MapPrepAction();
    x.id = id;
    x.level = level;
    x.type = ActionType.chs;
    return x;
  }

  static Mandated(id: string, level: number, department: string): MapPrepAction {
    let x: MapPrepAction = new MapPrepAction();
    x.id = id;
    x.level = level;
    x.department = department;
    x.type = ActionType.mandated;
    return x;
  }

  static Custom(id: string, level: number, department: string): MapPrepAction {
    let x: MapPrepAction = new MapPrepAction();
    x.id = id;
    x.level = level;
    x.department = department;
    x.type = ActionType.custom;
    return x;
  }

  public setIsComplete(date: number) {
    this.calculatedIsComplete = this.isCompleted(date);
  }
  public isCompleted(date: number) {
    if (this.isArchived == true) {
      return false;
    }
    else if (this.level == ActionLevel.MPA) {
      if (this.calculatedIsComplete != null) {
        return this.isCompleteAt + this.calculatedClock > date;
      }
    }
    return false;
  }
}
