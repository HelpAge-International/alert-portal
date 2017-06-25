import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {AngularFire, FirebaseApp} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {
  ActionLevel, ActionStatus, ActionType, AlertLevels, HazardScenario, ThresholdName,
  UserType
} from "../../utils/Enums";
import {Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
declare var jQuery: any;
import {LocalStorageService} from 'angular-2-local-storage';
import {MinimumPreparednessComponent} from '../minimum/minimum.component';
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})
export class AdvancedPreparednessComponent implements OnInit, OnDestroy {

  // IDs
  private uid: string;
  private userType: UserType;
  private UserType = UserType;
  private countryId: string;
  private agencyId: string;
  private systemAdminId: string;

  // Filters
  private filterStatus: number = -1;
  private filterDepartment: string = "-1";
  private filterType: number = -1;
  private filterAssigned: string = this.uid;
  private filerNetworkAgency: string = "-1";

  // Data for the actions
  private ACTION_STATUS = Constants.ACTION_STATUS;
  private actions: Actions[] = [];
  private DEPARTMENTS: string[] = [];
  private ACTION_TYPE = Constants.ACTION_TYPE;
  private ASSIGNED_TOO: PreparednessUser[] = [];
  private CURRENT_USERS: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private currentlyAssignedToo: PreparednessUser;
  private hazardRedAlert: Map<HazardScenario, boolean> = new Map<HazardScenario, boolean>();

  private allUnassigned: boolean = false;
  private allArchived: boolean = false;
  private ActionStatus = ActionStatus;

  // Page admin
  protected countrySelected = false;
  protected agencySelected = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  // Document exporting
  public documents: any[] = [];
  public docsSize: number = 0;

  // Used to run the initAlerts method after all actions have been returned
  private fbLocationCalls = 3;
  private now: number = new Date().getTime();

  // Assigning action
  private assignActionId: string = "0";
  private assignActionCategoryUid: string = "0";
  private assignActionAsignee: string = "0";

