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

export class MpaComponent implements OnInit, OnDestroy {
  private uid: string;
  actions: Observable<any>;
  ActionType = ActionType;
  GenericActionCategory = GenericActionCategory;
  private subscriptions: RxHelper;
  private levelSelected = 0;
  private categorySelected = 0;
  private Category = Constants.CATEGORY;
  private categoriesList = [GenericActionCategory.ALL, GenericActionCategory.Category1, GenericActionCategory.Category2, GenericActionCategory.Category3,
    GenericActionCategory.Category4, GenericActionCategory.Category5, GenericActionCategory.Category6, GenericActionCategory.Category7,
    GenericActionCategory.Category8, GenericActionCategory.Category9, GenericActionCategory.Category10];
  private ActionPrepLevel = Constants.ACTION_LEVEL;
  private levelsList = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];

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

  filterData() {
    if (this.levelSelected == GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //no filter. show all
      console.log("show all results");
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      });
    } else if (this.levelSelected != GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //filter only with mpa
      console.log("show filter level");
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.levelSelected) {
              console.log(JSON.stringify(item));
              tempList.push(item);
            }
          }
          return tempList;
        });
    } else if (this.levelSelected == GenericActionCategory.ALL && this.categorySelected != GenericActionCategory.ALL) {
      //filter only with apa
      console.log("show filter category");
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.category == this.categorySelected) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    } else {
      // filter both action level and category
      console.log("show both filtered");
      this.actions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.uid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.levelSelected) {
              tempList.push(item);
            }
          }
          return tempList;
        })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.category == this.categorySelected) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    }
  }
}
