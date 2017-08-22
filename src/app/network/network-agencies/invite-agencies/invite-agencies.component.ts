import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Constants} from "../../../utils/Constants";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgencyService} from "../../../services/agency-service.service";
import {ModelAgency} from "../../../model/agency.model";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-invite-agencies',
  templateUrl: './invite-agencies.component.html',
  styleUrls: ['./invite-agencies.component.css']
})
export class InviteAgenciesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums


  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic
  private networkId: string;
  private agencies: Observable<ModelAgency[]>;
  private agencySelectionMap = new Map<string, boolean>();
  private agencyNameMap = new Map<string, string>();
  private selectedAgencies: string[];


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private agencyService: AgencyService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {

      //get network id
      this.networkService.getSelectedId(user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          this.networkId = selection["id"];

          //fetch all agencies
          this.agencies = this.agencyService.getAllAgencyFromPlatform()

        })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.agencyService.unSubscribeNow();
  }

  toggleAgencySelection(agency, value) {
    this.agencySelectionMap.set(agency.id, value);
    this.agencyNameMap.set(agency.id, agency.name);
  }

  showSelectedAgencies() {
    this.selectedAgencies = [];
    this.agencySelectionMap.forEach((v,k) =>{
      if (v) {
        this.selectedAgencies.push(k);
      }
    });
  }

}
