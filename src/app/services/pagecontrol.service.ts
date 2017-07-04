import {PermissionsAgency, UserType} from "../utils/Enums";
import {AngularFire, AngularFireAuth, FirebaseAuthState} from "angularfire2";
import {UserService} from "./user.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";
import {Constants} from "../utils/Constants";
import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/platform-browser";
import {Pair} from "../utils/bundles";
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
  // public crossCountrySameAgency: {
  //   AddNote: boolean,
  //   CopyAction: boolean,
  //   Download: boolean,
  //   Edit: boolean,
  //   View: boolean,
  //   ViewContacts: boolean
  // };
  // public interAgencyCrossCountry: {
  //   AddNote: boolean,
  //   CopyAction: boolean,
  //   Download: boolean,
  //   Edit: boolean,
  //   View: boolean,
  //   ViewContacts: boolean
  // };
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
    "country-admin*"
  ]);
  public static RegionalDirector = PageUserType.create(UserType.RegionalDirector, "director", [
    "director*",
    "map;isDirector=true",
    "map/map-countries-list;isDirector=true",
    "risk-monitoring*",
    "preparedness*",
    "response-plans*",
    "country-admin*"
  ]);
  public static CountryDirector = PageUserType.create(UserType.CountryDirector, "dashboard", [
    "dashboard*",
    "map",
    "map/map-countries-list",
    "risk-monitoring*",
    "export-start-fund*",
    "preparedness*",
    "response-plans*",
    "country-admin*"
  ]);
  public static ErtLeader = PageUserType.create(UserType.ErtLeader, "dashboard", [
    "dashboard*",
    "map",
    "map/map-countries-list",
    "risk-monitoring*",
    "export-start-fund*",
    "preparedness*",
    "response-plans*",
    "country-admin*"
  ]);
  public static Ert = PageUserType.create(UserType.Ert, "dashboard", [
    "dashboard*",
    "map",
    "map/map-countries-list",
    "risk-monitoring*",
    "export-start-fund*",
    "preparedness*",
    "response-plans*",
    "country-admin*"
  ]);
  public static Donor = PageUserType.create(UserType.Donor, "donor-module", [
    "donor-module*"
  ]);
  public static GlobalUser = PageUserType.create(UserType.GlobalUser, "director", [
    "director*",
    "map;isDirector=true",
    "map/map-countries-list;isDirector=true",
    "risk-monitoring*",
    "preparedness*",
    "response-plans*",
    "country-admin*"
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
    "export-proposal*"
  ]);
  public static NonAlert = PageUserType.create(UserType.NonAlert, "dashboard", []);
  public static CountryUser = PageUserType.create(UserType.CountryUser, "director", [
    "director*",
    "map;isDirector=true",
    "map/map-countries-list;isDirector=true",
    "risk-monitoring*",
    "preparedness*",
    "response-plans*",
    "country-admin*"
  ]);
  public static AgencyAdmin = PageUserType.create(UserType.AgencyAdmin, "agency-admin/country-office", [
    "agency-admin*"
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

  constructor(private af: AngularFire) {
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
    af.auth.takeUntil(ngUnsubscribe).subscribe((auth) => {
      if (auth) {
        UserService.getUserType(af, auth.auth.uid).subscribe(userType => {
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
              router.navigateByUrl(type.redirectTo);
            }
          }
        });
      } else {
        router.navigateByUrl("/login");
      }
    });
  }
  // =============================================================================================


  /**
   *  PAGE ACCESS FUNCTIONALITY FOR NETWORK ADMIN / NETWORK COUNTRY ADMIN
   *
   *  This includes all user types.
   * =============================================================================================
   */
  public networkAuth(ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: firebase.User, userType: UserType) => void) {
    // TODO: Implement this functionality
  }




  // Checking if the URL is within the PageAuth
  private static checkUrl(route: ActivatedRoute, userType: UserType, type: PageUserType): boolean {
    let current: string = PageControlService.buildEndUrl(route);
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
  private static buildEndUrl(route: ActivatedRoute) {
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
   *  Agency Modules configurator and matrix for quick-enabling the settings
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
        for (let x in admin.agencyAdmin) {
          adminId = x;
        }
        return adminId;
      })
      .flatMap((countryId) => {
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

  /**
   * Country Permissions Matrix for the Country Admin Permissions settings
   */
  static countryPermissionsMatrix(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, userType: UserType, fun: (isEnabled: CountryPermissionsMatrix) => void) {
    // TODO: Implement this
    if (userType == UserType.RegionalDirector || userType == UserType.GlobalUser || userType == UserType.GlobalDirector) {
      fun(CountryPermissionsMatrix.allTrue());
    }
    else {
      af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[userType] + "/" + uid, {preserveSnapshot: true})
        .takeUntil(ngUnsubscribe)
        .map((snap) => {
          let agencyAdmin: string;
          for (let x in snap.val().agencyAdmin) {
            agencyAdmin = x;
          }
          return Pair.create(snap.val().countryId, agencyAdmin);
        })
        .flatMap((pair: Pair) => {
          return af.database.object(Constants.APP_STATUS + "/countryOffice/" + pair.s + "/" + pair.f, {preserveSnapshot: true});
        })
        .takeUntil(ngUnsubscribe)
        .subscribe((snap) => {
          if (snap && snap.val() && snap.val().hasOwnProperty('permissionSettings')) {
            let s = snap.val().permissionSettings;
            // Build the matrix
            let x: CountryPermissionsMatrix = new CountryPermissionsMatrix();
            // CHSActions
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
            fun(x);
          }
        });
    }
  }
}
