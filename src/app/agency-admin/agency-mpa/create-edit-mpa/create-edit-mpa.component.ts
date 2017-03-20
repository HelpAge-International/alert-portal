import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {ChsMinPreparednessAction} from '../../../model/chsMinPreparednessAction';
import {Constants} from '../../../utils/Constants';
import {ActionType} from '../../../utils/Enums';
import {RxHelper} from "../../../utils/RxHelper";

@Component({
  selector: 'app-create-edit-mpa',
  templateUrl: 'create-edit-mpa.component.html',
  styleUrls: ['create-edit-mpa.component.css']
})
export class CreateEditMpaComponent implements OnInit, OnDestroy {

  private inactive: Boolean = true;
  private errorMessage: string = '';
  private pageTitle: string = 'AGENCY_MANDATED_PA.CREATE_NEW_MANDATED_PA';
  private buttonText: string = 'AGENCY_MANDATED_PA.EDIT_BUTTON_TEXT';
  private textArea: string;
  private forEditing: Boolean = false;
  private idOfMpaToEdit: string;
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private loadMandatedPAInfo(actionId: string) {
    console.log(actionId);
    console.log(this.path + actionId);
    let subscription = this.af.database.object(this.path + '/' + actionId).subscribe((action: ChsMinPreparednessAction) => {
      this.textArea = action.task;
    });
    this.subscriptions.add(subscription);
  }

  private addNewMandatedPA() {

    var newAction: ChsMinPreparednessAction = new ChsMinPreparednessAction(this.textArea, ActionType.chs);
    this.af.database.list(this.path).push(newAction)
      .then(_ => {
          console.log('New CHS action added');
          this.router.navigateByUrl("/system-admin/min-prep");
        }
      );
  }

  private editMandatedPA() {
    var editedAction: ChsMinPreparednessAction = new ChsMinPreparednessAction(this.textArea, ActionType.chs);
    this.af.database.object(this.path + "/" + this.idOfChsActionToEdit).set(editedAction).then(_ => {
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
      this.errorMessage = "AGENCY_MANDATED_PA.NO_CONTENT_ERROR";
      return false;
    }
    return true;
  }
}
