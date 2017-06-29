import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {UserService} from "../../services/user.service";
import {UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-director-header',
  templateUrl: './director-header.component.html',
  styleUrls: ['./director-header.component.css']
})

export class DirectorHeaderComponent implements OnInit, OnDestroy {

  private NODE_TO_CHECK: string;

  private uid: string;
  private agencyId: string;
  private agencyName: string = "";

  private firstName: string = "";
  private lastName: string = "";

  private userPaths = Constants.USER_PATHS;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.NODE_TO_CHECK = this.userPaths[userType];
      if (this.NODE_TO_CHECK) {
        this.getAgencyName();
      }

      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        });
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

  goToHome() {
    this.router.navigateByUrl("/director");
  }

  /**
   * Private functions
   */

  private getAgencyName() {
    let promise = new Promise((res, rej) => {
      this.af.database.list(Constants.APP_STATUS + "/" + this.NODE_TO_CHECK + "/" + this.uid + '/agencyAdmin')
        .takeUntil(this.ngUnsubscribe)
        .subscribe((agencyIds: any) => {
          this.agencyId = agencyIds[0].$key ? agencyIds[0].$key : "";
          res(true);
          if (this.agencyId) {
            this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + '/name')
              .takeUntil(this.ngUnsubscribe)
              .subscribe((agencyName) => {
                this.agencyName = agencyName ? agencyName.$value : "Agency";
                res(true);
              });
          }
        });
    });
    return promise;
  }

}
