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
  static DEFAULT_MPA_PATH = "/system-admin/mpa";
  static SYSTEM_ADMIN_HOME = "/system-admin/agency";
  static SYSTEM_ADMIN_NETWORK_HOME = "/system-admin/network";

  static SYSTEM_ADMIN_ADD_NETWORK = "/system-admin/network/create";
  //agency admin
  static AGENCY_ADMIN_HOME = "/agency-admin/country-office";
  static AGENCY_ADMIN_ADD_STARFF = "/agency-admin/staff/create-edit-staff";
  static AGENCY_ADMIN_STARFF = "/agency-admin/staff";
  static AGENCY_ADMIN_LOGO_MAX_SIZE = 2000000; //in bytes
  static AGENCY_ADMIN_LOGO_FILE_TYPES = ['image/jpeg','image/gif','image/png'];

  /*LIST VALUES FOR TRANSLATION*/
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

  static USER_TYPE = ["All users", "GLOBAL.USER_TYPE.GLOBAL_DIRECTOR", "GLOBAL.USER_TYPE.REGIONAL_DIRECTOR",
    "GLOBAL.USER_TYPE.COUNTRY_DIRECTORS", "GLOBAL.USER_TYPE.ERT_LEAD", "GLOBAL.USER_TYPE.ERT", "GLOBAL.USER_TYPE.DONOR",
    "GLOBAL.USER_TYPE.GLOBAL_USER", "GLOBAL.USER_TYPE.COUNTRY_ADMINS"];
  static USER_TYPE_SELECTION = [UserType.All, UserType.GlobalDirector, UserType.RegionalDirector, UserType.CountryDirector,
    UserType.ErtLeader, UserType.Ert, UserType.Donor, UserType.GlobalUser, UserType.CountryAdmin];

  static STAFF_POSITION = ["AGENCY_ADMIN.STAFF.ALL_POSITIONS", "AGENCY_ADMIN.STAFF.OFFICE_DIRECTOR", "AGENCY_ADMIN.STAFF.OFFICE_STAFF"];
  static STAFF_POSITION_SELECTION = [StaffPosition.All, StaffPosition.OfficeDirector, StaffPosition.OfficeStarff];

  static OFFICE_TYPE = ["AGENCY_ADMIN.STAFF.ALL_OFFICES", "AGENCY_ADMIN.STAFF.FIELD_OFFICE", "AGENCY_ADMIN.STAFF.LAB_OFFICE"];
  static OFFICE_TYPE_SELECTION = [OfficeType.All, OfficeType.FieldOffice, OfficeType.LabOffice];

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


