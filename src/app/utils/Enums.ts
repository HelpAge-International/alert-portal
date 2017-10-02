/**
 * Created by Sanjaya on 07/03/2017.
 */

export enum NetworkMessageRecipientType{
  AllUsers = 0,
  NetworkCountryAdmins = 1,
  GlobalDirectors = 2,
  GlobalUsers = 3,
  RegionalDirectors = 4,
  CountryAdmins = 5,
  CountryDirectors = 6,
  ERTLeaders = 7,
  ERTs = 8,
  Donors = 9,
  Partners = 10
}

export enum ActionType {
  chs = 0,
  mandated = 1,
  custom = 2
}

export enum GenericActionCategory {
  All = 0,
  OfficeAdministration = 1,
  Finance = 2,
  ITFieldCommunications = 3,
  Logistics = 4,
  CommunicationsMedia = 5,
  HumanResources = 6,
  DonorFundingReporting = 7,
  Accountability = 8,
  Security = 9,
  Programmes = 10,
  EmergencyResponseTeamManagement = 11
}

export enum HazardScenario {
  HazardScenario0 = 0,
  HazardScenario1 = 1,
  HazardScenario2 = 2,
  HazardScenario3 = 3,
  HazardScenario4 = 4,
  HazardScenario5 = 5,
  HazardScenario6 = 6,
  HazardScenario7 = 7,
  HazardScenario8 = 8,
  HazardScenario9 = 9,
  HazardScenario10 = 10,
  HazardScenario11 = 11,
  HazardScenario12 = 12,
  HazardScenario13 = 13,
  HazardScenario14 = 14,
  HazardScenario15 = 15,
  HazardScenario16 = 16,
  HazardScenario17 = 17,
  HazardScenario18 = 18,
  HazardScenario19 = 19,
  HazardScenario20 = 20,
  HazardScenario21 = 21,
  HazardScenario22 = 22,
  HazardScenario23 = 23,
  HazardScenario24 = 24,
  HazardScenario25 = 25,
  HazardScenario26 = 26,
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
  Ms = 3,
  Dr = 4,
  Prof = 5
}

export enum FileType {
  MB = 0,
  GB = 1
}

export class FileExtensionsEnding {
  public extensions: string[] = [];
  public id: number;
  public allowed: boolean;

  public static list(): FileExtensionsEnding[] {
    let x: FileExtensionsEnding[] = [];
    x.push(FileExtensionsEnding.create(0, [".pdf"]));
    x.push(FileExtensionsEnding.create(1, [".doc"]));
    x.push(FileExtensionsEnding.create(2, [".docx"]));
    x.push(FileExtensionsEnding.create(3, [".rtf"]));
    x.push(FileExtensionsEnding.create(4, [".jpg", ".jpeg"]));
    x.push(FileExtensionsEnding.create(5, [".png"]));
    x.push(FileExtensionsEnding.create(6, [".csv"]));
    x.push(FileExtensionsEnding.create(7, [".xls"]));
    x.push(FileExtensionsEnding.create(8, [".xlsx"]));
    x.push(FileExtensionsEnding.create(9, [".ppt"]));
    x.push(FileExtensionsEnding.create(10, [".pptx"]));
    x.push(FileExtensionsEnding.create(11, [".txt"]));
    x.push(FileExtensionsEnding.create(12, [".odt"]));
    x.push(FileExtensionsEnding.create(13, [".tsv"]));
    return x;
  }

  private static create(id: number, extensions: string[]) {
    let fExtension = new FileExtensionsEnding();
    fExtension.id = id;
    fExtension.extensions = extensions;
    fExtension.allowed = false;
    return fExtension;
  }
}
export enum Currency {
  GBP = 0,
  EUR = 1,
  USD = 2,
  KSH = 3,
  MZN = 4,
  CDF = 5,
  PHP = 6,
  BDT = 7,
  PKR = 8
}


export enum StaffPosition {
  All = 0,
  OfficeDirector = 1,
  OfficeStarff = 2
}

export enum NetworkUserAccountType {
  NetworkAdmin = 0,
  NetworkCountryAdmin = 1
}

export enum UserType {
  All = 0,
  GlobalDirector = 1,
  RegionalDirector = 2,
  CountryDirector = 3,
  ErtLeader = 4,
  Ert = 5,
  Donor = 6,
  GlobalUser = 7,
  CountryAdmin = 8,
  NonAlert = 9,
  CountryUser = 10,
  AgencyAdmin = 11,
  SystemAdmin = 12,
  PartnerUser = 13,
  PartnerOrganisation = 14
}
export enum OfficeType {
  All = 0,
  FieldOffice = 1,
  MainOffice = 2
}

export enum SkillType {
  Support = 0,
  Tech = 1
}

export enum NotificationSettingEvents {
  AlertLevelChanged = 0,
  RedAlertRequest = 1,
  UpdateHazard = 2,
  ActionExpired = 3,
  PlanExpired = 4,
  PlanRejected = 5
}

export enum Privacy {
  Public = 0,
  Private = 1,
  Network = 2
}

export enum DurationType {
  Week = 0,
  Month = 1,
  Year = 2
}

export enum DetailedDurationType {
    Hour = 0,
    Day = 1,
    Week = 2,
    Month = 3,
    Year = 4,
}

export enum Location {
  Philippines = 0,
  Malaysia = 1,
  Indonesia = 2
}

export enum DocumentType {
  MPA = 0,
  APA = 1,
  ResponsePlan = 2,
  Hazard = 3
}

/**
 * Response Plans
 */
export enum ResponsePlanSectionSettings {
  PlanDetails = 0,
  PlanContext = 1,
  BasicInformation = 2,
  ResponseObjectives = 3,
  TargetPopulation = 4,
  ExpectedResults = 5,
  Activities = 6,
  MonitoringAccLearning = 7,
  DoubleCounting = 8,
  Budget = 9
}

export enum NetworkResponsePlanSectionSettings {
  ParticipatingAgencies = 0,
  PlanDetails = 1,
  PlanContext = 2,
  BasicInformation = 3,
  ResponseObjectives = 4,
  TargetPopulation = 5,
  ExpectedResults = 6,
  Activities = 7,
  MonitoringAccLearning = 8,
  DoubleCounting = 9,
  Budget = 10
}

export enum ResponsePlanSectors {
  wash = 0,
  health = 1,
  shelter = 2,
  nutrition = 3,
  foodSecurityAndLivelihoods = 4,
  protection = 5,
  education = 6,
  campManagement = 7,
  other = 8
}

export enum ResponsePlansApprovalSettings {
  RegionalDirector = 0,
  GlobalDirector = 1
}

