import {PermissionsAgency, UserType} from "../utils/Enums";
import {AngularFire, AngularFireAuth, FirebaseAuth, FirebaseAuthState} from "angularfire2";
import {UserService} from "./user.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";
import {Constants} from "../utils/Constants";
import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/platform-browser";
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
    this.minimumPreparedness = false;
    this.advancedPreparedness = false;
    this.chsPreparedness = false;
    this.riskMonitoring = false;
    this.responsePlan = false;
    this.countryOffice = false;
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
    "director"
  ]);
  public static RegionalDirector = PageUserType.create(UserType.RegionalDirector, "director", [
    "director"
  ]);
  public static CountryDirector = PageUserType.create(UserType.CountryDirector, "dashboard", [
    "dashboard"
  ]);
  public static ErtLeader = PageUserType.create(UserType.ErtLeader, "dashboard", [
    "dashboard"
  ]);
  public static Ert = PageUserType.create(UserType.Ert, "dashboard", [
    "dashboard"
  ]);
  public static Donor = PageUserType.create(UserType.Donor, "donor-module", [
    "donor-module"
  ]);
  public static GlobalUser = PageUserType.create(UserType.GlobalUser, "director", [
    "director"
  ]);
  public static CountryAdmin = PageUserType.create(UserType.CountryAdmin, "dashboard", [
    "dashboard",
    "preparedness/minimum",
    "preparedness/advanced",
    "map",
    "map/map-countries-list",
    "country-admin/country-office-profile",
    "country-admin/country-office-profile/equipment/add-edit-equipment",
    "country-admin/country-office-profile/equipment/add-edit-surge-equipment",
    "country-admin/country-office-profile/equipment",
    "country-admin/country-office-profile/programme",
    "country-admin/country-office-profile/partners",
    "country-admin/country-office-profile/office-capacity",
    "country-admin/country-office-profile/coordination",
    "country-admin/country-office-profile/stock-capacity",
    "country-admin/country-office-profile/office-documents",
    "country-admin/country-office-profile/contacts",
    "country-admin/country-agencies",
    "country-admin/country-my-agency",
    "country-admin/country-account-settings",
    "country-admin/country-staff",
    "country-admin/settings",
    "country-admin/settings/country-permission-settings",
    "country-admin/settings/country-clock-settings",
    "country-admin/settings/country-modules-settings",
    "country-admin/settings/country-notification-settings",
    "country-admin/settings/country-notification-settings/country-add-external-recipient",
    "country-admin/country-messages",
    "country-admin/country-messages/country-create-edit-messages",
    "response-plans",
    "response-plans/create-edit-response-plan",
    "response-plans/view-plan",
    "risk-monitoring",
    "risk-monitoring/create-alert",
    "risk-monitoring/add-hazard",
    "risk-monitoring/create-alert/countryCode"
  ]);
  public static NonAlert = PageUserType.create(UserType.NonAlert, "dashboard", [
  ]);
  public static CountryUser = PageUserType.create(UserType.CountryUser, "director", [
    "director"
  ]);
  public static AgencyAdmin = PageUserType.create(UserType.AgencyAdmin, "agency-admin/country-office", [
    "agency-admin/country-office"
  ]);
  public static SystemAdmin = PageUserType.create(UserType.SystemAdmin, "system-admin/agency", [
    "system-admin/agency",
    "system-admin/add-agency",
    "system-admin/network",
    "system-admin/min-prep",
    "system-admin/min-prep/create",
    "system-admin/mpa",
    "system-admin/mpa/create",
    "system-admin/system-settings",
    "system-admin/system-settings/system-settings-documents",
    "system-admin/system-settings/system-settings-response-plans",
    "system-admin/messages",
    "system-admin/messages/create"
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
  public static ModuleCHSPreparedness = new AgencyPermissionObject(PermissionsAgency.CHSPreparedness, [

  ]);
  public static ModuleResponsePlanning = new AgencyPermissionObject(PermissionsAgency.ResponsePlanning, [
    "response-plans",
    "response-plans/create-edit-response-plan",
    "response-plans/view-plan"
  ]);
  public static ModuleCountryOffice = new AgencyPermissionObject(PermissionsAgency.CountryOffice, [
    "country-admin/country-office-profile/equipment/add-edit-equipment",
    "country-admin/country-office-profile/equipment/add-edit-surge-equipment",
    "country-admin/country-office-profile/equipment"
  ]);
  public static ModuleRiskMonitoring= new AgencyPermissionObject(PermissionsAgency.RiskMonitoring, [
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
            else if (authObj != null){
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
                    if (s.match(y) && !x.isAuthorized) {
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
  private static checkUrl(route: ActivatedRoute, userType: UserType, type: PageUserType): boolean {
    let current: string = PageControlService.buildEndUrl(route);
    for (let x of type.urls) {
      if (x == current) {
        // Current page matches which URL is checked
        return true;
      }
    }
    // Attempted to access a page that's not allowed.
    return false;
  }

  private static buildEndUrl(route: ActivatedRoute) {
    let parts: string = "";
    route.url.forEach((segments: UrlSegment[]) => {
      segments.forEach((value) => {
        parts += value.path.trim() + "/";
      });
    });
    if (parts.length != 0) {
      parts = parts.substr(0, parts.length - 1);
    }
    return parts;
  }

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
}
