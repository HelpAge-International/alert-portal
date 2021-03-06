import {PermissionsAgency, UserType} from "../utils/Enums";
import {AngularFire, AngularFireAuth, FirebaseAuthState} from "angularfire2";
import {UserService} from "./user.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";
import {Constants} from "../utils/Constants";
import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/platform-browser";
import {Pair} from "../utils/bundles";
import {SettingsService} from "./settings.service";
import {PermissionSettingsModel} from "../model/permission-settings.model";
import {Observable} from "rxjs/Observable";

/**
 * Created by jordan on 16/06/2017.
 */

export class PageUserType {
  public userType: UserType;
  public urls: string[];
  public redirectTo: string;

  public static create(userType: UserType, redirectTo: string, urls: string[]): PageUserType {
    let type = new PageUserType();
    type.userType = userType;
    type.urls = urls;
    type.redirectTo = redirectTo;
    return type;
  }
}

export class AgencyModulesEnabled {
  public minimumPreparedness: boolean;
  public advancedPreparedness: boolean;
  public chsPreparedness: boolean;
  public riskMonitoring: boolean;
  public responsePlan: boolean;
  public countryOffice: boolean;

  constructor() {
    this.all(false);
  }

  all(type: boolean) {
    this.minimumPreparedness = type;
    this.advancedPreparedness = type;
    this.chsPreparedness = type;
    this.riskMonitoring = type;
    this.responsePlan = type;
    this.countryOffice = type;
  }
}

export class NetworkModulesEnabledModel {
  public minimumPreparedness: boolean;
  public advancedPreparedness: boolean;
  public chsPreparedness: boolean;
  public riskMonitoring: boolean;
  public conflictIndicator: boolean;
  public responsePlan: boolean;
  public networkOffice: boolean;

  constructor() {
    this.all(false);
  }

  all(type: boolean) {
    this.minimumPreparedness = type;
    this.advancedPreparedness = type;
    this.chsPreparedness = type;
    this.riskMonitoring = type;
    this.conflictIndicator = type;
    this.responsePlan = type;
    this.networkOffice = type;
  }
}

export class AgencyPermissionObject {
  public permission: PermissionsAgency;
  public urls: string[];
  public isAuthorized: boolean;

  constructor(perm: PermissionsAgency, urls: string[]) {
    this.permission = perm;
    this.urls = urls;
  }
}

export class CountryPermissionsMatrix {
  public chsActions: {
    Assign: boolean
  };
  public mandatedMPA: {
    Assign: boolean;
  };
  public customMPA: {
    Assign: boolean,
    Edit: boolean,
    New: boolean,
    Delete: boolean
  };
  public mandatedAPA: {
    Assign: boolean
  };
  public customAPA: {
    Assign: boolean,
    Edit: boolean,
    New: boolean,
    Delete: boolean
  };
  public notes: {
    New: boolean,
    Edit: boolean,
    Delete: boolean
  };
  public countryContacts: {
    New: boolean,
    Edit: boolean,
    Delete: boolean
  };
  public other: {
    DownloadDocuments: boolean,
    UploadDocuments: boolean
  };

  constructor() {
    this.all(false);
  }

  public static allTrue(): CountryPermissionsMatrix {
    let x: CountryPermissionsMatrix = new CountryPermissionsMatrix();
    x.all(true);
    return x;
  }

  all(type: boolean) {
    this.chsActions = {Assign: type};
    this.mandatedMPA = {Assign: type};
    this.customMPA = {Assign: type, Edit: type, New: type, Delete: type};
    this.mandatedAPA = {Assign: type};
    this.customAPA = {Assign: type, Edit: type, New: type, Delete: type};
    this.notes = {Delete: type, Edit: type, New: type};
    this.countryContacts = {New: type, Edit: type, Delete: type};
    this.other = {DownloadDocuments: type, UploadDocuments: type};
  }
}


/**
 * Page Control Service
 *
 *  Used to handle both page access and dynamic module permissions
 */

@Injectable()
export class PageControlService {

