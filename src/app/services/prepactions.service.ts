/**
 * Created by jordan on 29/06/2017.
 */

import {ActionLevel, ActionType, HazardScenario, UserType} from "../utils/Enums";
import {Inject, Injectable} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../utils/Constants";
import {Subject} from "rxjs/Subject";

@Injectable()
export class PrepActionService {

  private uid: string;

  private countryId: string;
  private agencyId: string;
  private systemAdminId: string;

  private isMPA: boolean = false;

  private ngUnsubscribe: Subject<void>;

  // Actions: Used for list
  public actions: PreparednessAction[] = [];

  constructor(private af: AngularFire) {
  }

  /**
   * Initialisation method for the actions
   */
  public initActions(ngUnsubscribe: Subject<void>, uid: string, userType: UserType, isMPA: boolean,
          ids: (countryId: string, agencyId: string, systemId: string) => void) {
    this.ngUnsubscribe = ngUnsubscribe;
    this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid, {preserveSnapshot: true})
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
        this.initActionsWithInfo(ngUnsubscribe, uid, userType, isMPA, countryId, agencyId, systemAdminId);
      });
  }

  public initActionsWithInfo(ngUnsubscribe: Subject<void>, uid: string, userType: UserType, isMPA: boolean,
    countryId: string, agencyId: string, systemId: string) {
    this.uid = uid;
    this.isMPA = isMPA;
    this.countryId = countryId;
    this.agencyId = agencyId;
    this.systemAdminId = systemId;
    if (isMPA) { // Don't load CHS actions if we're on advanced - They do not apply
      this.init("actionCHS", this.systemAdminId, true, PrepSourceTypes.SYSTEM);
    }
    this.init("actionMandated", this.agencyId, isMPA, PrepSourceTypes.AGENCY);
    this.init("action", this.countryId, isMPA, PrepSourceTypes.COUNTRY);
  }

  public initOneAction(ngUnsubscribe: Subject<void>, uid: string, userType: UserType, actionId: string, updated: (action: PreparednessAction) => void) {
    this.ngUnsubscribe = ngUnsubscribe;
    this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid, {preserveSnapshot: true})
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
        this.initSpecific("actionCHS", this.systemAdminId, PrepSourceTypes.SYSTEM, actionId, updated);
        this.initSpecific("actionMandated", this.agencyId, PrepSourceTypes.AGENCY, actionId, updated);
        this.initSpecific("action", this.countryId, PrepSourceTypes.COUNTRY, actionId, updated);
      });
  }

  /**
   * General init method. Goes to a node and lists all relevant actions
   */
  private init(path: string, userId: string, isMPA: boolean, source: PrepSourceTypes) {
    this.af.database.list(Constants.APP_STATUS + "/" + path + "/" + userId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (isMPA && snapshot.val().level == ActionLevel.MPA) {
            this.updateAction(snapshot.key, snapshot.val(), userId, source, null);
          }
          else if (!isMPA && snapshot.val().level == ActionLevel.APA) {
            this.updateAction(snapshot.key, snapshot.val(), userId, source, null);
          }
        });
      });
  }
  private initSpecific(path: string, userId: string, source: PrepSourceTypes, actionId: string, updated: (action: PreparednessAction) => void) {
    this.af.database.list(Constants.APP_STATUS + "/" + path + "/" + userId + "/" + actionId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snapshot) => {
        this.updateAction(snapshot.key, snapshot.val(), userId, source, updated);
      });
  }

  /**
   * Update method for actionCHS, actionMandated or action.
   *
   * - All the above nodes will contain part of the total data set. This method checks for the existance of everything
   *    and will assemble the data live. Note that this is used for holding data as well (attachments, notes, etc.)
   */
  private updateAction(id: string, action, whichUser: string, source: PrepSourceTypes, updated: (action: PreparednessAction) => void) {
    let run: boolean = this.findAction(id) == null;
    let i = this.findOrCreateIndex(id, whichUser, source);
    if (action.hasOwnProperty('asignee')) this.actions[i].asignee = action.asignee;
    if (action.hasOwnProperty('dueDate')) this.actions[i].dueDate = action.dueDate;
    if (action.hasOwnProperty('assignHazard')) {
      this.actions[i].assignedHazards = [];
      for (const x of action.assignHazard) {
        this.actions[i].assignedHazards.push(x);
      }
    }
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
    if (action.hasOwnProperty('isArchived')) this.actions[i].isArchived = action.isArchived;
    if (action.hasOwnProperty('budget')) this.actions[i].budget = action.budget;
    if (action.hasOwnProperty('department')) this.actions[i].department = action.department;
    if (action.hasOwnProperty('level')) this.actions[i].level = action.level;
    if (action.hasOwnProperty('isComplete')) this.actions[i].isComplete = action.isComplete;
    if (action.hasOwnProperty('requireDoc')) this.actions[i].requireDoc = action.requireDoc;
    if (action.hasOwnProperty('task')) this.actions[i].task = action.task;
    if (action.hasOwnProperty('frequencyBase')) this.actions[i].frequencyBase = action.frequencyBase;
    if (action.hasOwnProperty('frequencyValue')) this.actions[i].frequencyValue = action.frequencyValue;
    this.initNotes(id, run);

    if (action.hasOwnProperty('documents')) {
      for (let doc in action.documents) {
        this.initDoc(whichUser, doc, this.actions[i].id);
      }
    }

    if (updated != null) {
      updated(this.actions[i]);
    }
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
  public findAction(id: string) {
    for (let x of this.actions) {
      if (x.id == id)
        return x;
    }
    return null;
  }

  /**
   * Initialisation method for the notes
   */
  // Listen for changes on the notes
  public initNotes(actionId: string, run: boolean) {
    if (run) {
      this.af.database.list(Constants.APP_STATUS + "/note/" + actionId, {preserveSnapshot: true})
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
  private initDoc(alertUserTypeId: string, docId: string, actionId: string) {
    this.af.database.object(Constants.APP_STATUS + "/document/" + alertUserTypeId + "/" + docId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (this.findAction(actionId) != null) {
          let doc = snap.val();
          if (doc != null && doc != undefined) {
            doc.documentId = snap.key;
            this.findAction(actionId).addDoc(doc);
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
  public level: number;
  public requireDoc: boolean;
  public task: string;
  public type: number;
  public note: string;
  public noteId: string;
  public notes: PreparednessNotes[];
  public documents: any[];

  constructor() {
    this.assignedHazards = [];
    this.notes = [];
    this.attachments = [];
    this.documents = [];
  }

  public isRedAlertActive(map: Map<HazardScenario, boolean>): boolean {
    for (let x of this.assignedHazards) {
      if (map.get(x)) {
        return true;
      }
    }
    return false;
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
