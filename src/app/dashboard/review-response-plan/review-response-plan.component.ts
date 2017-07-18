import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ResponsePlanService} from "../../services/response-plan.service";
import {ApprovalStatus, UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
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
  private countryId: string;
  private agencyId: string;
  private userType: number;
  private rejectToggleMap = new Map();
  private rejectComment: string = "";

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute, private userService: UserService, private responsePlanService: ResponsePlanService) {
  }

  ngOnInit() {
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

  private loadResponsePlan(responsePlanId: string) {
    // if (this.isDirector) {
    // this.userType = UserType.GlobalDirector;
    console.log(this.countryId);
    this.responsePlanService.getResponsePlan(this.countryId, responsePlanId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(responsePlan => {
        this.loadedResponseplan = responsePlan;
        this.handlePlanApproval(this.loadedResponseplan);
      });
    // }
    // else {
    //   // this.userService.getUserType(this.uid)
    //   //   .flatMap(userType => {
    //   //     this.userType = userType;
    //   //     return this.userService.getCountryId(Constants.USER_TYPE_PATH[userType], this.uid)
    //   //   })
    //   //   .takeUntil(this.ngUnsubscribe)
    //   //   .subscribe(countryId => {
    //   //     this.countryId = countryId;
    //   this.responsePlanService.getResponsePlan(this.countryId, responsePlanId)
    //     .takeUntil(this.ngUnsubscribe)
    //     .subscribe(responsePlan => {
    //       this.loadedResponseplan = responsePlan;
    //       this.handlePlanApproval(this.loadedResponseplan);
    //     });
    //   // })
    // }

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
          this.userService.getUser(partner.id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(user => {
              partner.name = user.firstName + " " + user.lastName;
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
    this.responsePlanService.updateResponsePlanApproval(this.userType, this.uid, this.countryId, this.responsePlanId, true, "", this.isDirector, this.loadedResponseplan.name, this.agencyId);
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
    this.responsePlanService.updateResponsePlanApproval(this.userType, this.uid, this.countryId, this.responsePlanId, false, this.rejectComment, this.isDirector, this.loadedResponseplan.name, this.agencyId);
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
