import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {PermissionsAgency, UserType} from "../../utils/Enums";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyPermissionObject, PageControlService} from "../../services/pagecontrol.service";
import {Constants} from "../../utils/Constants";
import * as XLSX from 'xlsx';
import {ExportDataService} from "../../services/export-data.service";
import {CommonService} from "../../services/common.service";
import { ReportProblemComponent } from "../../report-problem/report-problem.component";
import { BugReportingService } from "../../services/bug-reporting.service";

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
  private countryId: string;
  private agencyId: string;

  //export loader
  private showLoader:boolean = false

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private userService: UserService,
              private route: ActivatedRoute,
              private commonService: CommonService,
              private dataService: ExportDataService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.userType = userType;
      this.countryId = countryId
      this.agencyId = agencyId

      PageControlService.agencyModuleListMatrix(this.af, this.ngUnsubscribe, agencyId, (list: AgencyPermissionObject[]) => {
        for (const value of list) {
          console.log(list)

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
        this.userService.getStaffList(this.countryId)
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
                          this.dataService.exportOfficeData(this.agencyId, this.countryId, content, staffMap)
                            .first()
                            .subscribe(value => this.showLoader = !value)
                        }
                      })
                  })
                } else {
                  //start export data
                  this.dataService.exportOfficeData(this.agencyId, this.countryId, content, staffMap)
                    .first()
                    .subscribe(value => this.showLoader = !value)
                }
              })

          })

      })
  }
}
