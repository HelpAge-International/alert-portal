import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType, DurationType} from "../../../utils/Enums";
import {SettingsService} from "../../../services/settings.service";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NetworkService} from "../../../services/network.service";
import {ClockSettingsModel} from "../../../model/clock-settings.model";
import {Constants} from "../../../utils/Constants";

@Component({
  selector: 'app-network-clock-settings',
  templateUrl: './network-clock-settings.component.html',
  styleUrls: ['./network-clock-settings.component.css']
})
export class NetworkClockSettingsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private durationsListW = Constants.DURATION_LIST_WEEK;
  private durationsListM = Constants.DURATION_LIST_MONTH;
  private durationsListY = Constants.DURATION_LIST_YEAR;
  private DURATION_TYPE = Constants.DURATION_TYPE;
  private DURATION_TYPE_SELECTION = Constants.DURATION_TYPE_SELECTION;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private clockSettings: ClockSettingsModel;

  //logic
  private durationMap = new Map();
  private networkId: string;
  private showLoader: boolean;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private router: Router,
              private settingService: SettingsService) {

    this.durationMap.set(DurationType.Week, this.durationsListW);
    this.durationMap.set(DurationType.Month, this.durationsListM);
    this.durationMap.set(DurationType.Year, this.durationsListY);
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.networkService.getSelectedIdObj(user.uid)
        .flatMap(selection => {
          this.networkId = selection["id"];
          return this.settingService.getNetworkClockSettings(selection["id"]);
        })
        .subscribe((clockSettings: ClockSettingsModel) => {
          console.log(clockSettings);
          this.clockSettings = clockSettings;
          this.showLoader = false;
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  cancelChanges() {
    this.ngOnInit();
  }

  saveChanges() {
    console.log("save changes");
    this.settingService.saveNetworkClockSettings(this.networkId, this.clockSettings).then(() => {
      this.alertMessage = new AlertMessageModel("Clock Settings successfully saved!", AlertMessageType.Success);
    }, error => {
      this.alertMessage = new AlertMessageModel(error.message);
    });
  }

  convertToNumber(value): number {
    return Number(value);
  }

  validateForm(): boolean {
    this.alertMessage = this.clockSettings.validate();
    return !this.alertMessage;
  }

  validateShowLogsFromValue() {
    if (this.clockSettings.riskMonitoring.showLogsFrom.durationType == DurationType.Month && this.clockSettings.riskMonitoring.showLogsFrom.value > Constants.MONTH_MAX_NUMBER) {
      this.clockSettings.riskMonitoring.showLogsFrom.value = Constants.MONTH_MAX_NUMBER;
    } else if (this.clockSettings.riskMonitoring.showLogsFrom.durationType == DurationType.Year && this.clockSettings.riskMonitoring.showLogsFrom.value > Constants.YEAR_MAX_NUMBER) {
      this.clockSettings.riskMonitoring.showLogsFrom.value = Constants.YEAR_MAX_NUMBER;
    }
  }

  validateHazardsValidForValue() {
    if (this.clockSettings.riskMonitoring.hazardsValidFor.durationType == DurationType.Month && this.clockSettings.riskMonitoring.hazardsValidFor.value > Constants.MONTH_MAX_NUMBER) {
      this.clockSettings.riskMonitoring.hazardsValidFor.value = Constants.MONTH_MAX_NUMBER;
    } else if (this.clockSettings.riskMonitoring.hazardsValidFor.durationType == DurationType.Year && this.clockSettings.riskMonitoring.hazardsValidFor.value > Constants.YEAR_MAX_NUMBER) {
      this.clockSettings.riskMonitoring.hazardsValidFor.value = Constants.YEAR_MAX_NUMBER;
    }
  }

  validatePreparednessValue() {
    if (this.clockSettings.preparedness.durationType == DurationType.Month && this.clockSettings.preparedness.value > Constants.MONTH_MAX_NUMBER) {
      this.clockSettings.preparedness.value = Constants.MONTH_MAX_NUMBER;
    } else if (this.clockSettings.preparedness.durationType == DurationType.Year && this.clockSettings.preparedness.value > Constants.YEAR_MAX_NUMBER) {
      this.clockSettings.preparedness.value = Constants.YEAR_MAX_NUMBER;
    }
  }

  validateResponsePlansValue() {
    if (this.clockSettings.responsePlans.durationType == DurationType.Month && this.clockSettings.responsePlans.value > Constants.MONTH_MAX_NUMBER) {
      this.clockSettings.responsePlans.value = Constants.MONTH_MAX_NUMBER;
    } else if (this.clockSettings.responsePlans.durationType == DurationType.Year && this.clockSettings.responsePlans.value > Constants.YEAR_MAX_NUMBER) {
      this.clockSettings.responsePlans.value = Constants.YEAR_MAX_NUMBER;
    }
  }

}
