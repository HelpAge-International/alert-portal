import { Component, OnInit } from '@angular/core';
import {Constants} from "../../../utils/Constants";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'app-system-settings-coc',
  templateUrl: './system-settings-coc.component.html',
  styleUrls: ['./system-settings-coc.component.scss']
})

export class SystemSettingsCocComponent implements OnInit {

  private isEditing: boolean = false;
  private cocText: string = "";
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
      this.downloadCoC();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private downloadCoC(){
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid)
      .takeUntil(this.ngUnsubscribe).subscribe(x => {
      this.cocText = x.coc;
    });
  }

  edit() {
    this.previousText = this.cocText;
    this.isEditing = true;
  }

  cancelEdit() {
    this.cocText = this.previousText;
    this.isEditing = false;
  }

  saveEdited() {
    if(this.isValid()){
      let cocObj = {"coc": this.cocText};
      this.isEditing = false;
      this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid).update(cocObj).then(_ =>{
        this.alertMessage = "SYSTEM_ADMIN.SETTING.SUCCESS_COC_UPDATE";
        this.alertShow = true;
        this.alertSuccess = true;
      }, error => {
        console.log(error.message);
      });
    }else{
      this.alertMessage = "SYSTEM_ADMIN.SETTING.ERROR_COC_UPDATE";
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
    return this.cocText != null && this.cocText.length != 0;
  }
}