export enum ModuleName {
  MinimumPreparednessActions = 0,
  AdvancedPreparednessActions = 1,
  CHSPreparednessActions = 2,
  RiskMonitoring = 3,
  CountryOfficeProfile = 4,
  ResponsePlanning = 5
}


export enum PermissionsAgency {
  MinimumPreparedness = 0,
  AdvancedPreparedness = 1,
  CHSPreparedness = 2,
  RiskMonitoring = 3,
  CountryOffice = 4,
  ResponsePlanning = 5
}


export enum PresenceInTheCountry {
  currentProgrammes = 1,
  preExistingPartner = 2,
  noPreExistingPresence = 3
}

export enum MethodOfImplementation {
  fieldStaff = 0,
  withPartner = 1,
  both = 2
}

export enum PartnerStatus {
  AwaitingValidation = 0,
  Validated = 1
}

export enum MediaFormat {
  photographic = 0,
  video = 1,
  photographicAndVideo = 2
}

export enum Gender {
  male = 0,
  feMale = 1
}

export enum AgeRange {
  Less18 = 0,
  Between18To50 = 1,
  More50 = 2
}

export enum SourcePlan {
  Internationally = 0,
  Regionally = 1,
  Locally = 2
}

export enum PhonePrefix {
  AC = 247,
  AD = 376,
  AE = 971,
  AF = 93,
  AG = 1 - 268,
  AI = 1 - 264,
  AL = 355,
  AM = 374,
  AN = 599,
  AQ = 672,
  AO = 244,
  AR = 54,
  AS = 1 - 684,
  AT = 43,
  AU = 61,
  AW = 297,
  AX = 358 - 18,
  AZ = 994,
  BA = 387,
  BB = 1 - 246,
  BD = 880,
  BE = 32,
  BF = 226,
  BG = 359,
  BH = 973,
  BI = 257,
  BJ = 229,
  BL = 590,
  BM = 1 - 441,
  BN = 673,
  BO = 591,
  BR = 55,
  BS = 1 - 242,
  BT = 975,
  BV = 47,
  BW = 267,
  BQ = 599,
  BY = 375,
  BZ = 501,
  CA = 1,
  CC = 61,
  CD = 243,
  CF = 236,
  CG = 242,
  CH = 41,
  CI = 225,
  CK = 682,
  CL = 56,
  CM = 237,
  CN = 86,
  CO = 57,
  CR = 506,
  CS = 381,
  CU = 53,
  CV = 238,
  CW = 599,
  CX = 61,
  CY = 357,
  CZ = 420,
  DE = 49,
  DJ = 253,
  DK = 45,
  DM = 1 - 767,
  DO = 1 - 809,
  DZ = 213,
  EC = 593,
  EE = 372,
  EG = 20,
  EH = 212,
  ER = 291,
  ES = 34,
  ET = 251,
  FI = 358,
  FJ = 679,
  FK = 500,
  FM = 691,
  FO = 298,
  FR = 33,
  GA = 241,
  GB = 44,
  GD = 1 - 473,
  GE = 995,
  GF = 594,
  GG = 44,
  GH = 233,
  GI = 350,
  GL = 299,
  GM = 220,
  GN = 224,
  GP = 590,
  GQ = 240,
  GR = 30,
  GS = 500,
  GT = 502,
  GU = 1 - 671,
  GW = 245,
  GY = 592,
  HK = 852,
  HM = 0,
  HN = 504,
  HR = 385,
  HT = 509,
  HU = 36,
  ID = 62,
  IE = 353,
  IL = 972,
  IM = 44,
  IN = 91,
  IO = 246,
  IQ = 964,
  IR = 98,
  IS = 354,
  IT = 39,
  JE = 44,
  JM = 1 - 876,
  JO = 962,
  JP = 81,
  KE = 254,
  KG = 996,
  KH = 855,
  KI = 686,
  KM = 269,
  KN = 1 - 869,
  KP = 850,
  KR = 82,
  KW = 965,
  KY = 1 - 345,
  KZ = 7,
  LA = 856,
  LB = 961,
  LC = 1 - 758,
  LI = 423,
  LK = 94,
  LR = 231,
  LS = 266,
  LT = 370,
  LU = 352,
  LV = 371,
  LY = 218,
  MA = 212,
  MC = 377,
  MD = 373,
  ME = 382,
  MF = 590,
  MG = 261,
  MH = 692,
  MK = 389,
  ML = 223,
  MM = 95,
  MN = 976,
  MO = 853,
  MP = 1 - 670,
  MQ = 596,
  MR = 222,
  MS = 1 - 664,
  MT = 356,
  MU = 230,
  MV = 960,
  MW = 265,
  MX = 52,
  MY = 60,
  MZ = 258,
  NA = 264,
  NC = 687,
  NE = 227,
  NF = 672,
  NG = 234,
  NI = 505,
  NL = 31,
  NO = 47,
  NP = 977,
  NR = 674,
  NU = 683,
  NZ = 64,
  OM = 968,
  PA = 507,
  PE = 51,
  PF = 689,
  PG = 675,
  PH = 63,
  PK = 92,
  PL = 48,
  PM = 508,
  PN = 64,
  PR = 1 - 787,
  PS = 970,
  PT = 351,
  PW = 680,
  PY = 595,
  QA = 974,
  RE = 262,
  RO = 40,
  RS = 381,
  RU = 7,
  RW = 250,
  SA = 966,
  SB = 677,
  SC = 248,
  SD = 249,
  SE = 46,
  SG = 65,
  SH = 290,
  SI = 386,
  SJ = 47,
  SK = 421,
  SL = 232,
  SM = 378,
  SN = 221,
  SO = 252,
  SR = 597,
  SS = 211,
  ST = 239,
  SV = 503,
  SX = 1,
  SY = 963,
  SZ = 268,
  TA = 290,
  TC = 1 - 649,
  TD = 235,
  TF = 262,
  TG = 228,
  TH = 66,
  TJ = 992,
  TK = 690,
  TL = 670,
  TM = 993,
  TN = 216,
  TO = 676,
  TR = 90,
  TT = 1 - 868,
  TV = 688,
  TW = 886,
  TZ = 255,
  UA = 380,
  UG = 256,
  UM = 1,
  US = 1,
  UY = 598,
  UZ = 998,
  VA = 379,
  VC = 1 - 784,
  VE = 58,
  VG = 1 - 284,
  VI = 1 - 340,
  VN = 84,
  VU = 678,
  WF = 681,
  WS = 685,
  YE = 967,
  YT = 262,
  ZA = 27,
  ZM = 260,
  ZW = 263
}

export class CountriesMapsSearchInterface {

  static getEnglishLocationFromEnumValue(c: Countries) {
    return CountriesMapsSearchInterface.listOfCountries().get(c);
  }

