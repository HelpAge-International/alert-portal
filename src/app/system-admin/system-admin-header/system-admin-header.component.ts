import {Component, OnInit, OnDestroy} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs";

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

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router, private translate: TranslateService) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.af.database.object(Constants.APP_STATUS+"/userPublic/" + this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        });
      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
