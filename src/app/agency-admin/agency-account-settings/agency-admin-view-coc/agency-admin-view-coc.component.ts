import {Component, Input, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireAuth} from "@angular/fire/auth";
import {Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import firebase from "firebase";
import {take} from "rxjs/operators";
import {ModelSystem} from "../../../model/system.model";

@Component({
  selector: 'app-agency-admin-view-coc',
  templateUrl: './agency-admin-view-coc.component.html',
  styleUrls: ['./agency-admin-view-coc.component.scss']
})
export class AgencyAdminViewCocComponent implements OnInit {

  private uid: string;
  private user: firebase.User;
  private alertMessage: string = "";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;
  private cocText: string = "";
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private afd: AngularFireDatabase, private afa: AngularFireAuth, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authObj(this.ngUnsubscribe, this.route, this.router, (userObservable, userType) => {
      userObservable.subscribe(user =>{
        this.user = user;
        this.uid = user.uid;
        this.downloadCoC();
      })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private downloadCoC(){
    this.afd.object(Constants.APP_STATUS +"/system/systemAdminId") //, {preserveSnapshot: true})
      .snapshotChanges()
      .pipe(take(1))
      .subscribe((systemAdminId) => {
        this.afd.object<ModelSystem>(Constants.APP_STATUS +"/system/"+systemAdminId.payload.val())
          .snapshotChanges()
          .pipe(take(1))
          .subscribe((snap) => {
            if(snap){
              this.cocText = snap.payload.val().coc;
            }
          });
      });
  }

  onAgree(){
    this.afd.object(Constants.APP_STATUS + "/userPublic/" + this.uid+"/latestCoCAgreed").set(true).then(() =>{
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
