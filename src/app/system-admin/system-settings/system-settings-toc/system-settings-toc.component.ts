import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {Constants} from "../../../utils/Constants";

@Component({
  selector: 'app-system-settings-toc',
  templateUrl: './system-settings-toc.component.html',
  styleUrls: ['./system-settings-toc.component.scss']
})
export class SystemSettingsTocComponent implements OnInit {

  private isEditing: boolean = false;
  private tocText: string = "";
  private uid: string;
  private alertMessage: string = "";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;
  private previousText: string = "";
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.downloadToC();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private downloadToC(){
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid)
      .takeUntil(this.ngUnsubscribe).subscribe(x => {
      this.tocText = x.toc;
    });
  }

  edit() {
    this.previousText = this.tocText;
    this.isEditing = true;
  }

  cancelEdit() {
    this.tocText = this.previousText;
    this.isEditing = false;
  }

  saveEdited() {
    if(this.isValid()){
      let tocObj = {"toc": this.tocText};
      this.isEditing = false;
      this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid).update(tocObj).then(_ =>{
        this.alertMessage = "SYSTEM_ADMIN.SETTING.SUCCESS_TOC_UPDATE";
        this.alertShow = true;
        this.alertSuccess = true;
      }, error => {
        console.log(error.message);
      });
    }else{
      this.alertMessage = "SYSTEM_ADMIN.SETTING.ERROR_TOC_UPDATE";
      this.alertShow = true;
      this.alertSuccess = false;
    }
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

  private isValid(){
    return this.tocText != null && this.tocText.length != 0;
  }

}
