import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Frequency} from "../../../utils/Frequency";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
import {DurationType} from "../../../utils/Enums";

@Component({
  selector: 'app-clock-settings',
  templateUrl: './clock-settings.component.html',
  styleUrls: ['./clock-settings.component.css']
})

export class ClockSettingsComponent implements OnInit, OnDestroy {

  private uid: string = "";
  private settings: any[] = [];
  private saved: boolean = false;
  private agencyId: string;

  private alertMessage: string = "";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private riskMonitorShowLogForFreq: Frequency = new Frequency({value: -1, type: -1});
  private riskMonitorHazardFreq: Frequency = new Frequency({value: -1, type: -1});
  private preparednessFreq: Frequency = new Frequency({value: -1, type: -1});
  private responsePlansFreq: Frequency = new Frequency({value: -1, type: -1});

  DURATION_TYPE = Constants.DURATION_TYPE;
  DURATION_TYPE_SELECTION = Constants.DURATION_TYPE_SELECTION;
  private durationMap = new Map();

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
    let durationsListW = Constants.DURATION_LIST_WEEK;
    let durationsListM = Constants.DURATION_LIST_MONTH;
    let durationsListY = Constants.DURATION_LIST_YEAR;

    this.durationMap.set(DurationType.Week, durationsListW);
    this.durationMap.set(DurationType.Month, durationsListM);
    this.durationMap.set(DurationType.Year, durationsListY);
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + this.uid + "/agencyId")
        .takeUntil(this.ngUnsubscribe)
        .subscribe(id => {
          this.agencyId = id.$value;
          this.af.database.list(Constants.APP_STATUS + '/agency/' + this.agencyId + '/clockSettings/')
            .takeUntil(this.ngUnsubscribe)
            .subscribe(_ => {
              _.map(setting => {
                let settingKey = setting.$key;
                delete setting.$key;
                delete setting.$exists;
                this.settings[settingKey] = setting;
              });

              this.riskMonitorShowLogForFreq = new Frequency(this.settings['riskMonitoring']['showLogsFrom']);
              this.riskMonitorHazardFreq = new Frequency(this.settings['riskMonitoring']['hazardsValidFor']);
              this.preparednessFreq = new Frequency(this.settings['preparedness']);
              this.responsePlansFreq = new Frequency(this.settings['responsePlans']);
            });
        });
    });
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

  convertToNumber(value): number {
    return Number(value);
  }

  validateShowLogsFromValue() {
    if (this.riskMonitorShowLogForFreq.type == DurationType.Month && this.riskMonitorShowLogForFreq.value > Constants.MONTH_MAX_NUMBER) {
      this.riskMonitorShowLogForFreq.value = Constants.MONTH_MAX_NUMBER;
    } else if (this.riskMonitorShowLogForFreq.type == DurationType.Year && this.riskMonitorShowLogForFreq.value > Constants.YEAR_MAX_NUMBER) {
      this.riskMonitorShowLogForFreq.value = Constants.YEAR_MAX_NUMBER;
    }
  }

  validateHazardsValidForValue() {
    if (this.riskMonitorHazardFreq.type == DurationType.Month && this.riskMonitorHazardFreq.value > Constants.MONTH_MAX_NUMBER) {
      this.riskMonitorHazardFreq.value = Constants.MONTH_MAX_NUMBER;
    } else if (this.riskMonitorHazardFreq.type == DurationType.Year && this.riskMonitorHazardFreq.value > Constants.YEAR_MAX_NUMBER) {
      this.riskMonitorHazardFreq.value = Constants.YEAR_MAX_NUMBER;
    }
  }

  validatePreparednessValue() {
    if (this.preparednessFreq.type == DurationType.Month && this.preparednessFreq.value > Constants.MONTH_MAX_NUMBER) {
      this.preparednessFreq.value = Constants.MONTH_MAX_NUMBER;
    } else if (this.preparednessFreq.type == DurationType.Year && this.preparednessFreq.value > Constants.YEAR_MAX_NUMBER) {
      this.preparednessFreq.value = Constants.YEAR_MAX_NUMBER;
    }
  }

  validateResponsePlansValue() {
    if (this.responsePlansFreq.type == DurationType.Month && this.responsePlansFreq.value > Constants.MONTH_MAX_NUMBER) {
      this.responsePlansFreq.value = Constants.MONTH_MAX_NUMBER;
    } else if (this.responsePlansFreq.type == DurationType.Year && this.responsePlansFreq.value > Constants.YEAR_MAX_NUMBER) {
      this.responsePlansFreq.value = Constants.YEAR_MAX_NUMBER;
    }
  }

  ngOnDestroy() {
    try {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    } catch (e) {
      console.log('Unable to releaseAll');
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private cancelChanges() {
    this.ngOnInit();
  }

  private saveChanges() {

    this.settings['riskMonitoring']['showLogsFrom']['value'] = this.riskMonitorShowLogForFreq.value;
    this.settings['riskMonitoring']['showLogsFrom']['durationType'] = this.riskMonitorShowLogForFreq.type;

    this.settings['riskMonitoring']['hazardsValidFor']['value'] = this.riskMonitorHazardFreq.value;
    this.settings['riskMonitoring']['hazardsValidFor']['durationType'] = this.riskMonitorHazardFreq.type;

    this.settings['responsePlans']['value'] = this.responsePlansFreq.value;
    this.settings['responsePlans']['durationType'] = this.responsePlansFreq.type;

    this.settings['preparedness']['value'] = this.preparednessFreq.value;
    this.settings['preparedness']['durationType'] = this.preparednessFreq.type;

    this.updateCountriesClockSettings();

    this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId + '/clockSettings/')
      .set(this.settings)
      .then(_ => {
        if (!this.alertShow) {
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.SAVE_SUCCESS_CLOCK_SETTINGS";
        }
      })
      .catch(err => {
        console.log(err, 'Error occurred!');
        this.alertSuccess = false;
        this.alertShow = true;
        this.alertMessage = "Error occurred!";
      });
  }

  private updateCountriesClockSettings() {
    this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(_ => {
        _.map(setting => {
          if ('clockSettings' in setting) {
            let clockSettings: any = setting['clockSettings'];
            let update: boolean = false;

            if (this.riskMonitorShowLogForFreq.gt(new Frequency(clockSettings['riskMonitoring']['showLogsFrom']))) {
              update = true;
              clockSettings['riskMonitoring']['showLogsFrom']['value'] = this.riskMonitorShowLogForFreq.value;
              clockSettings['riskMonitoring']['showLogsFrom']['durationType'] = this.riskMonitorShowLogForFreq.type;
            }

            if (this.riskMonitorHazardFreq.gt(new Frequency(clockSettings['riskMonitoring']['hazardsValidFor']))) {
              update = true;
              clockSettings['riskMonitoring']['hazardsValidFor']['value'] = this.riskMonitorHazardFreq.value;
              clockSettings['riskMonitoring']['hazardsValidFor']['durationType'] = this.riskMonitorHazardFreq.type;
            }

            if (this.preparednessFreq.gt(new Frequency(clockSettings['preparedness']))) {
              update = true;
              clockSettings['preparedness']['value'] = this.preparednessFreq.value;
              clockSettings['preparedness']['durationType'] = this.preparednessFreq.type;
            }

            if (this.responsePlansFreq.gt(new Frequency(clockSettings['responsePlans']))) {
              update = true;
              clockSettings['responsePlans']['value'] = this.responsePlansFreq.value;
              clockSettings['responsePlans']['durationType'] = this.responsePlansFreq.type;
            }

            if (update) {
              this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyId + '/' + setting.$key + '/clockSettings/')
                .set(clockSettings)
                .catch(err => console.log(err, 'Error occurred!'));
            }
          }
        });
      });
  }

}
