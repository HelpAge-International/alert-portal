import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Countries, Privacy} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {AgencyService} from "../../services/agency-service.service";
import {ModelAgencyPrivacy} from "../../model/agency-privacy.model";
import {PageControlService} from "../../services/pagecontrol.service";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-view-country-menu',
  templateUrl: './view-country-menu.component.html',
  styleUrls: ['./view-country-menu.component.css'],
  providers: [AgencyService, SettingsService]
})
export class ViewCountryMenuComponent implements OnInit, OnDestroy {

  private CountryNames = Constants.COUNTRIES;
  private Privacy = Privacy;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Output() onMenuSelected = new EventEmitter<string>();

  private menuSelected = "officeProfile";
  private menuMap = new Map<string, boolean>();
  private agencyId: string;
  private countryId: string;
  private countryLocation: number = -1;
  private privacy: ModelAgencyPrivacy;
  private userAgencyId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private pageControl: PageControlService,
              private countryService:SettingsService,
              private agencyService: AgencyService) {
    this.menuMap.set("officeProfile", false);
    this.menuMap.set("risk", false);
    this.menuMap.set("preparedness", false);
    this.menuMap.set("plan", false);
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.userAgencyId = agencyId;

      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["from"]) {
            this.handleActiveClass(params["from"])
          } else {
            this.handleActiveClass("officeProfile");
          }
          if (params["agencyId"]) {
            this.agencyId = params["agencyId"];
          }
          if (params["countryId"]) {
            this.countryId = params["countryId"];
          }
          if (this.agencyId && this.countryId) {
            this.loadCountry(this.agencyId, this.countryId);

            this.countryService.getPrivacySettingForCountry(this.countryId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(privacy => {
                this.privacy = privacy;
                this.updateMainMenu(this.privacy);
              });
          }
        });

    });
  }

  private updateMainMenu(privacy: ModelAgencyPrivacy) {
    if (this.userAgencyId == this.agencyId) {
      this.handleActiveClass("officeProfile");
    } else {
      if (privacy.officeProfile != Privacy.Public) {
        if (privacy.riskMonitoring == Privacy.Public) {
          this.handleActiveClass("risk");
        } else if (privacy.mpa == Privacy.Public || privacy.apa == Privacy.Public) {
          this.handleActiveClass("preparedness");
        } else if (privacy.responsePlan == Privacy.Public) {
          this.handleActiveClass("plan");
        } else {
          this.handleActiveClass("");
        }
      } else {
        this.handleActiveClass("officeProfile");
      }
    }
  }

  private loadCountry(agencyId: string, countryId: string) {
    this.userService.getCountryDetail(countryId, agencyId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(country => {
        this.countryLocation = country.location;
        console.log(this.countryLocation);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private handleActiveClass(name: string) {
    this.menuMap.forEach((v, k) => {
      this.menuMap.set(k, k == name);
    });
  }

  menuSelection(menu: string) {
    this.onMenuSelected.emit(menu);
    this.menuSelected = menu;
    this.handleActiveClass(menu);
  }

  getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }
}
