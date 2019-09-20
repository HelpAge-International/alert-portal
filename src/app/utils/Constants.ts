/**
 * Created by Fei on 08/03/2017.
 */
import {
  Countries, Currency, DurationType, OfficeType, PersonTitle, StaffPosition, UserType,
  AlertLevels, GenericActionCategory, HazardScenario
} from "./Enums";

export class Constants {
  //TODO CHANGE APP MODULE AS WELL FOR LIVE
  static APP_STATUS = "/test";
  static VERSION = "1.2.1.2";

  /* ENABLING THE MAINTENANCE PAGE */
  static SHOW_MAINTENANCE_PAGE: boolean = false;
  static MAINTENANCE_PAGE_URL: string = "/maintenance";

  static TEMP_PASSWORD = "testtest";
  static ALERT_DURATION: number = 5000;
  static ALERT_REDIRECT_DURATION: number = 1500;

  /*INFORM WORKFLOW ID*/
  static INFORM_WORKFLOW: number = 261;

  /*PATHS*/
  static LOGIN_PATH = "/login";
  // static COUNTRY_LEVELS_FILE = "/assets/json/country_levels.json";
  static COUNTRY_LEVELS_VALUES_FILE = "/assets/json/country_levels_values.json";

  //system admin
  static DEFAULT_MPA_PATH = "/system-admin/mpa";
  static SYSTEM_ADMIN_HOME = "/system-admin/agency";
  static SYSTEM_ADMIN_NETWORK_HOME = "/system-admin/network";
  static SYSTEM_ADMIN_ADD_NETWORK = "/system-admin/network/create";

  // Default system notification sender
  static DEFAULT_NOTIFICATION_SENDER = "ALERT System";

  //agency admin
  static AGENCY_ADMIN_HOME = "/agency-admin/country-office";
  static AGENCY_ADMIN_ADD_STARFF = "/agency-admin/staff/create-edit-staff";
  static AGENCY_ADMIN_STARFF = "/agency-admin/staff";
  static AGENCY_ADMIN_LOGO_MAX_SIZE = 2000000; //in bytes
  static AGENCY_ADMIN_LOGO_FILE_TYPES = ['image/jpeg', 'image/gif', 'image/png'];
  static DEFAULT_CLOCK_SETTINGS_DURATION_VAL = 1;

  //network admin
  static NETWORK_ADMIN_LOGO_MAX_SIZE = 2000000; //in bytes
  static NETWORK_ADMIN_LOGO_FILE_TYPES = ['image/jpeg', 'image/gif', 'image/png'];

  // country administrator
  static COUNTRY_ADMIN_HOME = "/dashboard";
  static COUNTRY_ADMIN_USER_TYPE = ["GLOBAL.USER_TYPE.ALL_USERS", "GLOBAL.USER_TYPE.NON_ALERT", "GLOBAL.USER_TYPE.COUNTRY_DIRECTORS", "GLOBAL.USER_TYPE.COUNTRY_USER",
    "GLOBAL.USER_TYPE.ERT_LEAD", "GLOBAL.USER_TYPE.ERT"];
  static COUNTRY_ADMIN_USER_TYPE_SELECTION = [UserType.All, UserType.NonAlert, UserType.CountryDirector, UserType.CountryUser,
    UserType.ErtLeader, UserType.Ert];
  static COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION = [UserType.All, UserType.CountryDirector, UserType.CountryAdmin,
    UserType.ErtLeader, UserType.Ert, UserType.Donor];
  static COUNTRY_ADMIN_MESSAGES_USER_TYPE_NODES = ["countryallusersgroup", "partner", "countrydirectors", "countryadmins", "ertleads", "erts", "donor"];
  static APPROVAL_STATUS = ["Requires Submission", "Waiting Approval", "Approved", "Needs Reviewing"];

  // local agency administrator

  static LOCAL_AGENCY_ADMIN_HOME = "/local-agency/dashboard";
  static LOCAL_AGENCY_ADMIN_USER_TYPE = ["GLOBAL.USER_TYPE.ALL_USERS", "GLOBAL.USER_TYPE.NON_ALERT", "GLOBAL.USER_TYPE.LOCAL_AGENCY_DIRECTORS", "GLOBAL.USER_TYPE.AGENCY_USER",
    "GLOBAL.USER_TYPE.ERT_LEAD", "GLOBAL.USER_TYPE.ERT", "GLOBAL.USER_TYPE.LOCAL_AGENCY_ADMIN"];
  static LOCAL_AGENCY_ADMIN_USER_TYPE_SELECTION = [UserType.All, UserType.NonAlert, UserType.LocalAgencyDirector, UserType.AgencyUser,
    UserType.ErtLeader, UserType.Ert, UserType.LocalAgencyAdmin];
  static LOCAL_AGENCY_ADMIN_MESSAGES_USER_TYPE_SELECTION = [UserType.All, UserType.LocalAgencyDirector, UserType.LocalAgencyAdmin,
    UserType.ErtLeader, UserType.Ert, UserType.Donor];
  static LOCAL_AGENCY_ADMIN_MESSAGES_USER_TYPE_NODES = ["countryallusersgroup", "partner", "localagencydirectors", "localagencyadmins", "ertleads", "erts", "donor"];



