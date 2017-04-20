/**
 * Created by Sanjaya on 07/03/2017.
 */
"use strict";
(function (ActionType) {
    ActionType[ActionType["chs"] = 0] = "chs";
    ActionType[ActionType["mandated"] = 1] = "mandated";
    ActionType[ActionType["custom"] = 2] = "custom";
})(exports.ActionType || (exports.ActionType = {}));
var ActionType = exports.ActionType;
// TODO - Update when Ryan provides actual category names
(function (GenericActionCategory) {
    GenericActionCategory[GenericActionCategory["ALL"] = 0] = "ALL";
    GenericActionCategory[GenericActionCategory["Category1"] = 1] = "Category1";
    GenericActionCategory[GenericActionCategory["Category2"] = 2] = "Category2";
    GenericActionCategory[GenericActionCategory["Category3"] = 3] = "Category3";
    GenericActionCategory[GenericActionCategory["Category4"] = 4] = "Category4";
    GenericActionCategory[GenericActionCategory["Category5"] = 5] = "Category5";
    GenericActionCategory[GenericActionCategory["Category6"] = 6] = "Category6";
    GenericActionCategory[GenericActionCategory["Category7"] = 7] = "Category7";
    GenericActionCategory[GenericActionCategory["Category8"] = 8] = "Category8";
    GenericActionCategory[GenericActionCategory["Category9"] = 9] = "Category9";
    GenericActionCategory[GenericActionCategory["Category10"] = 10] = "Category10";
})(exports.GenericActionCategory || (exports.GenericActionCategory = {}));
var GenericActionCategory = exports.GenericActionCategory;
(function (ActionLevel) {
    ActionLevel[ActionLevel["ALL"] = 0] = "ALL";
    ActionLevel[ActionLevel["MPA"] = 1] = "MPA";
    ActionLevel[ActionLevel["APA"] = 2] = "APA";
})(exports.ActionLevel || (exports.ActionLevel = {}));
var ActionLevel = exports.ActionLevel;
(function (PersonTitle) {
    PersonTitle[PersonTitle["Mr"] = 0] = "Mr";
    PersonTitle[PersonTitle["Mrs"] = 1] = "Mrs";
    PersonTitle[PersonTitle["Miss"] = 2] = "Miss";
    PersonTitle[PersonTitle["Dr"] = 3] = "Dr";
    PersonTitle[PersonTitle["Prof"] = 4] = "Prof";
})(exports.PersonTitle || (exports.PersonTitle = {}));
var PersonTitle = exports.PersonTitle;
(function (FileType) {
    FileType[FileType["MB"] = 0] = "MB";
    FileType[FileType["GB"] = 1] = "GB";
})(exports.FileType || (exports.FileType = {}));
var FileType = exports.FileType;
(function (Country) {
    Country[Country["UK"] = 0] = "UK";
    Country[Country["France"] = 1] = "France";
    Country[Country["Germany"] = 2] = "Germany";
})(exports.Country || (exports.Country = {}));
var Country = exports.Country;
(function (Currency) {
    Currency[Currency["GBP"] = 0] = "GBP";
    Currency[Currency["EUR"] = 1] = "EUR";
    Currency[Currency["USD"] = 2] = "USD";
})(exports.Currency || (exports.Currency = {}));
var Currency = exports.Currency;
(function (StaffPosition) {
    StaffPosition[StaffPosition["OfficeDirector"] = 0] = "OfficeDirector";
    StaffPosition[StaffPosition["OfficeStarff"] = 1] = "OfficeStarff";
})(exports.StaffPosition || (exports.StaffPosition = {}));
var StaffPosition = exports.StaffPosition;
(function (UserType) {
    UserType[UserType["GlobalDirector"] = 0] = "GlobalDirector";
    UserType[UserType["RegionalDirector"] = 1] = "RegionalDirector";
    UserType[UserType["CountryDirector"] = 2] = "CountryDirector";
    UserType[UserType["ErtLeader"] = 3] = "ErtLeader";
    UserType[UserType["Ert"] = 4] = "Ert";
    UserType[UserType["Donor"] = 5] = "Donor";
    UserType[UserType["GlobalUser"] = 6] = "GlobalUser";
    UserType[UserType["CountryAdmin"] = 7] = "CountryAdmin";
})(exports.UserType || (exports.UserType = {}));
var UserType = exports.UserType;
(function (OfficeType) {
    OfficeType[OfficeType["FieldOffice"] = 0] = "FieldOffice";
    OfficeType[OfficeType["LabOffice"] = 1] = "LabOffice";
})(exports.OfficeType || (exports.OfficeType = {}));
var OfficeType = exports.OfficeType;
(function (SkillType) {
    SkillType[SkillType["Support"] = 0] = "Support";
    SkillType[SkillType["Tech"] = 1] = "Tech";
})(exports.SkillType || (exports.SkillType = {}));
var SkillType = exports.SkillType;
(function (NotificationSettingEvents) {
    NotificationSettingEvents[NotificationSettingEvents["AlertLevelChanged"] = 0] = "AlertLevelChanged";
    NotificationSettingEvents[NotificationSettingEvents["RedAlertRequest"] = 1] = "RedAlertRequest";
    NotificationSettingEvents[NotificationSettingEvents["UpdateHazard"] = 2] = "UpdateHazard";
    NotificationSettingEvents[NotificationSettingEvents["ActionExpired"] = 3] = "ActionExpired";
    NotificationSettingEvents[NotificationSettingEvents["PlanExpired"] = 4] = "PlanExpired";
    NotificationSettingEvents[NotificationSettingEvents["PlanRejected"] = 5] = "PlanRejected";
})(exports.NotificationSettingEvents || (exports.NotificationSettingEvents = {}));
var NotificationSettingEvents = exports.NotificationSettingEvents;
