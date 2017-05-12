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
    HazardScenario10 = 10
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
    NonAlert = 9
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

export enum PresenceInTheCountry {
    currentProgrammes = 0,
    preExistingPartner = 1,
    noPreExistingPresence = 2
}

export enum MethodOfImplementation {
    fieldStaff = 0,
    withPartner = 1
}

export enum MediaFormat {
    photographic = 0,
    video = 1,
    photographicAndVideo = 2
}

export enum Gender {
    feMale = 1,
    male = 0
}

export enum AgeRange {
    Less18 = 0,
    Between18To50 = 1,
    More50 = 2
}

export enum PhonePrefix{
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

