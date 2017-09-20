import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../utils/Constants';
import {UserService} from "../../../services/user.service";
import {SettingsService} from "../../../services/settings.service";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {DisplayError} from "../../../errors/display.error";
import {ClockSettingsModel} from "../../../model/clock-settings.model";
import {AlertMessageType, DurationType} from "../../../utils/Enums";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";

@Component({
  selector: 'app-country-clock-settings',
  templateUrl: './country-clock-settings.component.html',
  styleUrls: ['./country-clock-settings.component.css']
})

export class CountryClockSettingsComponent implements OnInit, OnDestroy {
  private uid: string;
  private agencyId: string;
  private countryId: string;

  DURATION_TYPE = Constants.DURATION_TYPE;
  DURATION_TYPE_SELECTION = Constants.DURATION_TYPE_SELECTION;

  private durationMap = new Map();

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private clockSettings: ClockSettingsModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService,
              private _userService: UserService,
              private _settingsService: SettingsService,
              private router: Router,
              private route: ActivatedRoute) {
    let durationsListW = Constants.DURATION_LIST_WEEK;
    let durationsListM = Constants.DURATION_LIST_MONTH;
    let durationsListY = Constants.DURATION_LIST_YEAR;

    this.durationMap.set(DurationType.Week, durationsListW);
    this.durationMap.set(DurationType.Month, durationsListM);
    this.durationMap.set(DurationType.Year, durationsListY);
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

      this.uid = user.uid;
      this.agencyId = agencyId;
      this.countryId = countryId;

      this._settingsService.getCountryClockSettings(this.agencyId, this.countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(clockSettings => {
          this.clockSettings = clockSettings;
        })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  submit() {

    this._settingsService.getAgencyClockSettings(this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(settings => {
        console.log(settings)
        let isValid = this.checkIfCountrySettingValid(settings);
        if (isValid) {
          this._settingsService.saveCountryClockSettings(this.agencyId, this.countryId, this.clockSettings)
            .then(() => {
              this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.SAVED_SUCCESS', AlertMessageType.Success);
            })
            .catch(err => {
              if (err instanceof DisplayError) {
                this.alertMessage = new AlertMessageModel(err.message);
              } else {
                this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
              }
            });
        }
      });


  }

  private checkIfCountrySettingValid(settings: any): boolean {
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

  convertToNumber(value): number {
    return Number(value);
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

}
