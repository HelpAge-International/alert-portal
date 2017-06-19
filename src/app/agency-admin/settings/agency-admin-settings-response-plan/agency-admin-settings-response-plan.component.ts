import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {ResponsePlanSectionSettings, ResponsePlansApprovalSettings} from "../../../utils/Enums";
import {Subject} from "rxjs";

@Component({
  selector: 'app-agency-admin-settings-response-plan',
  templateUrl: './agency-admin-settings-response-plan.component.html',
  styleUrls: ['./agency-admin-settings-response-plan.component.css']
})

export class AgencyAdminSettingsResponsePlanComponent implements OnInit, OnDestroy {

  RESPONSE_PLANS_SECTION_SETTINGS = Constants.RESPONSE_PLANS_SECTION_SETTINGS;
  protected ResponsePlanSectionSettings = Object.keys(ResponsePlanSectionSettings).map(k => ResponsePlanSectionSettings[k]).filter(v => typeof v !== "string") as string[];
  protected ResponsePlansApprovalSettings = Object.keys(ResponsePlansApprovalSettings).map(k => ResponsePlansApprovalSettings[k]).filter(v => typeof v !== "string") as string[];

  private uid: string = "";

  private sections: any[] = [];
  private approvals: any[] = [];
  private saved: boolean = false;
  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.af.database.list(Constants.APP_STATUS + '/agency/' + this.uid + '/responsePlanSettings/sections')
          .takeUntil(this.ngUnsubscribe)
          .subscribe(_ => {
            this.ResponsePlanSectionSettings.map(sectionSetting => {
              this.sections[sectionSetting] = {$key: sectionSetting, $value: false};
            });

            _.map(section => {
              this.sections[section.$key] = section;
            });
          });

        this.af.database.list(Constants.APP_STATUS + '/agency/' + this.uid + '/responsePlanSettings/approvalHierachy')
          .takeUntil(this.ngUnsubscribe)
          .subscribe(_ => {
            this.ResponsePlansApprovalSettings.map(approvalSetting => {
              this.approvals[approvalSetting] = {$key: approvalSetting, $value: false};
            });

            _.map(approval => {
              this.approvals[approval.$key] = approval;
            });
          });

      } else {
        // user is not logged in
        console.log('Error occurred - User is not logged in');
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
    try {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    } catch (e) {
      console.log('Unable to releaseAll');
    }
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private changeStatus(sectionId, status) {
    this.sections[sectionId].$value = status;
  }

  private changeApproval(approvalId, status) {
    this.approvals[approvalId].$value = status;
  }

  private cancelChanges() {
    this.alertSuccess = false;
    this.alertShow = true;
    this.ngOnInit();
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

  private saveChanges() {
    var sectionItems = {};
    var sections = this.sections.map((section, index) => {

      sectionItems[index] = this.sections[index].$value;

      return this.sections[index];
    });

    this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/responsePlanSettings/sections')
      .set(sectionItems)
      .then(_ => {
        if (!this.alertShow) {
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.SAVE_SUCCESS_RES_PLAN_SETTINGS";
        }
      })
      .catch(err => console.log(err, 'You do not have access!'));

    var approvalItems = {};
    var approvals = this.approvals.map((approval, index) => {

      approvalItems[index] = this.approvals[index].$value;

      return this.approvals[index];
    });

    this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/responsePlanSettings/approvalHierachy')
      .set(approvalItems)
      .then(_ => {
        if (!this.alertShow) {
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.SAVE_SUCCESS_RES_PLAN_SETTINGS";
        }
      })
      .catch(err => console.log(err, 'You do not have access!'));
  }

}
