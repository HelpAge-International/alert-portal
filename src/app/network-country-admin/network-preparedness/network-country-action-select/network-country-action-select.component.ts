import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Constants} from "../../../utils/Constants";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {ActionLevel, AlertMessageType, GenericActionCategory} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {AngularFire, FirebaseApp} from "angularfire2";
import {NetworkService} from "../../../services/network.service";
import {LocalStorageService} from "angular-2-local-storage";
import {NotificationService} from "../../../services/notification.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {WindowRefService} from "../../../services/window-ref.service";
import {GenericToCustomListModel} from "../../../preparedness/select/select.component";

@Component({
  selector: 'app-network-country-action-select',
  templateUrl: './network-country-action-select.component.html',
  styleUrls: ['./network-country-action-select.component.scss']
})
export class NetworkCountryActionSelectComponent implements OnInit,OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums

  // Models

  //logic
  private networkId: string;
  private networkCountryId: string;
  private showLoader: boolean;


  //copy over from
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


  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private networkService: NetworkService,
              private storage: LocalStorageService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.initNetworkAccess();
  }

  private initNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          this.showLoader = false;

          this.networkService.getSystemIdForNetworkCountryAdmin(this.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(systemId => {
              this.systemAdminUid = systemId;
              this.initGenericActions();
            });

        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initGenericActions() {
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

  continueEvent() {
    this.storage.set('selectedAction', this.actionSelected);
    this.router.navigate(["/network-country/network-country-create-edit-action"]).then();
  }

  selectAction(action: GenericToCustomListModel) {
    this.actionSelected = action;
  }

}
