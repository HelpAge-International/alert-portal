import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {MandatedPreparednessAction} from '../../../model/mandatedPA';
import {Constants} from '../../../utils/Constants';
import {ActionType, Department, ActionLevel} from '../../../utils/Enums';
import {RxHelper} from "../../../utils/RxHelper";

@Component({
  selector: 'app-create-edit-mpa',
  templateUrl: 'create-edit-mpa.component.html',
  styleUrls: ['create-edit-mpa.component.css']
})

export class CreateEditMpaComponent implements OnInit, OnDestroy {

  private uid: string;
  private path: string;
  private inactive: Boolean = true;
  private errorMessage: string = '';
  private pageTitle: string = 'AGENCY_MANDATED_PA.CREATE_NEW_MANDATED_PA';
  private buttonText: string = 'AGENCY_MANDATED_PA.SAVE_BUTTON_TEXT';
  private textArea: string;
  private isMpa: Boolean;
  private forEditing: Boolean = false;
  private idOfMpaToEdit: string;
  private subscriptions: RxHelper;
  departmentSelected: string;
  departments = Department;
  keys(): Array<string> {
    var keys = Object.keys(this.departments);
    return keys.slice(keys.length / 2);
  }

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.path = Constants.APP_STATUS + '/action/' + this.uid;
        console.log("uid: " + auth.uid);
      } else {
        console.log("Error occurred - User isn't logged in");
        this.navigateToLogin();
      }
    });

    let subscriptionEdit = this.route.params
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.forEditing = true;
          this.pageTitle = 'AGENCY_MANDATED_PA.EDIT_MANDATED_PA';
          this.buttonText = 'AGENCY_MANDATED_PA.EDIT_BUTTON_TEXT';
          this.loadMandatedPAInfo(params["id"]);
          this.idOfMpaToEdit = params["id"];
        }
      });
    this.subscriptions.add(subscription);
    this.subscriptions.add(subscriptionEdit);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  onSubmit() {
    if (this.validate()) {

      if (this.forEditing) {
        this.editMandatedPA();
      } else {
        this.addNewMandatedPA();
        this.inactive = true;
      }
    } else {
      this.inactive = false;
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private loadMandatedPAInfo(actionId: string) {

    let subscription = this.af.database.object(this.path + '/' + actionId).subscribe((action: MandatedPreparednessAction) => {
      this.textArea = action.task;
      console.log(action.preparednessLevel);
      console.log(ActionLevel.MPA);
      this.isMpa = action.preparednessLevel == ActionLevel.MPA ? true : false;
      this.departmentSelected = Department[action.department];
    });
    this.subscriptions.add(subscription);
  }

  private addNewMandatedPA() {

    var level = this.isMpa ? ActionLevel.MPA : ActionLevel.APA;
    console.log(level);

    var newAction: MandatedPreparednessAction = new MandatedPreparednessAction(this.textArea, ActionType.mandated, Department[this.departmentSelected], level);
    this.af.database.list(this.path).push(newAction)
      .then(_ => {
          console.log('New CHS action added');
          this.router.navigateByUrl("/agency-admin/agency-mpa");
        }
      );
  }

  private editMandatedPA() {
    // var editedAction: ChsMinPreparednessAction = new ChsMinPreparednessAction(this.textArea, ActionType.chs);
    // this.af.database.object(this.path + "/" + this.idOfChsActionToEdit).set(editedAction).then(_ => {
    // console.log('CHS action updated');
    // this.router.navigateByUrl("/system-admin/min-prep");
    // }
    // );
  }

  mpaSelected() {
    this.isMpa = true;
  }

  apaSelected() {
    this.isMpa = false;
  }

  /**
   * Returns false and specific error messages-
   * if no input is entered
   * @returns {boolean}
   */
  private validate() {

    if (!Boolean(this.textArea)) {
      this.errorMessage = "AGENCY_MANDATED_PA.NO_CONTENT_ERROR";
      return false;
    } else if (!Boolean(this.departmentSelected)) {
      this.errorMessage = "AGENCY_MANDATED_PA.NO_DEPARTMENT_ERROR";
      return false;
    }
    return true;
  }
}
