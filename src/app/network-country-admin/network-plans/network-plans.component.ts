import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType, ApprovalStatus, UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ResponsePlanService} from "../../services/response-plan.service";
import {UserService} from "../../services/user.service";
import {AgencyService} from "../../services/agency-service.service";
import {TranslateService} from "@ngx-translate/core";
import {PartnerOrganisationService} from "../../services/partner-organisation.service";
import * as moment from "moment";
import {MessageModel} from "../../model/message.model";
import {NotificationService} from "../../services/notification.service";
import {CommonUtils} from "../../utils/CommonUtils";

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
  private agencyCountryMap: Map<string, string>;


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
              private af: AngularFire,
              private networkService: NetworkService,
              private planService: ResponsePlanService,
              private notificationService: NotificationService,
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
          this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(map => {
              this.agencyCountryMap = map;
            });
        });
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
          console.log(partnerOrgId);
          //check has user or not first
          this.partnerService.getPartnerOrganisation(partnerOrgId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(org => {
              if (org.partners) {
                this.planService.getPartnerBasedOnOrgId(partnerOrgId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(partnerId => {
                    this.partnersApprovalMap.set(org.id, partnerId);
                    console.log(this.partnersApprovalMap);
                  });
              } else {
                this.partnersApprovalMap.set(org.id, org.id);
                console.log(this.partnersApprovalMap);
              }
            });
        })
      }
    });
  }

  exportStartFund(responsePlan) {
    this.router.navigate(['/export-start-fund', {
      id: responsePlan.$key,
      "networkCountryId": this.networkCountryId
    }]).then();
  }

  exportProposal(responsePlan, isExcel: boolean) {
    if (isExcel) {
      this.router.navigate(['/export-proposal', {
        id: responsePlan.$key,
        excel: 1,
        "networkCountryId": this.networkCountryId
      }]).then();
    } else {
      this.router.navigate(['/export-proposal', {
        id: responsePlan.$key,
        excel: 0,
        "networkCountryId": this.networkCountryId
      }]).then();
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

  private editResponsePlan() {
    jQuery("#dialog-responseplan-editing").modal("hide");

    if (this.responsePlanToEdit.isEditing && this.responsePlanToEdit.editingUserId != this.uid) {
      this.userService.getUser(this.responsePlanToEdit.editingUserId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(editingUser => {
          jQuery("#dialog-acknowledge").modal("show");
          this.dialogTitle = "RESPONSE_PLANS.HOME.EDIT_WHILE_ANOTHER_EDITING_TITLE";
          this.dialogContent = "RESPONSE_PLANS.HOME.EDIT_WHILE_ANOTHER_EDITING_CONTENT";
          this.dialogEditingUserName = editingUser.firstName + " " + editingUser.lastName;
          this.dialogEditingUserEmail = editingUser.email;
        });
    } else {
      this.router.navigate(['network-country/network-plans/create-edit-network-plan', {id: this.responsePlanToEdit.$key}]).then();
    }
  }

  submitForApproval(plan) {
    this.needShowDialog = this.planService.needShowWaringBypassValidation(plan);
    this.planToApproval = plan;
    if (this.needShowDialog) {
      jQuery("#dialog-action").modal("show");
      this.dialogTitle = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_TITLE";
      this.dialogContent = "RESPONSE_PLANS.HOME.SUBMIT_WITHOUT_PARTNER_VALIDATION_CONTENT";
    } else {
      this.confirmDialog();
    }
  }

  private confirmDialog() {
    if (this.needShowDialog) {
      jQuery("#dialog-action").modal("hide");
    }
    // if (this.userType == UserType.CountryAdmin || this.userType == UserType.ErtLeader || this.userType == UserType.Ert) {

    CommonUtils.convertMapToKeysInArray(this.agencyCountryMap).forEach(agencyKey => {
      let approvalData = {};
      let countryId = this.agencyCountryMap.get(agencyKey);
      let agencyId = agencyKey;
      this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + countryId)
        .do(director => {
          if (director && director.$value) {
            // approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + director.$value] = ApprovalStatus.WaitingApproval;
            approvalData["/responsePlan/" + this.networkCountryId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + countryId] = ApprovalStatus.WaitingApproval;
            approvalData["/responsePlan/" + this.networkCountryId + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;

            // Send notification to country director
            let notification = new MessageModel();
            notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
            notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
            notification.time = new Date().getTime();
            this.notificationService.saveUserNotification(director.$value, notification, UserType.CountryDirector, agencyId, countryId).then(() => {
            });

          } else {
            this.waringMessage = "RESPONSE_PLANS.HOME.ERROR_NO_COUNTRY_DIRECTOR";
            this.alertMessage = new AlertMessageModel(this.waringMessage);
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
            approvalData["/responsePlan/" + this.networkCountryId + "/" + this.planToApproval.$key + "/approval/regionDirector/"] = null;
            approvalData["/responsePlan/" + this.networkCountryId + "/" + this.planToApproval.$key + "/approval/globalDirector/"] = null;
            this.updatePartnerValidation(this.networkCountryId, approvalData);

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
    });

    // }
  }

  private updatePartnerValidation(countryId: string, approvalData: {}) {
    this.af.database.object(Constants.APP_STATUS).update(approvalData).then(() => {
      console.log(approvalData);
      console.log("success");
    }, error => {
      console.log(error.message);
    });
  }

  private updateWithRegionalApproval(agencyId: string, countryId: string, approvalData: {}) {
    console.log("region approval");

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
          approvalData["/responsePlan/" + this.networkCountryId + "/" + this.planToApproval.$key + "/approval/regionDirector/" + snap.val()] = ApprovalStatus.WaitingApproval;
        }
        this.updatePartnerValidation(this.networkCountryId, approvalData);
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
          approvalData["/responsePlan/" + this.networkCountryId + "/" + this.planToApproval.$key + "/approval/globalDirector/" + agencyId] = ApprovalStatus.WaitingApproval;

          // Send notification to global director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
          notification.time = new Date().getTime();

          this.notificationService.saveUserNotification(globalDirector[0].$key, notification, UserType.GlobalDirector, agencyId, countryId).then(() => {
          });
        }
        this.updatePartnerValidation(this.networkCountryId, approvalData);
      });
  }

  submitForPartnerValidation(plan) {
    this.planService.submitForPartnerValidation(plan, this.networkCountryId);

    // //sort out require submission tag
    // this.handleRequireSubmissionTagForDirectors();
  }

  // private handleRequireSubmissionTagForDirectors() {
  //   this.directorSubmissionRequireMap.set(1, false);
  //   this.directorSubmissionRequireMap.set(2, false);
  //   this.directorSubmissionRequireMap.set(3, false);
  //   let counter = 0;
  //   this.planService.getDirectors(this.countryId, this.agencyId)
  //     .takeUntil(this.ngUnsubscribe)
  //     .subscribe(result => {
  //       counter++;
  //       console.log(counter);
  //       console.log(result);
  //       if (counter === 1 && result.$value && result.$value != null) {
  //         this.directorSubmissionRequireMap.set(1, true);
  //       }
  //       if (counter === 2 && result.$value && result.$value != null) {
  //         this.directorSubmissionRequireMap.set(2, true);
  //       }
  //       if (counter === 3 && result.length > 0) {
  //         this.directorSubmissionRequireMap.set(3, true);
  //       }
  //     });
  // }

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

}
