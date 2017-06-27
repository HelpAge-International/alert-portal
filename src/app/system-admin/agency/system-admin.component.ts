import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ActivatedRoute, Router} from "@angular/router";
import {Modal} from "angular2-modal/plugins/bootstrap";
import {Overlay} from "angular2-modal";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
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
  private doActivate;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.agencies = this.af.database.list(Constants.APP_STATUS + "/agency");
    });
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  update(agency, doActivate) {
    this.agencyToUpdate = agency;
    this.doActivate = doActivate;
    jQuery("#update-agency").modal("show");
  }

  toggleActive() {
    let state: boolean = !this.agencyToUpdate.isActive;
    console.log(this.agencyToUpdate.isActive);
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyToUpdate.$key + "/isArchived").set(state).then(_ => {
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
