import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-after-validation',
  templateUrl: './after-validation.component.html',
  styleUrls: ['./after-validation.component.css']
})
export class AfterValidationComponent implements OnInit, OnDestroy {

  private msg = "";

  constructor(private route: ActivatedRoute, private _translate: TranslateService) {
  }

  ngOnInit() {
    this.route.params
      .first()
      .subscribe((params: Params) => {
        if (params["partner"]) {
          this.msg = this._translate.instant("AFTER_ACCEPT_PARTNER_VALIDATION");
        }
        if (params["plan"]) {
          this.msg = this._translate.instant("AFTER_ACCEPT_RES_PLAN_VALIDATION");
        }
        if (params["invite-network-agency"] || params["invite-network-country"]) {
          this.msg = this._translate.instant("AFTER_ACCEPT_NETWORK_INVITATION");
        }
      })
  }

  ngOnDestroy() {

  }

}
