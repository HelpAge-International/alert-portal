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

  private successMessage: string = "SYSTEM_ADMIN.SETTING.SETTING_SAVED";
  private isSaved: boolean = false;

  private minGreen: number;
  private minAmber: number;
  private minRed: number;
  private advGreen: number;
  private advAmber: number;
  private advRed: number;

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

  private initData(uid) {

    this.af.database.object(Constants.APP_STATUS+"/system/" + uid)
      .takeUntil(this.ngUnsubscribe).subscribe(x => {
      this.modelSystem = new ModelSystem();
      this.modelSystem.advThreshold = x.advThreshold;
      this.modelSystem.minThreshold = x.minThreshold;
      //load minimum threshold from database
      this.minGreen = x.minThreshold[0];
      this.minAmber = x.minThreshold[1];
      this.minRed = x.minThreshold[2];
      //load advanced threshold from database
      this.advGreen = x.advThreshold[0];
      this.advAmber = x.advThreshold[1];
      this.advRed = x.advThreshold[2];
    });
  }

  private writeToFirebase() {

    this.modelSystem.minThreshold[0] = this.minGreen;
    this.modelSystem.minThreshold[1] = this.minAmber;
    this.modelSystem.minThreshold[2] = this.minRed;
    this.modelSystem.advThreshold[0] = this.advGreen;
    this.modelSystem.advThreshold[1] = this.advAmber;
    this.modelSystem.advThreshold[2] = this.advRed;

    this.af.database.object(Constants.APP_STATUS+"/system/" + this.uid).update(this.modelSystem).then(_ => {
      this.showAlert();
    }, error => {
      console.log(error.message);
    });
  }

  private showAlert() {

    this.isSaved = true;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.isSaved = false;
    });
  }
}
