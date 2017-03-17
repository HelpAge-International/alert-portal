import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Action} from "../../../model/action";
import {ActionType, ActionLevel} from "../../../utils/Enums";
import {RxHelper} from "../../../utils/RxHelper";

@Component({
  selector: 'app-create-mpa-action',
  templateUrl: './create-mpa-action.component.html',
  styleUrls: ['./create-mpa-action.component.css']
})
export class CreateMpaActionComponent implements OnInit,OnDestroy {
  title: string = "Create new generic MPA/APA";
  actionDetail: string;
  mpa: boolean = true;
  warningMessage: string = "GENERIC_MPA_APA.NO_CONTENT_ERROR";
  private uid: string;
  private actionId: string;
  private isEdit: boolean;
  private modelAction: Action;
  private subscriptions:RxHelper;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.route.params.subscribe((params: Params) => {
          if (params["id"]) {
            this.actionId = params["id"];
            this.isEdit = true;
            this.title = "Edit generic MPA/APA";
            console.log(this.actionId);
            this.loadActionInfo(this.actionId);
          }
        });
      } else {
        this.backToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  private loadActionInfo(actionId: string) {
    let subscription = this.af.database.object(Constants.APP_STATUS + "/action/" + this.uid + "/" + actionId).subscribe((action: Action) => {
      this.modelAction = action;
      this.actionDetail = action.task;
      this.mpa = action.level == ActionLevel.MPA ? true : false;
    });
    this.subscriptions.add(subscription);
  }

  selectMpa() {
    console.log("mpa");
    this.mpa = true;
  }

  selectApa() {
    console.log("apa");
    this.mpa = false;
  }

  onSubmit() {
    console.log("submit action");
    if (this.uid) {
      if (this.isEdit) {
        this.updateAction();
      } else {
        this.createNewAction();
      }
    }
  }

  private createNewAction() {
    let action: Action = new Action();
    action.task = this.actionDetail;
    action.type = ActionType.mandated;
    action.level = this.mpa ? ActionLevel.MPA : ActionLevel.APA;
    this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid).push(action).then(success => {
      this.router.navigateByUrl(Constants.DEFAULT_MPA_PATH);
    });
  }

  private updateAction() {
    if (this.modelAction && this.actionId) {
      this.modelAction.task = this.actionDetail;
      this.modelAction.level = this.mpa ? ActionLevel.MPA : ActionLevel.APA;
      this.af.database.object(Constants.APP_STATUS + "/action/" + this.uid + "/" + this.actionId)
        .set(this.modelAction).then(success => {
        this.router.navigateByUrl(Constants.DEFAULT_MPA_PATH);
      });
    }
  }

  back() {
    this.router.navigateByUrl(Constants.DEFAULT_MPA_PATH);
  }

  backToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
