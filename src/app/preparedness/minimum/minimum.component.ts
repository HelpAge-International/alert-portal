import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {AngularFire, FirebaseApp} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {
  ActionType, ActionLevel, SizeType, DocumentType, UserType, HazardScenario,
  FileExtensionsEnding, AlertMessageType, AlertLevels, ActionStatusMin
} from "../../utils/Enums";
import {Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LocalStorageService} from 'angular-2-local-storage';
import * as firebase from 'firebase';
import {UserService} from "../../services/user.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {AlertMessageModel} from "../../model/alert-message.model";
declare var jQuery: any;


@Component({
  selector: 'app-minimum',
  templateUrl: './minimum.component.html',
  styleUrls: ['./minimum.component.css']
})
export class MinimumPreparednessComponent implements OnInit, OnDestroy {

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
  // --- Declared because we're missing out "inactive" in this page
  private ACTION_STATUS = ["GLOBAL.ACTION_STATUS.EXPIRED", "GLOBAL.ACTION_STATUS.IN_PROGRESS", "GLOBAL.ACTION_STATUS.COMPLETED", "GLOBAL.ACTION_STATUS.ARCHIVED"];
  private actions: Actions[] = [];
  private DEPARTMENTS: string[] = [];
  private ACTION_TYPE = Constants.ACTION_TYPE;
  private ASSIGNED_TOO: PreparednessUser[] = [];
  private CURRENT_USERS: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private currentlyAssignedToo: PreparednessUser;

  private allUnassigned: boolean = false;
  private allArchived: boolean = false;
  // --- Declared because we're missing out "inactive" in this page
  private ActionStatus = ActionStatusMin;
  private ActionType = ActionType;

  // Page admin
  private isViewing: boolean;
  protected countrySelected = false;
  protected agencySelected = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private firebase: any;
  private documents: any[] = [];
  private docsSize: number;
  private documentActionId: string = "";
  private fileSize: number; // Always in Bytes
  private fileExtensions: FileExtensionsEnding[] = FileExtensionsEnding.list();

  // Used to run the initAlerts method after all actions have been returned
  private fbLocationCalls = 3;
  private now: number = new Date().getTime();

  // Assigning action
  private assignActionId: string = "0";
  private assignActionCategoryUid: string = "0";
  private assignActionAsignee: string = "0";

  // Loader Inactive
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  constructor(protected pageControl: PageControlService, @Inject(FirebaseApp) firebaseApp: any, protected af: AngularFire, protected router: Router, protected route: ActivatedRoute, protected storage: LocalStorageService, protected userService: UserService) {
    this.firebase = firebaseApp;
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

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }
        if (params["systemId"]) {
          this.systemAdminId = params["systemId"];
        }

        this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
          this.uid = user.uid;
          this.userType = userType;
          this.filterAssigned = this.uid;
          this.currentlyAssignedToo = new PreparednessUser(this.uid, true);
          this.getStaffDetails(this.uid);

