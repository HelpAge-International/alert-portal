import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-network-account-details',
  templateUrl: './network-account-details.component.html',
  styleUrls: ['./network-account-details.component.css']
})
export class NetworkAccountDetailsComponent implements OnInit {

  private isLocalNetworkAdmin: boolean;


  constructor(private route:ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      if (params["isLocalNetworkAdmin"]) {
        this.isLocalNetworkAdmin = params["isLocalNetworkAdmin"];
      }
    })
  }

}
