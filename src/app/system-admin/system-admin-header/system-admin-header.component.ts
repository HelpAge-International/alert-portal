import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {RxHelper} from "../../utils/RxHelper";

@Component({
  selector: 'app-system-admin-header',
  templateUrl: 'system-admin-header.component.html',
  styleUrls: ['system-admin-header.component.css']
})

export class SystemAdminHeaderComponent implements OnInit,OnDestroy {

  uid: string;
  firstName: string = "";
  lastName: string = "";
  counter: number = 0;

  constructor(private af: AngularFire, private router: Router, private translate: TranslateService, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        let subscription = this.af.database.object(Constants.APP_STATUS+"/userPublic/" + this.uid).subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        });
        this.subscriptions.add(subscription)
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

}
