import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {Constants, FILE_SETTING} from "../../../utils/Constants";
import {ModelSystem} from "../../../model/system.model";
import {FileType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";

@Component({
  selector: 'app-system-settings-documents',
  templateUrl: './system-settings-documents.component.html',
  styleUrls: ['./system-settings-documents.component.css']
})

export class SystemSettingsDocumentsComponent implements OnInit, OnDestroy {

  private uid: string;

  private successMessage: string = "SYSTEM_ADMIN.SETTING.SETTING_SAVED";
  private isSaved: boolean = false;

  // TODO: Change this to use FileExtensions in Enums
  private isPdf: boolean;
  private isDoc: boolean;
  private isDocx: boolean;
  private isRtf: boolean;
  private isJpeg: boolean;
  private isPng: boolean;
  private isCsv: boolean;
  private isXls: boolean;
  private isXlsx: boolean;
  private isPpt: boolean;
  private isPptx: boolean;
  private isTxt: boolean;
  private isOdt: boolean;
  private isTsv: boolean;

  private fileSize: number;
  private fileType: number;
  private thresholdValue: number[] = Constants.THRESHOLD_VALUE;
  private fileTypeList: number[] = [0, 1];
  private FileType = FileType;
  private modelSystem: ModelSystem;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
        this.uid = user.uid;
        this.initData(this.uid);
    });
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  private initData(uid) {

    this.af.database.object(Constants.APP_STATUS + "/system/" + uid)
      .takeUntil(this.ngUnsubscribe).subscribe(x => {
      this.modelSystem = new ModelSystem();
      this.modelSystem.assignHazard = x.assignHazard;
      this.modelSystem.fileSettings = x.fileSettings;
      this.modelSystem.fileSize = x.fileSize;
      this.modelSystem.fileType = x.fileType;
      // this.modelSystem.genericAction = x.genericAction;
      //load file setting from database
      this.isPdf = x.fileSettings[FILE_SETTING.PDF];
      this.isDoc = x.fileSettings[FILE_SETTING.DOC];
      this.isDocx = x.fileSettings[FILE_SETTING.DOCX];
      this.isRtf = x.fileSettings[FILE_SETTING.RTF];
      this.isJpeg = x.fileSettings[FILE_SETTING.JPEG];
      this.isPng = x.fileSettings[FILE_SETTING.PNG];
      this.isCsv = x.fileSettings[FILE_SETTING.CSV];
      this.isXls = x.fileSettings[FILE_SETTING.XLS];
      this.isXlsx = x.fileSettings[FILE_SETTING.XLSX];
      this.isPpt = x.fileSettings[FILE_SETTING.PPT];
      this.isPptx = x.fileSettings[FILE_SETTING.PPTX];
      this.isTxt = x.fileSettings[FILE_SETTING.TXT];
      this.isOdt = x.fileSettings[FILE_SETTING.ODT];
      this.isTsv = x.fileSettings[FILE_SETTING.TSV];
      //load file size type
      this.fileSize = x.fileSize;
      this.fileType = x.fileType;
    });
  }

  saveSetting() {

    if (this.uid) {
      this.writeToFirebase();
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  private writeToFirebase() {

    this.modelSystem.fileSettings[FILE_SETTING.PDF] = this.isPdf;
    this.modelSystem.fileSettings[FILE_SETTING.DOC] = this.isDoc;
    this.modelSystem.fileSettings[FILE_SETTING.DOCX] = this.isDocx;
    this.modelSystem.fileSettings[FILE_SETTING.RTF] = this.isRtf;
    this.modelSystem.fileSettings[FILE_SETTING.JPEG] = this.isJpeg;
    this.modelSystem.fileSettings[FILE_SETTING.PNG] = this.isPng;
    this.modelSystem.fileSettings[FILE_SETTING.CSV] = this.isCsv;
    this.modelSystem.fileSettings[FILE_SETTING.XLS] = this.isXls;
    this.modelSystem.fileSettings[FILE_SETTING.XLSX] = this.isXlsx;
    this.modelSystem.fileSettings[FILE_SETTING.PPT] = this.isPpt;
    this.modelSystem.fileSettings[FILE_SETTING.PPTX] = this.isPptx;
    this.modelSystem.fileSettings[FILE_SETTING.TXT] = this.isTxt;
    this.modelSystem.fileSettings[FILE_SETTING.ODT] = this.isOdt;
    this.modelSystem.fileSettings[FILE_SETTING.TSV] = this.isTsv;
    this.modelSystem.fileSize = this.fileSize;
    this.modelSystem.fileType = this.fileType;

    this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid).update(this.modelSystem).then(_ => {
      this.showAlert();
    }, error => {
      console.log(error.message);
    });
  }

  private showAlert() {

    this.isSaved = true;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      console.log("time up");
      this.isSaved = false;
    });
  }
}
