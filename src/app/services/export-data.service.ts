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

@Injectable()
export class ExportDataService {

  private total: number
  private counter: number
  private exportSubject: Subject<boolean>

  constructor(private af: AngularFire,
              private translateService: TranslateService,
              private userService: UserService,
              private partnerService: PartnerOrganisationService,
              private surgeCapacityService: SurgeCapacityService,
              private settingService: SettingsService,
              private commonService: CommonService) {
  }

  public exportOfficeData(agencyId: string, countryId: string, areaContent: any, staffMap: Map<string, string>) {

    this.exportSubject = new Subject<boolean>()
    // MAKE SURE TOTAL NUMBER FOR SHEETS IS RIGHT!! (16 now)
    this.total = 16
    this.counter = 0

    const wb: XLSX.WorkBook = XLSX.utils.book_new()

    //fetch country alert data
    this.fetchCustomHazardNameForAlertsCountry(countryId).then((customNameMap: Map<string, string>) => {
      //fetch alerts data
      this.fetchCountryAlertsData(countryId, customNameMap, areaContent, wb);
    })

    //fetch risk monitoring data
    this.fetchRiskMonitoringData(countryId, staffMap, areaContent, wb);

    //fetch response plan data
    this.fetchResponsePlanData(countryId, wb);

    //fetch preparedness actions data
    this.fetchActionsData(areaContent, agencyId, countryId, staffMap, wb);

    //fetch point of contacts
    this.fetchPointOfContactData(countryId, wb);

    //fetch office contacts
    this.fetchCountryOfficeDetail(agencyId, countryId, wb);

    //fetch stock capacity - external and  in-country stock
    this.fetchStockCapacity(countryId, areaContent, wb);

    //fetch coordination data
    this.fetchCoordinationData(countryId, wb);

    //fetch equipment data
    this.fetchEquipmentData(countryId, areaContent, wb);

    //fetch surge equipment data
    this.fetchSurgeEquipmentData(countryId, wb);

    //fetch partner orgs data
    this.fetchPartnerOrgData(agencyId, countryId, wb);

    //fetch surge capacity data
    this.fetchSurgeCapacityData(countryId, wb);

    //fetch office capacity (staff) data
    this.fetchOfficeCapacityData(countryId, wb);

    //fetch programme 4w
    this.fetchProgram4wData(countryId, wb);

    //fetch sector expertise
    this.fetchSectorExpertiseData(countryId, wb);

    return this.exportSubject

  }

