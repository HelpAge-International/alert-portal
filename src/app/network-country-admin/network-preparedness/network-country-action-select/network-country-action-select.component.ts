
import {takeUntil} from 'rxjs/operators/takeUntil';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../../utils/Constants";
import {ActionLevel, GenericActionCategory, UserType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {AngularFire} from "angularfire2";
import {NetworkService} from "../../../services/network.service";
import {LocalStorageService} from "angular-2-local-storage";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {GenericToCustomListModel} from "../../../preparedness/select/select.component";
import {Location} from "@angular/common";

@Component({
  selector: 'app-network-country-action-select',
  templateUrl: './network-country-action-select.component.html',
  styleUrls: ['./network-country-action-select.component.scss']
})
export class NetworkCountryActionSelectComponent implements OnInit, OnDestroy {

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
  private categoriesList = [GenericActionCategory.All, GenericActionCategory.OfficeAdministration, GenericActionCategory.Finance, GenericActionCategory.ITFieldCommunications,
    GenericActionCategory.Logistics, GenericActionCategory.CommunicationsMedia, GenericActionCategory.HumanResources, GenericActionCategory.DonorFundingReporting,
    GenericActionCategory.Accountability, GenericActionCategory.Security, GenericActionCategory.Programmes, GenericActionCategory.EmergencyResponseTeamManagement];

  //for local network
  private isLocalNetworkAdmin: boolean;

  //netowrk view
  private isViewing: boolean
  private agencyId: string
  private countryId: string
  private userType: UserType


  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private networkService: NetworkService,
              private storage: LocalStorageService,
              private location: Location,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      if (params["isLocalNetworkAdmin"]) {
        this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
      }

      if (params["isViewing"]) {
        this.isViewing = params["isViewing"];
      }

      if (params["systemId"]) {
        this.systemAdminUid = params["systemId"];
      }

      if (params["agencyId"]) {
        this.agencyId = params["agencyId"];
      }

      if (params["countryId"]) {
        this.countryId = params["countryId"];
      }

      if (params["userType"]) {
        this.userType = params["userType"];
      }

      if (params["networkId"]) {
        this.networkId = params["networkId"];
      }

      if (params["networkCountryId"]) {
        this.networkCountryId = params["networkCountryId"];
      }
      if (params["uid"]) {
        this.uid = params["uid"];
      }

      this.isViewing ? this.initGenericActions() : this.isLocalNetworkAdmin ? this.initLocalNetworkAccess() : this.initNetworkAccess();
    })
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

          this.networkService.getSystemIdForNetworkCountryAdmin(this.uid).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(systemId => {
              this.systemAdminUid = systemId;
              this.initGenericActions();
            });

        });
    });
  }

  private initLocalNetworkAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {

          this.networkId = selection["id"];
          this.showLoader = false;

          this.networkService.getSystemIdForNetworkAdmin(this.uid).pipe(
            takeUntil(this.ngUnsubscribe))
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
    let viewValues = this.storage.get(Constants.NETWORK_VIEW_VALUES);
    // if (this.isLocalNetworkAdmin && viewValues) {
    //   viewValues['isLocalNetworkAdmin'] = this.isLocalNetworkAdmin
    // }
    // console.log(viewValues)
    this.router.navigate(this.isViewing && viewValues ? ["/network-country/network-country-create-edit-action", viewValues] : (this.isLocalNetworkAdmin ? ["/network-country/network-country-create-edit-action", {"isLocalNetworkAdmin": true}] : ["/network-country/network-country-create-edit-action"]));
  }

  selectAction(action: GenericToCustomListModel) {
    this.actionSelected = action;
  }

  back() {
    this.location.back();
  }

}
