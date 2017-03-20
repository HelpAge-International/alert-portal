import {Country, PersonTitle} from "./Enums";
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


  /*LIST VALUES FRO TRANSLATION*/
  static THRESHOLD_VALUE: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  static PERSON_TITLE:string [] = ["COMMON.PERSON_TITLE.MR", "COMMON.PERSON_TITLE.MISS", "COMMON.PERSON_TITLE.DR"];
  static PERSON_TITLE_SELECTION:number[] = [PersonTitle.Mr, PersonTitle.Miss, PersonTitle.Dr];
  static COUNTRY:string[] = ["COMMON.COUNTRY.UK","COMMON.COUNTRY.FRANCE","COMMON.COUNTRY.GERMANY"];
  static COUNTRY_SELECTION = [Country.UK, Country.France, Country.Germany];
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


