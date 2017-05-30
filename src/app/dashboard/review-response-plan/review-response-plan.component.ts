import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-review-response-plan',
  templateUrl: 'review-response-plan.component.html',
  styleUrls: ['review-response-plan.component.css']
})

export class ReviewResponsePlanComponent implements OnInit, OnDestroy {

  private uid: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private responsePlanId: string;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;
        this.route.params
          .takeUntil(this.ngUnsubscribe)
          .subscribe((params: Params) => {
            if (params["id"]) {
              this.responsePlanId = params["id"];
            }
          });
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

