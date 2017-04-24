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
	RESPONSE_PLANS_SECTION_SETTINGS = Constants.RESPONSE_PLANS_SECTION_SETTINGS;

	private subscriptions: RxHelper;
	private uid: string = "qbyONHp4xqZy2eUw0kQHU7BAcov1";//TODO remove hard coded agency ID

	private sections: any[] = [];
	private approvals: any[] = [];
	private saved: boolean = false;
	private alertMessage: string = "Success message";
	private alertSuccess: boolean = true;
	private alertShow: boolean = false;

	constructor(private af: AngularFire, private router: Router) {
		this.subscriptions = new RxHelper;
	}

	ngOnInit() {
		let subscription = this.af.auth.subscribe(auth => {
			if (auth) {
				// this.uid = auth.uid; //TODO remove comment
				this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/agency/' + this.uid + '/responsePlanSettings/sections').subscribe(_ => {
					_.map(section => {
						this.sections[section.$key] = section;
					});
				}));

				this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/agency/' + this.uid + '/responsePlanSettings/approvalHierachy').subscribe(_ => {
					_.map(approval => {
						this.approvals[approval.$key] = approval;
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

	private changeStatus(sectionId, status) {
		this.sections[sectionId].$value = status;
	}

	private changeApproval(approvalId, status) {
		this.approvals[approvalId].$value = status;
	}

	private cancelChanges() {
		this.alertShow = true;
	  this.ngOnInit();
	}

	private saveChanges(){
		var sectionItems = {};
		var sections = this.sections.map((section, index) => {
	  		
	  		sectionItems[index] = this.sections[index].$value;
	  		
	  		return this.sections[index];
	  	});

	  	this.af.database.object(Constants.APP_STATUS+'/agency/' + this.uid + '/responsePlanSettings/sections')
	  	.set(sectionItems)
	  	.then(_ => this.saved = true)
	  	.catch(err => console.log(err, 'You do not have access!'));

	  	var approvalItems = {};
		var approvals = this.approvals.map((approval, index) => {
	  		
	  		approvalItems[index] = this.approvals[index].$value;
	  		
	  		return this.approvals[index];
	  	});

	  	this.af.database.object(Constants.APP_STATUS+'/agency/' + this.uid + '/responsePlanSettings/approvalHierachy')
	  	.set(approvalItems)
	  	.then(_ => this.saved = true)
	  	.catch(err => console.log(err, 'You do not have access!'));
	}

}
