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

declare var jQuery: any;

@Component({
  selector: 'app-network-global-map',
  templateUrl: './network-global-map.component.html',
  styleUrls: ['./network-global-map.component.css']
})

export class NetworkGlobalMapComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public mapService: MapService;

  public uid: string;
  public networkId: string;
  public networkCountryId: string;
  private countryHasAgenciesMap: Map<string, Set<string>>;

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
          this.networkId = selection['id'];
          this.networkCountryId = selection['networkCountryId'];
          this.networkMapService.init(this.af, this.ngUnsubscribe, this.networkId, this.networkCountryId);
        });

      this.mapService = MapService.init(this.af, this.ngUnsubscribe);
      this.mapService.initBlankMap('global-map');
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  gotoMapList(): void {
    this.router.navigateByUrl('network-country/network-global-map-list');
  }

  /**
   * Show the popup dialog
   */
  public showDialog(location: number) {
    jQuery('#minimum-prep-modal-' + location).modal('show');
  }
}
