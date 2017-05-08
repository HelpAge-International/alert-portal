import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel, ActionStatus, SizeType, DocumentType} from "../../utils/Enums";
import {Observable, Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RxHelper} from '../../utils/RxHelper';
import {Frequency} from "../../utils/Frequency";
import * as firebase from 'firebase';
declare var jQuery: any;


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
	private allUnassigned = false;

	private exportDocs: any[] = [];
	private docsCount = 0;
	private docsSize = 0;

	private docFilterSubject: Subject<any>;
	private docFilter: any = {};

	private attachments: any[] = [];

	firebase: any;

  constructor(@Inject(FirebaseApp) firebaseApp: any, private af: AngularFire, private router: Router) {
		this.subscriptions = new RxHelper;
		this.firebase = firebaseApp;

		this.docFilterSubject = new BehaviorSubject(undefined);
		this.docFilter = {
			query: {
	          orderByChild: "module",
	          equalTo: this.docFilterSubject
	        }
		}
	}

	ngOnInit() {
		let subscription = this.af.auth.subscribe(auth => {
			if (auth) {
				//this.uid = auth.uid; TODO remove comment
				this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/administratorCountry/' + this.uid + '/countryId').subscribe(country => {
					if (country.$exists()) {
						this.countryId = country.$value

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

								Object.keys(actions[action].documents).map(docId => {
									this.subscriptions.add(this.af.database.object(Constants.APP_STATUS+'/document/' + agencyId + '/' + docId).subscribe(_ => {
										actions[action].documents[docId] = _;
									}));
								});
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
		if (action.note == undefined)
			return;

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
	}

	private showAllUnassigned(show){
		this.allUnassigned = show;
	}

	private exportSelectedDocuments(action) {
		this.exportDocs = [];
		this.docsSize = 0;
		
		for(let docId in action.documents) {
			let doc = action.documents[docId];
			this.exportDocs.push(doc);

			if (doc.sizeType == SizeType.KB)
				this.docsSize += doc.size * 0.001;
			else
				this.docsSize += doc.size;
		}

		this.docsCount = this.exportDocs.length;

		jQuery("#export_documents").modal("show");
	}

	private exportDocument(action, docId) {
		this.exportDocs = [];
		this.docsSize = 0;
		
		let doc = action.documents[docId];
		this.exportDocs.push(doc);

		if (doc.sizeType == SizeType.KB)
			this.docsSize += doc.size * 0.001;
		else
			this.docsSize += doc.size;

		this.docsCount = this.exportDocs.length;

		jQuery("#export_documents").modal("show");
	}

	private closeExportModal() {
		jQuery("#export_documents").modal("hide");
	}

	private download(data, name, type) {
		var a = document.createElement("a");
		document.body.appendChild(a);
		var file = new Blob([data], {type: type});
		a.href = URL.createObjectURL(file);
		a.download = name;
		a.click();
	}

	private export() {
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

	private deleteDocument(action, docId){

	}

	private fileChange(event, action){

		if (event.target.files.length > 0) {
	      let file = event.target.files[0];
	      
	      jQuery('#docUpload').val("");

	      file.actionId = action.key;
	      let exists = false;

	      if (action.attachments == undefined)
	      	action.attachments = [];

	      action.attachments.map(attachment => {
	      	if (attachment.name == file.name && attachment.actionId == file.actionId) {
	      		exists = true;
	      		console.log("exists");
	      	}
	      });

	      if (!exists)
  		  	action.attachments.push(file);
	    }
	}

	private removeAttachment(action, file){
		action.attachments = action.attachments.filter(attachment => {
	      	if (attachment.name == file.name && attachment.actionId == file.actionId)
	      		return false;

	      	return true;
	      });
	}

	private completeAction(action) {
		if (action.attachments != undefined){
			if (action.attachments.length > 0){
				action.attachments.map(file => {				
					this.uploadFile(action, file);
				});		

				this.af.database.object(Constants.APP_STATUS+'/action/' + action.agencyId + '/' + action.key)
				.update({
					actionStatus: ActionStatus.Completed,
					isCompleted: true
				});

				this.addNote(action);

			} else {
				//TODO please attach documents popup
			}
		}
	}

	private uploadFile(action, file) {
		let document = {
			fileName: file.name,
			filePath: "", //this needs to be updated once the file is uploaded
			module: DocumentType.MPA,
			size: file.size * 0.001,
			sizeType: SizeType.KB,
			title: file.name, //TODO, what's with the title?
			time: firebase.database.ServerValue.TIMESTAMP,
			uploadedBy: this.uid

		};

		this.af.database.list(Constants.APP_STATUS+'/document/' + action.agencyId).push(document)
			.then(_ => {
				let docKey = _.key;
				let doc = {};
				doc[docKey] = true;

				this.af.database.object(Constants.APP_STATUS+'/action/' + action.agencyId + '/' + action.key + '/documents').update(doc)
					.then(_ => {
						new Promise((res, rej) => {
						  var storageRef = this.firebase.storage().ref().child('documents/' + this.countryId + '/' + docKey + '/' + file.name);
						  var uploadTask = storageRef.put(file);
						  uploadTask.on('state_changed', function (snapshot) {
						  }, function (error) {
						    rej(error);
						  }, function () {
						    var downloadURL = uploadTask.snapshot.downloadURL;
						    res(downloadURL);
						  });
						})
						.then(result => {
							document.filePath = "" + result;

							this.af.database.object(Constants.APP_STATUS+'/document/' + action.agencyId + '/' + docKey).set(document);
						})
						.catch(err => {
							console.log(err, 'You do not have access!');
							this.purgeDocumentReference(action, docKey);
						});
					})
		  			.catch(err => {
						console.log(err, 'You do not have access!');
						this.purgeDocumentReference(action, docKey);
					});
			})
  			.catch(err => {
				console.log(err, 'You do not have access!');
			});

	}

	private purgeDocumentReference(action, docKey){
		this.af.database.object(Constants.APP_STATUS+'/action/' + action.agencyId + '/' + action.key + '/documents/' + docKey).remove();
		this.af.database.object(Constants.APP_STATUS+'/document/' + action.agencyId + '/' + docKey).remove();
	}

}
