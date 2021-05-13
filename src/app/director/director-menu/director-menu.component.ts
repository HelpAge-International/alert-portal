import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT} from "@angular/platform-browser";
import {PageControlService} from "../../services/pagecontrol.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-director-menu',
  templateUrl: './director-menu.component.html',
  styleUrls: ['./director-menu.component.css']
})
export class DirectorMenuComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private router: Router, @Inject(DOCUMENT) private document: any) {
    console.log(this.document.location.href);
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toMap() {
    this.router.navigate(["/map", {"isDirector": true}]);
  }
}
