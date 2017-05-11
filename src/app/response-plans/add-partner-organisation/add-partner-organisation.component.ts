import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {RxHelper} from "../../utils/RxHelper";
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'app-add-partner-organisation',
  templateUrl: './add-partner-organisation.component.html',
  styleUrls: ['./add-partner-organisation.component.css']
})

export class AddPartnerOrganisationComponent implements OnInit, OnDestroy {

  private uid: string;

  constructor(private af: AngularFire, private router: Router, private subscriptions: RxHelper) {
  }

  ngOnInit() {
    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        console.log("Admin uid: " + this.uid);
      } else {
        this.navigateToLogin();
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  goBack() {
    this.router.navigateByUrl('response-plans/create-edit-response-plan');
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

}
