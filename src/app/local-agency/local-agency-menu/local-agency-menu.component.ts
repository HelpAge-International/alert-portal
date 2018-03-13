import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {PermissionsAgency, UserType} from "../../utils/Enums";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {AgencyPermissionObject, PageControlService} from "../../services/pagecontrol.service";
import {CommonService} from "../../services/common.service";
import {ExportDataService} from "../../services/export-data.service";

@Component({
  selector: 'app-local-agency-menu',
  templateUrl: './local-agency-menu.component.html',
  styleUrls: ['./local-agency-menu.component.scss']
})
export class LocalAgencyMenuComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private UserType = UserType;
  private userType: UserType;
  private showLoader:boolean

  // Permissions
  public permMinimumPreparedness = false;
  public permAdvancedPreparedness = false;
  public permCHSPreparedness = false;
  public permRiskMonitoring = false;
  public permCountryOffice = false;
  public permResponsePlanning = false;
  private agencyId: string;

  constructor(private pageControl: PageControlService, private af: AngularFire,
              private userService: UserService,
              private route: ActivatedRoute,
              private commonService:CommonService,
              private dataService:ExportDataService,
              private router: Router) { }

  ngOnInit() {

    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId
      this.userType = userType;
      PageControlService.agencyModuleListMatrix(this.af, this.ngUnsubscribe, agencyId, (list: AgencyPermissionObject[]) => {
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

  exportData() {
    this.showLoader = true
    // get the country levels values first
    this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .first()
      .subscribe(content => {
        //get all staff for this country
        this.userService.getStaffList(this.agencyId)
          .first()
          .subscribe(staffs => {
            let staffMap = new Map<string, string>()
            //get country admin first
            this.userService.getUser(this.uid)
              .first()
              .subscribe(admin => {
                staffMap.set(admin.id, admin.firstName + " " + admin.lastName)

                if (staffs.length > 0) {
                  //get rest staffs for country
                  staffs.forEach(staff => {
                    this.userService.getUser(staff.id)
                      .first()
                      .subscribe(user => {
                        staffMap.set(user.id, user.firstName + " " + user.lastName)

                        if (staffMap.size === staffs.length + 1) {
                          //start export data
                          this.dataService.exportOfficeData(this.agencyId, null, content, staffMap, true)
                            .first()
                            .subscribe(value => this.showLoader = !value)
                        }
                      })
                  })
                } else {
                  //start export data
                  this.dataService.exportOfficeData(this.agencyId, null, content, staffMap, true)
                    .first()
                    .subscribe(value => this.showLoader = !value)
                }
              })

          })

      })
  }

}

