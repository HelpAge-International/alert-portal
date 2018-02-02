import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {UserType} from "../../../utils/Enums";
import {LocalStorageService} from "angular-2-local-storage";
import {Constants} from "../../../utils/Constants";

@Component({
  selector: 'app-view-network-plan',
  templateUrl: './view-network-plan.component.html',
  styleUrls: ['./view-network-plan.component.scss']
})
export class ViewNetworkPlanComponent implements OnInit {

  private isLocalNetworkAdmin: boolean;
  private isViewing: boolean;
  private systemId : string;
  private agencyId : string;
  private countryId : string;
  private userType : UserType;
  private networkId : string;
  private networkCountryId : string;
  private networkViewValues: {};

  constructor(private route:ActivatedRoute,
              private storageService:LocalStorageService) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params) =>{
      if (params["isLocalNetworkAdmin"]) {
        this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
      }
      if (params["isViewing"]) {
        this.isViewing = params["isViewing"];
      }
      if (params["systemId"]) {
        this.systemId = params["systemId"];
      }
      if (params["agencyId"]) {
        this.agencyId = params["agencyId"];
      }
      if (params["countryId"]) {
        this.countryId = params["countryId"];
      }
      if (params["userType"]) {
        this.userType = params["userType"];
      }
      if (params["networkId"]) {
        this.networkId = params["networkId"];
      }
      if (params["networkCountryId"]) {
        this.networkCountryId = params["networkCountryId"];
      }
      // if (params["isViewing"] && params["systemId"] && params["agencyId"] && params["countryId"] && params["userType"] && params["networkId"] && params["networkCountryId"]) {
      //   this.isViewing = params["isViewing"];
      //   this.systemId = params["systemId"];
      //   this.agencyId = params["agencyId"];
      //   this.countryId = params["countryId"];
      //   this.userType = params["userType"];
      //   this.networkId = params["networkId"];
      //   this.networkCountryId = params["networkCountryId"];
      //   this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
      // }
      this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES)
    })
  }

}
