import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {PermissionsAgency, UserType} from "../../utils/Enums";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {AgencyPermissionObject, PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-country-admin-menu',
  templateUrl: './country-admin-menu.component.html',
  styleUrls: ['./country-admin-menu.component.css']
})
export class CountryAdminMenuComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private UserType = UserType;
  private userType: UserType;

  // Permissions
  public permMinimumPreparedness = false;
  public permAdvancedPreparedness = false;
  public permCHSPreparedness = false;
  public permRiskMonitoring = false;
  public permCountryOffice = false;
  public permResponsePlanning = false;

  constructor(private pageControl: PageControlService, private af: AngularFire,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.userType = userType;
      PageControlService.agencyBuildPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid,
        Constants.USER_PATHS[this.userType], (list: AgencyPermissionObject[]) => {
          for (const value of list) {
            if (value.permission === PermissionsAgency.MinimumPreparedness) {
              this.permMinimumPreparedness = !value.isAuthorized;
            }
            if (value.permission === PermissionsAgency.AdvancedPreparedness) {
              this.permAdvancedPreparedness = !value.isAuthorized;
            }
            if (value.permission === PermissionsAgency.RiskMonitoring) {
              this.permRiskMonitoring = !value.isAuthorized;
            }
            if (value.permission === PermissionsAgency.CountryOffice) {
              this.permCountryOffice = !value.isAuthorized;
            }
            if (value.permission === PermissionsAgency.ResponsePlanning) {
              this.permResponsePlanning = !value.isAuthorized;
            }
            PageControlService.agencySelfCheck(userType, this.route, this.router, value);
          }
        });
    });
  }

  permissionList(list: AgencyPermissionObject[]) {
    // Check the header items and a self-aware check
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
