import {Component, OnDestroy, OnInit} from "@angular/core";
import {RegionHolder} from "../../map/map-countries-list/map-countries-list.component";
/**
 * Created by jordan on 08/10/2017.
 */



@Component({
  selector: 'app-network-global-map-list',
  templateUrl: './network-global-map-list.component.html',
  styleUrls: ['./network-global-map-list.component.css']
})
export class NetworkGlobalMapListComponent implements OnInit, OnDestroy {

  public otherRegion: RegionHolder = RegionHolder.create("Other", "unassigned");
  public regions: RegionHolder[] = [];

  ngOnInit() {
  }

  ngOnDestroy() {

  }
}
