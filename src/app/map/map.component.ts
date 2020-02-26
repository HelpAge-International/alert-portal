import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Countries, CountriesMapsSearchInterface} from "../utils/Enums";
import {DepHolder, SDepHolder, SuperMapComponents} from "../utils/MapHelper";
import {Subject} from "rxjs/Subject";
import {UserService} from "../services/user.service";
import {AgencyModulesEnabled, PageControlService} from "../services/pagecontrol.service";
import {MapCountry, OlMapService} from "../services/ol.map.service";
import {TranslateService} from "@ngx-translate/core";
import {SettingsService} from "../services/settings.service";
import {AgencyService} from "../services/agency-service.service";
import {Observable} from "rxjs/Observable";

import 'ol/ol.css';
import Map from "ol/Map";
import Tile from "ol/layer/Tile";
import VectorLayer from 'ol/layer/Vector';
import View from "ol/View";

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

  public mapService: OlMapService;

  public department: SDepHolder;
  private countries: MapCountry[] = [];
  // private agencyMap: Map<string, string> = new Map<string, string>();

  public agencyLogo: string;

  public minThreshYellow: number;
  public minThreshGreen: number;

  private isDirector: boolean;
  private userTypePath: string;

  private raster: Tile;
  private vector: VectorLayer;

  // public DEPARTMENT_MAP: Map<string, string> = new Map<string, string>();

  public moduleAccess: AgencyModulesEnabled = new AgencyModulesEnabled();
  private map;

  constructor(private pageControl: PageControlService,
              private af: AngularFire,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private settingService: SettingsService,
              private agencyService:AgencyService,
              private translate: TranslateService) {
    this.mapHelper = SuperMapComponents.init(af, this.ngUnsubscribe);
  }

  goToListView() {
    this.isDirector ? this.router.navigate(['map/map-countries-list', {'isDirector': true}]) : this.router.navigateByUrl('map/map-countries-list');
  }

  ngOnInit() {
    this.loadMapData()
    // this.initialiseMap()
  }

  loadMapData() {
    this.department = new SDepHolder("Something");
    this.department.location = -1;
    this.department.departments.push(new DepHolder("Loading", 100, 1));

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["isDirector"]) {
          this.isDirector = params["isDirector"];
        }

        this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.userTypePath = Constants.USER_PATHS[userType];

          this.mapService = OlMapService.init(this.af, this.ngUnsubscribe);
          this.mapService.initialiseMap(this.uid, userType, countryId, agencyId, systemId,
            ((countries, green, yellow, vector, rastor) => {
              this.countries = countries;
              this.minThreshGreen = green;
              this.minThreshYellow = yellow;
              this.vector = vector;
              this.raster = rastor
            }));
            
            
          // this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/departments", {preserveSnapshot: true})
          //   .takeUntil(this.ngUnsubscribe)
          //   .subscribe((snap) => {
          //     this.DEPARTMENT_MAP.clear();
          //     this.DEPARTMENT_MAP.set("unassigned", this.translate.instant("UNASSIGNED"));
          //     for (let x of snap) {
          //       this.DEPARTMENT_MAP.set(x.key, x.val().name);
          //     }

          //     //try to add country local departments here
          //     if (this.isDirector) {
          //       this.agencyService.getAllCountryIdsForAgency(agencyId)
          //         .mergeMap(ids => Observable.from(ids))
          //         .mergeMap(id => this.settingService.getCountryLocalDepartments(agencyId, id))
          //         .takeUntil(this.ngUnsubscribe)
          //         .subscribe(depts => depts.forEach(dep => this.DEPARTMENT_MAP.set(dep.id, dep.name)))
          //     } else {
          //       this.settingService.getCountryLocalDepartments(agencyId, countryId)
          //         .takeUntil(this.ngUnsubscribe)
          //         .subscribe(localDepts => {
          //           localDepts.forEach(dep => this.DEPARTMENT_MAP.set(dep.id, dep.name))
          //         })
          //     }
          //   });

          // /** Load in the markers on the map! */
          // PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[userType], isEnabled => {
          //   this.moduleAccess = isEnabled;
          //   if (isEnabled.riskMonitoring) {
          //     this.mapHelper.markersForAgencyAdmin(this.uid, Constants.USER_PATHS[userType], (marker) => {
          //       marker.setMap(this.mapHelper.map);
          //     });
          //   }
          // });

          // /** Get the Agency logo */
          // this.mapHelper.logoForAgencyAdmin(this.uid, Constants.USER_PATHS[userType], (logo) => {
          //   this.agencyLogo = logo;
          // });
        });
      });

      var map = new Map({
        target: 'map',
        layers: [this.raster, this.vector],
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      });
  }



























  // ngOnInit() {
  //   this.department = new SDepHolder("Something");
  //   this.department.location = -1;
  //   this.department.departments.push(new DepHolder("Loading", 100, 1));

  //   this.route.params
  //     .takeUntil(this.ngUnsubscribe)
  //     .subscribe((params: Params) => {
  //       if (params["isDirector"]) {
  //         this.isDirector = params["isDirector"];
  //       }

  //       this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
  //         this.uid = user.uid;
  //         this.userTypePath = Constants.USER_PATHS[userType];

  //         this.mapService = MapService.init(this.af, this.ngUnsubscribe);
  //         this.mapService.initMap("global-map", this.uid, userType, countryId, agencyId, systemId,
  //           ((countries, green, yellow) => {
  //             console.log(countries);
  //             console.log("BOOM!");
  //             console.log(green);
  //             console.log(yellow);
  //             this.minThreshGreen = green;
  //             this.minThreshYellow = yellow;
  //             this.countries = countries;
  //           }),
  //           (countryClicked) => {
  //             if (this.countries != null) {
  //               this.openMinimumPreparednessModal(countryClicked);
  //             }
  //             else {
  //               console.log("TODO: Map is yet to initialise properly / it failed to do so");
  //             }
  //           });

  //         /** Initialise map and colour the relevant countries */
  //         // this.mapHelper.initMapFrom("global-map", this.uid, Constants.USER_PATHS[userType],
  //         //   (departments) => {
  //         //     this.mDepartmentMap = departments;
  //         //     this.departments = [];
  //         //     this.minThreshYellow = this.mapHelper.minThreshYellow;
  //         //     this.minThreshGreen = this.mapHelper.minThreshGreen;
  //         //     this.mDepartmentMap.forEach((value, key) => {
  //         //       this.departments.push(value);
  //         //     });
  //         //   },
  //         //   (mapCountryClicked) => {
  //         //     if (this.mDepartmentMap != null) {
  //         //       this.openMinimumPreparednessModal(mapCountryClicked);
  //         //       console.log(this.mDepartmentMap.get(mapCountryClicked).countryId);
  //         //     }
  //         //     else {
  //         //       console.log("TODO: Map is yet to initialise properly / it failed to do so");
  //         //     }
  //         //   }
  //         // );

  //         this.af.database.list(Constants.APP_STATUS + "/agency/" + agencyId + "/departments", {preserveSnapshot: true})
  //           .takeUntil(this.ngUnsubscribe)
  //           .subscribe((snap) => {
  //             this.DEPARTMENT_MAP.clear();
  //             this.DEPARTMENT_MAP.set("unassigned", this.translate.instant("UNASSIGNED"));
  //             for (let x of snap) {
  //               this.DEPARTMENT_MAP.set(x.key, x.val().name);
  //             }

  //             //try to add country local departments here
  //             if (this.isDirector) {
  //               this.agencyService.getAllCountryIdsForAgency(agencyId)
  //                 .mergeMap(ids => Observable.from(ids))
  //                 .mergeMap(id => this.settingService.getCountryLocalDepartments(agencyId, id))
  //                 .takeUntil(this.ngUnsubscribe)
  //                 .subscribe(depts => depts.forEach(dep => this.DEPARTMENT_MAP.set(dep.id, dep.name)))
  //             } else {
  //               this.settingService.getCountryLocalDepartments(agencyId, countryId)
  //                 .takeUntil(this.ngUnsubscribe)
  //                 .subscribe(localDepts => {
  //                   localDepts.forEach(dep => this.DEPARTMENT_MAP.set(dep.id, dep.name))
  //                 })
  //             }
  //           });

  //         /** Load in the markers on the map! */
  //         PageControlService.agencyQuickEnabledMatrix(this.af, this.ngUnsubscribe, this.uid, Constants.USER_PATHS[userType], isEnabled => {
  //           this.moduleAccess = isEnabled;
  //           if (isEnabled.riskMonitoring) {
  //             this.mapHelper.markersForAgencyAdmin(this.uid, Constants.USER_PATHS[userType], (marker) => {
  //               marker.setMap(this.mapHelper.map);
  //             });
  //           }
  //         });

  //         /** Get the Agency logo */
  //         this.mapHelper.logoForAgencyAdmin(this.uid, Constants.USER_PATHS[userType], (logo) => {
  //           this.agencyLogo = logo;
  //         });
  //       });
  //     });
  // }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

  public openMinimumPreparednessModal(countryCode: string) {
    if (this.moduleAccess.minimumPreparedness) {
      jQuery("#minimum-prep-modal-" + countryCode).modal("show");
    }
  }
}
