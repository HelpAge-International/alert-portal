/**
 * Created by jordan on 29/06/2017.
 */

import {ActionLevel, ActionType, DurationType, HazardScenario, UserType} from "../utils/Enums";
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import {Subject} from "rxjs/Subject";

export class PrepActionService {

  private uid: string;

  private countryId: string;
  private agencyId: string;
  private systemAdminId: string;

  private isMPA: boolean = false;

  private ngUnsubscribe: Subject<void>;

  // Actions: Used for list
  public actions: PreparednessAction[];
  public actionsNetwork: PreparednessAction[];
  public actionsNetworkLocal: PreparednessAction[];
  private ranClockInitialiser: boolean = false;
  private defaultClockType: number;
  private defaultClockValue: number;

  private updater: () => void;
  private CHSkeys: any;
  private completeCHS: number;
  private totalCHS: number;
  private CHSCompletePercentage: number;

  constructor() {
    this.actions = [];
    this.actionsNetwork = [];
    this.actionsNetworkLocal = [];
  }

  /**
   * Initialisation method for the actions
   */
  public initActions(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, userType: UserType, isMPA: boolean,
                     ids: (countryId: string, agencyId: string, systemId: string) => void) {
    this.isMPA = isMPA;
    this.actions = [];
    this.ngUnsubscribe = ngUnsubscribe;
    af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        let countryId = snap.val().countryId;
        let agencyId = "";
        for (let x in snap.val().agencyAdmin) {
          agencyId = x;
        }
        let systemAdminId = "";
        for (let x in snap.val().systemAdmin) {
          systemAdminId = x;
        }
        // TODO: Check if the data under this node is guaranteed!
        ids(countryId, agencyId, systemAdminId);
        this.initActionsWithInfo(af, ngUnsubscribe, uid, userType, isMPA, countryId, agencyId, systemAdminId);
      });
  }

  public initNetworkDashboardActions(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, systemId: string, networkId: string, networkCountryId?: string){
    af.database.list(Constants.APP_STATUS + '/actionCHS/' + systemId)
      .takeUntil(ngUnsubscribe)
      .subscribe( CHSactions => {
        this.CHSkeys = [];
        CHSactions.forEach(action => {
          this.CHSkeys.push(action.$key)
        })
          this.completeCHS = 0;
          this.totalCHS = 0;
          if(networkCountryId){
            af.database.object(Constants.APP_STATUS +  '/networkCountry/' + networkId + '/' + networkCountryId)
              .takeUntil(ngUnsubscribe)
              .subscribe(network => {
                //loop through each agency/country pair within network
                Object.keys(network.agencyCountries).forEach( agencyCountry => {
                  //get the country office key
                  Object.keys(network.agencyCountries[agencyCountry]).forEach(countryKey => {
                    //check if the country office has been approved
                    if (network.agencyCountries[agencyCountry][countryKey].isApproved) {
                      af.database.list(Constants.APP_STATUS +  '/action/' + countryKey)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(actions => { //get a list of the actions within a country office
                          this.CHSkeys.forEach( key => {
                            this.totalCHS++;
                            actions.forEach( action => {
                              if(action.$key == key ){
                                  if(action.isComplete) {
                                    this.completeCHS++;
                                  }
                              }
                            })
                          })
                        })
                    }
                  })
                })
              })
          }else{
            af.database.object(Constants.APP_STATUS +  '/network/' + networkId)
              .takeUntil(ngUnsubscribe)
              .subscribe(network => {
                //loop through each agency/country pair within network
                console.log(network.agencies)
                Object.keys(network.agencies).forEach(agencyCountry => {
                  console.log(agencyCountry)
                  console.log(network.agencies[agencyCountry].countryCode)
                  //check if the country office has been approved
                  if (network.agencies[agencyCountry].isApproved) {
                    af.database.list(Constants.APP_STATUS + '/action/' + network.agencies[agencyCountry].countryCode)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(actions => { //get a list of the actions within a country office
                        this.CHSkeys.forEach(key => {
                          this.totalCHS++;
                          actions.forEach(action => {
                            if (action.$key == key) {
                              if (action.isComplete) {
                                this.completeCHS++;
                              }
                            }
                          })
                        })
                      })
                  }
                })
              })
          }
      })
  }

  public initActionsWithInfo(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, userType: UserType, isMPA: boolean,
                             countryId: string, agencyId: string, systemId: string, updated?: (action: PreparednessAction) => void) {
    this.uid = uid;
    this.ngUnsubscribe = ngUnsubscribe;
    this.isMPA = isMPA;
    this.countryId = countryId;
    this.agencyId = agencyId;
    this.systemAdminId = systemId;
    this.getDefaultClockSettings(af, this.agencyId, this.countryId, () => {
      if (isMPA == null || isMPA) { // Don't load CHS actions if we're on advanced - They do not apply
        this.init(af, "actionCHS", this.systemAdminId, isMPA, PrepSourceTypes.SYSTEM, updated);
      }
      this.init(af, "actionMandated", this.agencyId, isMPA, PrepSourceTypes.AGENCY, updated);
      this.init(af, "action", this.countryId, isMPA, PrepSourceTypes.COUNTRY, updated);
    });
  }

  public initActionsWithInfoNetwork(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, isMPA: boolean,
                                    countryId: string, agencyId: string, systemId: string) {
    this.uid = uid;
    this.ngUnsubscribe = ngUnsubscribe;
    this.isMPA = isMPA;
    this.countryId = countryId;
    this.agencyId = agencyId;
    this.systemAdminId = systemId;
    this.getDefaultClockSettingsNetwork(af, this.agencyId, this.countryId, () => {
      this.init(af, "actionMandated", this.agencyId, isMPA, PrepSourceTypes.AGENCY);
      this.init(af, "action", this.countryId, isMPA, PrepSourceTypes.COUNTRY);
    });
  }

  public initActionsWithInfoAllAgenciesInNetwork(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, isMPA: boolean,
                                                 countryId: string, agencyId: string, systemId: string, agencyCountryMap: Map<string, string>) {
    this.uid = uid;
    this.ngUnsubscribe = ngUnsubscribe;
    this.isMPA = isMPA;
    this.countryId = countryId;
    this.agencyId = agencyId;
    this.systemAdminId = systemId;
    this.getDefaultClockSettingsNetwork(af, this.agencyId, this.countryId, () => {
      if (isMPA == null || isMPA) { // Don't load CHS actions if we're on advanced - They do not apply
        this.init(af, "actionCHS", this.systemAdminId, isMPA, PrepSourceTypes.SYSTEM);
      }
      this.init(af, "actionMandated", this.agencyId, isMPA, PrepSourceTypes.AGENCY);
      this.init(af, "action", this.countryId, isMPA, PrepSourceTypes.COUNTRY);

      agencyCountryMap.forEach((countryId, agencyId) => {
        if (isMPA == null || isMPA) { // Don't load CHS actions if we're on advanced - They do not apply
          this.init(af, "actionCHS", this.systemAdminId, isMPA, PrepSourceTypes.SYSTEM);
        }
        this.init(af, "actionMandated", agencyId, isMPA, PrepSourceTypes.AGENCY);
        this.init(af, "action", countryId, isMPA, PrepSourceTypes.COUNTRY);
      })
    });
  }

  public initActionsWithInfoAllAgenciesInNetworkLocal(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, isMPA: boolean,
                                                 countryId: string, agencyId: string, systemId: string, agencyCountryMap: Map<string, string>) {
    this.uid = uid;
    this.ngUnsubscribe = ngUnsubscribe;
    this.isMPA = isMPA;
    this.countryId = countryId;
    this.agencyId = agencyId;
    this.systemAdminId = systemId;
    this.getDefaultClockSettingsNetworkLocal(af, this.agencyId, () => {
      if (isMPA == null || isMPA) { // Don't load CHS actions if we're on advanced - They do not apply
        this.init(af, "actionCHS", this.systemAdminId, isMPA, PrepSourceTypes.SYSTEM);
      }
      this.init(af, "actionMandated", this.agencyId, isMPA, PrepSourceTypes.AGENCY);
      this.init(af, "action", this.countryId, isMPA, PrepSourceTypes.COUNTRY);

      agencyCountryMap.forEach((countryId, agencyId) => {
        if (isMPA == null || isMPA) { // Don't load CHS actions if we're on advanced - They do not apply
          this.init(af, "actionCHS", this.systemAdminId, isMPA, PrepSourceTypes.SYSTEM);
        }
        this.init(af, "actionMandated", agencyId, isMPA, PrepSourceTypes.AGENCY);
        this.init(af, "action", countryId, isMPA, PrepSourceTypes.COUNTRY);
      })
    });
  }

  public initActionsWithInfoAllNetworksInCountry(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, isMPA: boolean,
                                                 countryId: string, agencyId: string, systemId: string, networkMap: Map<string, string>) {
    // this.uid = uid;
    // this.ngUnsubscribe = ngUnsubscribe;
    // this.isMPA = isMPA;
    // this.countryId = countryId;
    // this.agencyId = agencyId;
    // this.systemAdminId = systemId;
    // this.getDefaultClockSettings(af, agencyId, countryId, () => {
    networkMap.forEach((networkCountryId, networkId) => {
      // if (isMPA == null || isMPA) { // Don't load CHS actions if we're on advanced - They do not apply
      //   this.initNetwork(af, "actionCHS", this.systemAdminId, isMPA, PrepSourceTypes.SYSTEM);
      // }
      this.initNetwork(af, "actionMandated", networkId, isMPA, PrepSourceTypes.AGENCY, countryId, networkId, networkCountryId);
      this.initNetwork(af, "action", networkCountryId, isMPA, PrepSourceTypes.COUNTRY, countryId, networkId, networkCountryId);
    })
    // });
  }

  public initActionsWithInfoNetworkLocal(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, isMPA: boolean,
                                         agencyId: string, systemId: string) {
    this.uid = uid;
    this.ngUnsubscribe = ngUnsubscribe;
    this.isMPA = isMPA;
    this.agencyId = agencyId;
    this.countryId = agencyId;
    this.systemAdminId = systemId;
    this.getDefaultClockSettingsNetworkLocal(af, this.agencyId, () => {
      this.init(af, "actionMandated", this.agencyId, isMPA, PrepSourceTypes.AGENCY);
      this.init(af, "action", this.agencyId, isMPA, PrepSourceTypes.COUNTRY);
    });
  }

  public initOneAction(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, userType: UserType, actionId: string, updated: (action: PreparednessAction) => void) {
    this.ngUnsubscribe = ngUnsubscribe;
    af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.countryId = snap.val().countryId;
        this.agencyId = "";
        for (let x in snap.val().agencyAdmin) {
          this.agencyId = x;
        }
        this.systemAdminId = "";
        for (let x in snap.val().systemAdmin) {
          this.systemAdminId = x;
        }
        this.getDefaultClockSettings(af, this.agencyId, this.countryId, () => {
          this.initSpecific(af, "actionCHS", this.systemAdminId, PrepSourceTypes.SYSTEM, actionId, updated);
          this.initSpecific(af, "actionMandated", this.agencyId, PrepSourceTypes.AGENCY, actionId, updated);
          this.initSpecific(af, "action", this.countryId, PrepSourceTypes.COUNTRY, actionId, updated);
        });
      });
  }

  public initOneActionNetwork(af: AngularFire, ngUnsubscribe: Subject<void>, countryId: string, agencyId: string, systemId: string, actionId: string, updated: (action: PreparednessAction) => void) {
    this.ngUnsubscribe = ngUnsubscribe;
    this.getDefaultClockSettingsNetwork(af, agencyId, countryId, () => {
      this.initSpecific(af, "actionCHS", systemId, PrepSourceTypes.SYSTEM, actionId, updated);
      this.initSpecific(af, "actionMandated", agencyId, PrepSourceTypes.AGENCY, actionId, updated);
      this.initSpecific(af, "action", countryId, PrepSourceTypes.COUNTRY, actionId, updated);
    });
  }

  public initOneActionNetworkLocal(af: AngularFire, ngUnsubscribe: Subject<void>, agencyId: string, systemId: string, actionId: string, updated: (action: PreparednessAction) => void) {
    this.ngUnsubscribe = ngUnsubscribe;
    this.getDefaultClockSettingsNetworkLocal(af, agencyId, () => {
      this.initSpecific(af, "actionCHS", systemId, PrepSourceTypes.SYSTEM, actionId, updated);
      this.initSpecific(af, "actionMandated", agencyId, PrepSourceTypes.AGENCY, actionId, updated);
      this.initSpecific(af, "action", agencyId, PrepSourceTypes.COUNTRY, actionId, updated);
    });
  }

  /**
   * Load in the default clock settings from the countryOffice node.
   * We need these to do the bulk of the calculations with the preparedness actions in terms of the state
   */
  private getDefaultClockSettings(af: AngularFire, agencyId: string, countryId: string, defaultClockSettingsAquired: () => void) {
    af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId + "/clockSettings", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.defaultClockValue = (+(snap.val().preparedness.value));
        this.defaultClockType = (+(snap.val().preparedness.durationType));
        console.log(`default value: ${this.defaultClockValue}, default type: ${this.defaultClockType}`)
        if (!this.ranClockInitialiser) {    // Wrap this in a guard to stop multiple calls being made!
          defaultClockSettingsAquired();
          this.ranClockInitialiser = true;
        }
      });
  }

  private getDefaultClockSettingsNetwork(af: AngularFire, agencyId: string, countryId: string, defaultClockSettingsAquired: () => void) {
    af.database.object(Constants.APP_STATUS + "/networkCountry/" + agencyId + "/" + countryId + "/clockSettings", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap && snap.val()) {
          this.defaultClockValue = (+(snap.val().preparedness.value));
          this.defaultClockType = (+(snap.val().preparedness.durationType));
          if (!this.ranClockInitialiser) {    // Wrap this in a guard to stop multiple calls being made!
            defaultClockSettingsAquired();
            this.ranClockInitialiser = true;
          }
        }
      });
  }

  private getDefaultClockSettingsNetworkLocal(af: AngularFire, agencyId: string, defaultClockSettingsAquired: () => void) {
    af.database.object(Constants.APP_STATUS + "/network/" + agencyId + "/clockSettings", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.defaultClockValue = (+(snap.val().preparedness.value));
        this.defaultClockType = (+(snap.val().preparedness.durationType));
        if (!this.ranClockInitialiser) {    // Wrap this in a guard to stop multiple calls being made!
          defaultClockSettingsAquired();
          this.ranClockInitialiser = true;
        }
      });
  }

  public static clockCalculation(value: number, type: number) {
    let val: number = 1000 * 60 * 60 * 24; // Milliseconds in one day
    val = val * value;
    if (type == DurationType.Week) {
      val = val * 7;
    }
    if (type == DurationType.Month) {
      val = val * 30;
    }
    if (type == DurationType.Year) {
      val = val * 365;
    }
    return val;
  }

  /**
   * General init method. Goes to a node and lists all relevant actions
   */
  private init(af: AngularFire, path: string, userId: string, isMPA: boolean, source: PrepSourceTypes, updated?: (action: PreparednessAction) => void) {
    af.database.list(Constants.APP_STATUS + "/" + path + "/" + userId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (isMPA == null) {
            this.updateAction(af, snapshot.key, snapshot.val(), userId, source, updated);
          }
          else if (isMPA && snapshot.val().level == ActionLevel.MPA) {
            this.updateAction(af, snapshot.key, snapshot.val(), userId, source, updated);
          }
          else if (!isMPA && snapshot.val().level == ActionLevel.APA) {
            this.updateAction(af, snapshot.key, snapshot.val(), userId, source, updated);
          }
          else if (this.findAction(snapshot.key) != null) {
            this.updateAction(af, snapshot.key, snapshot.val(), userId, source, updated);
          }
        });
      });
  }

  private initNetwork(af: AngularFire, path: string, userId: string, isMPA: boolean, source: PrepSourceTypes, countryId, networkId, networkCountryId, updated?: (action: PreparednessAction) => void) {
    af.database.list(Constants.APP_STATUS + "/" + path + "/" + userId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (snapshot.val() && snapshot.val().createdByCountryId && snapshot.val().createdByCountryId == countryId) {
            if (isMPA == null) {
              this.updateActionNetwork(af, snapshot.key, snapshot.val(), userId, source, networkId, networkCountryId, updated);
            }
            else if (isMPA && snapshot.val().level == ActionLevel.MPA) {
              this.updateActionNetwork(af, snapshot.key, snapshot.val(), userId, source, networkId, networkCountryId, updated);
            }
            else if (!isMPA && snapshot.val().level == ActionLevel.APA) {
              this.updateActionNetwork(af, snapshot.key, snapshot.val(), userId, source, networkId, networkCountryId, updated);
            }
            else if (this.findActionNetwork(snapshot.key) != null) {
              this.updateActionNetwork(af, snapshot.key, snapshot.val(), userId, source, networkId, networkCountryId, updated);
            }
          }
        });
      });
  }

  private initSpecific(af: AngularFire, path: string, userId: string, source: PrepSourceTypes, actionId: string, updated: (action: PreparednessAction) => void) {
    af.database.object(Constants.APP_STATUS + "/" + path + "/" + userId + "/" + actionId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snapshot) => {
        if (snapshot.val() != null) {
          this.updateAction(af, snapshot.key, snapshot.val(), userId, source, updated);
        }
      });
  }

  /**
   * Update method for actionCHS, actionMandated or action.
   *
   * - All the above nodes will contain part of the total data set. This method checks for the existance of everything
   *    and will assemble the data live. Note that this is used for holding data as well (attachments, notes, etc.)
   */
  private updateAction(af: AngularFire, id: string, action, whichUser: string, source: PrepSourceTypes, updated: (action: PreparednessAction) => void) {
    let run: boolean = this.findAction(id) == null;
    let i = this.findOrCreateIndex(id, whichUser, source);
    let applyCustom = false; // Fixes bug with frequencyValue and frequencyBase
    if (action.hasOwnProperty('asignee')) this.actions[i].asignee = action.asignee;
    else if (action.type == ActionType.custom) this.actions[i].asignee = null;
    if (action.hasOwnProperty('dueDate')) this.actions[i].dueDate = action.dueDate;
    else if (action.type == ActionType.custom) this.actions[i].dueDate = null;
    if (action.hasOwnProperty('assignHazard')) {
      this.actions[i].assignedHazards = [];
      for (const x of action.assignHazard) {
        this.actions[i].assignedHazards.push(x);
      }
    }
    // else {
    //   this.actions[i].assignedHazards = null;
    // }
    if (action.hasOwnProperty('type')) {
      this.actions[i].type = action.type;
      /** WORKAROUND LOGIC FOR APA'S ON MANDATED PREP ACTIONS
       * - All Hazards are underneath it **/
      if (action.type == ActionType.mandated && this.isMPA) {
        // Add all of them
        this.actions[i].assignedHazards = [];
        for (const x in HazardScenario) {
          this.actions[i].assignedHazards.push(+HazardScenario[x]);
        }
      }
    }
    // else {
    //   this.actions[i].type = null;
    // }
    if (action.hasOwnProperty('createdByAgencyId')) this.actions[i].createdByAgencyId = action.createdByAgencyId;
    else if (action.type == ActionType.custom) action.createdByAgencyId = null;
    if (action.hasOwnProperty('createdByCountryId')) this.actions[i].createdByCountryId = action.createdByCountryId;
    else if (action.type == ActionType.custom) action.createdByCountryId = null;

    if (action.hasOwnProperty('updatedAt')) this.actions[i].updatedAt = action.updatedAt;
    else if (action.type == ActionType.custom) action.isArchived = null;
    if (action.hasOwnProperty('isArchived')) this.actions[i].isArchived = action.isArchived;
    else if (action.type == ActionType.custom) action.isArchived = null;
    if (action.hasOwnProperty('budget')) this.actions[i].budget = action.budget;
    else if (action.type == ActionType.custom) action.budget = null;
    if (action.hasOwnProperty('department')) this.actions[i].department = action.department; // else action.department = null;
    if (action.hasOwnProperty('level')) this.actions[i].level = action.level; // else action.level = null;
    if (action.hasOwnProperty('calculatedIsComplete')) this.actions[i].isComplete = action.calculatedIsComplete;
    else if (action.type == ActionType.custom) action.calculatedIsComplete = null;
    if (action.hasOwnProperty('isCompleteAt')) this.actions[i].isCompleteAt = action.isCompleteAt;
    else if (action.type == ActionType.custom) action.isCompleteAt = null;
    if (action.hasOwnProperty('isComplete')) this.actions[i].isComplete = action.isComplete;
    else if (action.type == ActionType.custom) action.isComplete = null;
    if (action.hasOwnProperty('requireDoc')) this.actions[i].requireDoc = action.requireDoc;
    else if (action.type == ActionType.custom) action.requireDoc = null;
    if (action.hasOwnProperty('task')) this.actions[i].task = action.task; // else action.task = null;
    if (action.hasOwnProperty('frequencyBase')) {
      this.actions[i].frequencyBase = action.frequencyBase;
      applyCustom = true;
    }
    else action.frequencyBase = null;
    if (action.hasOwnProperty('frequencyValue')) {
      this.actions[i].frequencyValue = action.frequencyValue;
      applyCustom = true;
    }
    else action.frequencyValue = null;
    this.initNotes(af, id, run);

    // Document deletion check
    if (action.hasOwnProperty('documents')) {
      let docsToRemove: string[] = [];
      for (let x of this.actions[i].documents) {
        let docIsGoneFromOnline: boolean = true;
        for (let doc in action.documents) {
          if (doc == x.documentId) {
            docIsGoneFromOnline = false;
          }
        }
        if (docIsGoneFromOnline) {
          this.actions[i].removeDoc(x.documentId);
          docsToRemove.push(x.documentId);
        }
      }
      for (let doc in action.documents) {
        if (docsToRemove.indexOf(doc) <= -1)
          this.initDoc(af, whichUser, doc, this.actions[i].id);
      }
    }
    // else {
    //   this.actions[i].documents = [];
    // }

    // Clock settings
    if (applyCustom) {
      this.actions[i].setComputedClockSetting(+this.actions[i].frequencyValue, +this.actions[i].frequencyBase);
    }
    else {
      this.actions[i].setComputedClockSetting(this.defaultClockValue, this.defaultClockType);
    }


    // Optional notifier method
    if (updated != null) {
      updated(this.actions[i]);
    }

    // console.log("Updating!");
    // console.log(this.actions[i]);

    // Subscriber method
    if (this.updater != null) {
      this.updater();
    }

  }

  private updateActionNetwork(af: AngularFire, id: string, action, whichUser: string, source: PrepSourceTypes, networkId, networkCountryId, updated: (action: PreparednessAction) => void) {
    let run: boolean = this.findActionNetwork(id) == null;
    let i = this.findOrCreateIndexNetwork(id, whichUser, source, networkId, networkCountryId);
    let applyCustom = false; // Fixes bug with frequencyValue and frequencyBase
    if (action.hasOwnProperty('asignee')) this.actionsNetwork[i].asignee = action.asignee;
    else if (action.type == ActionType.custom) this.actionsNetwork[i].asignee = null;
    if (action.hasOwnProperty('dueDate')) this.actionsNetwork[i].dueDate = action.dueDate;
    else if (action.type == ActionType.custom) this.actionsNetwork[i].dueDate = null;
    if (action.hasOwnProperty('assignHazard')) {
      this.actionsNetwork[i].assignedHazards = [];
      for (const x of action.assignHazard) {
        this.actionsNetwork[i].assignedHazards.push(x);
      }
    }
    // else {
    //   this.actions[i].assignedHazards = null;
    // }
    if (action.hasOwnProperty('type')) {
      this.actionsNetwork[i].type = action.type;
      /** WORKAROUND LOGIC FOR APA'S ON MANDATED PREP ACTIONS
       * - All Hazards are underneath it **/
      if (action.type == ActionType.mandated && this.isMPA) {
        // Add all of them
        this.actionsNetwork[i].assignedHazards = [];
        for (const x in HazardScenario) {
          this.actionsNetwork[i].assignedHazards.push(+HazardScenario[x]);
        }
      }
    }
    // else {
    //   this.actions[i].type = null;
    // }
    if (action.hasOwnProperty('createdByAgencyId')) this.actionsNetwork[i].createdByAgencyId = action.createdByAgencyId;
    else if (action.type == ActionType.custom) action.createdByAgencyId = null;
    if (action.hasOwnProperty('createdByCountryId')) this.actionsNetwork[i].createdByCountryId = action.createdByCountryId;
    else if (action.type == ActionType.custom) action.createdByCountryId = null;

    if (action.hasOwnProperty('updatedAt')) this.actionsNetwork[i].updatedAt = action.updatedAt;
    else if (action.type == ActionType.custom) action.isArchived = null;
    if (action.hasOwnProperty('isArchived')) this.actionsNetwork[i].isArchived = action.isArchived;
    else if (action.type == ActionType.custom) action.isArchived = null;
    if (action.hasOwnProperty('budget')) this.actionsNetwork[i].budget = action.budget;
    else if (action.type == ActionType.custom) action.budget = null;
    if (action.hasOwnProperty('department')) this.actionsNetwork[i].department = action.department; // else action.department = null;
    if (action.hasOwnProperty('level')) this.actionsNetwork[i].level = action.level; // else action.level = null;
    if (action.hasOwnProperty('calculatedIsComplete')) this.actionsNetwork[i].isComplete = action.calculatedIsComplete;
    else if (action.type == ActionType.custom) action.calculatedIsComplete = null;
    if (action.hasOwnProperty('isCompleteAt')) this.actionsNetwork[i].isCompleteAt = action.isCompleteAt;
    else if (action.type == ActionType.custom) action.isCompleteAt = null;
    if (action.hasOwnProperty('isComplete')) this.actionsNetwork[i].isComplete = action.isComplete;
    else if (action.type == ActionType.custom) action.isComplete = null;
    if (action.hasOwnProperty('requireDoc')) this.actionsNetwork[i].requireDoc = action.requireDoc;
    else if (action.type == ActionType.custom) action.requireDoc = null;
    if (action.hasOwnProperty('task')) this.actionsNetwork[i].task = action.task; // else action.task = null;
    if (action.hasOwnProperty('frequencyBase')) {
      this.actionsNetwork[i].frequencyBase = action.frequencyBase;
      applyCustom = true;
    }
    else action.frequencyBase = null;
    if (action.hasOwnProperty('frequencyValue')) {
      this.actionsNetwork[i].frequencyValue = action.frequencyValue;
      applyCustom = true;
    }
    else action.frequencyValue = null;
    this.initNotesNetwork(af, id, networkCountryId, run);

    // Document deletion check
    if (action.hasOwnProperty('documents')) {
      let docsToRemove: string[] = [];
      for (let x of this.actionsNetwork[i].documents) {
        let docIsGoneFromOnline: boolean = true;
        for (let doc in action.documents) {
          if (doc == x.documentId) {
            docIsGoneFromOnline = false;
          }
        }
        if (docIsGoneFromOnline) {
          this.actionsNetwork[i].removeDoc(x.documentId);
          docsToRemove.push(x.documentId);
        }
      }
      for (let doc in action.documents) {
        if (docsToRemove.indexOf(doc) <= -1)
          this.initDocNetwork(af, whichUser, doc, this.actionsNetwork[i].id);
      }
    }
    // else {
    //   this.actions[i].documents = [];
    // }

    // Clock settings
    if (applyCustom) {
      this.actionsNetwork[i].setComputedClockSetting(+this.actionsNetwork[i].frequencyValue, +this.actionsNetwork[i].frequencyBase);
    }
    else {
      this.actionsNetwork[i].setComputedClockSetting(this.defaultClockValue, this.defaultClockType);
    }


    // Optional notifier method
    if (updated != null) {
      updated(this.actionsNetwork[i]);
    }

    // console.log("Updating!");
    // console.log(this.actions[i]);

    // Subscriber method
    if (this.updater != null) {
      this.updater();
    }

    console.log(this.actionsNetwork)
  }

  private updateActionNetworkLocal(af: AngularFire, id: string, action, whichUser: string, source: PrepSourceTypes, networkId, updated: (action: PreparednessAction) => void) {
    let run: boolean = this.findActionNetworkLocal(id) == null;
    let i = this.findOrCreateIndexNetworkLocal(id, whichUser, source, networkId);
    let applyCustom = false; // Fixes bug with frequencyValue and frequencyBase
    if (action.hasOwnProperty('asignee')) this.actionsNetworkLocal[i].asignee = action.asignee;
    else if (action.type == ActionType.custom) this.actionsNetworkLocal[i].asignee = null;
    if (action.hasOwnProperty('dueDate')) this.actionsNetworkLocal[i].dueDate = action.dueDate;
    else if (action.type == ActionType.custom) this.actionsNetworkLocal[i].dueDate = null;
    if (action.hasOwnProperty('assignHazard')) {
      this.actionsNetworkLocal[i].assignedHazards = [];
      for (const x of action.assignHazard) {
        this.actionsNetworkLocal[i].assignedHazards.push(x);
      }
    }
    // else {
    //   this.actions[i].assignedHazards = null;
    // }
    if (action.hasOwnProperty('type')) {
      this.actionsNetworkLocal[i].type = action.type;
      /** WORKAROUND LOGIC FOR APA'S ON MANDATED PREP ACTIONS
       * - All Hazards are underneath it **/
      if (action.type == ActionType.mandated && this.isMPA) {
        // Add all of them
        this.actionsNetworkLocal[i].assignedHazards = [];
        for (const x in HazardScenario) {
          this.actionsNetworkLocal[i].assignedHazards.push(+HazardScenario[x]);
        }
      }
    }
    // else {
    //   this.actions[i].type = null;
    // }
    if (action.hasOwnProperty('createdByAgencyId')) this.actionsNetworkLocal[i].createdByAgencyId = action.createdByAgencyId;
    else if (action.type == ActionType.custom) action.createdByAgencyId = null;
    if (action.hasOwnProperty('createdByCountryId')) this.actionsNetworkLocal[i].createdByCountryId = action.createdByCountryId;
    else if (action.type == ActionType.custom) action.createdByCountryId = null;

    if (action.hasOwnProperty('updatedAt')) this.actionsNetworkLocal[i].updatedAt = action.updatedAt;
    else if (action.type == ActionType.custom) action.isArchived = null;
    if (action.hasOwnProperty('isArchived')) this.actionsNetworkLocal[i].isArchived = action.isArchived;
    else if (action.type == ActionType.custom) action.isArchived = null;
    if (action.hasOwnProperty('budget')) this.actionsNetworkLocal[i].budget = action.budget;
    else if (action.type == ActionType.custom) action.budget = null;
    if (action.hasOwnProperty('department')) this.actionsNetworkLocal[i].department = action.department; // else action.department = null;
    if (action.hasOwnProperty('level')) this.actionsNetworkLocal[i].level = action.level; // else action.level = null;
    if (action.hasOwnProperty('calculatedIsComplete')) this.actionsNetworkLocal[i].isComplete = action.calculatedIsComplete;
    else if (action.type == ActionType.custom) action.calculatedIsComplete = null;
    if (action.hasOwnProperty('isCompleteAt')) this.actionsNetworkLocal[i].isCompleteAt = action.isCompleteAt;
    else if (action.type == ActionType.custom) action.isCompleteAt = null;
    if (action.hasOwnProperty('isComplete')) this.actionsNetworkLocal[i].isComplete = action.isComplete;
    else if (action.type == ActionType.custom) action.isComplete = null;
    if (action.hasOwnProperty('requireDoc')) this.actionsNetworkLocal[i].requireDoc = action.requireDoc;
    else if (action.type == ActionType.custom) action.requireDoc = null;
    if (action.hasOwnProperty('task')) this.actionsNetworkLocal[i].task = action.task; // else action.task = null;
    if (action.hasOwnProperty('frequencyBase')) {
      this.actionsNetworkLocal[i].frequencyBase = action.frequencyBase;
      applyCustom = true;
    }
    else action.frequencyBase = null;
    if (action.hasOwnProperty('frequencyValue')) {
      this.actionsNetworkLocal[i].frequencyValue = action.frequencyValue;
      applyCustom = true;
    }
    else action.frequencyValue = null;
    this.initNotesNetwork(af, id, networkId, run);

    // Document deletion check
    if (action.hasOwnProperty('documents')) {
      let docsToRemove: string[] = [];
      for (let x of this.actionsNetworkLocal[i].documents) {
        let docIsGoneFromOnline: boolean = true;
        for (let doc in action.documents) {
          if (doc == x.documentId) {
            docIsGoneFromOnline = false;
          }
        }
        if (docIsGoneFromOnline) {
          this.actionsNetworkLocal[i].removeDoc(x.documentId);
          docsToRemove.push(x.documentId);
        }
      }
      for (let doc in action.documents) {
        if (docsToRemove.indexOf(doc) <= -1)
          this.initDocNetwork(af, whichUser, doc, this.actionsNetwork[i].id);
      }
    }
    // else {
    //   this.actions[i].documents = [];
    // }

    // Clock settings
    if (applyCustom) {
      this.actionsNetwork[i].setComputedClockSetting(+this.actionsNetwork[i].frequencyValue, +this.actionsNetwork[i].frequencyBase);
    }
    else {
      this.actionsNetwork[i].setComputedClockSetting(this.defaultClockValue, this.defaultClockType);
    }


    // Optional notifier method
    if (updated != null) {
      updated(this.actionsNetwork[i]);
    }

    // console.log("Updating!");
    // console.log(this.actions[i]);

    // Subscriber method
    if (this.updater != null) {
      this.updater();
    }

    console.log(this.actionsNetwork)
  }

  public addUpdater(func: () => void) {
    this.updater = func;
  }

  /**
   * Checks if an object exists in our current map. If it doesn't, create one as it's about to be used.
   * - Also stores any relevant admin ids in it (ie. if it's CHS, it'll store System Admin ID and Country ID if there's
   *   any customisation on the object
   */
  private findOrCreateIndex(id: string, uid: string, source: PrepSourceTypes) {
    let returnI = -1;
    for (let i = 0; i < this.actions.length; i++) {
      if (this.actions[i].id == id) {
        returnI = i;
        i = this.actions.length;
      }
    }
    if (returnI == -1) {
      let newPrep: PreparednessAction = new PreparednessAction();
      newPrep.id = id;
      this.actions.push(newPrep);
      returnI = this.actions.length - 1;
    }
    if (source == PrepSourceTypes.SYSTEM)
      this.actions[returnI].systemUid = uid;
    if (source == PrepSourceTypes.AGENCY)
      this.actions[returnI].agencyUid = uid;
    if (source == PrepSourceTypes.COUNTRY)
      this.actions[returnI].countryUid = uid;
    return returnI;
  }

  private findOrCreateIndexNetwork(id: string, uid: string, source: PrepSourceTypes, networkId: string, networkCountryId: string) {
    let returnI = -1;
    for (let i = 0; i < this.actionsNetwork.length; i++) {
      if (this.actionsNetwork[i].id == id) {
        returnI = i;
        i = this.actionsNetwork.length;
      }
    }
    if (returnI == -1) {
      let newPrep: PreparednessAction = new PreparednessAction();
      newPrep.id = id;
      newPrep.networkId = networkId;
      newPrep.networkCountryId = networkCountryId;
      this.actionsNetwork.push(newPrep);
      returnI = this.actionsNetwork.length - 1;
    }
    if (source == PrepSourceTypes.SYSTEM)
      this.actionsNetwork[returnI].systemUid = uid;
    if (source == PrepSourceTypes.AGENCY)
      this.actionsNetwork[returnI].agencyUid = uid;
    if (source == PrepSourceTypes.COUNTRY)
      this.actionsNetwork[returnI].countryUid = uid;
    return returnI;
  }

  private findOrCreateIndexNetworkLocal(id: string, uid: string, source: PrepSourceTypes, networkId: string) {
    let returnI = -1;
    for (let i = 0; i < this.actionsNetworkLocal.length; i++) {
      if (this.actionsNetworkLocal[i].id == id) {
        returnI = i;
        i = this.actionsNetworkLocal.length;
      }
    }
    if (returnI == -1) {
      let newPrep: PreparednessAction = new PreparednessAction();
      newPrep.id = id;
      newPrep.networkId = networkId;
      this.actionsNetworkLocal.push(newPrep);
      returnI = this.actionsNetworkLocal.length - 1;
    }
    if (source == PrepSourceTypes.SYSTEM)
      this.actionsNetworkLocal[returnI].systemUid = uid;
    if (source == PrepSourceTypes.AGENCY)
      this.actionsNetworkLocal[returnI].agencyUid = uid;
    if (source == PrepSourceTypes.COUNTRY)
      this.actionsNetworkLocal[returnI].countryUid = uid;
    return returnI;
  }

  public findAction(id: string) {
    for (let x of this.actions) {
      if (x.id == id)
        return x;
    }
    return null;
  }

  public findActionNetwork(id: string) {
    for (let x of this.actionsNetwork) {
      if (x.id == id)
        return x;
    }
    return null;
  }

  public findActionNetworkLocal(id: string) {
    for (let x of this.actionsNetworkLocal) {
      if (x.id == id)
        return x;
    }
    return null;
  }


  /**
   * Initialisation method for the notes
   */
  // Listen for changes on the notes
  public initNotes(af: AngularFire, actionId: string, run: boolean) {
    if (run) {
      af.database.list(Constants.APP_STATUS + "/note/" + this.countryId + '/' + actionId, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          let action: PreparednessAction = this.findAction(actionId);
          if (action != null) {
            this.findAction(actionId).notes = [];
            snap.forEach((noteSnap) => {
              let prepNote: PreparednessNotes = new PreparednessNotes(noteSnap.key, actionId);
              prepNote.content = noteSnap.val().content;
              prepNote.time = noteSnap.val().time;
              prepNote.uploadedBy = noteSnap.val().uploadBy;
              this.addNoteToAction(prepNote, action);
            });
          }
        });
    }
  }

  public initNotesNetwork(af: AngularFire, id: string, networkCountryId: string, run: boolean) {
    if (run) {
      af.database.list(Constants.APP_STATUS + "/note/" + networkCountryId + '/' + id, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          let model: PreparednessAction = this.findActionNetwork(id);
          if (model != null) {
            this.findActionNetwork(id).notes = [];
            snap.forEach((noteSnap) => {
              let prepNote: PreparednessNotes = new PreparednessNotes(noteSnap.key, id);
              prepNote.content = noteSnap.val().content;
              prepNote.time = noteSnap.val().time;
              prepNote.uploadedBy = noteSnap.val().uploadBy;
              this.addNoteToAction(prepNote, model);
            });
          }
        });
    }
  }

  // Adding a note to action
  protected addNoteToAction(note: PreparednessNotes, n: PreparednessAction) {
    let ran = false;
    let index = 0;
    for (let x of n.notes) {
      if (x.id == note.id) {
        n.notes[index] = note;
        ran = true;
        index++;
      }
    }
    if (!ran) {
      n.notes.push(note);
    }
  }

  /**
   * Initialisation of the documents associated with an action
   */
  private initDoc(af: AngularFire, alertUserTypeId: string, docId: string, actionId: string) {
    af.database.object(Constants.APP_STATUS + "/document/" + alertUserTypeId + "/" + docId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (this.findAction(actionId) != null) {
          let doc = snap.val();
          console.log(doc);
          if (doc != null && doc != undefined) {
            doc.documentId = snap.key;
            this.findAction(actionId).addDoc(doc);
          }
        }
      });
  }

  private initDocNetwork(af: AngularFire, alertUserTypeId: string, docId: string, actionId: string) {
    af.database.object(Constants.APP_STATUS + "/document/" + alertUserTypeId + "/" + docId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (this.findActionNetwork(actionId) != null) {
          let doc = snap.val();
          console.log(doc);
          if (doc != null && doc != undefined) {
            doc.documentId = snap.key;
            this.findActionNetwork(actionId).addDoc(doc);
          }
        }
      });
  }
}

