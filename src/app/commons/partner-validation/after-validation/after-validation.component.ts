import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-after-validation',
  templateUrl: './after-validation.component.html',
  styleUrls: ['./after-validation.component.css']
})
export class AfterValidationComponent implements OnInit, OnDestroy {

  private msg = "Thanks. You can now exit this page.";

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .first()
      .subscribe((params: Params) => {
        if (params["partner"]) {
          this.msg = "Thank you for validating the partner organisation. You can now exit from this page.";
        }
        if (params["plan"]) {
          this.msg = "Thank you for updating the response plan. You can now exit from this page.";
        }
      })
  }

  ngOnDestroy() {

  }

}
