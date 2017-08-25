import {Component, OnDestroy, OnInit} from '@angular/core';
import {NetworkService} from "../../services/network.service";
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {NetworkOfficeModel} from "./add-edit-network-office/network-office.model";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-network-offices',
  templateUrl: './network-offices.component.html',
  styleUrls: ['./network-offices.component.css'],
  providers: [NetworkService]
})
export class NetworkOfficesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //constants and enums
  private Countries = Constants.COUNTRIES;

  //models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;

  //logic info
  private uid: string;
  private networkId: string;
  private networkOffices: Observable<NetworkOfficeModel[]>;


  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private networkService: NetworkService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user,) => {
      this.uid = user.uid;

      //get network id
      this.networkOffices = this.networkService.getSelectedIdObj(this.uid)
        .flatMap((idObj: {}) => {
          this.networkId = idObj["id"];
          return this.networkService.getNetworkOffices(idObj["id"]);
        })

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
