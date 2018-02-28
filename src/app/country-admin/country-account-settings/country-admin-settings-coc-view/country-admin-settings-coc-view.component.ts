import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";

@Component({
  selector: 'app-country-admin-settings-coc-view',
  templateUrl: './country-admin-settings-coc-view.component.html',
  styleUrls: ['./country-admin-settings-coc-view.component.scss']
})
export class CountryAdminSettingsCocViewComponent implements OnInit {

  private uid: string;
  authState: FirebaseAuthState;
  private alertMessage: string = "";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;
  private cocText: string = "";
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authObj(this.ngUnsubscribe, this.route, this.router, (auth, userType) => {
      this.authState = auth;
      this.uid = auth.auth.uid;
      this.downloadCoC();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private downloadCoC(){
    this.af.database.object(Constants.APP_STATUS + "/system/o8XIEoROEcZgFwzFeRpjtXMXnOr1/")
      .takeUntil(this.ngUnsubscribe).subscribe(x => {
      this.cocText = x.coc;
    });
  }

  onAgree(){
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid+"/latestCoCAgreed").set(true).then(() =>{
      console.log("successfully agreed to coc");
      this.alertMessage = "GLOBAL.SUCCESS_COC_AGREE";
      this.alertShow = true;
      this.alertSuccess = true;
    }).catch(() => {
      console.log("failed to agreed to coc");
    });
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

}
