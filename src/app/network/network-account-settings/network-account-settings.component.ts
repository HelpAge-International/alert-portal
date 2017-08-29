import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageControlService} from "../../services/pagecontrol.service";
import {NetworkService} from "../../services/network.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ModelUserPublic} from "../../model/user-public.model";
import {Constants} from "../../utils/Constants";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {FirebaseAuthState} from "angularfire2";
import {DisplayError} from "../../errors/display.error";
import {Location} from "@angular/common";

@Component({
  selector: 'app-network-account-settings',
  templateUrl: './network-account-settings.component.html',
  styleUrls: ['./network-account-settings.component.css']
})
export class NetworkAccountSettingsComponent implements OnInit, OnDestroy {

  //subject
  private ngUnsubscribe: Subject<any> = new Subject();

  // Constants and enums
  PERSON_TITLE = Constants.PERSON_TITLE;
  PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;
  COUNTRY = Constants.COUNTRIES;
  COUNTRY_SELECTION = Constants.COUNTRY_SELECTION;

  // Models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  authState: FirebaseAuthState;

  //user info
  private uid: string;
  private userPublic: ModelUserPublic = new ModelUserPublic("", "", -1, "");

  constructor(private pageControl: PageControlService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.networkAuthState(this.ngUnsubscribe, this.route, this.router, (authState,) => {
      this.authState = authState;
      this.uid = authState.auth.uid;

      //get user detail
      this.userService.getUser(this.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: ModelUserPublic) => {
          console.log(user);
          this.userPublic = user;
        });

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  validateForm(): boolean {
    console.log("validateForm");
    const excludedFields = ["phone", "city", "title"];
    this.alertMessage = this.userPublic.validate(excludedFields);

    return !this.alertMessage;
  }

  submit() {
    if (this.validateForm()) {
      console.log("submit");
      this.userService.saveUserPublic(this.userPublic, this.authState)
        .then(() => {
          this.alertMessage = new AlertMessageModel('GLOBAL.ACCOUNT_SETTINGS.SUCCESS_PROFILE', AlertMessageType.Success);
        })
        .catch(err => {
          if (err instanceof DisplayError) {
            this.alertMessage = new AlertMessageModel(err.message);
          } else {
            this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
          }
        });
    }
  }
}
