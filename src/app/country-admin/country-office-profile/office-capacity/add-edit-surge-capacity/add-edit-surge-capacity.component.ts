import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Router} from "@angular/router";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {UserService} from "../../../../services/user.service";
import {Constants} from "../../../../utils/Constants";
import {ModelSurgeCapacity} from "./surge-capacity.model";
import {AlertMessageType, ResponsePlanSectors} from "../../../../utils/Enums";
import {SurgeCapacityService} from "../../../../services/surge-capacity.service";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import * as moment from "moment";

@Component({
  selector: 'app-add-edit-surge-capacity',
  templateUrl: './add-edit-surge-capacity.component.html',
  styleUrls: ['./add-edit-surge-capacity.component.css'],
  providers: [SurgeCapacityService]
})
export class AddEditSurgeCapacityComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //contants && enum
  private ResponseSectors = ResponsePlanSectors;
  private alertMessageType = AlertMessageType;

  //models
  private modelSurgeCapacity: ModelSurgeCapacity;
  private alertMessage: AlertMessageModel = null;

  //member variables
  private countryId: string;
  private sectorsMap = new Map<ResponsePlanSectors, boolean>();
  private isEditing: boolean;


  constructor(private surgeService: SurgeCapacityService, private router: Router, private route: ActivatedRoute,
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
    this.getSectors();
    console.log(this.modelSurgeCapacity);
    this.validateForm();
    if (this.alertMessage == null || this.alertMessage.type == AlertMessageType.Success) {
      this.modelSurgeCapacity.updatedAt = moment.utc().valueOf();
      this.surgeService.saveSurgeCapacity(this.modelSurgeCapacity, this.countryId).then(() => {
        this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.SUCCESS_SAVED', AlertMessageType.Success);
        setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
      }, error => {
        if (error instanceof DisplayError) {
          this.alertMessage = new AlertMessageModel(error.message);
        } else {
          this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
        }
      });
    }
  }

  private validateForm() {
    this.alertMessage = this.modelSurgeCapacity.validate([]);
  }

  private getSectors() {
    this.modelSurgeCapacity.sectors = [];
    this.sectorsMap.forEach((v, k) => {
      if (v) {
        this.modelSurgeCapacity.sectors.push(k);
      }
    })
  }

  sectorClicked(sector) {
    this.sectorsMap = new Map();
    this.sectorsMap.set(sector, true);
    // let status = this.sectorsMap.get(sector);
    // this.sectorsMap.set(sector, !status);
    // console.log(this.sectorsMap);
  }

  private goBack() {
    this.router.navigateByUrl("/country-admin/country-office-profile/office-capacity");
  }
}