  /**
   * Permissions objects for the page control
   *  =========================================================================================
   */
  public static GlobalDirector = PageUserType.create(UserType.GlobalDirector, "director", [
    "director*",
    "map;isDirector=true",
    "map/map-countries-list;isDirector=true",
    "risk-monitoring*",
    "preparedness*",
    "response-plans*",
    "country-admin*",
    "dashboard/review-response-plan*",
    "new-user-password",
    "dashboard/dashboard-overview*"
  ]);
  public static RegionalDirector = PageUserType.create(UserType.RegionalDirector, "director", [
    "director*",
    "map;isDirector=true",
    "map/map-countries-list;isDirector=true",
    "risk-monitoring*",
    "preparedness*",
    "response-plans*",
    "country-admin*",
    "dashboard/review-response-plan*",
    "new-user-password",
    "dashboard/dashboard-overview*"
  ]);
  public static CountryDirector = PageUserType.create(UserType.CountryDirector, "dashboard", [
    "dashboard*",
    "map",
    "map/map-countries-list",
    "risk-monitoring*",
    "export-start-fund*",
    "preparedness*",
    "response-plans*",
    "country-admin*",
    "new-user-password",
    "export-proposal*",
    "network-country*",
    "network*"
  ]);
  public static ErtLeader = PageUserType.create(UserType.ErtLeader, "dashboard", [
    "dashboard*",
    "map",
    "map/map-countries-list",
    "risk-monitoring*",
    "export-start-fund*",
    "preparedness*",
    "response-plans*",
    "country-admin*",
    "new-user-password",
    "export-proposal*",
    "network-country*",
    "network*",
    "local-agency*"
  ]);
  public static Ert = PageUserType.create(UserType.Ert, "dashboard", [
    "dashboard*",
    "map",
    "map/map-countries-list",
    "risk-monitoring*",
    "export-start-fund*",
    "preparedness*",
    "response-plans*",
    "country-admin*",
    "new-user-password",
    "export-proposal*",
    "network-country*",
    "network*",
    "local-agency*"
  ]);
  public static PartnerUser = PageUserType.create(UserType.PartnerUser, "dashboard", [
    "dashboard*",
    "map",
    "map/map-countries-list",
    "risk-monitoring*",
    "export-start-fund*",
    "preparedness*",
    "response-plans*",
    "country-admin*",
    "new-user-password",
    "network-country*",
    "network*",
    "local-agency*"
  ]);
  public static Donor = PageUserType.create(UserType.Donor, "donor-module", [
    "donor-module*",
    "dashboard/dashboard-overview*",
    "response-plans/view-plan*",
    "new-user-password"
  ]);
  public static GlobalUser = PageUserType.create(UserType.GlobalUser, "director", [
    "director*",
    "dashboard/dashboard-overview*",
    "map;isDirector=true",
    "map/map-countries-list;isDirector=true",
    "response-plans/view-plan*",
    // "risk-monitoring*",
    // "preparedness*",
    // "response-plans*",
    // "country-admin*",
    "new-user-password"
  ]);
  public static CountryAdmin = PageUserType.create(UserType.CountryAdmin, "dashboard", [
    "dashboard*",
    "preparedness*",
    "map",
    "map/map-countries-list",
    "country-admin*",
    "response-plans*",
    "risk-monitoring*",
    "export-start-fund*",
    "export-proposal*",
    "network-country*",
    "network*"
  ]);
  public static NonAlert = PageUserType.create(UserType.NonAlert, "dashboard", []);
  public static CountryUser = PageUserType.create(UserType.CountryUser, "director", [
    "director*",
    "map;isDirector=true",
    "map/map-countries-list;isDirector=true",
    "risk-monitoring*",
    "preparedness*",
    "response-plans*",
    "country-admin*",
    "new-user-password"
  ]);
  public static AgencyAdmin = PageUserType.create(UserType.AgencyAdmin, "agency-admin/country-office", [
    "agency-admin*",
    "director*",
    "response-plans/view-plan*",
    "system-admin/agency",
    "system-admin/add-agency"
  ]);

  public static LocalAgencyAdmin = PageUserType.create(UserType.LocalAgencyAdmin, "local-agency/dashboard", [
    "local-agency*",
    "agency-admin/new-agency/new-agency-password",
    "agency-admin/new-agency/new-agency-details",
    "export-start-fund*",
    "export-proposal*",
    "response-plans*",
    "preparedness*",
    "agency-admin*",
    "director*",
    "country-admin*",
    "map*",
    "dashboard*",
    "risk-monitoring*",
    "system-admin/agency",
    "network-country*",
    "network*"
  ]);

  public static LocalAgencyDirector = PageUserType.create(UserType.LocalAgencyDirector, "local-agency/dashboard", [
    "local-agency*",
    "agency-admin/new-agency/new-agency-password",
    "agency-admin/new-agency/new-agency-details",
    "export-start-fund*",
    "export-proposal*",
    "dashboard*",
    "new-user-password",
    "risk-monitoring*",
    "map*",
    "country-admin*",
    "preparedness*",
    "dashboard/review-response-plan*"
  ]);

  public static SystemAdmin = PageUserType.create(UserType.SystemAdmin, "system-admin/agency", [
    "system-admin*"
  ]);
  /**
   *  =========================================================================================
   */


