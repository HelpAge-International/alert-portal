import {Country, PersonTitle, GenericActionCategory} from "./Enums";
/**
 * Created by Fei on 08/03/2017.
 */
export class Constants {
  /*PATHS*/
  static APP_STATUS = "/sand";
  static LOGIN_PATH = "/login";
  static DEFAULT_MPA_PATH = "/system-admin/mpa";
  static SYSTEM_ADMIN_HOME = "/system-admin";
  static AGENCY_ADMIN_HOME = "/agency-admin/country-office";
  static AGENCY_ADMIN_ADD_STARFF = "/agency-admin/staff/create-edit-staff";
  static ALERT_DURATION: number = 5000;

  /*LIST VALUES FRO TRANSLATION*/
  static THRESHOLD_VALUE: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  static PERSON_TITLE: string [] = ["COMMON.PERSON_TITLE.MR", "COMMON.PERSON_TITLE.MISS", "COMMON.PERSON_TITLE.DR"];
  static PERSON_TITLE_SELECTION: number[] = [PersonTitle.Mr, PersonTitle.Miss, PersonTitle.Dr];
  static COUNTRY: string[] = ["COMMON.COUNTRY.UK", "COMMON.COUNTRY.FRANCE", "COMMON.COUNTRY.GERMANY"];
  static COUNTRY_SELECTION = [Country.UK, Country.France, Country.Germany];
  static CATEGORY: string[] = ["GENERIC_MPA_APA.CATEGORIES.CATEGORY0", "GENERIC_MPA_APA.CATEGORIES.CATEGORY1",
  "GENERIC_MPA_APA.CATEGORIES.CATEGORY2", "GENERIC_MPA_APA.CATEGORIES.CATEGORY3", "GENERIC_MPA_APA.CATEGORIES.CATEGORY4",
  "GENERIC_MPA_APA.CATEGORIES.CATEGORY5", "GENERIC_MPA_APA.CATEGORIES.CATEGORY6", "GENERIC_MPA_APA.CATEGORIES.CATEGORY7",
  "GENERIC_MPA_APA.CATEGORIES.CATEGORY8", "GENERIC_MPA_APA.CATEGORIES.CATEGORY9"];
  static ACTION_LEVEL: string[] = ["GLOBAL.PREPAREDNESS_LEVEL.MPA", "GLOBAL.PREPAREDNESS_LEVEL.APA"];
}

export enum FILE_SETTING {
  PDF = 0,
  HTML = 1,
  DOC = 2,
  DOCX = 3,
  PS = 4,
  RTF = 5,
  JPEG = 6,
  PNG = 7
}


