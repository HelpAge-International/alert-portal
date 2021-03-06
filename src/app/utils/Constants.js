"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Fei on 08/03/2017.
 */
var Enums_1 = require("./Enums");
var Constants = (function () {
    function Constants() {
    }
    return Constants;
}());
Constants.TEMP_PASSWORD = "testtest";
Constants.ALERT_DURATION = 5000;
Constants.ALERT_REDIRECT_DURATION = 1500;
/*PATHS*/
Constants.APP_STATUS = "/sand";
Constants.LOGIN_PATH = "/login";
Constants.COUNTRY_LEVELS_FILE = "/assets/json/country_levels.json";
Constants.COUNTRY_LEVELS_VALUES_FILE = "/assets/json/country_levels_values.json";
//system admin
Constants.DEFAULT_MPA_PATH = "/system-admin/mpa";
Constants.SYSTEM_ADMIN_HOME = "/system-admin/agency";
Constants.SYSTEM_ADMIN_NETWORK_HOME = "/system-admin/network";
Constants.SYSTEM_ADMIN_ADD_NETWORK = "/system-admin/network/create";
//agency admin
Constants.AGENCY_ADMIN_HOME = "/agency-admin/country-office";
Constants.AGENCY_ADMIN_ADD_STARFF = "/agency-admin/staff/create-edit-staff";
Constants.AGENCY_ADMIN_STARFF = "/agency-admin/staff";
Constants.AGENCY_ADMIN_LOGO_MAX_SIZE = 2000000; //in bytes
Constants.AGENCY_ADMIN_LOGO_FILE_TYPES = ['image/jpeg', 'image/gif', 'image/png'];
// country administrator
Constants.COUNTRY_ADMIN_HOME = "/dashboard";
Constants.COUNTRY_ADMIN_USER_TYPE = ["GLOBAL.USER_TYPE.ALL_USERS", "GLOBAL.USER_TYPE.NON_ALERT", "GLOBAL.USER_TYPE.COUNTRY_DIRECTORS", "GLOBAL.USER_TYPE.COUNTRY_USER",
    "GLOBAL.USER_TYPE.ERT_LEAD", "GLOBAL.USER_TYPE.ERT"];
Constants.COUNTRY_ADMIN_USER_TYPE_SELECTION = [Enums_1.UserType.All, Enums_1.UserType.NonAlert, Enums_1.UserType.CountryDirector, Enums_1.UserType.GlobalUser,
    Enums_1.UserType.ErtLeader, Enums_1.UserType.Ert];
Constants.COUNTRY_ADMIN_MESSAGES_USER_TYPE_SELECTION = [Enums_1.UserType.All, Enums_1.UserType.NonAlert, Enums_1.UserType.CountryDirector, Enums_1.UserType.CountryAdmin,
    Enums_1.UserType.ErtLeader, Enums_1.UserType.Ert, Enums_1.UserType.Donor];
/*LIST VALUES FOR TRANSLATION*/
Constants.THRESHOLD_VALUE = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
Constants.THRESHOLD_NAME = ["GLOBAL.THRESHOLD_NAME.GREEN", "GLOBAL.THRESHOLD_NAME.AMBER", "GLOBAL.THRESHOLD_NAME.RED"];
Constants.PERSON_TITLE = ["GLOBAL.PERSON_TITLE.MR", "GLOBAL.PERSON_TITLE.MRS", "GLOBAL.PERSON_TITLE.MISS",
    "GLOBAL.PERSON_TITLE.DR", "GLOBAL.PERSON_TITLE.PROF"];
