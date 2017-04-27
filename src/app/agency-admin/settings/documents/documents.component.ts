import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from 'rxjs';
import {RxHelper} from '../../../utils/RxHelper';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit, OnDestroy {
	MODULE_NAME = Constants.MODULE_NAME;
	DOCUMENT_TYPE = Constants.DOCUMENT_TYPE;
	private uid: string = "qbyONHp4xqZy2eUw0kQHU7BAcov1";//TODO remove hard coded agency ID
	private subscriptions: RxHelper;
	private exporting: boolean = false;

	private alertMessage: string = "Message";
	private alertSuccess: boolean = true;
	private alertShow: boolean = false;  	

	private countries: any[] = [];

	constructor(private af: AngularFire, private router: Router) {
		this.subscriptions = new RxHelper;
	}

	ngOnInit() {
		let subscription = this.af.auth.subscribe(auth => {
			if (auth) {
			      // this.uid = auth.uid; //TODO remove comment
			      this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/countryOffice/' + this.uid).subscribe(_ => {
			      	this.countries = _;
			      	Object.keys(this.countries).map(country => {
			      		let key = this.countries[country].$key;
			      		
						this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/document/' + key).subscribe(_ => {
							let docs = _;
							Object.keys(docs).map(doc => {
								let uploadedBy = docs[doc].uploadedBy;
								this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/userPublic/' + uploadedBy).subscribe(_ => {
									docs[doc]['uploadedBy'] = _.firstName + " " + _.lastName;
								}));
							});
							this.countries[country]['docs'] = docs;
						}));
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

	private cancelChanges() {
		this.ngOnInit();
	}

	private saveChanges(){
	}

	onAlertHidden(hidden: boolean) {
		this.alertShow = !hidden;
		this.alertSuccess = true;
		this.alertMessage = "";
	}

	private cancelExportDocuments() {
		this.exporting = !this.exporting;
	}

	private selectDocuments() {
		this.exporting = !this.exporting;
	}

	private exportSelectedDocuments() {
		this.exporting = !this.exporting;	
	}

	private countryDocsSelected(countryId, target) {
		let id = target.id;
  //   	$("." + id).prop("checked", this.checked);
	}
}
