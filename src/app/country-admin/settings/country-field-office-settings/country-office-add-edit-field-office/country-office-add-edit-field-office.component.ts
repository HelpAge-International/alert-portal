import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageControlService} from "../../../../services/pagecontrol.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageType, UserType} from "../../../../utils/Enums";
import {fieldOffice} from "../../../../model/fieldOffice.model";
import { Constants } from "../../../../utils/Constants";
import {AgencyService} from "../../../../services/agency-service.service";
import {CommonService} from "../../../../services/common.service";
import {Subject} from "rxjs/Subject";
import {FieldOfficeService} from "../../../../services/field-office.service";
import {AlertMessageModel} from "../../../../model/alert-message.model";

@Component({
  selector: 'app-country-office-add-edit-field-office',
  templateUrl: './country-office-add-edit-field-office.component.html',
  styleUrls: ['./country-office-add-edit-field-office.component.scss']
})
export class CountryOfficeAddEditFieldOfficeComponent implements OnInit, OnDestroy {

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private router: Router,
              private agencyService: AgencyService,
              private commonService: CommonService,
              private fieldOfficeService: FieldOfficeService) { }

  private uid: string;
  private userType: UserType;
  private countryId: string;
  private agencyId: string;
  public country: number;
  public countryLevelsValues;
  public alertMessage: AlertMessageModel = null;
  public fieldOffice = new fieldOffice();
  public alertMessageType = AlertMessageType;
  public fieldOfficeId: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  ngOnInit() {

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if(params['id']){
          this.fieldOfficeId = params['id']
        }

        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {

          this.uid = user.uid;
          this.userType = userType;
          this.countryId = countryId;
          this.agencyId = agencyId;

          this.agencyService.getCountryOffice(countryId, agencyId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(countryOffice => {

              this.country = countryOffice.location;

              if(this.fieldOfficeId){
                this.fieldOfficeService.getFieldOffice(countryId, this.fieldOfficeId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(fieldOffice => {
                    console.log(fieldOffice)
                    this.fieldOffice.name = fieldOffice.name;
                    this.fieldOffice.id = fieldOffice.$key;
                    this.fieldOffice.locationLevel1 = fieldOffice.locationLevel1;
                    if(fieldOffice.locationLevel2 != null){
                      this.fieldOffice.locationLevel2 = fieldOffice.locationLevel2;
                    }else{
                      this.fieldOffice.locationLevel2 = null;
                    }

                  })
              }


              this.commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(content => {
                  if(!this.fieldOfficeId) {
                    this.fieldOffice.locationLevel1 = null;
                    this.fieldOffice.locationLevel2 = null;
                  }
                  this.countryLevelsValues = content;

                });
            })
        })

      })

  }

  submit(){
    if(this.fieldOffice.valid() == true){
      if(this.fieldOfficeId){
        this.fieldOfficeService.updateFieldOffice(this.fieldOffice, this.countryId)
          .then(success => {
            this.alertMessage = new AlertMessageModel('Field office updated.', AlertMessageType.Success)
            setTimeout(() => this.router.navigateByUrl('/country-admin/settings/field-offices'), Constants.ALERT_REDIRECT_DURATION);

          })
          .catch(err => {

          })
      }else{
        this.fieldOfficeService.addFieldOffice(this.fieldOffice, this.countryId)
          .then(success => {
            this.alertMessage = new AlertMessageModel('Field office added.', AlertMessageType.Success);
            setTimeout(() => this.router.navigateByUrl('/country-admin/settings/field-offices'), Constants.ALERT_REDIRECT_DURATION);
          })
          .catch(err => {

          })
      }

    }else{
      this.alertMessage = new AlertMessageModel(this.fieldOffice.valid(), AlertMessageType.Error);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
