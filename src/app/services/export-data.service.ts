import {Injectable} from '@angular/core';
import {Constants} from "../utils/Constants";
import * as XLSX from "xlsx";
import {WorkBook} from "xlsx";
import * as moment from "moment";
import {AngularFire} from "angularfire2";
import {CommonService} from "./common.service";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "./user.service";
import {
  ActionLevel,
  ActionStatus,
  AlertLevels,
  AlertStatus,
  DurationType,
  GeoLocation,
  SkillType,
  StockType
} from "../utils/Enums";
import {PartnerOrganisationService} from "./partner-organisation.service";
import {Observable} from "rxjs/Rx";
import {SurgeCapacityService} from "./surge-capacity.service";
import {CommonUtils} from "../utils/CommonUtils";
import {SettingsService} from "./settings.service";
import {Subject} from "rxjs/Subject";
import {AgencyService} from "./agency-service.service";
import {map} from "rxjs/operator/map";

@Injectable()
export class ExportDataService {

  // MAKE SURE TOTAL NUMBER FOR SHEETS IS RIGHT!! (16 now)
  private COUNTRY_SHEETS = 16
  private exportFrom = EXPORT_FROM.FromCountry
  private PRIVATE = "Private"

  private total: number
  private counter: number
  private exportSubject: Subject<boolean>

  //for agency export
  private totalCountries: number
  private subjectAgency: Subject<boolean>
  private wbAgency: XLSX.WorkBook
  private countryNameMap = new Map<string, string>()
  private alertsForAgency = []
  private indicatorsForAgency = []
  private plansForAgency = []
  private actionsForAgency = []
  private activeAPAForAgency = []
  private pointOfContactsForAgency = []
  private officesDetailsForAgency = []
  private stockInCountryForAgency = []
  private stockOutCountryForAgency = []
  private coordsForAgency = []
  private equipmentsForAgency = []
  private surgeEquipmentsForAgency = []
  private organisationsForAgency = []
  private surgesForAgency = []
  private officesCapacityForAgency = []
  private program4wForAgency = []
  private sectorsForAgency = []

  //for system export
  private subjectSystem: Subject<boolean>
  private wbSystem: XLSX.WorkBook
  private alertsForSystem = []
  private indicatorsForSystem = []
  private plansForSystem = []
  private actionsForSystem = []
  private activeAPAForSystem = []
  private pointOfContactsForSystem = []
  private officesDetailsForSystem = []
  private stockInCountryForSystem = []
  private stockOutCountryForSystem = []
  private coordsForSystem = []
  private equipmentsForSystem = []
  private surgeEquipmentsForSystem = []
  private organisationsForSystem = []
  private surgesForSystem = []
  private officesCapacityForSystem = []
  private program4wForSystem = []
  private sectorsForSystem = []
  private agencyNameMap = new Map<string, string>()
  private systemCanExport: boolean = true


  constructor(private af: AngularFire,
              private translateService: TranslateService,
              private userService: UserService,
              private partnerService: PartnerOrganisationService,
              private surgeCapacityService: SurgeCapacityService,
              private agencyService: AgencyService,
              private settingService: SettingsService,
              private commonService: CommonService) {
  }