export enum PrepSourceTypes {
  SYSTEM = 0,
  AGENCY = 1,
  COUNTRY = 2
}

/**
 * Preparedness Actions
 */
export class PreparednessAction {
  public id: string;
  public systemUid: string;
  public agencyUid: string;
  public countryUid: string;
  public actionStatus: number;
  public asignee: string;
  public attachments: any[];
  public assignedHazards: HazardScenario[];
  public budget: number;
  public department: string;
  public dueDate: number;
  public isArchived: boolean;
  public frequencyBase: number;
  public frequencyValue: number;
  public isComplete: boolean;
  public isCompleteAt: number;
  public level: number;
  public requireDoc: boolean;
  public task: string;
  public updatedAt: number;
  public type: number;
  public note: string;
  public noteId: string;
  public notes: PreparednessNotes[];
  public documents: any[];
  public createdByAgencyId: string;
  public createdByCountryId: string;
  public networkId: string;
  public networkCountryId: string;

  public computedClockSetting: number;

  public setComputedClockSetting(value: number, type: number) {
    this.computedClockSetting = PrepActionService.clockCalculation(value, type);
  }

  constructor() {
    this.assignedHazards = [];
    this.notes = [];
    this.attachments = [];
    this.documents = [];
  }

  public isRedAlertActive(map: Map<HazardScenario, boolean>): boolean {
    if (this.assignedHazards != null && this.assignedHazards.length != 0) {
      for (let x of this.assignedHazards) {
        if (map.get(+x)) {
          return true;
        }
      }
      return false;
    }
    else if (this.type == ActionType.mandated || this.type == ActionType.custom) {
      let returnValue: boolean = false;
      map.forEach((value, key) => {
        if (value) {
          returnValue = true;
        }
      });
      return returnValue;
    }
  }

