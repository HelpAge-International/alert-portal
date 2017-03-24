import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFireAuth, AngularFire} from "angularfire2";
import {Constants, FILE_SETTING} from "../../utils/Constants";
import {ModelSystem} from "../../model/system.model";
import {Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {FileType} from "../../utils/Enums";
import {subscribeOn} from "rxjs/operator/subscribeOn";

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent implements OnInit,OnDestroy {

  minGreen: number;
  minAmber: number;
  minRed: number;
  advGreen: number;
  advAmber: number;
  advRed: number;

  isPdf: boolean;
  isDoc: boolean;
  isDocx: boolean;
  isRtf: boolean;
  isJpeg: boolean;
  isPng: boolean;
  isCsv: boolean;
  isXls: boolean;
  isXlsx: boolean;
  isPpt: boolean;
  isPptx: boolean;
  isTxt: boolean;
  isOdt: boolean;
  isTsv: boolean;

  fileSize: number;
  fileType: number;
  thresholdValue: number[] = Constants.THRESHOLD_VALUE;
  fileTypeList: number[] = [0, 1];
  FileType = FileType;
  modelSystem: ModelSystem;
  uid: string;
  successMessage: string = "HOME.SETTING.SETTING_SAVED";
  isSaved: boolean = false;
  private subscription: Subscription;

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    // console.log("uid: "+this.af.auth.getAuth().auth.uid);
    this.subscription = this.af.auth.subscribe(x => {
      if (x) {
        this.uid = x.uid;
        this.initData(this.uid);
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH)
      }
    });

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private initData(uid) {
    this.af.database.object(Constants.APP_STATUS + "/system/" + uid).subscribe(x => {
      this.modelSystem = new ModelSystem();
      this.modelSystem.advThreshold = x.advThreshold;
      this.modelSystem.minThreshold = x.minThreshold;
      this.modelSystem.assignHazard = x.assignHazard;
      this.modelSystem.fileSettings = x.fileSettings;
      this.modelSystem.fileSize = x.fileSize;
      this.modelSystem.fileType = x.fileType;
      this.modelSystem.genericAction = x.genericAction;
      // console.log(x.fileSettings[FILE_SETTING.PNG])
      //load minimum threshold from database
      this.minGreen = x.minThreshold[0];
      this.minAmber = x.minThreshold[1];
      this.minRed = x.minThreshold[2];
      //load advanced threshold from database
      this.advGreen = x.advThreshold[0];
      this.advAmber = x.advThreshold[1];
      this.advRed = x.advThreshold[2];
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
    this.modelSystem.minThreshold[0] = this.minGreen;
    this.modelSystem.minThreshold[1] = this.minAmber;
    this.modelSystem.minThreshold[2] = this.minRed;
    this.modelSystem.advThreshold[0] = this.advGreen;
    this.modelSystem.advThreshold[1] = this.advAmber;
    this.modelSystem.advThreshold[2] = this.advRed;
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

    this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid).set(this.modelSystem).then(_ => {
      this.isSaved = true;
      Observable.timer(Constants.ALERT_DURATION).subscribe(() => {
        console.log("time up");
        this.isSaved = false;
      })
    }, error => {
      console.log(error.message);
    });
  }

  back() {
    this.router.navigateByUrl("/system-admin");
  }
}
