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
	private uid: string = "C1T4Mx2gZFTFSq8CTxSEsyJDr2j2"; // Country Admin TODO remove
	private actions: any[] = [];
	private users: any[] = [];
	private assignedToUsers: any[] = [];
	private departments: any[] = [];
	private countryId = null;
	private actionStatus = ActionStatus;
	private ActionStatusEnum = Object.keys(ActionStatus).map(k => ActionStatus[k]).filter(v => typeof v === "string") as string[];
	private ActionTypeEnum = Object.keys(ActionType).map(k => ActionType[k]).filter(v => typeof v === "string") as string[];

	private statusSelected = "-1";
	private departmentSelected = "-1";
	private typeSelected = "-1";
	private userSelected = "-1";
	private agencyNetworkSelected = "-1";
	private assignedToUser = "me";
	private assignedToUserKey;
	private assignedToAnyone = false;

	private allArchived = false;

	constructor(private af: AngularFire, private router: Router) {
		this.subscriptions = new RxHelper;
	}

	ngOnInit() {
		let subscription = this.af.auth.subscribe(auth => {
			if (auth) {
				//this.uid = auth.uid; TODO remove comment
				this.assignedToUserKey = this.uid;
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
									this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/userPublic/' + uploadByUser).subscribe(_ => {
										if (_.$exists()){
											note.uploadByUser = _.firstName + " " + _.lastName;
										}
										else{
											note.uploadByUser = "N/A";
										}
									}));

									return note;
								});
								
							}));

							

							if (actions[action].level == ActionLevel.MPA){
								this.actions.push(actions[action]);
							}
						});
					});
				}));

				this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/agency/' + this.uid + '/departments').subscribe(_ => {
					if (_.$exists()){
						//console.log(_);
						this.departments = Object.keys(_);
					}
					else{
						this.departments = [];	
					}

				}));

				this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/administratorCountry/' + this.uid + '/countryId').subscribe(country => {
					if (country.$exists()) {
						this.countryId = country.$value
console.log(this.countryId);
						this.assignedToUsers = [];
						this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/staff/' + this.countryId).subscribe(staff => {
							this.assignedToUsers = staff.map(member => {
								let userId = member.$key;
								this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/userPublic/' + userId).subscribe(_ => {
									if (_.$exists()){
										member.fullName = _.firstName + " " + _.lastName;
									}
									else{
										member.fullName = "";
									}
								}));

								return member;
							});
						
						}));
					}
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

	private filter() {
		if (this.userSelected == "-1"){
			this.assignedToUser = "me";
			this.assignedToUserKey = this.uid;
			this.assignedToAnyone = false;
		} else if (this.userSelected == "0"){
			this.assignedToUser = "Anyone";
			this.assignedToAnyone = true;
		} else {
			let users = this.assignedToUsers.filter(user => {
				return user.$key == this.userSelected
			});

			if (users.length > 0){
				this.assignedToUser = users[0].fullName;
				this.assignedToUserKey = users[0].$key;
				this.assignedToAnyone = false;
			}

		}
		// console.log(this.statusSelected);
		// console.log(this.departmentSelected);
		// console.log(this.typeSelected);
		// console.log(this.userSelected);
		// console.log(this.agencyNetworkSelected);
	}

	private showAllArchived(show){
		this.allArchived = show;
		console.log(this.allArchived);
	}

}
