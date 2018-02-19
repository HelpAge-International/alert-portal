import {Injectable} from '@angular/core';
import {Constants} from "../utils/Constants";
import * as XLSX from "xlsx";
import * as moment from "moment";
import {AngularFire} from "angularfire2";

@Injectable()
export class ExportDataService {

  constructor(private af: AngularFire) {
  }

  public exportOfficeData(countryId: string) {

    const total = 3
    let counter = 0

    const wb: XLSX.WorkBook = XLSX.utils.book_new()

    //fetch country alert data
    this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId)
      // .do(alertList => {
      //   alertList.forEach(alert => {
      //     if (alert.otherName) {
      //       this.af.database.object(Constants.APP_STATUS + "/hazardOther/"+alert.otherName)
      //         .first()
      //         .subscribe(obj => alert.otherName = obj.name)
      //     }
      //   })
      // })
      .first()
      .subscribe(alertList => {
        let alerts = alertList.map(alert => {
          let obj = {}
          obj["Date Raised"] = moment(alert.timeCreated).format("DD/MM/YYYY")
          obj["Alert level"] = Constants.ALERT_LEVEL_STRING[alert.alertLevel]
          if (alert.hazardScenario != -1) {
            obj["Hazard"] = Constants.HAZARD_SCENARIOS_STRING[alert.hazardScenario]
          } else {
            obj["Hazard"] = alert.otherName
          }
          obj["Population affected"] = alert.estimatedPopulation
          obj["Affected areas"] = "uk, france, kenya, need update"
          obj["Information sources"] = alert.infoNotes
          obj["Duration"] = "need more info"
          return obj
        })

        const alertSheet = XLSX.utils.json_to_sheet(alerts)
        XLSX.utils.book_append_sheet(wb, alertSheet, "Alerts")

        counter++
        this.exportFile(counter, total, wb)

      })

    //fetch response plan data
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + countryId)
      .first()
      .subscribe(planList => {
        let plans = planList.map(plan => {
          let obj = {}
          obj["name"] = plan["name"]
          obj["hazardScenario"] = plan["hazardScenario"]
          obj["status"] = plan["status"]
          obj["sectionsCompleted"] = plan["sectionsCompleted"]
          obj["timeUpdated"] = plan["timeUpdated"]
          return obj
        })

        const planSheet = XLSX.utils.json_to_sheet(plans);
        XLSX.utils.book_append_sheet(wb, planSheet, "Response Plans")

        counter++

        this.exportFile(counter, total, wb)
      })

    //fetch preparedness actions data
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

  }

  private exportFile(counter, total, wb) {
    if (counter == total) {
      //try export see if works
      XLSX.writeFile(wb, 'SheetJS.xlsx')
    }
  }

  public mapCustomHazardAlertForCountry(countryId) {
    return this.af.database.list(Constants.APP_STATUS + "/alert/" + countryId, {
      query: {
        orderByChild: "hazardScenario",
        equalTo: -1
      }
    })
      .map(customAlerts =>{
        let totalCustomAlerts = customAlerts.length()
        let customNameMap = new Map<string, string>()
        let customCounter = 0
        console.log(totalCustomAlerts)
        customAlerts.forEach(alert => {
          this.af.database.object(Constants.APP_STATUS + "/hazardOther/"+alert.otherName)
            .first()
            .subscribe(obj => {
              console.log(obj.name)
              customNameMap.set(alert.$key, obj.name)
              customCounter++

              if (totalCustomAlerts === customCounter) {
                return customNameMap
              }
            })

        })
      })
  }

}
