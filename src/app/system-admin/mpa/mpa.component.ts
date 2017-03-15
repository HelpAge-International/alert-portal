import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel} from "../../utils/Enums";
import {Router} from "@angular/router";
import {DialogService} from "../dialog/dialog.service";

@Component({
  selector: 'app-mpa',
  templateUrl: './mpa.component.html',
  styleUrls: ['./mpa.component.css']
})
export class MpaComponent implements OnInit {
  actions: FirebaseListObservable<any>;
  ActionType = ActionType;
  ActionLevel = ActionLevel;
  private uid: string;

  constructor(private af: AngularFire, private router: Router, private dialogService: DialogService) {
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
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
