import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Constants} from "../../../utils/Constants";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SettingsService} from "../../../services/settings.service";

@Component({
  selector: 'app-network-plan-settings',
  templateUrl: './network-plan-settings.component.html',
  styleUrls: ['./network-plan-settings.component.css']
})
export class NetworkPlanSettingsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private RESPONSE_PLANS_SECTION_SETTINGS = Constants.RESPONSE_PLANS_SECTION_SETTINGS;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;

  //logic
  private networkId: string;
  private sections: [boolean];

  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private router: Router,
              private settingService: SettingsService) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.networkService.getSelectedIdObj(user.uid)
        .flatMap(selection => {
          this.networkId = selection["id"];
          return this.settingService.getNetworkPlanSettings(selection["id"]);
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(planSettings => {
          console.log(planSettings);
          this.sections = planSettings;
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  changeStatus(index, status) {
    this.sections[index] = status;
  }

  cancelChanges() {
    this.ngOnInit();
  }

  saveChanges() {
    this.settingService.saveNetworkPlanSettings(this.networkId, this.sections).then(() => {
      this.alertMessage = new AlertMessageModel("Response Plan Settings successfully saved!", AlertMessageType.Success);
    }, error => {
      this.alertMessage = new AlertMessageModel(error.message);
    })
  }

}
