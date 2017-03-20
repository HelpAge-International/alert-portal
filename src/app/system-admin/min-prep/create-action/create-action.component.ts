import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {ChsMinPreparednessAction} from '../../../model/chsMinPreparednessAction';
import {Constants} from '../../../utils/Constants';
import {ActionType} from '../../../utils/Enums';
import {RxHelper} from "../../../utils/RxHelper";

@Component({
  selector: 'app-create-action',
  templateUrl: './create-action.component.html',
  styleUrls: ['./create-action.component.css']
})

export class CreateActionComponent implements OnInit, OnDestroy {

  private inactive: Boolean = true;
  private errorMessage: any;
  private pageTitle: string = 'CHS_MPA.CREATE_NEW_CHS_MPA';
  private buttonText: string = 'CHS_MPA.SAVE_BUTTON_TEXT';
  private textArea: string;
  private path: string;
  private forEditing: Boolean = false;
  private idOfChsActionToEdit: string;
  private subscriptions: RxHelper;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
    this.subscriptions = new RxHelper;
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.path = Constants.APP_STATUS + "/action/" + auth.uid;
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
          this.pageTitle = 'CHS_MPA.EDIT_CHS_MPA';
          this.buttonText = 'CHS_MPA.EDIT_BUTTON_TEXT';
          this.loadCHSActionInfo(params["id"]);
          this.idOfChsActionToEdit = params["id"];
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
        this.editChsAction();
      } else {
        this.addNewChsAction();
        this.inactive = true;
      }
    } else {
      this.inactive = false;
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private loadCHSActionInfo(actionId: string) {
    console.log(actionId);
    console.log(this.path + actionId);
    let subscription = this.af.database.object(this.path + '/' + actionId).subscribe((action: ChsMinPreparednessAction) => {
      this.textArea = action.task;
    });
    this.subscriptions.add(subscription);
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
      this.errorMessage = "CHS_MPA.NO_CONTENT_ERROR";
      return false;
    }
    return true;
  }

}
