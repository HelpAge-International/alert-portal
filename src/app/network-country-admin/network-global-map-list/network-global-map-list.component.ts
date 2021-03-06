import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NetworkMapService} from '../../services/networkmap.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AngularFire} from 'angularfire2';
import {PageControlService} from '../../services/pagecontrol.service';
import {NetworkService} from '../../services/network.service';
import {RegionHolder} from '../../map/map-countries-list/map-countries-list.component';
import {Constants} from '../../utils/Constants';
import {Subject} from 'rxjs/Subject';
import {Countries} from "../../utils/Enums";
import {HazardImages} from "../../utils/HazardImages";

/**
 * Created by jordan on 08/10/2017.
 */

@Component({
  selector: 'app-network-global-map-list',
  templateUrl: './network-global-map-list.component.html',
  styleUrls: ['./network-global-map-list.component.css']
})
export class NetworkGlobalMapListComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private networkId: string;
  private networkCountryId: string;
  private systemAdminId: string;

  public isViewing: boolean;
  @Input() isLocalNetworkAdmin: boolean;
  public paramString: string;

  private HazardScenario = Constants.HAZARD_SCENARIOS;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              public networkMapService: NetworkMapService,
              private networkService: NetworkService) {
  }

  ngOnInit() {

    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.route.params
        .subscribe((params: Params) => {
          if (params != null) {
            for (let x in params) {
              if (this.paramString == null) {
                this.paramString = "";
              }
              this.paramString += ";" + x + "=" + params[x];
            }
          }
          // this.paramString = params.
          if (params["networkId"]) {
            this.networkId = params["networkId"];
          }
          if (params["networkCountryId"]) {
            this.networkCountryId = params["networkCountryId"];
          }
          if (params["uid"]) {
            this.uid = params["uid"];
          }
          if (params["systemId"]) {
            this.systemAdminId = params["systemId"];
          }
          if (params["isViewing"]) {
            this.isViewing = params["isViewing"];
          }
          if (this.networkId != null && this.networkCountryId != null && this.uid != null && this.systemAdminId) {
            this.networkMapService.init(this.af, this.ngUnsubscribe, this.systemAdminId, this.networkId, this.networkCountryId,
              () => {
                // THIS METHOD CALLED WHEN EVERYTHING IS DONE!!
                console.log('Network map initialised');

              },
              (country) => {
                // Do nothing. First element is null so map isn't intialised
              });
          } else {
            this.uid = user.uid;
            console.log(this.uid);
            this.networkService.getSelectedIdObj(this.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(selection => {
                this.networkId = selection['id'];
                this.networkCountryId = selection['networkCountryId'];
                // TODO: Delete this method when page control does auth properly
                this.getSystemAdmin(this.uid, (systemAdminId => {
                  this.networkMapService.init(this.af, this.ngUnsubscribe, systemAdminId, this.networkId, this.networkCountryId,
                    () => {
                      // THIS METHOD CALLED WHEN EVERYTHING IS DONE!!
                      console.log('Network map initialised');
                    },
                    (country) => {
                      // Do nothing. First element is null so map isn't intialised
                    });
                }));
              });
          }
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public gotoListView() {
    if (this.isLocalNetworkAdmin) {
      this.router.navigateByUrl('network/local-network-global-maps' + this.paramString)
    } else {
      if (this.paramString == null) {
        this.router.navigateByUrl('network-country/network-global-map');
      }
      else {
        this.router.navigateByUrl('network-country/network-global-map' + this.paramString);
      }
    }
  }


  /**
   * Utility methods for the UI, getting CountryCodes and some simple tests
   */
  public getCountryCodeFromLocation(location: number) {
    return Countries[location];
  }

  public getCSSHazard(hazard: number) {
    return HazardImages.init().getCSS(hazard);
  }

  public isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  /**
   * Method to pull the system admin ID
   * TODO: Remove this when pagecontrol does the user permissions and returns this value
   */
  private getSystemAdmin(uid: string, done: (systemAdminId: string) => void) {
    this.af.database.object(Constants.APP_STATUS + '/administratorNetwork/' + uid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          // We're a Network Admin
          for (const key in snap.val().systemAdmin) {
            done(key);
          }
        }
        else {
          this.af.database.object(Constants.APP_STATUS + '/administratorNetworkCountry/' + uid, {preserveSnapshot: true})
            .takeUntil(this.ngUnsubscribe)
            .subscribe((anSnap) => {
              if (anSnap.val() != null) {
                // We're a Network Country Admin
                for (const key in anSnap.val().systemAdmin) {
                  done(key);
                }
              }
              else {
                // Not found?
                done(null);
              }
            });
        }
      });
  }
}