  // Global director / Regional director
  static G_OR_R_DIRECTOR_DASHBOARD = "/director";

  // Donor
  static DONOR_HOME = "/donor-module";

  /*LIST VALUES FOR TRANSLATION*/
  static THRESHOLD_VALUE: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

  static PERSON_TITLE: string[] = [
    "GLOBAL.PERSON_TITLE.MR",
    "GLOBAL.PERSON_TITLE.MRS",
    "GLOBAL.PERSON_TITLE.MISS",
    "GLOBAL.PERSON_TITLE.MS",
    "GLOBAL.PERSON_TITLE.DR",
    "GLOBAL.PERSON_TITLE.PROF"
  ];

  static PERSON_TITLE_SELECTION: number[] = [
    PersonTitle.Mr,
    PersonTitle.Mrs,
    PersonTitle.Miss,
    PersonTitle.Ms,
    PersonTitle.Dr,
    PersonTitle.Prof
  ];

  static CATEGORY: string[] = [
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.All",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.OfficeAdministration",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.Finance",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.ITFieldCommunications",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.Logistics",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CommunicationsMedia",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.HumanResources",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.DonorFundingReporting",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.Accountability",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.Security",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.Programmes",
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.EmergencyResponseTeamManagement"];

  static CATEGORY_SELECTION: GenericActionCategory[] = [
    GenericActionCategory.All,
    GenericActionCategory.OfficeAdministration,
    GenericActionCategory.Finance,
    GenericActionCategory.ITFieldCommunications,
    GenericActionCategory.Logistics,
    GenericActionCategory.CommunicationsMedia,
    GenericActionCategory.HumanResources,
    GenericActionCategory.DonorFundingReporting,
    GenericActionCategory.Accountability,
    GenericActionCategory.Security,
    GenericActionCategory.Programmes,
    GenericActionCategory.EmergencyResponseTeamManagement];

  static ACTION_LEVEL: string[] = ["GLOBAL.PREPAREDNESS_LEVEL.ALL", "GLOBAL.PREPAREDNESS_LEVEL.MPA", "GLOBAL.PREPAREDNESS_LEVEL.APA"];
  static ACTION_STATUS: string[] = ["GLOBAL.ACTION_STATUS.EXPIRED", "GLOBAL.ACTION_STATUS.IN_PROGRESS", "GLOBAL.ACTION_STATUS.COMPLETED", "GLOBAL.DEACTIVE", "GLOBAL.ACTION_STATUS.ARCHIVED", "GLOBAL.ACTION_STATUS.UNASSIGNED"];
  static ACTION_TYPE: string[] = ["GLOBAL.ACTION_TYPE.CHS", "GLOBAL.ACTION_TYPE.MANDATED", "GLOBAL.ACTION_TYPE.CUSTOM"];

  static CURRENCY: string[] = [
    "GBP",
    "EUR",
    "USD",
    "KSH",
    "MZN",
    "CDF",
    "PHP",
    "BDT",
    "PKR"
  ];
  static CURRENCY_SYMBOL: string[] = [
    "£",
    "€",
    "$",
    "KSh",
    "MT",
    "FC",
    "₱",
    "৳",
    "₨"
  ];
  static CURRENCY_SELECTION = [
    Currency.GBP,
    Currency.EUR,
    Currency.USD,
    Currency.KSH,
    Currency.MZN,
    Currency.CDF,
    Currency.PHP,
    Currency.BDT,
    Currency.PKR
  ];


  //agency add staff
  static USER_TYPE = ["GLOBAL.USER_TYPE.ALL_USERS", "GLOBAL.USER_TYPE.GLOBAL_DIRECTOR", "GLOBAL.USER_TYPE.REGIONAL_DIRECTOR",
    "GLOBAL.USER_TYPE.COUNTRY_DIRECTORS", "GLOBAL.USER_TYPE.ERT_LEAD", "GLOBAL.USER_TYPE.ERT", "GLOBAL.USER_TYPE.DONOR",
    "AGENCY_ADMIN.STAFF.GLOBAL_USERS", "GLOBAL.USER_TYPE.COUNTRY_ADMINS", "GLOBAL.USER_TYPE.NON_ALERT", "GLOBAL.USER_TYPE.COUNTRY_USER"];

  static USER_TYPE_SELECTION = [UserType.All, UserType.GlobalDirector, UserType.RegionalDirector, UserType.CountryDirector,
    UserType.ErtLeader, UserType.Ert, UserType.Donor, UserType.GlobalUser, UserType.CountryAdmin, UserType.NonAlert, UserType.CountryUser];

  static GROUP_PATH_AGENCY = ["globaldirector", "regionaldirector", "countrydirectors", "ertleads", "erts", "donor", "globaluser", "countryadmins", "non-alert", "countryuser"];

  static STAFF_POSITION = ["AGENCY_ADMIN.STAFF.ALL_POSITIONS", "AGENCY_ADMIN.STAFF.OFFICE_DIRECTOR", "AGENCY_ADMIN.STAFF.OFFICE_STAFF"];
  static STAFF_POSITION_SELECTION = [StaffPosition.All, StaffPosition.OfficeDirector, StaffPosition.OfficeStarff];

  static OFFICE_TYPE = ["AGENCY_ADMIN.STAFF.ALL_OFFICES", "AGENCY_ADMIN.STAFF.FIELD_OFFICE", "AGENCY_ADMIN.STAFF.MAIN_OFFICE"];
  static OFFICE_TYPE_SELECTION = [OfficeType.All, OfficeType.FieldOffice, OfficeType.MainOffice];

  // Clock settings
  static MONTH_MAX_NUMBER: number = 11;
  static YEAR_MAX_NUMBER: number = 10;
  static DURATION_LIST_WEEK = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
    51];
  static DURATION_LIST_MONTH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  static DURATION_LIST_YEAR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


