import {Component, OnInit, OnDestroy, Inject, Input} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Observable, Subject} from 'rxjs';


import { AlertMessageModel } from "../../model/alert-message.model";
import { DisplayError } from "../../errors/display.error";
import { AlertMessageType } from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-country-office-profile',
  templateUrl: 'country-office-profile.component.html',
  styleUrls: ['country-office-profile.component.css']
})
export class CountryOfficeProfileComponent implements OnInit {

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;

  protected countrySelected = false;
  protected agencySelected = false;

  protected countryId = null;
  protected agencyId = null;
  protected obsCountryId: Subject<string> = new Subject();

  @Input() isLocalAgency: boolean;


  constructor(private pageControl: PageControlService,  protected router: Router, protected route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      if (params['countryId']) {
        this.countryId = params['countryId'];
        this.obsCountryId.next(this.countryId);

        this.countrySelected = true;
      }

      if (params['agencyId']) {
        this.agencyId = params['agencyId'];

        this.agencySelected = true;
      }
    });
	}

  ngOnInit() {
    if(this.isLocalAgency){
      this.router.navigate(['/local-agency/profile/programme/']);
    }else{
      this.router.navigate(['/country-admin/country-office-profile/programme/']);
    }

  }

}
