
import {from as observableFrom, timer as observableTimer,  Observable ,  Subject } from 'rxjs';

import {tap, mergeMap, first, takeUntil} from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AngularFire, FirebaseListObservable } from "angularfire2";
import * as moment from "moment";
import { MessageModel } from "../model/message.model";
import { ModelUserPublic } from "../model/user-public.model";
import { AgencyService } from "../services/agency-service.service";
import { NotificationService } from "../services/notification.service";
import { PageControlService } from "../services/pagecontrol.service";
import { PartnerOrganisationService } from "../services/partner-organisation.service";
import { ResponsePlanService } from "../services/response-plan.service";
import { UserService } from "../services/user.service";
import { CommonUtils } from "../utils/CommonUtils";
import { Constants } from "../utils/Constants";
import { ApprovalStatus, ResponsePlansApprovalSettings, UserType } from "../utils/Enums";

declare const jQuery: any;

@Component({
  selector: 'app-response-plans',
  templateUrl: './response-plans.component.html',
  styleUrls: ['./response-plans.component.css'],
  providers: [ResponsePlanService, AgencyService]
})

export class ResponsePlansComponent implements OnInit, OnDestroy {

  @Input() isViewing: boolean;
  @Input() countryIdForViewing: string;
  @Input() agencyIdForViewing: string;
  @Input() canCopy: boolean = false;
  @Input() agencyOverview: boolean;
  @Input() isAgencyAdmin: boolean;

  //local agency
  @Input() isLocalAgency: boolean;

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
  private planToResend: any;
  private planToDelete: any;
  private needShowDialog: boolean;
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private partnersMap = new Map();
  private partnersApprovalMap = new Map<string, string>();
  private responsePlanToEdit: any;

  private approvalsList: any[] = [];
  private directorSubmissionRequireMap = new Map<number, boolean>();
  private agencyPlanExpireDuration: number;

  private directorIdMap = new Map<string, string>()
  private directorModelMap = new Map<string, ModelUserPublic>()
  private countryRegionAgencyIdMap = new Map<string, string>()
  private agencyApprovalSettingMap = new Map<string, boolean>()
  private countryDirectorSelected: boolean
  private regionDirectorSelected: boolean
  private globalDirectorSelected: boolean
  private ApprovalStatus = ApprovalStatus
  private ResponsePlansApprovalSettings = ResponsePlansApprovalSettings
  private extPartnerOrgMap = new Map()
  private intPartnerOrgMap = new Map()
  private partnerList = []
  private validPartnerMap = new Map<string, boolean>()
  private partnerApprovalIdMap = new Map()
  private partnerUserMap = new Map()
  private selectedDirectorMap = new Map<string, boolean>()
  private selectedPartnerApprovalIdMap = new Map()
  private countryDirectorExist: boolean

  constructor(private pageControl: PageControlService,
    private route: ActivatedRoute,
    private af: AngularFire,
    private router: Router,
    private service: ResponsePlanService,
    private userService: UserService,
    private notificationService: NotificationService,
    private agencyService: AgencyService,
    private partnerService: PartnerOrganisationService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      if (this.isLocalAgency) {
        this.uid = user.auth.uid;
        this.userType = userType;
        this.agencyId = agencyId;
        let userPath = Constants.USER_PATHS[userType];

        this.agencyService.getAgencyResponsePlanClockSettingsDuration(agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(duration => {
            this.agencyPlanExpireDuration = duration;

            this.getResponsePlans(this.agencyId);
            this.handleRequireSubmissionTagForLocalAgencyDirector();
            this.getApprovalHierachySettings()
            this.checkIsThereLocalAgencyDirector()
          });
      } else {
        this.uid = user.auth.uid;
        if (this.isViewing) {
          this.countryId = this.countryIdForViewing;
          this.agencyId = this.agencyIdForViewing;
          this.getResponsePlans(this.countryId);
        } else {
          this.userType = userType;
          let userPath = Constants.USER_PATHS[userType];

          this.agencyService.getAgencyResponsePlanClockSettingsDuration(agencyId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(duration => {
              this.agencyPlanExpireDuration = duration;

              if (this.userType == UserType.PartnerUser) {
                this.agencyId = agencyId;
                this.countryId = countryId;
                this.handleRequireSubmissionTagForDirectors();
                this.getResponsePlans(this.countryId);
              } else {
                this.getSystemAgencyCountryIds(userPath);
              }

            });
        }
      }
    });
  }

