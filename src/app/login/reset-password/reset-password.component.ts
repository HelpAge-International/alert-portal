import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {FirebaseApp} from 'angularfire2';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, Subject} from "rxjs";
import {ErrorCodesService} from "../../services/errorcodes.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit, OnDestroy {
  private auth: any;
  private password: string;
  private failMessage: string;
  private inactiveFail: boolean = true;
  private inactiveSuccess: boolean = true;
  private loaderInactive: boolean = true;
  private alerts = {};

  private oobCode: string;

  private errorCodeService: ErrorCodesService;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(@Inject(FirebaseApp) fa: any, private router: Router, private actRoute: ActivatedRoute) {
    this.auth = fa.auth();
    this.errorCodeService = ErrorCodesService.init();
  }

  ngOnInit() {
    this.actRoute.queryParams.subscribe((params: Params) => {
      let oobCode: string = params['oobCode'];
      this.oobCode = oobCode;
      console.log("Code; " + this.oobCode);
    });
  }

  ngOnDestroy() {
    console.log(this.ngUnsubscribe);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log(this.ngUnsubscribe);
  }

  onSubmit() {
    if (!this.inactiveSuccess) {
      // Go to the login page
    }
    else {
      this.loaderInactive = false;
      this.auth.confirmPasswordReset(this.oobCode, this.password)
        .then(() => {
          this.inactiveSuccess = false;
          this.loaderInactive = true;
        })
        .catch((val) => {
          console.log(val);
          this.inactiveFail = false;
          this.failMessage = this.errorCodeService.getFromFirebaseError(val);
          this.loaderInactive = true;
        });
    }
  }
  backToLogin() {
    this.router.navigateByUrl('/');
  }
  backToReset() {
    this.router.navigateByUrl('/forgot-password');
  }
}
