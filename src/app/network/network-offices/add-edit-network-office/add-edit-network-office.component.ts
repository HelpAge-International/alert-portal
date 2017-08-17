import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {NetworkOfficeModel} from "./network-office.model";
import {ModelUserPublic} from "../../../model/user-public.model";

@Component({
  selector: 'app-add-edit-network-office',
  templateUrl: './add-edit-network-office.component.html',
  styleUrls: ['./add-edit-network-office.component.css']
})
export class AddEditNetworkOfficeComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //constants and enums
  private COUNTRIES = Constants.COUNTRIES;
  private COUNTRY_SELECTION = Constants.COUNTRY_SELECTION;
  private PERSON_TITLE = Constants.PERSON_TITLE;
  private PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;

  //models
  private networkOffice = new NetworkOfficeModel();
  private networkAdmin = new ModelUserPublic("", "", undefined, "");

  //user && office info
  private uid: string;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user,) => {
      this.uid = user.uid;
    })
  }

  ngOnDestroy() {
  }

  submit() {
    console.log("submit");
  }

}
