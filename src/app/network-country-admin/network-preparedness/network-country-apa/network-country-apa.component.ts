import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Constants} from "../../../utils/Constants";
import {
  CountryPermissionsMatrix, NetworkModulesEnabledModel,
  PageControlService
} from "../../../services/pagecontrol.service";
import {AngularFire, FirebaseApp} from "angularfire2";
import {NetworkService} from "../../../services/network.service";
import {NotificationService} from "../../../services/notification.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {WindowRefService} from "../../../services/window-ref.service";
import {
  ActionLevel, ActionStatus, ActionType, AlertLevels, AlertMessageType, Currency, DocumentType,
  FileExtensionsEnding, HazardScenario, Privacy, SizeType, UserType
} from "../../../utils/Enums";
import {
  PrepActionService, PreparednessAction, PreparednessNotes,
  PreparednessUser
} from "../../../services/prepactions.service";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {ModelDepartment} from "../../../model/department.model";
import {MessageModel} from "../../../model/message.model";
import * as firebase from "firebase";
import {LocalStorageService} from "angular-2-local-storage";
import {CommonUtils} from "../../../utils/CommonUtils";
import {NetworkCountryModel} from "../../network-country.model";
import {ModelAgency} from "../../../model/agency.model";
import {UserService} from "../../../services/user.service";

declare const jQuery: any;