  public exportOfficeData(agencyId: string, countryId: string, areaContent: any, staffMap: Map<string, string>) {

    this.exportSubject = new Subject<boolean>()

    switch (this.exportFrom) {
      case EXPORT_FROM.FromAgency: {
        break
      }
      case EXPORT_FROM.FromSystem : {
        break
      }

      case EXPORT_FROM.FromDonor: {
        break
      }

      default: {
        this.total = this.COUNTRY_SHEETS
        this.counter = 0
        break
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new()

    //fetch country alert data
    this.fetchCustomHazardNameForAlertsCountry(countryId).then((customNameMap: Map<string, string>) => {
      //fetch alerts data
      this.fetchCountryAlertsData(countryId, customNameMap, areaContent, wb, agencyId);
    })

    //fetch risk monitoring data
    this.fetchRiskMonitoringData(countryId, staffMap, areaContent, wb, agencyId);

    //fetch response plan data
    this.fetchResponsePlanData(countryId, wb, agencyId);

    //fetch preparedness actions data
    this.fetchActionsData(areaContent, agencyId, countryId, staffMap, wb);

    //fetch point of contacts
    this.fetchPointOfContactData(countryId, wb, agencyId);

    //fetch office contacts
    this.fetchCountryOfficeDetail(agencyId, countryId, wb);

    //fetch stock capacity - external and  in-country stock
    this.fetchStockCapacity(countryId, areaContent, wb, agencyId);

    //fetch coordination data
    this.fetchCoordinationData(countryId, wb, agencyId);

    //fetch equipment data
    this.fetchEquipmentData(countryId, areaContent, wb, agencyId);

    //fetch surge equipment data
    this.fetchSurgeEquipmentData(countryId, wb, agencyId);

    //fetch partner orgs data
    this.fetchPartnerOrgData(agencyId, countryId, wb);

    //fetch surge capacity data
    this.fetchSurgeCapacityData(countryId, wb, agencyId);

    //fetch office capacity (staff) data
    this.fetchOfficeCapacityData(countryId, wb, agencyId);

    //fetch programme 4w
    this.fetchProgram4wData(countryId, wb, agencyId);

    //fetch sector expertise
    this.fetchSectorExpertiseData(countryId, wb, agencyId);

    return this.exportSubject

  }

  public exportAgencyData(agencyId: string) {
    this.subjectAgency = new Subject<boolean>()
    this.resetAgencyData()
    // this.countryCounter = 0
    this.counter = 0
    this.exportFrom = EXPORT_FROM.FromAgency
    this.wbAgency = XLSX.utils.book_new()
    this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .first()
      .subscribe(areaContent => {
        this.agencyService.getAllCountryIdsForAgency(agencyId)
          .first()
          .subscribe(countryIds => {
            this.totalCountries = countryIds.length
            this.total = this.totalCountries * this.COUNTRY_SHEETS
            let tempCounter = 0
            countryIds.forEach(countryId => {
              this.agencyService.getCountryOffice(countryId, agencyId)
                .first()
                .subscribe(countryOffice => {
                  let countryName = Constants.COUNTRIES[countryOffice.location] ? this.translateService.instant(Constants.COUNTRIES[countryOffice.location]) : ""
                  this.countryNameMap.set(countryOffice.$key, countryName)
                  tempCounter++
                  if (tempCounter === this.totalCountries) {
                    //loop again to fetch info
                    countryIds.forEach(id => {
                      this.getCountryStuff(id, agencyId, areaContent);
                    })
                  }
                })

            })
          })
      })
    return this.subjectAgency
  }

  private getCountryStuff(countryId: string, agencyId: string, areaContent) {
    console.log("country id: " + countryId)
    console.log("agency id: " + agencyId)
    //get all staff for this country
    this.userService.getStaffList(countryId)
      .first()
      .subscribe(staffs => {
        console.log(staffs)
        let staffMap = new Map<string, string>()
        //get country admin first
        this.userService.getCountryAdmin(agencyId, countryId)
          .first()
          .subscribe(admin => {
            staffMap.set(admin.id, admin.firstName + " " + admin.lastName)

            if (staffs.length > 0) {
              //get rest staffs for country
              staffs.forEach(staff => {
                this.userService.getUser(staff.id)
                  .first()
                  .subscribe(user => {
                    staffMap.set(user.id, user.firstName + " " + user.lastName)

                    if (staffMap.size === staffs.length + 1) {
                      //start export data
                      this.exportOfficeData(agencyId, countryId, areaContent, staffMap)
                    }
                  })
              })
            } else {
              //start export data
              this.exportOfficeData(agencyId, countryId, areaContent, staffMap)
            }
          })

      })
  }

  public exportSystemData(fromWhere: EXPORT_FROM) {
    this.subjectSystem = new Subject<boolean>()
    this.resetSystemData()
    this.counter = 0
    this.total = 0
    this.totalCountries = 0
    this.exportFrom = fromWhere
    this.wbSystem = XLSX.utils.book_new()
    this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
      .first()
      .subscribe(areaContent => {
        this.commonService.getTotalAgencies()
          .first()
          .subscribe(agencies => {
            let totalAgency = agencies.length
            let agencyCounter = 0
            let countryAgencyMap = new Map<string, string>()
            agencies.forEach(agency => this.agencyNameMap.set(agency.$key, agency.name))
            this.commonService.getCountryTotalForSystem()
              .take(totalAgency)
              .subscribe(countries => {
                console.log(countries)
                this.updateCountryName(countries).then(() => {
                  countries.forEach(item => countryAgencyMap.set(item.countryId, item.agencyId))
                  this.totalCountries += countries.length
                  this.total = this.totalCountries * this.COUNTRY_SHEETS
                  agencyCounter++
                  if (agencyCounter === totalAgency) {
                    console.log(this.total)
                    console.log(countryAgencyMap)
                    countryAgencyMap.forEach((agencyId, countryId) => {
                      this.getCountryStuff(countryId, agencyId, areaContent)
                    })
                  }
                })
              })

          })
      })
    return this.subjectSystem
  }

  private fetchRiskMonitoringData(countryId: string, staffMap: Map<string, string>, areaContent: any, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/indicator/" + countryId)
      .first()
      .subscribe(countryIndicators => {
        let allIndicators = []
        //first fetch country context indicators
        let indicators = countryIndicators.map(item => {
          return this.transformIndicator(item, staffMap, areaContent, "Country Context", countryId, agencyId)
        })
        allIndicators = allIndicators.concat(indicators)

        //then fetch all other indicators
        this.af.database.list(Constants.APP_STATUS + "/hazard/" + countryId)
          .first()
          .subscribe(hazards => {
            if (hazards.length > 0) {
              let hazardIndicatorCounter = 0
              hazards.forEach(hazard => {
                this.af.database.list(Constants.APP_STATUS + "/indicator/" + hazard.$key)
                  .first()
                  .subscribe(hazardIndicatorList => {
                    //dealing with pre-defined hazard
                    let hazardIndicators = hazardIndicatorList.filter(item => item.hazardScenario.hazardScenario != -1).map(item => {
                      let hazardScenarioName = Constants.HAZARD_SCENARIOS[item.hazardScenario.hazardScenario] ? this.translateService.instant(Constants.HAZARD_SCENARIOS[item.hazardScenario.hazardScenario]) : ""
                      return this.transformIndicator(item, staffMap, areaContent, hazardScenarioName, countryId, agencyId)
                    })
                    allIndicators = allIndicators.concat(hazardIndicators)

                    //dealing with custom hazards
                    let hazardIndicatorsCustom = hazardIndicatorList.filter(item => item.hazardScenario.hazardScenario == -1).map(item => {
                      return this.transformIndicator(item, staffMap, areaContent, item.hazardScenario.otherName, countryId, agencyId);
                    })

                    if (hazardIndicatorsCustom.length > 0) {
                      let transformedCustomNameList = []
                      hazardIndicatorsCustom.forEach(custom => {
                        this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + custom["Hazard"])
                          .first()
                          .subscribe(customName => {
                            custom["Hazard"] = customName.name
                            transformedCustomNameList.push(custom)
                            if (transformedCustomNameList.length == hazardIndicatorsCustom.length) {
                              allIndicators = allIndicators.concat(hazardIndicatorsCustom)
                              hazardIndicatorCounter++

                              if (hazards.length === hazardIndicatorCounter) {
                                this.indicatorsForAgency = this.indicatorsForAgency.concat(allIndicators)
                                this.indicatorsForSystem = this.indicatorsForSystem.concat(allIndicators)
                                const indicatorSheet = XLSX.utils.json_to_sheet(allIndicators);
                                XLSX.utils.book_append_sheet(wb, indicatorSheet, "Risk Monitoring")
                                this.counter++
                                console.log("indicator: " + this.counter)
                                this.exportFile(this.counter, this.total, wb)
                              }
                            }
                          })
                      })
                    } else {
                      hazardIndicatorCounter++

                      if (hazards.length === hazardIndicatorCounter) {
                        this.indicatorsForAgency = this.indicatorsForAgency.concat(allIndicators)
                        this.indicatorsForSystem = this.indicatorsForSystem.concat(allIndicators)
                        const indicatorSheet = XLSX.utils.json_to_sheet(allIndicators);
                        XLSX.utils.book_append_sheet(wb, indicatorSheet, "Risk Monitoring")
                        this.counter++
                        console.log("indicator: " + this.counter)
                        this.exportFile(this.counter, this.total, wb)
                      }
                    }
                  })
              })
            } else {
              if (allIndicators.length > 0) {
                this.indicatorsForAgency = this.indicatorsForAgency.concat(allIndicators)
                this.indicatorsForSystem = this.indicatorsForSystem.concat(allIndicators)
                const indicatorSheet = XLSX.utils.json_to_sheet(allIndicators);
                XLSX.utils.book_append_sheet(wb, indicatorSheet, "Risk Monitoring")
                this.counter++
                console.log("indicator: " + this.counter)
                this.exportFile(this.counter, this.total, wb)
              } else {
                this.passEmpty(wb)
              }
            }
          })
      })
  }

  private transformIndicator(item, staffMap: Map<string, string>, areaContent: any, hazard: any, countryId: string, agencyId?: string) {
    let indicatorObj = {}
    if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
      indicatorObj["Agency"] = this.agencyNameMap.get(agencyId)
    }
    if (this.exportFrom != EXPORT_FROM.FromCountry) {
      indicatorObj["Country Office"] = this.countryNameMap.get(countryId)
    }
    indicatorObj["Hazard"] = hazard
    indicatorObj["Indicator Name"] = item["name"]
    indicatorObj["Name of Source"] = this.getIndicatorSourceAndLink(item).join("\n")
    indicatorObj["Current status"] = Constants.INDICATOR_STATUS[item["triggerSelected"]] ? this.translateService.instant(Constants.INDICATOR_STATUS[item["triggerSelected"]]) : ""
    indicatorObj["Green trigger name"] = item["trigger"][0]["triggerValue"]
    indicatorObj["Green trigger value"] = item["trigger"][0]["frequencyValue"] + " " + this.translateService.instant(Constants.DETAILED_DURATION_TYPE[item["trigger"][0]["durationType"]])
    indicatorObj["Amber trigger name"] = item["trigger"][1]["triggerValue"]
    indicatorObj["Amber trigger value"] = item["trigger"][1]["frequencyValue"] + " " + this.translateService.instant(Constants.DETAILED_DURATION_TYPE[item["trigger"][1]["durationType"]])
    indicatorObj["Red trigger name"] = item["trigger"][2]["triggerValue"]
    indicatorObj["Red trigger value"] = item["trigger"][2]["frequencyValue"] + " " + this.translateService.instant(Constants.DETAILED_DURATION_TYPE[item["trigger"][2]["durationType"]])
    indicatorObj["Assigned to"] = (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) ? (item["assignee"] ? "1" : "0") : (item["assignee"] ? staffMap.get(item["assignee"]) : "")
    indicatorObj["Location"] = this.getIndicatorLocation(item, areaContent)
    indicatorObj["Green State instances"] = item.timeTracking ? item.timeTracking["timeSpentInGreen"] ? Object.keys(item.timeTracking["timeSpentInGreen"]).length : 0 : ""
    indicatorObj["Amber State instances"] = item.timeTracking ? item.timeTracking["timeSpentInAmber"] ? Object.keys(item.timeTracking["timeSpentInAmber"]).length : 0 : ""
    indicatorObj["Red State instances"] = item.timeTracking ? item.timeTracking["timeSpentInRed"] ? Object.keys(item.timeTracking["timeSpentInRed"]).length : 0 : ""
    indicatorObj["Green State duration"] = this.getTimeTrackingInfoInNumber(item, "green")
    indicatorObj["Amber State duration"] = this.getTimeTrackingInfoInNumber(item, "amber")
    indicatorObj["Red State duration"] = this.getTimeTrackingInfoInNumber(item, "red")
    return indicatorObj
  }