  /**
   * Dynamic module permissions objects
   *  =========================================================================================
   */
  public static ModuleMinimumPreparedness = new AgencyPermissionObject(PermissionsAgency.MinimumPreparedness, [
    "preparedness/minimum"
  ]);
  public static ModuleAdvancedPreparedness = new AgencyPermissionObject(PermissionsAgency.AdvancedPreparedness, [
    "preparedness/advanced"
  ]);
  public static ModuleCHSPreparedness = new AgencyPermissionObject(PermissionsAgency.CHSPreparedness, []);
  public static ModuleResponsePlanning = new AgencyPermissionObject(PermissionsAgency.ResponsePlanning, [
    "response-plans",
    "response-plans/create-edit-response-plan",
    "response-plans/view-plan"
  ]);
  public static ModuleCountryOffice = new AgencyPermissionObject(PermissionsAgency.CountryOffice, [
    "country-admin/country-office-profile/equipment/add-edit-equipment",
    "country-admin/country-office-profile/equipment/add-edit-surge-equipment",
    "country-admin/country-office-profile/equipment",
    "response-plans/add-partner-organisation;fromResponsePlans=true"
  ]);
  public static ModuleRiskMonitoring = new AgencyPermissionObject(PermissionsAgency.RiskMonitoring, [
    "risk-monitoring",
    "risk-monitoring/add-hazard",
    "risk-monitoring/create-alert",
    "risk-monitoring/create-alert/countryCode"
  ]);
  /**
   *  =========================================================================================
   */

  public static pageControlMap: Map<UserType, PageUserType>;

  public static initPageControlMap() {
    if (this.pageControlMap == null) {
      this.pageControlMap = new Map<UserType, PageUserType>();
      this.pageControlMap.set(UserType.GlobalDirector, PageControlService.GlobalDirector);
      this.pageControlMap.set(UserType.RegionalDirector, PageControlService.RegionalDirector);
      this.pageControlMap.set(UserType.CountryDirector, PageControlService.CountryDirector);
      this.pageControlMap.set(UserType.ErtLeader, PageControlService.ErtLeader);
      this.pageControlMap.set(UserType.Ert, PageControlService.Ert);
      this.pageControlMap.set(UserType.Donor, PageControlService.Donor);
      this.pageControlMap.set(UserType.GlobalUser, PageControlService.GlobalUser);
      this.pageControlMap.set(UserType.CountryAdmin, PageControlService.CountryAdmin);
      this.pageControlMap.set(UserType.NonAlert, PageControlService.NonAlert);
      this.pageControlMap.set(UserType.CountryUser, PageControlService.CountryUser);
      this.pageControlMap.set(UserType.AgencyAdmin, PageControlService.AgencyAdmin);
      this.pageControlMap.set(UserType.SystemAdmin, PageControlService.SystemAdmin);
      this.pageControlMap.set(UserType.PartnerUser, PageControlService.PartnerUser);
      this.pageControlMap.set(UserType.LocalAgencyAdmin, PageControlService.LocalAgencyAdmin);
      this.pageControlMap.set(UserType.LocalAgencyDirector, PageControlService.LocalAgencyDirector);
    }
    return this.pageControlMap;
  }

  public static moduleControlMap: AgencyPermissionObject[];

  public static initModuleControlArray() {
    if (this.moduleControlMap == null) {
      this.moduleControlMap = [];
      this.moduleControlMap.push(PageControlService.ModuleRiskMonitoring);
      this.moduleControlMap.push(PageControlService.ModuleCountryOffice);
      this.moduleControlMap.push(PageControlService.ModuleResponsePlanning);
      this.moduleControlMap.push(PageControlService.ModuleMinimumPreparedness);
      this.moduleControlMap.push(PageControlService.ModuleAdvancedPreparedness);
      this.moduleControlMap.push(PageControlService.ModuleCHSPreparedness);
    }
    return this.moduleControlMap;
  }

  constructor(private af: AngularFire, private userService: UserService) {
  }


