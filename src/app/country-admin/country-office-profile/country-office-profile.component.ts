import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Observable, Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RxHelper} from '../../utils/RxHelper';

@Component({
  selector: 'app-country-office-profile',
  templateUrl: 'country-office-profile.component.html',
  styleUrls: ['country-office-profile.component.css']
})
export class CountryOfficeProfileComponent implements OnInit {

	protected subscriptions: RxHelper;

	protected countryId = null;
	protected obsCountryId: Subject<string> = new Subject();
	protected countrySelected = false;

  constructor( protected router: Router, protected route: ActivatedRoute) {
	    this.subscriptions = new RxHelper;

	    let subscription = this.route.params.subscribe((params: Params) => {
	        if (params['countryId']) {
	            this.countryId = params['countryId'];
	            this.obsCountryId.next(this.countryId);

	            this.countrySelected = true;
	        }
	    });
	}

  ngOnInit() {
  }

}
