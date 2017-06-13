"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angularfire2_1 = require("angularfire2");
var Constants_1 = require("../../utils/Constants");
var Enums_1 = require("../../utils/Enums");
var rxjs_1 = require("rxjs");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var RxHelper_1 = require("../../utils/RxHelper");
var firebase = require("firebase");
var MinimumPreparednessComponent = (function () {
    function MinimumPreparednessComponent(firebaseApp, af, router, route, storage) {
        var _this = this;
        this.af = af;
        this.router = router;
        this.route = route;
        this.storage = storage;
        this.ACTION_STATUS = Constants_1.Constants.ACTION_STATUS;
        this.ACTION_LEVEL = Constants_1.Constants.ACTION_LEVEL;
        this.ACTION_TYPE = Constants_1.Constants.ACTION_TYPE;
        this.actionLevel = Enums_1.ActionLevel.MPA;
        this.actions = [];
        this.users = [];
        this.assignedToUsers = [];
        this.departments = [];
        this.countryId = null;
        this.agencyId = null;
        this.actionStatus = Enums_1.ActionStatus;
        this.ActionStatusEnum = Object.keys(Enums_1.ActionStatus).map(function (k) { return Enums_1.ActionStatus[k]; }).filter(function (v) { return typeof v === "string"; });
        this.ActionTypeEnum = Object.keys(Enums_1.ActionType).map(function (k) { return Enums_1.ActionType[k]; }).filter(function (v) { return typeof v === "string"; });
        this.statusSelected = "-1";
        this.departmentSelected = "-1";
        this.typeSelected = "-1";
        this.userSelected = "-1";
        this.agencyNetworkSelected = "-1";
        this.assignedToUser = "me";
        this.assignedToAnyone = false;
        this.allArchived = false;
        this.allUnassigned = false;
        this.exportDocs = [];
        this.docsCount = 0;
        this.docsSize = 0;
        this.docFilter = {};
        this.attachments = [];
        this.obsCountryId = new rxjs_1.Subject();
        this.countrySelected = false;
        this.agencySelected = false;
        this.actionSelected = {};
        this.subscriptions = new RxHelper_1.RxHelper;
        this.firebase = firebaseApp;
        this.docFilterSubject = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.docFilter = {
            query: {
                orderByChild: "module",
                equalTo: this.docFilterSubject
            }
        };
        var subscription = this.route.params.subscribe(function (params) {
            if (params['countryId']) {
                _this.countryId = params['countryId'];
                _this.obsCountryId.next(_this.countryId);
                _this.countrySelected = true;
            }
            if (params['agencyId']) {
                _this.agencyId = params['agencyId'];
                _this.agencySelected = true;
            }
        });
    }
    MinimumPreparednessComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.af.auth.subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.subscriptions.add(_this.obsCountryId.subscribe(function (value) {
                    _this.assignedToUsers = [];
                    _this.subscriptions.add(_this.af.database.list(Constants_1.Constants.APP_STATUS + '/staff/' + _this.countryId).subscribe(function (staff) {
                        _this.assignedToUsers = staff.map(function (member) {
                            var userId = member.$key;
                            _this.subscriptions.add(_this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + userId).subscribe(function (_) {
                                if (_.$exists()) {
                                    member.fullName = _.firstName + " " + _.lastName;
                                }
                                else {
                                    member.fullName = "";
                                }
                            }));
                            return member;
                        });
                    }));
                }, function (error) { return console.log(error); }, function () { return console.log("finished"); }));
                if (!_this.countrySelected) {
                    _this.getCountryID().then(function () {
                        _this.getActions();
                    });
                }
                else {
                    _this.getActions();
                }
                _this.assignedToUserKey = _this.uid;
                _this.subscriptions.add(_this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + _this.uid + '/departments').subscribe(function (_) {
                    if (_.$exists()) {
                        //console.log(_);
                        _this.departments = Object.keys(_);
                    }
                    else {
                        _this.departments = [];
                    }
                }));
                _this.subscriptions.add(subscription);
            }
            else {
                // user is not logged in
                console.log('Error occurred - User is not logged in');
                _this.navigateToLogin();
            }
        });
    };
    MinimumPreparednessComponent.prototype.getCountryID = function () {
        var _this = this;
        var promise = new Promise(function (res, rej) {
            var subscription = _this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorCountry/" + _this.uid + '/countryId').subscribe(function (countryID) {
                _this.countryId = countryID.$value ? countryID.$value : "";
                res(true);
            });
            _this.subscriptions.add(subscription);
        });
        return promise;
    };
    MinimumPreparednessComponent.prototype.getActions = function () {
        var _this = this;
        console.log('!!!!!!!!!!!');
        console.log(this.countryId);
        console.log(this.uid);
        this.subscriptions.add(this.af.database.list(Constants_1.Constants.APP_STATUS + '/action/' + this.countryId).subscribe(function (_) {
            _this.actions = [];
            _.map(function (action) {
                var agencyId = action.$key;
                action.agencyId = agencyId;
                action.key = agencyId;
                action.docsCount = 0;
                var userKey = action.assignee;
                try {
                    action.docsCount = Object.keys(action.documents).length;
                    Object.keys(action.documents).map(function (docId) {
                        // console.log(Constants.APP_STATUS + '/document/' + agencyId + '/' + docId);
                        _this.subscriptions.add(_this.af.database.object(Constants_1.Constants.APP_STATUS + '/document/' + agencyId + '/' + docId).subscribe(function (_) {
                            action.documents[docId] = _;
                        }));
                    });
                }
                catch (e) {
                    //console.log('No docs');
                }
                _this.subscriptions.add(_this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + userKey).subscribe(function (_) {
                    if (_.$exists()) {
                        _this.users[userKey] = _.firstName + " " + _.lastName;
                        action.assigned = true;
                    }
                    else {
                        _this.users[userKey] = "Unassigned"; //TODO translate somehow
                        action.assigned = false;
                    }
                }));
                _this.subscriptions.add(_this.af.database.list(Constants_1.Constants.APP_STATUS + '/note/' + agencyId, {
                    query: {
                        orderByChild: "time"
                    }
                }).subscribe(function (_) {
                    action.notesCount = _.length;
                    action.notes = _;
                    action.notes.map(function (note) {
                        var uploadByUser = note.uploadBy;
                        _this.subscriptions.add(_this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + uploadByUser).subscribe(function (_) {
                            if (_.$exists()) {
                                note.uploadByUser = _.firstName + " " + _.lastName;
                            }
                            else {
                                note.uploadByUser = "N/A";
                            }
                        }));
                        return note;
                    });
                }));
                if (action.level == _this.actionLevel) {
                    if (!action.asignee) {
                        _this.actions.push(action);
                    }
                }
            });
        }));
    };
    MinimumPreparednessComponent.prototype.ngOnDestroy = function () {
        try {
            this.subscriptions.releaseAll();
        }
        catch (e) {
            console.log('Unable to releaseAll');
        }
    };
    MinimumPreparednessComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    MinimumPreparednessComponent.prototype.addNote = function (action) {
        if (action.note == undefined)
            return;
        var note = {
            content: action.note,
            time: firebase.database.ServerValue.TIMESTAMP,
            uploadBy: this.uid
        };
        action.note = "";
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/note/' + action.key).push(note);
    };
    MinimumPreparednessComponent.prototype.editNote = function (note, action) {
    };
    MinimumPreparednessComponent.prototype.deleteNote = function (note, action) {
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/note/' + action.key + '/' + note.$key).remove();
    };
    MinimumPreparednessComponent.prototype.filter = function () {
        var _this = this;
        if (this.userSelected == "-1") {
            this.assignedToUser = "me";
            this.assignedToUserKey = this.uid;
            this.assignedToAnyone = false;
        }
        else if (this.userSelected == "0") {
            this.assignedToUser = "Anyone";
            this.assignedToAnyone = true;
        }
        else {
            var users = this.assignedToUsers.filter(function (user) {
                return user.$key == _this.userSelected;
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
    };
    MinimumPreparednessComponent.prototype.showAllArchived = function (show) {
        this.allArchived = show;
    };
    MinimumPreparednessComponent.prototype.showAllUnassigned = function (show) {
        this.allUnassigned = show;
    };
    MinimumPreparednessComponent.prototype.exportSelectedDocuments = function (action) {
        this.exportDocs = [];
        this.docsSize = 0;
        for (var docId in action.documents) {
            var doc = action.documents[docId];
            this.exportDocs.push(doc);
            if (doc.sizeType == Enums_1.SizeType.KB)
                this.docsSize += doc.size * 0.001;
            else
                this.docsSize += doc.size;
        }
        this.docsCount = this.exportDocs.length;
        jQuery("#export_documents").modal("show");
    };
    MinimumPreparednessComponent.prototype.exportDocument = function (action, docId) {
        this.exportDocs = [];
        this.docsSize = 0;
        var doc = action.documents[docId];
        this.exportDocs.push(doc);
        if (doc.sizeType == Enums_1.SizeType.KB)
            this.docsSize += doc.size * 0.001;
        else
            this.docsSize += doc.size;
        this.docsCount = this.exportDocs.length;
        jQuery("#export_documents").modal("show");
    };
    MinimumPreparednessComponent.prototype.closeExportModal = function () {
        jQuery("#export_documents").modal("hide");
    };
    MinimumPreparednessComponent.prototype.download = function (data, name, type) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        var file = new Blob([data], { type: type });
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    };
    MinimumPreparednessComponent.prototype.export = function () {
        jQuery("#export_documents").modal("hide");
        var self = this;
        this.exportDocs.map(function (doc) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function (event) {
                self.download(xhr.response, doc.fileName, xhr.getResponseHeader("Content-Type"));
            };
            xhr.open('GET', doc.filePath);
            xhr.send();
        });
    };
    MinimumPreparednessComponent.prototype.deleteDocument = function (action, docId) {
    };
    MinimumPreparednessComponent.prototype.fileChange = function (event, action) {
        if (event.target.files.length > 0) {
            var file_1 = event.target.files[0];
            jQuery('#docUpload').val("");
            file_1.actionId = action.key;
            var exists_1 = false;
            if (action.attachments == undefined)
                action.attachments = [];
            action.attachments.map(function (attachment) {
                if (attachment.name == file_1.name && attachment.actionId == file_1.actionId) {
                    exists_1 = true;
                    console.log("exists");
                }
            });
            if (!exists_1)
                action.attachments.push(file_1);
        }
    };
    MinimumPreparednessComponent.prototype.removeAttachment = function (action, file) {
        action.attachments = action.attachments.filter(function (attachment) {
            if (attachment.name == file.name && attachment.actionId == file.actionId)
                return false;
            return true;
        });
    };
    MinimumPreparednessComponent.prototype.completeAction = function (action) {
        var _this = this;
        if (action.attachments != undefined) {
            if (action.attachments.length > 0) {
                action.attachments.map(function (file) {
                    _this.uploadFile(action, file);
                });
                this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + action.agencyId + '/' + action.key)
                    .update({
                    actionStatus: Enums_1.ActionStatus.Completed,
                    isCompleted: true
                });
                this.addNote(action);
            }
            else {
                //TODO please attach documents popup
            }
        }
    };
    MinimumPreparednessComponent.prototype.uploadFile = function (action, file) {
        var _this = this;
        var document = {
            fileName: file.name,
            filePath: "",
            module: Enums_1.DocumentType.MPA,
            size: file.size * 0.001,
            sizeType: Enums_1.SizeType.KB,
            title: file.name,
            time: firebase.database.ServerValue.TIMESTAMP,
            uploadedBy: this.uid
        };
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/document/' + action.agencyId).push(document)
            .then(function (_) {
            var docKey = _.key;
            var doc = {};
            doc[docKey] = true;
            _this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + action.agencyId + '/' + action.key + '/documents').update(doc)
                .then(function (_) {
                new Promise(function (res, rej) {
                    var storageRef = _this.firebase.storage().ref().child('documents/' + _this.countryId + '/' + docKey + '/' + file.name);
                    var uploadTask = storageRef.put(file);
                    uploadTask.on('state_changed', function (snapshot) {
                    }, function (error) {
                        rej(error);
                    }, function () {
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        res(downloadURL);
                    });
                })
                    .then(function (result) {
                    document.filePath = "" + result;
                    _this.af.database.object(Constants_1.Constants.APP_STATUS + '/document/' + action.agencyId + '/' + docKey).set(document);
                })
                    .catch(function (err) {
                    console.log(err, 'You do not have access!');
                    _this.purgeDocumentReference(action, docKey);
                });
            })
                .catch(function (err) {
                console.log(err, 'You do not have access!');
                _this.purgeDocumentReference(action, docKey);
            });
        })
            .catch(function (err) {
            console.log(err, 'You do not have access!');
        });
    };
    MinimumPreparednessComponent.prototype.purgeDocumentReference = function (action, docKey) {
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/action/' + action.agencyId + '/' + action.key + '/documents/' + docKey).remove();
        this.af.database.object(Constants_1.Constants.APP_STATUS + '/document/' + action.agencyId + '/' + docKey).remove();
    };
    MinimumPreparednessComponent.prototype.copyAction = function (action) {
        this.storage.set('selectedAction', action);
        this.router.navigate(["/preparedness/create-edit-preparedness"]);
    };
    return MinimumPreparednessComponent;
}());
MinimumPreparednessComponent = __decorate([
    core_1.Component({
        selector: 'app-minimum',
        templateUrl: './minimum.component.html',
        styleUrls: ['./minimum.component.css']
    }),
    __param(0, core_1.Inject(angularfire2_1.FirebaseApp))
], MinimumPreparednessComponent);
exports.MinimumPreparednessComponent = MinimumPreparednessComponent;
