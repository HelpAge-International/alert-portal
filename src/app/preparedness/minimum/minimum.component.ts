import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {AngularFire, FirebaseApp} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel, ActionStatus, SizeType, DocumentType} from "../../utils/Enums";
import {Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LocalStorageService} from 'angular-2-local-storage';
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
  protected actionLevel = ActionLevel.MPA;
  protected uid: string = "C1T4Mx2gZFTFSq8CTxSEsyJDr2j2"; // Country Admin TODO remove
  protected actions: any[] = [];
  protected users: any[] = [];
  protected assignedToUsers: any[] = [];
  protected departments: any[] = [];
  protected countryId = null;
  protected agencyId = null;
  protected actionStatus = ActionStatus;
  protected ActionStatusEnum = Object.keys(ActionStatus).map(k => ActionStatus[k]).filter(v => typeof v === "string") as string[];
  protected ActionTypeEnum = Object.keys(ActionType).map(k => ActionType[k]).filter(v => typeof v === "string") as string[];

  protected statusSelected = "-1";
  protected departmentSelected = "-1";
  protected typeSelected = "-1";
  protected userSelected = "-1";
  protected agencyNetworkSelected = "-1";
  protected assignedToUser = "me";
  protected assignedToUserKey;
  protected assignedToAnyone = false;

  protected allArchived = false;
  protected allUnassigned = false;

  protected exportDocs: any[] = [];
  protected docsCount = 0;
  protected docsSize = 0;

  protected docFilterSubject: Subject<any>;
  protected docFilter: any = {};

  protected attachments: any[] = [];

  protected obsCountryId: Subject<string> = new Subject();
  protected countrySelected = false;
  protected agencySelected = false;

  protected actionSelected: any = {};
  firebase: any;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(@Inject(FirebaseApp) firebaseApp: any, protected af: AngularFire, protected router: Router, protected route: ActivatedRoute, protected storage: LocalStorageService) {
    this.firebase = firebaseApp;

    this.docFilterSubject = new BehaviorSubject(undefined);
    this.docFilter = {
      query: {
        orderByChild: "module",
        equalTo: this.docFilterSubject
      }
    };

    this.route.params.subscribe((params: Params) => {
      if (params['countryId']) {
        this.countryId = params['countryId'];
        this.obsCountryId.next(this.countryId);

        this.countrySelected = true;
      }

      if (params['agencyId']) {
        this.agencyId = params['agencyId'];

        this.agencySelected = true;
      }
    });
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        //this.uid = auth.uid; TODO remove comment

        this.obsCountryId
          .takeUntil(this.ngUnsubscribe)
          .subscribe(
            value => {
              this.assignedToUsers = [];
              this.af.database.list(Constants.APP_STATUS + '/staff/' + this.countryId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(staff => {
                  this.assignedToUsers = staff.map(member => {
                    let userId = member.$key;
                    this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userId)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(_ => {
                        if (_.$exists()) {
                          member.fullName = _.firstName + " " + _.lastName;
                        }
                        else {
                          member.fullName = "";
                        }
                      });

                    return member;
                  });

                });
            },
            error => console.log(error),
            () => console.log("finished")
          );

        if (!this.countrySelected)
          this.af.database.object(Constants.APP_STATUS + '/administratorCountry/' + this.uid + '/countryId')
            .takeUntil(this.ngUnsubscribe)
            .subscribe(country => {
              if (country.$exists()) {
                this.countryId = country.$value;

                this.obsCountryId.next(this.countryId);
              }
            });


        this.assignedToUserKey = this.uid;
        this.af.database.list(Constants.APP_STATUS + '/action/')
          .takeUntil(this.ngUnsubscribe)
          .subscribe(_ => {
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
                    this.af.database.object(Constants.APP_STATUS + '/document/' + agencyId + '/' + docId)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(_ => {
                        actions[action].documents[docId] = _;
                      });
                  });
                } catch (e) {
                  console.log('No docs');
                }


                this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userKey)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(_ => {
                    if (_.$exists()) {
                      this.users[userKey] = _.firstName + " " + _.lastName;
                      actions[action].assigned = true;
                    }
                    else {
                      this.users[userKey] = "Unassigned";//TODO translate somehow
                      actions[action].assigned = false;
                    }

                  });

                this.af.database.list(Constants.APP_STATUS + '/note/' + action, {
                  query: {
                    orderByChild: "time"
                  }
                })
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(_ => {
                    actions[action].notesCount = _.length;
                    actions[action].notes = _;
                    actions[action].notes.map(note => {
                      let uploadByUser = note.uploadBy;
                      this.af.database.object(Constants.APP_STATUS + '/userPublic/' + uploadByUser)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(_ => {
                          if (_.$exists()) {
                            note.uploadByUser = _.firstName + " " + _.lastName;
                          }
                          else {
                            note.uploadByUser = "N/A";
                          }
                        });

                      return note;
                    });

                  });


                if (actions[action].level == this.actionLevel) {
                  this.actions.push(actions[action]);
                }
              });
            });
          });

        this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments')
          .takeUntil(this.ngUnsubscribe)
          .subscribe(_ => {
            if (_.$exists()) {
              //console.log(_);
              this.departments = Object.keys(_);
            }
            else {
              this.departments = [];
            }

          });

      } else {
        // user is not logged in
        console.log('Error occurred - User is not logged in');
        this.navigateToLogin();
      }
    });
  }


  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  protected navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  protected addNote(action) {
    if (action.note == undefined)
      return;

    let note = {
      content: action.note,
      time: firebase.database.ServerValue.TIMESTAMP,
      uploadBy: this.uid
    };

    action.note = "";

    this.af.database.list(Constants.APP_STATUS + '/note/' + action.key).push(note);
  }

  protected editNote(note, action) {

  }

  protected deleteNote(note, action) {
    this.af.database.list(Constants.APP_STATUS + '/note/' + action.key + '/' + note.$key).remove();
  }

  protected filter() {
    if (this.userSelected == "-1") {
      this.assignedToUser = "me";
      this.assignedToUserKey = this.uid;
      this.assignedToAnyone = false;
    } else if (this.userSelected == "0") {
      this.assignedToUser = "Anyone";
      this.assignedToAnyone = true;
    } else {
      let users = this.assignedToUsers.filter(user => {
        return user.$key == this.userSelected
      });

      if (users.length > 0) {
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

  protected showAllArchived(show) {
    this.allArchived = show;
  }

  protected showAllUnassigned(show) {
    this.allUnassigned = show;
  }

  protected exportSelectedDocuments(action) {
    this.exportDocs = [];
    this.docsSize = 0;

    for (let docId in action.documents) {
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

  protected exportDocument(action, docId) {
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

  protected closeExportModal() {
    jQuery("#export_documents").modal("hide");
  }

  protected download(data, name, type) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    var file = new Blob([data], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
  }

  protected export() {
    jQuery("#export_documents").modal("hide");

    let self = this;
    this.exportDocs.map(doc => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (event) {
        self.download(xhr.response, doc.fileName, xhr.getResponseHeader("Content-Type"));
      };
      xhr.open('GET', doc.filePath);
      xhr.send();
    });
  }

  protected deleteDocument(action, docId) {

  }

  protected fileChange(event, action) {

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

  protected removeAttachment(action, file) {
    action.attachments = action.attachments.filter(attachment => {
      if (attachment.name == file.name && attachment.actionId == file.actionId)
        return false;

      return true;
    });
  }

  protected completeAction(action) {
    if (action.attachments != undefined) {
      if (action.attachments.length > 0) {
        action.attachments.map(file => {
          this.uploadFile(action, file);
        });

        this.af.database.object(Constants.APP_STATUS + '/action/' + action.agencyId + '/' + action.key)
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

  protected uploadFile(action, file) {
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

    this.af.database.list(Constants.APP_STATUS + '/document/' + action.agencyId).push(document)
      .then(_ => {
        let docKey = _.key;
        let doc = {};
        doc[docKey] = true;

        this.af.database.object(Constants.APP_STATUS + '/action/' + action.agencyId + '/' + action.key + '/documents').update(doc)
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

                this.af.database.object(Constants.APP_STATUS + '/document/' + action.agencyId + '/' + docKey).set(document);
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

  protected purgeDocumentReference(action, docKey) {
    this.af.database.object(Constants.APP_STATUS + '/action/' + action.agencyId + '/' + action.key + '/documents/' + docKey).remove();
    this.af.database.object(Constants.APP_STATUS + '/document/' + action.agencyId + '/' + docKey).remove();
  }

  protected copyAction(action) {
    this.storage.set('selectedAction', action);
    this.router.navigate(["/preparedness/create-edit-preparedness"]);
  }

}
