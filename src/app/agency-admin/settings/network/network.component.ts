import {Component, OnInit} from "@angular/core";
import {PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