  /**
   *  PAGE ACCESS FUNCTIONALITY FOR REGULAR USERS.
   *
   *  This does not include UserTypes of NetworkAdmin or NetworkCountryAdmin
   * =============================================================================================
   */
  public auth(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: firebase.User, userType: UserType) => void) {
    PageControlService.auth(this.af, ngUnsubscribe, route, router, func, null);
  }

  public authObj(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: FirebaseAuthState, userType: UserType) => void) {
    PageControlService.auth(this.af, ngUnsubscribe, route, router, null, func);
  }

  private static auth(af: AngularFire, ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router,
                      authUser: (auth: firebase.User, userType: UserType) => void,
                      authObj: (auth: FirebaseAuthState, userType: UserType) => void) {
    if (Constants.SHOW_MAINTENANCE_PAGE) {
      router.navigateByUrl(Constants.MAINTENANCE_PAGE_URL);
    }
    else {
      console.log("in page control now***************")
      af.auth.takeUntil(ngUnsubscribe).subscribe((auth) => {
          if (auth) {
            UserService.getUserType(af, auth.auth.uid).takeUntil(ngUnsubscribe).subscribe(userType => {
              console.log(userType)
              if (userType == null) {
                if (authUser != null) {
                  authUser(auth.auth, null);
                }
                else if (authObj != null) {
                  authObj(auth, null);
                }
              }
              else {
                let type: PageUserType = PageControlService.initPageControlMap().get(userType);
                if (PageControlService.checkUrl(route, userType, type)) {
                  PageControlService.agencyBuildPermissionsMatrix(af, ngUnsubscribe, auth.auth.uid, Constants.USER_PATHS[userType], (list) => {
                    let s = PageControlService.buildEndUrl(route);
                    let skip = false;
                    // We have [AgencyPermissionObj], need to iterate through those.
                    //  For every one of those, check if our current URL is contained in one of thise
                    //   If so and we're not authorised to view it, kick us out
                    for (let x of list) {
                      for (let y of x.urls) {
                        // IF (currenturl == urlmatch OR urlmatch ends with * and currenturl starts with (urlmatch - *))
                        if ((s == y) && !x.isAuthorized) {
                          router.navigateByUrl(type.redirectTo);
                          skip = true;
                        }
                      }
                    }
                    if (!skip) {
                      if (authUser != null) {
                        authUser(auth.auth, userType);
                      }
                      else if (authObj != null) {
                        authObj(auth, userType);
                      }
                    }
                  });
                }
                else {
                  console.log("called here*************")
                  router.navigateByUrl(type.redirectTo);
                }
              }
            });
          } else {
            router.navigateByUrl("/login");
          }
        }
      );
    }
  }

  // =============================================================================================


  /**
   * Method to return all the information you may need from firebase regarding admin
   * If it's an agencyAdmin, countryId is a list of countryAdmins!
   */
  public authUserObj(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: FirebaseAuthState, userType: UserType, countryId: any, agencyId: string, systemAdminId: string) => void) {
    this.authoriseUser(ngUnsubscribe, route, router, null, func);
  }

  public authUser(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: firebase.User, userType: UserType, countryId: any, agencyId: string, systemAdminId: string) => void) {
    this.authoriseUser(ngUnsubscribe, route, router, func, null);
  }

  private authoriseUser(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router,
                        userCallback: (auth: firebase.User, userType: UserType, countryId: any, agencyId: string, systemAdminId: string) => void,
                        authStateCallback: (auth: FirebaseAuthState, userType: UserType, countryId: any, agencyId: string, systemAdminId: string) => void) {
    this.af.auth.takeUntil(ngUnsubscribe).subscribe((auth) => {
      if (auth) {
        this.checkAuth(ngUnsubscribe, auth.auth.uid, ModelUserTypeReturn.list(), 0, (userType, userObj) => {
          if (userObj != null || userType != null) {

            // To make it here we are signed in and we have the user type userType
            // userObj is the object under <status>/<usertype>/<uid> for my user
            // Exception logic for the partner user. This needs to return the selection agency/country info
            let systemId: string;
            let agencyId: string;
            let countryId: any;
            if (userObj.hasOwnProperty('systemAdmin')) {
              for (let x in userObj.systemAdmin) {
                systemId = x;
              }
            }
            else if (userType == UserType.SystemAdmin) {
              systemId = auth.auth.uid;
            }
            if (userObj.hasOwnProperty('agencyAdmin')) {
              for (let x in userObj.agencyAdmin) {
                agencyId = x;
              }
            }
            if (userObj.hasOwnProperty('countryId')) {
              countryId = userObj.countryId;
            }
            // IF YOU'RE A PARTNER USER
            if (userType == UserType.PartnerUser) {
              let runOnce: boolean = false;
              for (let x in userObj.selection) {
                // Find the selection
                if (!runOnce) {
                  agencyId = x;
                  countryId = userObj.selection[x];
                }
                runOnce = true;
              }
              if (!runOnce) {
                // Selection not found. Find the default agency
                for (let x in userObj.agencies) {
                  if (!runOnce) {
                    agencyId = x;
                    countryId = userObj.agencies[x];
                  }
                  runOnce = true;
                }
              }
            }

            // IF YOU'RE AN AGENCY ADMIN, LOCAL AGENCY DIRECTOR OR A LOCAL AGENCY ADMIN
            if (userType == UserType.AgencyAdmin || userType == UserType.LocalAgencyAdmin || userType == UserType.LocalAgencyDirector) {
              if (userObj.hasOwnProperty('agencyId')) {
                agencyId = userObj.agencyId;
              }
              if (userObj.hasOwnProperty('countryAdmins')) {
                countryId = [];
                for (let x in userObj.countryAdmins) {
                  countryId.push(x);
                }
              }
            }

            this.checkPageControl(auth, ngUnsubscribe, route, router, userType, countryId, agencyId, systemId, userCallback, authStateCallback);
          }
        });
      }
    });
  }

  private authNetworkAdmin(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: firebase.User) => void) {
    // this.af.auth.takeUntil(ngUnsubscribe).subscribe((auth) => {
    //
    // });
  }

  private authNetworkCountry(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: firebase.User) => void) {
    // this.af.auth.takeUntil(ngUnsubscribe).subscribe((auth) => {
    //
    // });
  }

  public networkAuth(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: firebase.User, oldUserType: UserType, networkId: string, networkCountryId: string) => void) {
    // TODO: Implement this functionality
    this.af.auth
      .takeUntil(ngUnsubscribe)
      .subscribe((auth) => {
        if (!auth || !auth.uid) {
          router.navigateByUrl(Constants.LOGIN_PATH);
        } else {
          func(auth.auth, null, null, null);
        }
      });
  }

  public networkAuthState(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: FirebaseAuthState, oldUserType: UserType, networkIds: string[], networkCountryIds: string[]) => void) {
    // TODO: Implement this functionality
    this.af.auth
      .takeUntil(ngUnsubscribe)
      .subscribe((auth) => {
        if (!auth || !auth.uid) {
          router.navigateByUrl(Constants.LOGIN_PATH);
        } else {
          func(auth, null, [], []);
        }
      });
  }


  // Given we are authenticated and valid, check permissions to see if we need to be kicked out
  private checkPageControl(authState: FirebaseAuthState, ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, userType: UserType, countryId: any, agencyId: string, systemId: string,
                           userCallback: (auth: firebase.User, userType: UserType, countryId: any, agencyId: string, systemAdminId: string) => void,
                           authStateCallback: (auth: FirebaseAuthState, userType: UserType, countryId: any, agencyId: string, systemAdminId: string) => void,) {
    let type: PageUserType = PageControlService.initPageControlMap().get(userType);

    console.log(userType)
    if (PageControlService.checkUrl(route, userType, type)) {
      PageControlService.agencyBuildPermissionsMatrix(this.af, ngUnsubscribe, authState.auth.uid, Constants.USER_PATHS[userType], (list) => {
        let s = PageControlService.buildEndUrl(route);
        let skip = false;
        // We have [AgencyPermissionObj], need to iterate through those.
        //  For every one of those, check if our current URL is contained in one of thise
        //   If so and we're not authorised to view it, kick us out

        for (let x of list) {
          for (let y of x.urls) {
            // IF (currenturl == urlmatch OR urlmatch ends with * and currenturl starts with (urlmatch - *))
            if ((s == y) && !x.isAuthorized && !skip) {
              if(x.permission == PermissionsAgency.RiskMonitoring){
                skip = false;
              }else {
                router.navigateByUrl(type.redirectTo);
                skip = true;
              }
            }
          }
        }
        if (!skip) {
          if (userCallback != null && authStateCallback == null) {
            userCallback(authState.auth, userType, countryId, agencyId, systemId);
          }
          else if (userCallback == null && authStateCallback != null) {
            authStateCallback(authState, userType, countryId, agencyId, systemId);
          }
        }
      });
    }
    else {
      console.log("check page control***** NO VALUE RETURNED!");
      /**DONT UNCOMMENT BELOW AS THIS CAUSE ISSUES IN THE LOGIN*/
      // router.navigateByUrl(type.redirectTo);
    }
  }

  // Method to recursively return the user object for a usertype
  private checkAuth(ngUnsubscribe: Subject<void>, uid: string, modelTypes: ModelUserTypeReturn[], index: number, fun: (userType: UserType, user: any) => void) {
    if (index == modelTypes.length) {
      fun(null, null);
    } else {
      this.af.database.object(Constants.APP_STATUS + "/" + modelTypes[index].path + "/" + uid, {preserveSnapshot: true})
        .takeUntil(ngUnsubscribe)
        .subscribe((snap) => {

          if (snap.val() != null) {

            // It's this user type!
            if (modelTypes[index].userType == UserType.AgencyAdmin) { //checks to see if user type is agency admin

              this.af.database.object(Constants.APP_STATUS + "/localAgencyDirector/" + uid, {preserveSnapshot: true})
                .takeUntil(ngUnsubscribe)
                .subscribe((innerSnapDirector) => {

                  // let key = Object.keys(innerSnapDirector.val()).find(key => innerSnapDirector.val()[key] == uid)
                  if (innerSnapDirector.val()) {
                    fun(UserType.LocalAgencyDirector, innerSnapDirector.val());
                  } else {
                    //checks to make sure it ins't actually a local agency admin as they exist in both nodes
                    this.af.database.object(Constants.APP_STATUS + "/administratorLocalAgency/" + uid, {preserveSnapshot: true})
                      .takeUntil(ngUnsubscribe)
                      .subscribe((innerSnap) => {
                        if (innerSnap.val() != null) {

                          fun(UserType.LocalAgencyAdmin, innerSnap.val());
                        } else {

                          fun(modelTypes[index].userType, snap.val());
                        }


                      })
                  }

                })
            } else {
              fun(modelTypes[index].userType, snap.val());
            }


          }
          else {

            this.checkAuth(ngUnsubscribe, uid, modelTypes, index + 1, fun);

          }
        });
    }
  }

  // Checking if the URL is within the PageAuth
  private static checkUrl(route: ActivatedRoute, userType: UserType, type: PageUserType): boolean {
    let current: string = PageControlService.buildEndUrl(route);
    console.log(current)
    console.log(type)

    for (let x of type.urls) {
      if (x == current || (x.endsWith("*") && current.startsWith(x.substr(0, x.length - 1)))) {

        // Current page matches which URL is checked
        return true;
      }
    }
    // Attempted to access a page that's not allowed.

    return false;
  }

  // Build the complete URL path from the ActivatedRoute param
  public static buildEndUrl(route: ActivatedRoute) {
    let parts: string = "";
    route.url.forEach((segments: UrlSegment[]) => {
      segments.forEach((value) => {
        parts += value.path.trim();
        for (let x in value.parameters) {
          parts += ";" + x + "=" + value.parameters[x];
        }
        parts += "/";
      });
    });
    if (parts.length != 0) {
      parts = parts.substr(0, parts.length - 1);
    }
    return parts;
  }


  /**
   *  PAGE ACCESS FUNCTIONALITY FOR NETWORK ADMIN / NETWORK COUNTRY ADMIN
   *
   *  This includes all user types.
   * =============================================================================================
   */
  // public networkAuth(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: firebase.User, userType: UserType) => void) {
  //   // TODO: Implement this functionality
  // }

  // ========================================================================================================


  /**
   *  Agency Modules configurator and matrix for quick-enabling the settings
   *  ========================================================================================================
   */
  static agencyDisableMap(): Map<PermissionsAgency, PermissionsAgency[]> {
    let map: Map<PermissionsAgency, PermissionsAgency[]> = new Map<PermissionsAgency, PermissionsAgency[]>();
    map.set(PermissionsAgency.MinimumPreparedness, [PermissionsAgency.CHSPreparedness]);
    return map;
  }

  static agencyBuildPermissionsMatrix(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, folder: string, fun: (list: AgencyPermissionObject[]) => void) {
    af.database.object(Constants.APP_STATUS + "/" + folder + "/" + uid)
      .map((admin) => {
        let adminId: string = "";
        if (admin.agencyAdmin) {
          for (let x in admin.agencyAdmin) {
            adminId = x;
          }
        } else {
          adminId = admin.agencyId
        }
        return adminId;
      })
      .flatMap((countryId) => {
        console.log(countryId)
        return af.database.object(Constants.APP_STATUS + "/module/" + countryId);
      })
      .takeUntil(ngUnsubscribe)
      .subscribe((val) => {
        let list = PageControlService.initModuleControlArray();
        for (let x of list) {
          if (val[x.permission] != null) {
            x.isAuthorized = val[x.permission].status;
          }
        }
        fun(list);
      });
  }

  static localAgencyBuildPermissionsMatrix(af: AngularFire, ngUnsubscribe: Subject<void>, countryId: string, folder: string, fun: (list: AgencyPermissionObject[]) => void) {
    af.database.object(Constants.APP_STATUS + "/module/" + countryId)
      .takeUntil(ngUnsubscribe)
      .subscribe((val) => {
        let list = PageControlService.initModuleControlArray();
        for (let x of list) {
          if (val[x.permission] != null) {
            x.isAuthorized = val[x.permission].status;
          }
        }
        fun(list);
      });
  }

  static agencyQuickEnabledMatrix(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, folder: string, fun: (isEnabled: AgencyModulesEnabled) => void) {
    PageControlService.agencyBuildPermissionsMatrix(af, ngUnsubscribe, uid, folder, (list) => {
      let agency: AgencyModulesEnabled = new AgencyModulesEnabled();
      for (let x of list) {
        if (x.permission === PermissionsAgency.MinimumPreparedness) {
          agency.minimumPreparedness = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.AdvancedPreparedness) {
          agency.advancedPreparedness = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.CHSPreparedness) {
          agency.chsPreparedness = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.CountryOffice) {
          agency.countryOffice = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.RiskMonitoring) {
          agency.riskMonitoring = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.ResponsePlanning) {
          agency.responsePlan = x.isAuthorized;
        }
      }
      fun(agency);
    });
  }

  static localAgencyQuickEnabledMatrix(af: AngularFire, ngUnsubscribe: Subject<void>, countryId: string, folder: string, fun: (isEnabled: AgencyModulesEnabled) => void) {
    PageControlService.localAgencyBuildPermissionsMatrix(af, ngUnsubscribe, countryId, folder, (list) => {
      let agency: AgencyModulesEnabled = new AgencyModulesEnabled();
      for (let x of list) {
        if (x.permission === PermissionsAgency.MinimumPreparedness) {
          agency.minimumPreparedness = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.AdvancedPreparedness) {
          agency.advancedPreparedness = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.CHSPreparedness) {
          agency.chsPreparedness = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.CountryOffice) {
          agency.countryOffice = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.RiskMonitoring) {
          agency.riskMonitoring = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.ResponsePlanning) {
          agency.responsePlan = x.isAuthorized;
        }
      }
      fun(agency);
    });
  }

  /**
   * Explicit copy of the agency permission smatrix. \
   *
   * TODO: When erverything migrates over to pageControl.authUser() call with the agencyId, use the below methods and delete
   * TODO: this method below. AgencyID Should be passed in from compoment
   * @param af
   * @param ngUnsubscribe
   * @param uid
   * @param folder
   * @param fun
   */
  static agencyModuleListMatrix(af: AngularFire, ngUnsubscribe: Subject<void>, agencyId: string, fun: (list: AgencyPermissionObject[]) => void) {
    af.database.object(Constants.APP_STATUS + "/module/" + agencyId)
      .takeUntil(ngUnsubscribe)
      .subscribe((val) => {
        let list = PageControlService.initModuleControlArray();
        for (let x of list) {
          if (val[x.permission] != null) {
            x.isAuthorized = val[x.permission].status;
          }
        }
        fun(list);
      });
  }

  static agencyModuleMatrix(af: AngularFire, ngUnsubscribe: Subject<void>, agencyId: string, fun: (isEnabled: AgencyModulesEnabled) => void) {
    PageControlService.agencyModuleListMatrix(af, ngUnsubscribe, agencyId, (list) => {
      let agency: AgencyModulesEnabled = new AgencyModulesEnabled();
      for (let x of list) {
        if (x.permission === PermissionsAgency.MinimumPreparedness) {
          agency.minimumPreparedness = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.AdvancedPreparedness) {
          agency.advancedPreparedness = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.CHSPreparedness) {
          agency.chsPreparedness = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.CountryOffice) {
          agency.countryOffice = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.RiskMonitoring) {
          agency.riskMonitoring = x.isAuthorized;
        }
        if (x.permission === PermissionsAgency.ResponsePlanning) {
          agency.responsePlan = x.isAuthorized;
        }
      }
      fun(agency);
    });
  }

  static agencySelfCheck(userType: UserType, activatedRoute: ActivatedRoute, router: Router, perm: AgencyPermissionObject) {
    let routeInfo = PageControlService.buildEndUrl(activatedRoute);
    for (let x of perm.urls) {
      if (x === routeInfo) {
        if (perm.isAuthorized) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  // ========================================================================================================


  /**
   * Country Permissions Matrix for the Country Admin Permissions settings
   */
  static countryPermissionsMatrix(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, userType: UserType, fun: (isEnabled: CountryPermissionsMatrix) => void) {
    if (userType == UserType.PartnerUser) {
      af.database.object(Constants.APP_STATUS + "/partner/" + uid + "/permissions", {preserveSnapshot: true})
        .takeUntil(ngUnsubscribe)
        .subscribe((snap) => {
          let x: CountryPermissionsMatrix = new CountryPermissionsMatrix();
          x.chsActions.Assign = snap.val().assignCHS;
          x.countryContacts.New = snap.val().contacts.new;
          x.countryContacts.Edit = snap.val().contacts.edit;
          x.countryContacts.Delete = snap.val().contacts.delete;
          x.customAPA.Assign = snap.val().customApa.assign;
          x.customAPA.Edit = snap.val().customApa.edit;
          x.customAPA.New = snap.val().customApa.new;
          x.customAPA.Delete = snap.val().customApa.delete;
          x.mandatedAPA.Assign = snap.val().assignMandatedApa;
          x.customMPA.Assign = snap.val().customMpa.assign;
          x.customMPA.Edit = snap.val().customMpa.edit;
          x.customMPA.New = snap.val().customMpa.new;
          x.customMPA.Delete = snap.val().customMpa.delete;
          x.mandatedMPA.Assign = snap.val().assignMandatedMpa;
          x.notes.New = snap.val().notes.new;
          x.notes.Edit = snap.val().notes.edit;
          x.notes.Delete = snap.val().notes.delete;
          x.other.DownloadDocuments = snap.val().other.downloadDoc;
          fun(x);
        });
    }
    else {
      af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid, {preserveSnapshot: true})
        .takeUntil(ngUnsubscribe)
        .map((snap) => {
          let agencyAdmin: string;
          for (let x in snap.val().agencyAdmin) {
            agencyAdmin = x;
          }
          return Pair.create((snap.val().countryId ? snap.val().countryId : agencyAdmin), agencyAdmin);
        })
        .flatMap((pair: Pair) => {
          return pair.f !== pair.s
            ?
            af.database.object(Constants.APP_STATUS + "/countryOffice/" + pair.s + "/" + pair.f, {preserveSnapshot: true})
            :
            af.database.object(Constants.APP_STATUS + "/agency/" + pair.s, {preserveSnapshot: true})
        })
        .takeUntil(ngUnsubscribe)
        .subscribe((snap) => {
          if (snap.val() && snap.val().hasOwnProperty('permissionSettings')) {
            let s = snap.val().permissionSettings;
            // Build the matrix
            let x: CountryPermissionsMatrix = new CountryPermissionsMatrix();
            if (userType == UserType.CountryAdmin || userType == UserType.RegionalDirector || userType == UserType.GlobalUser || userType == UserType.GlobalDirector) {
              x.all(true);
            }
            else {
              x.chsActions.Assign = (s.chsActions[userType] ? s.chsActions[userType] : false);
              x.countryContacts.Delete = (s.countryContacts.delete[userType] ? s.countryContacts.delete[userType] : false);
              x.countryContacts.Edit = (s.countryContacts.edit[userType] ? s.countryContacts.edit[userType] : false);
              x.countryContacts.New = (s.countryContacts.new[userType] ? s.countryContacts.new[userType] : false);
              x.customAPA.Assign = (s.customApa.assign[userType] ? s.customApa.assign[userType] : false);
              x.customAPA.Edit = (s.customApa.edit[userType] ? s.customApa.edit[userType] : false);
              x.customAPA.New = (s.customApa.new[userType] ? s.customApa.new[userType] : false);
              x.customAPA.Delete = (s.customApa.delete[userType] ? s.customApa.delete[userType] : false);
              x.mandatedAPA.Assign = (s.mandatedApaAssign[userType] ? s.mandatedApaAssign[userType] : false);
              x.customMPA.Assign = (s.customMpa.assign[userType] ? s.customMpa.assign[userType] : false);
              x.customMPA.Edit = (s.customMpa.edit[userType] ? s.customMpa.edit[userType] : false);
              x.customMPA.New = (s.customMpa.new[userType] ? s.customMpa.new[userType] : false);
              x.customMPA.Delete = (s.customMpa.delete[userType] ? s.customMpa.delete[userType] : false);
              x.mandatedMPA.Assign = (s.mandatedMpaAssign[userType] ? s.mandatedMpaAssign[userType] : false);
              x.notes.New = (s.notes.new[userType] ? s.notes.new[userType] : false);
              x.notes.Edit = (s.notes.edit[userType] ? s.notes.edit[userType] : false);
              x.notes.Delete = (s.notes.delete[userType] ? s.notes.delete[userType] : false);
              x.other.DownloadDocuments = (s.other.downloadDoc[userType] ? s.other.downloadDoc[userType] : false);
              x.other.UploadDocuments = (s.other.uploadDoc[userType] ? s.other.uploadDoc[userType] : false);
            }
            fun(x);
          } else {
            console.log("no permission node!!!")
            //if no default all to true
            let x: CountryPermissionsMatrix = new CountryPermissionsMatrix();
            x.all(true)
            fun(x)
          }
        });
    }
  }

  // ========================================================================================================
}


export class ModelUserTypeReturn {
  public userType: UserType;
  public path: string;

  constructor(userType: UserType, path: string) {
    this.userType = userType;
    this.path = path;
  }

  public static list(): ModelUserTypeReturn[] {
    let x: ModelUserTypeReturn[] = [];
    x.push(new ModelUserTypeReturn(UserType.GlobalDirector, "globalDirector"));
    x.push(new ModelUserTypeReturn(UserType.RegionalDirector, "regionDirector"));
    x.push(new ModelUserTypeReturn(UserType.CountryDirector, "countryDirector"));
    x.push(new ModelUserTypeReturn(UserType.ErtLeader, "ertLeader"));
    x.push(new ModelUserTypeReturn(UserType.Ert, "ert"));
    x.push(new ModelUserTypeReturn(UserType.Donor, "donor"));
    x.push(new ModelUserTypeReturn(UserType.GlobalUser, "globalUser"));
    x.push(new ModelUserTypeReturn(UserType.CountryAdmin, "administratorCountry"));
    // x.push(new ModelUserTypeReturn(UserType.NonAlert, "globalDirector"));
    x.push(new ModelUserTypeReturn(UserType.CountryUser, "countryUser"));
    x.push(new ModelUserTypeReturn(UserType.AgencyAdmin, "administratorAgency"));
    x.push(new ModelUserTypeReturn(UserType.SystemAdmin, "system"));
    x.push(new ModelUserTypeReturn(UserType.PartnerUser, "partnerUser"));
    x.push(new ModelUserTypeReturn(UserType.LocalAgencyAdmin, "administratorLocalAgency"));
    x.push(new ModelUserTypeReturn(UserType.LocalAgencyDirector, "localAgencyDirector"));
    return x;
  }

  public static getPath(userType: UserType) {
    let x: ModelUserTypeReturn[] = ModelUserTypeReturn.list();
    for (let i of x) {
      if (i.userType == userType) {
        return i.path;
      }
    }
    return null;
  }
}
