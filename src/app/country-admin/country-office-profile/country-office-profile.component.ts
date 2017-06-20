import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Observable} from 'rxjs';
import {Subject} from 'rxjs';


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


  constructor(private pageControl: PageControlService,  protected router: Router, protected route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
        console.log(params);
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
      this.router.navigate(['/country-admin/country-office-profile/programme/']);
  }

}
