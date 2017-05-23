import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Subject} from "rxjs/Subject";
import {ActionsService} from "../../services/actions.service";
import {ModelAlert} from "../../model/alert.model";
import {ModelAffectedArea} from "../../model/affectedArea.model";

@Component({
  selector: 'app-dashboard-update-alert-level',
  templateUrl: './dashboard-update-alert-level.component.html',
  styleUrls: ['./dashboard-update-alert-level.component.css'],
  providers: [ActionsService]
})
export class DashboardUpdateAlertLevelComponent implements OnInit, OnDestroy {

  private HAZARDS: string[] = Constants.HAZARD_SCENARIOS;
  private COUNTRIES: string[] = Constants.COUNTRIES;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private uid: string;
  private alertId: string;
  private countryId: string;
  private loadedAlert: ModelAlert;
  private reasonForRedAlert: string;
  private infoNotes: string;
  private estimatedPopulation: number;
  private geoMap = new Map();
  private temp = [];

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute, private alertService: ActionsService) {
  }

  ngOnInit() {
    this.af.auth
      .takeUntil(this.ngUnsubscribe)
      .subscribe(auth => {
        if (auth) {
          this.uid = auth.uid;
          this.route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe((param: Params) => {
              if (param['id']) {
                this.alertId = param['id'];
                this.countryId = param['countryId'];
                this.loadAlert(this.alertId, this.countryId);
              }
            })
        } else {
          this.router.navigateByUrl(Constants.LOGIN_PATH);
        }
      });
  }

  private loadAlert(alertId: string, countryId: string) {

    this.alertService.getAlert(alertId, countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((alert: ModelAlert) => {
        this.loadedAlert = alert;
        this.estimatedPopulation = this.loadedAlert.estimatedPopulation;
        this.infoNotes = this.loadedAlert.infoNotes;
        this.reasonForRedAlert = this.loadedAlert.reasonForRedAlert;

        this.loadedAlert.affectedAreas.forEach(area => {
          this.alertService.getAllLevelInfo(area.affectedCountry)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(geoInfo => {
              this.geoMap.set(area.affectedCountry, geoInfo);
            });
        });
      });
  }

  addNewArea() {
    let area: ModelAffectedArea = new ModelAffectedArea();
    this.loadedAlert.affectedAreas.push(area);
  }

  removeArea(index) {
    console.log(index);
    let temp: ModelAffectedArea[] = [];
    for (let i = 0; i < this.loadedAlert.affectedAreas.length; i++) {
      if (i != index) {
        temp.push(this.loadedAlert.affectedAreas[i]);
      }
    }
    this.loadedAlert.affectedAreas = temp;
  }

  selectedAlertLevel(selection) {
    this.loadedAlert.alertLevel = selection;
  }

  changeCountry(index, value) {
    console.log(index)
    console.log(this.COUNTRIES.indexOf(value));
    this.loadedAlert.affectedAreas[index].affectedCountry = this.COUNTRIES.indexOf(value);
  }

  changeLevel1(index, value) {
    console.log(index)
    console.log(value)
    this.loadedAlert.affectedAreas[index].affectedLevel1 = Number(value);
  }

  changeLevel2(index, value) {
    console.log(index)
    console.log(value)
    this.loadedAlert.affectedAreas[index].affectedLevel2 = Number(value);
  }

  submit() {
    this.loadedAlert.estimatedPopulation = this.estimatedPopulation;
    this.loadedAlert.reasonForRedAlert = this.reasonForRedAlert;
    this.loadedAlert.infoNotes = this.infoNotes;
    this.loadedAlert.timeUpdated = Date.now();
    console.log(this.loadedAlert)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.alertService.unSubscribeNow();
  }

}
