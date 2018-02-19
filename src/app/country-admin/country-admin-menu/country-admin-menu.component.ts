import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {PermissionsAgency, UserType} from "../../utils/Enums";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyPermissionObject, PageControlService} from "../../services/pagecontrol.service";
import {Constants} from "../../utils/Constants";
import * as XLSX from 'xlsx';
import {ExportDataService} from "../../services/export-data.service";

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

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private userService: UserService,
              private route: ActivatedRoute,
              private dataService:ExportDataService,
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
    console.log("try to export country office data")
    this.dataService.exportOfficeData(this.countryId)

    // let counter = 0
    //
    // const wb: XLSX.WorkBook = XLSX.utils.book_new()
    //
    // this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + this.countryId)
    //   .first()
    //   .subscribe(planList => {
    //     let plans = planList.map(plan => {
    //       let obj = {}
    //       obj["name"] = plan["name"]
    //       obj["hazardScenario"] = plan["hazardScenario"]
    //       obj["status"] = plan["status"]
    //       obj["sectionsCompleted"] = plan["sectionsCompleted"]
    //       obj["timeUpdated"] = plan["timeUpdated"]
    //       return obj
    //     })
    //
    //     const planSheet = XLSX.utils.json_to_sheet(plans);
    //     XLSX.utils.book_append_sheet(wb, planSheet, "Response Plans")
    //
    //     counter++
    //
    //     this.exportFile(counter, 2, wb)
    //   })
    //
    // //test another sheet
    // this.af.database.list(Constants.APP_STATUS + "/action/" + this.countryId)
    //   .first()
    //   .subscribe(actionList => {
    //     let actions = actionList.map(action => {
    //       let obj = {}
    //       obj["Action title"] = action["type"]
    //       obj["Preparedness action level"] = action["level"]
    //       obj["Type"] = action["type"]
    //       obj["Department"] = action["department"]
    //       obj["Assigned to"] = action["asignee"]
    //       obj["Due Date"] = action["dueDate"]
    //       obj["Budget"] = action["budget"]
    //       obj["Document Required"] = action["requireDoc"]
    //       obj["Status"] = "test status"
    //       obj["Expires"] = action["dueDate"]
    //       obj["Notes"] = "test 5"
    //       return obj
    //     })
    //
    //     const actionSheet = XLSX.utils.json_to_sheet(actions);
    //     XLSX.utils.book_append_sheet(wb, actionSheet, "Preparedness")
    //
    //     counter++
    //
    //     this.exportFile(counter, 2, wb)
    //   })
  }

  // private exportFile(counter, total, wb) {
  //   if (counter == total) {
  //     //try export see if works
  //     XLSX.writeFile(wb, 'SheetJS.xlsx')
  //   }
  // }

}
