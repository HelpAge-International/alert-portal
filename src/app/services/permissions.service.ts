import {PermissionsAgency} from "../utils/Enums";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {Constants} from "../utils/Constants";
import {ActivatedRoute, Route, Router, UrlSegment} from "@angular/router";
export class PermissionService {

  /** Agency permission data **/
  static AGENCY_REDIRECT_URL: string = "/dashboard";
  static agencyPermissionList() {
    let list: AgencyPermissionObject[] = [];
    list.push(new AgencyPermissionObject(PermissionsAgency.RiskMonitoring,
      [
        "risk-monitoring",
        "risk-monitoring/add-hazard",
        "risk-monitoring/create-alert/countryCode"
      ]));
    list.push(new AgencyPermissionObject(PermissionsAgency.CountryOffice,
      [
        "country-admin/country-office-profile/equipment/add-edit-equipment",
        "country-admin/country-office-profile/equipment/add-edit-surge-equipment",
        "country-admin/country-office-profile/equipment",

      ]));
    list.push(new AgencyPermissionObject(PermissionsAgency.ResponsePlanning,
      [
        "response-plans",
        "response-plans/create-edit-response-plan",
        "response-plans/view-plan"
      ]));
    list.push(new AgencyPermissionObject(PermissionsAgency.MinimumPreparedness,
      [
        "preparedness/minimum"
      ]));
    list.push(new AgencyPermissionObject(PermissionsAgency.AdvancedPreparedness,
      [
        "preparedness/advanced"
      ]));
    return list;
  }
  static agencyDisableMap(): Map<PermissionsAgency, PermissionsAgency[]> {
    let map: Map<PermissionsAgency, PermissionsAgency[]> = new Map<PermissionsAgency, PermissionsAgency[]>();
    map.set(PermissionsAgency.RiskMonitoring, [PermissionsAgency.AdvancedPreparedness]);
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
        let list = PermissionService.agencyPermissionList();
        for (let x of list) {
          if (val[x.permission] != null) {
            x.isAuthorized = val[x.permission].status;
          }
        }
        fun(list);
      });
  }

  static agencyQuickEnabledMatrix(af: AngularFire, ngUnsubscribe: Subject<void>, uid: string, folder: string, fun: (isEnabled: AgencyModulesEnabled) => void) {
    PermissionService.agencyBuildPermissionsMatrix(af, ngUnsubscribe, uid, folder, (list) => {
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

  static agencySelfCheck(activatedRoute: ActivatedRoute, router: Router, perm: AgencyPermissionObject) {
    let routeInfo = PermissionService.buildEndUrl(activatedRoute);
    for (let x of perm.urls) {
      console.log(x);
      console.log(routeInfo);
      if (x === routeInfo) {
        if (perm.isAuthorized) {
          return true;
        } else {
          router.navigateByUrl(PermissionService.AGENCY_REDIRECT_URL);
          return false;
        }
      }
    }
    return false;
  }

  static buildEndUrl(route: ActivatedRoute) {
    let parts: string;
    route.url.forEach((segments: UrlSegment[]) => {
      console.log(segments);
      parts = segments.join("/");
    });
    return parts;
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
