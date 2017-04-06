import {PersonTitle, Country, Currency, UserType, StaffPosition, OfficeType} from "./Enums";
/**
 * Created by Fei on 08/03/2017.
 */
export class Constants {

  static TEMP_PASSWORD = "testtest";
  static ALERT_DURATION: number = 5000;
  /*PATHS*/
  static APP_STATUS = "/sand";

  static LOGIN_PATH = "/login";
  //system admin
  static SYSTEM_ADMIN_UID = "hoXTsvefEranzaSQTWbkhpBenLn2";
  static DEFAULT_MPA_PATH = "/system-admin/mpa";
  static SYSTEM_ADMIN_HOME = "/system-admin/agency";
  static SYSTEM_ADMIN_NETWORK_HOME = "/system-admin/network";

  static SYSTEM_ADMIN_ADD_NETWORK = "/system-admin/network/create";
  //agency admin
  static AGENCY_ADMIN_HOME = "/agency-admin/country-office";
  static AGENCY_ADMIN_ADD_STARFF = "/agency-admin/staff/create-edit-staff";
  static AGENCY_ADMIN_STARFF = "/agency-admin/staff";

  /*LIST VALUES FRO TRANSLATION*/
  static THRESHOLD_VALUE: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

  static PERSON_TITLE: string [] = ["GLOBAL.PERSON_TITLE.MR", "GLOBAL.PERSON_TITLE.MRS", "GLOBAL.PERSON_TITLE.MISS",
    "GLOBAL.PERSON_TITLE.DR", "GLOBAL.PERSON_TITLE.PROF"];
  static PERSON_TITLE_SELECTION: number[] = [PersonTitle.Mr, PersonTitle.Miss, PersonTitle.Dr];

  static COUNTRY: string[] = ["GLOBAL.COUNTRY.UK", "GLOBAL.COUNTRY.FRANCE", "GLOBAL.COUNTRY.GERMANY"];
  static COUNTRY_SELECTION = [Country.UK, Country.France, Country.Germany];

  static CATEGORY: string[] = ["SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.ALL", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY0", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY1",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY2", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY3", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY4",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY5", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY6", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY7",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY8", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY9"];

  static ACTION_LEVEL: string[] = ["GLOBAL.PREPAREDNESS_LEVEL.ALL", "GLOBAL.PREPAREDNESS_LEVEL.MPA", "GLOBAL.PREPAREDNESS_LEVEL.APA"];

  static CURRENCY: string[] = ["GBP", "EUR", "USD"];
  static CURRENCY_SELECTION = [Currency.GBP, Currency.EUR, Currency.USD];

  static USER_TYPE = ["Global Director", "Regional Director", "Country Director", "ERT Lead", "ERT", "Donor", "Global User", "Country Admin"];
  static USER_TYPE_SELECTION = [UserType.GlobalDirector, UserType.RegionalDirector, UserType.CountryDirector, UserType.ErtLeader, UserType.Ert, UserType.Donor, UserType.GlobalUser, UserType.CountryAdmin];

  static STAFF_POSITION = ["Office Director", "Office Staff"];
  static STAFF_POSITION_SELECTION = [StaffPosition.OfficeDirector, StaffPosition.OfficeStarff];

  static OFFICE_TYPE = ["Field Office", "Lab Office"];
  static OFFICE_TYPE_SELECTION = [OfficeType.FieldOffice, OfficeType.LabOffice];

  static NOTIFICATION_SETTINGS = ["Alert level changed", "Red alert request", "Update hazard indicator", "MPA/APA expired", "Response plan expired", "Response plan rejected"];
}

export enum FILE_SETTING {
  PDF = 0,
  DOC = 1,
  DOCX = 2,
  RTF = 3,
  JPEG = 4,
  PNG = 5,
  CSV = 6,
  XLS = 7,
  XLSX = 8,
  PPT = 9,
  PPTX = 10,
  TXT = 11,
  ODT = 12,
  TSV = 13
}