  private fetchRiskMonitoringData(countryId: string, staffMap: Map<string, string>, areaContent: any, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/indicator/" + countryId)
      .first()
      .subscribe(countryIndicators => {
        let allIndicators = []
        //first fetch country context indicators
        let indicators = countryIndicators.map(item => {
          return this.transformIndicator(item, staffMap, areaContent, "Country Context")
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
                      return this.transformIndicator(item, staffMap, areaContent, this.translateService.instant(Constants.HAZARD_SCENARIOS[item.hazardScenario.hazardScenario]))
                    })
                    allIndicators = allIndicators.concat(hazardIndicators)

                    //dealing with custom hazards
                    let hazardIndicatorsCustom = hazardIndicatorList.filter(item => item.hazardScenario.hazardScenario == -1).map(item => {
                      return this.transformIndicator(item, staffMap, areaContent, item.hazardScenario.otherName);
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
                                console.log(allIndicators)
                                const indicatorSheet = XLSX.utils.json_to_sheet(allIndicators);
                                XLSX.utils.book_append_sheet(wb, indicatorSheet, "Risk Monitoring")
                                this.counter++
                                this.exportFile(this.counter, this.total, wb)
                              }
                            }
                          })
                      })
                    } else {
                      hazardIndicatorCounter++

                      if (hazards.length === hazardIndicatorCounter) {
                        console.log(allIndicators)
                        const indicatorSheet = XLSX.utils.json_to_sheet(allIndicators);
                        XLSX.utils.book_append_sheet(wb, indicatorSheet, "Risk Monitoring")
                        this.counter++
                        this.exportFile(this.counter, this.total, wb)
                      }
                    }
                  })
              })
            } else {
              if (allIndicators.length > 0) {
                const indicatorSheet = XLSX.utils.json_to_sheet(allIndicators);
                XLSX.utils.book_append_sheet(wb, indicatorSheet, "Risk Monitoring")
                this.counter++
                this.exportFile(this.counter, this.total, wb)
              } else {
                this.passEmpty(wb)
              }
            }
          })
      })
  }

  private transformIndicator(item, staffMap: Map<string, string>, areaContent: any, hazard: any) {
    let indicatorObj = {}
    indicatorObj["Hazard"] = hazard
    indicatorObj["Indicator Name"] = item["name"]
    indicatorObj["Name of Source"] = this.getIndicatorSourceAndLink(item).join("\n")
    indicatorObj["Current status"] = this.translateService.instant(Constants.INDICATOR_STATUS[item["triggerSelected"]])
    indicatorObj["Green trigger name"] = item["trigger"][0]["triggerValue"]
    indicatorObj["Green trigger value"] = item["trigger"][0]["frequencyValue"] + " " + this.translateService.instant(Constants.DETAILED_DURATION_TYPE[item["trigger"][0]["durationType"]])
    indicatorObj["Amber trigger name"] = item["trigger"][1]["triggerValue"]
    indicatorObj["Amber trigger value"] = item["trigger"][1]["frequencyValue"] + " " + this.translateService.instant(Constants.DETAILED_DURATION_TYPE[item["trigger"][1]["durationType"]])
    indicatorObj["Red trigger name"] = item["trigger"][2]["triggerValue"]
    indicatorObj["Red trigger value"] = item["trigger"][2]["frequencyValue"] + " " + this.translateService.instant(Constants.DETAILED_DURATION_TYPE[item["trigger"][2]["durationType"]])
    indicatorObj["Assigned to"] = item["assignee"] ? staffMap.get(item["assignee"]) : ""
    indicatorObj["Location"] = this.getIndicatorLocation(item, areaContent)
    indicatorObj["Green State instances"] = item.timeTracking ? item.timeTracking["timeSpentInGreen"] ? Object.keys(item.timeTracking["timeSpentInGreen"]).length : 0 : ""
    indicatorObj["Amber State instances"] = item.timeTracking ? item.timeTracking["timeSpentInAmber"] ? Object.keys(item.timeTracking["timeSpentInAmber"]).length : 0 : ""
    indicatorObj["Red State instances"] = item.timeTracking ? item.timeTracking["timeSpentInRed"] ? Object.keys(item.timeTracking["timeSpentInRed"]).length : 0 : ""
    indicatorObj["Green State duration"] = this.getTimeTrackingInfoInNumber(item, "green")
    indicatorObj["Amber State duration"] = this.getTimeTrackingInfoInNumber(item, "amber")
    indicatorObj["Red State duration"] = this.getTimeTrackingInfoInNumber(item, "red")
    return indicatorObj
  }

  private fetchSectorExpertiseData(countryId: string, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + countryId + '/sectorExpertise/')
      .first()
      .subscribe(sectorList => {
        if (sectorList.length > 0) {
          let sectors = []
          let expertise = sectorList.map(sector => this.translateService.instant(Constants.RESPONSE_PLANS_SECTORS[sector.$key])).toString()
          let obj = {}
          obj["Sectors of expertise"] = expertise
          sectors.push(obj)

          const sectorSheet = XLSX.utils.json_to_sheet(sectors);
          XLSX.utils.book_append_sheet(wb, sectorSheet, "CO - Sector Expertise")
          this.counter++
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb);
        }
      })
  }

  private passEmpty(wb: WorkBook) {
    this.counter++
    this.exportFile(this.counter, this.total, wb)
  }

  private fetchProgram4wData(countryId: string, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/programme/" + countryId + '/4WMapping/')
      .first()
      .subscribe(mappings => {
        if (mappings.length > 0) {
          let program4w = mappings.map(mapping => {
            let obj = {}
            obj["Sector"] = this.translateService.instant(Constants.RESPONSE_PLANS_SECTORS[mapping["sector"]])
            obj["What"] = mapping["what"]
            if (!mapping["where"] || (mapping["where"] && typeof (mapping["where"]) === 'string' && Number.isNaN(parseInt(mapping["where"])))) {
              obj["Where"] = mapping["where"]
            } else {
              obj["Where"] = this.translateService.instant(Constants.COUNTRIES[mapping["where"]])
            }
            obj["To Whom"] = mapping["toWho"]
            obj["When"] = moment(mapping["when"]).format("MM/YYYY")
            obj["Notes"] = mapping["programmeNotes"] ? Object.keys(mapping["programmeNotes"]).length : 0
            obj["Last updated"] = mapping["updatedAt"] ? moment(mapping["updatedAt"]).format("MM/YYYY") : ""
            return obj
          })

          const program4wSheet = XLSX.utils.json_to_sheet(program4w);
          XLSX.utils.book_append_sheet(wb, program4wSheet, "CO - Programme Mapping")
          this.counter++
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchOfficeCapacityData(countryId: string, wb: WorkBook) {
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
                          obj["Name"] = user.firstName + " " + user.lastName
                          obj["Position"] = staff.position
                          obj["Office Type"] = this.translateService.instant(Constants.OFFICE_TYPE[staff.officeType])
                          obj["Technical Skills"] = techList
                          obj["Support Skills"] = supList
                          obj["Training Needs"] = staff.training
                          obj["Notes"] = staff.notes ? Object.keys(staff.notes).length : 0
                          obj["Last updated"] = moment(staff.updatedAt).format("MM/YYYY")
                          transformedList.push(obj)
                          if (staffList.length == transformedList.length) {
                            const officeCapacitySheet = XLSX.utils.json_to_sheet(transformedList);
                            XLSX.utils.book_append_sheet(wb, officeCapacitySheet, "CO - Office Capacity")
                            this.counter++
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
                  obj["Name"] = user.firstName + " " + user.lastName
                  obj["Position"] = staff.position
                  obj["Office Type"] = this.translateService.instant(Constants.OFFICE_TYPE[staff.officeType])
                  obj["Technical Skills"] = ""
                  obj["Support Skills"] = ""
                  obj["Training Needs"] = staff.training
                  obj["Notes"] = staff.notes ? Object.keys(staff.notes).length : 0
                  obj["Last updated"] = moment(staff.updatedAt).format("MM/YYYY")
                  transformedList.push(obj)
                  if (staffList.length == transformedList.length) {
                    const officeCapacitySheet = XLSX.utils.json_to_sheet(transformedList);
                    XLSX.utils.book_append_sheet(wb, officeCapacitySheet, "CO - Office Capacity")
                    this.counter++
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

  private fetchSurgeCapacityData(countryId: string, wb: WorkBook) {
    this.surgeCapacityService.getSuregeCapacity(countryId)
      .first()
      .subscribe(surgeCapacityList => {
        if (surgeCapacityList.length > 0) {
          let surges = surgeCapacityList.map(surge => {
            let obj = {}
            obj["Organisation"] = surge["orgnization"]
            obj["Relationship"] = surge["relationship"]
            obj["Contact Name"] = surge["name"]
            obj["Contact Position"] = surge["position"]
            obj["Contact Email"] = surge["email"]
            obj["Sector(s) of expertise"] = ""
            obj["Location"] = surge["location"]
            obj["ETA"] = surge["arrivalTimeValue"] + " " + this.translateService.instant(Constants.DETAILED_DURATION_TYPE[surge["arrivalTimeType"]])
            obj["Length of deployment"] = surge["durationOfDeployment"]
            return obj
          })

          const surgesSheet = XLSX.utils.json_to_sheet(surges);
          XLSX.utils.book_append_sheet(wb, surgesSheet, "CO - Surge Capacity")
          this.counter++
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
                  obj["Partner Organisation"] = org["organisationName"]
                  obj["Relationship"] = org["relationship"]
                  obj["Projects"] = org["projects"].length
                  obj["Contact Title"] = this.translateService.instant(Constants.PERSON_TITLE[org["title"]])
                  obj["Contact First Name"] = org["firstName"]
                  obj["Contact Last Name"] = org["lastName"]
                  obj["Contact Position"] = org["position"]
                  obj["Contact Email"] = org["email"]
                  obj["Contact Phone Number"] = org["phone"]
                  return obj
                })

                const organisationSheet = XLSX.utils.json_to_sheet(organisations);
                XLSX.utils.book_append_sheet(wb, organisationSheet, "CO - Partners")
                this.counter++
                this.exportFile(this.counter, this.total, wb)

              }
            })
        } else {
          this.passEmpty(wb)
        }
      })

  }

  private fetchSurgeEquipmentData(countryId: string, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/surgeEquipment/" + countryId)
      .first()
      .subscribe(surgeEquipmentList => {
        if (surgeEquipmentList.length > 0) {
          let surgeEquipments = surgeEquipmentList.map(sEquipment => {
            let obj = {}
            obj["Supplier"] = sEquipment["supplier"]
            obj["Relationship"] = sEquipment["relationship"]
            obj["Equipment Provided"] = sEquipment["equipmentProvided"]
            obj["Contact Name"] = sEquipment["contactName"]
            obj["Contact Email"] = sEquipment["contactEmail"]
            obj["Contact Telephone"] = sEquipment["contactPhone"]
            return obj
          })

          const surgeEquipmentSheet = XLSX.utils.json_to_sheet(surgeEquipments);
          XLSX.utils.book_append_sheet(wb, surgeEquipmentSheet, "CO - Surge Equipment")
          this.counter++
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchEquipmentData(countryId: string, areaContent: any, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/equipment/" + countryId)
      .first()
      .subscribe(countryEquipments => {
        if (countryEquipments.length > 0) {
          let equipments = countryEquipments.map(equipment => {
            let obj = {}
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

          const equipmentSheet = XLSX.utils.json_to_sheet(equipments);
          XLSX.utils.book_append_sheet(wb, equipmentSheet, "CO - Equipment(Equipment)")
          this.counter++
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }

      })
  }

  private fetchCoordinationData(countryId: string, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/coordination/" + countryId)
      .first()
      .subscribe(cos => {
        if (cos.length > 0) {
          let coordinations = cos.map(co => {
            let obj = {}
            obj["Sector"] = this.translateService.instant(Constants.RESPONSE_PLANS_SECTORS[co["sector"]])
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
                  const coordSheet = XLSX.utils.json_to_sheet(coordinations);
                  XLSX.utils.book_append_sheet(wb, coordSheet, "CO - Coordination")
                  this.counter++
                  this.exportFile(this.counter, this.total, wb)
                }
              })
          })
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchStockCapacity(countryId: string, areaContent: any, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/stockCapacity/" + countryId)
      .first()
      .subscribe(stockInCountry => {
        if (stockInCountry.length > 0) {
          let stocksInCountry = stockInCountry.filter(stock => stock.stockType == StockType.Country).map(stock => {
            let obj = {}
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

          const stocksInCountrySheet = XLSX.utils.json_to_sheet(stocksInCountry);
          const stocksExternalCountrySheet = XLSX.utils.json_to_sheet(stocksExternalCountry);
          XLSX.utils.book_append_sheet(wb, stocksInCountrySheet, "Stock Capacity(In-country)")
          XLSX.utils.book_append_sheet(wb, stocksExternalCountrySheet, "Stock Capacity(External)")
          this.counter++
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
        office["Address Line 1"] = countryOffice.addressLine1
        office["Address Line 2"] = countryOffice.addressLine2
        office["Address Line 3"] = countryOffice.addressLine3
        office["Country"] = this.translateService.instant(Constants.COUNTRIES[countryOffice.location])
        office["City"] = countryOffice.city
        office["Postcode"] = countryOffice.postCode
        office["Phone Number"] = countryOffice.phone

        this.userService.getUser(countryOffice.adminId)
          .first()
          .subscribe(countryAdmin => {
            office["Email Address"] = countryAdmin.email

            offices.push(office)
            const officeSheet = XLSX.utils.json_to_sheet(offices);
            XLSX.utils.book_append_sheet(wb, officeSheet, "CO - Contacts (Office Details)")
            this.counter++
            this.exportFile(this.counter, this.total, wb)
          })
      })
  }

  private fetchPointOfContactData(countryId: string, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/contacts/" + countryId)
      .first()
      .subscribe(contactsList => {
        if (contactsList.length > 0) {
          let contacts = contactsList.map(contact => {
            let obj = {}
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
                contact["Name of contact"] = tempObj["Name of contact"]
                contact["Contact Email"] = tempObj["Contact Email"]
                contact["Skype Name"] = tempObj["Skype Name"]
                contact["Direct Telephone"] = tempObj["Direct Telephone"]
                contact["Office Telephone"] = tempObj["Office Telephone"]

                contactCounter++
                if (contactCounter == totalContacts) {
                  const planSheet = XLSX.utils.json_to_sheet(contacts);
                  XLSX.utils.book_append_sheet(wb, planSheet, "CO - Contacts(Point of Contact)")
                  this.counter++
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
                    obj["Action title"] = action["task"]
                    obj["Preparedness action level"] = this.translateService.instant(Constants.ACTION_LEVEL[action["level"]])
                    obj["Type"] = this.translateService.instant(Constants.ACTION_TYPE[action["type"]])
                    obj["Department"] = action["department"] ? departmentMap.get(action["department"]) : ""
                    obj["Assigned to"] = action["asignee"] ? staffMap.get(action["asignee"]) : ""
                    obj["Due Date"] = moment(action["dueDate"]).format("DD/MM/YYYY")
                    obj["Budget"] = action["budget"]
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

                  const actionSheet = XLSX.utils.json_to_sheet(actions);
                  XLSX.utils.book_append_sheet(wb, actionSheet, "Preparedness")

                  this.counter++

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

  private fetchResponsePlanData(countryId: string, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId)
      .first()
      .subscribe(planList => {
        if (planList.length > 0) {
          let plans = planList.map(plan => {
            let obj = {}
            obj["Plan Name"] = plan["name"]
            if (plan["hazardScenario"] != -1) {
              obj["Hazard"] = this.translateService.instant(Constants.HAZARD_SCENARIOS[plan["hazardScenario"]])
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

          const planSheet = XLSX.utils.json_to_sheet(plans);
          XLSX.utils.book_append_sheet(wb, planSheet, "Response Plans")
          this.counter++
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }
      })
  }

  private fetchCountryAlertsData(countryId: string, customNameMap: Map<string, string>, areaContent: any, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId)
      .first()
      .subscribe(alertList => {
        if (alertList.length > 0) {
          let alerts = alertList.map(alert => {
            let obj = {}
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
            obj["Duration"] = "need more info"
            return obj
          })
          const alertSheet = XLSX.utils.json_to_sheet(alerts)
          XLSX.utils.book_append_sheet(wb, alertSheet, "Alerts")
          this.counter++
          this.exportFile(this.counter, this.total, wb)
        } else {
          this.passEmpty(wb)
        }

      })
  }

  private exportFile(counter, total, wb) {
    if (counter == total) {
      //try export see if works
      XLSX.writeFile(wb, 'SheetJS.xlsx')
      this.exportSubject.next(true)
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

  private fetchAPActivationData(areaContent, actionList: any[], countryId: string, wb: WorkBook) {
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
              obj["Action title"] = apa["task"]
              obj["Date activated"] = moment(date).format("DD/MM/YYYY")
              obj["Activating hazard"] = alertObj.hazardScenario != -1 ? this.translateService.instant(Constants.HAZARD_SCENARIOS[alertObj.hazardScenario]) : alertObj.otherName
              obj["Location"] = this.commonService.getAreaNameListFromObj(areaContent, alertObj.affectedAreas)
              obj["Time taken for completion"] = apa.isCompleteAt ? Math.round(moment.duration(apa.isCompleteAt - apa.updatedAt).asDays()) + " days" : ""
              activeApaList.push(obj)
            })

          })
          apaCounter++
          if (apaCounter === apaList.length) {
            const activateAPASheet = XLSX.utils.json_to_sheet(activeApaList);
            XLSX.utils.book_append_sheet(wb, activateAPASheet, "APA Activation")
            this.counter++
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
}
