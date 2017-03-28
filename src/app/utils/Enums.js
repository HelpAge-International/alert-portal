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
(function (Department) {
    Department[Department["Chs"] = 0] = "Chs";
    Department[Department["Finance"] = 1] = "Finance";
    Department[Department["Hr"] = 2] = "Hr";
    Department[Department["Logistics"] = 3] = "Logistics";
    Department[Department["Programme"] = 4] = "Programme";
})(exports.Department || (exports.Department = {}));
var Department = exports.Department;
