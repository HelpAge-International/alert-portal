/**
 * Created by Sanjaya on 07/03/2017.
 */
"use strict";
(function (UserType) {
    UserType[UserType["systemAdmin"] = 0] = "systemAdmin";
    UserType[UserType["agencyAdmin"] = 1] = "agencyAdmin";
    UserType[UserType["countryAdmin"] = 2] = "countryAdmin";
})(exports.UserType || (exports.UserType = {}));
var UserType = exports.UserType;
(function (ActionType) {
    ActionType[ActionType["chs"] = 0] = "chs";
    ActionType[ActionType["mandated"] = 1] = "mandated";
    ActionType[ActionType["custom"] = 2] = "custom";
})(exports.ActionType || (exports.ActionType = {}));
var ActionType = exports.ActionType;
(function (ActionLevel) {
    ActionLevel[ActionLevel["MPA"] = 0] = "MPA";
    ActionLevel[ActionLevel["APA"] = 1] = "APA";
})(exports.ActionLevel || (exports.ActionLevel = {}));
var ActionLevel = exports.ActionLevel;
(function (ActionPreparednessLevel) {
    ActionPreparednessLevel[ActionPreparednessLevel["minimumPreparedness"] = 0] = "minimumPreparedness";
    ActionPreparednessLevel[ActionPreparednessLevel["advancedPreparedness"] = 1] = "advancedPreparedness";
})(exports.ActionPreparednessLevel || (exports.ActionPreparednessLevel = {}));
var ActionPreparednessLevel = exports.ActionPreparednessLevel;
(function (PersonTitle) {
    PersonTitle[PersonTitle["Mr"] = 0] = "Mr";
    PersonTitle[PersonTitle["Miss"] = 1] = "Miss";
    PersonTitle[PersonTitle["Dr"] = 2] = "Dr";
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
(function (Department) {
    Department[Department["Chs"] = 0] = "Chs";
    Department[Department["Finance"] = 1] = "Finance";
    Department[Department["Hr"] = 2] = "Hr";
    Department[Department["Logistics"] = 3] = "Logistics";
    Department[Department["Programme"] = 4] = "Programme";
})(exports.Department || (exports.Department = {}));
var Department = exports.Department;
