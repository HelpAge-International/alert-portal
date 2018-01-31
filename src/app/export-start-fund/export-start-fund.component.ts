import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {UserType} from "../utils/Enums";
import {LocalStorageService} from "angular-2-local-storage";
import {Constants} from "../utils/Constants";

@Component({
  selector: 'app-export-start-fund',
  templateUrl: './export-start-fund.component.html',
  styleUrls: ['./export-start-fund.component.css']
})

export class ExportStartFundComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private networkCountryId: string;
  private isLocalNetworkAdmin: boolean;

  private isViewing: boolean;
  private systemId:string;
  private agencyId:string;
  private countryId:string;
  private userType:UserType;
  private networkId:string;
  private uid:string;
  private networkViewValues: {};
  public isLocalAgency: boolean;

  constructor(private route:ActivatedRoute,
              private storageService:LocalStorageService) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
    this.route.params
      .subscribe((params:Params) =>{
      if(params['isLocalAgency']){
        this.isLocalAgency = true
      }else{
        this.isLocalAgency = false;
      }
        if (params["networkCountryId"]) {
          this.networkCountryId = params["networkCountryId"];
        }
        if (params["isLocalNetworkAdmin"]) {
          this.isLocalNetworkAdmin = params["networkCountryId"];
        }
        if (params["isViewing"] && params["systemId"] && params["agencyId"] && params["countryId"] && params["userType"] && params["networkId"] && params["networkCountryId"]) {
          this.isViewing = params["isViewing"];
          this.systemId = params["systemId"];
          this.agencyId = params["agencyId"];
          this.countryId = params["countryId"];
          this.userType = params["userType"];
          this.networkId = params["networkId"];
          this.networkCountryId = params["networkCountryId"];
          this.uid = params["uid"];
          this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
