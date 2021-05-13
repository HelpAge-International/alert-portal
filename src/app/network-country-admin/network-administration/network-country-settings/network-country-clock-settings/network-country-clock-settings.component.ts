import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../../../utils/Constants";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {AlertMessageType, DurationType} from "../../../../utils/Enums";
import {ClockSettingsModel} from "../../../../model/clock-settings.model";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {NetworkService} from "../../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SettingsService} from "../../../../services/settings.service";

@Component({
  selector: 'app-network-country-clock-settings',
  templateUrl: './network-country-clock-settings.component.html',
  styleUrls: ['./network-country-clock-settings.component.css']
})
export class NetworkCountryClockSettingsComponent implements OnInit, OnDestroy {

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
  private networkCountryId: string;


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
          this.networkCountryId = selection["networkCountryId"];
          return this.settingService.getNetworkCountryClockSettings(this.networkId, this.networkCountryId);
        })
        .subscribe((clockSettings: ClockSettingsModel) => {
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
    this.networkService.getNetworkClockSettings(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(settings => {
        console.log(settings)
        let isValid = this.checkIfCountrySettingValid(settings);
        if (isValid) {
          this.settingService.saveNetworkCountryClockSettings(this.networkId, this.networkCountryId, this.clockSettings).then(() => {
            this.alertMessage = new AlertMessageModel("Clock Settings successfully saved!", AlertMessageType.Success);
          }, error => {
            this.alertMessage = new AlertMessageModel(error.message);
          });
        }
      })

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

  private checkIfCountrySettingValid(settings: any): boolean {
    console.log(settings)
    let isValid = true;
    let riskShowLogValue = this.clockSettings.riskMonitoring.showLogsFrom.value;
    let riskShowLogType = this.clockSettings.riskMonitoring.showLogsFrom.durationType;
    let riskHazardValue = this.clockSettings.riskMonitoring.hazardsValidFor.value;
    let riskHazardType = this.clockSettings.riskMonitoring.hazardsValidFor.durationType;
    let preparednessValue = this.clockSettings.preparedness.value;
    let preparednessType = this.clockSettings.preparedness.durationType;
    let planValue = this.clockSettings.responsePlans.value;
    let planType = this.clockSettings.responsePlans.durationType;

    let agencyPreparednessValue = settings.preparedness.value;
    let agencyPreparednessType = settings.preparedness.durationType;
    let agencyPlanValue = settings.responsePlans.value;
    let agencyPlanType = settings.responsePlans.durationType;
    let agencyRiskShowLogValue = settings.riskMonitoring.showLogsFrom.value;
    let agencyRiskShowLogType = settings.riskMonitoring.showLogsFrom.durationType;
    let agencyRiskHazardValue = settings.riskMonitoring.hazardsValidFor.value;
    let agencyRiskHazardType = settings.riskMonitoring.hazardsValidFor.durationType;

    if (riskShowLogType == agencyRiskShowLogType && riskShowLogValue > agencyRiskShowLogValue || riskShowLogType > agencyRiskShowLogType) {
      this.alertMessage = new AlertMessageModel("Risk monitoring show log setting can not set longer than agency level");
      isValid = false;
    } else if (riskHazardType == agencyRiskHazardType && riskHazardValue > agencyRiskHazardValue || riskHazardType > agencyRiskHazardType) {
      this.alertMessage = new AlertMessageModel("Risk monitoring hazard remain setting can not set longer than agency level");
      isValid = false;
    } else if (preparednessType == agencyPreparednessType && preparednessValue > agencyPreparednessValue || preparednessType > agencyPreparednessType) {
      this.alertMessage = new AlertMessageModel("Preparedness setting can not set longer than agency level");
      isValid = false;
    } else if (planType == agencyPlanType && planValue > agencyPlanValue || planType > agencyPlanType) {
      this.alertMessage = new AlertMessageModel("Response plan setting can not set longer than agency level");
      isValid = false;
    }
    return isValid;
  }

}