Constants.PERSON_TITLE_SELECTION = [Enums_1.PersonTitle.Mr, Enums_1.PersonTitle.Miss, Enums_1.PersonTitle.Dr];
Constants.COUNTRY = ["GLOBAL.COUNTRY.UK", "GLOBAL.COUNTRY.FRANCE", "GLOBAL.COUNTRY.GERMANY"];
Constants.COUNTRY_SELECTION = [Enums_1.Country.UK, Enums_1.Country.France, Enums_1.Country.Germany];
Constants.CATEGORY = [
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
    "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY9"
];
Constants.ACTION_LEVEL = ["GLOBAL.PREPAREDNESS_LEVEL.ALL", "GLOBAL.PREPAREDNESS_LEVEL.MPA", "GLOBAL.PREPAREDNESS_LEVEL.APA"];
Constants.ACTION_STATUS = ["GLOBAL.ACTION_STATUS.EXPIRED", "GLOBAL.ACTION_STATUS.IN_PROGRESS", "GLOBAL.ACTION_STATUS.COMPLETED", "GLOBAL.ACTION_STATUS.INACTIVE"];
Constants.ACTION_TYPE = ["GLOBAL.ACTION_TYPE.CHS", "GLOBAL.ACTION_TYPE.MANDATED", "GLOBAL.ACTION_TYPE.CUSTOM"];
Constants.CURRENCY = ["GBP", "EUR", "USD"];
Constants.CURRENCY_SELECTION = [Enums_1.Currency.GBP, Enums_1.Currency.EUR, Enums_1.Currency.USD];
Constants.USER_TYPE = ["GLOBAL.USER_TYPE.ALL_USERS", "GLOBAL.USER_TYPE.GLOBAL_DIRECTOR", "GLOBAL.USER_TYPE.REGIONAL_DIRECTOR",
    "GLOBAL.USER_TYPE.COUNTRY_DIRECTORS", "GLOBAL.USER_TYPE.ERT_LEAD", "GLOBAL.USER_TYPE.ERT", "GLOBAL.USER_TYPE.DONOR",
    "GLOBAL.USER_TYPE.GLOBAL_USER", "GLOBAL.USER_TYPE.COUNTRY_ADMINS", "GLOBAL.USER_TYPE.NON_ALERT"];
Constants.USER_TYPE_SELECTION = [Enums_1.UserType.All, Enums_1.UserType.GlobalDirector, Enums_1.UserType.RegionalDirector, Enums_1.UserType.CountryDirector,
    Enums_1.UserType.ErtLeader, Enums_1.UserType.Ert, Enums_1.UserType.Donor, Enums_1.UserType.GlobalUser, Enums_1.UserType.CountryAdmin, Enums_1.UserType.NonAlert];
