import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {NetworkService} from "../../services/network.service";
import * as firebase from "firebase";
import * as moment from "moment";

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
  private isValidated: boolean;
  private network: any;


  constructor(private route: ActivatedRoute,
              private networkService: NetworkService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["token"] && params["networkId"] && params["agencyId"]) {
          this.accessToken = params["token"];
          this.networkId = params["networkId"];
          this.agencyId = params["agencyId"];

          firebase.auth().signInAnonymously().catch(error => {
            console.log(error.message);
          });

          firebase.auth().onAuthStateChanged(user => {
            console.log("onAuthStateChanged");
            if (user) {
              if (user.isAnonymous) {
                //Page accessed by the user who doesn't have firebase account. Check the access token and grant the access
                this.networkService.validateNetworkAgencyToken(this.agencyId, this.accessToken)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(validate => {
                    console.log(validate);
                    this.isValidated = validate;
                    if (validate) {
                      this.getNetworkInfo(this.networkId);
                    }
                  })
              } else {
                console.log("user not logged in");
                this.navigateToLogin();
              }
            }
          });

        } else {
          console.log("not from email click");
          this.navigateToLogin();
        }
      });
  }

  private getNetworkInfo(networkId: string) {
    this.networkService.getNetworkDetail(networkId)
      .takeUntil(this.ngUnsubscribe)
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
    update["/network/" + this.networkId + "/agencies/" + this.agencyId + "/isApproved"] = true;
    update["/agency/" + this.agencyId + "/networks/" + this.networkId] = true;
    update["/networkAgencyValidation/" + this.agencyId + "/validationToken/expiry"] = moment.utc().valueOf();
    if(!this.network.isGlobal){
      let countryCode = this.network.agencies[this.agencyId].countryCode;
      update["/countryOffice/" + this.agencyId + "/" + countryCode + "/localNetworks/" + this.networkId] = true;

    }
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
    this.router.navigate(["/after-validation", {"invite-network-agency":true}], {skipLocationChange:true});
  }

}
