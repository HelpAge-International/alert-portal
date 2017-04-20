import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from 'rxjs';
import {RxHelper} from '../../../utils/RxHelper';
import {Duration} from "../../../utils/Enums";

@Component({
  selector: 'app-clock-settings',
  templateUrl: './clock-settings.component.html',
  styleUrls: ['./clock-settings.component.css']
})
export class ClockSettingsComponent implements OnInit, OnDestroy {

  DURATION_TYPE = Constants.DURATION_TYPE;
  DURATION_TYPE_SELECTION = Constants.DURATION_TYPE_SELECTION;
  private durations = Object.keys(Duration);

  private uid: string = "qbyONHp4xqZy2eUw0kQHU7BAcov1";//TODO remove hard coded agency ID
  private subscriptions: RxHelper;
  private settings: any[] = [];
  private saved: boolean = false;
  private riskMonitorInitialDurationType: number = 0;
  private riskMonitorHazardDurationType: number = 0;
  private preparednessDurationType: number = 0;
  private responsePlansDurationType: number = 0;

  private riskMonitorInitialDuration: number = Duration._3;
  private riskMonitorHazardDuration: number = Duration._3;
  private preparednessDuration: number = Duration._3;
  private responsePlansDuration: number = Duration._3;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper;
  }

  ngOnInit() {
  	let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        // this.uid = auth.uid; //TODO remove comment
        let skillsSubscription = this.af.database.list(Constants.APP_STATUS+'/agency/' + this.uid + '/clockSettings/').subscribe(_ => {
        	this.settings = _;
        	_.map(setting => {
        		console.log(setting);
        	});
        });

        this.subscriptions.add(skillsSubscription);
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


}
