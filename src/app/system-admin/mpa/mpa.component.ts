import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel, GenericActionCategory} from "../../utils/Enums";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
declare var jQuery: any;

@Component({
  selector: 'app-mpa',
  templateUrl: './mpa.component.html',
  styleUrls: ['./mpa.component.css']
})

export class MpaComponent implements OnInit, OnDestroy {

  private uid: string;

  private actions: GenericListModel[] = [];

  ActionType = ActionType;
  GenericActionCategory = GenericActionCategory;
  private ActionLevel = Constants.ACTION_LEVEL;
  private levelSelected = 0;
  private categorySelected = 0;
  private actionToDelete: string;

  private Category = Constants.CATEGORY;
  private categoriesList = [GenericActionCategory.ALL, GenericActionCategory.Category1, GenericActionCategory.Category2, GenericActionCategory.Category3,
    GenericActionCategory.Category4, GenericActionCategory.Category5, GenericActionCategory.Category6, GenericActionCategory.Category7,
    GenericActionCategory.Category8, GenericActionCategory.Category9, GenericActionCategory.Category10];
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.af.database.list(Constants.APP_STATUS + "/actionGeneric/" + this.uid, {preserveSnapshot: true})
          .takeUntil(this.ngUnsubscribe)
          .subscribe((snap) => {
            this.actions = [];
            snap.forEach((snapshot) => {
              let x: GenericListModel = new GenericListModel();
              x.id = snapshot.key;
              x.category = snapshot.val().category;
              x.level = snapshot.val().level;
              x.task = snapshot.val().task;
              x.type = snapshot.val().type;
              this.actions.push(x);
            });
          });
    });
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  protected edit(actionKey: string) {
    this.router.navigate(["/system-admin/mpa/create", {id: actionKey}]);
  }

  protected deleteGenericAction(actionKey: string) {
    this.actionToDelete = actionKey;
    jQuery("#delete-action").modal("show");
  }

  protected deleteAction() {
    this.af.database.object(Constants.APP_STATUS + "/actionGeneric/" + this.uid + "/" + this.actionToDelete).remove()
      .then(_ => {
        console.log("Generic action deleted");
        jQuery("#delete-action").modal("hide");
      });
  }

  protected closeModal() {
    jQuery("#delete-action").modal("hide");
  }
}

export class GenericListModel {
  public category: GenericActionCategory;
  public level: number;
  public task: string;
  public type: number;
  public id: string;
}
