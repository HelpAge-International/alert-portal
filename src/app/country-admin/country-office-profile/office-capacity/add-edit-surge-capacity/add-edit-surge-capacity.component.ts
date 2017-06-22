import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {UserService} from "../../../../services/user.service";
import {Constants} from "../../../../utils/Constants";
import {ModelSurgeCapacity} from "./surge-capacity.model";

@Component({
  selector: 'app-add-edit-surge-capacity',
  templateUrl: './add-edit-surge-capacity.component.html',
  styleUrls: ['./add-edit-surge-capacity.component.css']
})
export class AddEditSurgeCapacityComponent implements OnInit, OnDestroy {
  private countryId: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private modelSurgeCapacity: ModelSurgeCapacity;
  private timeValue:number;
  private timeType:number;
  // private orgnization: string;
  // private relationship: string;
  // private name: string;
  // private position: string;
  // private email: string;
  // private location: string;
  // private arrivalTime: number;
  // private durationOfDeployment: string;
  // private sectors: number[];


  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute,
              private pageControl: PageControlService, private userService: UserService) {
    this.modelSurgeCapacity = new ModelSurgeCapacity();
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.userService.getCountryId(Constants.USER_PATHS[userType], user.uid)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(countryId => {
          this.countryId = countryId;
        });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  saveSurgeCapacity() {
    console.log(this.modelSurgeCapacity);
  }

}
