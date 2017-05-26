import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {Countries} from "../../utils/Enums";
import {AgencyService} from "../../services/agency-service.service";

@Component({
  selector: 'app-facetoface-meeting-request',
  templateUrl: 'facetoface-meeting-request.component.html',
  styleUrls: ['facetoface-meeting-request.component.css'],
  providers: [AgencyService]
})
export class FacetofaceMeetingRequestComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private COUNTRIES = Countries;
  private uid: string;
  private countryId: string;
  private agencyId: string;


  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute, private agencyService: AgencyService) {
  }

  ngOnInit() {
    this.af.auth
      .takeUntil(this.ngUnsubscribe)
      .subscribe(auth => {
        if (auth) {
          this.uid = auth.uid;
          this.route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe((params: Params) => {
              if (params["countryId"] && params["agencyId"]) {
                this.countryId = params["countryId"];
                this.agencyId = params["agencyId"];
                this.initData(this.countryId, this.agencyId);
              }
            });
        } else {
          this.router.navigateByUrl(Constants.LOGIN_PATH);
        }
      });
  }

  private initData(countryId, agencyId) {
    this.agencyService.getAllAgencySameCountry(countryId, agencyId);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.agencyService.unSubscribeNow();
  }

}
