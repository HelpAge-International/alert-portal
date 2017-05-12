import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToListView() {
    this.router.navigateByUrl('map/map-countries-list');
  }

}
