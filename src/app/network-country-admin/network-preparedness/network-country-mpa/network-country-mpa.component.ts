
import {interval as observableInterval, Subject, Observable} from 'rxjs';

import {first, takeUntil, takeWhile} from 'rxjs/operators';
import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Constants} from "../../../utils/Constants";
import {
  ActionLevel,
  ActionStatusMin,
  ActionType,
  AlertMessageType,
  ApprovalStatus,
  Currency,
  DocumentType,
  FileExtensionsEnding,
  Privacy,
  SizeType,
  UserType,
  NetworkUserAccountType
} from "../../../utils/Enums";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {
  CountryPermissionsMatrix, NetworkModulesEnabledModel,
  PageControlService
} from "../../../services/pagecontrol.service";
import {AngularFire, FirebaseApp} from "angularfire2";
import {NetworkService} from "../../../services/network.service";
import {NotificationService} from "../../../services/notification.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ModelDepartment} from "../../../model/department.model";
import {
  PrepActionService,
  PreparednessAction,
  PreparednessNotes,
  PreparednessUser
} from "../../../services/prepactions.service";
import {ModelAgencyPrivacy} from "../../../model/agency-privacy.model";
import {MessageModel} from "../../../model/message.model";
import {WindowRefService} from "../../../services/window-ref.service";
import {LocalStorageService} from "angular-2-local-storage/dist";
import {CommonUtils} from "../../../utils/CommonUtils";
import {NetworkCountryModel} from "../../network-country.model";
import * as firebase from "firebase";
import {ModelAgency} from "../../../model/agency.model";
import {ModelNetwork} from "../../../model/network.model";
import {MandatedListModel} from "../../../agency-admin/agency-mpa/agency-mpa.component";
import {ModelStaff} from "../../../model/staff.model";
import {el} from "@angular/platform-browser/testing/src/browser_util";

declare var jQuery: any;

