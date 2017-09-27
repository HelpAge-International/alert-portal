import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FirebaseListObservable} from "angularfire2";
import {Constants} from "../../utils/Constants";
import {ResponsePlanService} from "../../services/response-plan.service";
import {UserService} from "../../services/user.service";
import {AgencyService} from "../../services/agency-service.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-network-plans',
  templateUrl: './network-plans.component.html',
  styleUrls: ['./network-plans.component.css'],
  providers: [ResponsePlanService]
})
export class NetworkPlansComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private networkCountryId: string;


  //copy over from response plan
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
  private partnersMap = new Map();
  private partnersApprovalMap = new Map<string, string>();
  private responsePlanToEdit: any;
  private approvalsList: any[] = [];
  private directorSubmissionRequireMap = new Map<number, boolean>();
  private agencyPlanExpireDuration: number;


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private service: ResponsePlanService,
              private userService: UserService,
              private agencyService: AgencyService,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      // this.showLoader = true;

      //get network id
      this.networkService.getSelectedIdObj(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];
          this.networkCountryId = selection["networkCountryId"];


        })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