  static MODULE_NAME = [
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.MINIMUM_PREP_ACTIONS",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.ADVANCED_PREP_ACTIONS",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.CHS_PREP_ACTIONS",
    "RISK_MONITORING_TEXT",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.COUNTRY_OFFICE_PROFILE",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.RESPONSE_PLANNING",
    "CONFLICT_INDICATORS"
  ];

  static MODULE_NAME_NETWORK_COUNTRY = [
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.MINIMUM_PREP_ACTIONS",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.ADVANCED_PREP_ACTIONS",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.CHS_PREP_ACTIONS",
    "RISK_MONITORING_TEXT",
    "CONFLICT_INDICATORS",
    "NETWORK_OFFICE_PROFILE",
    "AGENCY_ADMIN.SETTINGS.MODULE_NAME.RESPONSE_PLANNING"
  ];

  static DETAILED_DURATION_TYPE = [
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.HOURS",
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.DAYS",
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.WEEKS",
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.MONTHS",
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.YEARS"
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

  static HAZARD_SCENARIOS: string[] = [
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO0",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO1",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO2",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO3",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO4",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO5",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO6",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO7",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO8",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO9",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO10",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO11",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO12",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO13",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO14",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO15",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO16",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO17",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO18",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO19",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO20",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO21",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO22",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO23",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO24",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO25",
    "GLOBAL.HAZARD_SCENARIOS.HAZARD_SCENARIO26"
  ];

  static HAZARD_SCENARIO_ENUM_LIST = [
    HazardScenario.HazardScenario0,
    HazardScenario.HazardScenario1,
    HazardScenario.HazardScenario2,
    HazardScenario.HazardScenario3,
    HazardScenario.HazardScenario4,
    HazardScenario.HazardScenario5,
    HazardScenario.HazardScenario6,
    HazardScenario.HazardScenario7,
    HazardScenario.HazardScenario8,
    HazardScenario.HazardScenario9,
    HazardScenario.HazardScenario10,
    HazardScenario.HazardScenario11,
    HazardScenario.HazardScenario12,
    HazardScenario.HazardScenario13,
    HazardScenario.HazardScenario14,
    HazardScenario.HazardScenario15,
    HazardScenario.HazardScenario16,
    HazardScenario.HazardScenario17,
    HazardScenario.HazardScenario18,
    HazardScenario.HazardScenario19,
    HazardScenario.HazardScenario20,
    HazardScenario.HazardScenario21,
    HazardScenario.HazardScenario22,
    HazardScenario.HazardScenario23,
    HazardScenario.HazardScenario24,
    HazardScenario.HazardScenario25,
    HazardScenario.HazardScenario26,
  ];


  /*
   * Response Plans
   */

  static MAX_BULLET_POINTS_VAL_1: number = 3;
  static MAX_BULLET_POINTS_VAL_2: number = 5;

  static RESPONSE_PLANS_SECTION_SETTINGS = [
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.PLAN_DETAILS.TITLE_TEXT",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.PLAN_CONTEXT",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.BASIC_INFORMATION",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ACTIVITY_SUMMARY.TITLE_TEXT",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.TARGET_POPULATION.TITLE_TEXT",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.EXPECTED_RESULTS",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ACTIVITIES.TITLE_TEXT",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.MONITORING_ACC_LEARNING",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.DOUBLE_COUNTING",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.BUDGET"
  ];

  static RESPONSE_PLANS_SECTION_SETTINGS_NETWORK = [
    "NETWORK.NETWORK_AGENCIES",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.PLAN_DETAILS.TITLE_TEXT",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.PLAN_CONTEXT",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.BASIC_INFORMATION",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ACTIVITY_SUMMARY.TITLE_TEXT",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.TARGET_POPULATION.TITLE_TEXT",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.EXPECTED_RESULTS",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.ACTIVITIES.TITLE_TEXT",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.MONITORING_ACC_LEARNING",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.DOUBLE_COUNTING",
    "AGENCY_ADMIN.SETTINGS.RESPONSE_PLAN_SECTION_SETTINGS.BUDGET"
  ];

  static RESPONSE_PLANS_SECTORS = [
    "SECTOR_WASH",
    "SECTOR_HEALTH",
    "SECTOR_SHELTER",
    "SECTOR_NUTRITION",
    "SECTOR_FOOD_SECURITY_LIVELIHOOD",
    "SECTOR_PROTECTION",
    "SECTOR_EDUCATION",
    "SECTOR_CAMP_MANAGEMENT",
    "SECTOR_OTHER"
  ];

  static RESPONSE_PLANS_SECTORS_ICONS = [
    "SECTOR_WASH",
    "SECTOR_HEALTH",
    "SECTOR_SHELTER",
    "SECTOR_NUTRITION",
    "SECTOR_FOOD_SECURITY_LIVELIHOOD",
    "SECTOR_PROTECTION",
    "SECTOR_EDUCATION",
    "SECTOR_CAMP_MANAGEMENT",
    "SECTOR_OTHER"
  ];

  static RESPONSE_PLAN_STATUS = ["RESPONSE_PLANS.HOME.IN_PROGRESS", "RESPONSE_PLANS.HOME.WAITING_APPROVAL", "RESPONSE_PLANS.HOME.APPROVED", "RESPONSE_PLANS.HOME.NEEDS_REVIEWING"]

  static RESPONSE_PLAN_COUNTRY_PRESENCE = ["CURRENT_PROGRAMMES", "PRE_EXISITING_PARTNER", "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.BASIC_INFORMATION.NO_PRE-EXISTING_PRESENCE"]
  static RESPONSE_PLAN_METHOD = ["DIRECTLY_THROUGH_STAFF", "WORKING_WITH_PARTNERS", "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.BASIC_INFORMATION.WORKING_WITH_BOTH"]

  static DOCUMENT_TYPE = [
    "MPA",
    "APA",
    "RESPONSE_PLAN",
    "AGENCY_ADMIN.SETTINGS.DOCUMENT_TYPE.HAZARD_DOCUMENT"
  ];

  static COUNTRY_SELECTION = [
    Countries.AF,
    Countries.AX,
    Countries.AL,
    Countries.DZ,
    Countries.AS,
    Countries.AD,
    Countries.AO,
    Countries.AI,
    Countries.AQ,
    Countries.AG,
    Countries.AR,
    Countries.AM,
    Countries.AW,
    Countries.AU,
    Countries.AT,
    Countries.AZ,
    Countries.BS,
    Countries.BH,
    Countries.BD,
    Countries.BB,
    Countries.BY,
    Countries.BE,
    Countries.BZ,
    Countries.BJ,
    Countries.BM,
    Countries.BT,
    Countries.BO,
    Countries.BQ,
    Countries.BA,
    Countries.BW,
    Countries.BV,
    Countries.BR,
    Countries.IO,
    Countries.BN,
    Countries.BG,
    Countries.BF,
    Countries.BI,
    Countries.KH,
    Countries.CM,
    Countries.CA,
    Countries.CV,
    Countries.KY,
    Countries.CF,
    Countries.TD,
    Countries.CL,
    Countries.CN,
    Countries.CX,
    Countries.CC,
    Countries.CO,
    Countries.KM,
    Countries.CG,
    Countries.CD,
    Countries.CK,
    Countries.CR,
    Countries.CI,
    Countries.HR,
    Countries.CU,
    Countries.CW,
    Countries.CY,
    Countries.CZ,
    Countries.DK,
    Countries.DJ,
    Countries.DM,
    Countries.DO,
    Countries.EC,
    Countries.EG,
    Countries.SV,
    Countries.GQ,
    Countries.ER,
    Countries.EE,
    Countries.ET,
    Countries.FK,
    Countries.FO,
    Countries.FJ,
    Countries.FI,
    Countries.FR,
    Countries.GF,
    Countries.PF,
    Countries.TF,
    Countries.GA,
    Countries.GM,
    Countries.GE,
    Countries.DE,
    Countries.GH,
    Countries.GI,
    Countries.GR,
    Countries.GL,
    Countries.GD,
    Countries.GP,
    Countries.GU,
    Countries.GT,
    Countries.GG,
    Countries.GN,
    Countries.GW,
    Countries.GY,
    Countries.HT,
    Countries.HM,
    Countries.VA,
    Countries.HN,
    Countries.HK,
    Countries.HU,
    Countries.IS,
    Countries.IN,
    Countries.ID,
    Countries.IR,
    Countries.IQ,
    Countries.IE,
    Countries.IM,
    Countries.IL,
    Countries.IT,
    Countries.JM,
    Countries.JP,
    Countries.JE,
    Countries.JO,
    Countries.KZ,
    Countries.KE,
    Countries.KI,
    Countries.KP,
    Countries.KR,
    Countries.KW,
    Countries.KG,
    Countries.LA,
    Countries.LV,
    Countries.LB,
    Countries.LS,
    Countries.LR,
    Countries.LY,
    Countries.LI,
    Countries.LT,
    Countries.LU,
    Countries.MO,
    Countries.MK,
    Countries.MG,
    Countries.MW,
    Countries.MY,
    Countries.MV,
    Countries.ML,
    Countries.MT,
    Countries.MH,
    Countries.MQ,
    Countries.MR,
    Countries.MU,
    Countries.YT,
    Countries.MX,
    Countries.FM,
    Countries.MD,
    Countries.MC,
    Countries.MN,
    Countries.ME,
    Countries.MS,
    Countries.MA,
    Countries.MZ,
    Countries.MM,
    Countries.NA,
    Countries.NR,
    Countries.NP,
    Countries.NL,
    Countries.NC,
    Countries.NZ,
    Countries.NI,
    Countries.NE,
    Countries.NG,
    Countries.NU,
    Countries.NF,
    Countries.MP,
    Countries.NO,
    Countries.OM,
    Countries.PK,
    Countries.PW,
    Countries.PS,
    Countries.PA,
    Countries.PG,
    Countries.PY,
    Countries.PE,
    Countries.PH,
    Countries.PN,
    Countries.PL,
    Countries.PT,
    Countries.PR,
    Countries.QA,
    Countries.RE,
    Countries.RO,
    Countries.RU,
    Countries.RW,
    Countries.BL,
    Countries.SH,
    Countries.KN,
    Countries.LC,
    Countries.MF,
    Countries.PM,
    Countries.VC,
    Countries.WS,
    Countries.SM,
    Countries.ST,
    Countries.SA,
    Countries.SN,
    Countries.RS,
    Countries.SC,
    Countries.SL,
    Countries.SG,
    Countries.SX,
    Countries.SK,
    Countries.SI,
    Countries.SB,
    Countries.SO,
    Countries.ZA,
    Countries.GS,
    Countries.SS,
    Countries.ES,
    Countries.LK,
    Countries.SD,
    Countries.SR,
    Countries.SJ,
    Countries.SZ,
    Countries.SE,
    Countries.CH,
    Countries.SY,
    Countries.TW,
    Countries.TJ,
    Countries.TZ,
    Countries.TH,
    Countries.TL,
    Countries.TG,
    Countries.TK,
    Countries.TO,
    Countries.TT,
    Countries.TN,
    Countries.TR,
    Countries.TM,
    Countries.TC,
    Countries.TV,
    Countries.UG,
    Countries.UA,
    Countries.AE,
    Countries.GB,
    Countries.US,
    Countries.UM,
    Countries.UY,
    Countries.UZ,
    Countries.VU,
    Countries.VE,
    Countries.VN,
    Countries.VG,
    Countries.VI,
    Countries.WF,
    Countries.EH,
    Countries.YE,
    Countries.ZM,
    Countries.ZW
  ];

  static COUNTRIES = [
    "GLOBAL.COUNTRIES.AF",
    "GLOBAL.COUNTRIES.AX",
    "GLOBAL.COUNTRIES.AL",
    "GLOBAL.COUNTRIES.DZ",
    "GLOBAL.COUNTRIES.AS",
    "GLOBAL.COUNTRIES.AD",
    "GLOBAL.COUNTRIES.AO",
    "GLOBAL.COUNTRIES.AI",
    "GLOBAL.COUNTRIES.AQ",
    "GLOBAL.COUNTRIES.AG",
    "GLOBAL.COUNTRIES.AR",
    "GLOBAL.COUNTRIES.AM",
    "GLOBAL.COUNTRIES.AW",
    "GLOBAL.COUNTRIES.AU",
    "GLOBAL.COUNTRIES.AT",
    "GLOBAL.COUNTRIES.AZ",
    "GLOBAL.COUNTRIES.BS",
    "GLOBAL.COUNTRIES.BH",
    "GLOBAL.COUNTRIES.BD",
    "GLOBAL.COUNTRIES.BB",
    "GLOBAL.COUNTRIES.BY",
    "GLOBAL.COUNTRIES.BE",
    "GLOBAL.COUNTRIES.BZ",
    "GLOBAL.COUNTRIES.BJ",
    "GLOBAL.COUNTRIES.BM",
    "GLOBAL.COUNTRIES.BT",
    "GLOBAL.COUNTRIES.BO",
    "GLOBAL.COUNTRIES.BQ",
    "GLOBAL.COUNTRIES.BA",
    "GLOBAL.COUNTRIES.BW",
    "GLOBAL.COUNTRIES.BV",
    "GLOBAL.COUNTRIES.BR",
    "GLOBAL.COUNTRIES.IO",
    "GLOBAL.COUNTRIES.BN",
    "GLOBAL.COUNTRIES.BG",
    "GLOBAL.COUNTRIES.BF",
    "GLOBAL.COUNTRIES.BI",
    "GLOBAL.COUNTRIES.KH",
    "GLOBAL.COUNTRIES.CM",
    "GLOBAL.COUNTRIES.CA",
    "GLOBAL.COUNTRIES.CV",
    "GLOBAL.COUNTRIES.KY",
    "GLOBAL.COUNTRIES.CF",
    "GLOBAL.COUNTRIES.TD",
    "GLOBAL.COUNTRIES.CL",
    "GLOBAL.COUNTRIES.CN",
    "GLOBAL.COUNTRIES.CX",
    "GLOBAL.COUNTRIES.CC",
    "GLOBAL.COUNTRIES.CO",
    "GLOBAL.COUNTRIES.KM",
    "GLOBAL.COUNTRIES.CG",
    "GLOBAL.COUNTRIES.CD",
    "GLOBAL.COUNTRIES.CK",
    "GLOBAL.COUNTRIES.CR",
    "GLOBAL.COUNTRIES.CI",
    "GLOBAL.COUNTRIES.HR",
    "GLOBAL.COUNTRIES.CU",
    "GLOBAL.COUNTRIES.CW",
    "GLOBAL.COUNTRIES.CY",
    "GLOBAL.COUNTRIES.CZ",
    "GLOBAL.COUNTRIES.DK",
    "GLOBAL.COUNTRIES.DJ",
    "GLOBAL.COUNTRIES.DM",
    "GLOBAL.COUNTRIES.DO",
    "GLOBAL.COUNTRIES.EC",
    "GLOBAL.COUNTRIES.EG",
    "GLOBAL.COUNTRIES.SV",
    "GLOBAL.COUNTRIES.GQ",
    "GLOBAL.COUNTRIES.ER",
    "GLOBAL.COUNTRIES.EE",
    "GLOBAL.COUNTRIES.ET",
    "GLOBAL.COUNTRIES.FK",
    "GLOBAL.COUNTRIES.FO",
    "GLOBAL.COUNTRIES.FJ",
    "GLOBAL.COUNTRIES.FI",
    "GLOBAL.COUNTRIES.FR",
    "GLOBAL.COUNTRIES.GF",
    "GLOBAL.COUNTRIES.PF",
    "GLOBAL.COUNTRIES.TF",
    "GLOBAL.COUNTRIES.GA",
    "GLOBAL.COUNTRIES.GM",
    "GLOBAL.COUNTRIES.GE",
    "GLOBAL.COUNTRIES.DE",
    "GLOBAL.COUNTRIES.GH",
    "GLOBAL.COUNTRIES.GI",
    "GLOBAL.COUNTRIES.GR",
    "GLOBAL.COUNTRIES.GL",
    "GLOBAL.COUNTRIES.GD",
    "GLOBAL.COUNTRIES.GP",
    "GLOBAL.COUNTRIES.GU",
    "GLOBAL.COUNTRIES.GT",
    "GLOBAL.COUNTRIES.GG",
    "GLOBAL.COUNTRIES.GN",
    "GLOBAL.COUNTRIES.GW",
    "GLOBAL.COUNTRIES.GY",
    "GLOBAL.COUNTRIES.HT",
    "GLOBAL.COUNTRIES.HM",
    "GLOBAL.COUNTRIES.VA",
    "GLOBAL.COUNTRIES.HN",
    "GLOBAL.COUNTRIES.HK",
    "GLOBAL.COUNTRIES.HU",
    "GLOBAL.COUNTRIES.IS",
    "GLOBAL.COUNTRIES.IN",
    "GLOBAL.COUNTRIES.ID",
    "GLOBAL.COUNTRIES.IR",
    "GLOBAL.COUNTRIES.IQ",
    "GLOBAL.COUNTRIES.IE",
    "GLOBAL.COUNTRIES.IM",
    "GLOBAL.COUNTRIES.IL",
    "GLOBAL.COUNTRIES.IT",
    "GLOBAL.COUNTRIES.JM",
    "GLOBAL.COUNTRIES.JP",
    "GLOBAL.COUNTRIES.JE",
    "GLOBAL.COUNTRIES.JO",
    "GLOBAL.COUNTRIES.KZ",
    "GLOBAL.COUNTRIES.KE",
    "GLOBAL.COUNTRIES.KI",
    "GLOBAL.COUNTRIES.KP",
    "GLOBAL.COUNTRIES.KR",
    "GLOBAL.COUNTRIES.KW",
    "GLOBAL.COUNTRIES.KG",
    "GLOBAL.COUNTRIES.LA",
    "GLOBAL.COUNTRIES.LV",
    "GLOBAL.COUNTRIES.LB",
    "GLOBAL.COUNTRIES.LS",
    "GLOBAL.COUNTRIES.LR",
    "GLOBAL.COUNTRIES.LY",
    "GLOBAL.COUNTRIES.LI",
    "GLOBAL.COUNTRIES.LT",
    "GLOBAL.COUNTRIES.LU",
    "GLOBAL.COUNTRIES.MO",
    "GLOBAL.COUNTRIES.MK",
    "GLOBAL.COUNTRIES.MG",
    "GLOBAL.COUNTRIES.MW",
    "GLOBAL.COUNTRIES.MY",
    "GLOBAL.COUNTRIES.MV",
    "GLOBAL.COUNTRIES.ML",
    "GLOBAL.COUNTRIES.MT",
    "GLOBAL.COUNTRIES.MH",
    "GLOBAL.COUNTRIES.MQ",
    "GLOBAL.COUNTRIES.MR",
    "GLOBAL.COUNTRIES.MU",
    "GLOBAL.COUNTRIES.YT",
    "GLOBAL.COUNTRIES.MX",
    "GLOBAL.COUNTRIES.FM",
    "GLOBAL.COUNTRIES.MD",
    "GLOBAL.COUNTRIES.MC",
    "GLOBAL.COUNTRIES.MN",
    "GLOBAL.COUNTRIES.ME",
    "GLOBAL.COUNTRIES.MS",
    "GLOBAL.COUNTRIES.MA",
    "GLOBAL.COUNTRIES.MZ",
    "GLOBAL.COUNTRIES.MM",
    "GLOBAL.COUNTRIES.NA",
    "GLOBAL.COUNTRIES.NR",
    "GLOBAL.COUNTRIES.NP",
    "GLOBAL.COUNTRIES.NL",
    "GLOBAL.COUNTRIES.NC",
    "GLOBAL.COUNTRIES.NZ",
    "GLOBAL.COUNTRIES.NI",
    "GLOBAL.COUNTRIES.NE",
    "GLOBAL.COUNTRIES.NG",
    "GLOBAL.COUNTRIES.NU",
    "GLOBAL.COUNTRIES.NF",
    "GLOBAL.COUNTRIES.MP",
    "GLOBAL.COUNTRIES.NO",
    "GLOBAL.COUNTRIES.OM",
    "GLOBAL.COUNTRIES.PK",
    "GLOBAL.COUNTRIES.PW",
    "GLOBAL.COUNTRIES.PS",
    "GLOBAL.COUNTRIES.PA",
    "GLOBAL.COUNTRIES.PG",
    "GLOBAL.COUNTRIES.PY",
    "GLOBAL.COUNTRIES.PE",
    "GLOBAL.COUNTRIES.PH",
    "GLOBAL.COUNTRIES.PN",
    "GLOBAL.COUNTRIES.PL",
    "GLOBAL.COUNTRIES.PT",
    "GLOBAL.COUNTRIES.PR",
    "GLOBAL.COUNTRIES.QA",
    "GLOBAL.COUNTRIES.RE",
    "GLOBAL.COUNTRIES.RO",
    "GLOBAL.COUNTRIES.RU",
    "GLOBAL.COUNTRIES.RW",
    "GLOBAL.COUNTRIES.BL",
    "GLOBAL.COUNTRIES.SH",
    "GLOBAL.COUNTRIES.KN",
    "GLOBAL.COUNTRIES.LC",
    "GLOBAL.COUNTRIES.MF",
    "GLOBAL.COUNTRIES.PM",
    "GLOBAL.COUNTRIES.VC",
    "GLOBAL.COUNTRIES.WS",
    "GLOBAL.COUNTRIES.SM",
    "GLOBAL.COUNTRIES.ST",
    "GLOBAL.COUNTRIES.SA",
    "GLOBAL.COUNTRIES.SN",
    "GLOBAL.COUNTRIES.RS",
    "GLOBAL.COUNTRIES.SC",
    "GLOBAL.COUNTRIES.SL",
    "GLOBAL.COUNTRIES.SG",
    "GLOBAL.COUNTRIES.SX",
    "GLOBAL.COUNTRIES.SK",
    "GLOBAL.COUNTRIES.SI",
    "GLOBAL.COUNTRIES.SB",
    "GLOBAL.COUNTRIES.SO",
    "GLOBAL.COUNTRIES.ZA",
    "GLOBAL.COUNTRIES.GS",
    "GLOBAL.COUNTRIES.SS",
    "GLOBAL.COUNTRIES.ES",
    "GLOBAL.COUNTRIES.LK",
    "GLOBAL.COUNTRIES.SD",
    "GLOBAL.COUNTRIES.SR",
    "GLOBAL.COUNTRIES.SJ",
    "GLOBAL.COUNTRIES.SZ",
    "GLOBAL.COUNTRIES.SE",
    "GLOBAL.COUNTRIES.CH",
    "GLOBAL.COUNTRIES.SY",
    "GLOBAL.COUNTRIES.TW",
    "GLOBAL.COUNTRIES.TJ",
    "GLOBAL.COUNTRIES.TZ",
    "GLOBAL.COUNTRIES.TH",
    "GLOBAL.COUNTRIES.TL",
    "GLOBAL.COUNTRIES.TG",
    "GLOBAL.COUNTRIES.TK",
    "GLOBAL.COUNTRIES.TO",
    "GLOBAL.COUNTRIES.TT",
    "GLOBAL.COUNTRIES.TN",
    "GLOBAL.COUNTRIES.TR",
    "GLOBAL.COUNTRIES.TM",
    "GLOBAL.COUNTRIES.TC",
    "GLOBAL.COUNTRIES.TV",
    "GLOBAL.COUNTRIES.UG",
    "GLOBAL.COUNTRIES.UA",
    "GLOBAL.COUNTRIES.AE",
    "GLOBAL.COUNTRIES.GB",
    "GLOBAL.COUNTRIES.US",
    "GLOBAL.COUNTRIES.UM",
    "GLOBAL.COUNTRIES.UY",
    "GLOBAL.COUNTRIES.UZ",
    "GLOBAL.COUNTRIES.VU",
    "GLOBAL.COUNTRIES.VE",
    "GLOBAL.COUNTRIES.VN",
    "GLOBAL.COUNTRIES.VG",
    "GLOBAL.COUNTRIES.VI",
    "GLOBAL.COUNTRIES.WF",
    "GLOBAL.COUNTRIES.EH",
    "GLOBAL.COUNTRIES.YE",
    "GLOBAL.COUNTRIES.ZM",
    "GLOBAL.COUNTRIES.ZW"
  ];

  static HAZARD_CATEGORY_ICON_CLASS = [
    "Icon--earthquake",
    "Icon--cyclone",
    "Icon--drought"
  ];

  static ALERT_LEVELS = [
    "GLOBAL.ALERT_LEVELS.GREEN",
    "GLOBAL.ALERT_LEVELS.AMBER",
    "GLOBAL.ALERT_LEVELS.RED",
    "GLOBAL.ALERT_LEVELS.ALL"
  ];

  static ALERT_COLORS = [
    "green",
    "yellow",
    "red"
  ];

  static GEO_LOCATION = [
    "RISK_MONITORING.MAIN_PAGE.NATIONAL",
    "RISK_MONITORING.MAIN_PAGE.SUBNATIONAL"
  ];

  static ALERT_IMAGES = [
    "green",
    "amber",
    "red"
  ];

  static ALERTS = [
    "GLOBAL.ALERTS.GREEN",
    "GLOBAL.ALERTS.AMBER",
    "GLOBAL.ALERTS.RED"
  ];

  static ALERT_LEVELS_LIST = [
    AlertLevels.Green,
    AlertLevels.Amber,
    AlertLevels.Red,
    AlertLevels.All
  ];

  static MEDIA_TYPES = [
    "PHOTOGRAPHIC",
    "VIDEO",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.MON_ACC_LEA.PHOTOGRAPHIC_AND_VIDEO"
  ];

  static PARTNER_STATUS = [
    "COUNTRY_ADMIN.PARTNER.STATUS_AWAITING_VALIDATION",
    "COUNTRY_ADMIN.PARTNER.STATUS_VALIDATED",
    "Active",
    "Inactive"
  ];
  // All = 0,
  // GlobalDirector = 1,
  // RegionalDirector = 2,
  // CountryDirector = 3,
  // ErtLeader = 4,
  // Ert = 5,
  // Donor = 6,
  // GlobalUser = 7,
  // CountryAdmin = 8,
  // NonAlert = 9
  static USER_TYPE_PATH = [
    null,
    null,
    null,
    "countryDirector",
    null,
    null,
    null,
    null,
    "administratorCountry",
    null
  ];

  static ALERT_BUTTON_CLASS = [
    "success",
    "warning",
    "danger"
  ];

  static SCENARIO_COLORS = [
    '#D0011B',
    '#F6A623',
    '#F8E81C',
    '#7ED321',
    '#4990E2',
    '#50E3C2',
    '#EA5166',
    '#64929B',
    '#417505',
    '#41749C',
    '#B8E986',
    '#9012FE'
  ];

  static NETWORK_USER_PATHS = [
    "administratorNetwork",
    "administratorNetworkCountry"
  ];

  static USER_PATHS = [
    ,
    'globalDirector',
    'regionDirector',
    'countryDirector',
    'ertLeader',
    'ert',
    'donor',
    'globalUser',
    'administratorCountry',
    ,
    'countryUser',
    'administratorAgency',
    ,
    'partnerUser',
    ,
    'administratorLocalAgency',
    'localAgencyDirector'
  ];

  // Nodes List, used for saving Notes
  static PARTNER_ORGANISATION_NODE = '/partnerOrganisation/{id}/notes';
  static EQUIPMENT_NODE = '/countryOfficeProfile/equipment/{countryId}/{id}/notes';
  static EQUIPMENT_NODE_LOCAL_AGENCY = '/localAgencyProfile/equipment/{agencyId}/{id}/notes';
  static SURGE_EQUIPMENT_NODE = '/countryOfficeProfile/surgeEquipment/{countryId}/{id}/notes';
  static SURGE_EQUIPMENT_NODE_LOCAL_AGENCY = '/localAgencyProfile/surgeEquipment/{agencyId}/{id}/notes';
  static STOCK_CAPACITY_NODE = '/countryOfficeProfile/capacity/stockCapacity/{countryId}/{id}/notes';
  static STOCK_CAPACITY_NODE_LOCAL_AGENCY = '/localAgencyProfile/capacity/stockCapacity/{agencyId}/{id}/notes';
  static STAFF_NODE = '/staff/{countryId}/{staffId}/notes';
  static SURGE_CAPACITY_NODE = '/countryOfficeProfile/capacity/surgeCapacity/{countryId}/{id}/notes';
  static SURGE_CAPACITY_NODE_LOCAL_AGENCY = '/localAgencyProfile/capacity/surgeCapacity/{agencyId}/{id}/notes';
  static ADMIN_NODE = '/adminNotes/{adminId}';

  static MONTH = [
    null,
    "MONTH.JANUARY",
    "MONTH.FEBRUARY",
    "MONTH.MARCH",
    "MONTH.APRIL",
    "MONTH.MAY",
    "MONTH.JUNE",
    "MONTH.JULY",
    "MONTH.AUGUST",
    "MONTH.SEPTEMBER",
    "MONTH.OCTOBER",
    "MONTH.NOVEMBER",
    "MONTH.DECEMBER",
  ];

  static SKILL_TYPE = [
    "SUPPORT_SKILLS",
    "AGENCY_ADMIN.STAFF.SUPPORT_TECH"
  ];

  static UTC_ONE_DAY = 60 * 60 * 24;
  static UTC_ONE_HOUR = 60 * 60;

  //firebase error
  static EMAIL_DUPLICATE_ERROR = "auth/email-already-in-use";

  static INDICATOR_STATUS = ["RISK_MONITORING.INDICATOR_STATUS.GREEN","RISK_MONITORING.INDICATOR_STATUS.AMBER","RISK_MONITORING.INDICATOR_STATUS.RED"];

  //network view
  static NETWORK_VIEW_VALUES = "network-view-values"
  static NETWORK_VIEW_SELECTED_ID = "network-view-selected-id"
  static NETWORK_VIEW_SELECTED_NETWORK_COUNTRY_ID = "network-view-selected-network-country-id"
  static NETWORK_CALENDAR= "network-calendar"
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


