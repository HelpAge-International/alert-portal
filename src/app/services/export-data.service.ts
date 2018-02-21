import {Injectable} from '@angular/core';
import {Constants} from "../utils/Constants";
import * as XLSX from "xlsx";
import * as moment from "moment";
import {AngularFire} from "angularfire2";
import {CommonService} from "./common.service";
import {WorkBook} from "xlsx";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "./user.service";
import {StockType} from "../utils/Enums";

@Injectable()
export class ExportDataService {

  private total:number
  private counter:number

  constructor(private af: AngularFire,
              private translateService: TranslateService,
              private userService:UserService,
              private commonService: CommonService) {
  }

  public exportOfficeData(agencyId:string, countryId: string, areaContent: any) {
    //TODO MAKE SURE TOTAL NUMBER FOR SHEETS IS RIGHT!!
    this.total = 8
    this.counter = 0

    const wb: XLSX.WorkBook = XLSX.utils.book_new()

    //fetch country alert data
    this.fetchCustomHazardNameForAlertsCountry(countryId).then((customNameMap: Map<string, string>) => {
      //fetch alerts data
      this.fetchCountryAlertsData(countryId, customNameMap, areaContent, wb);
    })

    //fetch response plan data
    this.fetchResponsePlanData(countryId, wb);

    //fetch preparedness actions data
    this.fetchActionsData(countryId, wb);

    //fetch point of contacts
    this.fetchPointOfContactData(countryId, wb);

    //fetch office contacts
    this.fetchCountryOfficeDetail(agencyId, countryId, wb);

    //fetch stock capacity - external and  in-country stock
    this.fetchStockCapacity(countryId, areaContent, wb);

    //fetch coordination data
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/coordination/" + countryId)
      .first()
      .subscribe(cos => {
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
              coor["Staff member represting your agency?"] = staff.firstName +" "+staff.lastName
              counter++
              if (counter == coorTotal) {
                const coordSheet = XLSX.utils.json_to_sheet(coordinations);
                XLSX.utils.book_append_sheet(wb, coordSheet, "CO - Coordination")
                this.counter++
                this.exportFile(this.counter, this.total, wb)
              }
            })
        })
      })

    //fetch equipment data
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/equipment/" + countryId)
      .first()
      .subscribe(countryEquipments => {
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

      })

    //fetch surge equipment data
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/surgeEquipment/" + countryId)
      .first()
      .subscribe(cos => {
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
              coor["Staff member represting your agency?"] = staff.firstName +" "+staff.lastName
              counter++
              if (counter == coorTotal) {
                const coordSheet = XLSX.utils.json_to_sheet(coordinations);
                XLSX.utils.book_append_sheet(wb, coordSheet, "CO - Coordination")
                this.counter++
                this.exportFile(this.counter, this.total, wb)
              }
            })
        })
      })
  }

  private fetchStockCapacity(countryId: string, areaContent: any, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/stockCapacity/" + countryId)
      .first()
      .subscribe(stockInCountry => {
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
      })
  }

  private fetchActionsData(countryId: string, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/action/" + countryId)
      .first()
      .subscribe(actionList => {
        let actions = actionList.map(action => {
          let obj = {}
          obj["Action title"] = action["type"]
          obj["Preparedness action level"] = action["level"]
          obj["Type"] = action["type"]
          obj["Department"] = action["department"]
          obj["Assigned to"] = action["asignee"]
          obj["Due Date"] = action["dueDate"]
          obj["Budget"] = action["budget"]
          obj["Document Required"] = action["requireDoc"]
          obj["Status"] = "test status"
          obj["Expires"] = action["dueDate"]
          obj["Notes"] = "test 5"
          return obj
        })

        const actionSheet = XLSX.utils.json_to_sheet(actions);
        XLSX.utils.book_append_sheet(wb, actionSheet, "Preparedness")

        this.counter++

        this.exportFile(this.counter, this.total, wb)
      })
  }

  private fetchResponsePlanData(countryId: string, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId)
      .first()
      .subscribe(planList => {
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
          return obj
        })

        const planSheet = XLSX.utils.json_to_sheet(plans);
        XLSX.utils.book_append_sheet(wb, planSheet, "Response Plans")

        this.counter++

        this.exportFile(this.counter, this.total, wb)
      })
  }

  private fetchCountryAlertsData(countryId: string, customNameMap: Map<string, string>, areaContent: any, wb: WorkBook) {
    this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId)
      .first()
      .subscribe(alertList => {
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

      })
  }

  private exportFile(counter, total, wb) {
    if (counter == total) {
      //try export see if works
      XLSX.writeFile(wb, 'SheetJS.xlsx')
    }
  }

  public fetchCustomHazardNameForAlertsCountry(countryId) {
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
                  customNameMap.set(alert.$key, obj.name)
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

}
