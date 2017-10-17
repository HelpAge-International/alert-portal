import {Component, OnInit, OnDestroy} from '@angular/core';
import {MapService} from '../../services/map.service';
import {PageControlService} from '../../services/pagecontrol.service';
import {AngularFire} from 'angularfire2';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {Constants} from '../../utils/Constants';
import {Subject} from 'rxjs/Subject';
import {NetworkService} from '../../services/network.service';
import {NetworkMapService} from '../../services/networkmap.service';
import {Countries} from "../../utils/Enums";

declare var jQuery: any;

@Component({
  selector: 'app-network-global-map',
  templateUrl: './network-global-map.component.html',
  styleUrls: ['./network-global-map.component.css']
})

export class NetworkGlobalMapComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public uid: string;
  public networkId: string;
  public networkCountryId: string;
  private countryHasAgenciesMap: Map<string, Set<string>>;

  private HazardScenario = Constants.HAZARD_SCENARIOS;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              public networkMapService: NetworkMapService,
              private networkService: NetworkService) {
    this.countryHasAgenciesMap = new Map<string, Set<string>>();
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;
      this.networkService.getSelectedIdObj(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(selection => {
          // TODO: Work out the system admin ID
          this.networkId = selection['id'];
          this.networkCountryId = selection['networkCountryId'];
          // TODO: Un-hard-code this system admin ID!
          this.networkMapService.init('global-map', this.af, this.ngUnsubscribe, "wFCEPYdAzCO2YLDKoYssas46t402",  this.networkId, this.networkCountryId,
            () => {
              // THIS METHOD CALLED WHEN EVERYTHING IS DONE!!
              console.log("DONE!");
            },
            (country) => {
              this.showDialog(country);
            });
        });

      // this.mapService = MapService.init(this.af, this.ngUnsubscribe);
      // this.mapService.initBlankMap('global-map');
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  gotoMapList(): void {
    this.router.navigateByUrl('network-country/network-global-map-list');
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

  /**
   * Show the popup dialog
   */
  public showDialog(countryCode: string) {
    jQuery('#minimum-prep-modal-' + countryCode).modal('show');
  }
}