  static listOfCountries() {
    let countriesSearchList: Map<Countries, string> = new Map<Countries, string>();
    countriesSearchList.set(Countries.AF, "Afghanistan");
    countriesSearchList.set(Countries.AX, "Aland Islands");
    countriesSearchList.set(Countries.AL, "Albania");
    countriesSearchList.set(Countries.DZ, "Algeria");
    countriesSearchList.set(Countries.AS, "American Samoa");
    countriesSearchList.set(Countries.AD, "Andorra");
    countriesSearchList.set(Countries.AO, "Angola");
    countriesSearchList.set(Countries.AI, "Anguilla");
    countriesSearchList.set(Countries.AQ, "Antarctica");
    countriesSearchList.set(Countries.AG, "Antigua and Barbuda");
    countriesSearchList.set(Countries.AR, "Argentina");
    countriesSearchList.set(Countries.AM, "Armenia");
    countriesSearchList.set(Countries.AW, "Aruba");
    countriesSearchList.set(Countries.AU, "Australia");
    countriesSearchList.set(Countries.AT, "Austria");
    countriesSearchList.set(Countries.AZ, "Azerbaijan");
    countriesSearchList.set(Countries.BS, "Bahamas");
    countriesSearchList.set(Countries.BH, "Bahrain");
    countriesSearchList.set(Countries.BD, "Bangladesh");
    countriesSearchList.set(Countries.BB, "Barbados");
    countriesSearchList.set(Countries.BY, "Belarus");
    countriesSearchList.set(Countries.BE, "Belgium");
    countriesSearchList.set(Countries.BZ, "Belize");
    countriesSearchList.set(Countries.BJ, "Benin");
    countriesSearchList.set(Countries.BM, "Bermuda");
    countriesSearchList.set(Countries.BT, "Bhutan");
    countriesSearchList.set(Countries.BO, "Bolivia");
    countriesSearchList.set(Countries.BQ, "Bonaire, Sint Eustatius and Saba");
    countriesSearchList.set(Countries.BA, "Bosnia and Herzegovina");
    countriesSearchList.set(Countries.BW, "Botswana");
    countriesSearchList.set(Countries.BV, "Bouvet Island");
    countriesSearchList.set(Countries.BR, "Brazil");
    countriesSearchList.set(Countries.IO, "British Indian Ocean Territory");
    countriesSearchList.set(Countries.BN, "Brunei");
    countriesSearchList.set(Countries.BG, "Bulgaria");
    countriesSearchList.set(Countries.BF, "Burkina Faso");
    countriesSearchList.set(Countries.BI, "Burundi");
    countriesSearchList.set(Countries.KH, "Cambodia");
    countriesSearchList.set(Countries.CM, "Cameroon");
    countriesSearchList.set(Countries.CA, "Canada");
    countriesSearchList.set(Countries.CV, "Cape Verde");
    countriesSearchList.set(Countries.KY, "Cayman Islands");
    countriesSearchList.set(Countries.CF, "Central African Republic");
    countriesSearchList.set(Countries.TD, "Chad");
    countriesSearchList.set(Countries.CL, "Chile");
    countriesSearchList.set(Countries.CN, "China");
    countriesSearchList.set(Countries.CX, "Christmas Island");
    countriesSearchList.set(Countries.CC, "Cocos (Keeling) Islands");
    countriesSearchList.set(Countries.CO, "Colombia");
    countriesSearchList.set(Countries.KM, "Comoros");
    countriesSearchList.set(Countries.CG, "Congo");
    countriesSearchList.set(Countries.CD, "Congo, the Democratic Republic of the");
    countriesSearchList.set(Countries.CK, "Cook Islands");
    countriesSearchList.set(Countries.CR, "Costa Rica");
    countriesSearchList.set(Countries.CI, "Ivory Coast");
    countriesSearchList.set(Countries.HR, "Croatia");
    countriesSearchList.set(Countries.CU, "Cuba");
    countriesSearchList.set(Countries.CW, "Curaçao");
    countriesSearchList.set(Countries.CY, "Cyprus");
    countriesSearchList.set(Countries.CZ, "Czech Republic");
    countriesSearchList.set(Countries.DK, "Denmark");
    countriesSearchList.set(Countries.DJ, "Djibouti");
    countriesSearchList.set(Countries.DM, "Dominica");
    countriesSearchList.set(Countries.DO, "Dominican Republic");
    countriesSearchList.set(Countries.EC, "Ecuador");
    countriesSearchList.set(Countries.EG, "Egypt");
    countriesSearchList.set(Countries.SV, "El Salvador");
    countriesSearchList.set(Countries.GQ, "Equatorial Guinea");
    countriesSearchList.set(Countries.ER, "Eritrea");
    countriesSearchList.set(Countries.EE, "Estonia");
    countriesSearchList.set(Countries.ET, "Ethiopia");
    countriesSearchList.set(Countries.FK, "Falkland Islands");
    countriesSearchList.set(Countries.FO, "Faroe Islands");
    countriesSearchList.set(Countries.FJ, "Fiji");
    countriesSearchList.set(Countries.FI, "Finland");
    countriesSearchList.set(Countries.FR, "France");
    countriesSearchList.set(Countries.GF, "French Guiana");
    countriesSearchList.set(Countries.PF, "French Polynesia");
    countriesSearchList.set(Countries.TF, "French Southern Territories");
    countriesSearchList.set(Countries.GA, "Gabon");
    countriesSearchList.set(Countries.GM, "Gambia");
    countriesSearchList.set(Countries.GE, "Georgia");
    countriesSearchList.set(Countries.DE, "Germany");
    countriesSearchList.set(Countries.GH, "Ghana");
    countriesSearchList.set(Countries.GI, "Gibraltar");
    countriesSearchList.set(Countries.GR, "Greece");
    countriesSearchList.set(Countries.GL, "Greenland");
    countriesSearchList.set(Countries.GD, "Grenada");
    countriesSearchList.set(Countries.GP, "Guadeloupe");
    countriesSearchList.set(Countries.GU, "Guam");
    countriesSearchList.set(Countries.GT, "Guatemala");
    countriesSearchList.set(Countries.GG, "Guernsey");
    countriesSearchList.set(Countries.GN, "Guinea");
    countriesSearchList.set(Countries.GW, "Guinea-Bissau");
    countriesSearchList.set(Countries.GY, "Guyana");
    countriesSearchList.set(Countries.HT, "Haiti");
    countriesSearchList.set(Countries.HM, "Heard Island and McDonald Islands");
    countriesSearchList.set(Countries.VA, "Holy See (Vatican City State)");
    countriesSearchList.set(Countries.HN, "Honduras");
    countriesSearchList.set(Countries.HK, "Hong Kong");
    countriesSearchList.set(Countries.HU, "Hungary");
    countriesSearchList.set(Countries.IS, "Iceland");
    countriesSearchList.set(Countries.IN, "India");
    countriesSearchList.set(Countries.ID, "Indonesia");
    countriesSearchList.set(Countries.IR, "Iran, Islamic Republic of");
    countriesSearchList.set(Countries.IQ, "Iraq");
    countriesSearchList.set(Countries.IE, "Ireland");
    countriesSearchList.set(Countries.IM, "Isle of Man");
    countriesSearchList.set(Countries.IL, "Israel");
    countriesSearchList.set(Countries.IT, "Italy");
    countriesSearchList.set(Countries.JM, "Jamaica");
    countriesSearchList.set(Countries.JP, "Japan");
    countriesSearchList.set(Countries.JE, "Jersey");
    countriesSearchList.set(Countries.JO, "Jordan");
    countriesSearchList.set(Countries.KZ, "Kazakhstan");
    countriesSearchList.set(Countries.KE, "Kenya");
    countriesSearchList.set(Countries.KI, "Kiribati");
    countriesSearchList.set(Countries.KP, "Korea, Democratic People's Republic of");
    countriesSearchList.set(Countries.KR, "Korea, Republic of");
    countriesSearchList.set(Countries.KW, "Kuwait");
    countriesSearchList.set(Countries.KG, "Kyrgyzstan");
    countriesSearchList.set(Countries.LA, "Lao People's Democratic Republic");
    countriesSearchList.set(Countries.LV, "Latvia");
    countriesSearchList.set(Countries.LB, "Lebanon");
    countriesSearchList.set(Countries.LS, "Lesotho");
    countriesSearchList.set(Countries.LR, "Liberia");
    countriesSearchList.set(Countries.LY, "Libya");
    countriesSearchList.set(Countries.LI, "Liechtenstein");
    countriesSearchList.set(Countries.LT, "Lithuania");
    countriesSearchList.set(Countries.LU, "Luxembourg");
    countriesSearchList.set(Countries.MO, "Macao");
    countriesSearchList.set(Countries.MK, "Macedonia, the former Yugoslav Republic of");
    countriesSearchList.set(Countries.MG, "Madagascar");
    countriesSearchList.set(Countries.MW, "Malawi");
    countriesSearchList.set(Countries.MY, "Malaysia");
    countriesSearchList.set(Countries.MV, "Maldives");
    countriesSearchList.set(Countries.ML, "Mali");
    countriesSearchList.set(Countries.MT, "Malta");
    countriesSearchList.set(Countries.MH, "Marshall Islands");
    countriesSearchList.set(Countries.MQ, "Martinique");
    countriesSearchList.set(Countries.MR, "Mauritania");
    countriesSearchList.set(Countries.MU, "Mauritius");
    countriesSearchList.set(Countries.YT, "Mayotte");
    countriesSearchList.set(Countries.MX, "Mexico");
    countriesSearchList.set(Countries.FM, "Micronesia, Federated States of");
    countriesSearchList.set(Countries.MD, "Moldova, Republic of");
    countriesSearchList.set(Countries.MC, "Monaco");
    countriesSearchList.set(Countries.MN, "Mongolia");
    countriesSearchList.set(Countries.ME, "Montenegro");
    countriesSearchList.set(Countries.MS, "Montserrat");
    countriesSearchList.set(Countries.MA, "Morocco");
    countriesSearchList.set(Countries.MZ, "Mozambique");
    countriesSearchList.set(Countries.MM, "Myanmar");
    countriesSearchList.set(Countries.NA, "Namibia");
    countriesSearchList.set(Countries.NR, "Nauru");
    countriesSearchList.set(Countries.NP, "Nepal");
    countriesSearchList.set(Countries.NL, "Netherlands");
    countriesSearchList.set(Countries.NC, "New Caledonia");
    countriesSearchList.set(Countries.NZ, "New Zealand");
    countriesSearchList.set(Countries.NI, "Nicaragua");
    countriesSearchList.set(Countries.NE, "Niger");
    countriesSearchList.set(Countries.NG, "Nigeria");
    countriesSearchList.set(Countries.NU, "Niue");
    countriesSearchList.set(Countries.NF, "Norfolk Island");
    countriesSearchList.set(Countries.MP, "Northern Mariana Islands");
    countriesSearchList.set(Countries.NO, "Norway");
    countriesSearchList.set(Countries.OM, "Oman");
    countriesSearchList.set(Countries.PK, "Pakistan");
    countriesSearchList.set(Countries.PW, "Palau");
    countriesSearchList.set(Countries.PS, "Palestinian Territory, Occupied");
    countriesSearchList.set(Countries.PA, "Panama");
    countriesSearchList.set(Countries.PG, "Papua New Guinea");
    countriesSearchList.set(Countries.PY, "Paraguay");
    countriesSearchList.set(Countries.PE, "Peru");
    countriesSearchList.set(Countries.PH, "Philippines");
    countriesSearchList.set(Countries.PN, "Pitcairn");
    countriesSearchList.set(Countries.PL, "Poland");
    countriesSearchList.set(Countries.PT, "Portugal");
    countriesSearchList.set(Countries.PR, "Puerto Rico");
    countriesSearchList.set(Countries.QA, "Qatar");
    countriesSearchList.set(Countries.RE, "Réunion");
    countriesSearchList.set(Countries.RO, "Romania");
    countriesSearchList.set(Countries.RU, "Russian Federation");
    countriesSearchList.set(Countries.RW, "Rwanda");
    countriesSearchList.set(Countries.BL, "Saint Barthélemy");
    countriesSearchList.set(Countries.SH, "Saint Helena, Ascension and Tristan da Cunha");
    countriesSearchList.set(Countries.KN, "Saint Kitts and Nevis");
    countriesSearchList.set(Countries.LC, "Saint Lucia");
    countriesSearchList.set(Countries.MF, "Saint Martin (French part)");
    countriesSearchList.set(Countries.PM, "Saint Pierre and Miquelon");
    countriesSearchList.set(Countries.VC, "Saint Vincent and the Grenadines");
    countriesSearchList.set(Countries.WS, "Samoa");
    countriesSearchList.set(Countries.SM, "San Marino");
    countriesSearchList.set(Countries.ST, "Sao Tome and Principe");
    countriesSearchList.set(Countries.SA, "Saudi Arabia");
    countriesSearchList.set(Countries.SN, "Senegal");
    countriesSearchList.set(Countries.RS, "Serbia");
    countriesSearchList.set(Countries.SC, "Seychelles");
    countriesSearchList.set(Countries.SL, "Sierra Leone");
    countriesSearchList.set(Countries.SG, "Singapore");
    countriesSearchList.set(Countries.SX, "Sint Maarten (Dutch part)");
    countriesSearchList.set(Countries.SK, "Slovakia");
    countriesSearchList.set(Countries.SI, "Slovenia");
    countriesSearchList.set(Countries.SB, "Solomon Islands");
    countriesSearchList.set(Countries.SO, "Somalia");
    countriesSearchList.set(Countries.ZA, "South Africa");
    countriesSearchList.set(Countries.GS, "South Georgia and the South Sandwich Islands");
    countriesSearchList.set(Countries.SS, "South Sudan");
    countriesSearchList.set(Countries.ES, "Spain");
    countriesSearchList.set(Countries.LK, "Sri Lanka");
    countriesSearchList.set(Countries.SD, "Sudan");
    countriesSearchList.set(Countries.SR, "Suriname");
    countriesSearchList.set(Countries.SJ, "Svalbard and Jan Mayen");
    countriesSearchList.set(Countries.SZ, "Swaziland");
    countriesSearchList.set(Countries.SE, "Sweden");
    countriesSearchList.set(Countries.CH, "Switzerland");
    countriesSearchList.set(Countries.SY, "Syrian Arab Republic");
    countriesSearchList.set(Countries.TW, "Taiwan, Province of China");
    countriesSearchList.set(Countries.TJ, "Tajikistan");
    countriesSearchList.set(Countries.TZ, "Tanzania, United Republic of");
    countriesSearchList.set(Countries.TH, "Thailand");
    countriesSearchList.set(Countries.TL, "Timor-Leste");
    countriesSearchList.set(Countries.TG, "Togo");
    countriesSearchList.set(Countries.TK, "Tokelau");
    countriesSearchList.set(Countries.TO, "Tonga");
    countriesSearchList.set(Countries.TT, "Trinidad and Tobago");
    countriesSearchList.set(Countries.TN, "Tunisia");
    countriesSearchList.set(Countries.TR, "Turkey");
    countriesSearchList.set(Countries.TM, "Turkmenistan");
    countriesSearchList.set(Countries.TC, "Turks and Caicos Islands");
    countriesSearchList.set(Countries.TV, "Tuvalu");
    countriesSearchList.set(Countries.UG, "Uganda");
    countriesSearchList.set(Countries.UA, "Ukraine");
    countriesSearchList.set(Countries.AE, "United Arab Emirates");
    countriesSearchList.set(Countries.GB, "United Kingdom");
    countriesSearchList.set(Countries.US, "United States");
    countriesSearchList.set(Countries.UM, "United States Minor Outlying Islands");
    countriesSearchList.set(Countries.UY, "Uruguay");
    countriesSearchList.set(Countries.UZ, "Uzbekistan");
    countriesSearchList.set(Countries.VU, "Vanuatu");
    countriesSearchList.set(Countries.VE, "Venezuela");
    countriesSearchList.set(Countries.VN, "Vietnam");
    countriesSearchList.set(Countries.VG, "Virgin Islands, British");
    countriesSearchList.set(Countries.VI, "Virgin Islands, U.S.");
    countriesSearchList.set(Countries.WF, "Wallis and Futuna");
    countriesSearchList.set(Countries.EH, "Western Sahara");
    countriesSearchList.set(Countries.YE, "Yemen");
    countriesSearchList.set(Countries.ZM, "Zambia");
    countriesSearchList.set(Countries.ZW, "Zimbabwe");
    return countriesSearchList;
  }
}

