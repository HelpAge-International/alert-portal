import {Component, OnDestroy, OnInit} from '@angular/core';
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
  private infoNotes: string;
  private estimatedPopulation: number;

  private HAZARDS:string[] = Constants.HAZARD_SCENARIOS;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private alertId: string;
  private countryId: string;
  private loadedAlert: ModelAlert;

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
        console.log(this.loadedAlert);
        this.estimatedPopulation = this.loadedAlert.estimatedPopulation;
        this.infoNotes = this.loadedAlert.infoNotes;
      });
  }

  addNewArea() {
    let area:ModelAffectedArea = new ModelAffectedArea();
    this.loadedAlert.affectedAreas.push(area);
  }

  removeArea() {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.alertService.unSubscribeNow();
  }

}
