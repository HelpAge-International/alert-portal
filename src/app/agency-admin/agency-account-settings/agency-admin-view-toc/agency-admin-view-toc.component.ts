import {Component, Input, OnInit} from '@angular/core';
import {AngularFire, FirebaseAuthState} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";

@Component({
  selector: 'app-agency-admin-view-toc',
  templateUrl: './agency-admin-view-toc.component.html',
  styleUrls: ['./agency-admin-view-toc.component.scss']
})
export class AgencyAdminViewTocComponent implements OnInit {

  private uid: string;
  authState: FirebaseAuthState;
  private alertMessage: string = "";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;
  private tocText: string = "";
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

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
    this.af.database.object(Constants.APP_STATUS +"/system/systemAdminId", {preserveSnapshot: true})
      .take(1)
      .subscribe((systemAdminId) => {
        this.af.database.object(Constants.APP_STATUS +"/system/"+systemAdminId.val(), {preserveSnapshot: true})
          .take(1)
          .subscribe((snap) => {
            if(snap){
              this.tocText = snap.val().toc;
            }
          });
      });
  }

  onAgree(){
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid+"/latestToCAgreed").set(true).then(() =>{
      console.log("successfully agreed to toc");
      this.alertMessage = "GLOBAL.SUCCESS_TOC_AGREE";
      this.alertShow = true;
      this.alertSuccess = true;
    }).catch(() => {
      console.log("failed to agreed to toc");
    });
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

}
