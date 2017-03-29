import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Department, ActionLevel, ActionType, GenericActionCategory} from "../../../utils/Enums";
import {MandatedPreparednessAction} from "../../../model/mandatedPA";
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";

@Component({
  selector: 'app-add-generic-action',
  templateUrl: './add-generic-action.component.html',
  styleUrls: ['./add-generic-action.component.css']
})

export class AddGenericActionComponent implements OnInit, OnDestroy {

  private uid: string;
  private genericActions: Observable<any>;
  private departments: FirebaseListObservable<any>;
  private Department = Department;
  private ActionLevel = ActionLevel;
  private GenericActionCategory = GenericActionCategory;
  private actionSelected: boolean;
  private departmentSelected;
  private actionLevelSelected = 0;
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];
  private selectedActions: MandatedPreparednessAction[] = [];
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
    this.selectedActions = [];
  }

  filterByLevel() {

    console.log("Action level selected - " + this.actionLevelSelected);
    if (this.actionLevelSelected == ActionLevel.ALL) {
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + Constants.SYSTEM_ADMIN_UID, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      });
    } else {
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + Constants.SYSTEM_ADMIN_UID, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.actionLevelSelected) {
              console.log(JSON.stringify(item));
              tempList.push(item);
            }
          }
          return tempList;
        });
    }
  }

  updateSelectedActions(genericAction) {

    let newMandatePA: MandatedPreparednessAction = new MandatedPreparednessAction(genericAction.task, ActionType.mandated, this.departmentSelected, genericAction.level);

    console.log('actionSelected ---- ' + this.actionSelected);

    if (this.actionSelected) {

      var index = this.selectedActions.indexOf(newMandatePA);
      console.log('index ----' + index);

      if (index < 0) {
        this.selectedActions.push(newMandatePA);
        console.log("Adding");
      } else {
        this.selectedActions[index] = newMandatePA;
        console.log("Not added coz index is ---- " + index);
      }

    } else {

      var index = this.selectedActions.indexOf(newMandatePA);

      if (index > -1) {
        this.selectedActions.splice(index, 1);
      }
    }
    console.log('selectedActionsCount ---- ' + this.selectedActions.length);
    console.log('selectedActions ---- ' + this.selectedActions);

    this.actionSelected = null;
  }

  private getDepartments() {
    this.departments = this.af.database.list(Constants.APP_STATUS + "/agency/" + this.uid + "/departments");
  }
}