  public addDoc(doc) {
    let skip = false;
    for (let x of this.documents) {
      if (x.documentId == doc.documentId) {
        skip = true;
      }
    }
    if (!skip) {
      this.documents.push(doc);
    }
  }

  public removeDoc(doc) {
    let backupDocs = this.documents;
    this.documents = [];
    for (let i = 0; i < backupDocs.length; i++) {
      if (backupDocs[i].documentId != doc) {
        this.documents.push(backupDocs[i]);
      }
    }
    backupDocs = [];
    // This code below isn't working properly!! Hence rebuilding the documents list
    // console.log(this.documents);
    // this.documents = this.documents.splice(i, 1);
    // console.log(this.documents);
  }
}


/**
 * Holder for a note
 */
export class PreparednessNotes {

  constructor(uid: string, actionid: string) {
    this.id = uid;
    this.actionid = actionid;
  }

  public actionid: string;
  public id: string;
  public uploadedBy: string;
  public content: string;
  public time: number;
}


/**
 * Holder class for the Users
 */
export class PreparednessUser {
  public id: string;
  public isMe: boolean;
  public firstName: string;
  public lastName: string;

  constructor(uid: string, isMe: boolean) {
    this.id = uid;
    this.isMe = isMe;
  }

  static placeholder(uid: string): PreparednessUser {
    let p = new PreparednessUser(uid, false);
    p.firstName = "Loading";
    p.lastName = "...";
    return p;
  }
}
