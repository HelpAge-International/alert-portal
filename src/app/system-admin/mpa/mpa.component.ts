import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel} from "../../utils/Enums";
import {Router} from "@angular/router";
import {DialogService} from "../dialog/dialog.service";
import {RxHelper} from "../../utils/RxHelper";
import {subscribeOn} from "rxjs/operator/subscribeOn";

@Component({
  selector: 'app-mpa',
  templateUrl: './mpa.component.html',
  styleUrls: ['./mpa.component.css']
})
export class MpaComponent implements OnInit,OnDestroy {
  actions: FirebaseListObservable<any>;
  ActionType = ActionType;
  ActionLevel = ActionLevel;
  private uid: string;
  private subscriptions:RxHelper;

  constructor(private af: AngularFire, private router: Router, private dialogService: DialogService) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
          query: {
            orderByChild: "type",
            equalTo: 1
          }
        });
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  delete(actionKey) {
    console.log("action key: " + actionKey);
    this.dialogService.createDialog("Delete Action?",
      "Are you sure you want to delete this action? This action cannot be undone.").subscribe(result => {
      if (result) {
        this.af.database.object(Constants.APP_STATUS + "/action/" + this.uid + "/" + actionKey).remove();
      }
    });
  }

  edit(actionKey) {
    console.log("navigate to edit");
    this.router.navigate(["/system-admin/mpa/create", {id: actionKey}]);
  }
}
