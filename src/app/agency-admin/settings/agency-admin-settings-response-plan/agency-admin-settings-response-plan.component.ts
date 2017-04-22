import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from 'rxjs';
import {RxHelper} from '../../../utils/RxHelper';

@Component({
  selector: 'app-agency-admin-settings-response-plan',
  templateUrl: './agency-admin-settings-response-plan.component.html',
  styleUrls: ['./agency-admin-settings-response-plan.component.css']
})
export class AgencyAdminSettingsResponsePlanComponent implements OnInit, OnDestroy {
	private subscriptions: RxHelper;

	constructor(private af: AngularFire, private router: Router) {
	this.subscriptions = new RxHelper;
	}

	ngOnInit() {
		let subscription = this.af.auth.subscribe(auth => {
			if (auth) {
			//       // this.uid = auth.uid; //TODO remove comment
			//       this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/agency/' + this.uid + '/clockSettings/').subscribe(_ => {
			//       	_.map(setting => {
			//       		this.settings[setting.$key] = setting;
			//       	});

			//       	this.riskMonitorShowLogForFreq = new Frequency(this.settings['riskMonitoring']['showLogsFrom']);
			//       	this.riskMonitorHazardFreq = new Frequency(this.settings['riskMonitoring']['hazardsValidFor']);
			//       	this.preparednessFreq = new Frequency(this.settings['preparedness']);
			//       	this.responsePlansFreq = new Frequency(this.settings['responsePlans']);

			//       }));

			// this.subscriptions.add(subscription);
			} else {
				// user is not logged in
				console.log('Error occurred - User is not logged in');
				this.navigateToLogin();
			}
		});
	}

	ngOnDestroy() {
	try{
			this.subscriptions.releaseAll();
		} catch(e){
			console.log('Unable to releaseAll');
		}
	}

	private navigateToLogin() {
		this.router.navigateByUrl(Constants.LOGIN_PATH);
	}

	private cancelChanges() {
		this.ngOnInit();
	}

	private saveChanges(){
	}

}
