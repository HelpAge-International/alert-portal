import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {Constants} from "../../utils/Constants";
import * as moment from "moment";
import {UserType} from "../../utils/Enums";

@Component({
  selector: 'app-partner-validation',
  templateUrl: './partner-validation.component.html',
  styleUrls: ['./partner-validation.component.css']
})
export class PartnerValidationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private accessToken: string;
  private partnerOrgId: string;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .take(1)
      .subscribe((params: Params) => {
        if (params["token"] && params["partnerId"]) {
          this.accessToken = params["token"];
          this.partnerOrgId = params["partnerId"];

          // let invalid = true;
          // //Page accessed by the partner who doesn't have firebase account. Check the access token and grant the access
          // this.af.database.object(Constants.APP_STATUS + "/responsePlanValidation/" + this.responsePlanId + "/validationToken")
          //   .takeUntil(this.ngUnsubscribe)
          //   .subscribe((validationToken) => {
          //     if (validationToken) {
          //       if (this.accessToken === validationToken.token) {
          //         let expiry = validationToken.expiry;
          //         let currentTime = moment.utc();
          //         let tokenExpiryTime = moment.utc(expiry)
          //
          //         if (currentTime.isBefore(tokenExpiryTime))
          //           invalid = false;
          //       }
          //
          //       if (!invalid) {
          //         this.userType = UserType.PartnerOrganisation;
          //         this.uid = this.partnerOrganisationId;
          //         this.isDirector = false;
          //
          //         this.loadResponsePlan(this.responsePlanId);
          //       } else {
          //         this.navigateToLogin();
          //       }
          //     } else {
          //       this.navigateToLogin();
          //     }
          //   });

        }
      });
  }

  ngOnDestroy(): void {
  }

}