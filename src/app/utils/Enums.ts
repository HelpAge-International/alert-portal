/**
 * Created by Sanjaya on 07/03/2017.
 */

export enum ActionType {
    chs = 0,
    mandated = 1,
    custom = 2
}

// TODO - Update when Ryan provides actual Category names
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

// TODO - Update when Ryan provides actual Hazard Scenario names
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
    Dr = 3,
    Prof = 4
}

export enum FileType {
    MB = 0,
    GB = 1
}

export enum Currency {
    GBP = 0,
    EUR = 1,
    USD = 2
}

export enum StaffPosition {
    All = 0,
    OfficeDirector = 1,
    OfficeStarff = 2
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
    SystemAdmin = 12
}
export enum OfficeType {
    All = 0,
    FieldOffice = 1,
    LabOffice = 2
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
    ActivitySummary = 3,
    TargetPopulation = 4,
    ExpectedResults = 5,
    Activities = 6,
    MonitoringAccLearning = 7,
    DoubleCounting = 8,
    Budget = 9
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
    withPartner = 1
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
    GB = 44,
    FR = 33
}

export enum Countries {
    GB = 0,
    FR = 1,
    DE = 2,
    AF = 3,
    AX = 4,
    AL = 5,
    DZ = 6,
    AS = 7,
    AD = 8,
    AO = 9,
    AI = 10,
    AQ = 11,
    AG = 12,
    AR = 13,
    AM = 14,
    AW = 15,
    AU = 16,
    AT = 17,
    AZ = 18,
    BS = 19,
    BH = 20,
    BD = 21,
    BB = 22,
    BY = 23,
    BE = 24,
    BZ = 25,
    BJ = 26,
    BM = 27,
    BT = 28,
    BO = 29,
    BQ = 30,
    BA = 31,
    BW = 32,
    BV = 33,
    BR = 34,
    IO = 35,
    BN = 36,
    BG = 37,
    BF = 38,
    BI = 39,
    KH = 40,
    CM = 41,
    CA = 42,
    CV = 43,
    KY = 44,
    CF = 45,
    TD = 46,
    CL = 47,
    CN = 48,
    CX = 49,
    CC = 50,
    CO = 51,
    KM = 52,
    CG = 53,
    CD = 54,
    CK = 55,
    CR = 56,
    CI = 57,
    HR = 58,
    CU = 59,
    CW = 60,
    CY = 61,
    CZ = 62,
    DK = 63,
    DJ = 64,
    DM = 65,
    DO = 66,
    EC = 67,
    EG = 68,
    SV = 69,
    GQ = 70,
    ER = 71,
    EE = 72,
    ET = 73,
    FK = 74,
    FO = 75,
    FJ = 76,
    FI = 77,
    GF = 78,
    PF = 79,
    TF = 80,
    GA = 81,
    GM = 82,
    GE = 83,
    GH = 84,
    GI = 85,
    GR = 86,
    GL = 87,
    GD = 88,
    GP = 89,
    GU = 90,
    GT = 91,
    GG = 92,
    GN = 93,
    GW = 94,
    GY = 95,
    HT = 96,
    HM = 97,
    VA = 98,
    HN = 99,
    HK = 100,
    HU = 101,
    IS = 102,
    IN = 103,
    ID = 104,
    IR = 105,
    IQ = 106,
    IE = 107,
    IM = 108,
    IL = 109,
    IT = 110,
    JM = 111,
    JP = 112,
    JE = 113,
    JO = 114,
    KZ = 115,
    KE = 116,
    KI = 117,
    KP = 118,
    KR = 119,
    KW = 120,
    KG = 121,
    LA = 122,
    LV = 123,
    LB = 124,
    LS = 125,
    LR = 126,
    LY = 127,
    LI = 128,
    LT = 129,
    LU = 130,
    MO = 131,
    MK = 132,
    MG = 133,
    MW = 134,
    MY = 135,
    MV = 136,
    ML = 137,
    MT = 138,
    MH = 139,
    MQ = 140,
    MR = 141,
    MU = 142,
    YT = 143,
    MX = 144,
    FM = 145,
    MD = 146,
    MC = 147,
    MN = 148,
    ME = 149,
    MS = 150,
    MA = 151,
    MZ = 152,
    MM = 153,
    NA = 154,
    NR = 155,
    NP = 156,
    NL = 157,
    NC = 158,
    NZ = 159,
    NI = 160,
    NE = 161,
    NG = 162,
    NU = 163,
    NF = 164,
    MP = 165,
    NO = 166,
    OM = 167,
    PK = 168,
    PW = 169,
    PS = 170,
    PA = 171,
    PG = 172,
    PY = 173,
    PE = 174,
    PH = 175,
    PN = 176,
    PL = 177,
    PT = 178,
    PR = 179,
    QA = 180,
    RE = 181,
    RO = 182,
    RU = 183,
    RW = 184,
    BL = 185,
    SH = 186,
    KN = 187,
    LC = 188,
    MF = 189,
    PM = 190,
    VC = 191,
    WS = 192,
    SM = 193,
    ST = 194,
    SA = 195,
    SN = 196,
    RS = 197,
    SC = 198,
    SL = 199,
    SG = 200,
    SX = 201,
    SK = 202,
    SI = 203,
    SB = 204,
    SO = 205,
    ZA = 206,
    GS = 207,
    SS = 208,
    ES = 209,
    LK = 210,
    SD = 211,
    SR = 212,
    SJ = 213,
    SZ = 214,
    SE = 215,
    CH = 216,
    SY = 217,
    TW = 218,
    TJ = 219,
    TZ = 220,
    TH = 221,
    TL = 222,
    TG = 223,
    TK = 224,
    TO = 225,
    TT = 226,
    TN = 227,
    TR = 228,
    TM = 229,
    TC = 230,
    TV = 231,
    UG = 232,
    UA = 233,
    AE = 234,
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
        informCodes.map.set("HA.HUM.CON.GCRI", HazardScenario.HazardScenario2); // Conflict
        informCodes.map.set("VU.SEV.AD.FTS-POP", HazardScenario.HazardScenario11); // Humanitarian Access
        informCodes.map.set("HA.NAT.TC.CS", HazardScenario.HazardScenario11); // Storm Surge
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
    Inactive = 3
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