@Component({
  selector: 'app-network-country-apa',
  templateUrl: './network-country-apa.component.html',
  styleUrls: ['./network-country-apa.component.css']
})
export class NetworkCountryApaComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;


  // Models
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;


  //logic
  private networkId: string;
  private networkCountryId: string;
  private agencyCountryMap: Map<string, string>;
  private showLoader: boolean;
  private uid: string;
  private firebase: any;

  //for local network admin
  @Input() isLocalNetworkAdmin: boolean;
  private networkViewValues: {};
  private agencyNamesMap = new Map<string, ModelAgency>()

  //copy over from response plan
  // IDs
  private userType: UserType;
  private Privacy = Privacy;
  private UserType = UserType;
  private userTypes = UserType;
  private countryId: string;
  private agencyId: string;
  private systemAdminId: string;
  private isViewing: boolean;
  private isSameAgency: boolean = false;
  public myFirstName: string;
  public myLastName: string;

  // Filters
  private filterStatus: number = -1;
  private filterDepartment: string = "-1";
  private filterType: number = -1;
  private filterAssigned: string = "-1";
  private filerNetworkAgency: string = "-1";

  // Data for the actions
  private ACTION_STATUS = Constants.ACTION_STATUS;
  private DEPARTMENTS: ModelDepartment[] = [];
  private DEPARTMENT_MAP: Map<string, string> = new Map<string, string>();
  private ACTION_TYPE = Constants.ACTION_TYPE;
  private ASSIGNED_TOO: PreparednessUser[] = [];
  private CURRENT_USERS: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private currentlyAssignedToo: PreparednessUser;
  private hazardRedAlert: Map<HazardScenario, boolean> = new Map<HazardScenario, boolean>();

  private allUnassigned: boolean = true;
  private allArchived: boolean = false;
  private ActionStatus = ActionStatus;
  private ActionType = ActionType;

  // Page admin
  protected countrySelected = false;
  protected agencySelected = false;
  private documents: any[] = [];
  private docsSize: number;
  private documentActionId: string = "";
  private fileSize: number; // Always in Bytes
  private fileExtensions: FileExtensionsEnding[] = FileExtensionsEnding.list();
  private actionLevelEnum = ActionLevel;

  // Used to run the initAlerts method after all actions have been returned
  private fbLocationCalls = 3;
  private now: number = new Date().getTime();

  // Assigning action
  private assignActionId: string = "0";
  private assignActionCategoryUid: string = "0";
  private assignActionAsignee: string = "0";
  private assignActionTask: string = "";

  // Loader Inactive
  protected prepActionService: PrepActionService = new PrepActionService();
  private permissionsAreEnabled: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  private privacy: NetworkModulesEnabledModel;
  private isViewingFromExternal: boolean;


  constructor(private pageControl: PageControlService,
              @Inject(FirebaseApp) firebaseApp: any,
              private af: AngularFire,
              private networkService: NetworkService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private windowService: WindowRefService,
              private storageService: LocalStorageService,
              private userService: UserService,
              private router: Router) {
    this.firebase = firebaseApp;
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['isViewing']) {
        this.isViewing = params['isViewing'];
      }
      if (params['systemId']) {
        this.systemAdminId = params['systemId'];
      }
      if (params['agencyId']) {
        this.agencyId = params['agencyId'];
      }
      if (params['countryId']) {
        this.countryId = params['countryId'];
      }
      if (params['userType']) {
        this.userType = params['userType'];
      }
      if (params['networkId']) {
        this.networkId = params['networkId'];
      }
      if (!this.isLocalNetworkAdmin) {
        this.networkCountryId = params["networkCountryId"];
      }
      if (params['uid']) {
        this.uid = params['uid'];
      }
      if (params["isViewingFromExternal"]) {
        this.isViewingFromExternal = params["isViewingFromExternal"]
      }
      this.isViewing ? this.isLocalNetworkAdmin ? this.initViewLocalNetworkAccess() : this.initViewNetworkAccess() : this.isLocalNetworkAdmin ? this.initLocalNetworkAccess() : this.initNetworkAccess();
    })
  }

  private initNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;
      this.filterAssigned = "0";
      this.currentlyAssignedToo = new PreparednessUser(this.uid, true);
      this.getStaffDetails(this.uid, true);

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];

          this.networkService.getSystemIdForNetworkCountryAdmin(this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(systemId => {
              this.systemAdminId = systemId;
              this.showLoader = false;

              this.prepActionService.initActionsWithInfoNetwork(this.af, this.ngUnsubscribe, this.uid, false,
                this.networkCountryId, this.networkId, this.systemAdminId);
              this.initDocumentTypes();
              this.initAlerts();
            });

          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.privacy = matrix);

          this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(agencyCountryMap => {
              this.initAgencies(agencyCountryMap)
            })

        });
    });
  }

  private initLocalNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;
      this.filterAssigned = "0";
      this.currentlyAssignedToo = new PreparednessUser(this.uid, true);
      this.getStaffDetails(this.uid, true);

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];

          this.networkService.getSystemIdForNetworkAdmin(this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(systemId => {
              this.systemAdminId = systemId;
              this.showLoader = false;

              this.prepActionService.initActionsWithInfoNetworkLocal(this.af, this.ngUnsubscribe, this.uid, false, this.networkId, this.systemAdminId);
              this.initDocumentTypes();
              this.initAlerts();
            });

          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.privacy = matrix);

          // Currency
          // this.calculateCurrency();
        });
    });
  }

  private initViewNetworkAccess() {
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    this.filterAssigned = "0";
    this.currentlyAssignedToo = new PreparednessUser(this.uid, true);
    this.getStaffDetails(this.uid, true);

    this.prepActionService.initActionsWithInfoNetwork(this.af, this.ngUnsubscribe, this.uid, false,
      this.networkCountryId, this.networkId, this.systemAdminId);
    this.initDocumentTypes();
    this.initAlerts();

    this.networkService.getNetworkModuleMatrix(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(matrix => this.privacy = matrix);

    this.networkService.mapNetworkWithCountryForCountry(this.agencyId, this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkMap => {
        this.initNetworkAdmin(networkMap)
        this.initAgenciesDetails(networkMap)
      })

    this.initStaff(this.agencyId, this.countryId)

    PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, this.userType, (isEnabled) => {
      this.permissionsAreEnabled = isEnabled;
    });

  }

  private initViewLocalNetworkAccess() {
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    this.filterAssigned = "0";
    this.currentlyAssignedToo = new PreparednessUser(this.uid, true);
    this.getStaffDetails(this.uid, true);

    this.prepActionService.initActionsWithInfoNetworkLocal(this.af, this.ngUnsubscribe, this.uid, false,
      this.networkId, this.systemAdminId);
    this.initDocumentTypes();
    this.initAlerts();

    this.networkService.getNetworkModuleMatrix(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(matrix => this.privacy = matrix);

    this.networkService.mapNetworkWithCountryForCountry(this.agencyId, this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkMap => {
        this.initNetworkAdmin(networkMap)
        this.initAgenciesDetails(networkMap)
      })

    this.initStaff(this.agencyId, this.countryId)

    PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, this.userType, (isEnabled) => {
      this.permissionsAreEnabled = isEnabled;
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Initialisation method for the alerts. Builds the map HazardScenario -> boolean if they're active or not
   */
  private initAlerts() {
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.af.database.list(Constants.APP_STATUS + "/alert/" + id, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
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
            if (this.hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              this.hazardRedAlert.set(snapshot.val().hazardScenario, res);
            }
          }
          else {
            if (this.hazardRedAlert.get(snapshot.val().hazardScenario) != true) {
              this.hazardRedAlert.set(snapshot.val().hazardScenario, false);
            }
          }
          console.log(this.hazardRedAlert)
        });
      });

    // Populate actions
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
   * Initialisation method for the staff under the country office
   */
  private initCountryAdmin(agencyId, countryId) {
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.getStaffDetails(snap.val().adminId, false);
        }
      });
  }

  private initStaff(agencyId, countryId) {
    this.initCountryAdmin(agencyId, countryId);
    this.af.database.list(Constants.APP_STATUS + "/staff/" + countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          this.getStaffDetails(snapshot.key, false);
        });
      });
  }

  /**
   * Calculate the currency
   */
  private currency: number = Currency.GBP;
  private CURRENCIES = Constants.CURRENCY_SYMBOL;

  public calculateCurrency() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/currency", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.currency = snap.val();
      });
  }

  /**
   * Get staff member public user data (names, etc.)
   */
  public getStaffDetails(uid: string, isMe: boolean) {
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

          if (isMe) {
            this.myFirstName = snap.firstName;
            this.myLastName = snap.lastName;
          }
        });
    }
  }

  /**
   * Get the actions
   */
  public getAction(id: string) {
    return this.prepActionService.findAction(id);
  }

  protected copyAction(action) {
    this.storageService.set('selectedAction', action);
    this.router.navigate(["/preparedness/create-edit-preparedness"]);
  }

  /**
   * Assigning an action to someone
   */
  public assignActionDialogAdv(action: PreparednessAction) {
    if (action.dueDate == null || action.department == null || action.budget == null || action.task == null || action.requireDoc == null || action.level == null) {
      // TODO: FIGURE OUT HOW THIS IS GOING TO BE EDITING
      this.isViewing ? this.router.navigate(["/network-country/network-country-create-edit-action/" + action.id, this.networkViewValues])
        :
        this.isLocalNetworkAdmin ? this.router.navigate(["/network-country/network-country-create-edit-action/" + action.id, {"isLocalNetworkAdmin": true}]) : this.router.navigateByUrl("/network-country/network-country-create-edit-action/" + action.id);
    } else {
      this.assignActionId = action.id;
    }
  }

  public saveAssignedUser() {
    if (this.assignActionAsignee == null || this.assignActionAsignee === "0" || this.assignActionAsignee === undefined ||
      this.assignActionId == null || this.assignActionId === "0" || this.assignActionId === undefined) {
      return;
    }
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/asignee").set(this.assignActionAsignee)
      .then(() => {
        this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/task")
          .takeUntil(this.ngUnsubscribe)
          .subscribe(task => {
            // Send notification to the assignee
            let notification = new MessageModel();
            notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_TITLE");
            notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_APA_ACTION_CONTENT", {actionName: task ? task.$value : ''});
            console.log(notification.content);

            notification.time = new Date().getTime();
            this.notificationService.saveUserNotificationWithoutDetails(this.assignActionAsignee, notification).takeUntil(this.ngUnsubscribe).subscribe(() => {
            });
          });
      });
    this.closeModal();
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
  // Adding a note to firebase
  public addNote(action: PreparednessAction) {
    if (action.note == undefined) {
      return;
    }

    const note = {
      content: action.note,
      time: new Date().getTime(),
      uploadBy: this.uid
    };
    const noteId = action.noteId;

    action.note = '';
    action.noteId = '';

    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    if (noteId != null && noteId !== '') {
      this.af.database.object(Constants.APP_STATUS + '/note/' + id + '/' + action.id + '/' + noteId).set(note);
    }
    else {
      this.af.database.list(Constants.APP_STATUS + '/note/' + id + '/' + action.id).push(note);
    }
  }

  // Edit mode
  protected editNote(note: PreparednessNotes, action: PreparednessAction) {
    action.noteId = note.id;
    action.note = note.content;
  }

  // Delete note
  protected deleteNote(note: PreparednessUser, action: PreparednessAction) {
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.af.database.list(Constants.APP_STATUS + '/note/' + id + '/' + action.id + '/' + note.id).remove();
  }

  // Disable editing a note
  protected disableEditNote(action: PreparednessAction) {
    action.noteId = '';
    action.note = '';
  }


  /**
   * File uploading
   */
  public fileChange(event, action: PreparednessAction, actionId: string) {
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
        }
      });

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
      }
    }
  }


  /**
   * Completing an action
   */
  protected completeAction(action: PreparednessAction) {
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    if (action.note == null || action.note.trim() == "") {
      this.alertMessage = new AlertMessageModel("Completion note cannot be empty");
    } else {
      if (action.requireDoc) {
        if (action.attachments != undefined && action.attachments.length > 0) {
          action.attachments.map(file => {
            this.uploadFile(action, file);
          });
          this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id).update({
            isComplete: true,
            isCompleteAt: new Date().getTime()
          });
          this.addNote(action);
          this.closePopover(action);
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
        this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id).update({
          isComplete: true,
          isCompleteAt: new Date().getTime()
        });
        this.addNote(action);
        console.log(Constants.APP_STATUS + '/action/' + id + '/' + action.id, 'in complete');
        this.closePopover(action);
      }
    }
  }

  /**
   * Undoing an action
   */


  // (Dan) - this new function is for the undo completed APA
  protected undoCompleteAction(action: PreparednessAction) {

    action.actualCost = null

    console.log(Constants.APP_STATUS + '/action/' + action.countryUid + '/' + action.id, 'in undo');
    //Call to firebase to update values to revert back to *In Progress*
    this.af.database.object(Constants.APP_STATUS + '/action/' + action.countryUid + '/' + action.id).update({
      isComplete: false,
      isCompleteAt: null,
      updatedAt: new Date().getTime(),
      actualCost : null
    });

  }

  //Close documents popover
  protected closePopover(action: PreparednessAction) {
    let toggleDialog = jQuery("#popover_content_" + action.id);
    toggleDialog.toggle();
  }

  cancelComplete(action) {
    action.actualCost = null
    this.closePopover(action)
  }

  // Uploading a file to Firebase
  protected uploadFile(action: PreparednessAction, file) {
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
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

    this.af.database.list(Constants.APP_STATUS + '/document/' + id).push(document)
      .then(_ => {
        let docKey = _.key;
        let doc = {};
        doc[docKey] = true;

        this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id + '/documents').update(doc)
          .then(() => {
            new Promise((res, rej) => {
              let storageRef = this.firebase.storage().ref().child('documents/' + id + '/' + docKey + '/' + file.name);
              let uploadTask = storageRef.put(file);
              uploadTask.on('state_changed', function () {
              }, function (error) {
                rej(error);
              }, function () {
                let downloadURL = uploadTask.snapshot.downloadURL;
                res(downloadURL);
              });
            })
              .then(result => {
                document.filePath = "" + result;

                this.af.database.object(Constants.APP_STATUS + '/document/' + id + '/' + docKey).set(document);
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
  protected purgeDocumentReference(action: PreparednessAction, docKey) {
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id + '/documents/' + docKey).set(null);
    this.af.database.object(Constants.APP_STATUS + '/document/' + id + '/' + docKey).set(null);
  }

  protected removeAttachment(action, file) {
    action.attachments = action.attachments.filter(attachment => {
      return !(attachment.name == file.name && attachment.actionId == file.actionId);
    });
  }

  // Delete document from firebase
  protected deleteDocument(action: PreparednessAction, docId: string) {
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    for (let x of action.documents) {
      if (x.documentId == docId) {
        // Deleting this one!
        this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id + '/documents/' + x.documentId).set(null);
        this.af.database.object(Constants.APP_STATUS + '/document/' + id + '/' + x.documentId).set(null);
        this.firebase.storage().ref().child('documents/' + id + "/" + x.documentId + "/" + x.fileName).delete();
      }
    }
  }

  // Exporting all the documents
  protected exportAllDocuments(action: PreparednessAction) {
    this.documents = action.documents;
    this.docsSize = 0;
    this.documentActionId = action.id;
    for (let x of action.documents) {
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
  protected exportDocument(action: PreparednessAction, docId: string) {
    let doc = action.documents[docId];

    let self = this;
    let xhr = new XMLHttpRequest();
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
  public reactivate(action: PreparednessAction) {
    let update = {
      isArchived: false
    };
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + action.id).update(update);
  }

  /**
   * UI methods
   */

  public closeModal() {
    jQuery("#leadAgencySelection").modal('hide');
  }

  checkIfLink(source) {
    if (source.startsWith("http://")) {
      this.windowService.getNativeWindow().open(source);
    } else if (source.startsWith("www.")) {
      this.windowService.getNativeWindow().open("http://" + source);
    }
  }

  private initNetworkAdmin(map: Map<string, string>) {
    CommonUtils.convertMapToKeysInArray(map).forEach(networkId => {
      this.networkService.getNetworkCountry(networkId, map.get(networkId))
        .takeUntil(this.ngUnsubscribe)
        .subscribe((model: NetworkCountryModel) => {
          this.getStaffDetails(model.adminId, false)
        })
    })
  }

  private initAgenciesDetails(networkMap: Map<string, string>) {
    CommonUtils.convertMapToKeysInArray(networkMap).forEach(networkId => {
      this.networkService.mapAgencyCountryForNetworkCountry(networkId, networkMap.get(networkId))
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencyCountryMap => {
          CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
            this.userService.getAgencyModel(agencyId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe((agency: ModelAgency) => {
                this.agencyNamesMap.set(agencyId, agency)
              })
          })
        })
    })
  }

  private initAgencies(agencyCountryMap: Map<string, string>) {
    CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
      this.userService.getAgencyModel(agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agency: ModelAgency) => {
          this.agencyNamesMap.set(agencyId, agency)
        })
    })

    CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
      this.initStaff(agencyId, agencyCountryMap.get(agencyId))
    })
  }

}
