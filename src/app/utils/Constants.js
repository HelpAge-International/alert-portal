"use strict";
var Enums_1 = require("./Enums");
/**
 * Created by Fei on 08/03/2017.
 */
var Constants = (function () {
    function Constants() {
    }
    Constants.TEMP_PASSWORD = "testtest";
    Constants.ALERT_DURATION = 5000;
    /*PATHS*/
    Constants.APP_STATUS = "/test";
    Constants.LOGIN_PATH = "/login";
    //system admin
    Constants.DEFAULT_MPA_PATH = "/system-admin/mpa";
    Constants.SYSTEM_ADMIN_HOME = "/system-admin/agency";
    Constants.SYSTEM_ADMIN_NETWORK_HOME = "/system-admin/network";
    Constants.SYSTEM_ADMIN_ADD_NETWORK = "/system-admin/network/create";
    //agency admin
    Constants.AGENCY_ADMIN_HOME = "/agency-admin/country-office";
    Constants.AGENCY_ADMIN_ADD_STARFF = "/agency-admin/staff/create-edit-staff";
    Constants.AGENCY_ADMIN_STARFF = "/agency-admin/staff";
    /*LIST VALUES FRO TRANSLATION*/
    Constants.THRESHOLD_VALUE = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
    Constants.PERSON_TITLE = ["GLOBAL.PERSON_TITLE.MR", "GLOBAL.PERSON_TITLE.MRS", "GLOBAL.PERSON_TITLE.MISS",
        "GLOBAL.PERSON_TITLE.DR", "GLOBAL.PERSON_TITLE.PROF"];
    Constants.PERSON_TITLE_SELECTION = [Enums_1.PersonTitle.Mr, Enums_1.PersonTitle.Miss, Enums_1.PersonTitle.Dr];
    Constants.COUNTRY = ["GLOBAL.COUNTRY.UK", "GLOBAL.COUNTRY.FRANCE", "GLOBAL.COUNTRY.GERMANY"];
    Constants.COUNTRY_SELECTION = [Enums_1.Country.UK, Enums_1.Country.France, Enums_1.Country.Germany];
    Constants.CATEGORY = ["SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.ALL", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY0", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY1",
        "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY2", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY3", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY4",
        "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY5", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY6", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY7",
        "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY8", "SYSTEM_ADMIN.ACTIONS.GENERIC_MPA_APA.CATEGORIES.CATEGORY9"];
    Constants.ACTION_LEVEL = ["GLOBAL.PREPAREDNESS_LEVEL.ALL", "GLOBAL.PREPAREDNESS_LEVEL.MPA", "GLOBAL.PREPAREDNESS_LEVEL.APA"];
    Constants.CURRENCY = ["GBP", "EUR", "USD"];
    Constants.CURRENCY_SELECTION = [Enums_1.Currency.GBP, Enums_1.Currency.EUR, Enums_1.Currency.USD];
    Constants.USER_TYPE = ["Global Director", "Regional Director", "Country Director", "ERT Lead", "ERT", "Donor", "Global User", "Country Admin"];
    Constants.USER_TYPE_SELECTION = [Enums_1.UserType.GlobalDirector, Enums_1.UserType.RegionalDirector, Enums_1.UserType.CountryDirector, Enums_1.UserType.ErtLeader, Enums_1.UserType.Ert, Enums_1.UserType.Donor, Enums_1.UserType.GlobalUser, Enums_1.UserType.CountryAdmin];
    Constants.STAFF_POSITION = ["Office Director", "Office Staff"];
    Constants.STAFF_POSITION_SELECTION = [Enums_1.StaffPosition.OfficeDirector, Enums_1.StaffPosition.OfficeStarff];
    Constants.OFFICE_TYPE = ["Field Office", "Lab Office"];
    Constants.OFFICE_TYPE_SELECTION = [Enums_1.OfficeType.FieldOffice, Enums_1.OfficeType.LabOffice];
    Constants.NOTIFICATION_SETTINGS = ["Alert level changed", "Red alert request", "Update hazard indicator", "MPA/APA expired", "Response plan expired", "Response plan rejected"];
    return Constants;
}());
exports.Constants = Constants;
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
})(exports.FILE_SETTING || (exports.FILE_SETTING = {}));
var FILE_SETTING = exports.FILE_SETTING;
