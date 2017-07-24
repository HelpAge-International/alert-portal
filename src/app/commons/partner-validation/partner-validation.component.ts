import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {Constants} from "../../utils/Constants";
import * as moment from "moment";
import {UserType} from "../../utils/Enums";
import {PartnerOrganisationService} from "../../services/partner-organisation.service";
import {PartnerOrganisationModel} from "../../model/partner-organisation.model";

@Component({
  selector: 'app-partner-validation',
  templateUrl: './partner-validation.component.html',
  styleUrls: ['./partner-validation.component.css']
})
export class PartnerValidationComponent implements OnInit, OnDestroy {

  private sectorIcons = Constants.RESPONSE_PLANS_SECTORS_ICONS;
  private sectorLabels = Constants.RESPONSE_PLANS_SECTORS;


  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private accessToken: string;
  private partnerOrgId: string;
  private modelPartnerOrg: PartnerOrganisationModel = new PartnerOrganisationModel();

  constructor(private af: AngularFire,
              private router: Router,
              private orgService: PartnerOrganisationService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .take(1)
      .subscribe((params: Params) => {
        if (params["token"] && params["partnerId"]) {
          this.accessToken = params["token"];
          this.partnerOrgId = params["partnerId"];
          console.log(this.accessToken);

          //Page accessed by the partner who doesn't have firebase account. Check the access token and grant the access
          this.af.database.object(Constants.APP_STATUS + "/partnerOrganisationValidation/" + this.partnerOrgId + "/validationToken")
            .takeUntil(this.ngUnsubscribe)
            .subscribe((validationToken) => {
              if (validationToken) {
                console.log("has valdiation token");
                if (this.accessToken === validationToken.token) {
                  console.log("token is right one")
                  let expiry = validationToken.expiry;
                  let currentTime = moment.utc();
                  let tokenExpiryTime = moment.utc(expiry);

                  if (currentTime.isAfter(tokenExpiryTime)) {
                    console.log("time expired")
                    this.navigateToLogin();
                    return;
                  }

                  console.log("load pratner org info")
                  this.loadPartnerOrgInfo(this.partnerOrgId);

                } else {
                  this.navigateToLogin();
                }
              } else {
                this.navigateToLogin();
              }
            });
        } else {
          this.navigateToLogin();
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadPartnerOrgInfo(partnerOrgId: string) {
    this.orgService.getPartnerOrganisation(partnerOrgId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(org =>{
        console.log(org);
        this.modelPartnerOrg = org;
      });
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
