import {Component, OnDestroy, OnInit} from '@angular/core';
import {NetworkService} from "../../services/network.service";

@Component({
  selector: 'app-network-offices',
  templateUrl: './network-offices.component.html',
  styleUrls: ['./network-offices.component.css'],
  providers: [NetworkService]
})
export class NetworkOfficesComponent implements OnInit, OnDestroy {

  constructor(private networkService:NetworkService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

}
