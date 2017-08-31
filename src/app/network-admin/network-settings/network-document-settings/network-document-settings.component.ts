import {Component, OnDestroy, OnInit} from '@angular/core';
import {Constants} from "../../../utils/Constants";
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {AlertMessageType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {NetworkService} from "../../../services/network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SettingsService} from "../../../services/settings.service";

@Component({
  selector: 'app-network-document-settings',
  templateUrl: './network-document-settings.component.html',
  styleUrls: ['./network-document-settings.component.css']
})
export class NetworkDocumentSettingsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  //constants and enums

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;


  //logic


  constructor(private pageControl: PageControlService,
              private networkService: NetworkService,
              private route: ActivatedRoute,
              private router: Router,
              private settingService: SettingsService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
