import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-view-network-plan',
  templateUrl: './view-network-plan.component.html',
  styleUrls: ['./view-network-plan.component.scss']
})
export class ViewNetworkPlanComponent implements OnInit {
  private isLocalNetworkAdmin: boolean;

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params) =>{
      if (params["isLocalNetworkAdmin"]) {
        this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
      }
    })
  }

}
