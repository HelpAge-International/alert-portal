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
  isHtml: boolean;
  isDoc: boolean;
  isDocx: boolean;
  isPs: boolean;
  isRtf: boolean;
  isJpeg: boolean;
  isPng: boolean;
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
      console.log(x)
      this.modelSystem = new ModelSystem();
      this.modelSystem.minThreshold = x.minThreshold;
      this.modelSystem.advThreshold = x.advThreshold;
      this.modelSystem.fileSettings = x.fileSettings;
      this.modelSystem.fileSize = x.fileSize;
      this.modelSystem.fileType = x.fileType;
      this.modelSystem.assignHazard = x.assignHazard;
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
      this.isHtml = x.fileSettings[FILE_SETTING.HTML];
      this.isDoc = x.fileSettings[FILE_SETTING.DOC];
      this.isDocx = x.fileSettings[FILE_SETTING.DOCX];
      this.isPs = x.fileSettings[FILE_SETTING.PS];
      this.isRtf = x.fileSettings[FILE_SETTING.RTF];
      this.isJpeg = x.fileSettings[FILE_SETTING.JPEG];
      this.isPng = x.fileSettings[FILE_SETTING.PNG];
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
    console.log("start write: "+JSON.stringify(this.modelSystem))
    this.modelSystem.minThreshold[0] = this.minGreen;
    this.modelSystem.minThreshold[1] = this.minAmber;
    this.modelSystem.minThreshold[2] = this.minRed;
    this.modelSystem.advThreshold[0] = this.advGreen;
    this.modelSystem.advThreshold[1] = this.advAmber;
    this.modelSystem.advThreshold[2] = this.advRed;
    this.modelSystem.fileSettings[FILE_SETTING.PDF] = this.isPdf;
    this.modelSystem.fileSettings[FILE_SETTING.HTML] = this.isHtml;
    this.modelSystem.fileSettings[FILE_SETTING.DOC] = this.isDoc;
    this.modelSystem.fileSettings[FILE_SETTING.DOCX] = this.isDocx;
    this.modelSystem.fileSettings[FILE_SETTING.PS] = this.isPs;
    this.modelSystem.fileSettings[FILE_SETTING.RTF] = this.isRtf;
    this.modelSystem.fileSettings[FILE_SETTING.JPEG] = this.isJpeg;
    this.modelSystem.fileSettings[FILE_SETTING.PNG] = this.isPng;
    this.modelSystem.fileSize = this.fileSize;
    this.modelSystem.fileType = this.fileType;

    console.log(this.modelSystem)
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid + '/').set(this.modelSystem).then(() => {
      this.isSaved = true;
      Observable.timer(2000).subscribe(() => {
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
