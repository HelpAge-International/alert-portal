import {ActivatedRoute, Router} from "@angular/router";
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../utils/Constants";
import {ApprovalStatus, UserType} from "../utils/Enums";
import {Observable} from "rxjs/Observable";
import set = Reflect.set;
import {ResponsePlanService} from "../services/response-plan.service";
import {Subject} from "rxjs/Subject";
import {UserService} from "../services/user.service";
import {PageControlService} from "../services/pagecontrol.service";
import { MessageModel } from "../model/message.model";
import { TranslateService } from "@ngx-translate/core";
import { NotificationService } from "../services/notification.service";
declare const jQuery: any;

@Component({
  selector: 'app-response-plans',
  templateUrl: './response-plans.component.html',
  styleUrls: ['./response-plans.component.css'],
  providers: [ResponsePlanService]
})

export class ResponsePlansComponent implements OnInit, OnDestroy {

  @Input() isViewing: boolean;
  @Input() countryIdForViewing: string;
  @Input() agencyIdForViewing: string;
  @Input() canCopy: boolean;
  @Input() agencyOverview: boolean;

  private isGlobalDirectorMap = new Map<string, boolean>();

  private dialogTitle: string;
  private dialogContent: string;
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
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private partnersMap = new Map();

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private service: ResponsePlanService,
              private userService: UserService,
              private notificationService: NotificationService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      if (this.isViewing) {
        this.countryId = this.countryIdForViewing;
        this.agencyId = this.agencyIdForViewing;
        this.getResponsePlans(this.countryId);
      } else {
        this.userType = userType;
        let userPath = Constants.USER_PATHS[userType];
        this.getSystemAgencyCountryIds(userPath);
      }
    });
  }

  private getSystemAgencyCountryIds(userPath: string) {
    this.userService.getAgencyId(userPath, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyId => {
        this.agencyId = agencyId;
        this.af.database.object(Constants.APP_STATUS + "/" + userPath + "/" + this.uid + "/countryId")
          .takeUntil(this.ngUnsubscribe)
          .subscribe((countryId) => {
            this.countryId = countryId.$value;
            this.getResponsePlans(this.countryId);
          });
      });

  }

  private getResponsePlans(id: string) {
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id, {
      query: {
        orderByChild: "isActive",
        equalTo: true
      }
    })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(plans => {
        this.activePlans = plans;
        for (let x of this.activePlans) {
          this.getNotes(x);
        }
        this.checkHaveApprovedPartners(this.activePlans);
      });

    this.archivedPlans = this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id, {
      query: {
        orderByChild: "isActive",
        equalTo: false
      }
    });
  }

  private checkHaveApprovedPartners(activePlans: any[]) {
    activePlans.forEach(plan => {
      //deal organisations
      let partnerIds = plan.partnerOrganisations;
      if (partnerIds) {
        partnerIds.forEach(partnerId => {
          this.service.getPartnerOrgnisation(partnerId)
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
        }
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.service.serviceDestroy();
  }

  getName(id) {
    let name = "";
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(user => {
        name = user.firstName + " " + user.lastName;
      });

    return name;
  }

  goToCreateNewResponsePlan() {
    this.router.navigateByUrl('response-plans/create-edit-response-plan');
  }

  viewResponsePlan(plan, isViewing) {
    if (isViewing) {
      if (this.agencyOverview) {
        this.router.navigate(["/response-plans/view-plan", {
          "id": plan.$key,
          "isViewing": isViewing,
          "countryId": this.countryIdForViewing,
          "agencyId": this.agencyId,
          "canCopy": this.canCopy,
          "agencyOverview": this.agencyOverview
        }]);
      } else {
        this.router.navigate(["/response-plans/view-plan", {
          "id": plan.$key,
          "isViewing": isViewing,
          "countryId": this.countryIdForViewing,
          "agencyId": this.agencyId,
          "canCopy": this.canCopy
        }]);
      }
    } else {
      this.router.navigate(["/response-plans/view-plan", {"id": plan.$key}]);
    }
  }

  editResponsePlan(responsePlan) {
    if (responsePlan.isEditing) {
      jQuery("#dialog-acknowledge").modal("show");
      this.dialogTitle = "RESPONSE_PLANS.HOME.EDIT_WHILE_ANOTHER_EDITING_TITLE";
      this.dialogContent = "RESPONSE_PLANS.HOME.EDIT_WHILE_ANOTHER_EDITING_CONTENT";
      return;
    }
    this.router.navigate(['response-plans/create-edit-response-plan', {id: responsePlan.$key}]);
  }

  exportStartFund(responsePlan) {
    this.router.navigate(['/export-start-fund', {id: responsePlan.$key}]);
  }

  exportProposal(responsePlan) {
    this.router.navigate(['/export-proposal', {id: responsePlan.$key}]);
  }

  submitForApproval(plan) {
    this.needShowDialog = this.service.needShowWaringBypassValidation(plan);
    this.planToApproval = plan;
    if (this.needShowDialog) {
      jQuery("#dialog-action").modal("show");
      this.dialogTitle = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_TITLE";
      this.dialogContent = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_CONTENT";
    } else {
      this.confirmDialog();
    }
  }

  submitForPartnerValidation(plan) {
    this.service.submitForPartnerValidation(plan, this.uid);
  }

  archivePlan(plan) {
    this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/isArchived").set(false);
  }

  confirmDialog() {
    if (this.needShowDialog) {
      jQuery("#dialog-action").modal("hide");
    }
    if (this.userType == UserType.CountryAdmin || this.userType == UserType.ErtLeader || this.userType == UserType.Ert) {
      let approvalData = {};
      let countryId = "";
      let agencyId = "";
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.userType] + "/" + this.uid)
        .flatMap(countryAdmin => {
          countryId = countryAdmin.countryId;
          agencyId = Object.keys(countryAdmin.agencyAdmin)[0];
          return this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + countryId);
        })
        .do(director => {
          if (director && director.$value) {
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + director.$value] = ApprovalStatus.WaitingApproval;
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;

            // Send notification to country director
            let notification = new MessageModel();
            notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
            notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name});
            notification.time = new Date().getTime();
            this.notificationService.saveUserNotification(director.$value, notification, UserType.CountryDirector, agencyId, countryId).then(() => { }); 
          
        } else {
            this.waringMessage = "RESPONSE_PLANS.HOME.ERROR_NO_COUNTRY_DIRECTOR";
            this.showAlert();
            return;
          }
        })
        .flatMap(() => {
          return this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/responsePlanSettings/approvalHierachy")
        })
        .map(approvalSettings => {
          let setting = [];
          approvalSettings.forEach(item => {
            setting.push(item.$value);
          });
          return setting;
        })
        .first()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(approvalSettings => {
          if (approvalSettings[0] == false && approvalSettings[1] == false) {
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/regionDirector/"] = null;
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/globalDirector/"] = null;
            this.updatePartnerValidation(countryId, approvalData);

          } else if (approvalSettings[0] != false && approvalSettings[1] == false) {
            console.log("regional enabled");
            this.updateWithRegionalApproval(agencyId, countryId, approvalData);
          } else if (approvalSettings[0] == false && approvalSettings[1] != false) {
            console.log("global enabled")
          } else {
            console.log("both directors enabled");
            this.updateWithBothApproval(this.agencyId, countryId, approvalData);
          }
        });
    }
  }

  private updatePartnerValidation(countryId: string, approvalData: {}) {
    if (this.planToApproval.partnerOrganisations) {
      let partnerData = {};
      this.planToApproval.partnerOrganisations.forEach(item => {
        partnerData[item] = ApprovalStatus.InProgress;
      });
      approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/partner/"] = partnerData;
    }
    this.af.database.object(Constants.APP_STATUS).update(approvalData).then(() => {
      console.log("success");
    }, error => {
      console.log(error.message);
    });
  }

  private updateWithRegionalApproval(agencyId: string, countryId: string, approvalData: {}) {

    this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(id => {
        if (id && id.$value && id.$value != "null") {
          approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/regionDirector/" + id.$value] = ApprovalStatus.WaitingApproval;

          // Send notification to regional director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name});
          notification.time = new Date().getTime();
          this.notificationService.saveUserNotification(id.$value, notification, UserType.RegionalDirector, agencyId, countryId).then(() => { }); 
        }
        this.updatePartnerValidation(countryId, approvalData);
      });
  }

  private updateWithBothApproval(agencyId: string, countryId: string, approvalData: {}) {
    this.af.database.list(Constants.APP_STATUS + "/globalDirector", {
      query: {
        orderByChild: "agencyAdmin/" + agencyId,
        equalTo: true
      }
    })
      .first()
      .subscribe(globalDirector => {
        if (globalDirector.length > 0 && globalDirector[0].$key) {
          approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/globalDirector/" + globalDirector[0].$key] = ApprovalStatus.WaitingApproval;
          // Send notification to global director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name});
          notification.time = new Date().getTime();
          this.notificationService.saveUserNotification(globalDirector[0].$key, notification, UserType.GlobalDirector, agencyId, countryId).then(() => { }); 
        }
        this.updateWithRegionalApproval(agencyId, countryId, approvalData);
      });
  }

  closeModal(isAckModel: boolean) {
    if (isAckModel) {
      jQuery("#dialog-acknowledge").modal("hide");
    } else {
      jQuery("#dialog-action").modal("hide");
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private showAlert() {
    this.hideWarning = false;
    Observable.timer(Constants.ALERT_DURATION).takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.hideWarning = true;
    });
  }

  getApproves(plan) {
    if (!plan.approval) {
      return [];
    }
    return Object.keys(plan.approval).filter(key => key != "partner").map(key => plan.approval[key]);
  }

  getApproveStatus(approve) {
    if (!approve) {
      return -1;
    }
    let list = Object.keys(approve).map(key => approve[key]);
    return list[0] == ApprovalStatus.Approved;
  }

  activatePlan(plan) {
    if (this.userType == UserType.CountryAdmin) {
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/isArchived").set(true);
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/status").set(ApprovalStatus.NeedsReviewing);
      this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval")
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
        .takeUntil(this.ngUnsubscribe).subscribe(approvalList => {
        for (let approval of approvalList) {
          if (approval["countryDirector"]) {
            this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval/countryDirector/" + approval["countryDirector"])
              .set(ApprovalStatus.NeedsReviewing);
          }
          if (approval["regionDirector"]) {
            this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval/regionDirector/" + approval["regionDirector"])
              .set(ApprovalStatus.NeedsReviewing);
          }
          if (approval["globalDirector"]) {
            this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval/globalDirector/" + approval["globalDirector"])
              .set(ApprovalStatus.NeedsReviewing);
          }
        }
      });
    }
  }

  getNotes(plan) {
    if (plan.status == ApprovalStatus.NeedsReviewing) {
      this.af.database.list(Constants.APP_STATUS + "/note/" + plan.$key)
        .first()
        .takeUntil(this.ngUnsubscribe).subscribe(list => {
        this.notesMap.set(plan.$key, list);
      });
    }
  }

}
