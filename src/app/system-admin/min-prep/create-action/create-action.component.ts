import { Component, OnInit } from '@angular/core';
import { AngularFire } from "angularfire2";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ChsMinPreparednessAction } from '../../../model/chsMinPreparednessAction';
import { Constants } from '../../../utils/Constants';
import { ActionType } from "../../../utils/Enums";

@Component({
  selector: 'app-create-action',
  templateUrl: './create-action.component.html',
  styleUrls: ['./create-action.component.css']
})
export class CreateActionComponent implements OnInit {

  private inactive: Boolean = true;
  private errorMessage: any;
  private pageTitle: string = 'Create new CHS minimum preparedness action';
  private buttonText: string = 'Save new action';
  private textArea: string;
  private path: string = Constants.APP_STATUS + "/action/" + Constants.uid;
  private forEditing = false;
  private idOfChsActionToEdit: string;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.forEditing = true;
          this.pageTitle = "Edit CHS minimum preparedness action";
          this.buttonText = "Edit action";
          this.loadCHSActionInfo(params["id"]);
          this.idOfChsActionToEdit = params["id"];
        }
      });
  }

  private loadCHSActionInfo(actionId: string) {
    console.log(actionId);
    console.log(this.path+actionId);
    this.af.database.object(this.path+ '/' + actionId).subscribe((action:ChsMinPreparednessAction) => {
      this.textArea = action.task;
    });
  }

  onSubmit() {

    if (this.validate()) {

      if (this.forEditing) {
        //TODO Update Info
        this.editChsAction();
      } else {
        this.addNewChsAction();
        this.inactive = true;
      }
    } else {
      this.inactive = false;
    }
  }

  private addNewChsAction() {

    var newAction: ChsMinPreparednessAction = new ChsMinPreparednessAction(this.textArea, ActionType.chs);
    this.af.database.list(this.path).push(newAction)
      .then(_ => {
          console.log('New CHS action added');
          this.router.navigateByUrl("/system-admin/min-prep");
        }
      );
  }

  private editChsAction() {
    var editedAction: ChsMinPreparednessAction = new ChsMinPreparednessAction(this.textArea, ActionType.chs);
    this.af.database.object(this.path+ "/" + this.idOfChsActionToEdit).set(editedAction).then(_ => {
        console.log('CHS action updated');
        this.router.navigateByUrl("/system-admin/min-prep");
      }
    );
  }

  /**
   * Returns false and specific error messages-
   * if no input is entered
   * @returns {boolean}
   */
  private validate() {

    if (!Boolean(this.textArea)) {
      this.errorMessage = "Please insert the action to create a new CHS minimum preparedness action";
      return false;
    }
    return true;
  }

}
