import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {Constants} from "../../utils/Constants";
import {RxHelper} from '../../utils/RxHelper';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {ActionType, ActionLevel, ActionStatus, SizeType, DocumentType, ThresholdName} from "../../utils/Enums";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {HazardImages} from "../../utils/HazardImages";

@Component({
  selector: 'app-alert-widget',
  templateUrl: './alert-widget.component.html',
  styleUrls: ['./alert-widget.component.css']
})
export class AlertWidgetComponent implements OnInit {

	@Input() countryId: string;
	private subscriptions: RxHelper;
	private RedAlertStatus = ThresholdName.Red;
	private AmberAlertStatus = ThresholdName.Amber;
	private alertLevels = Constants.ALERTS;
	private hazardScenarios = Constants.HAZARD_SCENARIOS;

	private alerts: any[] = [];

	constructor(private af: AngularFire, private sanitizer: DomSanitizer) {
		this.subscriptions = new RxHelper;
	}

	ngOnInit() {
		this.subscriptions.add(this.af.database.list(Constants.APP_STATUS + '/alert/' + this.countryId).subscribe(alerts => {
			this.alerts = alerts.map (alert => {
				console.log(alert.alertLevel);
				console.log(ThresholdName.Red);
				if (alert.alertLevel == ThresholdName.Red || alert.alertLevel == ThresholdName.Amber){
					return alert;
				}
			});			

        }));
	}

	ngOnDestroy() {
		try{
			this.subscriptions.releaseAll();
		} catch(e){
			console.log('Unable to releaseAll');
		}
	}

	public getCSSHazard(hazard: number) {
	    return HazardImages.init().getCSS(hazard);
	  }

}
