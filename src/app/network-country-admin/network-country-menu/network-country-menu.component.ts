import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LocalStorageService} from "angular-2-local-storage";
import {Constants} from "../../utils/Constants";
import {NetworkViewModel} from "../../country-admin/country-admin-header/network-view.model";
import {CommonUtils} from "../../utils/CommonUtils";
import {NetworkService} from "../../services/network.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SettingsService} from "../../services/settings.service";
import {NetworkPrivacyModel} from "../../model/network-privacy.model";
import {ModuleSettingsModel} from "../../model/module-settings.model";
import {ModuleNameNetwork, Privacy} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-network-country-menu',
  templateUrl: './network-country-menu.component.html',
  styleUrls: ['./network-country-menu.component.css']
})
export class NetworkCountryMenuComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject
  private networkViewModel: NetworkViewModel;
  private networkViewValues: {};
  @Input() isViewing: boolean;
  private networkCountryPrivacy: NetworkPrivacyModel = new NetworkPrivacyModel
  private networkModules: ModuleSettingsModel[];
  private PRIVACY = Privacy
  private NETWORK_MODULE = ModuleNameNetwork
  private networkId: string;
  private networkCountryId: string;

  constructor(private storageService: LocalStorageService,
              private route: ActivatedRoute,
              private pageControl: PageControlService,
              private settingService: SettingsService,
              private router: Router,
              private networkService: NetworkService) {
  }

  ngOnInit() {
    let obj = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    if (obj) {
      this.isViewing = true;
      this.networkViewModel = new NetworkViewModel(null, null, null, null,null, null, null, null, null);
      this.networkViewModel.mapFromObject(obj)
      this.networkViewValues = CommonUtils.buildNetworkViewValues(this.networkViewModel);

      //init privacy
      this.networkService.getPrivacySettingForNetworkCountry(this.networkViewModel.networkCountryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(networkCountryPrivacy => {
          console.log(networkCountryPrivacy)
          this.networkCountryPrivacy = networkCountryPrivacy
        })

      //init module status
      this.settingService.getCountryModulesSettings(this.networkViewModel.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(modules => {
          this.networkModules = modules
        })

    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {

        //get network id
        this.networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];
            this.networkCountryId = selection["networkCountryId"];

            //init privacy
            this.networkService.getPrivacySettingForNetworkCountry(this.networkCountryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(networkCountryPrivacy => {
                console.log(networkCountryPrivacy)
                this.networkCountryPrivacy = networkCountryPrivacy
              })

            //init module status
            this.settingService.getCountryModulesSettings(this.networkId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(modules => {
                console.log("****************************")
                console.log(modules)
                this.networkModules = modules
              })
          });
      });
    }

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
}
