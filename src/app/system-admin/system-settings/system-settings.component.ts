import {Component, OnInit} from '@angular/core';
import {AngularFireAuth, AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";

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
  isPdf:boolean;
  isHtml:boolean;
  isDoc:boolean;
  isDocx:boolean;
  isPs:boolean;
  isRtf:boolean;
  isJpeg:boolean;
  isPng:boolean;
  fileSize:number;

  constructor(private af: AngularFire) {
  }

  ngOnInit() {
    this.af.database.object(Constants.APP_STATUS+"/system/hoXTsvefEranzaSQTWbkhpBenLn2");
  }
}
