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

  DURATION_TYPE = Constants.DURATION_TYPE;
  DURATION_TYPE_SELECTION = Constants.DURATION_TYPE_SELECTION;
  private uid: string = "";
  private settings: any[] = [];
  private saved: boolean = false;

  private alertMessage: string = "";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private riskMonitorShowLogForFreq: Frequency = new Frequency({value: -1, type: -1});
  private riskMonitorHazardFreq: Frequency = new Frequency({value: -1, type: -1});
  private preparednessFreq: Frequency = new Frequency({value: -1, type: -1});
  private responsePlansFreq: Frequency = new Frequency({value: -1, type: -1});

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private durationMap = new Map();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
    let durationsListW = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
      51];

    let durationsListM = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11];

    let durationsListY = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ];

    this.durationMap.set(DurationType.Week, durationsListW);
    this.durationMap.set(DurationType.Month, durationsListM);
    this.durationMap.set(DurationType.Year, durationsListY);
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.af.database.list(Constants.APP_STATUS + '/agency/' + this.uid + '/clockSettings/')
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

    this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/clockSettings/')
      .set(this.settings)
      .then(_ => {
        if (!this.alertShow) {
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.SAVE_SUCCESS_CLOCK_SETTINGS";
        }
        // try {
        //   this.countryOfficesSubscriptions.releaseAll();
        // } catch (e) {
        //   console.log('Unable to releaseAll');
        // }
      })
      .catch(err => {
        console.log(err, 'Error occurred!');
        this.alertSuccess = false;
        this.alertShow = true;
        this.alertMessage = "Error occurred!"
        // try {
        //   this.countryOfficesSubscriptions.releaseAll();
        // } catch (e) {
        //   console.log('Unable to releaseAll');
        // }

      });

  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

  private updateCountriesClockSettings() {
    this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.uid)
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
              this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.uid + '/' + setting.$key + '/clockSettings/')
                .set(clockSettings)
                .catch(err => console.log(err, 'Error occurred!'));
            }
          }
        });
      });
  }

  convertToNumber(value):number {
    return Number(value);
  }


}
