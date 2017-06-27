import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {GenericMpaOrApaAction} from '../../../model/genericMPAAPA';
import {Constants} from "../../../utils/Constants";
import {ActionType, ActionLevel, GenericActionCategory} from "../../../utils/Enums";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";

@Component({
  selector: 'app-create-mpa-action',
  templateUrl: './create-mpa-action.component.html',
  styleUrls: ['./create-mpa-action.component.css']
})

export class CreateMpaActionComponent implements OnInit,OnDestroy {

  private editActionId: string = "";
  private systemUid: string = "";

  private editInitialDisable: boolean = false;
  private inactive: Boolean = true;
  private errorMessage: any;
  private alerts = {};
  private pageTitle: string = 'SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CREATE_NEW_GENERIC_MPA';
  private buttonText: string = 'SYSTEM_ADMIN.ACTIONS.SAVE_BUTTON_TEXT';
  private textArea: string;

  private isMpa: boolean = true;

  private forEditing: Boolean = false;
  private categorySelected: string;
  private Category = GenericActionCategory;
  private categoriesList = [GenericActionCategory.Category1, GenericActionCategory.Category2, GenericActionCategory.Category3,
    GenericActionCategory.Category4, GenericActionCategory.Category5, GenericActionCategory.Category6, GenericActionCategory.Category7,
    GenericActionCategory.Category8, GenericActionCategory.Category9, GenericActionCategory.Category10];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["id"]) {
          this.pageTitle = 'SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.EDIT_MPA_APA';
          this.buttonText = 'SYSTEM_ADMIN.ACTIONS.EDIT_BUTTON_TEXT';
          this.editActionId = params["id"];
          this.editInitialDisable = true;
        }
        this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
          this.systemUid = user.uid;
          if (this.editActionId !== "") {
            this.initialEditLoad();
          }
        });
      });
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  onSubmit() {
    if (this.validate()) {
      this.updateGenericAction();
    } else {
      this.showAlert();
    }
  }

  private initialEditLoad() {
    this.af.database.object(Constants.APP_STATUS + "/actionGeneric/" + this.systemUid + "/" + this.editActionId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        console.log(snap.val());
        if (snap.val() != null) {
          this.textArea = snap.val().task;
          this.isMpa = snap.val().level == ActionLevel.MPA;
          this.categorySelected = GenericActionCategory[snap.val().category];
        }
        this.editInitialDisable = false;
      })
  }

  protected mpaSelected() {
    this.isMpa = true;
  }

  protected apaSelected() {
    this.isMpa = false;
  }

  protected updateGenericAction() {
    let level = this.isMpa ? ActionLevel.MPA : ActionLevel.APA;
    if (this.editActionId == "") {
      // New
      let valueToPush = {
        task: this.textArea,
        type: ActionType.mandated,
        level: level,
        category: GenericActionCategory[this.categorySelected],
        createdAt: new Date().getTime()
      };
      this.af.database.list(Constants.APP_STATUS + "/actionGeneric/" + this.systemUid).push(valueToPush).then(_ => {
        this.router.navigateByUrl("/system-admin/mpa");
      });
    }
    else {
      // Update
      let valueToUpdate = {
        task: this.textArea,
        type: ActionType.mandated,
        level: level,
        category: GenericActionCategory[this.categorySelected],
        createdAt: new Date().getTime()
      };
      this.af.database.object(Constants.APP_STATUS + "/actionGeneric/" + this.systemUid + "/" + this.editActionId).update(valueToUpdate).then(_ => {
        this.router.navigateByUrl("/system-admin/mpa");
      });
    }
  }

  private showAlert() {
    this.inactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.inactive = true;
    });
  }

  /**
   * Returns false and specific error messages-
   * if no input is entered
   * if no category is selected
   * @returns {boolean}
   */
  private validate() {

    if (!(this.textArea)) {
      this.alerts[this.textArea] = true;
      this.errorMessage = "SYSTEM_ADMIN.ACTIONS.NO_CONTENT_ERROR";
      return false;
    } else if (!(this.categorySelected)) {
      this.alerts[this.categorySelected] = true;
      this.errorMessage = "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.NO_CATEGORY_ERROR";
      return false;
    }
    return true;
  }

}
