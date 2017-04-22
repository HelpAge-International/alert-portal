import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from 'rxjs';
import {RxHelper} from '../../../utils/RxHelper';
import {Frequency} from "../../../utils/Frequency";

@Component({
  selector: 'app-clock-settings',
  templateUrl: './clock-settings.component.html',
  styleUrls: ['./clock-settings.component.css']
})
export class ClockSettingsComponent implements OnInit, OnDestroy {

  DURATION_TYPE = Constants.DURATION_TYPE;
  DURATION_TYPE_SELECTION = Constants.DURATION_TYPE_SELECTION;
  private durations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  private uid: string = "qbyONHp4xqZy2eUw0kQHU7BAcov1";//TODO remove hard coded agency ID
  private subscriptions: RxHelper;
  private countryOfficesSubscriptions: RxHelper;
  private settings: any[] = [];
  private saved: boolean = false;

  private riskMonitorShowLogForFreq: Frequency = new Frequency({value: -1, type: -1});
  private riskMonitorHazardFreq: Frequency = new Frequency({value: -1, type: -1});
  private preparednessFreq: Frequency = new Frequency({value: -1, type: -1});
  private responsePlansFreq: Frequency = new Frequency({value: -1, type: -1});

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper;
    this.countryOfficesSubscriptions = new RxHelper;
  }

  ngOnInit() {
  	let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        // this.uid = auth.uid; //TODO remove comment
        this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/agency/' + this.uid + '/clockSettings/').subscribe(_ => {
        	_.map(setting => {
        		this.settings[setting.$key] = setting;
        	});

        	this.riskMonitorShowLogForFreq = new Frequency(this.settings['riskMonitoring']['showLogsFrom']);
        	this.riskMonitorHazardFreq = new Frequency(this.settings['riskMonitoring']['hazardsValidFor']);
        	this.preparednessFreq = new Frequency(this.settings['preparedness']);
        	this.responsePlansFreq = new Frequency(this.settings['responsePlans']);

        }));

		this.subscriptions.add(subscription);
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
  	
  	this.settings['riskMonitoring']['showLogsFrom']['value'] = this.riskMonitorShowLogForFreq.value;
	this.settings['riskMonitoring']['showLogsFrom']['durationType'] = this.riskMonitorShowLogForFreq.type;

	this.settings['riskMonitoring']['hazardsValidFor']['value'] = this.riskMonitorHazardFreq.value;
	this.settings['riskMonitoring']['hazardsValidFor']['durationType'] = this.riskMonitorHazardFreq.type;

	this.settings['responsePlans']['value'] = this.responsePlansFreq.value;
	this.settings['responsePlans']['durationType'] = this.responsePlansFreq.type;

	this.settings['preparedness']['value'] = this.preparednessFreq.value;
	this.settings['preparedness']['durationType'] = this.preparednessFreq.type;

	this.updateCountriesClockSettings();

  	this.af.database.object(Constants.APP_STATUS+'/agency/' + this.uid + '/clockSettings/')
  	.set(this.settings)
  	.then(_ => {
  		this.saved = true;
  		try{
	  		this.countryOfficesSubscriptions.releaseAll();
	  	} catch(e){
	  		console.log('Unable to releaseAll');
	  	}
  	})
  	.catch(err => {
  		console.log(err, 'Error occurred!');
  		try{
	  		this.countryOfficesSubscriptions.releaseAll();
	  	} catch(e){
	  		console.log('Unable to releaseAll');
	  	}
  		
  	});
  	
  }

  private updateCountriesClockSettings() {
	this.countryOfficesSubscriptions.add(this.af.database.list(Constants.APP_STATUS+'/countryOffice/' + this.uid).subscribe(_ => {
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

    			if (update)
    			{
    				this.af.database.object(Constants.APP_STATUS+'/countryOffice/' + this.uid + '/' + setting.$key + '/clockSettings/')
				  	.set(clockSettings)
				  	.catch(err => console.log(err, 'Error occurred!'));
    			}		
    		}
    	});
    }));
  }


}
