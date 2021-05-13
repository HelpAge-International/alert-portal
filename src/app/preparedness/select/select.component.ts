
import {takeUntil} from 'rxjs/operators';
import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router, NavigationExtras, ActivatedRoute} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Department, ActionType, ActionLevel, GenericActionCategory} from "../../utils/Enums";
import {Action} from "../../model/action";
import {ModelUserPublic} from "../../model/user-public.model";
import {Observable, Subject} from "rxjs";

import {LocalStorageService} from 'angular-2-local-storage';
import {PageControlService} from "../../services/pagecontrol.service";
import {UserService} from "../../services/user.service";



declare var jQuery: any;

@Component({
  selector: 'app-select-preparedness',
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

  private actions: GenericToCustomListModel[] = [];

  private actionLevel = Constants.ACTION_LEVEL;
  private actionLevelList: number[] = [ActionLevel.ALL, ActionLevel.MPA, ActionLevel.APA];

  private category = Constants.CATEGORY;
  private categoriesList = [GenericActionCategory.All,GenericActionCategory.OfficeAdministration, GenericActionCategory.Finance, GenericActionCategory.ITFieldCommunications,
    GenericActionCategory.Logistics, GenericActionCategory.CommunicationsMedia, GenericActionCategory.HumanResources, GenericActionCategory.DonorFundingReporting,
    GenericActionCategory.Accountability, GenericActionCategory.Security, GenericActionCategory.Programmes,  GenericActionCategory.EmergencyResponseTeamManagement];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //Local Agency
  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private storage: LocalStorageService, private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.userService.getSystemAdminId(Constants.USER_PATHS[userType], this.uid).pipe(
          takeUntil(this.ngUnsubscribe))
          .subscribe((systemAdmin) => {
            this.systemAdminUid = systemAdmin;
            this.initGenericActions();
          });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected continueEvent() {
    this.storage.set('selectedAction', this.actionSelected);

    this.router.navigate(this.isLocalAgency ? ["/local-agency/preparedness/create-edit-preparedness"] : ["/preparedness/create-edit-preparedness"]);
  }

  protected selectAction(action: GenericToCustomListModel) {
    this.actionSelected = action;
  }

  protected initGenericActions() {
    this.af.database.list(Constants.APP_STATUS + "/actionGeneric/" + this.systemAdminUid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          let x: GenericToCustomListModel = new GenericToCustomListModel();
          x.id = snapshot.key;
          x.level = snapshot.val().level;
          x.category = snapshot.val().category;
          x.task = snapshot.val().task;
          x.type = snapshot.val().type;
          this.actions.push(x);
        });
      });
  }
}

export class GenericToCustomListModel {
  public category: GenericActionCategory;
  public level: number;
  public task: string;
  public type: number;
  public id: string;
  public department: string;
  public addNew: boolean;

  constructor() {
    this.addNew = false;
  }
}
