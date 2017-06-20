import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, NavigationExtras, ActivatedRoute} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Department, ActionType, ActionLevel, GenericActionCategory} from "../../utils/Enums";
import {Action} from "../../model/action";
import {ModelUserPublic} from "../../model/user-public.model";
import {Observable, Subject} from "rxjs";

import {LocalStorageService} from 'angular-2-local-storage';
import {PageControlService} from "../../services/pagecontrol.service";

declare var jQuery: any;

@Component({
  selector: 'app-preparedness',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})

export class SelectPreparednessComponent implements OnInit, OnDestroy {

  private uid: string;
  private systemAdminUid: string;
  private isFiltered: boolean = false;

  private actionSelected: any = {};
  private actionSelectedID: string;

  private actionLevelSelected = 0;
  private categorySelected = 0;

  private genericActions: Observable<any>;

  private actionLevel = Constants.ACTION_LEVEL;
  private actionLevelList: number[] = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];

  private category = Constants.CATEGORY;
  private categoriesList = [
    GenericActionCategory.ALL,
    GenericActionCategory.Category1,
    GenericActionCategory.Category2,
    GenericActionCategory.Category3,
    GenericActionCategory.Category4,
    GenericActionCategory.Category5,
    GenericActionCategory.Category6,
    GenericActionCategory.Category7,
    GenericActionCategory.Category8,
    GenericActionCategory.Category9,
    GenericActionCategory.Category10
  ];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private storage: LocalStorageService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.af.database.list(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/systemAdmin')
          .takeUntil(this.ngUnsubscribe)
          .subscribe((systemAdminIds) => {
            this.systemAdminUid = systemAdminIds[0].$key;
            this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
              query: {
                orderByChild: "type",
                equalTo: ActionType.mandated
              }
            });
          });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  changeFilter(event: any, typeFilter: string) {

    if (typeFilter == 'category') {
      this.categorySelected = event.target.value;
    }

    if (typeFilter == 'level') {
      this.actionLevelSelected = event.target.value;
    }

    this.filter();
  }

  continueEvent() {

    this.storage.set('selectedAction', this.actionSelected);
    this.router.navigate(["/preparedness/create-edit-preparedness"]);
  }


  selectAction(action: any) {
    this.actionSelected = action;
  }

  filter() {

    if (this.actionLevelSelected == GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //no filter. show all
      this.isFiltered = false;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      });
    } else if (this.actionLevelSelected != GenericActionCategory.ALL && this.categorySelected == GenericActionCategory.ALL) {
      //filter only with mpa
      this.isFiltered = true;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.actionLevelSelected) {
              tempList.push(item);
            }
          }
          return tempList;
        });
    } else if (this.actionLevelSelected == GenericActionCategory.ALL && this.categorySelected != GenericActionCategory.ALL) {
      //filter only with apa
      this.isFiltered = true;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
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
      this.isFiltered = true;
      this.genericActions = this.af.database.list(Constants.APP_STATUS + "/action/" + this.systemAdminUid, {
        query: {
          orderByChild: "type",
          equalTo: ActionType.mandated
        }
      })
        .map(list => {
          let tempList = [];
          for (let item of list) {
            if (item.level == this.actionLevelSelected) {
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


  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
