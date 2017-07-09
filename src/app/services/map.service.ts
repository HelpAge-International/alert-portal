import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import {ActionLevel, ActionType} from "../utils/Enums";
import {PrepActionService} from "./prepactions.service";
import {ModelDepartment} from "../model/department.model";
/**
 * Created by jordan on 09/07/2017.
 */

export class MapService {

  private uid: string;
  private agencyId: string;
  private systemId: string;

  private af: AngularFire;
  private ngUnsubscribe: Subject<void>;

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

  public static init(af: AngularFire, ngUnsubscribe: Subject<void>): MapService {
    let x: MapService = new MapService();
    x.af = af;
    x.ngUnsubscribe = ngUnsubscribe;
    return x;
  }

  public initMap(uid: string, agencyId: string, systemId: string, done:(countries: MapCountry[]) => void)  {
    this.uid = uid;
    this.agencyId = agencyId;
    this.systemId = systemId;

    // Download everything we need then set the parallel actions calls going
    this.downloadThreshold(() => {
      this.downloadDefaultClockSettings(() => {
        this.downloadDepartments(() => {
          this.beginDownloadAllActions();
        })
      });
    });
  }


  private downloadThreshold(fun: () => void) {
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.systemId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val().minThreshold.length >= 2) {
          this.threshGreen = snap.val().minThreshold[0];
          this.threshYellow = snap.val().minThreshold[1];
        }
        fun();
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
    this.af.database.list(Constants.APP_STATUS + "/actionCHS/" + this.systemId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        for (let x of snap) {
          this.holderCHSActions.set(x.key, MapPrepAction.CHS(x.key, ActionLevel.MPA));
        }
        this.downloadAllCountries()
      });
  }

  private downloadAllMandatedActions() {
    this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + this.agencyId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        for (let x of snap) {
          if (snap.val().level == ActionLevel.MPA) {
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
          this.asyncWaitActionsCount = snap.length;
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
          if (snap.val().level != ActionLevel.APA) {

          }
          this.processAction(id, snap.key, snap.val());
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
      console.log("Done everything!");
      console.log(this.mapCountries);
    }
  }
}


export class MapCountry {
  public location: number;
  public countryId: string;

  public actionMap: Map<string, MapPrepAction> = new Map<string, MapPrepAction>();

  constructor(countryId: string, location: number) {
    this.location = location;
    this.countryId = countryId;
  }
}

export class MapDepartment {

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
