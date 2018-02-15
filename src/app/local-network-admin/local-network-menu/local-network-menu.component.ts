import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LocalNetworkViewModel} from "../../country-admin/country-admin-header/local-network-view.model";
import {LocalStorageService} from "angular-2-local-storage";
import {Constants} from "../../utils/Constants";
import {ModuleNameNetwork, Privacy} from "../../utils/Enums";
import {NetworkPrivacyModel} from "../../model/network-privacy.model";
import {ModuleSettingsModel} from "../../model/module-settings.model";
import {NetworkService} from "../../services/network.service";
import {SettingsService} from "../../services/settings.service";
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-local-network-menu',
  templateUrl: './local-network-menu.component.html',
  styleUrls: ['./local-network-menu.component.css']
})
export class LocalNetworkMenuComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject
  @Input() isViewing: boolean
  private networkViewModel: LocalNetworkViewModel;
  private networkCountryPrivacy: NetworkPrivacyModel = new NetworkPrivacyModel
  private networkModules: ModuleSettingsModel[];
  private PRIVACY = Privacy
  private NETWORK_MODULE = ModuleNameNetwork
  private uid: string;
  private networkId: string;

  constructor(private storageService: LocalStorageService,
              private networkService: NetworkService,
              private pageControl: PageControlService,
              private router: Router,
              private route: ActivatedRoute,
              private settingService: SettingsService) {
  }

  ngOnInit() {
    let obj = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    if (obj) {
      this.isViewing = true;
      this.networkViewModel = new LocalNetworkViewModel(null, null, null, null, null, null, null);
      this.networkViewModel.mapFromObject(obj)

      //init privacy
      this.networkService.getPrivacySettingForNetworkCountry(this.networkViewModel.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(networkCountryPrivacy => {
          console.log(networkCountryPrivacy)
          this.networkCountryPrivacy = networkCountryPrivacy
        })

      //init module status
      this.settingService.getCountryModulesSettings(this.networkViewModel.networkId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(modules => {
          console.log(modules)
          this.networkModules = modules
        })
    } else {

      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;

        //get network id
        this.networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];

            //init module status
            this.settingService.getCountryModulesSettings(this.networkId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(modules => {
                console.log(modules)
                this.networkModules = modules
              })
          });

      })

    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

}
