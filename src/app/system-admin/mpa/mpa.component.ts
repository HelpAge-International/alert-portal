import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel, GenericActionCategory} from "../../utils/Enums";
import {Router} from "@angular/router";
import {DialogService} from "../../dialog/dialog.service";
import {RxHelper} from "../../utils/RxHelper";

@Component({
  selector: 'app-mpa',
  templateUrl: './mpa.component.html',
  styleUrls: ['./mpa.component.css']
})

export class MpaComponent implements OnInit,OnDestroy {
  private uid: string;
  actions: FirebaseListObservable<any>;
  ActionType = ActionType;
  GenericActionCategory = GenericActionCategory;
  private subscriptions:RxHelper;
  private levelSelected;
  private categorySelected;
  private Category = Constants.CATEGORY;
  private categoriesList = [GenericActionCategory.Category0, GenericActionCategory.Category1, GenericActionCategory.Category2,
    GenericActionCategory.Category3, GenericActionCategory.Category4, GenericActionCategory.Category5, GenericActionCategory.Category6,
    GenericActionCategory.Category7, GenericActionCategory.Category8, GenericActionCategory.Category9];

  private ActionLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.MPA, ActionLevel.APA];
  // levels = ActionLevel;
  // levelKeys(): Array<string> {
  //   var keys = Object.keys(this.levels);
  //   return keys.slice(keys.length / 2);
  // }
  // categories = GenericActionCategory;
  // categoryKeys(): Array<string> {
  //   var keys = Object.keys(this.categories);
  //   return keys.slice(keys.length / 2);
  // }

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
            equalTo: ActionType.mandated
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

  // TODO - Double filter
  checkLevelSelected() {
    if (this.levelSelected == 'allLevels') {
      console.log("All levels selected - Remove level filter")
    }
  }

  checkCategorySelected() {
    if (this.categorySelected == 'allCategories') {
      console.log("All categories selected - Remove category filter")
    }
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
