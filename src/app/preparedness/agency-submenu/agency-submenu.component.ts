import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import {Constants} from "../../utils/Constants";
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {Countries, DocumentType, SizeType} from "../../utils/Enums";
import {RxHelper} from '../../utils/RxHelper';

@Component({
  selector: 'app-agency-submenu',
  templateUrl: './agency-submenu.component.html',
  styleUrls: ['./agency-submenu.component.css']
})
export class AgencySubmenuComponent implements OnInit {
	COUNTRIES = Constants.COUNTRIES;

	protected CountriesEnum = Object.keys(Countries).map(k => Countries[k]).filter(v => typeof v === "string") as string[];
	protected subscriptions: RxHelper;
	protected location;

	@Input() countryId: string;

	constructor(protected af: AngularFire, protected _sanitizer: DomSanitizer) {
	    this.subscriptions = new RxHelper;
	}

	ngOnInit() {
		this.af.database.list(Constants.APP_STATUS+'/countryOffice/').subscribe(offices => {
			offices.map(office => {
				Object.keys(office).map(countryId => {
					if (this.countryId == countryId)
						this.location = office[countryId].location;
				});	
			});
			
		});
	}

	protected getBackground() {
		return this._sanitizer.bypassSecurityTrustStyle('url(/assets/images/countries/' + this.CountriesEnum[this.location] + '.svg)');
	}

}
