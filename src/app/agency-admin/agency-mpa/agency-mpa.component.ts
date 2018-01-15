import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActionLevel, ActionType} from "../../utils/Enums";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {ModelDepartment} from "../../model/department.model";
import {UserService} from "../../services/user.service";

declare var jQuery: any;

@Component({
  selector: 'app-agency-mpa',
  templateUrl: './agency-mpa.component.html',
  styleUrls: ['./agency-mpa.component.css'],
})

export class AgencyMpaComponent implements OnInit, OnDestroy {

  private uid: string;
  private agencyId: string;
  private networkId: string;

  private departments: ModelDepartment[] = [];
  private DEPARTMENT_MAP: Map<string, string> = new Map<string, string>();
  private departmentSelected: string = "0";
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];
  private ActionLevel = ActionLevel;
  private actionLevelSelected = 0;

  private actions: MandatedListModel[] = [];

  private actionToDelete: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.agencyId = agencyId;
      this.getDepartments();
      this.getMandatedPrepActions();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected deleteAction(actionKey: string) {
    this.actionToDelete = actionKey;
    jQuery("#delete-action").modal("show");
  }

  protected deleteMandatedAction() {
    this.af.database.object(Constants.APP_STATUS + '/actionMandated/' + this.agencyId + '/' + this.actionToDelete).remove()
      .then(_ => {
          jQuery("#delete-action").modal("hide");
        }
      );
  }

  getMandatedPrepActions() {
    this.af.database.list(Constants.APP_STATUS + "/actionMandated/" + this.agencyId + "/", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.actions = [];
        snap.forEach((snapshot) => {
          let x: MandatedListModel = new MandatedListModel();
          x.id = snapshot.key;
          x.task = snapshot.val().task;
          x.level = snapshot.val().level;
          x.department = snapshot.val().department;
          this.actions.push(x);

        });
      });
  }

  protected closeModal() {
    jQuery("#delete-action").modal("hide");
  }

  protected editAction(actionKey) {
    this.router.navigate(["/agency-admin/agency-mpa/create-edit-mpa", {id: actionKey}]);
  }

  protected lookUpGenericActionsPressed() {
    this.router.navigate(['agency-admin/agency-mpa/add-generic-action']);
  }

  private getDepartments() {
    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments/", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        this.departments = [];
        this.DEPARTMENT_MAP.clear();
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.departments.push(x);
          this.DEPARTMENT_MAP.set(x.id, x.name);
        });
      });
  }
}

export class MandatedListModel {
  public id: string;
  public task: string;
  public level: number;
  public department: string;
}
