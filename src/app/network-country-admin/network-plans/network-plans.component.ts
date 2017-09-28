import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType, ApprovalStatus} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ResponsePlanService} from "../../services/response-plan.service";
import {UserService} from "../../services/user.service";
import {AgencyService} from "../../services/agency-service.service";
import {TranslateService} from "@ngx-translate/core";
import {PartnerOrganisationService} from "../../services/partner-organisation.service";
import * as moment from "moment";

declare const jQuery: any;

@Component({
  selector: 'app-network-plans',
  templateUrl: './network-plans.component.html',
  styleUrls: ['./network-plans.component.css'],
  providers: [ResponsePlanService, PartnerOrganisationService]
})
export class NetworkPlansComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;


  //copy over from response plan
  private isViewing: boolean;
  private isGlobalDirectorMap = new Map<string, boolean>();
  private isRegionalDirectorMap = new Map<string, boolean>();
  private dialogTitle: string;
  private dialogContent: string;
  private dialogEditingUserName: string;
  private dialogEditingUserEmail: string;
  private uid: string;
  private activePlans: any[] = [];
  private archivedPlans: FirebaseListObservable<any[]>;
  private planToApproval: any;
  private userType: number = -1;
  private hideWarning: boolean = true;
  private waringMessage: string;
  private countryId: string;
  private agencyId: string;
  private notesMap = new Map();
  private needShowDialog: boolean;
  private partnersMap = new Map();
  private partnersApprovalMap = new Map<string, string>();
  private responsePlanToEdit: any;
  private approvalsList: any[] = [];
  private directorSubmissionRequireMap = new Map<number, boolean>();
  private networkPlanExpireDuration: number;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private planService: ResponsePlanService,
              private userService: UserService,
              private agencyService: AgencyService,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private partnerService: PartnerOrganisationService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      // this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .flatMap(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          return this.networkService.getNetworkResponsePlanClockSettingsDuration(this.networkId);
        })
        .subscribe(duration => {
          this.networkPlanExpireDuration = duration;
          // this.handleRequireSubmissionTagForDirectors();
          this.getResponsePlans(this.networkCountryId);
        });

      // this.networkService.getSelectedIdObj(user.uid)
      //   .takeUntil(this.ngUnsubscribe)
      //   .subscribe(selection => {
      //     this.networkId = selection["id"];
      //     this.networkCountryId = selection["networkCountryId"];
      //
      //     this.networkService.getNetworkResponsePlanClockSettingsDuration(this.networkId)
      //       .takeUntil(this.ngUnsubscribe)
      //       .subscribe(duration => {
      //         this.networkPlanExpireDuration = duration;
      //         this.handleRequireSubmissionTagForDirectors();
      //         this.getResponsePlans(this.countryId);
      //       });
      //
      //   })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getResponsePlans(id: string) {
    /*Active Plans*/
    this.planService.getPlans(id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(plans => {
        this.activePlans = [];
        plans.forEach(plan => {
          if (plan.isActive) {
            this.activePlans.push(plan);
            this.getNotes(plan);

            if (this.networkPlanExpireDuration && plan.timeUpdated && plan.status === ApprovalStatus.Approved) {
              this.expirePlanIfNeed(plan, id, this.networkPlanExpireDuration);
            }
          }
        });
        this.checkHaveApprovedPartners(this.activePlans);
        this.getNeedToApprovedPartners(this.activePlans);
      });

    /*Archived Plans*/
    this.planService.getArchivedPlans(id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(plans => {
        this.archivedPlans = plans;
      });
  }

  private expirePlanIfNeed(plan: any, countryId: string, agencyPlanExpireDuration: number) {
    let timeNow = moment().utc().valueOf();
    if ((timeNow - plan.timeUpdated) > agencyPlanExpireDuration) {
      console.log("expire this plan");
      this.planService.expirePlan(countryId, plan.$key);
    }
  }

  private getNotes(plan) {
    if (plan.status == ApprovalStatus.NeedsReviewing) {
      this.planService.getNotesForPlan(plan.$key)
        .do(list => {
          list.forEach(note => {
            this.userService.getUser(note.uploadBy)
              .first()
              .subscribe(user => {
                if (user) {
                  note["uploadByName"] = user.firstName + " " + user.lastName;
                } else {
                  this.partnerService.getPartnerOrganisation(note.uploadBy)
                    .first()
                    .subscribe(org => {
                      note["uploadByName"] = org.organisationName;
                    });
                }
              });
          });
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(list => {
          this.notesMap.set(plan.$key, list);
        });
    }
  }

  private checkHaveApprovedPartners(activePlans: any[]) {
    activePlans.forEach(plan => {
      //deal organisations
      let partnerIds = plan.partnerOrganisations;
      if (partnerIds) {
        partnerIds.forEach(partnerId => {
          this.planService.getPartnerOrgnisation(partnerId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(partner => {
              if (partner.isApproved) {
                this.partnersMap.set(plan.$key, partner.isApproved);
              }
            });
        });
      }

      //deal directors
      if (plan.approval) {
        let approvalKeys = Object.keys(plan.approval).filter(key => key != "partner");
        if (approvalKeys.length == 2 && approvalKeys.includes("globalDirector")) {
          this.isGlobalDirectorMap.set(plan.$key, true);
        } else if (approvalKeys.length == 2 && approvalKeys.includes("regionDirector")) {
          this.isRegionalDirectorMap.set(plan.$key, true);
        } else if (approvalKeys.length == 3) {
          this.isGlobalDirectorMap.set(plan.$key, true);
          this.isRegionalDirectorMap.set(plan.$key, true);
        }
      }
    });
  }

  private getNeedToApprovedPartners(activePlans: any[]) {
    activePlans.forEach(plan => {
      if (plan.partnerOrganisations) {
        let partnerOrgIds = Object.keys(plan.partnerOrganisations).map(key => plan.partnerOrganisations[key]);
        partnerOrgIds.forEach(partnerOrgId => {
          //check has user or not first
          this.partnerService.getPartnerOrganisation(partnerOrgId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(org => {
              if (org.partners) {
                this.planService.getPartnerBasedOnOrgId(partnerOrgId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(partnerId => {
                    this.partnersApprovalMap.set(partnerOrgId, partnerId);
                  });
              } else {
                this.partnersApprovalMap.set(org.id, org.id);
              }
            });
        })
      }
    });
  }

  exportStartFund(responsePlan) {
    this.router.navigate(['/export-start-fund', {id: responsePlan.$key}]);
  }

  exportProposal(responsePlan, isExcel: boolean) {
    if (isExcel) {
      this.router.navigate(['/export-proposal', {id: responsePlan.$key, excel: 1}]);
    } else {
      this.router.navigate(['/export-proposal', {id: responsePlan.$key, excel: 0}]);
    }
  }

  archivePlan(plan) {
    //same as edit, need to reset approval status and validation process
    let updateData = {};
    updateData["/responsePlan/" + this.networkCountryId + "/" + plan.$key + "/approval"] = null;
    updateData["/responsePlan/" + this.networkCountryId + "/" + plan.$key + "/isActive"] = false;
    updateData["/responsePlanValidation/" + plan.$key] = null;
    this.networkService.updateNetworkField(updateData);
    // this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/isActive").set(false);
  }

  activatePlan(plan) {
    console.log("activate plan");
    this.networkService.setNetworkField("/responsePlan/" + this.networkCountryId + "/" + plan.$key + "/isActive", true);
    this.networkService.setNetworkField("/responsePlan/" + this.networkCountryId + "/" + plan.$key + "/status", ApprovalStatus.NeedsReviewing);
    this.planService.getPlanApprovalData(this.networkCountryId, plan.$key)
      .map(list => {
        let newList = [];
        list.forEach(item => {
          let data = {};
          data[item.$key] = Object.keys(item)[0];
          newList.push(data);
        });
        return newList;
      })
      .first()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(approvalList => {
        for (let approval of approvalList) {
          if (approval["countryDirector"]) {
            this.networkService.setNetworkField("/responsePlan/" + this.networkCountryId + "/" + plan.$key + "/approval/countryDirector/" + approval["countryDirector"], ApprovalStatus.NeedsReviewing);
          }
          if (approval["regionDirector"]) {
            this.networkService.setNetworkField("/responsePlan/" + this.networkCountryId + "/" + plan.$key + "/approval/regionDirector/" + approval["regionDirector"], ApprovalStatus.NeedsReviewing);
          }
          if (approval["globalDirector"]) {
            this.networkService.setNetworkField("/responsePlan/" + this.networkCountryId + "/" + plan.$key + "/approval/globalDirector/" + approval["globalDirector"], ApprovalStatus.NeedsReviewing);
          }
        }
      });
  }

  checkStatus(plan): boolean {
    let showSubmit = true;
    if (plan.approval) {
      showSubmit = !Object.keys(plan.approval).includes("countryDirector");
    }
    return showSubmit;
  }

  convertToInt(value): number {
    return parseInt(value);
  }

}
