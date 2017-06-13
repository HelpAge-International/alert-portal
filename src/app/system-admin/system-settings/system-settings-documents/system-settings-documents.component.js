"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var Constants_1 = require("../../../utils/Constants");
var system_model_1 = require("../../../model/system.model");
var Enums_1 = require("../../../utils/Enums");
var SystemSettingsDocumentsComponent = (function () {
    function SystemSettingsDocumentsComponent(af, router) {
        this.af = af;
        this.router = router;
        this.successMessage = "SYSTEM_ADMIN.SETTING.SETTING_SAVED";
        this.isSaved = false;
        this.thresholdValue = Constants_1.Constants.THRESHOLD_VALUE;
        this.fileTypeList = [0, 1];
        this.FileType = Enums_1.FileType;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    SystemSettingsDocumentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (x) {
            if (x) {
                _this.uid = x.uid;
                _this.initData(_this.uid);
            }
            else {
                _this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
            }
        });
    };
    SystemSettingsDocumentsComponent.prototype.ngOnDestroy = function () {
        console.log(this.ngUnsubscribe);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(this.ngUnsubscribe);
    };
    SystemSettingsDocumentsComponent.prototype.initData = function (uid) {
        var _this = this;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/system/" + uid)
            .takeUntil(this.ngUnsubscribe).subscribe(function (x) {
            _this.modelSystem = new system_model_1.ModelSystem();
            _this.modelSystem.assignHazard = x.assignHazard;
            _this.modelSystem.fileSettings = x.fileSettings;
            _this.modelSystem.fileSize = x.fileSize;
            _this.modelSystem.fileType = x.fileType;
            _this.modelSystem.genericAction = x.genericAction;
            //load file setting from database
            _this.isPdf = x.fileSettings[Constants_1.FILE_SETTING.PDF];
            _this.isDoc = x.fileSettings[Constants_1.FILE_SETTING.DOC];
            _this.isDocx = x.fileSettings[Constants_1.FILE_SETTING.DOCX];
            _this.isRtf = x.fileSettings[Constants_1.FILE_SETTING.RTF];
            _this.isJpeg = x.fileSettings[Constants_1.FILE_SETTING.JPEG];
            _this.isPng = x.fileSettings[Constants_1.FILE_SETTING.PNG];
            _this.isCsv = x.fileSettings[Constants_1.FILE_SETTING.CSV];
            _this.isXls = x.fileSettings[Constants_1.FILE_SETTING.XLS];
            _this.isXlsx = x.fileSettings[Constants_1.FILE_SETTING.XLSX];
            _this.isPpt = x.fileSettings[Constants_1.FILE_SETTING.PPT];
            _this.isPptx = x.fileSettings[Constants_1.FILE_SETTING.PPTX];
            _this.isTxt = x.fileSettings[Constants_1.FILE_SETTING.TXT];
            _this.isOdt = x.fileSettings[Constants_1.FILE_SETTING.ODT];
            _this.isTsv = x.fileSettings[Constants_1.FILE_SETTING.TSV];
            //load file size type
            _this.fileSize = x.fileSize;
            _this.fileType = x.fileType;
        });
    };
    SystemSettingsDocumentsComponent.prototype.saveSetting = function () {
        if (this.uid) {
            this.writeToFirebase();
        }
        else {
            this.router.navigateByUrl("/login");
        }
    };
    SystemSettingsDocumentsComponent.prototype.writeToFirebase = function () {
        var _this = this;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.PDF] = this.isPdf;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.DOC] = this.isDoc;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.DOCX] = this.isDocx;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.RTF] = this.isRtf;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.JPEG] = this.isJpeg;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.PNG] = this.isPng;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.CSV] = this.isCsv;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.XLS] = this.isXls;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.XLSX] = this.isXlsx;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.PPT] = this.isPpt;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.PPTX] = this.isPptx;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.TXT] = this.isTxt;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.ODT] = this.isOdt;
        this.modelSystem.fileSettings[Constants_1.FILE_SETTING.TSV] = this.isTsv;
        this.modelSystem.fileSize = this.fileSize;
        this.modelSystem.fileType = this.fileType;
        this.af.database.object(Constants_1.Constants.APP_STATUS + "/system/" + this.uid).update(this.modelSystem).then(function (_) {
            _this.showAlert();
        }, function (error) {
            console.log(error.message);
        });
    };
    SystemSettingsDocumentsComponent.prototype.showAlert = function () {
        var _this = this;
        this.isSaved = true;
        rxjs_1.Observable.timer(Constants_1.Constants.ALERT_DURATION)
            .takeUntil(this.ngUnsubscribe).subscribe(function () {
            console.log("time up");
            _this.isSaved = false;
        });
    };
    return SystemSettingsDocumentsComponent;
}());
SystemSettingsDocumentsComponent = __decorate([
    core_1.Component({
        selector: 'app-system-settings-documents',
        templateUrl: './system-settings-documents.component.html',
        styleUrls: ['./system-settings-documents.component.css']
    })
], SystemSettingsDocumentsComponent);
exports.SystemSettingsDocumentsComponent = SystemSettingsDocumentsComponent;
