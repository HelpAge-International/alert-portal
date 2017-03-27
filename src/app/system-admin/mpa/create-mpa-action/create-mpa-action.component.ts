import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {GenericMpaOrApaAction} from '../../../model/genericMPAAPA';
import {Constants} from "../../../utils/Constants";
import {ActionType, ActionLevel, GenericActionCategory} from "../../../utils/Enums";
import {RxHelper} from "../../../utils/RxHelper";
import {Observable} from "rxjs";

@Component({
  selector: 'app-create-mpa-action',
  templateUrl: './create-mpa-action.component.html',
  styleUrls: ['./create-mpa-action.component.css']
})

export class CreateMpaActionComponent implements OnInit,OnDestroy {

  private inactive: Boolean = true;
  private errorMessage: any;
  private pageTitle: string = 'SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CREATE_NEW_GENERIC_MPA';
  private buttonText: string = 'SYSTEM_ADMIN.ACTIONS.SAVE_BUTTON_TEXT';
  private textArea: string;
  private path: string;
  private isMpa: boolean = true;
  private forEditing: Boolean = false;
  private idOfGenericActionToEdit: string;
  private subscriptions: RxHelper;
  private categorySelected: string;
  private Category = GenericActionCategory;
  private categoriesList = [GenericActionCategory.Category0, GenericActionCategory.Category1, GenericActionCategory.Category2,
    GenericActionCategory.Category3, GenericActionCategory.Category4, GenericActionCategory.Category5, GenericActionCategory.Category6,
    GenericActionCategory.Category7, GenericActionCategory.Category8, GenericActionCategory.Category9];

  // categories = GenericActionCategory;
  // categoryKeys(): Array<string> {
  //   var keys = Object.keys(this.categories);
  //   return keys.slice(keys.length / 2);
  // }

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
          this.pageTitle = 'SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.EDIT_MPA_APA';
          this.buttonText = 'SYSTEM_ADMIN.ACTIONS.EDIT_BUTTON_TEXT';
          this.loadGenericActionInfo(params["id"]);
          this.idOfGenericActionToEdit = params["id"];
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
        this.editGenericAction();
      } else {
        this.addNewGenericAction();
        this.inactive = true;
      }
    } else {
      this.inactive = false;
      Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        this.inactive = true;
      })
    }
  }

  mpaSelected() {
    this.isMpa = true;
  }

  apaSelected() {
    this.isMpa = false;
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private loadGenericActionInfo(actionId: string) {
    let subscription = this.af.database.object(this.path + '/' + actionId).subscribe((action: GenericMpaOrApaAction) => {
      this.textArea = action.task;
      this.isMpa = action.level == ActionLevel.MPA ? true : false;
      this.categorySelected = GenericActionCategory[action.category];
    });
    this.subscriptions.add(subscription);
  }

  private addNewGenericAction() {

    let level = this.isMpa ? ActionLevel.MPA : ActionLevel.APA;

    let newAction: GenericMpaOrApaAction = new GenericMpaOrApaAction(this.textArea, ActionType.mandated, level, GenericActionCategory[this.categorySelected]);

    this.af.database.list(this.path).push(newAction)
      .then(_ => {
          console.log('New Generic action added');
          this.router.navigateByUrl("/system-admin/mpa");
        }
      );
  }

  private editGenericAction() {

    let level = this.isMpa ? ActionLevel.MPA : ActionLevel.APA;
    let editedAction: GenericMpaOrApaAction = new GenericMpaOrApaAction(this.textArea, ActionType.mandated, level, GenericActionCategory[this.categorySelected]);

    this.af.database.object(this.path + "/" + this.idOfGenericActionToEdit).set(editedAction).then(_ => {
        console.log('Generic action updated');
        this.router.navigateByUrl("/system-admin/mpa");
      }
    );
  }

  /**
   * Returns false and specific error messages-
   * if no input is entered
   * if no category is selected
   * @returns {boolean}
   */
  private validate() {

    if (!Boolean(this.textArea)) {
      this.errorMessage = "SYSTEM_ADMIN.ACTIONS.NO_CONTENT_ERROR";
      return false;
    } else if (!Boolean(this.categorySelected)) {
      this.errorMessage = "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.NO_CATEGORY_ERROR";
      return false;
    }
    return true;
  }

}
