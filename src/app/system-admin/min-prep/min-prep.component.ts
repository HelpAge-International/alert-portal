import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from '../../utils/Constants';
import {ActionType} from '../../utils/Enums';
import {Subject} from "rxjs";
declare var jQuery: any;

@Component({
  selector: 'app-min-prep',
  templateUrl: './min-prep.component.html',
  styleUrls: ['./min-prep.component.css']
})

export class MinPrepComponent implements OnInit, OnDestroy {

  private chsMinPrepActions: FirebaseListObservable<any>;
  private path: string = '';
  private actionToDelete;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {

    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        this.path = Constants.APP_STATUS + "/action/" + auth.uid;
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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  editChsMinPrepAction(chsMinPrepAction) {
    console.log("Edit button pressed");
    this.router.navigate(['/system-admin/min-prep/create', {id: chsMinPrepAction.$key}]);
  }

  deleteChsMinPrepAction(chsMinPrepAction) {
    this.actionToDelete = chsMinPrepAction;
    jQuery("#delete-action").modal("show");
  }

  deleteAction() {
    console.log("Delete button pressed");
    this.af.database.object(this.path + "/" + this.actionToDelete.$key).remove()
      .then(_ => {
        console.log("Chs action deleted");
        jQuery("#delete-action").modal("hide");
      });
  }

  closeModal() {
    jQuery("#delete-action").modal("hide");
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
