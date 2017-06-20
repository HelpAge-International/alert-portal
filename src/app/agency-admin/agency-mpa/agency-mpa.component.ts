import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActionLevel, ActionType} from "../../utils/Enums";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
declare var jQuery: any;

@Component({
  selector: 'app-agency-mpa',
  templateUrl: './agency-mpa.component.html',
  styleUrls: ['./agency-mpa.component.css'],
})

export class AgencyMpaComponent implements OnInit, OnDestroy {

  private uid: string;
  private isFiltered: boolean = false;
  private actions: Observable<any>;
  private ActionLevel = ActionLevel;
  private departments: any[] = [];
  private All_Department: string = "allDepartments"; // <option value="allDepartments">
  private departmentSelected: string = this.All_Department;
  private actionLevelSelected = 0;
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];
  private actionToDelete;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
          query: {
            orderByChild: "type",
            equalTo: ActionType.mandated
          }
        });
        this.getDepartments();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  deleteAction(actionKey) {
    this.actionToDelete = actionKey;
    jQuery("#delete-action").modal("show");
  }

  deleteMandatedAction() {
    console.log("Delete button pressed");
    let actionPath: string = Constants.APP_STATUS + '/action/' + this.uid + '/' + this.actionToDelete;
    this.af.database.object(actionPath).remove()
      .then(_ => {
          console.log("Mandated preparedness action deleted");
          jQuery("#delete-action").modal("hide");
        }
      );
  }

  closeModal() {
    jQuery("#delete-action").modal("hide");
  }

  editAction(actionKey) {
    this.router.navigate(["/agency-admin/agency-mpa/create-edit-mpa", {id: actionKey}]);
  }

  lookUpGenericActionsPressed() {
    this.router.navigate(['agency-admin/agency-mpa/add-generic-action']);
  }

  filter() {
    console.log("Selected Department ---- " + this.departmentSelected);

    if (this.actionLevelSelected == ActionLevel.ALL && this.departmentSelected == this.All_Department) {
      //no filter. show all
      this.isFiltered = false;
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      });
    } else if (this.actionLevelSelected != ActionLevel.ALL && this.departmentSelected == this.All_Department) {
      //filter only with mpa
      this.isFiltered = true;
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.actionLevelSelected) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    } else if (this.actionLevelSelected == ActionLevel.ALL && this.departmentSelected != this.All_Department) {
      //filter only with apa
      this.isFiltered = true;
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.department == this.departmentSelected) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    } else {
      // filter both action level and category
      this.isFiltered = true;
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.actionLevelSelected) {
              tempList.push(item);
            }
          }
          return tempList;
        })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.department == this.departmentSelected) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    }
  }

  private getDepartments() {

    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/departments")
      .map(departmentList => {
        let departments = [];
        departmentList.forEach(x => {
          departments.push(x.$key);
        });
        return departments;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(x => {
        this.departments = x;
      });
  }

}
