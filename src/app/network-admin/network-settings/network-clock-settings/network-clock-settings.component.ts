import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType, DurationType, ResponsePlanSectionSettings} from "../../../utils/Enums";
import {SettingsService} from "../../../services/settings.service";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NetworkService} from "../../../services/network.service";
import {ClockSettingsModel} from "../../../model/clock-settings.model";
import {Constants} from "../../../utils/Constants";
import {Frequency} from "../../../utils/Frequency";

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

  //for local network admin
  @Input() isLocalNetworkAdmin: boolean;


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
    this.showLoader = true;
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
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
    console.log(this.clockSettings)
    this.updateCountriesClockSettings(this.networkId, this.clockSettings)
    // this.networkService.getAllNetworkCountryIdsByNetwork(this.networkId)
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe(networkCountryIds => {
    //     console.log(networkCountryIds)
    //     networkCountryIds.forEach(networkCountryId=>{
    //       // this.networkService.(this.networkId, networkCountryId)
    //       //   .takeUntil(this.ngUnsubscribe)
    //       //   .subscribe(networkCountrySettins =>{
    //       //     console.log(networkCountrySettins)
    //       //   })
    //     })
    //   })
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

  private updateCountriesClockSettings(networkId, passedSettings: ClockSettingsModel) {
    this.networkService.getAllNetworkCountriesByNetwork(networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkCountryObjList => {
        networkCountryObjList.map(networkCountryObj => {
          console.log(networkCountryObj)
          let clockSettings: any = networkCountryObj['clockSettings'];
          let networkCountryId = networkCountryObj.$key
          let update: boolean = false;

          if (new Frequency(passedSettings['riskMonitoring']['showLogsFrom']).gt(new Frequency(clockSettings['riskMonitoring']['showLogsFrom']))) {
            update = true;
            clockSettings['riskMonitoring']['showLogsFrom']['value'] = passedSettings.riskMonitoring.showLogsFrom.value;
            clockSettings['riskMonitoring']['showLogsFrom']['durationType'] = passedSettings.riskMonitoring.showLogsFrom.durationType;
          }

          if (new Frequency(passedSettings['riskMonitoring']['hazardsValidFor']).gt(new Frequency(clockSettings['riskMonitoring']['hazardsValidFor']))) {
            update = true;
            clockSettings['riskMonitoring']['hazardsValidFor']['value'] = passedSettings.riskMonitoring.hazardsValidFor.value;
            clockSettings['riskMonitoring']['hazardsValidFor']['durationType'] = passedSettings.riskMonitoring.hazardsValidFor.durationType;
          }

          if (new Frequency(passedSettings['preparedness']).gt(new Frequency(clockSettings['preparedness']))) {
            update = true;
            clockSettings['preparedness']['value'] = passedSettings.preparedness.value;
            clockSettings['preparedness']['durationType'] = passedSettings.preparedness.durationType;
          }

          if (new Frequency(passedSettings['responsePlans']).gt(new Frequency(clockSettings['responsePlans']))) {
            update = true;
            clockSettings['responsePlans']['value'] = passedSettings.responsePlans.value;
            clockSettings['responsePlans']['durationType'] = passedSettings.responsePlans.durationType;
          }

          if (update) {
            this.networkService.setNetworkField('/networkCountry/' + this.networkId + '/' + networkCountryId + '/clockSettings/', clockSettings)
          }
        });
      });
  }

}