          //overview
          if (this.agencyId && this.countryId && this.systemAdminId) {
            this.init(this.countryId);
            this.init(this.agencyId);
            this.init(this.systemAdminId);
            this.initStaff();
            this.initDepartments();
            this.initDocumentTypes();
          } else {
            // Get the country ID and load actions for country
            this.userService.getCountryId(Constants.USER_PATHS[this.userType], user.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(countryId => {
                this.countryId = countryId;
                this.init(this.countryId);
                this.initStaff();
              });
            // Get the agency ID and load actions for agency
            this.userService.getAgencyId(Constants.USER_PATHS[this.userType], user.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe((agencyId) => {
                this.agencyId = agencyId;
                this.init(this.agencyId);
                this.initDepartments();
              });
            // Get the system admin ID and load actions for system admin. We need it for document type
            this.userService.getSystemAdminId(Constants.USER_PATHS[this.userType], user.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe((system) => {
                this.systemAdminId = system;
                this.init(this.systemAdminId);
                this.initDocumentTypes();
                // System Admin always has Minimum Prep actions
                // this.init(this.systemAdminId, false);
              });
          }
        });

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
  private init(id: string) {
    this.af.database.list(Constants.APP_STATUS + "/action/" + id, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (snapshot.val().level !== ActionLevel.APA) {
            let act: Actions = new Actions();
            let obj = snapshot.val();
            act.id = snapshot.key;
            act.actionUid = id;
            act.asignee = (obj.asignee ? obj.asignee : "");
            act.dueDate = (obj.dueDate ? obj.dueDate : new Date().getTime());
            act.isArchived = !obj.isActive;
            act.budget = (obj.budget ? obj.budget : 0);
            act.department = (obj.department ? obj.department : "");
            act.isComplete = (obj.isComplete ? obj.isComplete : false);
            act.requireDoc = (obj.requireDoc ? obj.requireDoc : '');
            act.task = (obj.task ? obj.task : '');
            act.type = (obj.type ? obj.type : 0);
            act.frequencyBase = (obj.frequencyBase ? +obj.frequencyBase : 0);
            act.frequencyValue = (obj.frequencyValue ? +obj.frequencyValue : 0);
            this.updateAction(act);
            this.initNotes(act.id);


            if (snapshot.val().documents != null) {
              for (let doc in snapshot.val().documents) {
                this.initDoc(id, doc, act.id);
              }
            }
          }
        });
      });
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
   * Initialisation method for the document types that can be uploaded
   */
  private initDocumentTypes() {
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.systemAdminId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        let index = 0;
        for (let x of snap.val().fileSettings) {
          this.fileExtensions[index].allowed = snap.val().fileSettings[index];
          index++;
        }
        this.fileSize = snap.val().fileType == 1 ? 1000 * snap.val().fileSize : snap.val().fileSize;
        this.fileSize = this.fileSize * 1000 * 1000;
      });
  }

  /**
   * Get the documents associated with an Action
   */
  private initDoc(heirachyId: string, docId: string, actionId: string) {
    this.af.database.object(Constants.APP_STATUS + "/document/" + heirachyId + "/" + docId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (this.getAction(actionId) != null) {
          let doc = snap.val();
          if (doc != null && doc != undefined) {
            doc.documentId = snap.key;
            this.getAction(actionId).addDoc(doc);
          }
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
   * File uploading
   */
  public fileChange(event, action: Actions, actionId: string) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];

      jQuery('#docUpload' + actionId).val("");

      file.actionId = action.id;
      let exists = false;

      if (action.attachments == undefined)
        action.attachments = [];

      action.attachments.map(attachment => {
        if (attachment.name == file.name && attachment.actionId == file.actionId) {
          exists = true;
          console.log("exists");
        }
      });

      console.log(file);
      let fileTypeAllowed = false;
      for (let x of this.fileExtensions) {
        for (let ext of x.extensions) {
          if (file.name.toLowerCase().trim().endsWith(ext) && x.allowed) {
            fileTypeAllowed = true;
          }
        }
      }

      let fileSizeAllowed = false;
      if (file.size < this.fileSize) {
        fileSizeAllowed = true;
      }

      if (!fileSizeAllowed) {
        this.alertMessage = new AlertMessageModel("File size too big! Must be less than " + ((this.fileSize / 1000) / 1000) + "MB");
        return;
      }
      if (!fileTypeAllowed) {
        this.alertMessage = new AlertMessageModel("AGENCY_ADMIN.SETTINGS.DOCUMENTS.INVALID_DOCUMENT_TYPE");
        return;
      }

      if (!exists) {
        action.attachments.push(file);
        this.updateAction(action);
      }
    }
  }


  /**
   * Completing an action
   */
  protected completeAction(action: Actions) {
    console.log("Completing action!");
    if (action.note == null || action.note.trim() == "") {
      this.alertMessage = new AlertMessageModel("Completion note cannot be empty");
    } else {
      if (action.requireDoc) {
        if (action.attachments != undefined && action.attachments.length > 0) {
          action.attachments.map(file => {
            this.uploadFile(action, file);
          });
          this.af.database.object(Constants.APP_STATUS + '/action/' + action.actionUid + '/' + action.id).update({isComplete: true});
          this.addNote(action);
        }
        else {
          this.alertMessage = new AlertMessageModel("You have not attached any Documents. Documents are required");
        }
      }
      else {
        // Doesn't require doc
        if (action.attachments != null) {
          action.attachments.map(file => {
            this.uploadFile(action, file);
          });
        }
        this.af.database.object(Constants.APP_STATUS + '/action/' + action.actionUid + '/' + action.id).update({isComplete: true});
        this.addNote(action);
        this.closePopover(action);
      }
      this.updateAction(action);
    }
  }

  // Close documents popover
  protected closePopover(action: Actions) {
    jQuery("#popover_content_" + action.id).toggle("collapse");
  }

  // Uploading a file to Firebase
  protected uploadFile(action: Actions, file) {
    let document = {
      fileName: file.name,
      filePath: "", //this needs to be updated once the file is uploaded
      module: DocumentType.APA,
      size: file.size * 0.001,
      sizeType: SizeType.KB,
      title: file.name,
      time: firebase.database.ServerValue.TIMESTAMP,
      uploadedBy: this.uid
    };

    this.af.database.list(Constants.APP_STATUS + '/document/' + action.actionUid).push(document)
      .then(_ => {
        let docKey = _.key;
        let doc = {};
        doc[docKey] = true;

        this.af.database.object(Constants.APP_STATUS + '/action/' + action.actionUid + '/' + action.id + '/documents').update(doc)
          .then(_ => {
            new Promise((res, rej) => {
              var storageRef = this.firebase.storage().ref().child('documents/' + this.countryId + '/' + docKey + '/' + file.name);
              var uploadTask = storageRef.put(file);
              uploadTask.on('state_changed', function (snapshot) {
              }, function (error) {
                rej(error);
              }, function () {
                var downloadURL = uploadTask.snapshot.downloadURL;
                res(downloadURL);
              });
            })
              .then(result => {
                document.filePath = "" + result;

                this.af.database.object(Constants.APP_STATUS + '/document/' + action.actionUid + '/' + docKey).set(document);
              })
              .catch(err => {
                console.log(err, 'You do not have access!');
                this.purgeDocumentReference(action, docKey);
              });
          })
          .catch(err => {
            console.log(err, 'You do not have access!');
            this.purgeDocumentReference(action, docKey);
          });
      })
      .catch(err => {
        console.log(err, 'You do not have access!');
      });
  }

  // Remove document
  protected purgeDocumentReference(action: Actions, docKey) {
    this.af.database.object(Constants.APP_STATUS + '/action/' + action.actionUid + '/' + action.id + '/documents/' + docKey).set(null);
    this.af.database.object(Constants.APP_STATUS + '/document/' + action.actionUid + '/' + docKey).set(null);
  }

  protected removeAttachment(action, file) {
    action.attachments = action.attachments.filter(attachment => {
      if (attachment.name == file.name && attachment.actionId == file.actionId)
        return false;

      return true;
    });
  }

  // Delete document from firebase
  protected deleteDocument(action: Actions, docId: string) {
    let documentId = action.documents[docId].documentId;
    this.af.database.object(Constants.APP_STATUS + '/action/' + action.actionUid + '/' + action.id + '/documents/' + documentId).set(null);
    this.af.database.object(Constants.APP_STATUS + '/document/' + action.actionUid + '/' + documentId).set(null);
    this.firebase.storage().ref().child('documents/' + action.actionUid + "/" + documentId).delete();
  }

  // Exporting all the documents
  protected exportAllDocuments(action: Actions) {
    this.documents = action.documents;
    this.docsSize = 0;
    this.documentActionId = action.id;
    for (let x of action.documents) {
      console.log(x);
      this.docsSize += x.size;
    }
    this.docsSize = this.docsSize / 1000;
    jQuery("#export_documents").modal('show');

  }

  // Exporting all documents
  protected exportAllDocsFromModal(actionId: string) {
    let index = 0;
    let action = this.getAction(actionId);
    if (action != null) {
      for (let doc of action.documents) {
        this.exportDocument(action, "" + index);
        index++;
      }
    }
    else {
      this.alertMessage = new AlertMessageModel("Error exporting your documents");
    }
  }

  protected closeExportModal() {
    jQuery("#export_documents").modal("hide");
  }

  // Export a single document
  protected exportDocument(action: Actions, docId: string) {
    console.log(docId);
    let doc = action.documents[docId];

    let self = this;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function (event) {
      self.download(xhr.response, doc.fileName, xhr.getResponseHeader("Content-Type"));
    };
    xhr.open('GET', doc.filePath);
    xhr.send();
  }

  // Create a download <a> element to emulate actual file downloads
  protected download(data, name, type) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    var file = new Blob([data], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
  }

  protected closeDocumentsModal(elementId: string) {
    jQuery("#" + elementId).collapse('hide');
  }


  /**
   * Reactivating an Action from Archived -> Non-Archived
   */
  public reactivate(action: Actions) {
    console.log("Re-activate");
    let update = {
      isActive: true
    };
    console.log(Constants.APP_STATUS + "/action/" + action.actionUid + "/" + action.id);
    this.af.database.object(Constants.APP_STATUS + "/action/" + action.actionUid + "/" + action.id).update(update);
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
    console.log(this.documents);
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
