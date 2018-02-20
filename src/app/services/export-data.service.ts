import {Injectable} from '@angular/core';
import {Constants} from "../utils/Constants";
import * as XLSX from "xlsx";
import * as moment from "moment";
import {AngularFire} from "angularfire2";
import {CommonService} from "./common.service";
import {WorkBook} from "xlsx";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class ExportDataService {

  constructor(private af: AngularFire,
              private translateService: TranslateService,
              private commonService: CommonService) {
  }

  public exportOfficeData(countryId: string, areaContent: any) {

    const total = 3
    let counter = 0

    const wb: XLSX.WorkBook = XLSX.utils.book_new()

    //fetch country alert data
    this.fetchCustomHazardNameForAlertsCountry(countryId).then((customNameMap: Map<string, string>) => {
      //fetch alerts data
      counter = this.fetchCountryAlertsData(countryId, customNameMap, areaContent, wb, counter, total);
    })

    //fetch response plan data
    counter = this.fetchResponsePlanData(countryId, wb, counter, total);

    //fetch preparedness actions data
    counter = this.fetchActionsData(countryId, wb, counter, total);

    //fetch point of contacts
    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/contacts/" + countryId)
      .first()
      .subscribe(contactsList => {
        let contacts = contactsList.map(contact => {
          let obj = {}
          obj["Name of contact"] = contact["staffMember"]
          // obj["Contact Email"] = contact["name"]
          obj["Skype Name"] = contact["skypeName"]
          // obj["Direct Telephone"] = contact["name"]
          obj["Office Telephone"] = contact["phone"]
          return obj
        })

        const planSheet = XLSX.utils.json_to_sheet(contacts);
        XLSX.utils.book_append_sheet(wb, planSheet, "CO - Contacts(Point of Contact)")

        counter++

        this.exportFile(counter, total, wb)
      })

  }

  private fetchActionsData(countryId: string, wb: WorkBook, counter: number, total: number) {
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

        counter++

        this.exportFile(counter, total, wb)
      })
    return counter;
  }

  private fetchResponsePlanData(countryId: string, wb: WorkBook, counter: number, total: number) {
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

        counter++

        this.exportFile(counter, total, wb)
      })
    return counter;
  }

  private fetchCountryAlertsData(countryId: string, customNameMap: Map<string, string>, areaContent: any, wb: WorkBook, counter: number, total: number) {
    this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId)
      .first()
      .subscribe(alertList => {
        let alerts = alertList.map(alert => {
          let obj = {}
          obj["Date Raised"] = moment(alert.timeCreated).format("DD/MM/YYYY")
          obj["Alert level"] = Constants.ALERT_LEVEL_STRING[alert.alertLevel]
          if (alert.hazardScenario != -1) {
            obj["Hazard"] = Constants.HAZARD_SCENARIOS_STRING[alert.hazardScenario]
          } else {
            obj["Hazard"] = customNameMap.get(alert.otherName)
          }
          obj["Population affected"] = alert.estimatedPopulation
          obj["Affected areas"] = this.commonService.getAreaNameListFromObj(areaContent, alert.affectedAreas)
          obj["Information sources"] = alert.infoNotes
          obj["Duration"] = "need more info"
          return obj
        })

        console.log(alerts)

        const alertSheet = XLSX.utils.json_to_sheet(alerts)
        XLSX.utils.book_append_sheet(wb, alertSheet, "Alerts")

        counter++
        this.exportFile(counter, total, wb)

      })
    return counter;
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
