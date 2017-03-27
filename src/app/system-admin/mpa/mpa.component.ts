import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel, GenericActionCategory} from "../../utils/Enums";
import {Router} from "@angular/router";
import {DialogService} from "../../dialog/dialog.service";
import {RxHelper} from "../../utils/RxHelper";
import {Observable} from "rxjs";

@Component({
  selector: 'app-mpa',
  templateUrl: './mpa.component.html',
  styleUrls: ['./mpa.component.css']
})

export class MpaComponent implements OnInit,OnDestroy {
  private uid: string;
  actions: Observable<any>;
  ActionType = ActionType;
  GenericActionCategory = GenericActionCategory;
  private subscriptions: RxHelper;
  private levelSelected;
  private categorySelected;
  private Category = Constants.CATEGORY;
  private categoriesList = [GenericActionCategory.Category0, GenericActionCategory.Category1, GenericActionCategory.Category2,
    GenericActionCategory.Category3, GenericActionCategory.Category4, GenericActionCategory.Category5, GenericActionCategory.Category6,
    GenericActionCategory.Category7, GenericActionCategory.Category8, GenericActionCategory.Category9];
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.MPA, ActionLevel.APA];
  private selectedActionLevel: number;
  private selectedCategoryLevel: number;

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
    this.selectedActionLevel = Number(ActionLevel[this.levelSelected]);
    this.filterData();
  }

  checkCategorySelected() {
    this.selectedCategoryLevel = Number(GenericActionCategory[this.categorySelected]);
    this.filterData();
  }

  deleteAction(actionKey) {
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

  private filterData() {
    if (isNaN(this.selectedActionLevel) && isNaN(this.selectedCategoryLevel)) {
      //no filter. show all
      console.log("show all results");
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      });
    } else if (!isNaN(this.selectedActionLevel) && isNaN(this.selectedCategoryLevel)) {
      //filter only with mpa
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.selectedActionLevel) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    } else if (isNaN(this.selectedActionLevel) && !isNaN(this.selectedCategoryLevel)) {
      //filter only with apa
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.category == this.selectedCategoryLevel) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    } else {
      // filter both action level and category
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.selectedActionLevel) {
              tempList.push(item);
            }
          }
          return tempList;
        })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.category == this.selectedCategoryLevel) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    }
  }
}
