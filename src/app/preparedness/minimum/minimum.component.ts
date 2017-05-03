import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel, ActionStatus} from "../../utils/Enums";
import {Observable} from 'rxjs';
import {RxHelper} from '../../utils/RxHelper';
import {Frequency} from "../../utils/Frequency";
import * as firebase from 'firebase';

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
	private uid: string = "qbyONHp4xqZy2eUw0kQHU7BAcov1";
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
							if (typeof actions[action] !== 'object')
								return;

							actions[action].agencyId = agencyId;
							actions[action].key = action;
							actions[action].docsCount = 0;
							let userKey = actions[action].assignee;
							try {
								actions[action].docsCount = Object.keys(actions[action].documents).length;
							} catch(e){
								console.log('No docs');
							}
							

							this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/userPublic/' + userKey).subscribe(_ => {
								if (_.$exists()){
									console.log(_);
									this.users[userKey] = _.firstName + " " + _.lastName;
									actions[action].assigned = true;
								}
								else{
									this.users[userKey] = "Unassigned";//TODO translate somehow
									actions[action].assigned = false;
								}

							}));							

							this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/note/' + action, {
								query: {
									orderByChild: "time"
								}
							}).subscribe(_ => {
								actions[action].notesCount = _.length;
								actions[action].notes = _;
								actions[action].notes.map(note => {
									let uploadByUser = note.uploadBy;
									console.log(note);
									this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/userPublic/' + uploadByUser).subscribe(_ => {
										if (_.$exists()){
											note.uploadByUser = _.firstName + " " + _.lastName;
										}
										else{
											note.uploadByUser = "N/A";
										}

										return note;
									}));
								});
								
							}));

							if (actions[action].level == ActionLevel.MPA){
								this.actions.push(actions[action]);
							}
						});
					});
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

	private addNote(action){

		let note = {
			content: action.note,
			time: firebase.database.ServerValue.TIMESTAMP,
			uploadBy: this.uid
		};

		action.note = "";

		this.af.database.list(Constants.APP_STATUS+'/note/' + action.key).push(note);
	}

	private editNote(note, action){

	}

	private deleteNote(note, action){
		this.af.database.list(Constants.APP_STATUS+'/note/' + action.key + '/' + note.$key).remove();
	}

}
