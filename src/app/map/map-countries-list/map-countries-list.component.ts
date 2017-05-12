import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-map-countries-list',
  templateUrl: './map-countries-list.component.html',
  styleUrls: ['./map-countries-list.component.css']
})
export class MapCountriesListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToMapView() {
    this.router.navigateByUrl('map');
  }

}
