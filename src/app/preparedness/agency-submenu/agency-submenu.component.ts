import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Constants} from "../../utils/Constants";
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {Countries, DocumentType, SizeType} from "../../utils/Enums";
import {Subject} from "rxjs";
import {PageControlService} from "../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-agency-submenu',
  templateUrl: './agency-submenu.component.html',
  styleUrls: ['./agency-submenu.component.css']
})

export class AgencySubmenuComponent implements OnInit, OnDestroy {
  COUNTRIES = Constants.COUNTRIES;

  protected CountriesEnum = Object.keys(Countries).map(k => Countries[k]).filter(v => typeof v === "string") as string[];
  protected location;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() countryId: string;
  @Input() isLocalAgency: boolean;

  constructor(protected pageControl: PageControlService, protected route: ActivatedRoute, protected router: Router, protected af: AngularFire, protected _sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, type, countryId, agencyId, systemId) => {
      if(this.isLocalAgency){
        this.af.database.list(Constants.APP_STATUS + '/agency/' + agencyId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(agency => {
            this.location = agency.country;
          });
      }else{
        this.af.database.list(Constants.APP_STATUS + '/countryOffice/')
          .takeUntil(this.ngUnsubscribe)
          .subscribe(offices => {
            offices.map(office => {
              Object.keys(office).map(countryId => {
                if (this.countryId == countryId)
                  this.location = office[countryId].location;
              });
            });
          });
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected getBackground() {
    if (this.location)
      return this._sanitizer.bypassSecurityTrustStyle('url(/assets/images/countries/' + this.CountriesEnum[this.location] + '.svg)');
  }

}
