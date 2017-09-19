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
          this.msg = this._translate.instant("Thank you for validating the partner organisation. You can now exit from this page.");
        }
        if (params["plan"]) {
          this.msg = this._translate.instant("Thank you for updating the response plan. You can now exit from this page.");
        }
      })
  }

  ngOnDestroy() {

  }

}
