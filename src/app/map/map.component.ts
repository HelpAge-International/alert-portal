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
import {SuperMapComponents} from "../utils/MapSuper";
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

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
    this.mapHelper = SuperMapComponents.init(af, subscriptions);
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(user => {
      if (user) {
        this.uid = user.auth.uid;

        // Query firebase for country information
        this.mapHelper.initMapFrom("global-map", this.uid, "administratorCountry", (departments) => {

        });
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
}
