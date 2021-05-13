
import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {NetworkService} from "../../services/network.service";
import * as firebase from "firebase";
import * as moment from "moment";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'app-network-agency-validation',
  templateUrl: './network-agency-validation.component.html',
  styleUrls: ['./network-agency-validation.component.css']
})
export class NetworkAgencyValidationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //constants and enums

  //models

  //logic
  private accessToken: string;
  private networkId: string;
  private agencyId: string;
  private countryId: string;
  private isValidated: boolean;
  private network: any;
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
        if (params["token"] && params["networkId"] && params["agencyId"]) {
          this.accessToken = params["token"];
          this.networkId = params["networkId"];
          this.agencyId = params["agencyId"];
          this.countryId = params["countryId"];

          firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
              this.anonymousLogin();
            })

          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              //Page accessed by the user who doesn't have firebase account. Check the access token and grant the access
              let validationId = this.countryId && this.countryId != 'undefined' ? this.countryId : this.agencyId
              this.networkService.validateNetworkAgencyToken(validationId, this.accessToken)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(validate => {
                  this.isValidated = validate;
                  if (validate) {
                    this.getNetworkInfo(this.networkId);
                  }
                  this.showLoader = false
                })
            }
          });

        } else {
          console.log("not from email click");
          this.navigateToLogin();
        }
      });
  }

  private anonymousLogin() {
    firebase.auth().signInAnonymously().catch(error => {
      console.log(error.message);
    });
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
    console.log(this.network)
    console.log(this.agencyId)
    update["/network/" + this.networkId + "/agencies/" + this.agencyId + "/isApproved"] = true;
    if (this.network.isGlobal) {
      update["/agency/" + this.agencyId + "/networks/" + this.networkId] = true;
    } else {
      let countryCode = this.network.agencies[this.agencyId].countryCode;
      if (countryCode && countryCode !== this.agencyId) {
        update["/countryOffice/" + this.agencyId + "/" + countryCode + "/localNetworks/" + this.networkId] = true;
        update["/countryOffice/" + this.agencyId + "/" + countryCode + "/localNetworks/" + this.networkId] = true;
      } else {
        update["/agency/" + this.agencyId + "/localNetworks/" + this.networkId] = true;
      }
    }
    update["/networkAgencyValidation/" + this.agencyId + "/validationToken/expiry"] = moment.utc().valueOf();
    this.networkService.updateNetworkField(update).then(() => {
      this.navigateToThanksPage();
    }).catch(error => {
      console.log(error.message);
    });


  }

  rejectJoin() {
    let update = {};
    update["/networkAgencyValidation/" + this.agencyId + "/validationToken/expiry"] = moment.utc().valueOf();
    this.networkService.updateNetworkField(update).then(() => {
      this.navigateToThanksPage();
    }).catch(error => {
      console.log(error.message);
    });
  }

  private navigateToThanksPage() {
    this.router.navigate(["/after-validation", {"invite-network-agency": true}], {skipLocationChange: true});
  }

}