@Component({
  selector: 'app-network-country-mpa',
  templateUrl: './network-country-mpa.component.html',
  styleUrls: ['./network-country-mpa.component.css']
})
export class NetworkCountryMpaComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;
  private ApprovalStatus = ApprovalStatus;


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;
  private networkModuleMap = new Map<string, NetworkModulesEnabledModel>()
  private networkModelMap = new Map<string, ModelNetwork>();
  private networkIdList: string [] = [];
  private agencyCountryMap: Map<string, string>;
  private showLoader: boolean;
  private uid: string;

  //local network
  @Input() isLocalNetworkAdmin: boolean;
  //network view
  private networkViewValues: {};
  private agencyNamesMap = new Map<string, ModelAgency>()


  //copy over from response plan
  // IDs
  private userType: UserType;
  private UserType = UserType;
  public NetworkUserAccountType = NetworkUserAccountType;
  private countryId: string;
  private agencyId: string;
  private systemAdminId: string;
  public myFirstName: string;
  public myLastName: string;
  private updateActionId: string;

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
  private ASSIGNED_TOO = [];
  private CURRENT_USERS: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private STAFF: Map<string, ModelStaff> = new Map<string, ModelStaff>();
  private currentlyAssignedToo: PreparednessUser;
  private actionLevelEnum = ActionLevel;

  private allUnassigned: boolean = true;
  private allArchived: boolean = false;
  private stopCondition: boolean;
  // --- Declared because we're missing out "inactive" in this page
  private ActionStatus = ActionStatusMin;
  private ActionType = ActionType;

  // Page admin
  private isViewing: boolean;
  private isSameAgency: boolean = false;
  protected countrySelected = false;
  protected agencySelected = false;
  private firebase: any;
  private documents: any[] = [];
  private docsSize: number;
  private documentActionId: string = "";
  private fileSize: number; // Always in Bytes
  private fileExtensions: FileExtensionsEnding[] = FileExtensionsEnding.list();
  public userTypes = UserType;
  private Privacy = Privacy;

  // Used to run the initAlerts method after all actions have been returned
  private fbLocationCalls = 3;
  private now: number = new Date().getTime();

  //Dan Variable
  private dialogOpen: boolean;
  private actions: MandatedListModel[] = [];


  // Assigning action
  private assignActionId: string = "0";
  private assignActionCategoryUid: string = "0";
  private assignActionAsignee: string = "0";
  private assignActionAgency: string = "0";
  private assignActionTask: string = "";

  // Module permissions settings

  private modulesAreEnabled: NetworkModulesEnabledModel = new NetworkModulesEnabledModel();
  protected prepActionService: PrepActionService = new PrepActionService();
  private permissionsAreEnabled: CountryPermissionsMatrix = new CountryPermissionsMatrix();

  private privacy: ModelAgencyPrivacy;
  private userAgencyId: string;
  private isNetworkAccess: boolean;
  private isViewingFromExternal: boolean;
  private networkUserType: any;
  private agencyModels: ModelAgency[] = [];

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService,
              @Inject(FirebaseApp) firebaseApp: any,
              private af: AngularFire,
              private networkService: NetworkService,
              private storage: LocalStorageService,
              private notificationService: NotificationService,
              private userService: UserService,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private windowService: WindowRefService,
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
      if (params['isCHS']) {
        this.filterType = 0;
      }
      if (params['updateActionID']) {
        this.updateActionId = params['updateActionID'];

        console.log("UPD ActionID: " + this.updateActionId)
        observableInterval(2000).pipe(
          takeWhile(() => !this.stopCondition))
          .subscribe(i => {
            this.triggerScrollTo()
            this.stopCondition = true
          })
      }
      if (params['isViewingFromExternal']) {
        this.isViewingFromExternal = params['isViewingFromExternal'];
      }
      this.isViewing ? (this.isLocalNetworkAdmin ? this.initLocalNetworkViewAccess() : this.initNetworkViewAccess()) : (this.isLocalNetworkAdmin ? this.initLocalNetworkAccess() : this.initNetworkAccess());

    });

  }

  private initNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;
      // this.assignActionAsignee = this.uid;
      this.filterAssigned = "0";
      this.currentlyAssignedToo = new PreparednessUser(this.uid, true);
      this.isNetworkAccess = true;

      console.log(user)

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];

          this.networkUserType = selection["userType"]
          if (selection["userType"] == NetworkUserAccountType.NetworkCountryAdmin) {
            this.getNetworkCountryAdminAssignees()
          }

          this.networkCountryId = selection["networkCountryId"];
          this.getStaffDetails(this.uid, true);

          this.networkService.getSystemIdForNetworkCountryAdmin(this.uid).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(systemId => {
              this.systemAdminId = systemId;
              this.showLoader = false;

              this.prepActionService.initActionsWithInfoNetwork(this.af, this.ngUnsubscribe, this.uid, true,
                this.networkCountryId, this.networkId, this.systemAdminId);
              this.initDocumentTypes();
            });

          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.modulesAreEnabled = matrix);

          this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(agencyCountryMap => {
              this.initAgencies(agencyCountryMap)
            });
          this.getMandatedPrepActions();
          // Currency
          // this.calculateCurrency();
        });
    });

  }

  private initLocalNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;
      // this.assignActionAsignee = this.uid;
      this.filterAssigned = "0";
      this.currentlyAssignedToo = new PreparednessUser(this.uid, true);

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkUserType = selection["userType"]
          if (selection["userType"] == NetworkUserAccountType.NetworkAdmin) {
            this.getLocalNetworkAdminAssignees()
          }
          this.networkId = selection["id"];
          this.getStaffDetails(this.uid, true);

          this.networkService.getSystemIdForNetworkAdmin(this.uid).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(systemId => {
              this.systemAdminId = systemId;
              this.showLoader = false;

              this.prepActionService.initActionsWithInfoNetworkLocal(this.af, this.ngUnsubscribe, this.uid, true, this.networkId, this.systemAdminId);
              this.initDocumentTypes();
            });

          this.networkService.getNetworkModuleMatrix(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => this.modulesAreEnabled = matrix);

          this.networkService.mapAgencyCountryForLocalNetworkCountry(this.networkId).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(agencyCountryMap => {
              this.initAgencies(agencyCountryMap)
            });

          // Currency
          // this.calculateCurrency();
        });

      this.networkService.mapNetworkWithCountryForCountry(this.agencyId, this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(networkMap => {
          this.networkIdList = []
          networkMap.forEach((networkCountryId, networkId) => {
            this.networkIdList.push(networkId)
            this.networkService.getNetworkModuleMatrix(networkId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(matrix => {
                this.networkModuleMap.set(networkId, matrix)
              })

            this.networkService.getNetworkDetail(networkId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(network => {
                this.networkModelMap.set(networkId, network)
              })
          })
        })
    });
  }

  private initNetworkViewAccess() {
    console.log("initNetworkViewAccess")
    this.assignActionAsignee = this.uid;
    this.filterAssigned = "0";
    this.currentlyAssignedToo = new PreparednessUser(this.uid, true);

    this.getStaffDetails(this.uid, true);
    // this.getCountryAdmin(this.countryId, this.agencyId)

    this.prepActionService.initActionsWithInfoNetwork(this.af, this.ngUnsubscribe, this.uid, true,
      this.networkCountryId, this.networkId, this.systemAdminId);
    this.initDocumentTypes();

    this.networkService.getNetworkModuleMatrix(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(matrix => this.modulesAreEnabled = matrix);

    this.networkViewValues = this.storage.get(Constants.NETWORK_VIEW_VALUES);

    console.log(this.countryId)
    this.countryId ? this.initForCountry() : this.initForLocalAgency();
    this.initStaff(this.uid, this.agencyId, this.countryId);
    PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, this.userType, (isEnabled) => {
      this.permissionsAreEnabled = isEnabled;
    });

    // Currency
    this.calculateCurrency();
  }

  private initForCountry() {
    this.networkService.mapNetworkWithCountryForCountry(this.agencyId, this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkMap => {
        this.networkIdList = []
        networkMap.forEach((networkCountryId, networkId) => {
          this.networkIdList.push(networkId)
          this.networkService.getNetworkModuleMatrix(networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => {
              this.networkModuleMap.set(networkId, matrix)
            })

          this.networkService.getNetworkDetail(networkId).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(network => {
              this.networkModelMap.set(networkId, network)
            })
        })

        if (networkMap) {
          // this.initNetworkAdmin(networkMap)
          this.initAgenciesDetails(networkMap)
        }
      })
  }

  private initForLocalAgency() {
    this.networkService.mapNetworkCountryForLocalAgency(this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkMap => {
        this.networkIdList = []
        networkMap.forEach((networkCountryId, networkId) => {
          this.networkIdList.push(networkId)
          this.networkService.getNetworkModuleMatrix(networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(matrix => {
              this.networkModuleMap.set(networkId, matrix)
            })

          this.networkService.getNetworkDetail(networkId).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(network => {
              this.networkModelMap.set(networkId, network)
            })
        })

        if (networkMap) {
          // this.initNetworkAdmin(networkMap)
          this.initAgenciesDetails(networkMap)
        }
      })
  }

  private initLocalNetworkViewAccess() {
    console.log("initLocalNetworkViewAccess")
    this.assignActionAsignee = this.uid;
    this.filterAssigned = "0";
    this.currentlyAssignedToo = new PreparednessUser(this.uid, true);

    this.getStaffDetails(this.uid, true);

    this.prepActionService.initActionsWithInfoNetworkLocal(this.af, this.ngUnsubscribe, this.uid, true,
      this.networkId, this.systemAdminId);
    this.initDocumentTypes();

    this.networkService.getNetworkModuleMatrix(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(matrix => this.modulesAreEnabled = matrix);

    this.networkViewValues = this.storage.get(Constants.NETWORK_VIEW_VALUES);
    if (this.isLocalNetworkAdmin) {
      this.networkViewValues["isLocalNetworkAdmin"] = this.isLocalNetworkAdmin
    }

    const service = this.countryId ? this.networkService.getLocalNetworksWithCountryForCountry(this.agencyId, this.countryId) : this.networkService.getLocalNetworksWithCountryForLocalAgency(this.agencyId)
    service
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkIds => {
        if (networkIds && networkIds.length > 0) {
          // this.initLocalNetworkAdmin(networkIds)
          this.initAgenciesDetailsForLocal(networkIds)
        }
      })
    this.initStaff(this.uid, this.agencyId, this.countryId);
    PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, this.userType, (isEnabled) => {
      this.permissionsAreEnabled = isEnabled;
    });

    // Currency
    this.calculateCurrency();
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

  private getLocalNetworkAdminAssignees() {
    this.networkService.getLocalNetwork(this.networkId).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(network => {
        console.log(network)
        if (network.agencies) {
          Object.keys(network.agencies).forEach(agencyKey => {
            console.log(agencyKey)
            if (network.agencies[agencyKey].isApproved) {
              this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyKey + '/' + network.agencies[agencyKey].countryCode)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(data => {

                  if (data.adminId) {
                    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + data.adminId).subscribe((user) => {
                      var userToPush = {userID: data.adminId, name: user.firstName + " " + user.lastName};
                      console.log(userToPush)
                      this.ASSIGNED_TOO.push(userToPush);
                    });
                  }
                });
              //Obtaining other staff data
              this.af.database.object(Constants.APP_STATUS + "/staff/" + network.agencies[agencyKey].countryCode).subscribe((data: {}) => {
                for (let userID in data) {
                  if (!userID.startsWith('$')) {
                    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID).subscribe((user) => {
                      var userToPush = {userID: userID, name: user.firstName + " " + user.lastName};
                      this.ASSIGNED_TOO.push(userToPush);
                    });
                  }
                }
              })
            }
          })
        }
      })
  }


  private getNetworkCountryAdminAssignees() {
    this.networkService.getNetworkCountry(this.networkId, this.networkCountryId).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(network => {
        if (network.agencyCountries) {
          Object.keys(network.agencyCountries).forEach(agencyKey => {
            this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + agencyKey)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(countryOffices => {
                countryOffices.forEach(countryOffice => {
                  if (network.agencyCountries[agencyKey][countryOffice.$key]) {
                    // Obtaining the country admin data
                    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyKey + "/" + countryOffice.$key).subscribe((data: any) => {
                      if (data.adminId) {
                        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + data.adminId).subscribe((user) => {
                          var userToPush = {userID: data.adminId, name: user.firstName + " " + user.lastName};
                          this.ASSIGNED_TOO.push(userToPush);
                        });
                      }
                    });
                    //Obtaining other staff data
                    this.af.database.object(Constants.APP_STATUS + "/staff/" + countryOffice.$key).subscribe((data: {}) => {
                      for (let userID in data) {
                        if (!userID.startsWith('$')) {
                          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + userID).subscribe((user) => {
                            var userToPush = {userID: userID, name: user.firstName + " " + user.lastName};
                            this.ASSIGNED_TOO.push(userToPush);
                          });
                        }
                      }
                    });
                  }
                })
              })
          })
        }
      })
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
          console.log(this.CURRENT_USERS)
          this.updateUser(prepUser);

          if (isMe) {
            this.myFirstName = snap.firstName;
            this.myLastName = snap.lastName;
          }
        });
    }
  }

  getMandatedPrepActions() {
    console.log(Constants.APP_STATUS + "/actionMandated/" + this.networkId + "/");
    this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + this.networkId + "/", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.actions = [];
        snap.forEach((snapshot) => {
          let x: MandatedListModel = new MandatedListModel();
          x.id = snapshot.key;
          x.task = snapshot.val().task;
          x.level = snapshot.val().level;
          x.department = snapshot.val().department;
          this.actions.push(x);
          console.log(x);
        });
      });
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
          let admin = new ModelStaff();
          admin.position = "Admin";
          this.STAFF.set(snap.val().adminId, admin)
          this.getStaffDetails(snap.val().adminId, false);
        }
      });
  }

  private initStaff(uid, agencyId, countryId) {
    this.initCountryAdmin(agencyId, countryId);
    this.af.database.list(Constants.APP_STATUS + "/staff/" + (countryId ? countryId : agencyId), {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          this.STAFF.set(snapshot.key, snapshot.val());
          // snapshot.forEach((data) => {
          //   this.STAFF.set(data.key, data.val());
          //   console.log(this.STAFF.get('position'))
          //   //console.log(data.+" "+data.val());
          // });
          this.getStaffDetails(snapshot.key, false);
        });
      });
  }

  private initNetworkAdmin(map: Map<string, string>) {
    CommonUtils.convertMapToKeysInArray(map).forEach(networkId => {
      this.networkService.getNetworkCountry(networkId, map.get(networkId)).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe((model: NetworkCountryModel) => {
          this.getStaffDetails(model.adminId, false)
        })
    })
  }

  private initLocalNetworkAdmin(networkIds) {
    networkIds.forEach(networkId => {
      this.networkService.getNetworkDetail(networkId).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe((model: ModelNetwork) => {
          this.getStaffDetails(model.networkAdminId, false)
        })
    })
  }

  /**
   * Assigning an action to someone
   */
  public assignActionDialogAdv(action: PreparednessAction) {
    if (action.dueDate == null || action.budget == null || action.task == null || action.requireDoc == null || action.level == null) {
      this.isViewing ? this.router.navigate(["/network-country/network-country-create-edit-action/" + action.id, this.networkViewValues]) : this.router.navigateByUrl("/network-country/network-country-create-edit-action/" + action.id);
    } else {
      this.assignActionId = action.id;
    }
  }

  // TODO: Check what's happening in this function below
  public saveAssignedUser() {
    // if (this.assignActionAsignee == null || this.assignActionAsignee === "0" || this.assignActionAsignee === undefined ||
    //   this.assignActionId == null || this.assignActionId === "0" || this.assignActionId === undefined) {
    //   return;
    // }
    if (this.assignActionId == null || this.assignActionId === "0" || this.assignActionId === undefined) {
      return;
    }
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};
    let timeTrackingNode;

    this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(action => {

        console.log(action)

        // Change from unassigned to in progress
        if (action.timeTracking) {

          if (this.isViewing) {
            action['timeTracking']['timeSpentInAmber'] = []

            if (action['timeTracking']['timeSpentInRed'] && action['timeTracking']['timeSpentInRed'][0].finish == -1) {
              action['timeTracking']['timeSpentInRed'][0].finish = currentTime
              action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
              timeTrackingNode = action['timeTracking']
            }
          } else {
            timeTrackingNode = action.timeTracking
          }


        } else {
          timeTrackingNode = null
        }

        let obj = {}
        obj["/action/" + id + "/" + this.assignActionId + "/timeTracking"] = timeTrackingNode
        if (this.assignActionAsignee != "0") {
          obj["/action/" + id + "/" + this.assignActionId + "/asignee"] = this.assignActionAsignee
        }
        if (this.assignActionAgency != "0") {
          obj["/action/" + id + "/" + this.assignActionId + "/agencyAssign"] = this.assignActionAgency
        }

        this.af.database.object(Constants.APP_STATUS).update(obj).then(() =>{
          if (this.isViewing) {
            this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/task").first()
              .subscribe(task => {
                // Send notification to the assignee
                let notification = new MessageModel();
                notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_TITLE");
                notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_CONTENT", {actionName: task ? task.$value : ''});
                notification.time = new Date().getTime();
                this.notificationService.saveUserNotificationWithoutDetails(this.assignActionAsignee, notification).pipe(first()).subscribe(() => {
                });
              });
          }
        })

        // this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/timeTracking").set(timeTrackingNode)
        //   .then(() => {
        //     this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/asignee").set(this.assignActionAsignee ? this.assignActionAsignee : null)
        //       .then(() => {
        //
        //         this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/agencyAssign").set(this.assignActionAgency ? this.assignActionAgency : null)
        //           .then(() =>{
        //             this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/task").first()
        //               .subscribe(task => {
        //                 // Send notification to the assignee
        //                 let notification = new MessageModel();
        //                 notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_TITLE");
        //                 notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.ASSIGNED_MPA_ACTION_CONTENT", {actionName: task ? task.$value : ''});
        //                 notification.time = new Date().getTime();
        //                 this.notificationService.saveUserNotificationWithoutDetails(this.assignActionAsignee, notification).first().subscribe(() => {
        //                 });
        //               });
        //           })
        //
        //
        //       });
        //   });
        if (this.isViewing) {
          this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/createdByAgencyId").set(this.agencyId)
          this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + this.assignActionId + "/createdByCountryId").set(this.countryId)
        }
        this.closeModal();

      })

  }

  /**
   * Update method for the action. This will check if one already exists in the system beforehand, and only
   *   add it if it's new. If not, then it's updated.
   */
  public getAction(id: string) {
    return this.prepActionService.findAction(id);
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
    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    if (action.note == null || action.note.trim() == "") {
      this.alertMessage = new AlertMessageModel("Completion note cannot be empty");
    } else {
      let data = {
        isComplete: true,
        isCompleteAt: new Date().getTime()
      }

      this.af.database.object(Constants.APP_STATUS + "/action/" + id + "/" + action.id)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(action => {

      if (action.timeTracking) {
        console.log(action)
        // Change from in progress to complete
        let index = action['timeTracking']['timeSpentInAmber'].findIndex(x => x.finish == -1);

        if (!action['timeTracking']['timeSpentInGreen']) {
          action['timeTracking']['timeSpentInGreen'] = []
        }

        console.log(index)
        console.log(action['timeTracking'])
        console.log(action['timeTracking']['timeSpentInAmber'][index])

        if (index != -1 && action['timeTracking']['timeSpentInAmber'][index].finish == -1) {
          action['timeTracking']['timeSpentInAmber'][index].finish = currentTime
          action['timeTracking']['timeSpentInGreen'].push(newTimeObject)
          data['timeTracking'] = action['timeTracking']
        }
      }
        })

      if (action.actualCost || action.actualCost == 0) {
        data["actualCost"] = action.actualCost
      }
      if (action.requireDoc) {
        if (action.attachments != undefined && action.attachments.length > 0) {
          action.attachments.map(file => {
            this.uploadFile(action, file);
          });
          this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id).update(data);
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
        this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id).update(data);
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

  /**
   * Undoing an action
   */

  // (Dan) - this new function is for the undo completed MPA
  protected undoCompleteAction(action: PreparednessAction) {


    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};
    let timeTrackingNode;

    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;


    if (action.timeTracking) {
      // Change from in progress to complete
      let index = action['timeTracking']['timeSpentInGreen'].findIndex(x => x.finish == -1);

      if (!action['timeTracking']['timeSpentInAmber']) {
        action['timeTracking']['timeSpentInGreen'] = []
      }

      if (action['timeTracking']['timeSpentInGreen'][index].finish == -1) {
        action['timeTracking']['timeSpentInGreen'][index].finish = currentTime
        action['timeTracking']['timeSpentInAmber'].push(newTimeObject)
        timeTrackingNode = action['timeTracking']
      }
    } else {
      timeTrackingNode = null
    }


    action.actualCost = null

    // Call to firebase to update values to revert back to *In Progress*
    this.af.database.object(Constants.APP_STATUS + '/action/' + action.countryUid + '/' + action.id).update({
      isComplete: false,
      isCompleteAt: null,
      // Set updatedAt to time it was undone
      updatedAt: new Date().getTime(),
      actualCost: null,
      timeTracking: timeTrackingNode
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
  //TODO NEED TO FIGURE OUT WHERE TO PUSH FOR LOCAL NETWORK ADMIN
  protected uploadFile(action: PreparednessAction, file) {
    let document = {
      fileName: file.name,
      filePath: "", //this needs to be updated once the file is uploaded
      module: 0,
      size: file.size * 0.001,
      sizeType: SizeType.KB,
      title: file.name,
      time: firebase.database.ServerValue.TIMESTAMP,
      uploadedBy: this.uid
    };

    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.af.database.list(Constants.APP_STATUS + '/document/' + id).push(document)
      .then(_ => {
        let docKey = _.key;
        let doc = {};
        doc[docKey] = true;

        this.af.database.object(Constants.APP_STATUS + '/action/' + id + '/' + action.id + '/documents').update(doc)
          .then(() => {
            new Promise((res, rej) => {
              var storageRef = this.firebase.storage().ref().child('documents/' + id + '/' + docKey + '/' + file.name);
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
      if (attachment.name == file.name && attachment.actionId == file.actionId)
        return false;

      return true;
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
    this.router.navigate(["/preparedness/create-edit-preparedness"]);
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

  private initAgenciesDetails(networkMap: Map<string, string>) {
    CommonUtils.convertMapToKeysInArray(networkMap).forEach(networkId => {
      this.networkService.mapAgencyCountryForNetworkCountry(networkId, networkMap.get(networkId)).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(agencyCountryMap => {
          // agencyCountryMap.forEach((countryId, agencyId) => {
          //   this.initStaff(this.uid, agencyId, countryId);
          // })
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

  private initAgenciesDetailsForLocal(networkIds) {
    networkIds.forEach(networkId => {
      this.networkService.mapAgencyCountryForLocalNetworkCountry(networkId).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(agencyCountryMap => {
          CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
            this.userService.getAgencyModel(agencyId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe((agency: ModelAgency) => {
                this.agencyNamesMap.set(agencyId, agency)
                console.log(this.agencyNamesMap)
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
          this.agencyModels.push(agency)
        })
    })

    CommonUtils.convertMapToKeysInArray(agencyCountryMap).forEach(agencyId => {
      this.initStaff(this.uid, agencyId, agencyCountryMap.get(agencyId))
    })
  }

  // private getCountryAdmin(countryId: string, agencyId: string) {
  //   console.log("fetch country admin")
  //   this.userService.getCountryDetail(countryId, agencyId)
  //     .flatMap(country => {
  //       console.log(country)
  //       return this.userService.getUser(country.adminId)
  //     })
  //     .takeUntil(this.ngUnsubscribe)
  //     .subscribe(admin => {
  //       console.log(admin)
  //       const adminModel = new PreparednessUser(admin.id,false)
  //       adminModel.id = admin.id
  //       adminModel.firstName = admin.firstName
  //       adminModel.lastName = admin.lastName
  //       console.log(adminModel)
  //       this.CURRENT_USERS.set(admin.id, adminModel)
  //       console.log(this.CURRENT_USERS)
  //       const staffAdmin = new ModelStaff()
  //       staffAdmin.position = "Country Admin"
  //       staffAdmin.id = admin.id
  //       this.STAFF.set(staffAdmin.id, staffAdmin)
  //     })
  // }
}
