/**
 * Created by Sanjaya on 07/03/2017.
 */

export enum UserType {
  systemAdmin = 0,
  agencyAdmin = 1,
  countryAdmin = 2
}

export enum ActionType {
  chs = 0,
  mandated = 1,
  custom = 2
}

// TODO - Update when Ryan provides actual category names
export enum GenericActionCategory {
  ALL = 0,
  Category1 = 1,
  Category2 = 2,
  Category3 = 3,
  Category4 = 4,
  Category5 = 5,
  Category6 = 6,
  Category7 = 7,
  Category8 = 8,
  Category9 = 9,
  Category10 = 10
}

export enum ActionLevel {
  ALL = 0,
  MPA = 1,
  APA = 2
}

export enum PersonTitle {
  Mr = 0,
  Mrs = 1,
  Miss = 2,
  Dr = 3,
  Prof = 4
}

export enum FileType {
  MB = 0,
  GB = 1
}

export enum Country {
  UK = 0,
  France = 1,
  Germany = 2
}

export enum Department {
  Chs = 0,
  Finance = 1,
  Hr = 2,
  Logistics = 3,
  Programme = 4
}
