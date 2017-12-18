import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {AlertMessageType, ModuleName, ModuleNameNetwork, Privacy} from "../../../../utils/Enums";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {NetworkService} from "../../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SettingsService} from "../../../../services/settings.service";
import {ModuleSettingsModel} from "../../../../model/module-settings.model";
import {Constants} from "../../../../utils/Constants";
import {NetworkPrivacyModel} from "../../../../model/network-privacy.model";

@Component({
  selector: 'app-network-country-module-settings',
  templateUrl: './network-country-module-settings.component.html',
  styleUrls: ['./network-country-module-settings.component.css']
})
export class NetworkCountryModuleSettingsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private Privacy = Privacy;
  private MODULE_NAME = Constants.MODULE_NAME_NETWORK_COUNTRY;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;
  private modules: ModuleSettingsModel[] = [];
  private networkModules: ModuleSettingsModel[] = [];
  private showLoader: boolean;
  private networkPrivacy: NetworkPrivacyModel;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private settingService: SettingsService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];

          this.networkService.getPrivacySettingForNetwork(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(networkPrivacy => {
              this.networkPrivacy = networkPrivacy
            })

          this.settingService.getCountryModulesSettings(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(networkModules =>{
              this.networkModules = networkModules
            })

          this.settingService.getCountryModulesSettings(this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(modules => {
              this.modules = modules;
              console.log(this.modules)
              this.showLoader = false;
            });
        })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  changePrivacy(moduleId, privacy) {
    this.modules[moduleId].privacy = privacy;
  }

  cancelChanges() {
    this.ngOnInit();
  }

  saveChanges() {
    console.log("save changes");
    this.settingService.saveCountryModuleSettings(this.networkCountryId, this.modules).then(() => {
      this.alertMessage = new AlertMessageModel("Module Settings successfully saved!", AlertMessageType.Success);
    }, error => {
      this.alertMessage = new AlertMessageModel(error.message);
    });
  }

  checkDisable(moduleIndex, btnIndex) {
    let isDisable = false;
    let privacyToCheck = -1;
    if (moduleIndex == ModuleNameNetwork.MinimumPreparednessActions) {
      privacyToCheck = this.networkPrivacy.mpa;
    } else if (moduleIndex == ModuleNameNetwork.AdvancedPreparednessActions) {
      privacyToCheck = this.networkPrivacy.apa;
    } else if (moduleIndex == ModuleNameNetwork.CHSPreparednessActions) {
      privacyToCheck = this.networkPrivacy.chs;
    } else if (moduleIndex == ModuleNameNetwork.RiskMonitoring) {
      privacyToCheck = this.networkPrivacy.riskMonitoring;
    } else if (moduleIndex == ModuleNameNetwork.ConflictIndicators) {
      privacyToCheck = this.networkPrivacy.conflictIndicators;
    } else if (moduleIndex == ModuleName.CountryOfficeProfile) {
      privacyToCheck = this.networkPrivacy.officeProfile;
    } else if (moduleIndex == ModuleName.ResponsePlanning) {
      privacyToCheck = this.networkPrivacy.responsePlan;
    }
    if (privacyToCheck == Privacy.Network && btnIndex == 0) {
      isDisable = true;
    } else if (privacyToCheck == Privacy.Private && btnIndex == 0 || privacyToCheck == Privacy.Private && btnIndex == 2) {
      isDisable = true;
    }
    return isDisable;
  }

}
