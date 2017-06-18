import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Constants} from "../../utils/Constants";
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {Countries, DocumentType, SizeType} from "../../utils/Enums";
import {AgencySubmenuComponent} from '../agency-submenu/agency-submenu.component';
import {PageControlService} from "../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-country-submenu',
  templateUrl: './country-submenu.component.html',
  styleUrls: ['./country-submenu.component.css']
})

export class CountrySubmenuComponent extends AgencySubmenuComponent implements OnInit {

  private agencyLogo: string = '';
  private agencyName: string = '';

  @Input() countryId: string;
  @Input() agencyId: string;

  constructor(protected pageControl: PageControlService, protected route: ActivatedRoute, protected router: Router, protected af: AngularFire, protected _sanitizer: DomSanitizer) {
    super(pageControl, route, router, af, _sanitizer);
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadAgencyData();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getAgencyBackground() {
    if (this.agencyLogo) {
      return this._sanitizer.bypassSecurityTrustStyle('url(' + this.agencyLogo + ')');
    }
  }

  private loadAgencyData() {
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(agency => {
        this.agencyLogo = agency.logoPath;
        this.agencyName = agency.name;
      });
  }

}
