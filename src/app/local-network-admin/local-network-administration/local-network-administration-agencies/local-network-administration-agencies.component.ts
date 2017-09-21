import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";

@Component({
  selector: 'app-local-network-administration-agencies',
  templateUrl: './local-network-administration-agencies.component.html',
  styleUrls: ['./local-network-administration-agencies.component.scss']
})
export class LocalNetworkAdministrationAgenciesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToAddAgency(){
    this.router.navigateByUrl("/network/local-network-administration/agencies/invite");
  }

}
