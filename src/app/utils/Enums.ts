/**
 * Created by Sanjaya on 07/03/2017.
 */

export enum ActionType {
  chs = 0,
  mandated = 1,
  custom = 2
}

// TODO - Update when Ryan provides actual Category names
export enum GenericActionCategory {
  ALL = 0,
  Category1 = 1,
  Category2 = 2,
  Category3 = 3,
  Category4 = 4,
  Category5 = 5,
  Category6 = 6,
  Category7 = 7,
  Category8 = 8,
  Category9 = 9,
  Category10 = 10
}

// TODO - Update when Ryan provides actual Hazard Scenario names
export enum HazardScenario {
  HazardScenario0 = 0,
  HazardScenario1 = 1,
  HazardScenario2 = 2,
  HazardScenario3 = 3,
  HazardScenario4 = 4,
  HazardScenario5 = 5,
  HazardScenario6 = 6,
  HazardScenario7 = 7,
  HazardScenario8 = 8,
  HazardScenario9 = 9,
  HazardScenario10 = 10
}

export enum ActionLevel {
  ALL = 0,
  MPA = 1,
  APA = 2
}

export enum PersonTitle {
  Mr = 0,
  Mrs = 1,
  Miss = 2,
  Dr = 3,
  Prof = 4
}

export enum FileType {
  MB = 0,
  GB = 1
}

export enum Country {
  UK = 0,
  France = 1,
  Germany = 2
}

export enum Currency {
  GBP = 0,
  EUR = 1,
  USD = 2
}

export enum StaffPosition {
  All = 0,
  OfficeDirector = 1,
  OfficeStarff = 2
}

export enum UserType {
  All = 0,
  GlobalDirector = 1,
  RegionalDirector = 2,
  CountryDirector = 3,
  ErtLeader = 4,
  Ert = 5,
  Donor = 6,
  GlobalUser = 7,
  CountryAdmin = 8
}

export enum OfficeType {
  All = 0,
  FieldOffice = 1,
  LabOffice = 2
}

export enum SkillType {
  Support = 0,
  Tech = 1
}

export enum NotificationSettingEvents {
  AlertLevelChanged = 0,
  RedAlertRequest = 1,
  UpdateHazard = 2,
  ActionExpired = 3,
  PlanExpired = 4,
  PlanRejected = 5
}

export enum Privacy {
  Public = 0,
  Private = 1,
  Network = 2
}

export enum DurationType {
  Week = 0,
  Month = 1,
  Year = 2
}

export enum Location {
  Philippines = 0,
  Malaysia = 1,
  Indonesia = 2
}

export enum ResponsePlanSesctionSettings {
  PlanDetails = 0,
  PlanContext = 1,
  BasicInformation = 2,
  ActivitySummary = 3,
  TargetPopulation = 4,
  ExpectedResults = 5,
  Activities = 6,
  MonitoringAccLearning = 7,
  DoubleCounting = 8,
  Budget = 9
}
