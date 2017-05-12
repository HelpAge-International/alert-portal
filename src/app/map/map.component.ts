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
import {DepHolder, SDepHolder, SuperMapComponents} from "../utils/MapSuper";
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

  public minThreshRed: number;
  public minThreshYellow: number;
  public minThreshGreen: number;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
    this.mapHelper = SuperMapComponents.init(af, subscriptions);
  }

  ngOnInit() {
    this.department = new SDepHolder();
    this.department.location = -1;
    this.department.departments.push(new DepHolder("Loading", 100, 1));
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;

        // Query firebase for country information
        this.mapHelper.initMapFrom("global-map", this.uid, "administratorCountry",
          (departments) => {
            this.mDepartmentMap = departments;
          },
          (mapCountryClicked) => {
            if (this.mDepartmentMap != null) {
              this.department = this.mDepartmentMap.get(mapCountryClicked);
              // Need to be put here for inheritance / visibility issues in angular
              this.minThreshRed = this.mapHelper.minThreshRed;
              this.minThreshYellow = this.mapHelper.minThreshYellow;
              this.minThreshGreen = this.mapHelper.minThreshGreen;
              this.openMinimumPreparednessModal();
            }
            else {
              console.log("TODO: Map is yet to initialise properly / failed properly. ");
            }
          }
        );
        this.mapHelper.markersForAgencyAdmin(this.uid, "administratorCountry", (marker) => {
          marker.setMap(this.mapHelper.map);
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

  public openMinimumPreparednessModal() {
    jQuery("#minimum-prep-modal").modal("show");
  }
}
