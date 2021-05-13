// Angular imports
import { Component, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

// Service imports
import { AgencyService } from "../../../services/agency-service.service";
import { FieldOfficeService } from "../../../services/field-office.service";
import { CommonService } from "../../../services/common.service";
import { PageControlService } from "../../../services/pagecontrol.service";

// Models, enums, constants
import { AlertMessageModel } from "../../../model/alert-message.model";
import { fieldOffice } from "../../../model/fieldOffice.model";
import { AlertMessageType, UserType } from "../../../utils/Enums";
import { Constants } from "../../../utils/Constants";

declare const jQuery: any;

@Component({
  selector: 'app-country-field-office-settings',
  templateUrl: './country-field-office-settings.component.html',
  styleUrls: ['./country-field-office-settings.component.scss']
})
export class CountryFieldOfficeSettingsComponent implements OnInit {

  constructor(private commonService: CommonService,
              private pageControl: PageControlService,
              private route: ActivatedRoute,
              private router: Router,
              private agencyService: AgencyService,
              private fieldOfficeService: FieldOfficeService) { }


  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private userType: UserType;
  private countryId: string;
  private agencyId: string;
  private officeToDelete: string;

  public alertMessage: AlertMessageModel = null;
  public countryLevelsValues;
  public country: number;
  public fieldOffice = new fieldOffice();
  public fieldOffices: Array<fieldOffice>
  public alertMessageType = AlertMessageType;
  public showDelete = false;

  ngOnInit() {

    this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

      this.uid = user.uid;
      this.userType = userType;
      this.countryId = countryId;
      this.agencyId = agencyId;

      this.fieldOfficeService.getFieldOffices(countryId)
        .takeUntil(this.ngUnsubscribe)
        .subscribe( fieldOffices => {
          this.fieldOffices = fieldOffices
        })

      this.agencyService.getCountryOffice(countryId, agencyId)
        .subscribe(countryOffice => {

          this.country = countryOffice.location

          this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
            .subscribe(content => {
              this.fieldOffice.locationLevel1 = null;
              this.fieldOffice.locationLevel2 = null;
              this.countryLevelsValues = content;

            });

        })
    })
  }

  public openDeleteModal(fieldOfficeId){
    this.officeToDelete = fieldOfficeId;
    jQuery('#delete-action').modal('show');
  }

  public closeDeleteModal(){
    jQuery('#delete-action').modal('hide');
  }

  private deleteFieldOffice(){
    this.fieldOfficeService.removeFieldOffice(this.countryId, this.officeToDelete)
      .then(_ => {
        jQuery('#delete-action').modal('hide');
        this.alertMessage = new AlertMessageModel('Field office deleted.', AlertMessageType.Success);
      })
  }
}