export enum Countries {
  AF = 0,
  AX = 1,
  AL = 2,
  DZ = 3,
  AS = 4,
  AD = 5,
  AO = 6,
  AI = 7,
  AQ = 8,
  AG = 9,
  AR = 10,
  AM = 11,
  AW = 12,
  AU = 13,
  AT = 14,
  AZ = 15,
  BS = 16,
  BH = 17,
  BD = 18,
  BB = 19,
  BY = 20,
  BE = 21,
  BZ = 22,
  BJ = 23,
  BM = 24,
  BT = 25,
  BO = 26,
  BQ = 27,
  BA = 28,
  BW = 29,
  BV = 30,
  BR = 31,
  IO = 32,
  BN = 33,
  BG = 34,
  BF = 35,
  BI = 36,
  KH = 37,
  CM = 38,
  CA = 39,
  CV = 40,
  KY = 41,
  CF = 42,
  TD = 43,
  CL = 44,
  CN = 45,
  CX = 46,
  CC = 47,
  CO = 48,
  KM = 49,
  CG = 50,
  CD = 51,
  CK = 52,
  CR = 53,
  CI = 54,
  HR = 55,
  CU = 56,
  CW = 57,
  CY = 58,
  CZ = 59,
  DK = 60,
  DJ = 61,
  DM = 62,
  DO = 63,
  EC = 64,
  EG = 65,
  SV = 66,
  GQ = 67,
  ER = 68,
  EE = 69,
  ET = 70,
  FK = 71,
  FO = 72,
  FJ = 73,
  FI = 74,
  FR = 75,
  GF = 76,
  PF = 77,
  TF = 78,
  GA = 79,
  GM = 80,
  GE = 81,
  DE = 82,
  GH = 83,
  GI = 84,
  GR = 85,
  GL = 86,
  GD = 87,
  GP = 88,
  GU = 89,
  GT = 90,
  GG = 91,
  GN = 92,
  GW = 93,
  GY = 94,
  HT = 95,
  HM = 96,
  VA = 97,
  HN = 98,
  HK = 99,
  HU = 100,
  IS = 101,
  IN = 102,
  ID = 103,
  IR = 104,
  IQ = 105,
  IE = 106,
  IM = 107,
  IL = 108,
  IT = 109,
  JM = 110,
  JP = 111,
  JE = 112,
  JO = 113,
  KZ = 114,
  KE = 115,
  KI = 116,
  KP = 117,
  KR = 118,
  KW = 119,
  KG = 120,
  LA = 121,
  LV = 122,
  LB = 123,
  LS = 124,
  LR = 125,
  LY = 126,
  LI = 127,
  LT = 128,
  LU = 129,
  MO = 130,
  MK = 131,
  MG = 132,
  MW = 133,
  MY = 134,
  MV = 135,
  ML = 136,
  MT = 137,
  MH = 138,
  MQ = 139,
  MR = 140,
  MU = 141,
  YT = 142,
  MX = 143,
  FM = 144,
  MD = 145,
  MC = 146,
  MN = 147,
  ME = 148,
  MS = 149,
  MA = 150,
  MZ = 151,
  MM = 152,
  NA = 153,
  NR = 154,
  NP = 155,
  NL = 156,
  NC = 157,
  NZ = 158,
  NI = 159,
  NE = 160,
  NG = 161,
  NU = 162,
  NF = 163,
  MP = 164,
  NO = 165,
  OM = 166,
  PK = 167,
  PW = 168,
  PS = 169,
  PA = 170,
  PG = 171,
  PY = 172,
  PE = 173,
  PH = 174,
  PN = 175,
  PL = 176,
  PT = 177,
  PR = 178,
  QA = 179,
  RE = 180,
  RO = 181,
  RU = 182,
  RW = 183,
  BL = 184,
  SH = 185,
  KN = 186,
  LC = 187,
  MF = 188,
  PM = 189,
  VC = 190,
  WS = 191,
  SM = 192,
  ST = 193,
  SA = 194,
  SN = 195,
  RS = 196,
  SC = 197,
  SL = 198,
  SG = 199,
  SX = 200,
  SK = 201,
  SI = 202,
  SB = 203,
  SO = 204,
  ZA = 205,
  GS = 206,
  SS = 207,
  ES = 208,
  LK = 209,
  SD = 210,
  SR = 211,
  SJ = 212,
  SZ = 213,
  SE = 214,
  CH = 215,
  SY = 216,
  TW = 217,
  TJ = 218,
  TZ = 219,
  TH = 220,
  TL = 221,
  TG = 222,
  TK = 223,
  TO = 224,
  TT = 225,
  TN = 226,
  TR = 227,
  TM = 228,
  TC = 229,
  TV = 230,
  UG = 231,
  UA = 232,
  AE = 233,
  GB = 234,
  US = 235,
  UM = 236,
  UY = 237,
  UZ = 238,
  VU = 239,
  VE = 240,
  VN = 241,
  VG = 242,
  VI = 243,
  WF = 244,
  EH = 245,
  YE = 246,
  ZM = 247,
  ZW = 248
}

