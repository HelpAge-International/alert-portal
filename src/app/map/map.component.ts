import { Component, OnInit, OnDestroy } from '@angular/core';
import {Constants} from "../utils/Constants";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {RxHelper} from "../utils/RxHelper";
import {} from '@types/googlemaps';
import {ModelAdministratorCountry} from "../model/administrator.country.model";
import {ModelCountryOffice} from "../model/countryoffice.model";
import {ModelHazard} from "../model/hazard.model";
import {Countries, HazardScenario} from "../utils/Enums";
import {HazardImages} from "../utils/HazardImages";
import {DepHolder, SDepHolder, SuperMapComponents} from "../utils/MapHelper";
import {unescapeIdentifier} from "@angular/compiler";
import {Subscription} from "rxjs/Subscription";
declare var jQuery: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {
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

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
    this.mapHelper = SuperMapComponents.init(af, subscriptions);
  }

  goToListView() {
    this.router.navigateByUrl('map/map-countries-list');
  }


  ngOnInit() {
    this.department = new SDepHolder("Something");
    this.department.location = -1;
    this.department.departments.push(new DepHolder("Loading", 100, 1));
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;

        /** Initialise map and colour the relevant countries */
        this.mapHelper.initMapFrom("global-map", this.uid, "administratorCountry",
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
        this.mapHelper.markersForAgencyAdmin(this.uid, "administratorCountry", (marker) => {
          marker.setMap(this.mapHelper.map);
        });

        /** Get the Agency logo */
        this.mapHelper.logoForAgencyAdmin(this.uid, "administratorCountry", (logo) => {
          this.agencyLogo = logo;
        });

      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  public getCountryCode(location: number) {
    return Countries[location];
  }

  public openMinimumPreparednessModal(countryCode: string) {
    jQuery("#minimum-prep-modal-" + countryCode).modal("show");
  }
}
