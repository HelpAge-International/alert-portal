import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from '../../utils/Constants';
import {ActionType} from '../../utils/Enums';
import {DialogService} from "../../dialog/dialog.service";
import {RxHelper} from "../../utils/RxHelper";

@Component({
  selector: 'app-min-prep',
  templateUrl: './min-prep.component.html',
  styleUrls: ['./min-prep.component.css']
})

export class MinPrepComponent implements OnInit, OnDestroy {

  private chsMinPrepActions: FirebaseListObservable<any>;
  private path: string = '';
  private subscriptions: RxHelper;
  // ActionType = ActionType;

  constructor(private af: AngularFire, private router: Router, private dialogService: DialogService) {
    this.subscriptions = new RxHelper;
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.path = Constants.APP_STATUS+"/action/" + auth.uid;
        this.chsMinPrepActions = this.af.database.list(this.path, {
          query: {
            orderByChild: 'type',
            equalTo: ActionType.chs
          }
        });

      } else {
        // user is not logged in
        console.log("Error occurred - User isn't logged in");
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  editChsMinPrepAction(chsMinPrepAction) {
    console.log("Edit button pressed");
    this.router.navigate(['/system-admin/min-prep/create', {id: chsMinPrepAction.$key}]);
  }

  deleteChsMinPrepAction(chsMinPrepAction) {
    let subscription = this.dialogService.createDialog('DELETE_ACTION_DIALOG.TITLE', 'DELETE_ACTION_DIALOG.CONTENT').subscribe(result => {
      if (result) {
        console.log("Delete button pressed");
        this.af.database.object(this.path + "/" + chsMinPrepAction.$key).remove()
          .then(_ =>
            console.log("Chs action deleted")
          );
      }
    });
    this.subscriptions.add(subscription);
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
