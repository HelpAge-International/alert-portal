import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RxHelper} from "../utils/RxHelper";
import {Countries} from "../utils/Enums";
import {DepHolder, SDepHolder, SuperMapComponents} from "../utils/MapHelper";
import {Subject} from "rxjs/Subject";
import {UserService} from "../services/user.service";
import {unescapeIdentifier} from "@angular/compiler";
import {Subscription} from "rxjs/Subscription";
import {PageControlService} from "../services/pagecontrol.service";
declare var jQuery: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public uid: string;
  public mapHelper: SuperMapComponents;
  public department: SDepHolder;
  private mDepartmentMap: Map<string, SDepHolder>;
  private agencyMap: Map<string, string> = new Map<string, string>();
  private departments: SDepHolder[];

  public agencyLogo: string;

  public minThreshRed: number;
  public minThreshYellow: number;
  public minThreshGreen: number;

  private isDirector: boolean;
  private userTypePath: string;

  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute, private userService: UserService) {
    this.mapHelper = SuperMapComponents.init(af, this.ngUnsubscribe);
  }

  goToListView() {
    this.isDirector ? this.router.navigate(['map/map-countries-list', {'isDirector': true}]) : this.router.navigateByUrl('map/map-countries-list');
  }


  ngOnInit() {
    this.department = new SDepHolder("Something");
    this.department.location = -1;
    this.department.departments.push(new DepHolder("Loading", 100, 1));
    this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;

        this.route.params
          .takeUntil(this.ngUnsubscribe)
          .subscribe((params: Params) => {
            if (params["isDirector"]) {
              this.isDirector = params["isDirector"];
            }
          });

        this.userService.getUserType(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(usertype => {
            this.userTypePath = Constants.USER_PATHS[usertype];
            /** Initialise map and colour the relevant countries */
            this.mapHelper.initMapFrom("global-map", this.uid, Constants.USER_PATHS[usertype],
              (departments) => {
                this.mDepartmentMap = departments;
                this.departments = [];
                this.minThreshRed = this.mapHelper.minThreshRed;
                this.minThreshYellow = this.mapHelper.minThreshYellow;
                this.minThreshGreen = this.mapHelper.minThreshGreen;
                this.mDepartmentMap.forEach((value, key) => {
                  this.departments.push(value);
                });
              },
              (mapCountryClicked) => {
                if (this.mDepartmentMap != null) {
                  this.openMinimumPreparednessModal(mapCountryClicked);
                }
                else {
                  console.log("TODO: Map is yet to initialise properly / it failed to do so");
                }
              }
            );

            /** Load in the markers on the map! */
            PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[usertype], isEnabled => {
              if (isEnabled.riskMonitoring) {
                this.mapHelper.markersForAgencyAdmin(this.uid, Constants.USER_PATHS[usertype], (marker) => {
                  marker.setMap(this.mapHelper.map);
                });
              }
            });

            /** Get the Agency logo */
            this.mapHelper.logoForAgencyAdmin(this.uid, Constants.USER_PATHS[usertype], (logo) => {
              this.agencyLogo = logo;
            });

          });


      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

  public openMinimumPreparednessModal(countryCode: string) {
    jQuery("#minimum-prep-modal-" + countryCode).modal("show");
  }
}
