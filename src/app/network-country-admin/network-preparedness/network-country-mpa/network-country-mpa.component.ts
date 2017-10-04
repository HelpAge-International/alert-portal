import {Component, Inject, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Constants} from "../../../utils/Constants";
import {
  ActionLevel, ActionStatusMin, ActionType, AlertMessageType, ApprovalStatus,
  FileExtensionsEnding, Privacy, UserType
} from "../../../utils/Enums";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {
  AgencyModulesEnabled, CountryPermissionsMatrix,
  PageControlService
} from "../../../services/pagecontrol.service";
import {AngularFire, FirebaseApp} from "angularfire2";
import {NetworkService} from "../../../services/network.service";
import {NotificationService} from "../../../services/notification.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {CommonUtils} from "../../../utils/CommonUtils";
import {ModelDepartment} from "../../../model/department.model";
import {PrepActionService, PreparednessUser} from "../../../services/prepactions.service";
import {ModelAgencyPrivacy} from "../../../model/agency-privacy.model";

@Component({
  selector: 'app-network-country-mpa',
  templateUrl: './network-country-mpa.component.html',
  styleUrls: ['./network-country-mpa.component.css']
})
export class NetworkCountryMpaComponent implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;
  private ApprovalStatus = ApprovalStatus;


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;
  private agencyCountryMap: Map<string, string>;
  private showLoader: boolean;
  private uid: string;


  //copy over from response plan
  // IDs
  private userType: UserType;
  private UserType = UserType;
  private countryId: string;
  private agencyId: string;
  private systemAdminId: string;
  public myFirstName: string;
  public myLastName: string;

  // Filters
  private filterStatus: number = -1;
  private filterDepartment: string = "-1";
  private filterType: number = -1;
  private filterAssigned: string = "-1";
  private filerNetworkAgency: string = "-1";

  // Data for the actions
  // --- Declared because we're missing out "inactive" in this page
  private ACTION_STATUS = ["GLOBAL.ACTION_STATUS.EXPIRED", "GLOBAL.ACTION_STATUS.IN_PROGRESS", "GLOBAL.ACTION_STATUS.COMPLETED", "GLOBAL.ACTION_STATUS.ARCHIVED"];
  private DEPARTMENTS: ModelDepartment[] = [];
  private DEPARTMENT_MAP: Map<string, string> = new Map<string, string>();
  private ACTION_TYPE = Constants.ACTION_TYPE;
  private ASSIGNED_TOO: PreparednessUser[] = [];
  private CURRENT_USERS: Map<string, PreparednessUser> = new Map<string, PreparednessUser>();
  private currentlyAssignedToo: PreparednessUser;
  private actionLevelEnum = ActionLevel;

  private allUnassigned: boolean = true;
  private allArchived: boolean = false;
  // --- Declared because we're missing out "inactive" in this page
  private ActionStatus = ActionStatusMin;
  private ActionType = ActionType;

  // Page admin
  private isViewing: boolean;
  private isSameAgency: boolean = false;
  protected countrySelected = false;
  protected agencySelected = false;
  private firebase: any;
  private documents: any[] = [];
  private docsSize: number;
  private documentActionId: string = "";
  private fileSize: number; // Always in Bytes
  private fileExtensions: FileExtensionsEnding[] = FileExtensionsEnding.list();
  public userTypes = UserType;
  private Privacy = Privacy;

  // Used to run the initAlerts method after all actions have been returned
  private fbLocationCalls = 3;
  private now: number = new Date().getTime();

  // Assigning action
  private assignActionId: string = "0";
  private assignActionCategoryUid: string = "0";
  private assignActionAsignee: string = "0";
  private assignActionTask: string = "";

  // Module permissions settings

  private modulesAreEnabled: AgencyModulesEnabled = new AgencyModulesEnabled();
  protected prepActionService: PrepActionService = new PrepActionService();

  private privacy: ModelAgencyPrivacy;
  private userAgencyId: string;


  constructor(private pageControl: PageControlService,
              @Inject(FirebaseApp) firebaseApp: any,
              private af: AngularFire,
              private networkService: NetworkService,
              private notificationService: NotificationService,
              private userService: UserService,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private router: Router) {
    this.firebase = firebaseApp;
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .flatMap(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          return this.networkService.getNetworkResponsePlanClockSettingsDuration(this.networkId);
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(duration => {
          this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(map => {
              this.showLoader = false;
              this.agencyCountryMap = map;
              CommonUtils.convertMapToKeysInArray(this.agencyCountryMap).forEach(agencyId => {
                this.userService.getAgencyModel(agencyId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(model => {
                    console.log(model);
                  });
              });
            });
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
