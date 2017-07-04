import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {Constants} from "../../utils/Constants";
import {ModelSystem} from "../../model/system.model";
import {PageControlService} from "../../services/pagecontrol.service";

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})

export class SystemSettingsComponent implements OnInit, OnDestroy {

  private uid: string;

  private alertMessage: string = "";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private minGreen: number;
  private minAmber: number;
  private advGreen: number;
  private advAmber: number;

  private thresholdValue: number[] = Constants.THRESHOLD_VALUE;
  private modelSystem: ModelSystem;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.initData(this.uid);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  saveSetting() {

    if (this.uid) {
      this.writeToFirebase();
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

  private initData(uid) {

    this.af.database.object(Constants.APP_STATUS + "/system/" + uid)
      .takeUntil(this.ngUnsubscribe).subscribe(x => {
      this.modelSystem = new ModelSystem();
      this.modelSystem.advThreshold = x.advThreshold;
      this.modelSystem.minThreshold = x.minThreshold;
      //load minimum threshold from database
      this.minGreen = x.minThreshold[0];
      this.minAmber = x.minThreshold[1];
      //load advanced threshold from database
      this.advGreen = x.advThreshold[0];
      this.advAmber = x.advThreshold[1];
    });
  }

  private writeToFirebase() {

    if (this.validate()) {
      this.modelSystem.minThreshold[0] = this.minGreen;
      this.modelSystem.minThreshold[1] = this.minAmber;
      this.modelSystem.advThreshold[0] = this.advGreen;
      this.modelSystem.advThreshold[1] = this.advAmber;

      this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid).update(this.modelSystem).then(_ => {
        this.alertShow = true;
        this.alertSuccess = true;
        this.alertMessage = "SYSTEM_ADMIN.SETTING.SETTING_SAVED";
      }, error => {
        console.log(error.message);
      });
    } else {
      this.alertShow = true;
      this.alertSuccess = false;
    }
  }

  /**
   * Returns false on fail and specific error messages-
   * @returns {boolean}
   */
  private validate() {

    if (
      (this.modelSystem.minThreshold[0] == this.minGreen) &&
      (this.modelSystem.minThreshold[1] == this.minAmber) &&
      (this.modelSystem.advThreshold[0] == this.advGreen) &&
      (this.modelSystem.advThreshold[1] == this.advAmber)) {
      this.alertMessage = "GLOBAL.NO_CHANGES_MADE";
      return false;
    } else if (this.minGreen <= this.minAmber) {
      this.alertMessage = "SYSTEM_ADMIN.SETTING.ERROR_MIN_THRESHOLD";
      return false;
    } else if (this.advGreen <= this.advAmber) {
      this.alertMessage = "SYSTEM_ADMIN.SETTING.ERROR_ADV_THRESHOLD";
      return false;
    }
    return true;
  }
}
