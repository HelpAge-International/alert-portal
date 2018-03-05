import {Component, OnDestroy, OnInit, ElementRef, ViewChild} from "@angular/core";
import {Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ResponsePlanService} from "../../services/response-plan.service";
import {ApprovalStatus, UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import * as moment from "moment";
import * as firebase from "firebase";
import {NetworkService} from "../../services/network.service";
import {ModelAgency} from "../../model/agency.model";

declare var jQuery: any;

@Component({
  selector: 'app-review-response-plan',
  templateUrl: 'review-response-plan.component.html',
  styleUrls: ['review-response-plan.component.css'],
  providers: [ResponsePlanService]
})

export class ReviewResponsePlanComponent implements OnInit, OnDestroy {
  @ViewChild('rejectPlanScrollContainer') private rejectPlanScrollContainer: ElementRef;

  private isDirector: boolean;

  private uid: string;
  private ApprovalStatus = ApprovalStatus;
  private Approval_Status_Name = Constants.APPROVAL_STATUS

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private responsePlanId: string;
  private regionId: string;
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

  private networkCountryId: string;
  private agencyCountryMap = new Map<string, string>();
  private agencyRegionMap = new Map<string, string>();
  private agenciesNeedToApprove: ModelAgency[];

  private isLocalAgency = false;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private networkService: NetworkService,
              private responsePlanService: ResponsePlanService) {
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

        if (this.accessToken) {
          let invalid = true;

          firebase.auth().signInAnonymously().catch(error => {
            console.log(error.message);
          });

          firebase.auth().onAuthStateChanged(user => {

            if (user) {
              if (user.isAnonymous) {
                //Page accessed by the partner who doesn't have firebase account. Check the access token and grant the access
                this.af.database.object(Constants.APP_STATUS + "/responsePlanValidation/" + this.responsePlanId + "/validationToken")
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe((validationToken) => {
                    if (validationToken) {
                      if (this.accessToken === validationToken.token) {
                        let expiry = validationToken.expiry;
                        let currentTime = moment.utc();
                        let tokenExpiryTime = moment.utc(expiry);

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
                console.log("not anonymous login");
                this.navigateToLogin();
              }

            } else {
              console.log("user not logged in");
              this.navigateToLogin();
            }
          });

        } else {
          this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId) => {
            this.uid = user.auth.uid;
            this.userType = userType;
            this.agencyId = agencyId;
            this.countryId = countryId;

            if(this.userType == UserType.LocalAgencyDirector){
              this.isLocalAgency = true;
            }
            if (this.userType === UserType.RegionalDirector) {
              this.userService.getRegionId(Constants.USER_PATHS[this.userType], this.uid)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(regionId => {
                  this.regionId = regionId;
                });
            }
            this.route.params
              .takeUntil(this.ngUnsubscribe)
              .subscribe((params: Params) => {
                if (params["isDirector"]) {
                  this.isDirector = params["isDirector"];
                }
                if (params["countryId"]) {
                  this.countryId = params["countryId"];
                }
                if (params["networkCountryId"]) {
                  this.networkCountryId = params["networkCountryId"];
                }
                if (params["id"]) {
                  this.responsePlanId = params["id"];
                  if(this.isLocalAgency){
                    this.loadResponsePlanLocalAgency(this.responsePlanId);
                  }else{
                    this.loadResponsePlan(this.responsePlanId);
                  }
                  
                }
              });
          });
        }

      });
  }

  private loadResponsePlan(responsePlanId: string) {
    console.log(this.countryId);
    let id = this.networkCountryId ? this.networkCountryId : this.countryId;
    this.responsePlanService.getResponsePlan(id, responsePlanId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(responsePlan => {
        this.loadedResponseplan = responsePlan;
        console.log(this.loadedResponseplan);
        this.handlePlanApproval(this.loadedResponseplan);
        if (this.networkCountryId) {
          this.handleNetworkAgencyApproval(responsePlan);
        }
      });
  }

  private loadResponsePlanLocalAgency(responsePlanId: string) {

    let id = this.agencyId;
    this.responsePlanService.getResponsePlan(id, responsePlanId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(responsePlan => {
        this.loadedResponseplan = responsePlan;
        console.log(this.loadedResponseplan);
        this.handlePlanApproval(this.loadedResponseplan);
        
      });
  }

  private handleNetworkAgencyApproval(plan) {
    let agencyCountryObj = plan.participatingAgencies;
    this.agenciesNeedToApprove = [];
    Object.keys(agencyCountryObj).forEach(agencyId => {
      this.agencyCountryMap.set(agencyId, agencyCountryObj[agencyId]);
      this.userService.getAgencyModel(agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(model => {
          this.agenciesNeedToApprove.push(model);
        });
      //prepare agency region map
      this.networkService.getRegionIdForCountry(agencyCountryObj[agencyId])
        .takeUntil(this.ngUnsubscribe)
        .subscribe(regionId => {
          this.agencyRegionMap.set(agencyId, regionId);
        });
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
        this.partnerApproveList.forEach(partner => {
          this.af.database.object(Constants.APP_STATUS + "/userPublic/" + partner.id, {preserveSnapshot: true})
            .take(1)
            .subscribe(snap => {
              if (snap.val()) {
                this.userService.getUser(partner.id)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(user => {
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

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};
          


    // Change from Amber to Green 
    if(this.loadedResponseplan['timeTracking']['timeSpentInAmber'] && this.loadedResponseplan['timeTracking']['timeSpentInAmber'].findIndex(x => x.finish == -1) != -1){
      let index = this.loadedResponseplan['timeTracking']['timeSpentInAmber'].findIndex(x => x.finish == -1);
      this.loadedResponseplan['timeTracking']['timeSpentInAmber'][index].finish = currentTime
      if(!this.loadedResponseplan['timeTracking']['timeSpentInGreen']){
        this.loadedResponseplan['timeTracking']['timeSpentInGreen'] = [] 
      }
      this.loadedResponseplan['timeTracking']['timeSpentInGreen'].push(newTimeObject)

      if(this.isLocalAgency){
        this.af.database.object(Constants.APP_STATUS + '/responsePlan/' + this.agencyId + '/' + this.responsePlanId + '/timeTracking')
        .update(this.loadedResponseplan['timeTracking'])
      }else{
        this.af.database.object(Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.responsePlanId + '/timeTracking')
        .update(this.loadedResponseplan['timeTracking'])
      }
    }

    if (this.accessToken) {
      if(this.isLocalAgency){
        this.responsePlanService.updateResponsePlanApproval(UserType.PartnerUser, this.uid, this.agencyId, this.responsePlanId, true, "", this.isDirector, this.loadedResponseplan.name, this.agencyId, true);
      }else{
        this.responsePlanService.updateResponsePlanApproval(UserType.PartnerUser, this.uid, this.countryId, this.responsePlanId, true, "", this.isDirector, this.loadedResponseplan.name, this.agencyId, true);
      }
    } else {
      let approvalUid = this.getRightUidForApproval();
      let id = this.isLocalAgency ? this.agencyId : this.networkCountryId ? this.networkCountryId : this.countryId;
      if(this.isLocalAgency){
        this.responsePlanService.updateResponsePlanApproval(UserType.CountryDirector, approvalUid, id, this.responsePlanId, true, "", this.isDirector, this.loadedResponseplan.name, this.agencyId, false);
      }else{
        this.responsePlanService.updateResponsePlanApproval(this.userType, approvalUid, id, this.responsePlanId, true, "", this.isDirector, this.loadedResponseplan.name, this.agencyId, false);
      }
      
    }
  }

  private getRightUidForApproval() {
    let approvalUid = "";
    if (this.userType === UserType.GlobalDirector) {
      approvalUid = this.agencyId;
    } else if (this.userType === UserType.RegionalDirector) {
      approvalUid = this.regionId;
    } else if (this.userType === UserType.CountryDirector) {
      if(this.isLocalAgency){
        approvalUid = this.agencyId;
      }else{
        approvalUid = this.countryId;
      }
    } else if (this.userType === UserType.PartnerUser) {
      approvalUid = this.uid;
    }
    return approvalUid;
  }

  rejectPlan() {
    let toggleValue = this.rejectToggleMap.get(this.responsePlanId);
    if (toggleValue) {
      //this.rejectToggleMap.set(this.responsePlanId, !toggleValue);
    } else {
      this.rejectToggleMap.set(this.responsePlanId, true);
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      this.rejectPlanScrollContainer.nativeElement.scrollTop = this.rejectPlanScrollContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.log(err);
    }
  }

  triggerRejctDialog() {
    jQuery("#rejectPlan").modal("show");
  }

  confirmReject() {
    jQuery("#rejectPlan").modal("hide");

    let currentTime = new Date().getTime()
    let newTimeObject = {start: currentTime, finish: -1};

    // Change from Amber to Red
    if(this.loadedResponseplan['timeTracking']['timeSpentInAmber'] && this.loadedResponseplan['timeTracking']['timeSpentInAmber'].findIndex(x => x.finish == -1) != -1){
      let index = this.loadedResponseplan['timeTracking']['timeSpentInAmber'].findIndex(x => x.finish == -1);
      this.loadedResponseplan['timeTracking']['timeSpentInAmber'][index].finish = currentTime
      if(!this.loadedResponseplan['timeTracking']['timeSpentInRed']){
        this.loadedResponseplan['timeTracking']['timeSpentInRed'] = []
      }
      this.loadedResponseplan['timeTracking']['timeSpentInRed'].push(newTimeObject)

      if(this.isLocalAgency){
        this.af.database.object(Constants.APP_STATUS + '/responsePlan/' + this.agencyId + '/' + this.responsePlanId + '/timeTracking')
        .update(this.loadedResponseplan['timeTracking'])
      }else{
        this.af.database.object(Constants.APP_STATUS + '/responsePlan/' + this.countryId + '/' + this.responsePlanId + '/timeTracking')
        .update(this.loadedResponseplan['timeTracking'])
      }
      
    }

    if (this.accessToken) {
      if(this.isLocalAgency){
        this.responsePlanService.updateResponsePlanApproval(UserType.PartnerUser, this.uid, this.agencyId, this.responsePlanId, false, this.rejectComment, this.isDirector, this.loadedResponseplan.name, this.agencyId, true);
      }else{
        this.responsePlanService.updateResponsePlanApproval(UserType.PartnerUser, this.uid, this.countryId, this.responsePlanId, false, this.rejectComment, this.isDirector, this.loadedResponseplan.name, this.agencyId, true);
      }
      
    } else {
      let approvalUid = this.getRightUidForApproval();
      let id = this.isLocalAgency ? this.agencyId : this.networkCountryId ? this.networkCountryId : this.countryId;
      this.responsePlanService.updateResponsePlanApproval(this.userType, approvalUid, id, this.responsePlanId, false, this.rejectComment, this.isDirector, this.loadedResponseplan.name, this.agencyId, false);
    }
  }

  hideApproveButton(): boolean {
    let hiddenButton = false;
    if (this.accessToken && this.partnerOrganisationId) {
      this.partnerApproveList.forEach(item => {
        if (item.id === this.partnerOrganisationId && item.status === ApprovalStatus.Approved) {
          hiddenButton = true;
        }
      });
    }
    return hiddenButton;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  shouldShowSuccess(plan, agencyId): boolean {
    let success = true;
    if (plan.approval && plan.approval['countryDirector'] && plan.approval['countryDirector'][this.agencyCountryMap.get(agencyId)] != ApprovalStatus.Approved) {
      success = false;
    }
    if (plan.approval && plan.approval['regionDirector'] && plan.approval['regionDirector'][this.agencyRegionMap.get(agencyId)] && plan.approval['regionDirector'][this.agencyRegionMap.get(agencyId)] != ApprovalStatus.Approved) {
      success = false;
    }
    if (plan.approval && plan.approval['globalDirector'] && plan.approval['globalDirector'][agencyId] && plan.approval['globalDirector'][agencyId] != ApprovalStatus.Approved) {
      success = false;
    }
    return success;
  }

  approvalText(plan, agencyId): string {
    let text = "tt";
    if (plan.approval && !plan.approval['countryDirector']) {
      text = "RESPONSE_PLANS.HOME.REQUIRE_SUBMISSION";
    }
    if (plan.approval && plan.approval['countryDirector'] && plan.approval['countryDirector'][this.agencyCountryMap.get(agencyId)] == ApprovalStatus.WaitingApproval ||
      plan.approval && plan.approval['regionDirector'] && plan.approval['regionDirector'][this.agencyRegionMap.get(agencyId)] == ApprovalStatus.WaitingApproval ||
      plan.approval && plan.approval['globalDirector'] && plan.approval['globalDirector'][agencyId] == ApprovalStatus.WaitingApproval) {
      text = "RESPONSE_PLANS.HOME.WAITING_APPROVAL";
    }
    if (this.shouldShowSuccess(plan, agencyId)) {
      text = "RESPONSE_PLANS.HOME.APPROVED";
    }
    return text;
  }

  /**
   * Private functions
   */

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH).then();
  }

}
