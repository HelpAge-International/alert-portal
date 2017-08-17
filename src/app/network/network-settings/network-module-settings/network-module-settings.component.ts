import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Constants} from "../../../utils/Constants";
import {SettingsService} from "../../../services/settings.service";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NetworkService} from "../../../services/network.service";
import {ModuleSettingsModel} from "../../../model/module-settings.model";
import {Privacy} from "../../../utils/Enums";

@Component({
  selector: 'app-network-module-settings',
  templateUrl: './network-module-settings.component.html',
  styleUrls: ['./network-module-settings.component.css']
})
export class NetworkModuleSettingsComponent implements OnInit, OnDestroy {
  private modules: ModuleSettingsModel[];

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants adn enums
  private MODULE_NAME = Constants.MODULE_NAME;
  private Privacy = Privacy;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private router: Router,
              private networkService: NetworkService,
              private settingService: SettingsService) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user,) => {
      this.networkService.getSelectedId(user.uid)
        .flatMap(selection => {
          return this.settingService.getCountryModulesSettings(selection["id"]);
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe((modules: ModuleSettingsModel[]) => {
          this.modules = modules;
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
  }

  cancelChanges() {
    this.ngOnInit();
  }

}
