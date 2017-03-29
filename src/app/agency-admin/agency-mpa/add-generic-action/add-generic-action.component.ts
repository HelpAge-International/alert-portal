import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../../utils/Constants";
import {Department, ActionLevel, ActionType, GenericActionCategory} from "../../../utils/Enums";
import {Router} from "@angular/router";
import {RxHelper} from "../../../utils/RxHelper";

@Component({
  selector: 'app-add-generic-action',
  templateUrl: './add-generic-action.component.html',
  styleUrls: ['./add-generic-action.component.css']
})

export class AddGenericActionComponent implements OnInit, OnDestroy {

  private uid: string;
  private genericActions: FirebaseListObservable<any>;
  private departments: FirebaseListObservable<any>;
  private Department = Department;
  private ActionLevel = ActionLevel;
  GenericActionCategory = GenericActionCategory;
  private departmentSelected;
  private actionLevelSelected = 0;
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + Constants.SYSTEM_ADMIN_UID, {
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

  private getDepartments() {
    this.departments = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/departments");
  }
}
