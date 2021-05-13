
import {takeUntil} from 'rxjs/operators/takeUntil';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NetworkService} from "../../services/network.service";
import {Constants} from "../../utils/Constants";
import * as moment from "moment";
import * as firebase from "firebase";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'app-network-country-validation',
  templateUrl: './network-country-validation.component.html',
  styleUrls: ['./network-country-validation.component.css']
})
export class NetworkCountryValidationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //constants and enums

  //models

  //logic
  private accessToken: string;
  private networkId: string;
  private agencyId: string;
  private isValidated: boolean;
  private network: any;
  private networkCountryId: string;
  private countryId: string;
  private showLoader: boolean


  constructor(private route: ActivatedRoute,
              private networkService: NetworkService,
              private af: AngularFire,
              private router: Router) {
  }

  ngOnInit() {
    this.showLoader = true
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params["token"] && params["networkId"] && params["networkCountryId"] && params["agencyId"]) {
          this.accessToken = params["token"];
          this.networkId = params["networkId"];
          this.networkCountryId = params["networkCountryId"];
          this.agencyId = params["agencyId"];
          if (params["countryId"]) {
            this.countryId = params["countryId"];
          }

          firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
              firebase.auth().signInAnonymously().catch(error => {
                console.log(error.message);
              });
            })


          firebase.auth().onAuthStateChanged(user => {
            console.log("onAuthStateChanged");
            if (user) {
              this.validateToken();
            }
          });

        } else {
          console.log("not from email click");
          this.navigateToLogin();
        }
      });
  }

  private validateToken() {
    this.networkService.validateNetworkCountryToken((this.countryId ? this.countryId : this.agencyId), this.accessToken)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(validate => {
        this.isValidated = validate;
        if (validate) {
          this.getNetworkInfo(this.networkId);
        }
        this.showLoader = false
      })
  }

  private getNetworkInfo(networkId: string) {
    this.networkService.getNetworkDetail(networkId).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(network => {
        this.network = network;
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  acceptJoin() {
    let update = {};
    update["/networkCountry/" + this.networkId + "/" + this.networkCountryId + "/agencyCountries/" + this.agencyId + "/" + (this.countryId ? this.countryId : this.agencyId) + "/isApproved"] = true;
    if (this.countryId) {
      update["/countryOffice/" + this.agencyId + "/" + this.countryId + "/networks/" + this.networkId + "/networkCountryId/"] = this.networkCountryId;
    } else {
      update["/agency/" + this.agencyId + "/networksCountry/" + this.networkId + "/networkCountryId/"] = this.networkCountryId;
    }
    update["/networkCountryValidation/" + (this.countryId ? this.countryId : this.agencyId) + "/validationToken/expiry"] = moment.utc().valueOf();
    this.networkService.updateNetworkField(update).then(() => {
      this.navigateToThanksPage();
    }).catch(error => {
      console.log(error.message);
    });
  }

  rejectJoin() {
    let update = {};
    update["/networkCountryValidation/" + (this.countryId ? this.countryId : this.agencyId) + "/validationToken/expiry"] = moment.utc().valueOf();
    this.networkService.updateNetworkField(update).then(() => {
      this.navigateToThanksPage();
    }).catch(error => {
      console.log(error.message);
    });
  }

  private navigateToThanksPage() {
    this.router.navigate(["/after-validation", {"invite-network-country": true}], {skipLocationChange: true});
  }

}
