import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {ChsMinPreparednessAction} from '../../../model/chsMinPreparednessAction';
import {Constants} from '../../../utils/Constants';
import {ActionType, ActionLevel} from '../../../utils/Enums';
import {Observable, Subject} from "rxjs";
import {AgencyModulesEnabled, PageControlService} from "../../../services/pagecontrol.service";

@Component({
  selector: 'app-create-action',
  templateUrl: './create-action.component.html',
  styleUrls: ['./create-action.component.css']
})

export class CreateActionComponent implements OnInit, OnDestroy {

  private chsUid: string = "";
  private editInitialDisable: boolean = false;

  private inactive: boolean = true;
  private errorMessage: any;
  private alerts = {};
  private pageTitle: string = 'SYSTEM_ADMIN.ACTIONS.CHS_MPA.CHS_TITLE_TEXT';
  private buttonText: string = 'PREPAREDNESS.SAVE_NEW_ACTION';

  private textArea: string = "";
  private systemUid: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["id"]) {
          // EDIT MODE
          this.pageTitle = 'SYSTEM_ADMIN.ACTIONS.EDIT_CHS_ACTION';
          this.buttonText = 'GLOBAL.SAVE_CHANGES';
          this.chsUid = params["id"];
          this.editInitialDisable = true;
        }
        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.systemUid = systemId;
          if (this.chsUid !== "") {
            this.initialEditLoad();
          }
        });
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    if (this.validate()) {
      this.updateCHSAction();
    } else {
      this.showAlert();
    }
  }

  private initialEditLoad() {
    this.af.database.object(Constants.APP_STATUS + "/actionCHS/" + this.systemUid + "/" + this.chsUid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          this.textArea = snap.val().task;
        }
        this.editInitialDisable = false;
      })
  }

  private updateCHSAction() {
    if (this.systemUid != null) {
      if (this.chsUid !== "") {
        let updateObj = {
          task: this.textArea,
          type: ActionType.chs,
          level: ActionLevel.MPA
        };
        this.af.database.object(Constants.APP_STATUS + "/actionCHS/" + this.systemUid + "/" + this.chsUid).update(updateObj).then(_ => {
          this.router.navigateByUrl("/system-admin/min-prep");
        });
      }
      else {
        let updateObj = {
          task: this.textArea,
          type: ActionType.chs,
          level: ActionLevel.MPA,
          createdAt: new Date().getTime()
        };
        this.af.database.list(Constants.APP_STATUS + "/actionCHS/" + this.systemUid).push(updateObj).then(_ => {
          this.router.navigateByUrl("/system-admin/min-prep");
        });
      }
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
   * @returns {boolean}
   */
  private validate() {

    if (!(this.textArea)) {
      this.alerts[this.textArea] = true;
      this.errorMessage = "SYSTEM_ADMIN.ACTIONS.NO_CONTENT_ERROR";
      return false;
    }
    return true;
  }

}
