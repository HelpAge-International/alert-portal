import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType, ApprovalStatus, UserType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
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
import {ModelAgency} from "../../model/agency.model";
import {LocalStorageService} from "angular-2-local-storage";
import {ResponsePlan} from "../../model/responsePlan";

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
  private ApprovalStatus = ApprovalStatus;


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;
  private agencyCountryMap: Map<string, string>;
  private agenciesNeedToApprove: ModelAgency[];
  private planApprovalObjMap = new Map<string, object>();
  private agencyRegionMap = new Map<string, string>();
  private planApprovalAgencyMap = new Map<string, object>();
  private planAgencyMap = new Map<string, ModelAgency>();
  private showLoader: boolean;
  private planToResend: any;

  //for local network admin
  @Input() isLocalNetworkAdmin: boolean;

  //for network view
  private systemId: string;
  private agencyId: string;
  private countryId: string;
  private participatingAgenciesId: string[] = [];
  private userType: UserType;
  private networkViewValues: {};
  private directorIdMap = new Map<string, string>()

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
  private waringMessage: string;
  private notesMap = new Map();
  private needShowDialog: boolean;
  private partnersMap = new Map();
  private partnersApprovalMap = new Map<string, string>();
  private responsePlanToEdit: any;
  private networkPlanExpireDuration: number;
  private isViewingFromExternal: boolean;
  private agencyOverview: boolean;
  private canCopy: boolean;


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
              private storageService: LocalStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params["countryId"]) {
        this.countryId = params["countryId"];
      }
      if (params["networkCountryId"]) {
        this.networkCountryId = params["networkCountryId"];
      }
      if (params["networkId"]) {
        this.networkId = params["networkId"];
      }
      if (params["isViewing"]) {
        this.isViewing = params["isViewing"];
      }
      if (params["agencyId"]) {
        this.agencyId = params["agencyId"];
      }
      if (params["systemId"]) {
        this.systemId = params["systemId"];
      }
      if (params["canCopy"]) {
        this.canCopy = params["canCopy"];
      }
      if (params["uid"]) {
        this.uid = params["uid"];
      }
      if (params["userType"]) {
        this.userType = params["userType"];
      }
      if (params["agencyOverview"]) {
        this.agencyOverview = params["agencyOverview"];
      }
      if (params["isViewingFromExternal"]) {
        this.isViewingFromExternal = params["isViewingFromExternal"];
      }
      if (!this.isLocalNetworkAdmin && params["networkCountryId"]) {
        this.networkCountryId = params["networkCountryId"];
      }
      this.getDirectorId();
      this.isViewing ? this.isLocalNetworkAdmin ? this.initLocalViewAccess() : this.initViewAccess() : this.isLocalNetworkAdmin ? this.localNetworkAdminAccess() : this.networkCountryAccess();
    })
  }

  private localNetworkAdminAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .flatMap(selection => {
          this.networkId = selection["id"];
          return this.networkService.getNetworkCountryResponsePlanClockSettingsDuration(this.networkId, this.networkCountryId);
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(duration => {
          this.networkPlanExpireDuration = duration;
          this.getResponsePlans(this.networkId);
          this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(map => {
              this.showLoader = false;
              this.agencyCountryMap = map;
              this.agenciesNeedToApprove = [];
              CommonUtils.convertMapToKeysInArray(this.agencyCountryMap).forEach(agencyId => {
                this.userService.getAgencyModel(agencyId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(model => {
                    console.log(model);
                    this.agenciesNeedToApprove.push(model);
                  });
                //prepare agency region map
                this.networkService.getRegionIdForCountry(this.agencyCountryMap.get(agencyId))
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(regionId => {
                    this.agencyRegionMap.set(agencyId, regionId);
                  });
              });
            });
        });
    });
  }

  private networkCountryAccess() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.showLoader = true;
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .flatMap(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];
          return this.networkService.getNetworkCountryResponsePlanClockSettingsDuration(this.networkId, this.networkCountryId);
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(duration => {
          this.networkPlanExpireDuration = duration;
          this.getResponsePlans(this.networkCountryId);
          this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(map => {
              this.showLoader = false;
              this.agencyCountryMap = map;
              this.agenciesNeedToApprove = [];
              CommonUtils.convertMapToKeysInArray(this.agencyCountryMap).forEach(agencyId => {
                this.userService.getAgencyModel(agencyId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(model => {
                    console.log(model);
                    this.agenciesNeedToApprove.push(model);
                  });
                //prepare agency region map
                this.networkService.getRegionIdForCountry(this.agencyCountryMap.get(agencyId))
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(regionId => {
                    this.agencyRegionMap.set(agencyId, regionId);
                  });
              });
            });
        });
    });
  }

  private initViewAccess() {
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.networkService.getNetworkCountryResponsePlanClockSettingsDuration(this.networkId, this.networkCountryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(duration => {
        this.networkPlanExpireDuration = duration;
        this.getResponsePlans(this.networkCountryId);
        this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(map => {
            this.agencyCountryMap = map;

            this.activePlans.forEach(plan => {

              this.participatingAgenciesId = plan.participatingAgencies;
              this.agenciesNeedToApprove = [];

              // if (this.planApprovalObjMap.get(plan.$key)) {
                Object.keys(this.participatingAgenciesId).forEach(agencyId => {
                  this.userService.getAgencyModel(agencyId)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(model => {
                      this.planAgencyMap.set(plan.$key, model)
                      console.log(this.planAgencyMap.get(plan.$key))
                      console.log(model);
                      this.agenciesNeedToApprove.push(this.planAgencyMap.get(plan.$key));
                      this.planApprovalAgencyMap.set(agencyId, this.agenciesNeedToApprove);
                    });
                  //prepare agency region map
                  this.networkService.getRegionIdForCountry(this.agencyCountryMap.get(agencyId))
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(regionId => {
                      this.agencyRegionMap.set(agencyId, regionId);
                    });
                });
              // }
            });


            // Object.keys(this.participatingAgenciesId).forEach(agencyId => {
            //   this.userService.getAgencyModel(agencyId)
            //     .takeUntil(this.ngUnsubscribe)
            //     .subscribe(model => {
            //
            //       console.log(model);
            //       this.agenciesNeedToApprove.push(model);
            //       this.planApprovalAgencyMap.set(agencyId, this.agenciesNeedToApprove);
            //
            //     });
            // })
          });
      });
  }

  initAgencyData() {
    this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(map => {
        this.agencyCountryMap = map;

        this.activePlans.forEach(plan => {

          this.agenciesNeedToApprove = [];
          Object.keys(this.participatingAgenciesId).forEach(agencyId => {
            // this.userService.getAgencyModel(agencyId)
            //   .takeUntil(this.ngUnsubscribe)
            //   .subscribe(model => {
            console.log(agencyId);
            // this.agenciesNeedToApprove.push(this.planAgencyMap.get(agencyId))
            //if(this.agencyId.includes(model.id)) {
            // this.planApprovalAgencyMap.set(plan.$key, this.agenciesNeedToApprove);
            // console.log(this.planApprovalAgencyMap)
            // }
            // });
            //prepare agency region map
            this.networkService.getRegionIdForCountry(this.agencyCountryMap.get(agencyId))
              .takeUntil(this.ngUnsubscribe)
              .subscribe(regionId => {
                this.agencyRegionMap.set(agencyId, regionId);
              });
          });
        });
      });
  }

  private initLocalViewAccess() {
    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.networkService.getNetworkResponsePlanClockSettingsDuration(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(duration => {
        this.networkPlanExpireDuration = duration;
        this.getResponsePlans(this.networkId);
        this.networkService.getAgencyCountryOfficesByNetwork(this.networkId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(map => {
            this.agencyCountryMap = map;
            this.agenciesNeedToApprove = [];
            if (this.agencyCountryMap) {
              CommonUtils.convertMapToKeysInArray(this.agencyCountryMap).forEach(agencyId => {
                this.userService.getAgencyModel(agencyId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(model => {
                    console.log(model);
                    this.agenciesNeedToApprove.push(model);
                  });
                //prepare agency region map
                this.networkService.getRegionIdForCountry(this.agencyCountryMap.get(agencyId))
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(regionId => {
                    this.agencyRegionMap.set(agencyId, regionId);
                  });
              });
            }
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
            console.log(plan.approval);
            this.planApprovalObjMap.set(plan.$key, plan.approval);
            console.log(this.planApprovalObjMap);
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
    // return list[0] == ApprovalStatus.Approved;
    return list[0];
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
    notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToResend.name});
    notification.time = new Date().getTime();

    if (user == 'countryDirector') {
      this.notificationService.saveUserNotification(this.directorIdMap.get(user), notification, UserType.CountryDirector, this.agencyId, this.countryId);
    } else if (user == 'regionDirector') {
      this.notificationService.saveUserNotification(this.directorIdMap.get(user), notification, UserType.RegionalDirector, this.agencyId, this.countryId);
    } else if (user == 'globalDirector') {
      this.notificationService.saveUserNotification(this.directorIdMap.get(user), notification, UserType.GlobalDirector, this.agencyId, this.countryId);
    }
  }

  closeModal(model: string) {
    jQuery(model).modal("hide");
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
              console.log(org);
              if (org.partners.length != 0) {
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
    let values = Object.assign({}, this.storageService.get(Constants.NETWORK_VIEW_VALUES), {id: responsePlan.$key})
    this.isViewing ?
      this.router.navigate(['/export-start-fund', values])
      :
      this.router.navigate(['/export-start-fund', this.isLocalNetworkAdmin ? {
        id: responsePlan.$key,
        "networkCountryId": this.networkId,
        "isLocalNetworkAdmin": true
      } : {
        id: responsePlan.$key,
        "networkCountryId": this.networkCountryId
      }]);
  }

  exportProposal(responsePlan, isExcel: boolean) {
    if (isExcel) {
      let values = Object.assign({}, this.storageService.get(Constants.NETWORK_VIEW_VALUES), {id: responsePlan.$key}, {excel: 1})
      this.isViewing ? this.router.navigate(['/export-proposal', values])
        :
        this.router.navigate(['/export-proposal', this.isLocalNetworkAdmin ? {
          id: responsePlan.$key,
          excel: 1,
          "networkCountryId": this.networkId,
          "isLocalNetworkAdmin": true
        } : {
          id: responsePlan.$key,
          excel: 1,
          "networkCountryId": this.networkCountryId
        }]);
    } else {
      let values = Object.assign({}, this.storageService.get(Constants.NETWORK_VIEW_VALUES), {id: responsePlan.$key}, {excel: 0})
      this.isViewing ? this.router.navigate(['/export-proposal', values])
        :
        this.router.navigate(['/export-proposal', this.isLocalNetworkAdmin ? {
          id: responsePlan.$key,
          excel: 0,
          "networkCountryId": this.networkId,
          "isLocalNetworkAdmin": true
        } : {
          id: responsePlan.$key,
          excel: 0,
          "networkCountryId": this.networkCountryId
        }]);
    }
  }

  archivePlan(plan) {
    //same as edit, need to reset approval status and validation process
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    let updateData = {};
    updateData["/responsePlan/" + id + "/" + plan.$key + "/approval"] = null;
    updateData["/responsePlan/" + id + "/" + plan.$key + "/isActive"] = false;
    updateData["/responsePlanValidation/" + plan.$key] = null;
    this.networkService.updateNetworkField(updateData);
    // this.af.database.object(Constants.APP_STATUS + "/responsePlan/" + this.countryId + "/" + plan.$key + "/isActive").set(false);
  }

  activatePlan(plan) {
    console.log("activate plan");
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.networkService.setNetworkField("/responsePlan/" + id + "/" + plan.$key + "/isActive", true);
    this.networkService.setNetworkField("/responsePlan/" + id + "/" + plan.$key + "/status", ApprovalStatus.NeedsReviewing);
    this.planService.getPlanApprovalData(id, plan.$key)
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
        let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
        for (let approval of approvalList) {
          if (approval["countryDirector"]) {
            this.networkService.setNetworkField("/responsePlan/" + id + "/" + plan.$key + "/approval/countryDirector/" + approval["countryDirector"], ApprovalStatus.NeedsReviewing);
          }
          if (approval["regionDirector"]) {
            this.networkService.setNetworkField("/responsePlan/" + id + "/" + plan.$key + "/approval/regionDirector/" + approval["regionDirector"], ApprovalStatus.NeedsReviewing);
          }
          if (approval["globalDirector"]) {
            this.networkService.setNetworkField("/responsePlan/" + id + "/" + plan.$key + "/approval/globalDirector/" + approval["globalDirector"], ApprovalStatus.NeedsReviewing);
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
      let networkViewObj = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
      if (networkViewObj) {
        networkViewObj["id"] = this.responsePlanToEdit.$key
      }
      this.router.navigate(['network-country/network-plans/create-edit-network-plan', this.isViewing ? networkViewObj : this.isLocalNetworkAdmin ? {
        id: this.responsePlanToEdit.$key,
        "isLocalNetworkAdmin": this.isLocalNetworkAdmin
      } : {id: this.responsePlanToEdit.$key}]);
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
    this.af.database.object(Constants.APP_STATUS + "/directorCountry", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snap => {
        if (snap && snap.val()) {
          let countriesHasDirector = Object.keys(snap.val());
          let approvalCanProceed = true
          CommonUtils.convertMapToValuesInArray(this.agencyCountryMap).forEach(countryId => {
            if (countriesHasDirector.indexOf(countryId) == -1) {
              approvalCanProceed = false
              this.waringMessage = "RESPONSE_PLANS.HOME.ERROR_NO_COUNTRY_DIRECTOR";
              this.alertMessage = new AlertMessageModel(this.waringMessage);
            }
          })
          if (approvalCanProceed) {
            CommonUtils.convertMapToKeysInArray(this.agencyCountryMap).forEach(agencyKey => {
              let approvalData = {};
              let countryId = this.agencyCountryMap.get(agencyKey);
              let agencyId = agencyKey;
              this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + countryId)
                .do(director => {
                  if (director && director.$value) {
                    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
                    // approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/countryDirector/" + director.$value] = ApprovalStatus.WaitingApproval;
                    approvalData["/responsePlan/" + id + "/" + this.planToApproval.$key + "/approval/countryDirector/" + countryId] = ApprovalStatus.WaitingApproval;
                    approvalData["/responsePlan/" + id + "/" + this.planToApproval.$key + "/status"] = ApprovalStatus.WaitingApproval;

                    // Send notification to country director
                    let notification = new MessageModel();
                    notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
                    notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
                    notification.time = new Date().getTime();
                    this.notificationService.saveUserNotification(director.$value, notification, UserType.CountryDirector, agencyId, countryId).then(() => {
                      console.log('we in here');
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
                    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
                    approvalData["/responsePlan/" + id + "/" + this.planToApproval.$key + "/approval/regionDirector/"] = null;
                    approvalData["/responsePlan/" + id + "/" + this.planToApproval.$key + "/approval/globalDirector/"] = null;
                    this.updatePartnerValidation(approvalData);

                  } else if (approvalSettings[0] != false && approvalSettings[1] == false) {
                    console.log("regional enabled");
                    this.updateWithRegionalApproval(agencyId, countryId, approvalData);
                  } else if (approvalSettings[0] == false && approvalSettings[1] != false) {
                    console.log("global enabled");
                    this.updateWithGlobalApproval(agencyId, countryId, approvalData);
                  } else {
                    console.log("both directors enabled");
                    this.updateWithGlobalApproval(agencyId, countryId, approvalData);
                    this.updateWithRegionalApproval(agencyId, countryId, approvalData);
                  }
                });
            });
          }
        } else {
          this.waringMessage = "RESPONSE_PLANS.HOME.ERROR_NO_COUNTRY_DIRECTOR";
          this.alertMessage = new AlertMessageModel(this.waringMessage);
        }
      })
    // }
  }

  private updatePartnerValidation(approvalData: {}) {
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
        if (id && id.$value && id.$value != "null") {
          console.log(id);
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
          let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
          approvalData["/responsePlan/" + id + "/" + this.planToApproval.$key + "/approval/regionDirector/" + snap.val()] = ApprovalStatus.WaitingApproval;
        }
        this.updatePartnerValidation(approvalData);
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
          let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
          // approvalData["/responsePlan/" + countryId + "/" + this.planToApproval.$key + "/approval/globalDirector/" + globalDirector[0].$key] = ApprovalStatus.WaitingApproval;
          approvalData["/responsePlan/" + id + "/" + this.planToApproval.$key + "/approval/globalDirector/" + agencyId] = ApprovalStatus.WaitingApproval;

          // Send notification to global director
          let notification = new MessageModel();
          notification.title = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_TITLE");
          notification.content = this.translate.instant("NOTIFICATIONS.TEMPLATES.RESPONSE_PLAN_APPROVAL_CONTENT", {responsePlan: this.planToApproval.name});
          notification.time = new Date().getTime();

          this.notificationService.saveUserNotification(globalDirector[0].$key, notification, UserType.GlobalDirector, agencyId, countryId).then(() => {
          });
        }
        this.updatePartnerValidation(approvalData);
      });
  }

  submitForPartnerValidation(plan) {
    let id = this.isLocalNetworkAdmin ? this.networkId : this.networkCountryId;
    this.planService.submitForPartnerValidation(plan, id);

    // //sort out require submission tag
    // this.handleRequireSubmissionTagForDirectors();
  }

  private getDirectorId() {
    let counter = 0;
    this.planService.getDirectors(this.countryId, this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(result => {
        counter++;
        console.log(counter);
        console.log(result);
        if (counter === 1 && result.$value && result.$value != null) {
          this.directorIdMap.set("countryDirector", result.$value)
        }
        if (counter === 2 && result.$value && result.$value != null) {
          this.directorIdMap.set("regionDirector", result.$value)
        }
        if (counter === 3 && result.length > 0) {
          this.directorIdMap.set("globalDirector", result[0].$key)
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
    let text = "";
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

  viewResponsePlan(plan, isViewingFromExternal) {
    // if (params["countryId"]) {
    //   this.countryId = params["countryId"];
    // }
    // if (params["networkCountryId"]) {
    //   this.networkCountryId = params["networkCountryId"];
    // }
    // if (params["networkId"]) {
    //   this.networkId = params["networkId"];
    // }
    // if (params["isViewing"]) {
    //   this.isViewing = params["isViewing"];
    // }
    // if (params["agencyId"]) {
    //   this.agencyId = params["agencyId"];
    // }
    // if (params["systemId"]) {
    //   this.systemId = params["systemId"];
    // }
    // if (params["canCopy"]) {
    //   this.canCopy = params["canCopy"];
    // }
    // if (params["uid"]) {
    //   this.uid = params["uid"];
    // }
    // if (params["userType"]) {
    //   this.userType = params["userType"];
    // }
    // if (params["agencyOverview"]) {
    //   this.agencyOverview = params["agencyOverview"];
    // }
    // if (params["isViewingFromExternal"]) {
    //   this.isViewingFromExternal = params["isViewingFromExternal"];
    // }
    // if (!this.isLocalNetworkAdmin && params["networkCountryId"]) {
    //   this.networkCountryId = params["networkCountryId"];
    // }
    if (this.isViewingFromExternal) {
      let headers = {
        "id": plan.$key,
        "isViewingFromExternal": isViewingFromExternal,
        "isViewing": this.isViewing,
        "countryId": this.countryId,
        "agencyId": this.agencyId,
        "networkId": this.networkId,
        "systemId": this.systemId,
        "uid": this.uid,
        "userType": this.userType
      };
      if (!this.isLocalNetworkAdmin && this.networkCountryId) {
        headers["networkCountryId"] = this.networkCountryId
      }
      if (this.agencyOverview) {
        headers["agencyOverview"] = this.agencyOverview;
      }
      if (this.canCopy) {
        headers["canCopy"] = this.canCopy;
      }
      this.router.navigate(["/response-plans/view-plan", headers]);
    } else if (this.isViewing) {
      let obj = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
      obj["id"] = plan.$key
      this.router.navigate(["/network-country/network-plans/view-network-plan", obj]);
    } else {
      this.router.navigate(["/network-country/network-plans/view-network-plan", this.isLocalNetworkAdmin ? {
        "id": plan.$key,
        "networkCountryId": this.networkId,
        "isLocalNetworkAdmin": true
      } : {"id": plan.$key, "networkCountryId": this.networkCountryId}]);
    }
  }

  checkAgency(agency, plan) {
    this.participatingAgenciesId = plan.participatingAgencies;
    Object.keys(this.participatingAgenciesId).forEach(agencyId => {
      this.userService.getAgencyModel(agencyId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(model => {
          console.log(model);


          this.agenciesNeedToApprove.push(model);

        });
    });


  }
}