  private getSystemAgencyCountryIds(userPath: string) {
    this.userService.getAgencyId(userPath, this.uid).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(agencyId => {
        this.agencyId = agencyId;
        this.af.database.object(Constants.APP_STATUS + "/" + userPath + "/" + this.uid + "/countryId")
          .takeUntil(this.ngUnsubscribe)
          .subscribe((countryId) => {
            this.countryId = countryId.$value;
            this.handleRequireSubmissionTagForDirectors();
            this.getResponsePlans(this.countryId);
            this.getApprovalHierachySettings()
            this.checkIsThereCountryDirector()
          });
      });

  }

  private getResponsePlans(id: string) {
    /*Active Plans*/
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id).takeUntil(this.ngUnsubscribe).subscribe(plans => {
      this.activePlans = [];
      plans.forEach(plan => {
        if (plan.isActive) {
          this.activePlans.push(plan);
          this.getNotes(plan);

          if (!this.isViewing && this.agencyPlanExpireDuration && plan.timeUpdated && plan.status === ApprovalStatus.Approved) {
            this.expirePlanIfNeed(plan, id, this.agencyPlanExpireDuration);
          }
        }
      });
      this.checkHaveApprovedPartners(this.activePlans);
      this.getNeedToApprovedPartners(this.activePlans);
    });

