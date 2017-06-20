import {Component, OnInit} from "@angular/core";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-create-edit-network',
  templateUrl: './create-edit-network.component.html',
  styleUrls: ['./create-edit-network.component.css']
})
export class CreateEditNetworkComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