export class Countries3ISO {
  private map: Map<Countries, string>;

  public static init(): Countries3ISO {
    let iso = new Countries3ISO();
    iso.map = new Map<Countries, string>();
    iso.map.set(Countries.AF, "AFG");
    iso.map.set(Countries.AX, "ALA");
    iso.map.set(Countries.AL, "ALB");
    iso.map.set(Countries.DZ, "DZA");
    iso.map.set(Countries.AS, "ASM");
    iso.map.set(Countries.AD, "AND");
    iso.map.set(Countries.AO, "AGO");
    iso.map.set(Countries.AI, "AIA");
    iso.map.set(Countries.AQ, "ATA");
    iso.map.set(Countries.AG, "ATG");
    iso.map.set(Countries.AR, "ARG");
    iso.map.set(Countries.AM, "ARM");
    iso.map.set(Countries.AW, "ABW");
    iso.map.set(Countries.AU, "AUS");
    iso.map.set(Countries.AT, "AUT");
    iso.map.set(Countries.AZ, "AZE");
    iso.map.set(Countries.BS, "BHS");
    iso.map.set(Countries.BH, "BHR");
    iso.map.set(Countries.BD, "BGD");
    iso.map.set(Countries.BB, "BRB");
    iso.map.set(Countries.BY, "BLR");
    iso.map.set(Countries.BE, "BEL");
    iso.map.set(Countries.BZ, "BLZ");
    iso.map.set(Countries.BJ, "BEN");
    iso.map.set(Countries.BM, "BMU");
    iso.map.set(Countries.BT, "BTN");
    iso.map.set(Countries.BO, "BOL");
    iso.map.set(Countries.BA, "BIH");
    iso.map.set(Countries.BW, "BWA");
    iso.map.set(Countries.BV, "BVT");
    iso.map.set(Countries.BR, "BRA");
    iso.map.set(Countries.VG, "VGB");
    iso.map.set(Countries.IO, "IOT");
    iso.map.set(Countries.BN, "BRN");
    iso.map.set(Countries.BG, "BGR");
    iso.map.set(Countries.BF, "BFA");
    iso.map.set(Countries.BI, "BDI");
    iso.map.set(Countries.KH, "KHM");
    iso.map.set(Countries.CM, "CMR");
    iso.map.set(Countries.CA, "CAN");
    iso.map.set(Countries.CV, "CPV");
    iso.map.set(Countries.KY, "CYM");
    iso.map.set(Countries.CF, "CAF");
    iso.map.set(Countries.TD, "TCD");
    iso.map.set(Countries.CL, "CHL");
    iso.map.set(Countries.CN, "CHN");
    iso.map.set(Countries.HK, "HKG");
    iso.map.set(Countries.MO, "MAC");
    iso.map.set(Countries.CX, "CXR");
    iso.map.set(Countries.CC, "CCK");
    iso.map.set(Countries.CO, "COL");
    iso.map.set(Countries.KM, "COM");
    iso.map.set(Countries.CG, "COG");
    iso.map.set(Countries.CD, "COD");
    iso.map.set(Countries.CK, "COK");
    iso.map.set(Countries.CR, "CRI");
    iso.map.set(Countries.CI, "CIV");
    iso.map.set(Countries.HR, "HRV");
    iso.map.set(Countries.CU, "CUB");
    iso.map.set(Countries.CY, "CYP");
    iso.map.set(Countries.CZ, "CZE");
    iso.map.set(Countries.DK, "DNK");
    iso.map.set(Countries.DJ, "DJI");
    iso.map.set(Countries.DM, "DMA");
    iso.map.set(Countries.DO, "DOM");
    iso.map.set(Countries.EC, "ECU");
    iso.map.set(Countries.EG, "EGY");
    iso.map.set(Countries.SV, "SLV");
    iso.map.set(Countries.GQ, "GNQ");
    iso.map.set(Countries.ER, "ERI");
    iso.map.set(Countries.EE, "EST");
    iso.map.set(Countries.ET, "ETH");
    iso.map.set(Countries.FK, "FLK");
    iso.map.set(Countries.FO, "FRO");
    iso.map.set(Countries.FJ, "FJI");
    iso.map.set(Countries.FI, "FIN");
    iso.map.set(Countries.FR, "FRA");
    iso.map.set(Countries.GF, "GUF");
    iso.map.set(Countries.PF, "PYF");
    iso.map.set(Countries.TF, "ATF");
    iso.map.set(Countries.GA, "GAB");
    iso.map.set(Countries.GM, "GMB");
    iso.map.set(Countries.GE, "GEO");
    iso.map.set(Countries.DE, "DEU");
    iso.map.set(Countries.GH, "GHA");
    iso.map.set(Countries.GI, "GIB");
    iso.map.set(Countries.GR, "GRC");
    iso.map.set(Countries.GL, "GRL");
    iso.map.set(Countries.GD, "GRD");
    iso.map.set(Countries.GP, "GLP");
    iso.map.set(Countries.GU, "GUM");
    iso.map.set(Countries.GT, "GTM");
    iso.map.set(Countries.GG, "GGY");
    iso.map.set(Countries.GN, "GIN");
    iso.map.set(Countries.GW, "GNB");
    iso.map.set(Countries.GY, "GUY");
    iso.map.set(Countries.HT, "HTI");
    iso.map.set(Countries.HM, "HMD");
    iso.map.set(Countries.VA, "VAT");
    iso.map.set(Countries.HN, "HND");
    iso.map.set(Countries.HU, "HUN");
    iso.map.set(Countries.IS, "ISL");
    iso.map.set(Countries.IN, "IND");
    iso.map.set(Countries.ID, "IDN");
    iso.map.set(Countries.IR, "IRN");
    iso.map.set(Countries.IQ, "IRQ");
    iso.map.set(Countries.IE, "IRL");
    iso.map.set(Countries.IM, "IMN");
    iso.map.set(Countries.IL, "ISR");
    iso.map.set(Countries.IT, "ITA");
    iso.map.set(Countries.JM, "JAM");
    iso.map.set(Countries.JP, "JPN");
    iso.map.set(Countries.JE, "JEY");
    iso.map.set(Countries.JO, "JOR");
    iso.map.set(Countries.KZ, "KAZ");
    iso.map.set(Countries.KE, "KEN");
    iso.map.set(Countries.KI, "KIR");
    iso.map.set(Countries.KP, "PRK");
    iso.map.set(Countries.KR, "KOR");
    iso.map.set(Countries.KW, "KWT");
    iso.map.set(Countries.KG, "KGZ");
    iso.map.set(Countries.LA, "LAO");
    iso.map.set(Countries.LV, "LVA");
    iso.map.set(Countries.LB, "LBN");
    iso.map.set(Countries.LS, "LSO");
    iso.map.set(Countries.LR, "LBR");
    iso.map.set(Countries.LY, "LBY");
    iso.map.set(Countries.LI, "LIE");
    iso.map.set(Countries.LT, "LTU");
    iso.map.set(Countries.LU, "LUX");
    iso.map.set(Countries.MK, "MKD");
    iso.map.set(Countries.MG, "MDG");
    iso.map.set(Countries.MW, "MWI");
    iso.map.set(Countries.MY, "MYS");
    iso.map.set(Countries.MV, "MDV");
    iso.map.set(Countries.ML, "MLI");
    iso.map.set(Countries.MT, "MLT");
    iso.map.set(Countries.MH, "MHL");
    iso.map.set(Countries.MQ, "MTQ");
    iso.map.set(Countries.MR, "MRT");
    iso.map.set(Countries.MU, "MUS");
    iso.map.set(Countries.YT, "MYT");
    iso.map.set(Countries.MX, "MEX");
    iso.map.set(Countries.FM, "FSM");
    iso.map.set(Countries.MD, "MDA");
    iso.map.set(Countries.MC, "MCO");
    iso.map.set(Countries.MN, "MNG");
    iso.map.set(Countries.ME, "MNE");
    iso.map.set(Countries.MS, "MSR");
    iso.map.set(Countries.MA, "MAR");
    iso.map.set(Countries.MZ, "MOZ");
    iso.map.set(Countries.MM, "MMR");
    iso.map.set(Countries.NA, "NAM");
    iso.map.set(Countries.NR, "NRU");
    iso.map.set(Countries.NP, "NPL");
    iso.map.set(Countries.NL, "NLD");
    iso.map.set(Countries.NC, "NCL");
    iso.map.set(Countries.NZ, "NZL");
    iso.map.set(Countries.NI, "NIC");
    iso.map.set(Countries.NE, "NER");
    iso.map.set(Countries.NG, "NGA");
    iso.map.set(Countries.NU, "NIU");
    iso.map.set(Countries.NF, "NFK");
    iso.map.set(Countries.MP, "MNP");
    iso.map.set(Countries.NO, "NOR");
    iso.map.set(Countries.OM, "OMN");
    iso.map.set(Countries.PK, "PAK");
    iso.map.set(Countries.PW, "PLW");
    iso.map.set(Countries.PS, "PSE");
    iso.map.set(Countries.PA, "PAN");
    iso.map.set(Countries.PG, "PNG");
    iso.map.set(Countries.PY, "PRY");
    iso.map.set(Countries.PE, "PER");
    iso.map.set(Countries.PH, "PHL");
    iso.map.set(Countries.PN, "PCN");
    iso.map.set(Countries.PL, "POL");
    iso.map.set(Countries.PT, "PRT");
    iso.map.set(Countries.PR, "PRI");
    iso.map.set(Countries.QA, "QAT");
    iso.map.set(Countries.RE, "REU");
    iso.map.set(Countries.RO, "ROU");
    iso.map.set(Countries.RU, "RUS");
    iso.map.set(Countries.RW, "RWA");
    iso.map.set(Countries.BL, "BLM");
    iso.map.set(Countries.SH, "SHN");
    iso.map.set(Countries.KN, "KNA");
    iso.map.set(Countries.LC, "LCA");
    iso.map.set(Countries.MF, "MAF");
    iso.map.set(Countries.PM, "SPM");
    iso.map.set(Countries.VC, "VCT");
    iso.map.set(Countries.WS, "WSM");
    iso.map.set(Countries.SM, "SMR");
    iso.map.set(Countries.ST, "STP");
    iso.map.set(Countries.SA, "SAU");
    iso.map.set(Countries.SN, "SEN");
    iso.map.set(Countries.RS, "SRB");
    iso.map.set(Countries.SC, "SYC");
    iso.map.set(Countries.SL, "SLE");
    iso.map.set(Countries.SG, "SGP");
    iso.map.set(Countries.SK, "SVK");
    iso.map.set(Countries.SI, "SVN");
    iso.map.set(Countries.SB, "SLB");
    iso.map.set(Countries.SO, "SOM");
    iso.map.set(Countries.ZA, "ZAF");
    iso.map.set(Countries.GS, "SGS");
    iso.map.set(Countries.SS, "SSD");
    iso.map.set(Countries.ES, "ESP");
    iso.map.set(Countries.LK, "LKA");
    iso.map.set(Countries.SD, "SDN");
    iso.map.set(Countries.SR, "SUR");
    iso.map.set(Countries.SJ, "SJM");
    iso.map.set(Countries.SZ, "SWZ");
    iso.map.set(Countries.SE, "SWE");
    iso.map.set(Countries.CH, "CHE");
    iso.map.set(Countries.SY, "SYR");
    iso.map.set(Countries.TW, "TWN");
    iso.map.set(Countries.TJ, "TJK");
    iso.map.set(Countries.TZ, "TZA");
    iso.map.set(Countries.TH, "THA");
    iso.map.set(Countries.TL, "TLS");
    iso.map.set(Countries.TG, "TGO");
    iso.map.set(Countries.TK, "TKL");
    iso.map.set(Countries.TO, "TON");
    iso.map.set(Countries.TT, "TTO");
    iso.map.set(Countries.TN, "TUN");
    iso.map.set(Countries.TR, "TUR");
    iso.map.set(Countries.TM, "TKM");
    iso.map.set(Countries.TC, "TCA");
    iso.map.set(Countries.TV, "TUV");
    iso.map.set(Countries.UG, "UGA");
    iso.map.set(Countries.UA, "UKR");
    iso.map.set(Countries.AE, "ARE");
    iso.map.set(Countries.GB, "GBR");
    iso.map.set(Countries.US, "USA");
    iso.map.set(Countries.UM, "UMI");
    iso.map.set(Countries.UY, "URY");
    iso.map.set(Countries.UZ, "UZB");
    iso.map.set(Countries.VU, "VUT");
    iso.map.set(Countries.VE, "VEN");
    iso.map.set(Countries.VN, "VNM");
    iso.map.set(Countries.VI, "VIR");
    iso.map.set(Countries.WF, "WLF");
    iso.map.set(Countries.EH, "ESH");
    iso.map.set(Countries.YE, "YEM");
    iso.map.set(Countries.ZM, "ZMB");
    iso.map.set(Countries.ZW, "ZWE");
    return iso;
  }