  constructor(protected pageControl: PageControlService, protected af: AngularFire, protected router: Router, protected route: ActivatedRoute, protected storage: LocalStorageService, protected userService: UserService) {

    // Configure the toolbar based on who's loading this in
    this.route.params.subscribe((params: Params) => {
      if (params['countryId']) {
        this.countryId = params['countryId'];
        this.countrySelected = true;
      }

      if (params['agencyId']) {
        this.agencyId = params['agencyId'];
        this.agencySelected = true;
      }
    });
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.userType = userType;
      this.filterAssigned = this.uid;
      this.currentlyAssignedToo = new PreparednessUser(this.uid, true);
      this.getStaffDetails(this.uid);
      // Get the country ID and load actions for country
      this.userService.getCountryId(Constants.USER_PATHS[this.userType], user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(countryId => {
          this.countryId = countryId;
          this.init(this.countryId, true);
          this.initStaff();
        });
      // Get the agency ID and load actions for agency
      this.userService.getAgencyId(Constants.USER_PATHS[this.userType], user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyId) => {
          this.agencyId = agencyId;
          this.init(this.agencyId, false);
          this.initDepartments();
        });
      // Get the system admin ID and load actions for system admin
      // EDIT: We don't actually need the System Admin Preparedness actions - System Admin can only create CHS Minimum prep, not
      //       applicable to advanced
      // this.userService.getSystemAdminId(Constants.USER_PATHS[this.userType], user.uid)
      //   .takeUntil(this.ngUnsubscribe)
      //   .subscribe((system) => {
      //     this.systemAdminId = system;
      //     // System Admin always has Minimum Prep actions
      //     // this.init(this.systemAdminId, false);
      //   });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Initialisation method for the action node. Takes the ID and pushes it to the list
   * @param id
   */
  private init(id: string, isCountry: boolean) {
    this.af.database.list(Constants.APP_STATUS + "/action/" + id, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (snapshot.val().level !== ActionLevel.MPA) {
            let act: Actions = new Actions();
            let obj = snapshot.val();
            act.id = snapshot.key;
            act.actionUid = id;
            act.asignee = (obj.asignee ? obj.asignee : "");
            act.dueDate = (obj.dueDate ? obj.dueDate : new Date().getTime());
            act.assignedHazards = [];

            if (obj.assignHazard) {
              for (const x of obj.assignHazard) {
                act.assignedHazards.push(x);
              }
            }

            /** WORKAROUND LOGIC FOR APA'S ON MANDATED PREP ACTIONS
             * - All Hazards are underneath it **/
            if (obj.type == ActionType.mandated && obj.level == ActionLevel.APA) {
              // Add all of them
              act.assignedHazards = [];
              for (const x in HazardScenario) {
                act.assignedHazards.push(+HazardScenario[x]);
              }
            }

            act.isArchived = (obj.isActive ? obj.isActive : false);
            act.budget = (obj.budget ? obj.budget : 0);
            act.department = (obj.department ? obj.department : "");
            act.isComplete = (obj.isComplete ? obj.isComplete : false);
            act.requireDoc = (obj.requireDoc ? obj.requireDoc : '');
            act.task = (obj.task ? obj.task : '');
            act.type = (obj.type ? obj.type : '');
            act.frequencyBase = (obj.frequencyBase ? +obj.frequencyBase : 0);
            act.frequencyValue = (obj.frequencyValue ? +obj.frequencyValue : 0);
            this.updateAction(act);
            this.initNotes(act.id);
          }
        });
        if (isCountry) {
          this.initAlerts();
        }
      });
  }

  /**
   * Initialisation method for the alerts. Builds the map HazardScenario -> boolean if they're active or not
   */
  private initAlerts() {
    this.af.database.list(Constants.APP_STATUS + "/alert/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (snapshot.val().alertLevel == AlertLevels.Red) {
            let res: boolean = true;
            for (const userTypes in snapshot.val().approval) {
              console.log(userTypes);
              for (const thisUid in snapshot.val().approval[userTypes]) {
                console.log(snapshot.val().approval[userTypes]);
                if (snapshot.val().approval[userTypes][thisUid] == 0) {
                  res = false;
                }
              }
            }
            this.hazardRedAlert.set(snapshot.val().hazardScenario, res);
          }
          else {
            this.hazardRedAlert.set(snapshot.val().hazardScenario, false);
          }
        });
      });

    // Populate actions
  }

  /**
   * Initialisation method for the departments of the agency
   */
  private initDepartments() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        for (const x in snap.val().departments) {
          this.DEPARTMENTS.push(x);
        }
      });
  }

  /**
   * Initialisation method for the staff under the country office
   */
  private initStaff() {
    this.af.database.list(Constants.APP_STATUS + "/staff/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          this.getStaffDetails(snapshot.key);
        });
      });
  }

  /**
   * Get staff member public user data (names, etc.)
   */
  public getStaffDetails(uid: string) {
    if (!this.CURRENT_USERS.get(uid)) {
      this.CURRENT_USERS.set(uid, PreparednessUser.placeholder(uid));
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          let prepUser: PreparednessUser = new PreparednessUser(uid, this.uid == uid);
          prepUser.firstName = snap.firstName;
          prepUser.lastName = snap.lastName;
          this.CURRENT_USERS.set(uid, prepUser);
          this.updateUser(prepUser);
        });
    }
  }

  /**
   * Assigning an action to someone
   */
  public assignActionDialogAdv(action: Actions) {
    this.assignActionId = action.id;
    this.assignActionCategoryUid = action.actionUid;
  }
  public selectedAssignToo(uid: string) {
    if (uid == "0" || uid == null) {
      return;
    }
    this.assignActionAsignee = uid;
  }
  public saveAssignedUser() {
    if (this.assignActionAsignee == null || this.assignActionAsignee === "0" || this.assignActionAsignee === undefined ||
      this.assignActionId == null || this.assignActionId === "0" || this.assignActionId === undefined ||
      this.assignActionCategoryUid == null || this.assignActionCategoryUid === "0" || this.assignActionCategoryUid === undefined) {
      return;
    }
    this.af.database.object(Constants.APP_STATUS + "/action/" + this.assignActionCategoryUid + "/" + this.assignActionId + "/asignee").set(this.assignActionAsignee);
    this.closeModal();
  }


  /**
   * Update method for the action. This will check if one already exists in the system beforehand, and only
   *   add it if it's new. If not, then it's updated.
   */
  public updateAction(action: Actions) {
    // Wrapper method to update the actions
    let ran: boolean = false;
    let index = 0;
    for (let x of this.actions) {
      if (x.id == action.id) {
        this.actions[index] = action;
        ran = true;
      }
      index++;
    }
    if (!ran) {
      this.actions.push(action);
    }
  }

  public getAction(actionId: string): Actions {
    for (let x of this.actions) {
      if (x.id == actionId) {
        return x;
      }
    }
    return null;
  }

  /**
   * Mark as Complete button for completing an action
   */
  public completeAction(action: Actions) {

  }

  /**
   * Update method for the user. This will check if it already exists, so as to not cause duplicates in the list
   */
  public updateUser(user: PreparednessUser) {
    let ran: boolean = false;
    for (let x of this.ASSIGNED_TOO) {
      if (x.id == user.id) {
        x = user;
        ran = true;
      }
      x.isMe = (x.id == this.uid);
    }
    if (!ran) {
      user.isMe = (user.id == this.uid);
      this.ASSIGNED_TOO.push(user);
    }
  }

  /**
   * Showing all unassigned actions
   */
  public showAllUnassigned(show: boolean) {
    this.allUnassigned = show;
  }


  /**
   * Showing all archived actions
   */
  public showAllArchived(show: boolean) {
    this.allArchived = show;
  }

  /**
   * Now (used to expired timer)
   */
  public getNow() {
    return this.now;
  }

  /**
   * Methods for the notes alongside an action
   */
  // Listen for changes on the notes
  public initNotes(actionId: string) {
    if (this.getAction(actionId) != null) {
      this.af.database.list(Constants.APP_STATUS + "/note/" + actionId, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          let action: Actions = this.getAction(actionId);
          if (action != null) {
            this.getAction(actionId).notes = [];
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
  protected addNoteToAction(note: PreparednessNotes, n: Actions) {
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
  // Adding a note to firebase
  public addNote(action: Actions) {
    if (action.note == undefined) {
      return;
    }

    const note = {
      content: action.note,
      time: new Date().getTime(),
      uploadBy: this.uid
    };
    const noteId = action.noteId;

    console.log(note);

    action.note = '';
    action.noteId = '';

    if (noteId != null && noteId !== '') {
      this.af.database.object(Constants.APP_STATUS + '/note/' + action.id + '/' + noteId).set(note);
    }
    else {
      this.af.database.list(Constants.APP_STATUS + '/note/' + action.id).push(note);
    }
  }
  // Edit mode
  protected editNote(note: PreparednessNotes, action: Actions) {
    action.noteId = note.id;
    action.note = note.content;
  }
  // Delete note
  protected deleteNote(note: PreparednessUser, action: Actions) {
    this.af.database.list(Constants.APP_STATUS + '/note/' + action.id + '/' + note.id).remove();
  }
  // Disable editing a note
  protected disableEditNote(action: Actions) {
    action.noteId = '';
    action.note = '';
  }

  /**
   * UI methods
   */

  public closeModal() {
    jQuery("#leadAgencySelection").modal('hide');
  }

}


/**
 * Holder class for the Actions
 */
export class Actions {
  public id: string;
  public actionUid: string;
  public actionStatus: number;
  public asignee: string;
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
  public documents: PreparednessDocument[];

  constructor() {
    this.assignedHazards = [];
    this.notes = [];
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
 * Holder for the document info
 */
export class PreparednessDocument {
  public id: string;
  public name: string;
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
