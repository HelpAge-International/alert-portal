import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from '../../utils/Constants';
import {ActionType} from '../../utils/Enums';
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {ChsMinPreparednessAction} from "../../model/chsMinPreparednessAction";
declare var jQuery: any;

@Component({
  selector: 'app-min-prep',
  templateUrl: './min-prep.component.html',
  styleUrls: ['./min-prep.component.css']
})

export class MinPrepComponent implements OnInit, OnDestroy {

  private chsActions: CHSListModel[] = [];
  private actionToDelete: CHSListModel;
  private systemUid: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.systemUid = user.uid;
      this.af.database.list(Constants.APP_STATUS + "/actionCHS/" + user.uid, {preserveSnapshot: true})
        .takeUntil(this.ngUnsubscribe)
        .subscribe((snap) => {
          this.chsActions = [];
          snap.forEach((snapshot) => {
            let x: CHSListModel = new CHSListModel();
            x.task = snapshot.val().task;
            x.level = snapshot.val().level;
            x.type = snapshot.val().type;
            x.id = snapshot.key;
            this.chsActions.push(x);
          });
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected editChsMinPrepAction(chsMinPrepAction: CHSListModel) {
    this.router.navigate(['/system-admin/min-prep/create', {id: chsMinPrepAction.id}]);
  }

  protected deleteChsMinPrepAction(chsMinPrepAction: CHSListModel) {
    this.actionToDelete = chsMinPrepAction;
    jQuery("#delete-action").modal("show");
  }

  protected deleteAction() {
    this.af.database.object(Constants.APP_STATUS + "/actionCHS/" + this.systemUid + "/" + this.actionToDelete.id).set(null)
      .then(_ => {
        jQuery("#delete-action").modal("hide");
      });
  }

  protected closeModal() {
    jQuery("#delete-action").modal("hide");
  }
}

export class CHSListModel {
  public task: string;
  public type: number;
  public level: number;
  public id: string;
}
