import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {MapService} from '../../services/map.service';
import {PageControlService} from '../../services/pagecontrol.service';
import {AngularFire} from 'angularfire2';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {Constants} from '../../utils/Constants';
import {Subject} from 'rxjs/Subject';
import {NetworkService} from '../../services/network.service';
import {NetworkMapService} from '../../services/networkmap.service';
import {Countries, NetworkUserAccountType} from "../../utils/Enums";

declare var jQuery: any;

@Component({
  selector: 'app-network-global-map',
  templateUrl: './network-global-map.component.html',
  styleUrls: ['./network-global-map.component.css']
})

export class NetworkGlobalMapComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public isViewing: boolean;
  @Input() isLocalNetworkAdmin: boolean;
  private paramString: string;

  public uid: string;
  public networkId: string;
  public networkCountryId: string;
  public systemAdminId: string;

  private HazardScenario = Constants.HAZARD_SCENARIOS;
  private agencyId: string;
  private countryId: string;

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
          if (params["agencyId"]) {
            this.agencyId = params["agencyId"];
          }
          if (params["countryId"]) {
            this.countryId = params["countryId"];
          }
          if (params["isViewing"]) {
            this.isViewing = params["isViewing"];
          }
          console.log("Network Country Id: " + this.networkCountryId);
          if (this.networkId != null && this.uid != null && this.systemAdminId) {
            this.networkMapService.init('global-map', this.af, this.ngUnsubscribe, this.systemAdminId, this.networkId, this.networkCountryId, () => {
              console.log("Network map initialised (viewing");
            }, (country) => {
              this.showDialog(country);
            });
          }
          else {
            this.uid = user.uid;
            console.log(this.uid);
            this.networkService.getSelectedIdObj(this.uid)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(selection => {

                this.networkId = selection['id'];
                this.networkCountryId = selection['networkCountryId'];

                // TODO: Delete this method when page control does auth properly

                console.log("Network Country Id: " + this.networkCountryId);

                this.getSystemAdmin(this.uid, (systemAdminId => {

                  this.networkMapService.init('global-map', this.af, this.ngUnsubscribe, systemAdminId, this.networkId, this.networkCountryId,
                    () => {
                      // THIS METHOD CALLED WHEN EVERYTHING IS DONE!!
                      console.log("Network map initialised");
                    },
                    (country) => {
                      this.showDialog(country);
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

  gotoMapList(): void {
    if (this.isLocalNetworkAdmin) {
      this.router.navigateByUrl('/network/local-network-global-maps-list' + this.paramString)
    } else {
      if (this.paramString == null) {
        this.router.navigateByUrl('/network-country/network-global-map-list');
      }
      else {
        this.router.navigateByUrl('/network-country/network-global-map-list' + this.paramString);
      }
    }
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

  /**
   * Method to pull the system admin ID
   * TODO: Remove this when pagecontrol does the user permissions and returns this value
   */
  private getSystemAdmin(uid: string, done: (systemAdminId: string) => void) {
    this.af.database.object(Constants.APP_STATUS + "/administratorNetwork/" + uid, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if (snap.val() != null) {
          // We're a Network Admin
          for (const key in snap.val().systemAdmin) {
            done(key);
          }
        }
        else {
          this.af.database.object(Constants.APP_STATUS + "/administratorNetworkCountry/" + uid, {preserveSnapshot: true})
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



  /**
   * Show the popup dialog
   */
  public showDialog(countryCode: string) {
    jQuery('#minimum-prep-modal-' + countryCode).modal('show');
  }
}
