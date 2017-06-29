import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {
  ActionLevel, ActionType, AlertMessageType, DurationType, HazardCategory,
  HazardScenario, UserType
} from "../../utils/Enums";
import {Action} from "../../model/action";
import {ModelUserPublic} from "../../model/user-public.model";
import {LocalStorageService} from 'angular-2-local-storage';
import {AlertMessageModel} from '../../model/alert-message.model';
import {AgencyModulesEnabled, PageControlService} from "../../services/pagecontrol.service";
import {Observable, Subject} from "rxjs";
import {HazardImages} from "../../utils/HazardImages";
import {Location} from "@angular/common";
import {PrepActionService} from "../../services/prepactions.service";
import {ModelDepartment} from "../../model/department.model";
import {UserService} from "../../services/user.service";
declare var jQuery: any;

@Component({
  selector: 'app-preparedness',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditPreparednessComponent implements OnInit, OnDestroy {

  private alertMessageType = AlertMessageType;
  private alertMessage: AlertMessageModel = null;

  private uid: string;
  private userType: UserType;
  private agencyId: string;

  private actionId: string = null;

  private action: CreateEditPrepActionHolder = new CreateEditPrepActionHolder();
  private editDisableLoading: boolean = false;
  private alerts = {};
  private errorMessage: string = "";

  private actionSelected: any = {};
  private copyActionData: any = {};

  private departments: ModelDepartment[] = [];
  private successMessage: string = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";

  private actionType = ActionType;
  private actionLevel = Constants.ACTION_LEVEL;
  private actionLevelList: number[] = [ActionLevel.MPA, ActionLevel.APA];

  private hazardCategory = Constants.HAZARD_SCENARIOS;
  private hazardCategoryList = [];
  private hazardCategoryIconClass = Constants.HAZARD_CATEGORY_ICON_CLASS;

  private durationType = Constants.DURATION_TYPE;
  private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moduleAccess: AgencyModulesEnabled = new AgencyModulesEnabled();

  constructor(private pageControl: PageControlService, private _location: Location, private route: ActivatedRoute,
              private af: AngularFire, private router: Router, private storage: LocalStorageService,
              protected prepActionService: PrepActionService, private userService: UserService) {
    /* if selected generic action */
    this.actionSelected = this.storage.get('selectedAction');
    if (this.actionSelected && typeof (this.actionSelected) != 'undefined') {
      this.action.task = (typeof (this.actionSelected.task) != 'undefined') ? this.actionSelected.task : '';
      this.action.level = (typeof (this.actionSelected.level) != 'undefined') ? parseInt(this.actionSelected.level) : 0;
      this.action.requireDoc = (typeof (this.actionSelected.requireDoc) != 'undefined') ? this.actionSelected.requireDoc : 0;
      // TODO: Check if this is being used anywhere else and potentially remove it?
      // TODO: This causes a bug with going back and forth on the page
      this.storage.remove('selectedAction');
      this.actionSelected = {};
    }

    /* if copy action */
    this.copyActionData = this.storage.get('copyActionData');
    if (this.copyActionData && typeof (this.copyActionData) != 'undefined') {
      this.action = this.copyActionData;
      this.action.level = this.copyActionData.level;
      this.action.dueDate = this.copyActionData.dueDate;
      // TODO: Check if this is being used anywhere else and potentially remove it?
      // TODO: This causes a bug with going back and forth on the page
      this.storage.remove('copyActionData');
      this.copyActionData = {};
    }
  }

  ngOnInit() {
    this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params: Params) => {
      if (params['id']) {
        this.actionId = params['id'];
        this.editDisableLoading = true;
      }
      this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.userType = userType;

        PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, user.uid, Constants.USER_PATHS[userType], (isEnabled) => {
          this.moduleAccess = isEnabled;
        });

        if (this.actionId != null) {
          this.initFromExistingActionId();
        }
        this.userService.getAgencyId(Constants.USER_PATHS[userType], this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe((agencyId) => {
            this.agencyId = agencyId;
            this.getDepartments();
          });
      });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Initialisation
   */
  public initFromExistingActionId() {
    this.prepActionService.initOneAction(this.ngUnsubscribe, this.uid, this.userType, this.actionId, (action) => {
      this.action.id = action.id;
      this.action.type = action.type;
      this.action.level = action.level;
      if (action.type == ActionType.chs) {
        this.action.task = action.task;
      }
      else if (action.type == ActionType.mandated) {
        this.action.task = action.task;
        this.action.department = action.department;
      }
      else {
        this.action.task = action.task;
        this.action.requireDoc = action.requireDoc;
        this.action.dueDate = action.dueDate;
        this.action.hazards = action.assignedHazards;
        this.action.asignee = action.asignee;
        this.action.department = action.department;
        this.action.budget = action.budget;
        this.action.isAllHazards = action.assignedHazards.length == 0;
      }
      this.editDisableLoading = false;
    });
  }


  /**
   * Selecting the date on the material date picker
   */
  public selectDate(date: any) {
    var dueDateTimestamp = this.convertDateToTimestamp(date);
    return true;
  }

  private convertDateToTimestamp(date: any) {
    return date.getTime();
  }

  private convertTimestampToDate(timestamp: number) {
    return new Date(timestamp);
  }

  /**
   * Initialising departments
   */
  private getDepartments() {
    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments/", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.departments = [];
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.departments.push(x);
        });
      });
  }





  public getHazardImage(key) {
    return HazardImages.init().getCSS(key);
  }

  public validate() {
    // Do all the validation here!
    if (!this.action.task) {
      this.alerts[this.action.task] = true;
      this.errorMessage = "LOGIN.NO_DATA_ERROR";
      return false;
    }
  }
}

export class CreateEditPrepActionHolder {
  public id: string;
  public task: string;
  public level: number;
  public budget: number;
  public isAllHazards: boolean;
  public hazards: HazardScenario[];
  public dueDate: number;
  public asignee: string;
  public department: string;
  public requireDoc: boolean;
  public type: number;

  constructor() {
    this.type = ActionType.mandated;
  }
}
