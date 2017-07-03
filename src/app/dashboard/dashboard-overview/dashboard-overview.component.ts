import {Component, OnDestroy, OnInit} from '@angular/core';
import {Constants} from "../../utils/Constants";
import {Subject} from "rxjs/Subject";
import {AlertLevels, AlertMessageType, AlertStatus} from "../../utils/Enums";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ActionsService} from "../../services/actions.service";
import {CommonService} from "../../services/common.service";
import {HazardImages} from "../../utils/HazardImages";
import {AlertMessageModel} from "../../model/alert-message.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css'],
  providers: [ActionsService]
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {

  private AlertLevels = AlertLevels;
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;
  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private menuTab = "officeProfile";
  private tabMap = new Map<string, boolean>();
  private officeMap = new Map<string, boolean>();

  private countryId: string;
  private isViewing: boolean;
  private agencyId: string;
  private systemId: string;
  private from: string;
  private agencyName: string;
  private agencyOverview: boolean;
  private officeTarget: string;
  private alerts: Observable<any>;
  private areaContent: any;
  private canCopy: boolean;

  constructor(private route: ActivatedRoute, private userService: UserService, private alertService: ActionsService, private commonService: CommonService, private router: Router) {
    this.initMainMenu();
    this.initOfficeSubMenu();
  }

  private initMainMenu() {
    this.tabMap.set("officeProfile", true);
    this.tabMap.set("risk", false);
    this.tabMap.set("preparedness-min", false);
    this.tabMap.set("preparedness-adv", false);
    this.tabMap.set("preparedness-budget", false);
    this.tabMap.set("plan", false);
  }

  private initOfficeSubMenu() {
    this.officeMap.set("programme", true);
    this.officeMap.set("officeCapacity", false);
    this.officeMap.set("partners", false);
    this.officeMap.set("equipment", false);
    this.officeMap.set("coordination", false);
    this.officeMap.set("stockCapacity", false);
    this.officeMap.set("documents", false);
    this.officeMap.set("contacts", false);
  }


  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
          this.getAgencyInfo(this.agencyId);
        }
        if (params["systemId"]) {
          this.systemId = params["systemId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["from"]) {
          this.from = params["from"];
          this.menuSelection(this.from);
        }
        if (params["officeTarget"]) {
          this.officeTarget = params["officeTarget"];
          this.handleOfficeSubMenu();
        }
        if (params["canCopy"]) {
          this.canCopy = params["canCopy"];
        }
        if (params["agencyOverview"]) {
          this.agencyOverview = params["agencyOverview"];
        }

        if (!this.countryId && !this.agencyId && !this.systemId && !this.isViewing) {
          this.router.navigateByUrl("/dashboard").then(() => {
            console.log("Invalid url parameters!!");
          }, error => {
            console.log(error.message);
          });
        }

        this.getAlerts();
        this.getAreaValues();

      });
  }

  private getAreaValues() {
    // get the country levels values
    this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(content => {
        this.areaContent = content;
      });
  }

  private getAlerts() {
    this.alerts = this.alertService.getAlerts(this.countryId)
      .map(alerts => {
        let alertList = [];
        alerts.forEach(alert => {
          if (alert.approvalStatus == AlertStatus.Approved) {
            alertList.push(alert);
          }
        });
        return alertList;
      });
  }

  private handleOfficeSubMenu() {
    this.officeMap.forEach((v, k) => {
      this.officeMap.set(k, k == this.officeTarget);
    });
  }

  private getAgencyInfo(agencyId: string) {
    this.userService.getAgencyDetail(agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agency => {
        this.agencyName = agency.name;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  menuSelection(menuName: string) {
    console.log(menuName);
    this.tabMap.forEach((v, k) => {
      this.tabMap.set(k, k == menuName);
    });
  }

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  getAreaNames(areas): string[] {
    return this.commonService.getAreaNameList(this.areaContent, areas);
  }

}
