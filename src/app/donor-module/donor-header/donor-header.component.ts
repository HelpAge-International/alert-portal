import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {UserType} from "../../utils/Enums";

@Component({
  selector: 'app-donor-header',
  templateUrl: './donor-header.component.html',
  styleUrls: ['./donor-header.component.css']
})

export class DonorHeaderComponent implements OnInit {

  private NODE_TO_CHECK: string;

  private uid: string;
  private agencyId: string;
  private agencyName: string = "";

  private firstName: string = "";
  private lastName: string = "";

  private userPaths = Constants.USER_PATHS;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
            this.firstName = user.firstName;
            this.lastName = user.lastName;
          });

        this.userService.getUserType(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(userType => {
            console.log(UserType[userType]);
            this.NODE_TO_CHECK = this.userPaths[userType];
            if (this.NODE_TO_CHECK) {
              this.getAgencyName();
            }
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
