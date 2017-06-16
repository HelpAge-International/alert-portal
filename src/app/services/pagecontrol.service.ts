import {PermissionsAgency, UserType} from "../utils/Enums";
import {AngularFire, AngularFireAuth, FirebaseAuthState} from "angularfire2";
import {UserService} from "./user.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";
import {Constants} from "../utils/Constants";
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

export class PageControlService {

  /**
   * Permissions objects for the page control
   *  =========================================================================================
   */
  public static GlobalDirector = PageUserType.create(UserType.GlobalDirector, "dashboard", [
  ]);
  public static RegionalDirector = PageUserType.create(UserType.RegionalDirector, "dashboard", [
  ]);
  public static CountryDirector = PageUserType.create(UserType.CountryDirector, "dashboard", [
  ]);
  public static ErtLeader = PageUserType.create(UserType.ErtLeader, "dashboard", [
  ]);
  public static Ert = PageUserType.create(UserType.Ert, "dashboard", [
  ]);
  public static Donor = PageUserType.create(UserType.Donor, "dashboard", [
  ]);
  public static GlobalUser = PageUserType.create(UserType.GlobalUser, "dashboard", [
  ]);
  public static CountryAdmin = PageUserType.create(UserType.CountryAdmin, "dashboard", [
    "dashboard",
    "preparedness/minimum",
    "preparedness/advanced",
    "map",
    "map/map-countries-list",
    "country-admin/country-office-profile/equipment/add-edit-equipment",
    "country-admin/country-office-profile/equipment/add-edit-surge-equipment",
    "country-admin/country-office-profile/equipment",
    "response-plans",
    "response-plans/create-edit-response-plan",
    "response-plans/view-plan",
    "risk-monitoring",
    "risk-monitoring/add-hazard",
    "risk-monitoring/create-alert/countryCode"
  ]);
  public static NonAlert = PageUserType.create(UserType.NonAlert, "dashboard", [
  ]);
  public static CountryUser = PageUserType.create(UserType.CountryUser, "dashboard", [
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
    "country-admin/country-office-profile/equipment"
  ]);
  public static ModuleRiskMonitoring= new AgencyPermissionObject(PermissionsAgency.RiskMonitoring, [
    "risk-monitoring",
    "risk-monitoring/add-hazard",
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

  public static auth(af: AngularFire, ngUnsubscribe: Subject<void>, route: ActivatedRoute, router: Router, func: (auth: FirebaseAuthState, userType: UserType) => void) {
    af.auth.takeUntil(ngUnsubscribe).subscribe((user) => {
      if (user) {
        UserService.getUserType(af, user.auth.uid).subscribe(userType => {
          //TODO: Check this if it's null! If it's null then there's no user type authentication
          if (userType == null) {
            func(user, null);
          }
          else {
            let type: PageUserType = PageControlService.initPageControlMap().get(userType);
            if (PageControlService.checkUrl(route, userType, type)) {
              PageControlService.agencyBuildPermissionsMatrix(af, ngUnsubscribe, user.auth.uid, Constants.USER_PATHS[userType], (list) => {
                let s = PageControlService.buildEndUrl(route);
                let skip = true;
                // We have [AgencyPermissionObj], need to iterate through those.
                //  For every one of those, check if our current URL is contained in one of thise
                //   If so and we're not authorised to view it, kick us out
                for (let x of list) {
                  for (let y of x.urls) {
                    if (s == y && !x.isAuthorized) {
                      router.navigateByUrl(type.redirectTo);
                      skip = false;
                    }
                  }
                }
                if (!skip) {
                  func(user, userType);
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
        parts += value.path + "/";
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
