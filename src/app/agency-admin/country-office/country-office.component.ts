import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-country-office',
  templateUrl: './country-office.component.html',
  styleUrls: ['./country-office.component.css']
})
export class CountryOfficeComponent implements OnInit,OnDestroy {

  private subscriptions:RxHelper;

  constructor(private af:AngularFire, private router:Router) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if (user) {

      } else {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
      }
    })
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

}
