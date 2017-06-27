import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {PageControlService} from "../services/pagecontrol.service";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-export-proposal',
  templateUrl: './export-proposal.component.html',
  styleUrls: ['./export-proposal.component.css']
})

export class ExportProposalComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private USER_TYPE: string = 'administratorCountry';
  private uid: string;

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private userService: UserService, private route: ActivatedRoute) {
  }

  /**
   * Lifecycle Functions
   */

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      //this.downloadData();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