  public get(code: Countries): string {
    return this.map.get(code);
  }
}

export class InformCodes {
  public map: Map<string, HazardScenario>;
  public list: string[];

  // "HAZARD_SCENARIO0": "Cold Wave",
  // "HAZARD_SCENARIO1": "Conflict",
  // "HAZARD_SCENARIO2": "Cyclone",
  // "HAZARD_SCENARIO3": "Drought",
  // "HAZARD_SCENARIO4": "Earthquake",
  // "HAZARD_SCENARIO5": "Epidemic",
  // "HAZARD_SCENARIO6": "Fire",
  // "HAZARD_SCENARIO7": "Flash Flood",
  // "HAZARD_SCENARIO8": "Flood",
  // "HAZARD_SCENARIO9": "Heat Wave",
  // "HAZARD_SCENARIO10": "Heavy Rain",
  // "HAZARD_SCENARIO11": "Humanitarian Access",
  // "HAZARD_SCENARIO12": "Insect Infestation",
  // "HAZARD_SCENARIO13": "Landslide",
  // "HAZARD_SCENARIO14": "Locust Infestation",
  // "HAZARD_SCENARIO15": "Mudslide",
  // "HAZARD_SCENARIO16": "Population Displacement",
  // "HAZARD_SCENARIO17": "Population Return",
  // "HAZARD_SCENARIO18": "Snow Avalanche",
  // "HAZARD_SCENARIO19": "Snowfall",
  // "HAZARD_SCENARIO20": "Storm",
  // "HAZARD_SCENARIO21": "Storm Surge",
  // "HAZARD_SCENARIO22": "Technological Disaster",
  // "HAZARD_SCENARIO23": "Tornado",
  // "HAZARD_SCENARIO24": "Tsunami",
  // "HAZARD_SCENARIO25": "Violent Wind",
  // "HAZARD_SCENARIO26": "Volcano"

