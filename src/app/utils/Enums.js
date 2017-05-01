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
// TODO - Update when Ryan provides actual Category names
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
// TODO - Update when Ryan provides actual Hazard Scenario names
(function (HazardScenario) {
    HazardScenario[HazardScenario["HazardScenario0"] = 0] = "HazardScenario0";
    HazardScenario[HazardScenario["HazardScenario1"] = 1] = "HazardScenario1";
    HazardScenario[HazardScenario["HazardScenario2"] = 2] = "HazardScenario2";
    HazardScenario[HazardScenario["HazardScenario3"] = 3] = "HazardScenario3";
    HazardScenario[HazardScenario["HazardScenario4"] = 4] = "HazardScenario4";
    HazardScenario[HazardScenario["HazardScenario5"] = 5] = "HazardScenario5";
    HazardScenario[HazardScenario["HazardScenario6"] = 6] = "HazardScenario6";
    HazardScenario[HazardScenario["HazardScenario7"] = 7] = "HazardScenario7";
    HazardScenario[HazardScenario["HazardScenario8"] = 8] = "HazardScenario8";
    HazardScenario[HazardScenario["HazardScenario9"] = 9] = "HazardScenario9";
    HazardScenario[HazardScenario["HazardScenario10"] = 10] = "HazardScenario10";
})(exports.HazardScenario || (exports.HazardScenario = {}));
var HazardScenario = exports.HazardScenario;
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
    StaffPosition[StaffPosition["All"] = 0] = "All";
    StaffPosition[StaffPosition["OfficeDirector"] = 1] = "OfficeDirector";
    StaffPosition[StaffPosition["OfficeStarff"] = 2] = "OfficeStarff";
})(exports.StaffPosition || (exports.StaffPosition = {}));
var StaffPosition = exports.StaffPosition;
(function (UserType) {
    UserType[UserType["All"] = 0] = "All";
    UserType[UserType["GlobalDirector"] = 1] = "GlobalDirector";
    UserType[UserType["RegionalDirector"] = 2] = "RegionalDirector";
    UserType[UserType["CountryDirector"] = 3] = "CountryDirector";
    UserType[UserType["ErtLeader"] = 4] = "ErtLeader";
    UserType[UserType["Ert"] = 5] = "Ert";
    UserType[UserType["Donor"] = 6] = "Donor";
    UserType[UserType["GlobalUser"] = 7] = "GlobalUser";
    UserType[UserType["CountryAdmin"] = 8] = "CountryAdmin";
})(exports.UserType || (exports.UserType = {}));
var UserType = exports.UserType;
(function (OfficeType) {
    OfficeType[OfficeType["All"] = 0] = "All";
    OfficeType[OfficeType["FieldOffice"] = 1] = "FieldOffice";
    OfficeType[OfficeType["LabOffice"] = 2] = "LabOffice";
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
(function (Privacy) {
    Privacy[Privacy["Public"] = 0] = "Public";
    Privacy[Privacy["Private"] = 1] = "Private";
    Privacy[Privacy["Network"] = 2] = "Network";
})(exports.Privacy || (exports.Privacy = {}));
var Privacy = exports.Privacy;
(function (DurationType) {
    DurationType[DurationType["Week"] = 0] = "Week";
    DurationType[DurationType["Month"] = 1] = "Month";
    DurationType[DurationType["Year"] = 2] = "Year";
})(exports.DurationType || (exports.DurationType = {}));
var DurationType = exports.DurationType;
(function (Location) {
    Location[Location["Philippines"] = 0] = "Philippines";
    Location[Location["Malaysia"] = 1] = "Malaysia";
    Location[Location["Indonesia"] = 2] = "Indonesia";
})(exports.Location || (exports.Location = {}));
var Location = exports.Location;
(function (ResponsePlanSesctionSettings) {
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["PlanDetails"] = 0] = "PlanDetails";
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["PlanContext"] = 1] = "PlanContext";
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["BasicInformation"] = 2] = "BasicInformation";
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["ActivitySummary"] = 3] = "ActivitySummary";
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["TargetPopulation"] = 4] = "TargetPopulation";
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["ExpectedResults"] = 5] = "ExpectedResults";
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["Activities"] = 6] = "Activities";
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["MonitoringAccLearning"] = 7] = "MonitoringAccLearning";
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["DoubleCounting"] = 8] = "DoubleCounting";
    ResponsePlanSesctionSettings[ResponsePlanSesctionSettings["Budget"] = 9] = "Budget";
})(exports.ResponsePlanSesctionSettings || (exports.ResponsePlanSesctionSettings = {}));
var ResponsePlanSesctionSettings = exports.ResponsePlanSesctionSettings;
