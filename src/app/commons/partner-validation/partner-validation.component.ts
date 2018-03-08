import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {Constants} from "../../utils/Constants";
import * as moment from "moment";
import {AlertMessageType, ResponsePlanSectors} from "../../utils/Enums";
import {PartnerOrganisationService} from "../../services/partner-organisation.service";
import {PartnerOrganisationModel} from "../../model/partner-organisation.model";
import {CommonService} from "../../services/common.service";
import {AlertMessageModel} from "../../model/alert-message.model";
import * as firebase from "firebase";
import {TranslateService} from "@ngx-translate/core";

declare var jQuery: any;

@Component({
  selector: 'app-partner-validation',
  templateUrl: './partner-validation.component.html',
  styleUrls: ['./partner-validation.component.css'],
  providers: [PartnerOrganisationService, CommonService]
})
export class PartnerValidationComponent implements OnInit, OnDestroy {


  private sectorIcons = ResponsePlanSectors;
  private sectorLabels = Constants.RESPONSE_PLANS_SECTORS;
  private COUNTRIES = Constants.COUNTRIES;
  private alertMessageType = AlertMessageType;


  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private accessToken: string;
  private partnerOrgId: string;
  private areaJson: {};
  private alertMessage: AlertMessageModel = null;
  private modelPartnerOrg: PartnerOrganisationModel = new PartnerOrganisationModel();

  constructor(private af: AngularFire,
              private router: Router,
              private orgService: PartnerOrganisationService,
              private commonService: CommonService,
              private route: ActivatedRoute,
              private translate : TranslateService) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["token"] && params["partnerId"]) {
          this.accessToken = params["token"];
          this.partnerOrgId = params["partnerId"];

          firebase.auth().signInAnonymously().catch(error => {
            console.log(error.message);
          });

          firebase.auth().onAuthStateChanged(user => {
            console.log("onAuthStateChanged");
            console.log(user.isAnonymous);
            if (user) {
              if (user.isAnonymous) {
                //Page accessed by the partner who doesn't have firebase account. Check the access token and grant the access
                this.af.database.object(Constants.APP_STATUS + "/partnerOrganisationValidation/" + this.partnerOrgId + "/validationToken")
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((validationToken) => {
                    if (validationToken) {
                      if (this.accessToken === validationToken.token) {
                        let expiry = validationToken.expiry;
                        let currentTime = moment.utc();
                        let tokenExpiryTime = moment.utc(expiry);

                        if (currentTime.isAfter(tokenExpiryTime)) {
                          this.navigateToLogin();
                          return;
                        }

                        this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                          .takeUntil(this.ngUnsubscribe)
                          .subscribe(areaJson => {
                            this.areaJson = areaJson;
                            this.loadPartnerOrgInfo(this.partnerOrgId);
                          });


                      } else {
                        this.navigateToLogin();
                      }
                    } else {
                      this.navigateToLogin();
                    }
                  });
              } else {
                console.log("not anonymous login");
                this.navigateToLogin();
              }

            } else {
              console.log("user not logged in");
              this.navigateToLogin();
            }
          });

        } else {
          console.log("not from email click");
          this.navigateToLogin();
        }
      });
  }

  showAffectedAreasForPartner() {
    jQuery("#view-areas").modal("show");
  }

  validatePartnership() {
    this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + this.partnerOrgId + "/isApproved").set(true).then(() => {
      this.alertMessage = new AlertMessageModel(this.translate.instant("SUCCESSFULLY_VALIDATE_PARTNERSHIP"), AlertMessageType.Success);
      setTimeout(() => {
        this.router.navigate(["/after-validation", {"partner":true}], {skipLocationChange:true});
      }, Constants.ALERT_REDIRECT_DURATION)
    }, error => {
      this.alertMessage = new AlertMessageModel(error.message);
    })

    this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + this.partnerOrgId + "/isActive").set(true);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadPartnerOrgInfo(partnerOrgId: string) {
    this.orgService.getPartnerOrganisation(partnerOrgId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(org => {
        this.modelPartnerOrg = org;
        this.modelPartnerOrg.projects.forEach(project => {
          project.sector = Object.keys(project.sector);
        });
      });
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
