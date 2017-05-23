import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {Modal} from "angular2-modal/plugins/bootstrap";
import {Overlay} from "angular2-modal";
import {Subject} from "rxjs";
declare var jQuery: any;

@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})

export class SystemAdminComponent implements OnInit, OnDestroy {

  agencies: FirebaseListObservable<any>;
  uid: string;
  private agencyToUpdate;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(x => {
      if (x) {
        this.uid = x.auth.uid;
        console.log("uid: " + this.uid);
        this.agencies = this.af.database.list(Constants.APP_STATUS + "/agency");
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  update(agency) {
    this.agencyToUpdate = agency;
    jQuery("#update-agency").modal("show");
  }

  toggleActive() {
    let state: boolean = !this.agencyToUpdate.isActive;
    console.log(this.agencyToUpdate.isActive);
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyToUpdate.$key + "/isActive").set(state).then(_ => {
      console.log("Agency state updated");
      jQuery("#update-agency").modal("hide");
    });
  }

  closeModal() {
    jQuery("#update-agency").modal("hide");
  }

  editAgency(agency) {
    this.router.navigate(['/system-admin/add-agency', {id: agency.$key}]);
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
