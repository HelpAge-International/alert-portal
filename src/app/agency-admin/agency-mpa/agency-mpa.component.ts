import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActionLevel, ActionType} from "../../utils/Enums";
import {Router} from "@angular/router";
import {DialogService} from "../../dialog/dialog.service";
import {RxHelper} from "../../utils/RxHelper";
import {Observable} from "rxjs";

@Component({
  selector: 'app-agency-mpa',
  templateUrl: './agency-mpa.component.html',
  styleUrls: ['./agency-mpa.component.css'],
})

// TODO - Double filter
export class AgencyMpaComponent implements OnInit, OnDestroy {

  private uid: string;
  private actions: Observable<any>;
  private departments: Observable<any>;
  private ActionLevel = ActionLevel;
  private departmentSelected;
  private actionLevelSelected = 0;
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router, private dialogService: DialogService) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
          query: {
            orderByChild: "type",
            equalTo: ActionType.mandated
          }
        });
        this.getDepartments();
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  checkActionLevelFilter() {
    console.log("Action level selected - " + this.actionLevelSelected);
  }

  checkDepartmentFilter() {
    console.log("Department selected - " + this.departmentSelected);
  }

  deleteAction(actionKey) {
    let subscription = this.dialogService.createDialog('DELETE_ACTION_DIALOG.TITLE', 'DELETE_ACTION_DIALOG.CONTENT').subscribe(result => {
      if (result) {
        console.log("Delete button pressed");
        let actionPath: string = Constants.APP_STATUS + '/action/' + this.uid + '/' + actionKey;
        console.log(actionPath);
        this.af.database.object(actionPath).remove()
          .then(_ =>
            console.log("MPA deleted")
          );
      }
    });
    this.subscriptions.add(subscription);
  }

  editAction(actionKey) {
    console.log("Navigate to edit");
    this.router.navigate(["/agency-admin/agency-mpa/create-edit-mpa", {id: actionKey}]);
  }

  lookUpGenericActionsPressed() {
    console.log('Lookup generic actions pressed');
    this.router.navigate(['agency-admin/agency-mpa/add-generic-action']);
  }

  // TODO - Change checking the 'All departments' string to increase efficiency
  filter() {
    console.log("Selected Department ---- " + this.departmentSelected);

    if (this.actionLevelSelected == ActionLevel.ALL && this.departmentSelected == 'All departments') {
      //no filter. show all
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      });
    } else if (this.actionLevelSelected != ActionLevel.ALL && this.departmentSelected == 'All departments') {
      //filter only with mpa
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
    } else if (this.actionLevelSelected == ActionLevel.ALL && this.departmentSelected != 'All departments') {
      //filter only with apa
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

    this.departments = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/departments")
      .map(list => {
        let tempList = [];
        for (let item of list) {
          tempList.push(item.$key);
        }
        return tempList;
      });
  }

}
