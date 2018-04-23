import {Component, Inject, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AngularFire, FirebaseApp} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {
  ActionLevel,
  ActionStatusMin,
  ActionType,
  AlertMessageType,
  Currency,
  DocumentType,
  FileExtensionsEnding,
  Privacy,
  SizeType,
  UserType
} from "../../utils/Enums";
import {Subject} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage";
import * as firebase from "firebase";
import {UserService} from "../../services/user.service";
import {
  AgencyModulesEnabled,
  CountryPermissionsMatrix,
  NetworkModulesEnabledModel,
  PageControlService
} from "../../services/pagecontrol.service";
import {NotificationService} from "../../services/notification.service";
import {AlertMessageModel} from "../../model/alert-message.model";
import {
  PrepActionService,
  PreparednessAction,
  PreparednessNotes,
  PreparednessUser
} from "../../services/prepactions.service";
import {MessageModel} from "../../model/message.model";
import {TranslateService} from "@ngx-translate/core";
import {ModelDepartment} from "../../model/department.model";
import {AgencyService} from "../../services/agency-service.service";
import {ModelAgencyPrivacy} from "../../model/agency-privacy.model";
import {SettingsService} from "../../services/settings.service";
import {WindowRefService} from "../../services/window-ref.service";
import {NetworkService} from "../../services/network.service";
import {ModelNetwork} from "../../model/network.model";
import {NetworkViewModel} from "../../country-admin/country-admin-header/network-view.model";
import {Observable} from "rxjs/Observable";
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {NoteService} from "../../services/note.service";

declare var jQuery: any;


@Component({
  selector: 'app-minimum',
  templateUrl: './minimum.component.html',
  styleUrls: ['./minimum.component.css'],
  providers: [AgencyService, SettingsService]
})
export class MinimumPreparednessComponent implements OnInit, OnDestroy {

  // IDs
  private uid: string;
  private userType: UserType;
  private UserType = UserType;
  private countryId: string;
  private agencyId: string;
  private systemAdminId: string;
  private updateActionId: string;
  public myFirstName: string;
  public myLastName: string;
  private extension: string;

  // Filters
  private filterStatus: number = -1;
  private filterDepartment: string = "-1";
  private filterType: number = -1;
  private filterAssigned: string = "-1";
  private filerNetworkAgency: string = "-1";

  // Data for the actions
  // --- Declared because we're missing out "inactive" in this page
  private ACTION_STATUS = ["GLOBAL.ACTION_STATUS.EXPIRED", "GLOBAL.ACTION_STATUS.IN_PROGRESS", "GLOBAL.ACTION_STATUS.COMPLETED", "GLOBAL.ACTION_STATUS.ARCHIVED", "GLOBAL.ACTION_STATUS.UNASSIGNED"];
  private DEPARTMENTS: ModelDepartment[] = [];
  private DEPARTMENT_MAP: Map<string, string> = new Map<string, string>();
  private ACTION_TYPE = Constants.ACTION_TYPE;
  private ASSIGNED_TOO: PreparednessUser[] = [];
  private CURRENT_USERS: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private CURRENT_USERS_NETWORK: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private currentlyAssignedToo: PreparednessUser;
  private actionLevelEnum = ActionLevel;

  private allUnassigned: boolean = true;
  private allArchived: boolean = false;
  // --- Declared because we're missing out "inactive" in this page
  private ActionStatus = ActionStatusMin;
  private ActionType = ActionType;

  // Page admin
  private isViewing: boolean;
  private isSameAgency: boolean = false;
  protected countrySelected = false;
  protected agencySelected = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private firebase: any;
  private documents: any[] = [];
  private docsSize: number;
  private documentActionId: string = "";
  private fileSize: number; // Always in Bytes
  private fileExtensions: FileExtensionsEnding[] = FileExtensionsEnding.list();
  public userTypes = UserType;
  private Privacy = Privacy;
  private actions: PreparednessAction[] = [];

  // Used to run the initAlerts method after all actions have been returned
  private fbLocationCalls = 3;
  private now: number = new Date().getTime();

  // Assigning action
  private assignActionId: string = "0";
  private assignActionCategoryUid: string = "0";
  private assignActionAsignee: string = "0";
  private assignActionTask: string = "";