  public static init(): InformCodes {
    let informCodes: InformCodes = new InformCodes();
    informCodes.map = new Map<string, HazardScenario>();
    informCodes.map.set("HA.NAT.FL", HazardScenario.HazardScenario8); // Flood
    informCodes.map.set("HA.NAT.TC", HazardScenario.HazardScenario2); // Tropical Cyclone
    informCodes.map.set("HA.NAT.EQ", HazardScenario.HazardScenario4); // Earthquake
    informCodes.map.set("HA.NAT.TS", HazardScenario.HazardScenario24); // Tsunami
    informCodes.map.set("HA.NAT.DR", HazardScenario.HazardScenario3); // Drought
    informCodes.map.set("HA.HUM.CON.GCRI", HazardScenario.HazardScenario1); // Conflict
    informCodes.map.set("VU.SEV.AD.FTS-POP", HazardScenario.HazardScenario11); // Humanitarian Access
    informCodes.map.set("HA.NAT.TC.CS", HazardScenario.HazardScenario21); // Storm Surge
    informCodes.list = [];
    informCodes.map.forEach((val, key) => {
      informCodes.list.push(key);
    });
    return informCodes;
  }

  public get(val: string): HazardScenario {
    return this.map.get(val);
  }
}

export enum ApprovalStatus {
  InProgress = 0,
  WaitingApproval = 1,
  Approved = 2,
  NeedsReviewing = 3
}

