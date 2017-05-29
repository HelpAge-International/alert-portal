import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-review-response-plan',
  templateUrl: 'review-response-plan.component.html',
  styleUrls: ['review-response-plan.component.css']
})

export class ReviewResponsePlanComponent implements OnInit, OnDestroy {

  private uid: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
      } else {
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Private functions
   */

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}

