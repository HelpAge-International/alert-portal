import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ResponsePlanService} from "../../services/response-plan.service";
import {ApprovalStatus, UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import * as moment from "moment";
declare const jQuery: any;

@Component({
  selector: 'app-review-response-plan',
  templateUrl: 'review-response-plan.component.html',
  styleUrls: ['review-response-plan.component.css'],
  providers: [ResponsePlanService]
})

export class ReviewResponsePlanComponent implements OnInit, OnDestroy {
  private isDirector: boolean;

  private uid: string;
  private ApprovalStatus = ApprovalStatus;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private responsePlanId: string;
  private loadedResponseplan: any;
  private partnerApproveList = [];
  private countryDirectorApproval = [];
  private regionalDirectorApproval = [];
  private globalDirectorApproval = [];
  private accessToken: string;
  private partnerOrganisationId: string;
  private countryId: string;
  private agencyId: string;
  private userType: number;
  private rejectToggleMap = new Map();
  private rejectComment: string = "";

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute, private userService: UserService, private responsePlanService: ResponsePlanService) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["token"]) {
          this.accessToken = params["token"];
        }

        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }

        // if (params["agencyId"]) {
        //   this.agencyId = params["agencyId"];
        // }

        if (params["partnerOrganisationId"]) {
          this.partnerOrganisationId = params["partnerOrganisationId"];
        }

        if (params["id"]) {
          this.responsePlanId = params["id"];
        }
      });

    console.log(this.accessToken);
    if (this.accessToken) {
      let invalid = true;
      //Page accessed by the partner who doesn't have firebase account. Check the access token and grant the access
      this.af.database.object(Constants.APP_STATUS + "/responsePlanValidation/" + this.responsePlanId + "/validationToken")
        .takeUntil(this.ngUnsubscribe)
        .subscribe((validationToken) => {
          if (validationToken) {
            if (this.accessToken === validationToken.token) {
              let expiry = validationToken.expiry;
              let currentTime = moment.utc();
              let tokenExpiryTime = moment.utc(expiry)

              if (currentTime.isBefore(tokenExpiryTime))
                invalid = false;
            }

            if (!invalid) {
              this.userType = UserType.PartnerOrganisation;
              this.uid = this.partnerOrganisationId;
              this.isDirector = false;

              this.loadResponsePlan(this.responsePlanId);
            } else {
              this.navigateToLogin();
            }
          } else {
            this.navigateToLogin();
          }
        });
    } else {
      this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
        this.uid = user.auth.uid;
        this.userType = userType;
        this.agencyId = agencyId;
        this.countryId = countryId;
        // this.userService.getAgencyId(Constants.USER_PATHS[userType], this.uid).subscribe(agencyId => { this.agencyId = agencyId});
        this.route.params
          .takeUntil(this.ngUnsubscribe)
          .subscribe((params: Params) => {
            if (params["isDirector"]) {
              this.isDirector = params["isDirector"];
            }
            if (params["countryId"]) {
              this.countryId = params["countryId"];
            }
            if (params["id"]) {
              this.responsePlanId = params["id"];
              this.loadResponsePlan(this.responsePlanId);
            }
          });
      });
    }
  }

  private loadResponsePlan(responsePlanId: string) {
    console.log(this.countryId);
    this.responsePlanService.getResponsePlan(this.countryId, responsePlanId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(responsePlan => {
        this.loadedResponseplan = responsePlan;
        this.handlePlanApproval(this.loadedResponseplan);
      });
  }

  private handlePlanApproval(responsePlan) {
    if (responsePlan.approval) {

      //partner approval
      if (responsePlan.approval.partner) {
        let partners = responsePlan.approval.partner;
        this.partnerApproveList = Object.keys(partners).map(key => {
          let item = {};
          item["id"] = key;
          item["name"] = "";
          item["status"] = partners[key];
          return item;
        });
        console.log(this.partnerApproveList);
        this.partnerApproveList.forEach(partner => {
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + partner.id, {preserveSnapshot: true})
            .take(1)
            .subscribe(snap => {
              if (snap.val()) {
                this.userService.getUser(partner.id)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(user => {
                    console.log(user)
                    partner.name = user.firstName + " " + user.lastName;
                  });
              } else {
                this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + partner.id)
                  .first()
                  .subscribe(org => {
                    partner.name = org.organisationName;
                  });
              }
            });

        })
      }

      //country director approval
      if (responsePlan.approval.countryDirector) {
        let countryDirector = responsePlan.approval.countryDirector;
        this.countryDirectorApproval = Object.keys(countryDirector).map(key => {
          let item = {};
          item["id"] = key;
          item["status"] = countryDirector[key];
          return item;
        });
      }

      //regional director approval
      if (responsePlan.approval.regionDirector) {
        let regionDirector = responsePlan.approval.regionDirector;
        this.regionalDirectorApproval = Object.keys(regionDirector).map(key => {
          let item = {};
          item["id"] = key;
          item["status"] = regionDirector[key];
          return item;
        });
      }

      //global director approval
      if (responsePlan.approval.globalDirector) {
        let globalDirector = responsePlan.approval.globalDirector;
        this.globalDirectorApproval = Object.keys(globalDirector).map(key => {
          let item = {};
          item["id"] = key;
          item["status"] = globalDirector[key];
          return item;
        });
      }
    }
  }

  approvePlan() {
    if (this.accessToken) {
      this.responsePlanService.updateResponsePlanApproval(UserType.PartnerUser, this.uid, this.countryId, this.responsePlanId, true, "", this.isDirector, this.loadedResponseplan.name, this.agencyId, true);
    } else {
      this.responsePlanService.updateResponsePlanApproval(this.userType, this.uid, this.countryId, this.responsePlanId, true, "", this.isDirector, this.loadedResponseplan.name, this.agencyId, false);
    }
  }

  rejectPlan() {
    console.log("reject plan");
    let toggleValue = this.rejectToggleMap.get(this.responsePlanId);
    if (toggleValue) {
      this.rejectToggleMap.set(this.responsePlanId, !toggleValue);
    } else {
      this.rejectToggleMap.set(this.responsePlanId, true);
    }
  }

  triggerRejctDialog() {
    jQuery("#rejectPlan").modal("show");
  }

  confirmReject() {
    jQuery("#rejectPlan").modal("hide");
    if (this.accessToken) {
      this.responsePlanService.updateResponsePlanApproval(UserType.PartnerUser, this.uid, this.countryId, this.responsePlanId, false, this.rejectComment, this.isDirector, this.loadedResponseplan.name, this.agencyId, true);
    } else {
      this.responsePlanService.updateResponsePlanApproval(this.userType, this.uid, this.countryId, this.responsePlanId, false, this.rejectComment, this.isDirector, this.loadedResponseplan.name, this.agencyId, false);
    }
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
