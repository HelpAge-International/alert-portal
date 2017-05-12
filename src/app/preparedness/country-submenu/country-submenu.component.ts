import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import {Constants} from "../../utils/Constants";
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {Countries, DocumentType, SizeType} from "../../utils/Enums";
import {RxHelper} from '../../utils/RxHelper';
import {AgencySubmenuComponent} from '../agency-submenu/agency-submenu.component';

@Component({
  selector: 'app-country-submenu',
  templateUrl: './country-submenu.component.html',
  styleUrls: ['./country-submenu.component.css']
})
export class CountrySubmenuComponent extends AgencySubmenuComponent implements OnInit {

	@Input() countryId: string;
	@Input() agencyId: string;
	constructor(protected af: AngularFire, protected _sanitizer: DomSanitizer) {
			super(af, _sanitizer);
	}

	ngOnInit() {
		
	}

}
