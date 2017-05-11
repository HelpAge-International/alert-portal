import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Countries, DocumentType, SizeType} from "../../../utils/Enums";
import {Observable, Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RxHelper} from '../../../utils/RxHelper';
declare var jQuery: any;

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit, OnDestroy {
	DOCUMENT_TYPE = Constants.DOCUMENT_TYPE;
	COUNTRIES = Constants.COUNTRIES;
	private CountriesEnum = Object.keys(Countries).map(k => Countries[k]).filter(v => typeof v === "string") as string[];
	private DocTypeEnum = Object.keys(DocumentType).map(k => DocumentType[k]).filter(v => typeof v === "string") as string[];
	private uid: string;
	private subscriptions: RxHelper;
	private exporting: boolean = false;

	private alertMessage: string = "Message";
	private alertSuccess: boolean = true;
	private alertShow: boolean = false;  	

	private countries: any[] = [];
	private users: any[] = [];

	private countrySelected = "-1";
	private docTypeSelected = "-1";
	private userSelected = "-1";

	private countriesFilterSubject: Subject<any>;
	private countriesFilter: any = {};

	private docFilterSubject: Subject<any>;
	private docFilter: any = {};

	private exportDocs: any[] = [];
	private docsCount = 0;
	private docsSize = 0;
	private firebase;


	constructor(private af: AngularFire, private router: Router) {
		this.subscriptions = new RxHelper;

		this.docFilterSubject = new BehaviorSubject(undefined);
		this.docFilter = {
			query: {
	          orderByChild: "module",
	          equalTo: this.docFilterSubject
	        }
		}

		this.countriesFilterSubject = new BehaviorSubject(undefined);
		this.countriesFilter = {
			query: {
	          orderByChild: "location",
	          equalTo: this.countriesFilterSubject
	        }
		}
	}


	ngOnInit() {
		this.docFilterSubject.next();
		let subscription = this.af.auth.subscribe(auth => {
			if (auth) {
				this.uid = auth.uid;
				this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/countryOffice/' + this.uid, this.countriesFilter).subscribe(_ => {
					this.countries = _;
					Object.keys(this.countries).map(country => {
						let key = this.countries[country].$key;
						this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/document/' + key, this.docFilter).subscribe(_ => {
							let docs = _;
							docs = docs.filter(doc => {
								if (this.userSelected == "-1")
									return true;

								return doc.uploadedBy == this.userSelected;
							});

							Object.keys(docs).map(doc => {
								let uploadedBy = docs[doc].uploadedBy;
								this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/userPublic/' + uploadedBy).subscribe(_ => {
									docs[doc]['uploadedBy'] = _.firstName + " " + _.lastName;
								}));
							});
							this.countries[country]['docs'] = docs;
							this.countries[country]['docsfiltered'] = docs;
							this.countries[country]['hasDocs'] = (docs.length > 0);
						}));
					});
				}));

				this.subscriptions.add(this.af.database.list(Constants.APP_STATUS+'/group/agency/' + this.uid + '/agencyallusersgroup').subscribe(_ => {
					let users = _;
					Object.keys(users).map(user => {
						let userKey = users[user].$key;
						this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/userPublic/' + userKey).subscribe(_ => {
							this.users[user] = {key: userKey, fullName: _.firstName + " " + _.lastName};
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
		this.exportDocs = [];
		this.countries.map(country => {
			country.docsfiltered.map(doc => {
				if(doc.selected) {
					this.exportDocs.push(doc);

					if (doc.sizeType == SizeType.KB)
						this.docsSize += doc.size * 0.001;
					else
						this.docsSize += doc.size;

				}
			})
		});

		this.docsCount = this.exportDocs.length;

		jQuery("#export_documents").modal("show");
	}

	private closeExportModal() {
		jQuery("#export_documents").modal("hide");
	}

	private export() {
		this.exporting = !this.exporting;
		jQuery("#export_documents").modal("hide");

		let self = this;
		this.exportDocs.map(doc => {
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.onload = function(event) {
				self.download(xhr.response, doc.fileName, xhr.getResponseHeader("Content-Type"));
			};
			xhr.open('GET', doc.filePath);
			xhr.send();
		});	
	}

	private download(data, name, type) {
		var a = document.createElement("a");
		document.body.appendChild(a);
		var file = new Blob([data], {type: type});
		a.href = URL.createObjectURL(file);
		a.download = name;
		a.click();
	}

	private countryDocsSelected(country, target) {	
		country.docsfiltered = country.docsfiltered.map(doc => {
			doc.selected = country.selected;
			return doc;
		});
	}

	private filter() {
		// if there is "-1" in the this.docTypeSelected, DocumentType will return undefined, so next(undefined) returns no filter
		// the same logic is applied for other filters
		this.docFilterSubject.next(DocumentType[this.docTypeSelected]);
		// the filtering based on User is done client side, because FireBase supports orderBy only on one parameter
		
		this.countriesFilterSubject.next(Countries[this.countrySelected]);
	}

	// Feel free to extend to other fields for filtering if needed
	private searchByNameOrTitle(filter: string) {
		filter = filter.toLowerCase();

		this.countries.map(country => {
			country['docsfiltered'] = country.docs.filter(doc => {
				if (filter.length == 0)
					return true;

				let searchBy = doc.title + doc.fileName;
				searchBy = searchBy.toLowerCase();

				if(searchBy.search(filter) > -1)
					return true;

				return false;
			});
		});
	}

}