Constants.STAFF_POSITION = ["AGENCY_ADMIN.STAFF.ALL_POSITIONS", "AGENCY_ADMIN.STAFF.OFFICE_DIRECTOR", "AGENCY_ADMIN.STAFF.OFFICE_STAFF"];
Constants.STAFF_POSITION_SELECTION = [Enums_1.StaffPosition.All, Enums_1.StaffPosition.OfficeDirector, Enums_1.StaffPosition.OfficeStarff];
Constants.OFFICE_TYPE = ["AGENCY_ADMIN.STAFF.ALL_OFFICES", "AGENCY_ADMIN.STAFF.FIELD_OFFICE", "AGENCY_ADMIN.STAFF.LAB_OFFICE"];
Constants.OFFICE_TYPE_SELECTION = [Enums_1.OfficeType.All, Enums_1.OfficeType.FieldOffice, Enums_1.OfficeType.LabOffice];
Constants.MODULE_NAME = [
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
Constants.DURATION_TYPE = [
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.WEEKS",
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.MONTHS",
    "AGENCY_ADMIN.SETTINGS.DURATION_TYPE.YEARS"
];
Constants.DURATION_TYPE_SELECTION = [Enums_1.DurationType.Week, Enums_1.DurationType.Month, Enums_1.DurationType.Year];
Constants.NOTIFICATION_SETTINGS = ["GLOBAL.NOTIFICATION_SETTING.ALERT_LEVEL_CHANGE", "GLOBAL.NOTIFICATION_SETTING.RED_ALERT_REQUEST",
    "GLOBAL.NOTIFICATION_SETTING.UPDATE_HAZARD", "GLOBAL.NOTIFICATION_SETTING.ACTION_EXPIRE",
    "GLOBAL.NOTIFICATION_SETTING.RESPONSE_PLAN_EXPIRE", "GLOBAL.NOTIFICATION_SETTING.RESPONSE_PLAN_REJECT"];
Constants.HAZARD_SCENARIOS = [
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
Constants.GROUP_PATH_AGENCY = ["globaldirector", "regionaldirector", "countrydirectors", "ertleads", "erts", "donor", "globaluser", "countryadmins"];
/*
 * Response Plans
 */
Constants.MAX_BULLET_POINTS_VAL_1 = 3;
Constants.MAX_BULLET_POINTS_VAL_2 = 5;
Constants.RESPONSE_PLANS_SECTION_SETTINGS = [
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
Constants.RESPONSE_PLANS_SECTORS = [
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
Constants.DOCUMENT_TYPE = [
    "AGENCY_ADMIN.SETTINGS.DOCUMENT_TYPE.MPA",
    "AGENCY_ADMIN.SETTINGS.DOCUMENT_TYPE.APA",
    "AGENCY_ADMIN.SETTINGS.DOCUMENT_TYPE.RESPONSE_PLAN",
    "AGENCY_ADMIN.SETTINGS.DOCUMENT_TYPE.HAZARD_DOCUMENT"
];
Constants.COUNTRIES = [
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
Constants.DEPARTMENT = [
    "GLOBAL.DEPARTMENT_LIST.CHS",
    "GLOBAL.DEPARTMENT_LIST.FINANCE",
    "GLOBAL.DEPARTMENT_LIST.HR",
    "GLOBAL.DEPARTMENT_LIST.LOGISTICS",
    "GLOBAL.DEPARTMENT_LIST.PROGRAMME"
];
Constants.HAZARD_CATEGORY = [
    "GLOBAL.HAZARD_CATEGORY_LIST.EARTHQUAKE",
    "GLOBAL.HAZARD_CATEGORY_LIST.TSUNAMI",
    "GLOBAL.HAZARD_CATEGORY_LIST.DROUGHT"
];
Constants.HAZARD_CATEGORY_ICON_CLASS = [
    "Icon--earthquake",
    "Icon--cyclone",
    "Icon--drought"
];
Constants.ALERT_LEVELS = [
    "GLOBAL.ALERT_LEVELS.GREEN",
    "GLOBAL.ALERT_LEVELS.AMBER",
    "GLOBAL.ALERT_LEVELS.RED"
];
Constants.ALERT_COLORS = [
    "green",
    "yellow",
    "red"
];
Constants.GEO_LOCATION = [
    "GLOBAL.GEO_LOCATION.NATIONAL",
    "GLOBAL.GEO_LOCATION.SUBNATIONAL"
];
Constants.ALERT_IMAGES = [
    "green",
    "amber",
    "red"
];
Constants.ALERTS = [
    "GLOBAL.ALERTS.GREEN",
    "GLOBAL.ALERTS.AMBER",
    "GLOBAL.ALERTS.RED"
];
Constants.MEDIA_TYPES = [
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.MON_ACC_LEA.PHOTOGRAPHIC",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.MON_ACC_LEA.VIDEO",
    "RESPONSE_PLANS.CREATE_NEW_RESPONSE_PLAN.MON_ACC_LEA.PHOTOGRAPHIC_AND_VIDEO"
];
Constants.PARTNER_STATUS = ["COUNTRY_ADMIN.PARTNER.STATUS_AWAITING_VALIDATION", "COUNTRY_ADMIN.PARTNER.STATUS_VALIDATED"];
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
Constants.USER_TYPE_PATH = [
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
Constants.ALERT_BUTTON_CLASS = [
    "success",
    "warning",
    "danger"
];
Constants.SCENARIO_COLORS = [
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
exports.Constants = Constants;
var FILE_SETTING;
(function (FILE_SETTING) {
    FILE_SETTING[FILE_SETTING["PDF"] = 0] = "PDF";
    FILE_SETTING[FILE_SETTING["DOC"] = 1] = "DOC";
    FILE_SETTING[FILE_SETTING["DOCX"] = 2] = "DOCX";
    FILE_SETTING[FILE_SETTING["RTF"] = 3] = "RTF";
    FILE_SETTING[FILE_SETTING["JPEG"] = 4] = "JPEG";
    FILE_SETTING[FILE_SETTING["PNG"] = 5] = "PNG";
    FILE_SETTING[FILE_SETTING["CSV"] = 6] = "CSV";
    FILE_SETTING[FILE_SETTING["XLS"] = 7] = "XLS";
    FILE_SETTING[FILE_SETTING["XLSX"] = 8] = "XLSX";
    FILE_SETTING[FILE_SETTING["PPT"] = 9] = "PPT";
    FILE_SETTING[FILE_SETTING["PPTX"] = 10] = "PPTX";
    FILE_SETTING[FILE_SETTING["TXT"] = 11] = "TXT";
    FILE_SETTING[FILE_SETTING["ODT"] = 12] = "ODT";
    FILE_SETTING[FILE_SETTING["TSV"] = 13] = "TSV";
})(FILE_SETTING = exports.FILE_SETTING || (exports.FILE_SETTING = {}));
