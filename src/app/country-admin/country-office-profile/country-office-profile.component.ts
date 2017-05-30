import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Observable} from 'rxjs';


import { AlertMessageModel } from "../../model/alert-message.model";
import { DisplayError } from "../../errors/display.error";
import { AlertMessageType } from "../../utils/Enums";

@Component({
  selector: 'app-country-office-profile',
  templateUrl: 'country-office-profile.component.html',
  styleUrls: ['country-office-profile.component.css']
})
export class CountryOfficeProfileComponent implements OnInit {

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;

  constructor( protected router: Router, protected route: ActivatedRoute) {
	    
	}

  ngOnInit() {
  }

}