export enum Department {
  CHS = 0,
  Finance = 1,
  HR = 2,
  Logistics = 3,
  Programme = 4
}

export enum HazardCategory {
  Earthquake = 0,
  Tsunami = 1,
  Drought = 2
}

export enum AlertMessageType {
  Error = 0,
  Success = 1
}

export enum BudgetCategory {
  Inputs = 0,
  Transport = 1,
  Security = 2,
  Logistics = 3,
  Staffing = 4,
  Monitoring = 5,
  CapitalItems = 6,
  ManagementSupport = 7
}

export enum ActionStatus {
  Expired = 0,
  InProgress = 1,
  Completed = 2,
  Inactive = 3,
  Archived = 4
}
export enum ActionStatusMin {
  Expired = 0,
  InProgress = 1,
  Completed = 2,
  Archived = 3
}

export enum SizeType {
  KB = 0,
  MB = 1
}

// All - Added to work with filters
export enum AlertLevels {
  Green = 0,
  Amber = 1,
  Red = 2,
  All = 3
}

export enum GeoLocation {
  national = 0,
  subnational = 1
}

export enum ThresholdName { // alias for AlertLevel
  Green = 0,
  Amber = 1,
  Red = 2
}

export enum AlertStatus {
  WaitingResponse = 0,
  Approved = 1,
  Rejected = 2
}

export enum DashboardType {
  default = 0,
  director = 1
}

export enum Month {
  january = 1,
  february = 2,
  march = 3,
  april = 4,
  may = 5,
  june = 6,
  july = 7,
  august = 8,
  september = 9,
  october = 10,
  november = 11,
  december = 12
}

export enum StockType {
  Country = 0,
  External = 1
}

