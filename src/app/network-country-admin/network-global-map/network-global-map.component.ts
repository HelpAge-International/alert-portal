import {Component, OnInit, OnDestroy} from '@angular/core';
import {MapService} from "../../services/map.service";
import {PageControlService} from "../../services/pagecontrol.service";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {TranslateService} from "@ngx-translate/core";
import {Constants} from "../../utils/Constants";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-network-global-map',
  templateUrl: './network-global-map.component.html',
  styleUrls: ['./network-global-map.component.css']
})
export class NetworkGlobalMapComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public mapService: MapService;

  public uid: string;

  constructor(private pageControl: PageControlService, private af: AngularFire, private router: Router, private route: ActivatedRoute, private userService: UserService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
      this.uid = user.uid;
      console.log("Authed!");

      this.mapService = MapService.init(this.af, this.ngUnsubscribe);
      this.mapService.initBlankMap("global-map");
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