    /*Archived Plans*/
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id, {
      query: {
        orderByChild: "isActive",
        equalTo: false
      }
    }).takeUntil(this.ngUnsubscribe)
      .subscribe(plans => {
        this.archivedPlans = plans;
      });
  }

  private expirePlanIfNeed(plan: any, countryId: string, agencyPlanExpireDuration: number) {
    let timeNow = moment().utc().valueOf();
    if ((timeNow - plan.timeUpdated) > agencyPlanExpireDuration) {
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + countryId + "/" + plan.$key + "/isActive").set(false);
    }
  }

  private getNeedToApprovedPartners(activePlans: any[]) {
    activePlans.forEach(plan => {
      if (plan.partnerOrganisations) {
        let partnerOrgIds = Object.keys(plan.partnerOrganisations).map(key => plan.partnerOrganisations[key]);
        partnerOrgIds.forEach(partnerOrgId => {
          //check has user or not first
          this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + partnerOrgId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(org => {
              if (org.partners) {
                this.service.getPartnerBasedOnOrgId(partnerOrgId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(partnerId => {
                    this.partnersApprovalMap.set(partnerOrgId, partnerId);
                  });
              } else {
                this.partnersApprovalMap.set(org.$key, org.$key);
              }
            });
        })
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
        } else if (approvalKeys.length == 2 && approvalKeys.includes("regionDirector")) {
          this.isRegionalDirectorMap.set(plan.$key, true);
        } else if (approvalKeys.length == 3) {
          this.isGlobalDirectorMap.set(plan.$key, true);
          this.isRegionalDirectorMap.set(plan.$key, true);
        }
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.service.serviceDestroy();
  }

  goToCreateNewResponsePlan() {
    this.router.navigateByUrl(this.isLocalAgency ? 'local-agency/response-plans/create-edit-response-plan' : 'response-plans/create-edit-response-plan');
  }

  viewResponsePlan(plan, isViewing) {
    if (isViewing) {
      let headers = {
        "id": plan.$key,
        "isViewing": isViewing,
        "countryId": this.countryIdForViewing,
        "agencyId": this.agencyId
      };
      if (this.agencyOverview) {
        headers["agencyOverview"] = this.agencyOverview;
      }
      if (this.canCopy) {
        headers["canCopy"] = this.canCopy;
      }
      headers["isAgencyAdmin"] = this.isAgencyAdmin;
      this.router.navigate(this.isLocalAgency ? ["/local-agency/response-plans/view-plan", headers] : ["/response-plans/view-plan", headers]);
    } else {
      this.router.navigate(this.isLocalAgency ? ["/local-agency/response-plans/view-plan", { "id": plan.$key }] : ["/response-plans/view-plan", { "id": plan.$key }]);
    }
  }

  checkEditingAllowed(responsePlan) {
    this.responsePlanToEdit = responsePlan;
    if (responsePlan.status == ApprovalStatus.Approved) {
      jQuery("#dialog-responseplan-editing").modal("show");
      this.dialogTitle = "Warning!";
      this.dialogContent = "This response plan is currently submitted for approval. Are you sure you want to edit this plan?";
    } else if (responsePlan.status == ApprovalStatus.WaitingApproval) {
      jQuery("#dialog-responseplan-editing").modal("show");
      this.dialogTitle = "Warning!";
      this.dialogContent = "This response plan is currently waiting for approval. Are you sure you want to edit this plan?";
    } else {
      this.editResponsePlan()
    }
  }

  editResponsePlan() {
    jQuery("#dialog-responseplan-editing").modal("hide");

    if (this.responsePlanToEdit.isEditing && this.responsePlanToEdit.editingUserId != this.uid) {
      this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.responsePlanToEdit.editingUserId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(editingUser => {
          jQuery("#dialog-acknowledge").modal("show");
          this.dialogTitle = "RESPONSE_PLANS.HOME.EDIT_WHILE_ANOTHER_EDITING_TITLE";
          this.dialogContent = "RESPONSE_PLANS.HOME.EDIT_WHILE_ANOTHER_EDITING_CONTENT";
          this.dialogEditingUserName = editingUser.firstName + " " + editingUser.lastName;
          this.dialogEditingUserEmail = editingUser.email;
        });
    } else {
      this.router.navigate(this.isLocalAgency ? ['local-agency/response-plans/create-edit-response-plan', { id: this.responsePlanToEdit.$key }] : ['response-plans/create-edit-response-plan', { id: this.responsePlanToEdit.$key }]);
    }
  }

  exportStartFund(responsePlan) {
    this.router.navigate(this.isLocalAgency ? ['/export-start-fund', {
      id: responsePlan.$key,
      isLocalAgency: true
    }] : ['/export-start-fund', { id: responsePlan.$key }]);
  }

  exportProposal(responsePlan, isExcel: boolean) {
    if (isExcel) {
      this.router.navigate(this.isLocalAgency ? ['/export-proposal', {
        id: responsePlan.$key,
        excel: 1,
        isLocalAgency: true
      }] : ['/export-proposal', { id: responsePlan.$key, excel: 1 }]);
    } else {
      this.router.navigate(this.isLocalAgency ? ['/export-proposal', {
        id: responsePlan.$key,
        excel: 0,
        isLocalAgency: true
      }] : ['/export-proposal', { id: responsePlan.$key, excel: 0 }]);
    }
  }

  submitForApproval(plan) {
    this.resetDirectorSelection();
    if (plan.partnerOrganisations) {
      if (this.getPartnersToApprove(plan)) {
        console.log("has partner")
      } else {
        console.log("no partner")
      }
    }

    if (plan.approval && plan.approval["partner"]) {
      Object.keys(plan.approval["partner"]).map(key => {
        let obj = {}
        obj["value"] = plan.approval["partner"][key]
        obj["key"] = key
        return obj
      }).forEach(item => {
        if (item["value"] != ApprovalStatus.InProgress) {
          this.partnerApprovalIdMap.set(item["key"], true)
        }
      })
    }
    this.planToApproval = plan;
    this.isLocalAgency ? this.confirmDialogLocalAgency() : this.confirmDialog();
  }

  submitForPartnerValidation(plan) {
    this.service.submitForPartnerValidation(plan, this.countryId);

    //sort out require submission tag
    this.handleRequireSubmissionTagForDirectors();
  }

  private handleRequireSubmissionTagForDirectors() {
    this.directorSubmissionRequireMap.set(1, false);
    this.directorSubmissionRequireMap.set(2, false);
    this.directorSubmissionRequireMap.set(3, false);
    let counter = 0;
    this.service.getDirectors(this.countryId, this.agencyId).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        counter++;
        if (counter === 1 && result.$value && result.$value != "null") {
          this.directorSubmissionRequireMap.set(1, true);
          this.directorIdMap.set("countryDirector", result.$value)
          this.countryRegionAgencyIdMap.set("countryDirector", this.countryId)
        }
        if (counter === 2 && result.$value && result.$value != "null") {
          this.directorSubmissionRequireMap.set(2, true);
          this.directorIdMap.set("regionDirector", result.$value)
          this.getRegionId(this.countryId)
        }
        if (counter === 3 && result.length > 0) {
          this.directorSubmissionRequireMap.set(3, true);
          this.directorIdMap.set("globalDirector", result[0].$key)
          this.countryRegionAgencyIdMap.set("globalDirector", this.agencyId)
        }
        this.initDirectorsModel(this.directorIdMap)
      });
  }

  private handleRequireSubmissionTagForLocalAgencyDirector() {
    this.directorSubmissionRequireMap.set(1, false);
    this.directorSubmissionRequireMap.set(2, false);
    this.directorSubmissionRequireMap.set(3, false);
    let counter = 0;
    this.service.getLocalAgencyDirector(this.agencyId).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        counter++;
        if (counter === 1 && result.$value && result.$value != null) {
          this.directorSubmissionRequireMap.set(1, true);
          this.directorIdMap.set("countryDirector", result.$value)
          this.countryRegionAgencyIdMap.set("countryDirector", this.countryId)
        }
        if (counter === 2 && result.$value && result.$value != null) {
          this.directorSubmissionRequireMap.set(2, true);
          this.directorIdMap.set("regionDirector", result.$value)
          this.getRegionId(this.countryId)
        }
        if (counter === 3 && result.length > 0) {
          this.directorSubmissionRequireMap.set(3, true);
          this.directorIdMap.set("globalDirector", result[0].$key)
          this.countryRegionAgencyIdMap.set("globalDirector", this.agencyId)
        }
        this.initDirectorsModel(this.directorIdMap)
      });
  }

  archivePlan(plan) {
    //same as edit, need to reset approval status and validation process
    let updateData = {};
    if (this.isLocalAgency) {
      updateData["/responsePlan/" + this.agencyId + "/" + plan.$key + "/approval"] = null;
      updateData["/responsePlan/" + this.agencyId + "/" + plan.$key + "/isActive"] = false;
    } else {
      updateData["/responsePlan/" + this.countryId + "/" + plan.$key + "/approval"] = null;
      updateData["/responsePlan/" + this.countryId + "/" + plan.$key + "/isActive"] = false;
    }
    updateData["/responsePlanValidation/" + plan.$key] = null;
    this.af.database.object(Constants.APP_STATUS).update(updateData);
  }

  showDeleteModalFor(plan) {
    this.planToDelete = plan
    jQuery('#delete-plan').modal('show');
  }

  deletePlan() {
    this.isLocalAgency ?
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + this.planToDelete.$key).set(null) :
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + this.planToDelete.$key).set(null)
    this.closeModal('#delete-plan')
  }

  confirmDialog() {
    if (this.userType == UserType.CountryAdmin || this.userType == UserType.ErtLeader || this.userType == UserType.Ert || this.userType == UserType.CountryDirector) {
      jQuery("#directorSelection").modal("show");
      if (this.planToApproval.approval && this.planToApproval.approval["countryDirector"]) {
        if (Object.keys(this.planToApproval.approval["countryDirector"]).map(key => this.planToApproval.approval["countryDirector"][key])[0] != ApprovalStatus.InProgress) {
          this.countryDirectorSelected = true
          this.selectedDirectorMap.set("countryDirector", true)
        }
      }
      if (this.planToApproval.approval && this.planToApproval.approval["regionDirector"]) {
        if (Object.keys(this.planToApproval.approval["regionDirector"]).map(key => this.planToApproval.approval["regionDirector"][key])[0] != ApprovalStatus.InProgress) {
          this.regionDirectorSelected = true
          this.selectedDirectorMap.set("regionDirector", true)
        }
      }
      if (this.planToApproval.approval && this.planToApproval.approval["globalDirector"]) {
        if (Object.keys(this.planToApproval.approval["globalDirector"]).map(key => this.planToApproval.approval["globalDirector"][key])[0] != ApprovalStatus.InProgress) {
          this.globalDirectorSelected = true
          this.selectedDirectorMap.set("globalDirector", true)
        }
      }
      this.updatePartnerApprovalSelection(this.planToApproval);
    }
  }

  private updatePartnerApprovalSelection(plan) {
    if (plan.approval && plan.approval["partner"]) {
      Object.keys(plan.approval["partner"])
        .map(key => {
          let obj = {}
          obj["value"] = plan.approval["partner"][key]
          obj["key"] = key
          return obj
        })
        .forEach(item => {
          if (item["value"] == ApprovalStatus.InProgress) {
            this.partnerApprovalIdMap.set(item["key"], false)
            this.selectedPartnerApprovalIdMap.set(item["key"], false)
          } else {
            this.partnerApprovalIdMap.set(item["key"], true)
            this.selectedPartnerApprovalIdMap.set(item["key"], true)
          }
        })
    }
  }

  confirmDialogLocalAgency() {
    if (this.userType == UserType.LocalAgencyAdmin || this.userType == UserType.LocalAgencyDirector || this.userType == UserType.ErtLeader || this.userType == UserType.Ert) {
      jQuery("#directorSelection").modal("show");

      if (this.planToApproval.approval && this.planToApproval.approval["countryDirector"]) {
        if (Object.keys(this.planToApproval.approval["countryDirector"]).map(key => this.planToApproval.approval["countryDirector"][key])[0] != ApprovalStatus.InProgress) {
          this.countryDirectorSelected = true
          this.selectedDirectorMap.set("countryDirector", true)
        }
      }
      if (this.planToApproval.approval && this.planToApproval.approval["regionDirector"]) {
        if (Object.keys(this.planToApproval.approval["regionDirector"]).map(key => this.planToApproval.approval["regionDirector"][key])[0] != ApprovalStatus.InProgress) {
          this.regionDirectorSelected = true
          this.selectedDirectorMap.set("regionDirector", true)
        }
      }
      if (this.planToApproval.approval && this.planToApproval.approval["globalDirector"]) {
        if (Object.keys(this.planToApproval.approval["globalDirector"]).map(key => this.planToApproval.approval["globalDirector"][key])[0] != ApprovalStatus.InProgress) {
          this.globalDirectorSelected = true
          this.selectedDirectorMap.set("globalDirector", true)
        }
      }
      this.updatePartnerApprovalSelection(this.planToApproval);
    }
  }

  private updatePartnerValidation(countryId: string, approvalData: {}) {
    this.af.database.object(Constants.APP_STATUS).update(approvalData).then(() => {
      console.log("success");
    }, error => {
      console.log(error.message);
    });
  }

  private updateWithRegionalApproval(agencyId: string, countryId: string, approvalData: {}) {
    this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + countryId)
      .flatMap(id => {
        if (id && id.$value && id.$value != "null") {
          // Send notification to regional director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name });
          notification.time = new Date().getTime();
          this.notificationService.saveUserNotification(id.$value, notification, UserType.RegionalDirector, agencyId, countryId).then(() => {
          });

          return this.af.database.object(Constants.APP_STATUS + "/regionDirector/" + id.$value + "/regionId", { preserveSnapshot: true });
        }
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snap => {
        if (snap.val()) {
          approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/regionDirector/" + snap.val()] = ApprovalStatus.WaitingApproval;
        }
        this.updatePartnerValidation(countryId, approvalData);
      });
  }

  private updateWithRegionalApprovalLocalAgency(agencyId: string, approvalData: {}) {
    this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + agencyId)
      .flatMap(id => {
        if (id && id.$value && id.$value != "null") {
          // Send notification to regional director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name });
          notification.time = new Date().getTime();
          this.notificationService.saveUserNotificationLocalAgency(id.$value, notification, UserType.RegionalDirector, agencyId).then(() => {
          });

          return this.af.database.object(Constants.APP_STATUS + "/regionDirector/" + id.$value + "/regionId", { preserveSnapshot: true });
        }
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snap => {
        if (snap.val()) {
          approvalData["/responsePlan/" + agencyId + "/" + this.planToApproval.$key + "/approval/regionDirector/" + snap.val()] = ApprovalStatus.WaitingApproval;
        }
        this.updatePartnerValidation(agencyId, approvalData);
      });
  }

  private updateWithGlobalApproval(agencyId: string, countryId: string, approvalData: {}) {
    this.af.database.list(Constants.APP_STATUS + "/globalDirector", {
      query: {
        orderByChild: "agencyAdmin/" + agencyId,
        equalTo: true
      }
    })
      .first()
      .subscribe(globalDirector => {
        if (globalDirector.length > 0 && globalDirector[0].$key) {
          approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/globalDirector/" + this.agencyId] = ApprovalStatus.WaitingApproval;

          // Send notification to global director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name });
          notification.time = new Date().getTime();

          this.notificationService.saveUserNotification(globalDirector[0].$key, notification, UserType.GlobalDirector, agencyId, countryId).then(() => {
          });
        }
        this.updatePartnerValidation(countryId, approvalData);
      });
  }

  private updateWithGlobalApprovalLocalAgency(agencyId: string, approvalData: {}) {
    this.af.database.list(Constants.APP_STATUS + "/globalDirector", {
      query: {
        orderByChild: "agencyAdmin/" + agencyId,
        equalTo: true
      }
    })
      .first()
      .subscribe(globalDirector => {
        if (globalDirector.length > 0 && globalDirector[0].$key) {
          approvalData["/responsePlan/" + agencyId + "/" + this.planToApproval.$key + "/approval/globalDirector/" + this.agencyId] = ApprovalStatus.WaitingApproval;

          // Send notification to global director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name });
          notification.time = new Date().getTime();

          this.notificationService.saveUserNotificationLocalAgency(globalDirector[0].$key, notification, UserType.GlobalDirector, agencyId).then(() => {
          });
        }
        this.updatePartnerValidation(agencyId, approvalData);
      });
  }

  closeModal(model: string) {
    jQuery(model).modal("hide");
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private showAlert() {
    this.hideWarning = false;
    observableTimer(Constants.ALERT_DURATION).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.hideWarning = true;
    });
  }

  getApproves(plan) {
    if (!plan.approval) {
      return [];
    }
    return Object.keys(plan.approval).filter(key => key != "partner").map(key => plan.approval[key])
  }

  getApproveStatus(approve) {
    if (!approve) {
      return -1;
    }
    let list = Object.keys(approve).map(key => approve[key]);
    return list[0];
  }

  activatePlan(plan) {
    if (this.isLocalAgency) {
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + plan.$key + "/isActive").set(true);
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + plan.$key + "/status").set(ApprovalStatus.NeedsReviewing);
    } else {
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/isActive").set(true);
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/status").set(ApprovalStatus.NeedsReviewing);
    }
    this.af.database.list(this.isLocalAgency ? Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + plan.$key + "/approval" : Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/approval")
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
        if (this.isLocalAgency) {
          for (let approval of approvalList) {
            if (approval["localAgencyDirector"]) {
              this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + plan.$key + "/approval/countryDirector/" + approval["localAgencyDirector"])
                .set(ApprovalStatus.NeedsReviewing);
            }
            if (approval["regionDirector"]) {
              this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + plan.$key + "/approval/regionDirector/" + approval["regionDirector"])
                .set(ApprovalStatus.NeedsReviewing);
            }
            if (approval["globalDirector"]) {
              this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + plan.$key + "/approval/globalDirector/" + approval["globalDirector"])
                .set(ApprovalStatus.NeedsReviewing);
            }
          }
        } else {
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
        }
      });
  }

  getNotes(plan) {
    if (plan.status == ApprovalStatus.NeedsReviewing) {
      this.af.database.list(Constants.APP_STATUS + "/note/" + plan.$key)
        .do(list => {
          list.forEach(note => {
            this.af.database.object(Constants.APP_STATUS + "/userPublic/" + note.uploadBy, { preserveSnapshot: true })
              .first()
              .subscribe(snap => {
                if (snap.val()) {
                  let user = snap.val();
                  note["uploadByName"] = user.firstName + " " + user.lastName;
                } else {
                  this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + note.uploadBy)
                    .first()
                    .subscribe(org => {
                      note["uploadByName"] = org.organisationName;
                    })
                }
              });
          })
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(list => {
          this.notesMap.set(plan.$key, list);
        });
    }
  }

  checkStatus(plan): boolean {
    let showSubmit = false;
    if (plan.approval) {
      Object.keys(plan.approval)
        .map(key => plan.approval[key])
        .forEach(item => {
          Object.keys(item).map(id => item[id])
            .forEach(value => {
              if (value == ApprovalStatus.InProgress) {
                showSubmit = true
              }
            })
        })
      if (!showSubmit && plan.partnerOrganisations) {
        if (!plan.approval["partner"]) {
          showSubmit = true
        } else {
          let orgNumber = Object.keys(plan.partnerOrganisations).length
          let approveNum = Object.keys(plan.approval["partner"]).length
          if (orgNumber != approveNum) {
            showSubmit = true
          }
        }
      }
    } else {
      showSubmit = true
    }
    return showSubmit;
  }

  convertToInt(value): number {
    return parseInt(value);
  }

  selectPartner(partnerId, hasChecked) {
    let id = this.partnerUserMap.get(partnerId) ? this.partnerUserMap.get(partnerId) : partnerId
    this.partnerApprovalIdMap.set(id, hasChecked)
  }

  confirmResendNotification(model, plan) {
    this.planToResend = plan;
    jQuery("#" + model).modal("show");
  }

  resendNotification(user, tag) {
    this.closeModal(tag);
    jQuery("#" + this.planToResend.$key).collapse('hide')

    let notification = new MessageModel();
    notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
    notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToResend.name });
    notification.time = new Date().getTime();

    if (user == 'countryDirector') {
      this.notificationService.saveUserNotification(this.directorIdMap.get(user), notification, UserType.CountryDirector, this.agencyId, this.countryId);
    } else if (user == 'regionDirector') {
      this.notificationService.saveUserNotification(this.directorIdMap.get(user), notification, UserType.RegionalDirector, this.agencyId, this.countryId);
    } else if (user == 'globalDirector') {
      this.notificationService.saveUserNotification(this.directorIdMap.get(user), notification, UserType.GlobalDirector, this.agencyId, this.countryId);
    }
  }

  submitPlanToApproval() {
    let approvalData = {};

    //check country director
    if (this.countryDirectorSelected) {
      if ((this.getApprovalStatus("countryDirector") != ApprovalStatus.Approved && this.getApprovalStatus("countryDirector") != ApprovalStatus.NeedsReviewing)) {
        approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/approval/countryDirector/" + (this.isLocalAgency ? this.agencyId : this.countryId)] = ApprovalStatus.WaitingApproval;
        approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;

        // Send notification to country director
        let notification = new MessageModel();
        notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
        notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name });
        notification.time = new Date().getTime();
        this.isLocalAgency ?
          this.notificationService.saveUserNotificationLocalAgency(this.directorIdMap.get("countryDirector"), notification, UserType.LocalAgencyDirector, this.agencyId)
          :
          this.notificationService.saveUserNotification(this.directorIdMap.get("countryDirector"), notification, UserType.CountryDirector, this.agencyId, this.countryId)
      }
    }
    else {
      approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/approval/countryDirector/" + (this.isLocalAgency ? this.agencyId : this.countryId)] = ApprovalStatus.InProgress;
    }

    //check region director
    if (this.regionDirectorSelected) {
      if ((this.getApprovalStatus("regionDirector") != ApprovalStatus.Approved && this.getApprovalStatus("regionDirector") != ApprovalStatus.NeedsReviewing)) {
        approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/approval/regionDirector/" + this.countryRegionAgencyIdMap.get("regionDirector")] = ApprovalStatus.WaitingApproval
        approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;

        // Send notification to country director
        let notification = new MessageModel();
        notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
        notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name });
        notification.time = new Date().getTime();
        this.notificationService.saveUserNotification(this.directorIdMap.get("regionDirector"), notification, UserType.RegionalDirector, this.agencyId, this.countryId)
      }
    }
    else {
      if (this.agencyApprovalSettingMap.get("regionDirector")) {
        approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/approval/regionDirector/" + this.countryRegionAgencyIdMap.get("regionDirector")] = ApprovalStatus.InProgress
      }
    }

    //check global director
    if (this.globalDirectorSelected) {
      if (((this.getApprovalStatus("globalDirector") != ApprovalStatus.Approved && this.getApprovalStatus("globalDirector") != ApprovalStatus.NeedsReviewing))) {
        approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/approval/globalDirector/" + this.agencyId] = ApprovalStatus.WaitingApproval;
        approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;

        // Send notification to country director
        let notification = new MessageModel();
        notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
        notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name });
        notification.time = new Date().getTime();
        this.notificationService.saveUserNotification(this.directorIdMap.get("globalDirector"), notification, UserType.GlobalDirector, this.agencyId, this.countryId)
      }
    }
    else {
      if (this.agencyApprovalSettingMap.get("globalDirector")) {
        approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/approval/globalDirector/" + this.agencyId] = ApprovalStatus.InProgress;
      }
    }

    //logic for partners
    let atLeastOnePartnerSelected = false
    if (this.partnerApprovalIdMap) {
      this.partnerApprovalIdMap.forEach((v, k) => {
        if (v) {
          atLeastOnePartnerSelected = true
          if (!(this.planToApproval.approval && this.planToApproval.approval["partner"] &&
            this.planToApproval.approval["partner"][k] &&
            (this.planToApproval.approval["partner"][k] != ApprovalStatus.Approved || this.planToApproval.approval["partner"][k] != ApprovalStatus.NeedsReviewing))) {
            approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/approval/partner/" + k] = ApprovalStatus.WaitingApproval

            this.userService.getUser(k).pipe(
              first())
              .subscribe(user => {
                if (user) {
                  // Send notification to country director
                  let notification = new MessageModel();
                  notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
                  notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", { responsePlan: this.planToApproval.name });
                  notification.time = new Date().getTime();
                  this.notificationService.saveUserNotification(user.id, notification, UserType.PartnerUser, this.agencyId, this.countryId)
                }
              })
          }
        } else {
          approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/approval/partner/" + k] = ApprovalStatus.InProgress
        }
      })
    }

    //more logic for partners which not checked yet, need init here
    let partnerIdsToCheck = this.partnerList.map(partnerId => this.partnerUserMap.get(partnerId) ? this.partnerUserMap.get(partnerId) : partnerId)
    partnerIdsToCheck.forEach(id => {
      if (!this.partnerApprovalIdMap.has(id)) {
        approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/approval/partner/" + id] = ApprovalStatus.InProgress
      }
    })

    if (this.countryDirectorSelected || this.regionDirectorSelected || this.globalDirectorSelected || atLeastOnePartnerSelected) {
      approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;
    } else {
      approvalData["/responsePlan/" + (this.isLocalAgency ? this.agencyId : this.countryId) + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.InProgress
    }

    if (approvalData) {
      this.updatePartnerValidation(null, approvalData)
    }
  }

  private initDirectorsModel(directorIdMap: Map<string, string>) {
    directorIdMap.forEach((v, k) => {
      this.userService.getUser(directorIdMap.get(k)).pipe(
        first())
        .subscribe(director => {
          this.directorModelMap.set(k, director)
        })
    })
  }

  private getRegionId(countryId) {
    this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + countryId)
      .flatMap(id => {
        if (id && id.$value && id.$value != "null") {
          return this.af.database.object(Constants.APP_STATUS + "/regionDirector/" + id.$value + "/regionId", { preserveSnapshot: true });
        }
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snap => {
        if (snap.val()) {
          this.countryRegionAgencyIdMap.set("regionDirector", snap.val())
        }
      });
  }

  private getApprovalHierachySettings() {
    this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/responsePlanSettings/approvalHierachy")
      .takeUntil(this.ngUnsubscribe)
      .subscribe(approvalSettings => {
        approvalSettings.forEach(setting => {
          if (setting.$key == "0") {
            this.agencyApprovalSettingMap.set("regionDirector", setting.$value)
          } else {
            this.agencyApprovalSettingMap.set("globalDirector", setting.$value)
          }
        })
      });
  }

  private resetDirectorSelection() {
    this.countryDirectorSelected = false
    this.regionDirectorSelected = false
    this.globalDirectorSelected = false
    this.partnerApprovalIdMap.clear()
    this.partnerList = []
  }

  private getApprovalStatus(directorType: string) {
    return this.planToApproval.approval && this.planToApproval.approval[directorType] &&
      this.planToApproval.approval[directorType][this.countryRegionAgencyIdMap.get(directorType)] ? this.planToApproval.approval[directorType][this.countryRegionAgencyIdMap.get(directorType)] : -1
  }

  private getPartnersToApprove(plan) {
    const orgUserMap = new Map<string, string>();
    let partnerOrgIds = [];

    if (plan.partnerOrganisations) {
      plan.partnerOrganisations.forEach(partnerOrg => {
        partnerOrgIds.push(partnerOrg);
      });
    }
    let noPartnerUserOrg;


    observableFrom(partnerOrgIds).pipe(
      mergeMap(partnerOrgId => {
        return this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + partnerOrgId, { preserveSnapshot: true });
      }),
      tap(snap => {
        if (snap && snap.val()) {
          noPartnerUserOrg = snap.val();
          noPartnerUserOrg["key"] = snap.key;
          this.validPartnerMap.set(snap.key, snap.val().isApproved);
        }
      }),
      mergeMap(snap => {
        if (snap && snap.val()) {
          orgUserMap.set(snap.key, "");
          return this.af.database.object(Constants.APP_STATUS + "/partner/" + snap.val().validationPartnerUserId, { preserveSnapshot: true })
            .map(snap => {
              if (snap && snap.val()) {
                snap.val()["orgId"] = snap.key;
                return snap;
              }
            });
        }
      }),
      takeUntil(this.ngUnsubscribe),)
      .subscribe(snap => {
        if (snap && snap.val()) {
          orgUserMap.set(snap.val().partnerOrganisationId, snap.key);
        } 
    
        this.getPartnerDetail(orgUserMap)
        this.partnerList = CommonUtils.convertMapToKeysInArray(orgUserMap)
      });
  }

  private getPartnerDetail(orgUserMap) {
    orgUserMap.forEach((v, k) => {
      if (!v) {
        this.service.getPartnerOrgnisation(k)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(org => this.extPartnerOrgMap.set(k, org))
      } else {
        this.service.getPartnerOrgnisation(k)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(org => {
            this.intPartnerOrgMap.set(k, org)
            this.service.getPartnerBasedOnOrgId(k)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(userId => {
                if (userId) {
                  this.partnerUserMap.set(k, userId)
                }
              })
          })
      }
    });
  }

  private checkIsThereCountryDirector() {
    this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + this.countryId)
      .first()
      .subscribe(director => this.countryDirectorExist = !!director.$value)
  }

  private checkIsThereLocalAgencyDirector() {
    this.af.database.object(Constants.APP_STATUS + "/directorLocalAgency/" + this.agencyId)
      .first()
      .subscribe(director => this.countryDirectorExist = !!director.$value)
  }
}
