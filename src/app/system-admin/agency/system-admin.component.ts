import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {DialogService} from "../../dialog/dialog.service";
import {Subscription, Observable} from "rxjs";
import {Modal, BSModalContext} from "angular2-modal/plugins/bootstrap";
import {Overlay} from "angular2-modal";

@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})

export class SystemAdminComponent implements OnInit, OnDestroy {

  agencies: FirebaseListObservable<any>;
  uid: string;
  private subscription: Subscription;

  constructor(private af: AngularFire, private router: Router, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.subscription = this.af.auth.subscribe(x => {
      if (x) {
        this.uid = x.auth.uid;
        console.log("uid: " + this.uid);
        this.agencies = this.af.database.list(Constants.APP_STATUS+"/agency");
        // this.test();
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  toggleActive(agency) {
    // alert("bug fixing in progress")
    // this.dialogService.createDialog("DIALOG.TITLE", "DIALOG.CONTENT").subscribe(result => {
    //   if (result) {
    //     let state:boolean = !agency.isActive;
    //     console.log(agency.isActive);
    //     this.af.database.object(Constants.APP_STATUS+"/agency/" + agency.$key + "/isActive").set(state);
    //   }
    // });
    // console.log("trigger dialog");
    // this.modal.alert()
    //   .size('lg')
    //   .showClose(true)
    //   .title('A simple Alert style modal window')
    //   .body(`
    //         <h4>Alert is a classic (title/body/footer) 1 button modal window that
    //         does not block.</h4>
    //         <b>Configuration:</b>
    //         <ul>
    //             <li>Non blocking (click anywhere outside to dismiss)</li>
    //             <li>Size large</li>
    //             <li>Dismissed with default keyboard key (ESC)</li>
    //             <li>Close wth button click</li>
    //             <li>HTML content</li>
    //         </ul>`)
    //   .open().then(_=> {
    //     console.log("Here");
    // });

  }

  editAgency(agency) {
    this.router.navigate(['/system-admin/add-agency', {id: agency.$key}]);
  }

}
