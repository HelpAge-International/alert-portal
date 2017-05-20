import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class ClockSettingsModel extends BaseModel{
  private preparedness: ClockSettingModel;
  private responsePlans: ClockSettingModel;
  private riskMonitoring: { hazardsValidFor: ClockSettingModel, showLogsFrom: ClockSettingModel}

  
  validate(excludedFields = []): AlertMessageModel {
    if (!this.preparedness && !this.isExcluded('preparedness', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_PREPAREDNESS_DURATION');
    }
    if (!this.responsePlans && !this.isExcluded('responsePlans', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_RESPONSE_PLANS_DURATION');
    }
    if (!this.riskMonitoring && !this.isExcluded('riskMonitoring', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_RISK_MONITORING_DURATION');
    }
    return null;
  }
}

export class ClockSettingModel extends BaseModel{
  private durationType: number;
  private value: number;

  
  validate(excludedFields = []): AlertMessageModel {
    if (!this.durationType && !this.isExcluded('durationType', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_DURATION');
    }
    if (!this.value && !this.isExcluded('value', excludedFields)) {
      return new AlertMessageModel('COUNTRY_ADMIN.SETTINGS.CLOCK_SETTINGS.NO_DURATION');
    }
    return null;
  }
}