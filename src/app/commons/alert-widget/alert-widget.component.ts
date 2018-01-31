import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {Constants} from "../../utils/Constants";
import {RxHelper} from '../../utils/RxHelper';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {ActionType, ActionLevel, ActionStatus, SizeType, DocumentType, ThresholdName} from "../../utils/Enums";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {HazardImages} from "../../utils/HazardImages";
import {PageControlService} from "../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-alert-widget',
  templateUrl: './alert-widget.component.html',
  styleUrls: ['./alert-widget.component.css']
})
export class AlertWidgetComponent implements OnInit {

	@Input() countryId: string;
	@Input() isLocalAgency: boolean;
	private RedAlertStatus = ThresholdName.Red;
	private AmberAlertStatus = ThresholdName.Amber;
	private alertLevels = Constants.ALERTS;
	private hazardScenarios = Constants.HAZARD_SCENARIOS;

	private alerts: any[] = [];

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(private pageControl: PageControlService, private route: ActivatedRoute, private router: Router, private af: AngularFire, private sanitizer: DomSanitizer) {
	}

	ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      if(this.isLocalAgency){
        this.af.database.list(Constants.APP_STATUS + '/alert/' + agencyId).takeUntil(this.ngUnsubscribe).subscribe(alerts => {
          this.alerts = alerts.map(alert => {
            console.log(alert.alertLevel);
            console.log(ThresholdName.Red);
            if (alert.alertLevel == ThresholdName.Red || alert.alertLevel == ThresholdName.Amber) {
              return alert;
            }
          });
        });
      }else{
        this.af.database.list(Constants.APP_STATUS + '/alert/' + this.countryId).takeUntil(this.ngUnsubscribe).subscribe(alerts => {
          this.alerts = alerts.map(alert => {
            console.log(alert.alertLevel);
            console.log(ThresholdName.Red);
            if (alert.alertLevel == ThresholdName.Red || alert.alertLevel == ThresholdName.Amber) {
              return alert;
            }
          });
        });
      }
    });
	}

	ngOnDestroy() {
	  this.ngUnsubscribe.next();
	  this.ngUnsubscribe.complete();
	}

	public getCSSHazard(hazard: number) {
	    return HazardImages.init().getCSS(hazard);
	  }

}
