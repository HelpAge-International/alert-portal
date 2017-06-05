import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {Subject, Observable} from "rxjs";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css']
})

export class DirectorComponent implements OnInit, OnDestroy {

  private uid: string;

  private responsePlansForApproval: Observable<any[]>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();\

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.loadData();
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  planReview(planId) {
    this.router.navigate(["/dashboard/review-response-plan", {"id": planId}]);
  }

  /**
   * Private functions
   */

  private loadData() {
    // TODO -
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
