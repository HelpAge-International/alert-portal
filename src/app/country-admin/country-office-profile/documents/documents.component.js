"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../../utils/Constants");
var Enums_1 = require("../../../utils/Enums");
var rxjs_1 = require("rxjs");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var DocumentsComponent = (function () {
    function DocumentsComponent(af, router) {
        this.af = af;
        this.router = router;
        this.DOCUMENT_TYPE = Constants_1.Constants.DOCUMENT_TYPE;
        this.COUNTRIES = Constants_1.Constants.COUNTRIES;
        this.CountriesEnum = Object.keys(Enums_1.Countries).map(function (k) { return Enums_1.Countries[k]; }).filter(function (v) { return typeof v === "string"; });
        this.DocTypeEnum = Object.keys(Enums_1.DocumentType).map(function (k) { return Enums_1.DocumentType[k]; }).filter(function (v) { return typeof v === "string"; });
        this.exporting = false;
        this.alertMessage = "Message";
        this.alertSuccess = true;
        this.alertShow = false;
        this.countries = [];
        this.users = [];
        this.countrySelected = "-1";
        this.docTypeSelected = "-1";
        this.userSelected = "-1";
        this.countriesFilter = {};
        this.docFilter = {};
        this.exportDocs = [];
        this.docsCount = 0;
        this.docsSize = 0;
        this.ngUnsubscribe = new rxjs_1.Subject();
        this.docFilterSubject = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.docFilter = {
            query: {
                orderByChild: "module",
                equalTo: this.docFilterSubject
            }
        };
        this.countriesFilterSubject = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.countriesFilter = {
            query: {
                orderByChild: "location",
                equalTo: this.countriesFilterSubject
            }
        };
    }
    DocumentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.docFilterSubject.next();
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/countryOffice/' + _this.uid, _this.countriesFilter)
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (_) {
                    _this.countries = _;
                    Object.keys(_this.countries).map(function (country) {
                        var key = _this.countries[country].$key;
                        _this.af.database.list(Constants_1.Constants.APP_STATUS + '/document/' + key, _this.docFilter)
                            .takeUntil(_this.ngUnsubscribe)
                            .subscribe(function (_) {
                            var docs = _;
                            docs = docs.filter(function (doc) {
                                if (_this.userSelected == "-1")
                                    return true;
                                return doc.uploadedBy == _this.userSelected;
                            });
                            Object.keys(docs).map(function (doc) {
                                var uploadedBy = docs[doc].uploadedBy;
                                _this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + uploadedBy)
                                    .takeUntil(_this.ngUnsubscribe)
                                    .subscribe(function (_) {
                                    docs[doc]['uploadedBy'] = _.firstName + " " + _.lastName;
                                });
                            });
                            _this.countries[country]['docs'] = docs;
                            _this.countries[country]['docsfiltered'] = docs;
                            _this.countries[country]['hasDocs'] = (docs.length > 0);
                        });
                    });
                });
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/group/agency/' + _this.uid + '/agencyallusersgroup')
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (_) {
                    var users = _;
                    Object.keys(users).map(function (user) {
                        var userKey = users[user].$key;
                        _this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + userKey)
                            .takeUntil(_this.ngUnsubscribe)
                            .subscribe(function (_) {
                            _this.users[user] = { key: userKey, fullName: _.firstName + " " + _.lastName };
                        });
                    });
                });
            }
            else {
                // user is not logged in
                console.log('Error occurred - User is not logged in');
                _this.navigateToLogin();
            }
        });
    };
    DocumentsComponent.prototype.ngOnDestroy = function () {
        try {
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
        }
        catch (e) {
            console.log('Unable to releaseAll');
        }
    };
    DocumentsComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    DocumentsComponent.prototype.cancelChanges = function () {
        this.ngOnInit();
    };
    DocumentsComponent.prototype.saveChanges = function () {
    };
    DocumentsComponent.prototype.onAlertHidden = function (hidden) {
        this.alertShow = !hidden;
        this.alertSuccess = true;
        this.alertMessage = "";
    };
    DocumentsComponent.prototype.cancelExportDocuments = function () {
        this.exporting = !this.exporting;
    };
    DocumentsComponent.prototype.selectDocuments = function () {
        this.exporting = !this.exporting;
    };
    DocumentsComponent.prototype.exportSelectedDocuments = function () {
        var _this = this;
        this.exportDocs = [];
        this.countries.map(function (country) {
            country.docsfiltered.map(function (doc) {
                if (doc.selected) {
                    _this.exportDocs.push(doc);
                    if (doc.sizeType == Enums_1.SizeType.KB)
                        _this.docsSize += doc.size * 0.001;
                    else
                        _this.docsSize += doc.size;
                }
            });
        });
        this.docsCount = this.exportDocs.length;
        jQuery("#export_documents").modal("show");
    };
    DocumentsComponent.prototype.closeExportModal = function () {
        jQuery("#export_documents").modal("hide");
    };
    DocumentsComponent.prototype.export = function () {
        this.exporting = !this.exporting;
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
    DocumentsComponent.prototype.download = function (data, name, type) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        var file = new Blob([data], { type: type });
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    };
    DocumentsComponent.prototype.countryDocsSelected = function (country, target) {
        country.docsfiltered = country.docsfiltered.map(function (doc) {
            doc.selected = country.selected;
            return doc;
        });
    };
    DocumentsComponent.prototype.filter = function () {
        // if there is "-1" in the this.docTypeSelected, DocumentType will return undefined, so next(undefined) returns no filter
        // the same logic is applied for other filters
        this.docFilterSubject.next(Enums_1.DocumentType[this.docTypeSelected]);
        // the filtering based on User is done client side, because FireBase supports orderBy only on one parameter
        this.countriesFilterSubject.next(Enums_1.Countries[this.countrySelected]);
    };
    // Feel free to extend to other fields for filtering if needed
    DocumentsComponent.prototype.searchByNameOrTitle = function (filter) {
        filter = filter.toLowerCase();
        this.countries.map(function (country) {
            country['docsfiltered'] = country.docs.filter(function (doc) {
                if (filter.length == 0)
                    return true;
                var searchBy = doc.title + doc.fileName;
                searchBy = searchBy.toLowerCase();
                if (searchBy.search(filter) > -1)
                    return true;
                return false;
            });
        });
    };
    return DocumentsComponent;
}());
DocumentsComponent = __decorate([
    core_1.Component({
        selector: 'app-documents',
        templateUrl: './documents.component.html',
        styleUrls: ['./documents.component.css']
    })
], DocumentsComponent);
exports.DocumentsComponent = DocumentsComponent;
