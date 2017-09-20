import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {PageControlService} from "../../../../services/pagecontrol.service";
import {UserService} from "../../../../services/user.service";
import {Constants} from "../../../../utils/Constants";
import {ModelSurgeCapacity} from "./surge-capacity.model";
import {AlertMessageType, ResponsePlanSectors} from "../../../../utils/Enums";
import {SurgeCapacityService} from "../../../../services/surge-capacity.service";
import {AlertMessageModel} from "../../../../model/alert-message.model";
import {DisplayError} from "../../../../errors/display.error";
import * as moment from "moment";
declare const jQuery: any;

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
  private surgeId: string;


  constructor(private surgeService: SurgeCapacityService, private router: Router, private route: ActivatedRoute,
              private pageControl: PageControlService, private userService: UserService) {
    this.modelSurgeCapacity = new ModelSurgeCapacity();
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.countryId = countryId;

      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.isEditing = true;
            this.surgeId = params["id"];
            this.loadSurgeInfo(this.surgeId, this.countryId);
          }
        });
    });
  }

  private loadSurgeInfo(surgeId: string, countryId: string) {
    this.surgeService.getSurgeInfo(surgeId, countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(surge => {
        this.modelSurgeCapacity.mapFromObject(surge);
        this.sectorsMap.set(this.modelSurgeCapacity.sectors[0], true);
        console.log(this.modelSurgeCapacity);
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
      if (this.isEditing) {
        this.surgeService.updateSurgeCapacity(this.modelSurgeCapacity, this.countryId, this.surgeId)
          .then(() => {
            this.alertMessage = new AlertMessageModel('COUNTRY_ADMIN.PROFILE.SURGE_CAPACITY.SUCCESS_SAVED', AlertMessageType.Success);
            setTimeout(() => this.goBack(), Constants.ALERT_REDIRECT_DURATION);
          }, error => {
            if (error instanceof DisplayError) {
              this.alertMessage = new AlertMessageModel(error.message);
            } else {
              this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR');
            }
          });
      } else {
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

  closeModal() {
    jQuery('#delete-action').modal('hide');
  }

  deleteSurge() {
    jQuery('#delete-action').modal('show');
  }

  deleteAction() {
    this.closeModal();
    this.surgeService.deleteSurgeCapacity(this.countryId, this.surgeId).then(() => {
      this.goBack();
      this.alertMessage = new AlertMessageModel('Surge capacity deleted successfully.', AlertMessageType.Success);
    })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  private goBack() {
    this.router.navigateByUrl("/country-admin/country-office-profile/office-capacity");
  }
}