  // Loader Inactive
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;
  // Module permissions settings

  private modulesAreEnabled: AgencyModulesEnabled = new AgencyModulesEnabled();
  private permissionsAreEnabled: CountryPermissionsMatrix = new CountryPermissionsMatrix();
  protected prepActionService: PrepActionService = new PrepActionService();

  private privacy: ModelAgencyPrivacy;
  private userAgencyId: string;

  //network
  private networkModuleMap = new Map<string, NetworkModulesEnabledModel>();
  private networkModelMap = new Map<string, ModelNetwork>();
  private networkIdList: string [] = [];

  //Local Agency
  @Input() isLocalAgency: boolean;
  private stopCondition: boolean;

  @Input() isAgencyAdmin: boolean;

  private unassignedNetworkActions = []
  private unassignedNetworkActionsLocal = []
  private fromNetwork: boolean = false
  private selectedNetworkId: string
  private fromLocalAgency: boolean;

  constructor(protected pageControl: PageControlService,
              @Inject(FirebaseApp) firebaseApp: any,
              protected af: AngularFire,
              protected router: Router,
              protected route: ActivatedRoute,
              protected storage: LocalStorageService,
              protected userService: UserService,
              protected agencyService: AgencyService,
              protected countryService: SettingsService,
              protected notificationService: NotificationService,
              private networkService: NetworkService,
              private windowService: WindowRefService,
              private noteService:NoteService,
              protected translate: TranslateService) {
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

      if (params['isCHS']) {
        this.filterType = 0;
      }
    });
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()
  }

  initLocalAgency() {

    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.assignActionAsignee = this.uid;
      this.userType = userType;
      this.filterAssigned = "0";
      this.currentlyAssignedToo = new PreparednessUser(this.uid, true);

      this.systemAdminId = systemId;

      this.agencyId = agencyId;
      this.countryId = countryId;

      this.getStaffDetails(this.uid, true);


      //overview
      this.prepActionService.initActionsWithInfoLocalAgency(this.af, this.ngUnsubscribe, this.uid, this.userType, true,
        this.agencyId, this.systemAdminId);
      this.initStaff();
      this.initDepartments();
      this.initDocumentTypes();

      // Initialise the page control information
      PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[userType], (isEnabled) => {
        this.modulesAreEnabled = isEnabled;
      });


      // Currency
      this.calculateCurrency();
    })

  }

  initCountryOffice() {
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
        if (params["isLocalAgency"]) {
          this.fromLocalAgency = params["isLocalAgency"];
        }
        if (params['updateActionID']) {
          this.updateActionId = params['updateActionID'];

          Observable.interval(2000)
            .takeWhile(() => !this.stopCondition)
            .subscribe(i => {
              this.triggerScrollTo()
              this.stopCondition = true
            })
        }

        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.userAgencyId = agencyId;
          this.isSameAgency = this.agencyId == agencyId;
          this.uid = user.uid;
          this.assignActionAsignee = this.uid;
          this.userType = userType;
          this.filterAssigned = "0";
          this.currentlyAssignedToo = new PreparednessUser(this.uid, true);
          if (this.systemAdminId == null) {
            this.systemAdminId = systemId;
          }
          if (!this.isViewing) {
            this.agencyId = agencyId;
            this.countryId = countryId;
          }
          // this.getStaffDetails(this.uid, true);

          PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled) => {
            this.permissionsAreEnabled = isEnabled;
          });

          //overview
          this.prepActionService.initActionsWithInfo(this.af, this.ngUnsubscribe, this.uid, this.userType, true,
            this.countryId, this.agencyId, this.systemAdminId, this.updateActionId);
          this.initStaff();
          this.initDepartments();
          this.initDocumentTypes();

          // Initialise the page control information
          PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[userType], (isEnabled) => {
            this.modulesAreEnabled = isEnabled;
          });

          this.countryService.getPrivacySettingForCountry(this.countryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(privacy => {
              this.privacy = privacy;
            });

          // Currency
          this.calculateCurrency();

          //network
          if (!this.isViewing) {
            console.log("need to fetch network actions")
            this.networkService.mapNetworkWithCountryForCountry(this.agencyId, this.countryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(networkMap => {
                console.log(networkMap)
                this.networkIdList = []
                networkMap.forEach((networkCountryId, networkId) => {
                  this.networkIdList.push(networkId)
                  this.networkService.getNetworkModuleMatrix(networkId)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(matrix => {
                      this.networkModuleMap.set(networkId, matrix)
                    })

                  this.networkService.getNetworkDetail(networkId)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(network => {
                      this.networkModelMap.set(networkId, network)
                    })

                  this.fetchUnassignedNetworkActions(networkCountryId)

                })

                this.prepActionService.initActionsWithInfoAllNetworksInCountry(this.af, this.ngUnsubscribe, this.uid, true, this.countryId, this.agencyId, this.systemAdminId, networkMap)

              })
            // Get all local network Id for this country
            this.networkService.getLocalNetworkModelsForCountry(this.agencyId, this.countryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(localNetworks => {
                console.log(localNetworks);
                localNetworks.forEach((localNetwork) => {
                  this.networkService.getNetworkModuleMatrix(localNetwork.id)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(matrix => {
                      this.networkModuleMap.set(localNetwork.id, matrix)
                    })

                  this.networkService.getNetworkDetail(localNetwork.id)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(network => {
                      this.networkModelMap.set(localNetwork.id, network)
                    })

                  this.fetchUnassignedNetworkActions(localNetwork.id)

                })

                this.prepActionService.initActionsWithInfoAllLocalNetworksInCountry(this.af, this.ngUnsubscribe, this.uid, true, this.countryId, this.agencyId, this.systemAdminId, localNetworks)

              })
          }
        });

      });
    this.initLocalDisplay();
  }

  public triggerScrollTo() {
    jQuery("#popover_content_" + this.updateActionId).collapse('show');

    jQuery('html, body').animate({
      scrollTop: jQuery("#popover_content_" + this.updateActionId).offset().top - 200
    }, 1000);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Initialisation method for the departments of the agency
   */
  private initDepartments() {
    this.DEPARTMENTS = [];
    this.DEPARTMENT_MAP.clear();
    //for agency level
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.DEPARTMENTS.push(x);
          this.DEPARTMENT_MAP.set(x.id, x.name);
        });
      });
    //for country level
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.DEPARTMENTS.push(x);
          this.DEPARTMENT_MAP.set(x.id, x.name);
        });
      });
  }

  /**
   * Initialisation method for the document types that can be uploaded
   */
  private initDocumentTypes() {
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.systemAdminId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        console.log(snap.val().fileSettings)
        let index = 0;
        let ext = "";
        for (let x of snap.val().fileSettings) {
          this.fileExtensions[index].allowed = snap.val().fileSettings[index];
          console.log(this.fileExtensions[index].allowed)

          if (this.fileExtensions[index].allowed){
            ext = ext.concat(this.fileExtensions[index].extensions[1] ? this.fileExtensions[index].extensions[0] +" "+ this.fileExtensions[index].extensions[1] +" " : this.fileExtensions[index].extensions[0]+ " ");
          }
          index++;

        }
        this.extension = ext;
        this.fileSize = snap.val().fileType == 1 ? 1000 * snap.val().fileSize : snap.val().fileSize;
        this.fileSize = this.fileSize * 1000 * 1000;
      });
  }

  /**
   * Initialisation method for the staff under the country office
   */
  private initCountryAdmin() {
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.getStaffDetails(snap.val().adminId, false);
        }
      });
  }

  private initCountryAdminLocalAgency() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.getStaffDetails(snap.val().adminId, false);
        }
      });
  }

  private initStaff() {
    this.initCountryAdmin();
    this.af.database.list(Constants.APP_STATUS + "/staff/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          this.getStaffDetails(snapshot.key, false);
        });
      });
  }

  initLocalDisplay() {
    console.log(this.prepActionService.actionsNetworkLocal, 'initLocalDisplay');


  }

  private initStaffLocalAgency() {
    this.initCountryAdminLocalAgency();
    this.af.database.list(Constants.APP_STATUS + "/staff/" + this.agencyId, {preserveSnapshot: true})
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
   * Assigning an action to someone
   */
  public assignActionDialogAdv(action: any, fromNetwork?: boolean) {
    if (action.dueDate == null || (action.department == null && !action.agencyAssign) || action.budget == null || action.task == null || action.requireDoc == null || action.level == null) {
      this.isLocalAgency ? this.router.navigateByUrl("/local-agency/preparedness/create-edit-preparedness/" + action.id) : this.router.navigateByUrl("/preparedness/create-edit-preparedness/" + action.id);
    } else {
      this.assignActionId = action.id ? action.id : action.$key;
      if (fromNetwork) {
        this.selectedNetworkId = action['idToQuery']
        this.fromNetwork = fromNetwork
      } else {
        this.selectedNetworkId = null
        this.fromNetwork = false
      }
    }
  }

  public saveAssignedUser() {
    console.log(this.assignActionAsignee)
    console.log(this.assignActionId)
    console.log(this.fromNetwork)
    console.log(this.selectedNetworkId)
    if (this.assignActionAsignee == null || this.assignActionAsignee === "0" || this.assignActionAsignee === undefined ||
      this.assignActionId == null || this.assignActionId === "0" || this.assignActionId === undefined) {
      return;
    }
    if (this.isLocalAgency) {

      let currentTime = new Date().getTime()
      let newTimeObject = {start: currentTime, finish: -1};
      let timeTrackingNode;

      this.af.database.object(Constants.APP_STATUS + "/action/" + this.agencyId + "/" + this.assignActionId)
        .first()
        .subscribe(action => {

          // Change from unassigned to in progress
          if (action.timeTracking) {
            action['timeTracking']['timeSpentInAmber'] = []

            if (action['timeTracking']['timeSpentInRed'][0].finish == -1) {
              action['timeTracking']['timeSpentInRed'][0].finish = currentTime
              action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
              timeTrackingNode = action['timeTracking']
            }
          } else {
            timeTrackingNode = null
          }

          this.af.database.object(Constants.APP_STATUS + "/action/" + this.agencyId + "/" + this.assignActionId + "/timeTracking").set(timeTrackingNode)
            .then(() => {
              this.af.database.object(Constants.APP_STATUS + "/action/" + this.agencyId + "/" + this.assignActionId + "/asignee").set(this.assignActionAsignee)
                .then(() => {

                  this.af.database.object(Constants.APP_STATUS + "/action/" + this.agencyId + "/" + this.assignActionId + "/task")
                    .first()
                    .subscribe(task => {
                      // Send notification to the assignee
                      let notification = new MessageModel();
                      notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_TITLE");
                      notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_CONTENT", {actionName: task ? task.$value : ''});
                      console.log(notification.content);

                      notification.time = new Date().getTime();
                      this.notificationService.saveUserNotificationWithoutDetails(this.assignActionAsignee, notification).first().subscribe();
                    });
                });
            })
        })
    } else {
      let currentTime = new Date().getTime()
      let newTimeObject = {start: currentTime, finish: -1};
      let timeTrackingNode;

      let id = this.fromNetwork ? this.selectedNetworkId : this.countryId
      this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId)
        .first()
        .subscribe(action => {

          // Change from unassigned to in progress
          if (action.timeTracking) {
            action['timeTracking']['timeSpentInAmber'] = []

            if (action['timeTracking']['timeSpentInRed'] && action['timeTracking']['timeSpentInRed'][0] && action['timeTracking']['timeSpentInRed'][0].finish == -1) {
              action['timeTracking']['timeSpentInRed'][0].finish = currentTime
              action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
              timeTrackingNode = action['timeTracking']
            } else {
              timeTrackingNode = action.timeTracking
            }
          } else {
            timeTrackingNode = null
          }

          let obj = {}
          obj["/action/" + id + "/" + this.assignActionId + "/timeTracking"] = timeTrackingNode
          obj["/action/" + id + "/" + this.assignActionId + "/asignee"] = this.assignActionAsignee
          if (this.fromNetwork) {
            obj["/action/" + id + "/" + this.assignActionId + "/createdByCountryId"] = this.countryId
            obj["/action/" + id + "/" + this.assignActionId + "/createdByAgencyId"] = this.agencyId
          }
          this.af.database.object(Constants.APP_STATUS).update(obj).then(() => {
            if (this.fromNetwork) {
              let index = this.unassignedNetworkActions.findIndex(action => action.$key == this.assignActionId)
              if (index != -1) {
                this.unassignedNetworkActions.splice(index, 1)
              }
            }
            this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/task")
              .first()
              .subscribe(task => {
                // Send notification to the assignee
                let notification = new MessageModel();
                notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_TITLE");
                notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_CONTENT", {actionName: task ? task.$value : ''});
                console.log(notification.content);

                notification.time = new Date().getTime();
                this.notificationService.saveUserNotificationWithoutDetails(this.assignActionAsignee, notification).first().subscribe(() => {
                });
              });
          })
        })
    }

    this.closeModal();
  }


  /**
   * Update method for the action. This will check if one already exists in the system beforehand, and only
   *   add it if it's new. If not, then it's updated.
   */
  public getAction(id: string) {
    return this.prepActionService.findAction(id);
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

    if (noteId != null && noteId !== '') {
      if (this.isLocalAgency) {
        this.af.database.object(Constants.APP_STATUS + '/note/' + this.agencyId + '/' + action.id + '/' + noteId).set(note);
      } else {
        this.af.database.object(Constants.APP_STATUS + '/note/' + this.countryId + '/' + action.id + '/' + noteId).set(note);
      }
    }
    else {
      if (this.isLocalAgency) {
        this.af.database.list(Constants.APP_STATUS + '/note/' + this.agencyId + '/' + action.id).push(note);
      } else {
        this.af.database.list(Constants.APP_STATUS + '/note/' + this.countryId + '/' + action.id).push(note);
      }
    }
  }

  public addNoteNetwork(action: any) {
    console.log(action)
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

    if (noteId != null && noteId !== '') {
      this.af.database.object(Constants.APP_STATUS + '/note/' + (action.networkCountryId ? action.networkCountryId : action.idToQuery)  + '/' + (action.id ? action.id : action.$key) + '/' + noteId).set(note);
    }
    else {
      this.af.database.list(Constants.APP_STATUS + '/note/' + (action.networkCountryId ? action.networkCountryId : action.idToQuery) + '/' + (action.id ? action.id : action.$key)).push(note);
    }
  }

  // Edit mode
  protected editNote(note: PreparednessNotes, action: PreparednessAction) {
    action.noteId = note.id;
    action.note = note.content;
  }

  // Delete note
  protected deleteNote(note: PreparednessUser, action: PreparednessAction) {
    if (this.isLocalAgency) {
      this.af.database.list(Constants.APP_STATUS + '/note/' + this.agencyId + '/' + action.id + '/' + note.id).remove();
    } else {
      this.af.database.list(Constants.APP_STATUS + '/note/' + this.countryId + '/' + action.id + '/' + note.id).remove();
    }
  }

  protected deleteNoteNetwork(note: any, action: any) {
    console.log(action)
    if (action.networkCountryId) {
      this.af.database.list(Constants.APP_STATUS + '/note/' + action.networkCountryId + '/' + action.id + '/' + note.id).remove();
    } else if (action.idToQuery) {
      this.af.database.list(Constants.APP_STATUS + '/note/' + action.idToQuery + '/' + action.$key + '/' + note.id).remove();
    }
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

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};


    if (action.note == null || action.note.trim() == "") {
      this.alertMessage = new AlertMessageModel("Completion note cannot be empty");
    } else {

      let data = {
        isComplete: true,
        isCompleteAt: new Date().getTime()
      }

      if (action.timeTracking) {

        // Change from in progress to complete
        let index = action['timeTracking']['timeSpentInAmber'] ? action['timeTracking']['timeSpentInAmber'].findIndex(x => x.finish == -1) : -1

        if (!action['timeTracking']['timeSpentInGreen']) {
          action['timeTracking']['timeSpentInGreen'] = []
        }

        if (index != -1 && action['timeTracking']['timeSpentInAmber'][index].finish == -1) {
          action['timeTracking']['timeSpentInAmber'][index].finish = currentTime
          action['timeTracking']['timeSpentInGreen'].push(newTimeObject)
          data['timeTracking'] = action['timeTracking']
        }

      }

      if (action.actualCost || action.actualCost == 0) {
        data["actualCost"] = action.actualCost
      }
      if (action.requireDoc) {
        if (action.attachments != undefined && action.attachments.length > 0) {
          action.attachments.map(file => {
            this.uploadFile(action, file);
          });
          if (this.isLocalAgency) {
            this.af.database.object(Constants.APP_STATUS + '/action/' + this.agencyId + '/' + action.id).update(data);
          } else {
            this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryId + '/' + action.id).update(data);
          }
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
        if (this.isLocalAgency) {
          this.af.database.object(Constants.APP_STATUS + '/action/' + this.agencyId + '/' + action.id).update(data);
        } else {
          this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryId + '/' + action.id).update(data);
        }
        this.addNote(action);
        this.closePopover(action);
      }
    }
  }

  protected completeActionNetwork(action: PreparednessAction) {

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};

    if (action.note == null || action.note.trim() == "") {
      this.alertMessage = new AlertMessageModel("Completion note cannot be empty");
    } else {
      let data = {
        isComplete: true,
        isCompleteAt: new Date().getTime()
      }

      if (action.timeTracking) {
        // Change from in progress to complete
        let index = action['timeTracking']['timeSpentInAmber'] ? action['timeTracking']['timeSpentInAmber'].findIndex(x => x.finish == -1) : -1

        if (!action['timeTracking']['timeSpentInGreen']) {
          action['timeTracking']['timeSpentInGreen'] = []
        }

        if (index != -1 && action['timeTracking']['timeSpentInAmber'][index].finish == -1) {
          action['timeTracking']['timeSpentInAmber'][index].finish = currentTime
          action['timeTracking']['timeSpentInGreen'].push(newTimeObject)
          data['timeTracking'] = action['timeTracking']
        }
      }

      if (action.actualCost || action.actualCost == 0) {
        data["actualCost"] = action.actualCost
      }
      if (action.requireDoc) {
        if (action.attachments != undefined && action.attachments.length > 0) {
          action.attachments.map(file => {
            this.uploadFileNetwork(action, file);
          });
          this.af.database.object(Constants.APP_STATUS + '/action/' + action.networkCountryId + '/' + action.id).update(data);
          this.addNoteNetwork(action);
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
            this.uploadFileNetwork(action, file);
          });
        }
        this.af.database.object(Constants.APP_STATUS + '/action/' + action.networkCountryId + '/' + action.id).update(data);
        this.addNoteNetwork(action);
        this.closePopover(action);
      }
    }
  }

  cancelComplete(action) {
    action.actualCost = null
    this.closePopover(action)
  }

  /**
   * Undoing an action
   */


  // (Dan) - this new function is for the undo completed MPA
  protected undoCompleteAction(action: PreparednessAction) {

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};
    let timeTrackingNode;

    if (action.timeTracking) {

      // Change from in progress to complete
      let index = action['timeTracking']['timeSpentInGreen'] ? action['timeTracking']['timeSpentInGreen'].findIndex(x => x.finish == -1) : -1

      if (!action['timeTracking']['timeSpentInAmber']) {
        action['timeTracking']['timeSpentInGreen'] = []
      }

      if (index != -1 && action['timeTracking']['timeSpentInGreen'][index].finish == -1) {
        action['timeTracking']['timeSpentInGreen'][index].finish = currentTime
        action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
        timeTrackingNode = action['timeTracking']
        console.log(timeTrackingNode)
      }

    }

    action.actualCost = null
    // Call to firebase to update values to revert back to
    if (this.isLocalAgency) {
      this.af.database.object(Constants.APP_STATUS + '/action/' + action.agencyUid + '/' + action.id).update({
        isComplete: false,
        isCompleteAt: null,
        updatedAt: new Date().getTime(),
        actualCost: null,
        timeTracking: timeTrackingNode ? timeTrackingNode : null
      });
    } else {
      this.af.database.object(Constants.APP_STATUS + '/action/' + action.countryUid + '/' + action.id).update({
        isComplete: false,
        isCompleteAt: null,
        updatedAt: new Date().getTime(),
        actualCost: null,
        timeTracking: timeTrackingNode ? timeTrackingNode : null
      });
    }

  }

  //Close documents popover
  protected closePopover(action: PreparednessAction) {
    let toggleDialog = jQuery("#popover_content_" + action.id);
    toggleDialog.toggle();
  }

  // Uploading a file to Firebase
  protected uploadFile(action: PreparednessAction, file) {
    let document = {
      fileName: file.name,
      filePath: "", //this needs to be updated once the file is uploaded
      module: DocumentType.MPA,
      size: file.size * 0.001,
      sizeType: SizeType.KB,
      title: file.name,
      time: firebase.database.ServerValue.TIMESTAMP,
      uploadedBy: this.uid
    };

    if (this.isLocalAgency) {
      this.af.database.list(Constants.APP_STATUS + '/document/' + this.agencyId).push(document)
        .then(_ => {
          let docKey = _.key;
          let doc = {};
          doc[docKey] = true;

          this.af.database.object(Constants.APP_STATUS + '/action/' + this.agencyId + '/' + action.id + '/documents').update(doc)
            .then(_ => {
              new Promise((res, rej) => {
                var storageRef = this.firebase.storage().ref().child('documents/' + this.agencyId + '/' + docKey + '/' + file.name);
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

                  this.af.database.object(Constants.APP_STATUS + '/document/' + this.agencyId + '/' + docKey).set(document);
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
    } else {
      this.af.database.list(Constants.APP_STATUS + '/document/' + this.countryId).push(document)
        .then(_ => {
          let docKey = _.key;
          let doc = {};
          doc[docKey] = true;

          this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryId + '/' + action.id + '/documents').update(doc)
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

                  this.af.database.object(Constants.APP_STATUS + '/document/' + this.countryId + '/' + docKey).set(document);
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
  }

  protected uploadFileNetwork(action: PreparednessAction, file) {
    if (!action.networkCountryId) {
      console.log("no network country id")
      return
    }
    let document = {
      fileName: file.name,
      filePath: "", //this needs to be updated once the file is uploaded
      module: DocumentType.MPA,
      size: file.size * 0.001,
      sizeType: SizeType.KB,
      title: file.name,
      time: firebase.database.ServerValue.TIMESTAMP,
      uploadedBy: this.uid
    };

    this.af.database.list(Constants.APP_STATUS + '/document/' + action.networkCountryId).push(document)
      .then(_ => {
        let docKey = _.key;
        let doc = {};
        doc[docKey] = true;

        this.af.database.object(Constants.APP_STATUS + '/action/' + action.networkCountryId + '/' + action.id + '/documents').update(doc)
          .then(_ => {
            new Promise((res, rej) => {
              let storageRef = this.firebase.storage().ref().child('documents/' + action.networkCountryId + '/' + docKey + '/' + file.name);
              let uploadTask = storageRef.put(file);
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

                this.af.database.object(Constants.APP_STATUS + '/document/' + action.networkCountryId + '/' + docKey).set(document);
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
    this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryId + '/' + action.id + '/documents/' + docKey).set(null);
    this.af.database.object(Constants.APP_STATUS + '/document/' + this.countryId + '/' + docKey).set(null);
  }

  protected removeAttachment(action, file) {
    action.attachments = action.attachments.filter(attachment => {
      if (attachment.name == file.name && attachment.actionId == file.actionId)
        return false;

      return true;
    });
  }

  // Delete document from firebase
  protected deleteDocument(action: PreparednessAction, docId: string) {
    for (let x of action.documents) {
      if (x.documentId == docId) {
        // Deleting this one!
        this.af.database.object(Constants.APP_STATUS + '/action/' + this.countryId + '/' + action.id + '/documents/' + x.documentId).set(null);
        this.af.database.object(Constants.APP_STATUS + '/document/' + this.countryId + '/' + x.documentId).set(null);
        this.firebase.storage().ref().child('documents/' + this.countryId + "/" + x.documentId + "/" + x.fileName).delete();
      }
    }

    //remove deleted doc from list
    let actionIndex = this.prepActionService.actions.map(action => {
      return action.id
    }).indexOf(action.id);
    if (actionIndex != -1) {
      this.prepActionService.actions[actionIndex].documents = this.prepActionService.actions[actionIndex].documents.filter(doc => {
        return doc.documentId != docId
      })
      this.closeDocumentsModal("documents_popover_" + action.id)
    }
    // let actionIndex = this.prepActionService.actions.map(a => {return a.id}).indexOf(action.id);
    // this.prepActionService.actions[actionIndex].documents = this.prepActionService.actions[actionIndex].documents.filter(doc => {return doc.documentId != docId})
    // this.closeDocumentsModal('documents_popover_' + action.id)

    // if we make it here we can't find the document requesting to be deleted
  }

  protected deleteDocumentNetwork(action: PreparednessAction, docId: string) {
    if (!action.networkCountryId) {
      console.log("no network country ids")
      return
    }
    for (let x of action.documents) {
      if (x.documentId == docId) {
        // Deleting this one!
        this.af.database.object(Constants.APP_STATUS + '/action/' + action.networkCountryId + '/' + action.id + '/documents/' + x.documentId).set(null);
        this.af.database.object(Constants.APP_STATUS + '/document/' + action.networkCountryId + '/' + x.documentId).set(null);
        this.firebase.storage().ref().child('documents/' + action.networkCountryId + "/" + x.documentId + "/" + x.fileName).delete();
      }
    }
    // if we make it here we can't find the document requesting to be deleted
    let actionIndex = this.prepActionService.actions.map(action => {
      return action.id
    }).indexOf(action.id);
    if (actionIndex != -1) {
      this.prepActionService.actions[actionIndex].documents = this.prepActionService.actions[actionIndex].documents.filter(doc => {
        return doc.documentId != docId
      })
      this.closeDocumentsModal("documents_popover_" + action.id)
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
      this.closeExportModal()
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

  protected copyAction(action) {
    this.storage.set('selectedAction', action);
    this.isLocalAgency ? this.router.navigate(["/local-agency/preparedness/create-edit-preparedness"]) : this.router.navigate(["/preparedness/create-edit-preparedness"]);
  }


  /**
   * Reactivating an Action from Archived -> Non-Archived
   */
  public reactivate(action: PreparednessAction) {
    let update = {
      isArchived: false
    };
    if (this.isLocalAgency) {
      this.af.database.object(Constants.APP_STATUS + "/action/" + this.agencyId + "/" + action.id).update(update);
    } else {
      this.af.database.object(Constants.APP_STATUS + "/action/" + this.countryId + "/" + action.id).update(update);
    }
  }

  public reactivateNetwork(action: PreparednessAction) {
    if (!action.networkCountryId) {
      console.log("no network country ids")
      return
    }
    let update = {
      isArchived: false
    };
    this.af.database.object(Constants.APP_STATUS + "/action/" + action.networkCountryId + "/" + action.id).update(update);
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

  editNetworkAction(action) {
    this.switchToNetwork(action)
    let networkViewValues = this.storage.get(Constants.NETWORK_VIEW_VALUES)
    console.log(action)
    if (action.networkCountryId === action.networkId) {
      networkViewValues["isLocalNetworkAdmin"] = true
    }
    this.router.navigate(['/network-country/network-country-create-edit-action/' + action.id, networkViewValues])
  }

  private switchToNetwork(action: PreparednessAction) {
    this.storage.set(Constants.NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID, action.networkCountryId)
    this.storage.set(Constants.NETWORK_VIEW_SELECTED_ID, action.networkId)
    let viewModel = new NetworkViewModel(this.systemAdminId, this.agencyId, this.countryId, "", this.userType, this.uid, action.networkId, action.networkCountryId, true)
    this.storage.set(Constants.NETWORK_VIEW_VALUES, viewModel)
  }

  private fetchUnassignedNetworkActions(networkId: string) {
    this.networkService.getUnassignedNetworkActionsForAgency(this.agencyId, networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkUnassignedActions => {
        for (let i in networkUnassignedActions) {
          let action = networkUnassignedActions[i]
          let path = "/note/"+networkId+"/"+action.$key
          this.noteService.getNotes(path)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(notes => {
              networkUnassignedActions[i]['notes'] = notes
            })
        }
        this.unassignedNetworkActions = this.unassignedNetworkActions.concat(networkUnassignedActions).filter((action, position, self) => self.indexOf(action) == position)
        console.log(this.unassignedNetworkActions)
      })
  }
}
