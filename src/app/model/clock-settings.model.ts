import { BaseModel } from "./base.model";
import { AlertMessageModel } from "./alert-message.model";

export class ClockSettingsModel extends BaseModel{
  private preparedness: ClockSettingModel;
  private responsePlans: ClockSettingModel;
  private riskMonitoring: { hazardsValidFor: ClockSettingModel, showLogsFrom: ClockSettingModel}

  
  // No validation required
  validate(excludedFields = []): AlertMessageModel {
    return null;
  }
}

export class ClockSettingModel extends BaseModel{
  private durationType: number;
  private value: number;

  // No validation required
  validate(excludedFields = []): AlertMessageModel {
    return null;
  }
}