  private fetchSectorExpertiseData(countryId: string, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + countryId + '/sectorExpertise/')
      .first()
      .subscribe(sectorList => {
        if (sectorList.length > 0) {
          let sectors = []
          let expertise = sectorList.map(sector => Constants.RESPONSE_PLANS_SECTORS[sector.$key] ? this.translateService.instant(Constants.RESPONSE_PLANS_SECTORS[sector.$key]) : "").toString()
          let obj = {}
          if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
            obj["Agency"] = this.agencyNameMap.get(agencyId)
          }
          if (this.exportFrom != EXPORT_FROM.FromCountry) {
            obj["Country Office"] = this.countryNameMap.get(countryId)
          }
          obj["Sectors of expertise"] = expertise
          sectors.push(obj)

          this.sectorsForAgency = this.sectorsForAgency.concat(sectors)
          this.sectorsForSystem = this.sectorsForSystem.concat(sectors)
          const sectorSheet = XLSX.utils.json_to_sheet(sectors);
          XLSX.utils.book_append_sheet(wb, sectorSheet, "CO - Sector Expertise")
          this.counter++
          console.log("Sector Expertise: " + this.counter)
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb);
        }
      })
  }

  private passEmpty(wb: WorkBook) {
    this.counter++
    console.log("empty: " + this.counter)
    this.exportFile(this.counter, this.total, wb)
  }

  private fetchProgram4wData(countryId: string, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + countryId + '/4WMapping/')
      .first()
      .subscribe(mappings => {
        if (mappings.length > 0) {
          let program4w = mappings.map(mapping => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Sector"] = Constants.RESPONSE_PLANS_SECTORS[mapping["sector"]] ? this.translateService.instant(Constants.RESPONSE_PLANS_SECTORS[mapping["sector"]]) : ""
            obj["What"] = mapping["what"]
            if (!mapping["where"] || (mapping["where"] && typeof (mapping["where"]) === 'string' && Number.isNaN(parseInt(mapping["where"])))) {
              obj["Where"] = mapping["where"]
            } else {
              obj["Where"] = Constants.COUNTRIES[mapping["where"]] ? this.translateService.instant(Constants.COUNTRIES[mapping["where"]]) : ""
            }
            obj["To Whom"] = mapping["toWho"]
            obj["When"] = moment(mapping["when"]).format("MM/YYYY")
            obj["Notes"] = mapping["programmeNotes"] ? Object.keys(mapping["programmeNotes"]).length : 0
            obj["Last updated"] = mapping["updatedAt"] ? moment(mapping["updatedAt"]).format("MM/YYYY") : ""
            return obj
          })

          this.program4wForAgency = this.program4wForAgency.concat(program4w)
          this.program4wForSystem = this.program4wForSystem.concat(program4w)
          const program4wSheet = XLSX.utils.json_to_sheet(program4w);
          XLSX.utils.book_append_sheet(wb, program4wSheet, "CO - Programme Mapping")
          this.counter++
          console.log("Programme Mapping: " + this.counter)
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchOfficeCapacityData(countryId: string, wb: WorkBook, agencyId?: string) {
    this.userService.getStaffList(countryId)
      .map(list => {
        return list.filter(item => item.isResponseMember)
      })
      .first()
      .subscribe(staffList => {
        if (staffList.length > 0) {
          let transformedList = []
          staffList.forEach(staff => {
            if (staff.skill.length > 0) {
              let skillMap = new Map()
              //fetch skills first
              staff.skill.forEach(skill => {
                this.userService.getSkill(skill)
                  .first()
                  .subscribe(skillObj => {
                    skillMap.set(skillObj.$key, skillObj)
                    if (skillMap.size == staff.skill.length) {
                      let techList = CommonUtils.convertMapToValuesInArray(skillMap).filter(skill => skill.type == SkillType.Tech).map(skill => skill.name).toString()
                      let supList = CommonUtils.convertMapToValuesInArray(skillMap).filter(skill => skill.type == SkillType.Support).map(skill => skill.name).toString()
                      //all skills ready
                      this.userService.getUser(staff.id)
                        .first()
                        .subscribe(user => {
                          let obj = {}
                          if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
                            obj["Agency"] = this.agencyNameMap.get(agencyId)
                          }
                          if (this.exportFrom != EXPORT_FROM.FromCountry) {
                            obj["Country Office"] = this.countryNameMap.get(countryId)
                          }
                          obj["Name"] = user.firstName + " " + user.lastName
                          obj["Position"] = staff.position
                          obj["Office Type"] = Constants.OFFICE_TYPE[staff.officeType] ? this.translateService.instant(Constants.OFFICE_TYPE[staff.officeType]) : ""
                          obj["Technical Skills"] = techList
                          obj["Support Skills"] = supList
                          obj["Training Needs"] = staff.training
                          obj["Notes"] = staff.notes ? Object.keys(staff.notes).length : 0
                          obj["Last updated"] = moment(staff.updatedAt).format("MM/YYYY")
                          transformedList.push(obj)
                          if (staffList.length == transformedList.length) {
                            this.officesCapacityForAgency = this.officesCapacityForAgency.concat(transformedList)
                            this.officesCapacityForSystem = this.officesCapacityForSystem.concat(transformedList)
                            const officeCapacitySheet = XLSX.utils.json_to_sheet(transformedList);
                            XLSX.utils.book_append_sheet(wb, officeCapacitySheet, "CO - Office Capacity")
                            this.counter++
                            console.log("Office Capacity: " + this.counter)
                            this.exportFile(this.counter, this.total, wb)
                          }
                        })
                    }
                  })
              })

            } else {
              this.userService.getUser(staff.id)
                .first()
                .subscribe(user => {
                  let obj = {}
                  if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
                    obj["Agency"] = this.agencyNameMap.get(agencyId)
                  }
                  if (this.exportFrom != EXPORT_FROM.FromCountry) {
                    obj["Country Office"] = this.countryNameMap.get(countryId)
                  }
                  obj["Name"] = user.firstName + " " + user.lastName
                  obj["Position"] = staff.position
                  obj["Office Type"] = Constants.OFFICE_TYPE[staff.officeType] ? this.translateService.instant(Constants.OFFICE_TYPE[staff.officeType]) : ""
                  obj["Technical Skills"] = ""
                  obj["Support Skills"] = ""
                  obj["Training Needs"] = staff.training
                  obj["Notes"] = staff.notes ? Object.keys(staff.notes).length : 0
                  obj["Last updated"] = moment(staff.updatedAt).format("MM/YYYY")
                  transformedList.push(obj)
                  if (staffList.length == transformedList.length) {
                    this.officesCapacityForAgency = this.officesCapacityForAgency.concat(transformedList)
                    this.officesCapacityForSystem = this.officesCapacityForSystem.concat(transformedList)
                    const officeCapacitySheet = XLSX.utils.json_to_sheet(transformedList);
                    XLSX.utils.book_append_sheet(wb, officeCapacitySheet, "CO - Office Capacity")
                    this.counter++
                    console.log("Office Capacity: " + this.counter)
                    this.exportFile(this.counter, this.total, wb)
                  }
                })
            }

          })
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchSurgeCapacityData(countryId: string, wb: WorkBook, agencyId?: string) {
    this.surgeCapacityService.getSuregeCapacity(countryId)
      .first()
      .subscribe(surgeCapacityList => {
        if (surgeCapacityList.length > 0) {
          let surges = surgeCapacityList.map(surge => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Organisation"] = surge["orgnization"]
            obj["Relationship"] = surge["relationship"]
            obj["Contact Name"] = surge["name"]
            obj["Contact Position"] = surge["position"]
            obj["Contact Email"] = surge["email"]
            obj["Sector(s) of expertise"] = ""
            obj["Location"] = surge["location"]
            obj["ETA"] = surge["arrivalTimeValue"] + " " + Constants.DETAILED_DURATION_TYPE[surge["arrivalTimeType"]] ? this.translateService.instant(Constants.DETAILED_DURATION_TYPE[surge["arrivalTimeType"]]) : ""
            obj["Length of deployment"] = surge["durationOfDeployment"]
            return obj
          })

          this.surgesForAgency = this.surgesForAgency.concat(surges)
          this.surgesForSystem = this.surgesForSystem.concat(surges)
          const surgesSheet = XLSX.utils.json_to_sheet(surges);
          XLSX.utils.book_append_sheet(wb, surgesSheet, "CO - Surge Capacity")
          this.counter++
          console.log("Surge Capacity: " + this.counter)
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }

      })
  }

  private fetchPartnerOrgData(agencyId: string, countryId: string, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/partnerOrganisations')
      .first()
      .subscribe(partnerOrganisations => {
        if (partnerOrganisations.length > 0) {
          let total = partnerOrganisations.length
          let orgs = []
          Observable.from(partnerOrganisations.map(organisation => organisation.$key))
            .flatMap(organisationId => {
              return this.partnerService.getPartnerOrganisation(organisationId as string);
            })
            .take(total)
            .subscribe(org => {
              orgs.push(org)
              if (orgs.length == total) {
                console.log(orgs)
                let organisations = orgs.filter(org => org.isApproved).map(org => {
                  console.log(org["projects"])
                  let obj = {}
                  if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
                    obj["Agency"] = this.agencyNameMap.get(agencyId)
                  }
                  if (this.exportFrom != EXPORT_FROM.FromCountry) {
                    obj["Country Office"] = this.countryNameMap.get(countryId)
                  }
                  obj["Partner Organisation"] = org["organisationName"]
                  obj["Relationship"] = org["relationship"]
                  obj["Projects"] = org["projects"].length
                  obj["Contact Title"] = Constants.PERSON_TITLE[org["title"]] ? this.translateService.instant(Constants.PERSON_TITLE[org["title"]]) : ""
                  obj["Contact First Name"] = org["firstName"]
                  obj["Contact Last Name"] = org["lastName"]
                  obj["Contact Position"] = org["position"]
                  obj["Contact Email"] = org["email"]
                  obj["Contact Phone Number"] = org["phone"]
                  return obj
                })

                this.organisationsForAgency = this.organisationsForAgency.concat(organisations)
                this.organisationsForSystem = this.organisationsForSystem.concat(organisations)
                const organisationSheet = XLSX.utils.json_to_sheet(organisations);
                XLSX.utils.book_append_sheet(wb, organisationSheet, "CO - Partners")
                this.counter++
                console.log("Partners: " + this.counter)
                this.exportFile(this.counter, this.total, wb)

              }
            })
        } else {
          this.passEmpty(wb)
        }
      })

  }

  private fetchSurgeEquipmentData(countryId: string, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/surgeEquipment/" + countryId)
      .first()
      .subscribe(surgeEquipmentList => {
        if (surgeEquipmentList.length > 0) {
          let surgeEquipments = surgeEquipmentList.map(sEquipment => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Supplier"] = sEquipment["supplier"]
            obj["Relationship"] = sEquipment["relationship"]
            obj["Equipment Provided"] = sEquipment["equipmentProvided"]
            obj["Contact Name"] = sEquipment["contactName"]
            obj["Contact Email"] = sEquipment["contactEmail"]
            obj["Contact Telephone"] = sEquipment["contactPhone"]
            return obj
          })

          this.surgeEquipmentsForAgency = this.surgeEquipmentsForAgency.concat(surgeEquipments)
          this.surgeEquipmentsForSystem = this.surgeEquipmentsForSystem.concat(surgeEquipments)
          const surgeEquipmentSheet = XLSX.utils.json_to_sheet(surgeEquipments);
          XLSX.utils.book_append_sheet(wb, surgeEquipmentSheet, "CO - Surge Equipment")
          this.counter++
          console.log("Surge Equipment: " + this.counter)
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchEquipmentData(countryId: string, areaContent: any, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/equipment/" + countryId)
      .first()
      .subscribe(countryEquipments => {
        if (countryEquipments.length > 0) {
          let equipments = countryEquipments.map(equipment => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Equipment"] = equipment["name"]
            if (Number.isInteger(equipment["location"]) || (typeof equipment["location"] === 'string' && !Number.isNaN(parseInt(equipment["location"])))) {
              let temp1 = {}
              let temp2 = {}
              temp2["country"] = Number(equipment["location"])
              if (equipment.hasOwnProperty("level1")) {
                temp2["level1"] = Number(equipment["level1"])
              }
              if (equipment.hasOwnProperty("level2")) {
                temp2["level2"] = Number(equipment["level2"])
              }
              temp1["0"] = temp2
              console.log(temp1)
              obj["Location"] = this.commonService.getAreaNameListFromObj(areaContent, temp1)
            } else {
              obj["Location"] = equipment["location"]
            }
            obj["Quantity"] = equipment["quantity"]
            obj["Status"] = equipment["status"]
            return obj
          })

          this.equipmentsForAgency = this.equipmentsForAgency.concat(equipments)
          this.equipmentsForSystem = this.equipmentsForSystem.concat(equipments)
          const equipmentSheet = XLSX.utils.json_to_sheet(equipments);
          XLSX.utils.book_append_sheet(wb, equipmentSheet, "CO - Equipment(Equipment)")
          this.counter++
          console.log("Equipment(Equipment): " + this.counter)
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }

      })
  }

  private fetchCoordinationData(countryId: string, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/coordination/" + countryId)
      .first()
      .subscribe(cos => {
        if (cos.length > 0) {
          let coordinations = cos.map(co => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Sector"] = Constants.RESPONSE_PLANS_SECTORS[co["sector"]] ? this.translateService.instant(Constants.RESPONSE_PLANS_SECTORS[co["sector"]]) : ""
            obj["Sector Lead"] = co["sectorLead"]
            obj["Contact Name"] = co["contactName"]
            obj["Contact Email"] = co["contactEmail"]
            obj["Contact Telephone"] = co["contactPhone"]
            co["isAMember"] ? obj["Is your agency a member?"] = "Yes" : obj["Is your agency a member?"] = "No"
            obj["Staff member represting your agency?"] = co["staffMember"]
            return obj
          })

          let coorTotal = coordinations.length
          let counter = 0
          coordinations.forEach(coor => {
            this.userService.getUser(coor["Staff member represting your agency?"])
              .first()
              .subscribe(staff => {
                coor["Staff member represting your agency?"] = staff.firstName + " " + staff.lastName
                counter++
                if (counter == coorTotal) {
                  this.coordsForAgency = this.coordsForAgency.concat(coordinations)
                  this.coordsForSystem = this.coordsForSystem.concat(coordinations)
                  const coordSheet = XLSX.utils.json_to_sheet(coordinations);
                  XLSX.utils.book_append_sheet(wb, coordSheet, "CO - Coordination")
                  this.counter++
                  console.log("Coordination: " + this.counter)
                  this.exportFile(this.counter, this.total, wb)
                }
              })
          })
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchStockCapacity(countryId: string, areaContent: any, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/stockCapacity/" + countryId)
      .first()
      .subscribe(stockInCountry => {
        if (stockInCountry.length > 0) {
          let stocksInCountry = stockInCountry.filter(stock => stock.stockType == StockType.Country).map(stock => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Description"] = stock["description"]
            obj["Quantity"] = stock["quantity"]
            if (Number.isInteger(stock["location"]) || (typeof stock["location"] === 'string' && !Number.isNaN(parseInt(stock["location"])))) {
              let temp1 = {}
              let temp2 = {}
              temp2["country"] = stock["location"]
              if (stock.hasOwnProperty("level1")) {
                temp2["level1"] = stock["level1"]
              }
              if (stock.hasOwnProperty("level2")) {
                temp2["level2"] = stock["level2"]
              }
              temp1["0"] = temp2
              obj["Location"] = this.commonService.getAreaNameListFromObj(areaContent, temp1)
            } else {
              obj["Location"] = stock["location"]
            }
            obj["Lead time"] = stock["leadTime"]
            return obj
          })

          let stocksExternalCountry = stockInCountry.filter(stock => stock.stockType == StockType.External).map(stock => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Description"] = stock["description"]
            obj["Quantity"] = stock["quantity"]
            if (Number.isInteger(stock["location"]) || (typeof stock["location"] === 'string' && !Number.isNaN(parseInt(stock["location"])))) {
              let temp1 = {}
              let temp2 = {}
              temp2["country"] = stock["location"]
              if (stock.hasOwnProperty("level1")) {
                temp2["level1"] = stock["level1"]
              }
              if (stock.hasOwnProperty("level2")) {
                temp2["level2"] = stock["level2"]
              }
              temp1["0"] = temp2
              obj["Location"] = this.commonService.getAreaNameListFromObj(areaContent, temp1)
            } else {
              obj["Location"] = stock["location"]
            }
            obj["Lead time"] = stock["leadTime"]
            return obj
          })

          this.stockInCountryForAgency = this.stockInCountryForAgency.concat(stocksInCountry)
          this.stockInCountryForSystem = this.stockInCountryForSystem.concat(stocksInCountry)
          this.stockOutCountryForAgency = this.stockOutCountryForAgency.concat(stocksExternalCountry)
          this.stockOutCountryForSystem = this.stockOutCountryForSystem.concat(stocksExternalCountry)
          const stocksInCountrySheet = XLSX.utils.json_to_sheet(stocksInCountry);
          const stocksExternalCountrySheet = XLSX.utils.json_to_sheet(stocksExternalCountry);
          XLSX.utils.book_append_sheet(wb, stocksInCountrySheet, "Stock Capacity(In-country)")
          XLSX.utils.book_append_sheet(wb, stocksExternalCountrySheet, "Stock Capacity(External)")
          this.counter++
          console.log("Stock Capacity: " + this.counter)
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }

      })
  }

  private fetchCountryOfficeDetail(agencyId: string, countryId: string, wb: WorkBook) {
    this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId)
      .first()
      .subscribe(countryOffice => {
        let offices = []
        let office = {}
        if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
          office["Agency"] = this.agencyNameMap.get(agencyId)
        }
        if (this.exportFrom != EXPORT_FROM.FromCountry) {
          office["Country Office"] = this.countryNameMap.get(countryId)
        }
        office["Address Line 1"] = countryOffice.addressLine1
        office["Address Line 2"] = countryOffice.addressLine2
        office["Address Line 3"] = countryOffice.addressLine3
        office["Country"] = Constants.COUNTRIES[countryOffice.location] ? this.translateService.instant(Constants.COUNTRIES[countryOffice.location]) : ""
        office["City"] = countryOffice.city
        office["Postcode"] = countryOffice.postCode
        office["Phone Number"] = countryOffice.phone

        this.userService.getUser(countryOffice.adminId)
          .first()
          .subscribe(countryAdmin => {
            office["Email Address"] = countryAdmin.email

            offices.push(office)
            this.officesDetailsForAgency = this.officesDetailsForAgency.concat(offices)
            this.officesDetailsForSystem = this.officesDetailsForSystem.concat(offices)
            const officeSheet = XLSX.utils.json_to_sheet(offices);
            XLSX.utils.book_append_sheet(wb, officeSheet, "CO - Contacts (Office Details)")
            this.counter++
            console.log("Office Detail: " + this.counter)
            this.exportFile(this.counter, this.total, wb)
          })
      })
  }

  private fetchPointOfContactData(countryId: string, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/contacts/" + countryId)
      .first()
      .subscribe(contactsList => {
        if (contactsList.length > 0) {
          let contacts = contactsList.map(contact => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Skype Name"] = contact["skypeName"]
            obj["Office Telephone"] = contact["phone"]
            obj["staffId"] = contact["staffMember"]
            return obj
          })

          let totalContacts = contacts.length
          let contactCounter = 0
          contacts.forEach(contact => {
            this.userService.getUser(contact.staffId)
              .first()
              .subscribe(staff => {
                contact["Name of contact"] = staff.firstName + " " + staff.lastName
                contact["Contact Email"] = staff.email
                contact["Direct Telephone"] = staff.phone
                let tempObj = JSON.parse(JSON.stringify(contact))
                for (const prop of Object.keys(contact)) {
                  delete contact[prop];
                }
                if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
                  contact["Agency"] = tempObj["Agency"]
                }
                if (this.exportFrom != EXPORT_FROM.FromCountry) {
                  contact["Country Office"] = tempObj["Country Office"]
                }
                contact["Name of contact"] = tempObj["Name of contact"]
                contact["Contact Email"] = tempObj["Contact Email"]
                contact["Skype Name"] = tempObj["Skype Name"]
                contact["Direct Telephone"] = tempObj["Direct Telephone"]
                contact["Office Telephone"] = tempObj["Office Telephone"]

                contactCounter++
                if (contactCounter == totalContacts) {
                  this.pointOfContactsForAgency = this.pointOfContactsForAgency.concat(contacts)
                  this.pointOfContactsForSystem = this.pointOfContactsForSystem.concat(contacts)
                  const planSheet = XLSX.utils.json_to_sheet(contacts);
                  XLSX.utils.book_append_sheet(wb, planSheet, "CO - Contacts(Point of Contact)")
                  this.counter++
                  console.log("Contacts(POC): " + this.counter)
                  this.exportFile(this.counter, this.total, wb)
                }
              })
          })
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchActionsData(areaContent, agencyId: string, countryId: string, staffMap: Map<string, string>, wb: WorkBook) {
    this.fetchDepartmentsForAgencyAndCountry(agencyId, countryId).then((departmentMap: Map<string, string>) => {
      console.log(departmentMap)
      this.fetchNotesForActionUnderCountry(countryId).then((noteNumberMap: Map<string, number>) => {
        console.log(noteNumberMap)
        this.fetchActionClockSettings(agencyId, countryId).then((expireDuration: number) => {
          console.log("expire dutaion: " + expireDuration)
          this.fetchAlertScenarioForCountry(countryId).then((alertScenarioMap: Map<string, boolean>) => {
            console.log(alertScenarioMap)
            this.af.database.list(Constants.APP_STATUS + "/action/" + countryId)
              .first()
              .subscribe(actionList => {
                if (actionList.length > 0) {
                  let actions = actionList.map(action => {
                    let obj = {}
                    if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
                      obj["Agency"] = this.agencyNameMap.get(agencyId)
                    }
                    if (this.exportFrom != EXPORT_FROM.FromCountry) {
                      obj["Country Office"] = this.countryNameMap.get(countryId)
                    }
                    obj["Action title"] = this.exportFrom == EXPORT_FROM.FromSystem ? this.PRIVATE : action["task"]
                    obj["Preparedness action level"] = this.translateService.instant(Constants.ACTION_LEVEL[action["level"]])
                    obj["Type"] = this.translateService.instant(Constants.ACTION_TYPE[action["type"]])
                    obj["Department"] = action["department"] ? departmentMap.get(action["department"]) : ""
                    obj["Assigned to"] = (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) ? (action["asignee"] ? 1 : 0) : (action["asignee"] ? staffMap.get(action["asignee"]) : "")
                    obj["Due Date"] = moment(action["dueDate"]).format("DD/MM/YYYY")
                    obj["Budget"] = this.exportFrom == EXPORT_FROM.FromSystem ? this.PRIVATE : action["budget"]
                    obj["Document Required"] = action["requireDoc"] ? "Yes" : "No"
                    obj["Status"] = this.translateService.instant(this.getActionStatus(expireDuration, action, alertScenarioMap))
                    obj["Expires"] = this.getExpireDate(expireDuration, action)
                    obj["Notes"] = noteNumberMap.get(action.$key) ? noteNumberMap.get(action.$key) : 0
                    obj["Completed within due date?"] = !action.isCompleteAt || !action.dueDate ? "" : action.isCompleteAt < action.dueDate ? "Yes" : "No"
                    obj["Green state"] = this.getTimeTrackingInfoInPercentage(action, "green")
                    obj["Amber state"] = this.getTimeTrackingInfoInPercentage(action, "amber")
                    obj["Red state"] = this.getTimeTrackingInfoInPercentage(action, "red")
                    return obj
                  })

                  this.actionsForAgency = this.actionsForAgency.concat(actions)
                  this.actionsForSystem = this.actionsForSystem.concat(actions)
                  const actionSheet = XLSX.utils.json_to_sheet(actions);
                  XLSX.utils.book_append_sheet(wb, actionSheet, "Preparedness")

                  this.counter++
                  console.log("Preparedness: " + this.counter)
                  this.exportFile(this.counter, this.total, wb)

                } else {
                  this.passEmpty(wb)
                }

                //do more work, export apa activation sheet
                this.fetchAPActivationData(areaContent, actionList, countryId, wb)
              })
          })

        })

      })

    })

  }

  private fetchResponsePlanData(countryId: string, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId)
      .first()
      .subscribe(planList => {
        if (planList.length > 0) {
          let plans = planList.map(plan => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Plan Name"] = plan["name"]
            if (plan["hazardScenario"] && plan["hazardScenario"] != -1) {
              obj["Hazard"] = Constants.HAZARD_SCENARIOS[plan["hazardScenario"]] ? this.translateService.instant(Constants.HAZARD_SCENARIOS[plan["hazardScenario"]]) : ""
            } else {
              obj["Hazard"] = "Custom"
            }
            obj["Status"] = this.translateService.instant(Constants.RESPONSE_PLAN_STATUS[plan["status"]])
            obj["Completion percentage"] = toInteger(plan["sectionsCompleted"] / plan["totalSections"] * 100)
            obj["Last update"] = moment(plan["timeUpdated"]).format("DD/MM/YYYY")
            obj["In-Progress Status"] = this.getTimeTrackingInfoInPercentage(plan, "amber")
            obj["Completed Status"] = this.getTimeTrackingInfoInPercentage(plan, "green")
            obj["Expired/Needs Reviewing Status"] = this.getTimeTrackingInfoInPercentage(plan, "red")
            return obj
          })

          this.plansForAgency = this.plansForAgency.concat(plans)
          this.plansForSystem = this.plansForSystem.concat(plans)
          const planSheet = XLSX.utils.json_to_sheet(plans);
          XLSX.utils.book_append_sheet(wb, planSheet, "Response Plans")
          this.counter++
          console.log("Response Plans: " + this.counter)
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchCountryAlertsData(countryId: string, customNameMap: Map<string, string>, areaContent: any, wb: WorkBook, agencyId?: string) {
    this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId)
      .first()
      .subscribe(alertList => {
        if (alertList.length > 0) {
          let alerts = alertList.map(alert => {
            let obj = {}
            if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
              obj["Agency"] = this.agencyNameMap.get(agencyId)
            }
            if (this.exportFrom != EXPORT_FROM.FromCountry) {
              obj["Country Office"] = this.countryNameMap.get(countryId)
            }
            obj["Date Raised"] = moment(alert.timeCreated).format("DD/MM/YYYY")
            obj["Alert level"] = this.translateService.instant(Constants.ALERTS[alert.alertLevel])
            if (alert.hazardScenario != -1) {
              obj["Hazard"] = this.translateService.instant(Constants.HAZARD_SCENARIOS[alert.hazardScenario])
            } else {
              obj["Hazard"] = customNameMap.get(alert.otherName)
            }
            obj["Population affected"] = alert.estimatedPopulation
            obj["Affected areas"] = this.commonService.getAreaNameListFromObj(areaContent, alert.affectedAreas)
            obj["Information sources"] = alert.infoNotes
            obj["Duration"] = this.getLastUpdateDuration(alert)
            return obj
          })
          this.alertsForAgency = this.alertsForAgency.concat(alerts)
          this.alertsForSystem = this.alertsForSystem.concat(alerts)
          const alertSheet = XLSX.utils.json_to_sheet(alerts)
          XLSX.utils.book_append_sheet(wb, alertSheet, "Alerts")
          this.counter++
          console.log("Alerts: " + this.counter)
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }

      })
  }

  private exportFile(counter, total, wb) {
    console.log("counter: " + counter)
    console.log("total: " + total)
    // if (counter == total-2) {
    switch (this.exportFrom) {
      case EXPORT_FROM.FromAgency : {
        // this.countryCounter++
        this.exportFileAgency(this.counter, this.total, this.wbAgency)
        break
      }
      case EXPORT_FROM.FromSystem : {
        this.exportFileSystem(this.counter, this.total, this.wbSystem)
        break
      }

      case EXPORT_FROM.FromDonor : {
        this.exportFileSystem(this.counter, this.total, this.wbSystem)
        break
      }

      default: {
        //try export see if works
        if (counter == total) {
          XLSX.writeFile(wb, 'SheetJS.xlsx')
          this.exportSubject.next(true)
        }
        break
      }
    }
    // }
  }

  private exportFileAgency(counter, total, wb) {
    console.log("agency total: " + total)
    console.log("agency counter: " + counter)
    if (counter == total) {
      const alertsForAgencySheet = XLSX.utils.json_to_sheet(this.alertsForAgency);
      const indicatorsForAgencySheet = XLSX.utils.json_to_sheet(this.indicatorsForAgency);
      const plansForAgencySheet = XLSX.utils.json_to_sheet(this.plansForAgency);
      const actionsForAgencySheet = XLSX.utils.json_to_sheet(this.actionsForAgency);
      const activeAPAForAgencySheet = XLSX.utils.json_to_sheet(this.activeAPAForAgency);
      const pointOfContactsForAgencySheet = XLSX.utils.json_to_sheet(this.pointOfContactsForAgency);
      const officesDetailsForAgencySheet = XLSX.utils.json_to_sheet(this.officesDetailsForAgency);
      const stockInCountryForAgencySheet = XLSX.utils.json_to_sheet(this.stockInCountryForAgency);
      const stockOutCountryForAgencySheet = XLSX.utils.json_to_sheet(this.stockOutCountryForAgency);
      const coordsForAgencySheet = XLSX.utils.json_to_sheet(this.coordsForAgency);
      const equipmentsForAgencySheet = XLSX.utils.json_to_sheet(this.equipmentsForAgency);
      const surgeEquipmentsForAgencySheet = XLSX.utils.json_to_sheet(this.surgeEquipmentsForAgency);
      const organisationsForAgencySheet = XLSX.utils.json_to_sheet(this.organisationsForAgency);
      const surgesForAgencySheet = XLSX.utils.json_to_sheet(this.surgesForAgency);
      const officesCapacityForAgencySheet = XLSX.utils.json_to_sheet(this.officesCapacityForAgency);
      const program4wForAgencySheet = XLSX.utils.json_to_sheet(this.program4wForAgency);
      const sectorsForAgencySheet = XLSX.utils.json_to_sheet(this.sectorsForAgency);
      XLSX.utils.book_append_sheet(wb, alertsForAgencySheet, "Alerts")
      XLSX.utils.book_append_sheet(wb, indicatorsForAgencySheet, "Risk Monitoring")
      XLSX.utils.book_append_sheet(wb, plansForAgencySheet, "Response Plans")
      XLSX.utils.book_append_sheet(wb, actionsForAgencySheet, "Preparedness")
      XLSX.utils.book_append_sheet(wb, activeAPAForAgencySheet, "APA Activation")
      XLSX.utils.book_append_sheet(wb, pointOfContactsForAgencySheet, "CO - Contacts(Point of Contact)")
      XLSX.utils.book_append_sheet(wb, officesDetailsForAgencySheet, "CO - Contacts (Office Details)")
      XLSX.utils.book_append_sheet(wb, stockInCountryForAgencySheet, "Stock Capacity(In-country)")
      XLSX.utils.book_append_sheet(wb, stockOutCountryForAgencySheet, "Stock Capacity(External)")
      XLSX.utils.book_append_sheet(wb, coordsForAgencySheet, "CO - Coordination")
      XLSX.utils.book_append_sheet(wb, equipmentsForAgencySheet, "CO - Equipment(Equipment)")
      XLSX.utils.book_append_sheet(wb, surgeEquipmentsForAgencySheet, "CO - Surge Equipment")
      XLSX.utils.book_append_sheet(wb, organisationsForAgencySheet, "CO - Partners")
      XLSX.utils.book_append_sheet(wb, surgesForAgencySheet, "CO - Surge Capacity")
      XLSX.utils.book_append_sheet(wb, officesCapacityForAgencySheet, "CO - Office Capacity")
      XLSX.utils.book_append_sheet(wb, program4wForAgencySheet, "CO - Programme Mapping")
      XLSX.utils.book_append_sheet(wb, sectorsForAgencySheet, "CO - Sector Expertise")
      XLSX.writeFile(wb, 'SheetJS.xlsx')
      this.subjectAgency.next(true)
      this.exportFrom = EXPORT_FROM.FromCountry
    }
  }

  private exportFileSystem(counter, total, wb) {
    console.log("system total: " + total)
    console.log("system counter: " + counter)
    if (total - counter < 10 && this.systemCanExport) {
      this.systemCanExport = false
      Observable.timer(1000).first().subscribe(() => {
        // if (counter == total - 2) {
        console.log("system export triggered*****")
        const alertsForSystemSheet = XLSX.utils.json_to_sheet(this.alertsForSystem);
        const indicatorsForSystemSheet = XLSX.utils.json_to_sheet(this.indicatorsForSystem);
        const plansForSystemSheet = XLSX.utils.json_to_sheet(this.plansForSystem);
        const actionsForSystemSheet = XLSX.utils.json_to_sheet(this.actionsForSystem);
        const activeAPAForSystemSheet = XLSX.utils.json_to_sheet(this.activeAPAForSystem);
        const pointOfContactsForSystemSheet = XLSX.utils.json_to_sheet(this.pointOfContactsForSystem);
        const officesDetailsForSystemSheet = XLSX.utils.json_to_sheet(this.officesDetailsForSystem);
        const stockInCountryForSystemSheet = XLSX.utils.json_to_sheet(this.stockInCountryForSystem);
        const stockOutCountryForSystemSheet = XLSX.utils.json_to_sheet(this.stockOutCountryForSystem);
        const coordsForSystemSheet = XLSX.utils.json_to_sheet(this.coordsForSystem);
        const equipmentsForSystemSheet = XLSX.utils.json_to_sheet(this.equipmentsForSystem);
        const surgeEquipmentsForSystemSheet = XLSX.utils.json_to_sheet(this.surgeEquipmentsForSystem);
        const organisationsForSystemSheet = XLSX.utils.json_to_sheet(this.organisationsForSystem);
        const surgesForSystemSheet = XLSX.utils.json_to_sheet(this.surgesForSystem);
        const officesCapacityForSystemSheet = XLSX.utils.json_to_sheet(this.officesCapacityForSystem);
        const program4wForSystemSheet = XLSX.utils.json_to_sheet(this.program4wForSystem);
        const sectorsForSystemSheet = XLSX.utils.json_to_sheet(this.sectorsForSystem);
        XLSX.utils.book_append_sheet(wb, alertsForSystemSheet, "Alerts")
        XLSX.utils.book_append_sheet(wb, indicatorsForSystemSheet, "Risk Monitoring")
        XLSX.utils.book_append_sheet(wb, plansForSystemSheet, "Response Plans")
        XLSX.utils.book_append_sheet(wb, actionsForSystemSheet, "Preparedness")
        XLSX.utils.book_append_sheet(wb, activeAPAForSystemSheet, "APA Activation")
        XLSX.utils.book_append_sheet(wb, pointOfContactsForSystemSheet, "CO - Contacts(Point of Contact)")
        XLSX.utils.book_append_sheet(wb, officesDetailsForSystemSheet, "CO - Contacts (Office Details)")
        XLSX.utils.book_append_sheet(wb, stockInCountryForSystemSheet, "Stock Capacity(In-country)")
        XLSX.utils.book_append_sheet(wb, stockOutCountryForSystemSheet, "Stock Capacity(External)")
        XLSX.utils.book_append_sheet(wb, coordsForSystemSheet, "CO - Coordination")
        XLSX.utils.book_append_sheet(wb, equipmentsForSystemSheet, "CO - Equipment(Equipment)")
        XLSX.utils.book_append_sheet(wb, surgeEquipmentsForSystemSheet, "CO - Surge Equipment")
        XLSX.utils.book_append_sheet(wb, organisationsForSystemSheet, "CO - Partners")
        XLSX.utils.book_append_sheet(wb, surgesForSystemSheet, "CO - Surge Capacity")
        XLSX.utils.book_append_sheet(wb, officesCapacityForSystemSheet, "CO - Office Capacity")
        XLSX.utils.book_append_sheet(wb, program4wForSystemSheet, "CO - Programme Mapping")
        XLSX.utils.book_append_sheet(wb, sectorsForSystemSheet, "CO - Sector Expertise")
        XLSX.writeFile(wb, 'SheetJS.xlsx')
        this.subjectSystem.next(true)
        this.exportFrom = EXPORT_FROM.FromCountry
        this.systemCanExport = true
        // }
      })
    }
  }

  private fetchCustomHazardNameForAlertsCountry(countryId) {
    return new Promise((res,) => {
      this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId, {
        query: {
          orderByChild: "hazardScenario",
          equalTo: -1
        }
      })
        .first()
        .subscribe(customAlerts => {
          let totalCustomAlerts = customAlerts.length
          let customNameMap = new Map<string, string>()
          let customCounter = 0
          if (totalCustomAlerts == 0) {
            res(customNameMap)
          } else {
            customAlerts.forEach(alert => {
              this.af.database.object(Constants.APP_STATUS + "/hazardOther/" + alert.otherName)
                .first()
                .subscribe(obj => {
                  customNameMap.set(alert.otherName, obj.name)
                  customCounter++

                  if (totalCustomAlerts === customCounter) {
                    res(customNameMap)
                  }
                })
            })
          }
        })
    })

  }

  private getIndicatorLocation(indicator, jsonContent) {
    let location = ""
    switch (indicator.geoLocation) {
      case GeoLocation.subnational : {
        location = this.commonService.getAreaNameListFromObj(jsonContent, indicator.affectedLocation)
        break
      }
      default: {
        location = this.translateService.instant(Constants.GEO_LOCATION[0])
        break
      }
    }
    return location
  }

  private getIndicatorSourceAndLink(indicator) {
    return Object.keys(indicator.source).map(key => {
      return indicator.source[key]["link"] ? indicator.source[key]["name"] + " (" + indicator.source[key]["link"] + ")" : indicator.source[key]["name"]
    })
  }

  private fetchDepartmentsForAgencyAndCountry(agencyId, countryId) {
    let depMap = new Map<string, string>()
    return new Promise((res,) => {
      this.settingService.getAgencyDepartments(agencyId)
        .first()
        .subscribe(agencyDepts => {
          agencyDepts.forEach(dep => depMap.set(dep.id, dep.name))
          this.settingService.getCountryLocalDepartments(agencyId, countryId)
            .first()
            .subscribe(countryDepts => {
              countryDepts.forEach(cdept => depMap.set(cdept.id, cdept.name))
              res(depMap)
            })
        })
    })

  }

  private fetchNotesForActionUnderCountry(countryId) {
    let notesNumberMap = new Map<string, number>()
    return new Promise((res,) => {
      this.af.database.object(Constants.APP_STATUS + "/note/" + countryId, {preserveSnapshot: true})
        .first()
        .subscribe(snap => {
          if (snap && snap.val()) {
            Object.keys(snap.val()).forEach(key => {
              notesNumberMap.set(key, Object.keys(snap.val()[key]).length)
            })
            res(notesNumberMap)
          } else {
            res(notesNumberMap)
          }
        })
    })
  }

  private fetchActionClockSettings(agencyId, countryId) {
    return new Promise((res,) => {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + agencyId + "/" + countryId + "/clockSettings/preparedness/", {preserveSnapshot: true})
        .first()
        .subscribe(snap => {
          let durationType = snap.val().durationType;
          let value = snap.val().value;
          let expireDuration = 0
          switch (durationType) {
            case DurationType.Week: {
              expireDuration = moment.duration(value, 'weeks').asMilliseconds()
              break
            }
            case DurationType.Month : {
              expireDuration = moment.duration(value, 'months').asMilliseconds()
              break
            }
            case DurationType.Year : {
              expireDuration = moment.duration(value, 'years').asMilliseconds()
              break
            }
            default: {
              throw Error("duration type is illegal!")
            }
          }
          res(expireDuration)
        })
    })
  }

  private fetchAlertScenarioForCountry(countryId) {
    let alertScenarioMap = new Map<string, boolean>()
    return new Promise((res,) => {
      this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId)
        .first()
        .subscribe(alertList => {
          alertList
            .filter(alert => (alert.alertLevel == AlertLevels.Red && this.checkAlertApproval(alert)))
            .forEach(alert => {
              alert.hazardScenario != -1 ? alertScenarioMap.set(alert.hazardScenario, true) : alertScenarioMap.set(alert.otherName, true)
            })
          res(alertScenarioMap)
        })
    })
  }

  private fetchAlertsForCountry(countryId) {
    let alertMap = new Map<string, any>()
    return new Promise((res,) => {
      this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId)
        .first()
        .subscribe(alertList => {
          alertList
            .forEach(alert => {
              alertMap.set(alert.$key, alert)
            })
          res(alertMap)
        })
    })
  }

  private checkAlertApproval(alert): boolean {
    let approveStatus = false
    if (alert.approval) {
      let approves = []
      Object.keys(alert.approval).map(key => alert.approval[key]).map(item => Object.keys(item).map(id => item[id]))
        .forEach(one => approves = approves.concat(one))
      let temp = true
      approves.forEach(approve => {
        if (approve != AlertStatus.Approved) {
          temp = false
        }
      })
      approveStatus = temp
    }
    return approveStatus
  }

  private getExpireDate(defaultExpireDuration: number, action: any) {
    let expireDate = moment((action.updatedAt ? action.updatedAt : action.createdAt) + defaultExpireDuration).format("DD/MM/YYYY")
    if (action.frequencyValue && action.frequencyBase) {
      switch (Number(action.frequencyBase)) {
        case DurationType.Week : {
          expireDate = moment(action.updatedAt + moment.duration(action.frequencyValue, 'weeks').asMilliseconds()).format("DD/MM/YYYY")
          break
        }
        case DurationType.Month : {
          expireDate = moment(action.updatedAt + moment.duration(action.frequencyValue, 'months').asMilliseconds()).format("DD/MM/YYYY")
          break
        }
        case DurationType.Year : {
          expireDate = moment(action.updatedAt + moment.duration(action.frequencyValue, 'years').asMilliseconds()).format("DD/MM/YYYY")
          break
        }
        default : {
          throw Error("local frequency value invalid!")
        }
      }
    }
    return expireDate
  }

  private getExpireValue(defaultExpireDuration: number, action: any) {
    let expireValue = moment((action.updatedAt ? action.updatedAt : action.createdAt) + defaultExpireDuration).valueOf()
    if (action.frequencyValue && action.frequencyBase) {
      switch (Number(action.frequencyBase)) {
        case DurationType.Week : {
          expireValue = moment(action.updatedAt + moment.duration(action.frequencyValue, 'weeks').asMilliseconds()).valueOf()
          break
        }
        case DurationType.Month : {
          expireValue = moment(action.updatedAt + moment.duration(action.frequencyValue, 'months').asMilliseconds()).valueOf()
          break
        }
        case DurationType.Year : {
          expireValue = moment(action.updatedAt + moment.duration(action.frequencyValue, 'years').asMilliseconds()).valueOf()
          break
        }
        default : {
          throw Error("local frequency value invalid!")
        }
      }
    }
    return expireValue
  }

  private getActionStatus(expireDuration: number, action: any, alertScenarioMap: Map<string, boolean>) {
    let status = ActionStatus.InProgress
    if (action.isComplete) {
      status = ActionStatus.Completed
    } else if (!action.asignee) {
      status = ActionStatus.Unassigned
    } else if (moment().valueOf() > this.getExpireValue(expireDuration, action)) {
      status = ActionStatus.Expired
    } else {
      if (action.level == ActionLevel.MPA) {
        status = ActionStatus.InProgress
      } else {
        //need logic for apa with alert checking info
        if (action.assignHazard) {
          if (this.checkMapContainItemInList(action.assignHazard, alertScenarioMap)) {
            status = ActionStatus.InProgress
          } else {
            status = ActionStatus.Inactive
          }
        } else {
          if (alertScenarioMap.size > 0) {
            status = ActionStatus.InProgress
          } else {
            status = ActionStatus.Inactive
          }
        }
      }

    }
    return Constants.ACTION_STATUS[status]
  }

  private checkMapContainItemInList(list: number[], map: Map<string, boolean>): boolean {
    let contains = false
    list.forEach(item => {
      if (CommonUtils.convertMapToKeysInArray(map).includes(item)) {
        contains = true
      }
    })
    return contains
  }

  private getTimeTrackingInfoInPercentage(item: any, status: string) {
    if (!item.timeTracking) {
      return ""
    }
    let durations = this.getTimeTrackingInfo(item.timeTracking);

    let result = ""
    switch (status) {
      case "amber" : {
        result = Math.round(durations.amberDuration / durations.totalDuration * 100) + "%"
        break
      }
      case "green" : {
        result = Math.round(durations.greenDuration / durations.totalDuration * 100) + "%"
        break
      }
      case "red" : {
        result = Math.round(durations.redDuration / durations.totalDuration * 100) + "%"
        break
      }
    }
    return result

  }

  private getTimeTrackingInfoInNumber(item: any, status: string) {
    if (!item.timeTracking) {
      return ""
    }
    let durations = this.getTimeTrackingInfo(item.timeTracking);

    let result = ""
    switch (status) {
      case "amber" : {
        result = durations.amberDuration ? Math.round(moment.duration(durations.amberDuration).asDays()) + " days" : ""
        break
      }
      case "green" : {
        result = durations.greenDuration ? Math.round(moment.duration(durations.greenDuration).asDays()) + " days" : ""
        break
      }
      case "red" : {
        result = durations.redDuration ? Math.round(moment.duration(durations.redDuration).asDays()) + " days" : ""
        break
      }
    }
    return result

  }

  private getTimeTrackingInfo(timeTracking: any) {
    let timeList = []
    let amberDurationMap = new Map<number, any>()
    let greenDurationMap = new Map<number, any>()
    let redDurationMap = new Map<number, any>()
    if (timeTracking["timeSpentInAmber"]) {
      let index = 0
      timeTracking["timeSpentInAmber"].forEach(item => {
        timeList.push(item.start, item.finish)
        amberDurationMap.set(index, {"start": item.start, "finish": item.finish})
        index++
      })
    }
    if (timeTracking["timeSpentInGreen"]) {
      let index = 0
      timeTracking["timeSpentInGreen"].forEach(item => {
        timeList.push(item.start, item.finish)
        greenDurationMap.set(index, {"start": item.start, "finish": item.finish})
        index++
      })
    }
    if (timeTracking["timeSpentInRed"]) {
      let index = 0
      timeTracking["timeSpentInRed"].forEach(item => {
        timeList.push(item.start, item.finish)
        redDurationMap.set(index, {"start": item.start, "finish": item.finish})
        index++
      })
    }
    let now = moment().valueOf()
    let sortedListTotal = timeList.map(item => {
      if (item === -1) {
        item = now
      }
      return item
    }).sort((a, b) => a - b)
    let totalDuration = sortedListTotal[sortedListTotal.length - 1] - sortedListTotal[0]

    let amberDuration = this.getTotalDurationFromMap(amberDurationMap, now)

    let greenDuration = this.getTotalDurationFromMap(greenDurationMap, now)

    let redDuration = this.getTotalDurationFromMap(redDurationMap, now)

    return {
      "totalDuration": totalDuration,
      "amberDuration": amberDuration,
      "greenDuration": greenDuration,
      "redDuration": redDuration
    };
  }

  private getTotalDurationFromMap(durationMap, timeNow) {
    let totalDuration = 0
    CommonUtils.convertMapToValuesInArray(durationMap).forEach(durationObj => {
      totalDuration += (durationObj.finish != -1 ? durationObj.finish : timeNow) - durationObj.start
    })
    return totalDuration

  }

  private getLastUpdateDuration(item: any) {
    let duration = ""
    if (item.timeTracking) {
      let timeTrackingList = Object
        .keys(item.timeTracking)
        .map(key => item.timeTracking[key])
        .map(item => Object.keys(item).map(id => item[id]))
        .reduce((acc, cur) => acc.concat(cur), [])
      console.log(timeTrackingList)
      let lastUpdateIndex = timeTrackingList.findIndex(obj => obj.finish == -1)
      console.log(lastUpdateIndex)
      if (lastUpdateIndex != -1) {
        let durationDays = Math.round(moment.duration(moment.now().valueOf() - timeTrackingList[lastUpdateIndex].start).asDays())
        duration = `${durationDays} days`
      }
    }
    return duration
  }

  private fetchAPActivationData(areaContent, actionList: any[], countryId: string, wb: WorkBook, agencyId?: string) {
    this.fetchAlertsForCountry(countryId).then((alertMap: Map<string, any>) => {
      console.log(alertMap)
      let apaList = actionList.filter(action => action.level = ActionLevel.APA && action.redAlerts)
      if (apaList.length > 0) {
        let activeApaList = []
        let apaCounter = 0
        apaList.forEach(apa => {
          let redInstanceMap = this.getRedInstanceMap(apa)
          redInstanceMap.forEach((instanceNumbers, alertId) => {
            let alertObj = alertMap.get(alertId);
            let activationDateList = this.getAlertTimeSpendInRedList(instanceNumbers, alertObj)
            activationDateList.forEach(date => {
              let obj = {}
              if (this.exportFrom == EXPORT_FROM.FromSystem || this.exportFrom == EXPORT_FROM.FromDonor) {
                obj["Agency"] = this.agencyNameMap.get(agencyId)
              }
              if (this.exportFrom != EXPORT_FROM.FromCountry) {
                obj["Country Office"] = this.countryNameMap.get(countryId)
              }
              obj["Action title"] = this.exportFrom == EXPORT_FROM.FromSystem ? this.PRIVATE : apa["task"]
              obj["Date activated"] = moment(date).format("DD/MM/YYYY")
              obj["Activating hazard"] = alertObj.hazardScenario && alertObj.hazardScenario != -1 && Constants.HAZARD_SCENARIOS[alertObj.hazardScenario] ? this.translateService.instant(Constants.HAZARD_SCENARIOS[alertObj.hazardScenario]) : alertObj.otherName
              obj["Location"] = this.commonService.getAreaNameListFromObj(areaContent, alertObj.affectedAreas)
              obj["Time taken for completion"] = apa.isCompleteAt ? Math.round(moment.duration(apa.isCompleteAt - apa.updatedAt).asDays()) + " days" : ""
              activeApaList.push(obj)
            })

          })
          apaCounter++
          if (apaCounter === apaList.length) {
            this.activeAPAForAgency = this.activeAPAForAgency.concat(activeApaList)
            const activateAPASheet = XLSX.utils.json_to_sheet(activeApaList);
            XLSX.utils.book_append_sheet(wb, activateAPASheet, "APA Activation")
            this.counter++
            console.log("APA Activation: " + this.counter)
            this.exportFile(this.counter, this.total, wb)
          }
        })
      } else {
        this.passEmpty(wb)
      }
    })
  }

  private getRedInstanceMap(apa: any) {
    let map = new Map<string, number>()
    apa.redAlerts.forEach(alertId => {
      if (map.has(alertId)) {
        let instances = map.get(alertId) + 1
        map.set(alertId, instances)
      } else {
        map.set(alertId, 1)
      }
    })
    return map
  }

  private getAlertTimeSpendInRedList(instanceNumbers: number, alertObj: any) {
    if (alertObj && alertObj.timeTracking && alertObj.timeTracking.timeSpentInRed) {
      return alertObj.timeTracking.timeSpentInRed.sort((a, b) => b.start - a.start).slice(0, instanceNumbers + 1).map(item => item.start)
    }
    return []
  }

  private resetAgencyData() {
    this.alertsForAgency = []
    this.indicatorsForAgency = []
    this.plansForAgency = []
    this.actionsForAgency = []
    this.activeAPAForAgency = []
    this.pointOfContactsForAgency = []
    this.officesDetailsForAgency = []
    this.stockOutCountryForAgency = []
    this.coordsForAgency = []
    this.stockInCountryForAgency = []
    this.equipmentsForAgency = []
    this.surgeEquipmentsForAgency = []
    this.organisationsForAgency = []
    this.surgesForAgency = []
    this.officesCapacityForAgency = []
    this.program4wForAgency = []
    this.sectorsForAgency = []
  }

  private resetSystemData() {
    this.alertsForSystem = []
    this.indicatorsForSystem = []
    this.plansForSystem = []
    this.actionsForSystem = []
    this.activeAPAForSystem = []
    this.pointOfContactsForSystem = []
    this.officesDetailsForSystem = []
    this.stockInCountryForSystem = []
    this.stockOutCountryForSystem = []
    this.coordsForSystem = []
    this.equipmentsForSystem = []
    this.surgeEquipmentsForSystem = []
    this.organisationsForSystem = []
    this.surgesForSystem = []
    this.officesCapacityForSystem = []
    this.program4wForSystem = []
    this.sectorsForSystem = []
  }

  private updateCountryName(countries: { agencyId: string, countryId: string }[]): Promise<boolean> {
    return new Promise((res, rej) => {
      if (countries.length === 0) {
        res(true)
      } else {
        let counter = 0
        countries.forEach(obj => {
          this.agencyService.getCountryOffice(obj.countryId, obj.agencyId)
            .first()
            .subscribe(countryOffice => {
              this.countryNameMap.set(countryOffice.$key, Constants.COUNTRIES[countryOffice.location] ? this.translateService.instant(Constants.COUNTRIES[countryOffice.location]) : "")
              counter++
              if (counter === countries.length) {
                res(true)
              }
            })
        })
      }
    })
  }

}


export enum EXPORT_FROM {
  FromCountry = 0,
  FromAgency = 1,
  FromSystem = 2,
  FromDonor = 3
}
