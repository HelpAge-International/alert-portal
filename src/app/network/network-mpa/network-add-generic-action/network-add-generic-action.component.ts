import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {ActionLevel, AlertMessageType, GenericActionCategory} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyService} from "../../../services/agency-service.service";
import {UserService} from "../../../services/user.service";
import {Observable} from "rxjs/Observable";
import {GenericActionModel} from "./generic-action.model";
import {Constants} from "../../../utils/Constants";

@Component({
  selector: 'app-network-add-generic-action',
  templateUrl: './network-add-generic-action.component.html',
  styleUrls: ['./network-add-generic-action.component.css']
})
export class NetworkAddGenericActionComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private CategoryName = Constants.CATEGORY;
  private CategorySelection = Constants.CATEGORY_SELECTION;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private genericActions: Observable<GenericActionModel[]>;
  private uid: string;
  private actionSelectionMap = new Map<string, boolean>();
  private actionMap = new Map<string, GenericActionModel>();
  private selectedLevel: ActionLevel = ActionLevel.ALL;
  private selectedCategory: GenericActionCategory = GenericActionCategory.All;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private agencyService: AgencyService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {

    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {

      this.uid = user.uid;

      //get generic actions
      this.getGenericActions(this.uid);

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
        });
    });
  }

  private getGenericActions(uid) {
    this.genericActions = this.networkService.getSystemIdForNetworkAdmin(uid)
      .flatMap(systemId => {
        return this.networkService.getGenericActions(systemId)
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  resetSelections() {
    this.getGenericActions(this.uid);
  }

  selectAction(action, isChecked) {
    this.actionSelectionMap.set(action.id, isChecked);
    this.actionMap.set(action.id, action);
  }

  addActions() {
    const nothingSelected = Array.from(this.actionSelectionMap.keys()).map(key => this.actionSelectionMap.get(key)).indexOf(true) == -1;
    nothingSelected ? this.showError("No generic action selected!") : this.addSelectedActions();
  }

  private addSelectedActions() {
    return this.networkService.addGenericActionsToNetwork(this.networkId, this.actionMap, this.actionSelectionMap)
      .then(() => {
        this.router.navigateByUrl("/network/network-mpa");
      }).catch(error => {
        console.log(error.message);
      });
  }

  private showError(msg) {
    this.alertMessage = new AlertMessageModel(msg);
  }

  triggerFilter() {
    console.log(this.selectedLevel);
    console.log(this.selectedCategory);
  }

}
