import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {ChsMinPreparednessAction} from '../../../model/chsMinPreparednessAction';
import {Constants} from '../../../utils/Constants';
import {ActionType} from "../../../utils/Enums";

@Component({
  selector: 'app-create-action',
  templateUrl: './create-action.component.html',
  styleUrls: ['./create-action.component.css']
})
export class CreateActionComponent implements OnInit {

  private inactive: Boolean = true;
  private errorMessage: any;
  private textArea: string;
  private newAction: ChsMinPreparednessAction;
  private path: string = Constants.APP_STATUS + "/action/" + Constants.uid;

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
  }

  saveNewAction() {
    if (this.validate()) {

      this.newAction = new ChsMinPreparednessAction(this.textArea, ActionType.chs);
      this.af.database.list(this.path).push(this.newAction)
        .then(_ => {
          console.log('New CHS action added');
          this.router.navigateByUrl("/system-admin/min-prep");
        }
    );
      this.inactive = true;

    } else {
      this.inactive = false;
    }
  }

  /**
   * Returns false and specific error messages-
   * if no input is entered
   * @returns {boolean}
   */
  validate() {

    if (!Boolean(this.textArea)) {
      this.errorMessage = "Please insert the action to create a new CHS minimum preparedness action";
      return false;
    }
    return true;
  }

}
