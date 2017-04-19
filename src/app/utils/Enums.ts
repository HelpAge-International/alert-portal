/**
 * Created by Sanjaya on 07/03/2017.
 */

export enum ActionType {
  chs = 0,
  mandated = 1,
  custom = 2
}

// TODO - Update when Ryan provides actual category names
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
  OfficeDirector = 0,
  OfficeStarff = 1
}

export enum UserType {
  GlobalDirector = 0,
  RegionalDirector = 1,
  CountryDirector = 2,
  ErtLeader = 3,
  Ert = 4,
  Donor = 5,
  GlobalUser = 6,
  CountryAdmin = 7
}

export enum OfficeType {
  FieldOffice = 0,
  LabOffice = 1
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
