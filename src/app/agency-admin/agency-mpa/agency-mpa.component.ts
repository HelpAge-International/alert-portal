import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Department} from "../../utils/Enums";
import {Router} from "@angular/router";
import {DialogService} from "../../dialog/dialog.service";
import {RxHelper} from "../../utils/RxHelper";

@Component({
  selector: 'app-agency-mpa',
  templateUrl: './agency-mpa.component.html',
  styleUrls: ['./agency-mpa.component.css']
})

export class AgencyMpaComponent implements OnInit, OnDestroy {

  private uid: string;
  private actions: FirebaseListObservable<any>;
  private Department = Department;
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

  }

  deleteAction(actionKey) {
    let subscription = this.dialogService.createDialog('DELETE_ACTION_DIALOG.TITLE', 'DELETE_ACTION_DIALOG.CONTENT').subscribe(result => {
      if (result) {
        console.log("Delete button pressed");
        let actionPath: string = Constants.APP_STATUS +'/action/' + this.uid + '/' + actionKey
        console.log(actionPath);
        this.af.database.object(actionPath).remove()
          .then(_ =>
            console.log("MPA deleted")
          );
      }
    });
    this.subscriptions.add(subscription);
  }

  editAction(actionKey) {
    console.log("Navigate to edit");
    this.router.navigate(["/agency-admin/agency-mpa/create-edit-mpa", {id: actionKey}]);
  }
}
