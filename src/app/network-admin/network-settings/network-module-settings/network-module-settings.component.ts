
import {first} from 'rxjs/operators';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../../utils/Constants";
import {SettingsService} from "../../../services/settings.service";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NetworkService} from "../../../services/network.service";
import {ModuleSettingsModel} from "../../../model/module-settings.model";
import {AlertMessageType, ModuleNameNetwork, Privacy} from "../../../utils/Enums";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {ModelAgencyPrivacy} from "../../../model/agency-privacy.model";
import {NetworkPrivacyModel} from "../../../model/network-privacy.model";

@Component({
  selector: 'app-network-module-settings',
  templateUrl: './network-module-settings.component.html',
  styleUrls: ['./network-module-settings.component.css']
})
export class NetworkModuleSettingsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //local network admin
  @Input() isLocalNetworkAdmin: boolean;

  //constants adn enums
  private MODULE_NAME = Constants.MODULE_NAME_NETWORK_COUNTRY;
  private Privacy = Privacy;
  private networkId: string;
  private ModuleNameNetwork = ModuleNameNetwork

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;

  //logic info
  private modules: ModuleSettingsModel[];
  private showLoader: boolean;




  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private router: Router,
              private networkService: NetworkService,
              private settingService: SettingsService) {
  }

  ngOnInit() {
    this.showLoader = true;
    // this.MODULE_NAME = this.isLocalNetworkAdmin ? Constants.MODULE_NAME_NETWORK_COUNTRY : Constants.MODULE_NAME;
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user,) => {
      this.networkService.getSelectedIdObj(user.uid)
        .flatMap(selection => {
          this.networkId = selection["id"];
          return this.settingService.getCountryModulesSettings(selection["id"]);
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe((modules: ModuleSettingsModel[]) => {
          this.modules = modules;
          console.log(this.modules)
          this.showLoader = false;
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  changePrivacy(moduleId, privacy) {
    this.modules[moduleId].privacy = privacy;
  }

  changeStatus(moduleId, status) {
    this.modules[moduleId].status = status;
    //if mpa disabled, chs should be disabled too
    if (moduleId == ModuleNameNetwork.MinimumPreparednessActions && status == false) {
      this.modules[ModuleNameNetwork.CHSPreparednessActions].status = false
    }
    //if risk monitoring disabled, conflict indicator should be disabled too
    if (moduleId == ModuleNameNetwork.RiskMonitoring && status == false) {
      this.modules[ModuleNameNetwork.ConflictIndicators].status = false
    }
  }

  cancelChanges() {
    this.ngOnInit();
  }

  saveChanges() {
    console.log("save changes");
    this.settingService.saveCountryModuleSettings(this.networkId, this.modules).then(() => {
      console.log(this.modules)
      this.alertMessage = new AlertMessageModel("Module Settings successfully saved!", AlertMessageType.Success);
      this.updateNetworkCountryPrivacySettings(this.modules)
    }, error => {
      this.alertMessage = new AlertMessageModel(error.message);
    });
  }

  private updateNetworkCountryPrivacySettings(moduleItems) {
    let module = new NetworkPrivacyModel();
    module.mapObject(moduleItems);
    console.log(module);
    this.networkService.getNetworkCountriesForNetwork(this.networkId).pipe(
      first())
      .subscribe(networkCountryIds => {
        networkCountryIds.forEach(networkCountryId =>{
          this.networkService.getPrivacySettingForNetworkCountry(networkCountryId).pipe(
            first())
            .subscribe((networkCountryPrivacy:NetworkPrivacyModel) =>{
              this.networkService.updateNetworkCountryPrivacy(networkCountryId, module, networkCountryPrivacy)
            })
        })
      })
  }

}
