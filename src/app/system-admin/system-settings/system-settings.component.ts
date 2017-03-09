import {Component, OnInit} from '@angular/core';
import {AngularFireAuth, AngularFire} from "angularfire2";
import {Constants, FILE_SETTING} from "../../utils/Constants";
import {ModelSystem} from "../../model/system.model";

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent implements OnInit {

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
  fileTypeList: number[] = [0, 1, 2];
  fileTypeListName: string[] = ["KB", "MB", "GB"];

  constructor(private af: AngularFire) {
  }

  ngOnInit() {
    this.af.database.object(Constants.APP_STATUS + "/system/hoXTsvefEranzaSQTWbkhpBenLn2").subscribe(x => {
      console.log(x)
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
}
