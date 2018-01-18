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
import {MessageModel} from "../model/message.model";
import {TranslateService} from "@ngx-translate/core";
import {NotificationService} from "../services/notification.service";
import {ResponsePlan} from "../model/responsePlan";
import {observable} from "rxjs/symbol/observable";
import {AgencyService} from "../services/agency-service.service";
import * as moment from "moment";

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
  private needShowDialog: boolean;
  private HazardScenariosList = Constants.HAZARD_SCENARIOS;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private partnersMap = new Map();
  private partnersApprovalMap = new Map<string, string>();
  private responsePlanToEdit: any;

  private approvalsList: any[] = [];
  private directorSubmissionRequireMap = new Map<number, boolean>();
  private agencyPlanExpireDuration: number;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private router: Router,
              private service: ResponsePlanService,
              private userService: UserService,
              private notificationService: NotificationService,
              private agencyService: AgencyService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      if(this.isLocalAgency){
        this.uid = user.auth.uid;
          this.userType = userType;
          this.agencyId = agencyId;
          let userPath = Constants.USER_PATHS[userType];

          this.agencyService.getAgencyResponsePlanClockSettingsDuration(agencyId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(duration => {
              console.log(duration);
              this.agencyPlanExpireDuration = duration;

                this.getResponsePlans(this.agencyId);

            });
      }else{
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
              console.log(duration);
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
    this.userService.getAgencyId(userPath, this.uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agencyId => {
        this.agencyId = agencyId;
        this.af.database.object(Constants.APP_STATUS + "/" + userPath + "/" + this.uid + "/countryId")
          .takeUntil(this.ngUnsubscribe)
          .subscribe((countryId) => {
            this.countryId = countryId.$value;
            this.handleRequireSubmissionTagForDirectors();
            this.getResponsePlans(this.countryId);
          });
      });

  }

  private getResponsePlans(id: string) {
    /*Active Plans*/
    console.log(Constants.APP_STATUS + "/responsePlan/" + id)
    this.af.database.list(Constants.APP_STATUS + "/responsePlan/" + id).subscribe(plans => {
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
      console.log("expire this plan");
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

  getName(id) {
    let name = "";
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + id, {preserveSnapshot: true})
      .first()
      .subscribe(snap => {
        if (snap.val()) {
          let user = snap.val();
          name = user.firstName + " " + user.lastName;
        } else {
          this.af.database.object(Constants.APP_STATUS + "/partnerOrganisation/" + id)
            .first()
            .subscribe(org => {
              name = org.organisationName;
            })
        }
      });

    return name;
  }

  goToCreateNewResponsePlan() {
    this.router.navigateByUrl(this.isLocalAgency ? 'local-agency/response-plans/create-edit-response-plan' : 'response-plans/create-edit-response-plan');
  }

  viewResponsePlan(plan, isViewing) {
    if (isViewing) {
      let headers = {"id": plan.$key, "isViewing": isViewing, "countryId": this.countryIdForViewing, "agencyId": this.agencyId};
      if (this.agencyOverview) {
        headers["agencyOverview"] = this.agencyOverview;
        // this.router.navigate(["/response-plans/view-plan", {
        //   "id": plan.$key,
        //   "isViewing": isViewing,
        //   "countryId": this.countryIdForViewing,
        //   "agencyId": this.agencyId,
        //   "canCopy": this.canCopy,
        //   "agencyOverview": this.agencyOverview
        // }]);
      }
      if (this.canCopy) {
        headers["canCopy"] = this.canCopy;
      }
      // else {
      //   this.router.navigate(["/response-plans/view-plan", {
      //     "id": plan.$key,
      //     "isViewing": isViewing,
      //     "countryId": this.countryIdForViewing,
      //     "agencyId": this.agencyId,
      //     "canCopy": this.canCopy
      //   }]);
      // }
      this.router.navigate(this.isLocalAgency ? ["/local-agency/response-plans/view-plan", headers] : ["/response-plans/view-plan", headers]);
    } else {
      this.router.navigate(this.isLocalAgency ? ["/local-agency/response-plans/view-plan", {"id": plan.$key}] : ["/response-plans/view-plan", {"id": plan.$key}]);
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
      this.router.navigate(this.isLocalAgency ? ['local-agency/response-plans/create-edit-response-plan', {id: this.responsePlanToEdit.$key}] : ['response-plans/create-edit-response-plan', {id: this.responsePlanToEdit.$key}]);
    }
  }

  exportStartFund(responsePlan) {
    this.router.navigate( this.isLocalAgency ? ['/export-start-fund', {id: responsePlan.$key, isLocalAgency: true}] : ['/export-start-fund', {id: responsePlan.$key}] );
  }

  exportProposal(responsePlan, isExcel: boolean) {
    if (isExcel) {
      this.router.navigate(this.isLocalAgency ? ['/export-proposal', {id: responsePlan.$key, excel: 1, isLocalAgency: true}] : ['/export-proposal', {id: responsePlan.$key, excel: 1}]);
    } else {
      this.router.navigate(this.isLocalAgency ? ['/export-proposal', {id: responsePlan.$key, excel: 0, isLocalAgency: true}] : ['/export-proposal', {id: responsePlan.$key, excel: 0}]);
    }
  }

  submitForApproval(plan) {
    this.needShowDialog = this.service.needShowWaringBypassValidation(plan);
    this.planToApproval = plan;
    if (this.needShowDialog) {
      jQuery("#dialog-action").modal("show");
      this.dialogTitle = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_TITLE";
      this.dialogContent = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_CONTENT";
    } else {
      this.isLocalAgency ?  this.confirmDialogLocalAgency() : this.confirmDialog();
    }
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
    this.service.getDirectors(this.countryId, this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(result => {
        counter++;
        console.log(counter);
        console.log(result);
        if (counter === 1 && result.$value && result.$value != null) {
          this.directorSubmissionRequireMap.set(1, true);
        }
        if (counter === 2 && result.$value && result.$value != null) {
          this.directorSubmissionRequireMap.set(2, true);
        }
        if (counter === 3 && result.length > 0) {
          this.directorSubmissionRequireMap.set(3, true);
        }
      });
  }

  archivePlan(plan) {
    //same as edit, need to reset approval status and validation process
    let updateData = {};
    if(this.isLocalAgency){
      updateData["/responsePlan/" + this.agencyId + "/" + plan.$key + "/approval"] = null;
      updateData["/responsePlan/" + this.agencyId + "/" + plan.$key + "/isActive"] = false;
    }else{
      updateData["/responsePlan/" + this.countryId + "/" + plan.$key + "/approval"] = null;
      updateData["/responsePlan/" + this.countryId + "/" + plan.$key + "/isActive"] = false;
    }
    updateData["/responsePlanValidation/" + plan.$key] = null;
    this.af.database.object(Constants.APP_STATUS).update(updateData);
    // this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/isActive").set(false);
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
            // approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + director.$value] = ApprovalStatus.WaitingApproval;
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + this.countryId] = ApprovalStatus.WaitingApproval;
            approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;

            // Send notification to country director
            let notification = new MessageModel();
            notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
            notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
            notification.time = new Date().getTime();
            this.notificationService.saveUserNotification(director.$value, notification, UserType.CountryDirector, agencyId, countryId).then(() => {
            });

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
            console.log("global enabled");
            this.updateWithGlobalApproval(this.agencyId, countryId, approvalData);
          } else {
            console.log("both directors enabled");
            this.updateWithGlobalApproval(this.agencyId, countryId, approvalData);
            this.updateWithRegionalApproval(this.agencyId, countryId, approvalData);
          }
        });
    }
  }

  confirmDialogLocalAgency() {
    if (this.needShowDialog) {
      jQuery("#dialog-action").modal("hide");
    }
    if (this.userType == UserType.LocalAgencyAdmin || this.userType == UserType.LocalAgencyDirector) {
      let approvalData = {};
      let countryId = "";
      let agencyId = "";
      this.af.database.object(Constants.APP_STATUS + "/" + Constants.USER_PATHS[this.userType] + "/" + this.uid)
        .flatMap(countryAdmin => {
          countryId = countryAdmin.countryId;
          agencyId = countryAdmin.agencyId
          return this.af.database.object(Constants.APP_STATUS + "/directorLocalAgency/" + agencyId);
        })
        .do(director => {
          if (director && director.$value) {
            // approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + director.$value] = ApprovalStatus.WaitingApproval;
            approvalData["/responsePlan/" + agencyId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + this.agencyId] = ApprovalStatus.WaitingApproval;
            approvalData["/responsePlan/" + agencyId + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;

            // Send notification to country director
            let notification = new MessageModel();
            notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
            notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
            notification.time = new Date().getTime();
            this.notificationService.saveUserNotificationLocalAgency(director.$value, notification, UserType.LocalAgencyDirector, agencyId).then(() => {
            });

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
        .takeUntil(this.ngUnsubscribe)
        .subscribe(approvalSettings => {
          if (approvalSettings[0] == false && approvalSettings[1] == false) {
            approvalData["/responsePlan/" + agencyId + "/" + this.planToApproval.$key + "/approval/regionDirector/"] = null;
            approvalData["/responsePlan/" + agencyId + "/" + this.planToApproval.$key + "/approval/globalDirector/"] = null;
            this.updatePartnerValidation(agencyId, approvalData);

          } else if (approvalSettings[0] != false && approvalSettings[1] == false) {
            console.log("regional enabled");
            this.updateWithRegionalApprovalLocalAgency(agencyId, approvalData);
          } else if (approvalSettings[0] == false && approvalSettings[1] != false) {
            console.log("global enabled");
            this.updateWithGlobalApprovalLocalAgency(this.agencyId, approvalData);
          } else {
            console.log("both directors enabled");
            this.updateWithGlobalApprovalLocalAgency(this.agencyId, approvalData);
            this.updateWithRegionalApprovalLocalAgency(this.agencyId, approvalData);
          }
        });
    }
  }

  private updatePartnerValidation(countryId: string, approvalData: {}) {
    this.af.database.object(Constants.APP_STATUS).update(approvalData).then(() => {
      console.log("success");
    }, error => {
      console.log(error.message);
    });
  }

  // private updateWithRegionalApproval(agencyId: string, countryId: string, approvalData: {}) {
  //
  //   this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + countryId)
  //     .takeUntil(this.ngUnsubscribe)
  //     .subscribe(id => {
  //       if (id && id.$value && id.$value != "null") {
  //         approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/regionDirector/" + id.$value] = ApprovalStatus.WaitingApproval;
  //
  //         // Send notification to regional director
  //         let notification = new MessageModel();
  //         notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
  //         notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
  //         notification.time = new Date().getTime();
  //         this.notificationService.saveUserNotification(id.$value, notification, UserType.RegionalDirector, agencyId, countryId).then(() => {
  //         });
  //       }
  //       this.updatePartnerValidation(countryId, approvalData);
  //     });
  // }
  private updateWithRegionalApproval(agencyId: string, countryId: string, approvalData: {}) {
    console.log("region approval")

    this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + countryId)
      .flatMap(id => {
        console.log(id);
        if (id && id.$value && id.$value != "null") {
          // Send notification to regional director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
          notification.time = new Date().getTime();
          this.notificationService.saveUserNotification(id.$value, notification, UserType.RegionalDirector, agencyId, countryId).then(() => {
          });

          return this.af.database.object(Constants.APP_STATUS + "/regionDirector/" + id.$value + "/regionId", {preserveSnapshot: true});
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
    console.log("region approval")

    this.af.database.object(Constants.APP_STATUS + "/directorRegion/" + agencyId)
      .flatMap(id => {
        console.log(id);
        if (id && id.$value && id.$value != "null") {
          // Send notification to regional director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
          notification.time = new Date().getTime();
          this.notificationService.saveUserNotificationLocalAgency(id.$value, notification, UserType.RegionalDirector, agencyId).then(() => {
          });

          return this.af.database.object(Constants.APP_STATUS + "/regionDirector/" + id.$value + "/regionId", {preserveSnapshot: true});
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
          // approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/globalDirector/" + globalDirector[0].$key] = ApprovalStatus.WaitingApproval;
          approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/globalDirector/" + this.agencyId] = ApprovalStatus.WaitingApproval;

          // Send notification to global director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
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
          // approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/globalDirector/" + globalDirector[0].$key] = ApprovalStatus.WaitingApproval;
          approvalData["/responsePlan/" + agencyId + "/" + this.planToApproval.$key + "/approval/globalDirector/" + this.agencyId] = ApprovalStatus.WaitingApproval;

          // Send notification to global director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
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
    // let activateData = {};
    // activateData["/responsePlan/" + this.countryId + "/" + plan.$key + "/isActive"] = true;
    // activateData["/responsePlan/" + this.countryId + "/" + plan.$key + "/status"] = ApprovalStatus.NeedsReviewing;
    // activateData["/responsePlan/" + this.countryId + "/" + plan.$key + "/timeUpdated"] = moment().utc().valueOf();
    // this.af.database.object(Constants.APP_STATUS).update(activateData);
    if(this.isLocalAgency){
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + plan.$key + "/isActive").set(true);
      this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.agencyId + "/" + plan.$key + "/status").set(ApprovalStatus.NeedsReviewing);
    }else{
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
      if(this.isLocalAgency){
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
      }else{
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
            this.af.database.object(Constants.APP_STATUS + "/userPublic/" + note.uploadBy, {preserveSnapshot: true})
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
