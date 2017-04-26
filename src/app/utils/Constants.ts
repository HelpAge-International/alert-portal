import {PersonTitle, Country, Currency, UserType, StaffPosition, OfficeType, DurationType} from "./Enums";
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
  static AGENCY_ADMIN_LOGO_FILE_TYPES = ['image/jpeg', 'image/gif', 'image/png'];

  /*LIST VALUES FOR TRANSLATION*/
  static THRESHOLD_VALUE: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

  static PERSON_TITLE: string [] = ["GLOBAL.PERSON_TITLE.MR", "GLOBAL.PERSON_TITLE.MRS", "GLOBAL.PERSON_TITLE.MISS",
    "GLOBAL.PERSON_TITLE.DR", "GLOBAL.PERSON_TITLE.PROF"];
  static PERSON_TITLE_SELECTION: number[] = [PersonTitle.Mr, PersonTitle.Miss, PersonTitle.Dr];

  static COUNTRY: string[] = ["GLOBAL.COUNTRY.UK", "GLOBAL.COUNTRY.FRANCE", "GLOBAL.COUNTRY.GERMANY"];
  static COUNTRY_SELECTION = [Country.UK, Country.France, Country.Germany];

  static CATEGORY: string[] = [
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.ALL",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY0",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY1",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY2",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY3",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY4",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY5",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY6",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY7",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY8",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY9"];

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

  static MODULE_NAME = [
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.MINIMUM_PREP_ACTIONS",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.ADVANCED_PREP_ACTIONS",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.CHS_PREP_ACTIONS",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.HAZAR_PRIORITISATION",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.PREP_BUDGET",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.SEASONAL_CALENDAR",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.HAZARD_INDICATOR",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.COUNTRY_OFFICE_PROFILE",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.RESPONSE_PLANNING",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.GLOBAL_MAPS"
  ];

  static DURATION_TYPE = [
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.WEEKS",
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.MONTHS",
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.YEARS"
  ];
  static DURATION_TYPE_SELECTION = [DurationType.Week, DurationType.Month, DurationType.Year];
  static NOTIFICATION_SETTINGS = ["GLOBAL.NOTIFICATION_SETTING.ALERT_LEVEL_CHANGE", "GLOBAL.NOTIFICATION_SETTING.RED_ALERT_REQUEST",
    "GLOBAL.NOTIFICATION_SETTING.UPDATE_HAZARD", "GLOBAL.NOTIFICATION_SETTING.ACTION_EXPIRE",
    "GLOBAL.NOTIFICATION_SETTING.RESPONSE_PLAN_EXPIRE", "GLOBAL.NOTIFICATION_SETTING.RESPONSE_PLAN_REJECT"];

  static GROUP_PATH_AGENCY = ["globaldirector", "regionaldirector", "countrydirectors", "ertleads", "erts", "donor", "globaluser", "countryadmins"];

  /*
   * Response Plans
   */
  static HAZARD_SCENARIOS: string[] = [
    "RESPONSE_PLANS.HAZARD_SCENARIO0.HAZARD_SCENARIO0",
    "RESPONSE_PLANS.HAZARD_SCENARIO1.HAZARD_SCENARIO1",
    "RESPONSE_PLANS.HAZARD_SCENARIO2.HAZARD_SCENARIO2",
    "RESPONSE_PLANS.HAZARD_SCENARIO3.HAZARD_SCENARIO3",
    "RESPONSE_PLANS.HAZARD_SCENARIO4.HAZARD_SCENARIO4",
    "RESPONSE_PLANS.HAZARD_SCENARIO5.HAZARD_SCENARIO5",
    "RESPONSE_PLANS.HAZARD_SCENARIO6.HAZARD_SCENARIO6",
    "RESPONSE_PLANS.HAZARD_SCENARIO7.HAZARD_SCENARIO7",
    "RESPONSE_PLANS.HAZARD_SCENARIO8.HAZARD_SCENARIO8",
    "RESPONSE_PLANS.HAZARD_SCENARIO9.HAZARD_SCENARIO9",
    "RESPONSE_PLANS.HAZARD_SCENARIO10.HAZARD_SCENARIO10"
      ];

  static RESPONSE_PLANS_SECTION_SETTINGS = [
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.PLAN_DETAILS",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.PLAN_CONTEXT",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.BASIC_INFORMATION",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.ACTIVITY_SUMMARY",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.TARGET_POPULATION",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.EXPECTED_RESULTS",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.ACTIVITIES",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.MONITORING_ACC_LEARNING",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.DOUBLE_COUNTING",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.BUDGET"
  ];
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


