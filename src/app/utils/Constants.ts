/**
 * Created by Fei on 08/03/2017.
 */
import {
    PersonTitle,
    Country,
    Currency,
    UserType,
    StaffPosition,
    OfficeType,
    DurationType,
    ResponsePlanSectionSettings,
    DocumentType
} from "./Enums";

export class Constants {

    static TEMP_PASSWORD = "testtest";
    static ALERT_DURATION: number = 5000;
    static ALERT_REDIRECT_DURATION: number = 1500;

    /*PATHS*/
    static APP_STATUS = "/sand";
    static LOGIN_PATH = "/login";
    static COUNTRY_LEVELS_FILE = "/assets/json/country_levels.json";
    static COUNTRY_LEVELS_VALUES_FILE = "/assets/json/country_levels_values.json";

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

    // country administrator
    static COUNTRY_ADMIN_HOME = "/dashboard";
    static COUNTRY_ADMIN_USER_TYPE = ["GLOBAL.USER_TYPE.ALL_USERS", "GLOBAL.USER_TYPE.NON_ALERT", "GLOBAL.USER_TYPE.COUNTRY_DIRECTORS", "GLOBAL.USER_TYPE.COUNTRY_USER",
        "GLOBAL.USER_TYPE.ERT_LEAD", "GLOBAL.USER_TYPE.ERT"];
    static COUNTRY_ADMIN_USER_TYPE_SELECTION = [UserType.All, UserType.NonAlert, UserType.CountryDirector, UserType.GlobalUser,
    UserType.ErtLeader, UserType.Ert];
    static COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION = [UserType.All, UserType.NonAlert, UserType.CountryDirector, UserType.CountryAdmin,
    UserType.ErtLeader, UserType.Ert, UserType.Donor];

  /*LIST VALUES FOR TRANSLATION*/
    static THRESHOLD_VALUE: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
    static THRESHOLD_NAME = ["GLOBAL.THRESHOLD_NAME.GREEN", "GLOBAL.THRESHOLD_NAME.AMBER", "GLOBAL.THRESHOLD_NAME.RED"];

    static PERSON_TITLE: string[] = ["GLOBAL.PERSON_TITLE.MR", "GLOBAL.PERSON_TITLE.MRS", "GLOBAL.PERSON_TITLE.MISS",
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
    static ACTION_STATUS: string[] = ["GLOBAL.ACTION_STATUS.EXPIRED", "GLOBAL.ACTION_STATUS.IN_PROGRESS", "GLOBAL.ACTION_STATUS.COMPLETED", "GLOBAL.ACTION_STATUS.INACTIVE"];
    static ACTION_TYPE: string[] = ["GLOBAL.ACTION_TYPE.CHS", "GLOBAL.ACTION_TYPE.MANDATED", "GLOBAL.ACTION_TYPE.CUSTOM"];

    static CURRENCY: string[] = ["GBP", "EUR", "USD"];
    static CURRENCY_SELECTION = [Currency.GBP, Currency.EUR, Currency.USD];

    static USER_TYPE = ["GLOBAL.USER_TYPE.ALL_USERS", "GLOBAL.USER_TYPE.GLOBAL_DIRECTOR", "GLOBAL.USER_TYPE.REGIONAL_DIRECTOR",
        "GLOBAL.USER_TYPE.COUNTRY_DIRECTORS", "GLOBAL.USER_TYPE.ERT_LEAD", "GLOBAL.USER_TYPE.ERT", "GLOBAL.USER_TYPE.DONOR",
        "GLOBAL.USER_TYPE.GLOBAL_USER", "GLOBAL.USER_TYPE.COUNTRY_ADMINS", "GLOBAL.USER_TYPE.NON_ALERT"];
    static USER_TYPE_SELECTION = [UserType.All, UserType.GlobalDirector, UserType.RegionalDirector, UserType.CountryDirector,
    UserType.ErtLeader, UserType.Ert, UserType.Donor, UserType.GlobalUser, UserType.CountryAdmin, UserType.NonAlert];

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

    static GROUP_PATH_AGENCY = ["globaldirector", "regionaldirector", "countrydirectors", "ertleads", "erts", "donor", "globaluser", "countryadmins"];

    /*
     * Response Plans
     */

    static MAX_BULLET_POINTS_VAL_1: number = 3;
    static MAX_BULLET_POINTS_VAL_2: number = 5;

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

    static RESPONSE_PLANS_SECTORS = [
        "SECTORS.WASH",
        "SECTORS.HEALTH",
        "SECTORS.SHELTER",
        "SECTORS.NUTRITION",
        "SECTORS.FOOD_SEC_AND_LIVELIHOOD",
        "SECTORS.PROTECTION",
        "SECTORS.EDUCATION",
        "SECTORS.CAMP_MANAGEMENT",
        "SECTORS.OTHER"
    ];

    static DOCUMENT_TYPE = [
        "AGENCY_ADMIN.SETTINGS.DOCUMENT_TYPE.MPA",
        "AGENCY_ADMIN.SETTINGS.DOCUMENT_TYPE.APA",
        "AGENCY_ADMIN.SETTINGS.DOCUMENT_TYPE.RESPONSE_PLAN",
        "AGENCY_ADMIN.SETTINGS.DOCUMENT_TYPE.HAZARD_DOCUMENT"
    ];

    static COUNTRIES = [
        "GLOBAL.COUNTRIES.GB",
        "GLOBAL.COUNTRIES.FR",
        "GLOBAL.COUNTRIES.DE",
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
        "GLOBAL.COUNTRIES.GF",
        "GLOBAL.COUNTRIES.PF",
        "GLOBAL.COUNTRIES.TF",
        "GLOBAL.COUNTRIES.GA",
        "GLOBAL.COUNTRIES.GM",
        "GLOBAL.COUNTRIES.GE",
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

    static DEPARTMENT = [
        "GLOBAL.DEPARTMENT_LIST.CHS",
        "GLOBAL.DEPARTMENT_LIST.FINANCE",
        "GLOBAL.DEPARTMENT_LIST.HR",
        "GLOBAL.DEPARTMENT_LIST.LOGISTICS",
        "GLOBAL.DEPARTMENT_LIST.PROGRAMME"
    ];

    static HAZARD_CATEGORY = [
        "GLOBAL.HAZARD_CATEGORY_LIST.EARTHQUAKE",
        "GLOBAL.HAZARD_CATEGORY_LIST.TSUNAMI",
        "GLOBAL.HAZARD_CATEGORY_LIST.DROUGHT"
    ];

    static HAZARD_CATEGORY_ICON_CLASS = [
        "Icon--earthquake",
        "Icon--cyclone",
        "Icon--drought"
    ];

    static ALERT_LEVELS = [
        "GLOBAL.ALERT_LEVELS.GREEN",
        "GLOBAL.ALERT_LEVELS.AMBER",
        "GLOBAL.ALERT_LEVELS.RED"
    ];

    static ALERT_COLORS = [
        "green",
        "yellow",
        "red"
    ];

    static GEO_LOCATION = [
        "GLOBAL.GEO_LOCATION.NATIONAL",
        "GLOBAL.GEO_LOCATION.SUBNATIONAL"
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

  static MEDIA_TYPES = [
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.MON_ACC_LEA.PHOTOGRAPHIC",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.MON_ACC_LEA.VIDEO",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.MON_ACC_LEA.PHOTOGRAPHIC_AND_VIDEO"
  ];

  static PARTNER_STATUS = ["COUNTRY_ADMIN.PARTNER.STATUS_AWAITING_VALIDATION", "COUNTRY_ADMIN.PARTNER.STATUS_VALIDATED"];
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


