import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel, ActionStatus} from "../../utils/Enums";
import {Observable} from 'rxjs';
import {RxHelper} from '../../utils/RxHelper';
import {Frequency} from "../../utils/Frequency";

@Component({
  selector: 'app-minimum',
  templateUrl: './minimum.component.html',
  styleUrls: ['./minimum.component.css']
})
export class MinimumPreparednessComponent implements OnInit, OnDestroy {

	ACTION_STATUS = Constants.ACTION_STATUS;
	ACTION_LEVEL = Constants.ACTION_LEVEL;
	ACTION_TYPE = Constants.ACTION_TYPE;
	private subscriptions: RxHelper;
	private uid: string = "";
	private actions: any[] = [];
	private users: any[] = [];
	private actionStatus = ActionStatus;

	constructor(private af: AngularFire, private router: Router) {
		this.subscriptions = new RxHelper;
	}

	ngOnInit() {
		let subscription = this.af.auth.subscribe(auth => {
			if (auth) {
				this.uid = auth.uid;
				this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/action/').subscribe(_ => {
					this.actions = [];
					_.map(actions => {
						let agencyId = actions.$key
						Object.keys(actions).map(action => {
							actions[action].key = action;
							let userKey = actions[action].assignee;
							this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/userPublic/' + userKey).subscribe(_ => {
								this.users[userKey] = _.firstName + " " + _.lastName;
							}));

							if (actions[action].level == ActionLevel.MPA){
								this.actions.push(actions[action]);
							}
						});
					});
				}));

				console.log(this.actions.length);

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
