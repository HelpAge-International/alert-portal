import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {RxHelper} from "../../utils/RxHelper";

@Component({
  selector: 'app-agency-admin-header',
  templateUrl: './agency-admin-header.component.html',
  styleUrls: ['./agency-admin-header.component.css']
})

export class AgencyAdminHeaderComponent implements OnInit, OnDestroy {

  private uid: string;
  private firstName: string = "";
  private lastName: string = "";
  private agencyName: string = "";
  private counter: number = 0;

  constructor(private af: AngularFire, private router: Router, private translate: TranslateService, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        let userSubscription = this.af.database.object(Constants.APP_STATUS+"/userPublic/" + this.uid).subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        });
        let agencySubscription = this.af.database.object(Constants.APP_STATUS+"/agency/" + this.uid).subscribe(agency => {
          this.agencyName = agency.name;
        });
        this.subscriptions.add(userSubscription)
        this.subscriptions.add(agencySubscription)
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription)
  }

  ngOnDestroy() {
      this.subscriptions.releaseAll();
  }

  logout() {
    console.log("logout");
    this.af.auth.logout();
  }

  test() {
    this.counter++;
    if (this.counter % 2 == 0) {
      this.translate.use("en");
    } else {
      this.translate.use("fr");
    }
  }

  goToNotifications() {
    this.router.navigateByUrl("agency-admin/agency-notifications/agency-notifications");
  }

}
