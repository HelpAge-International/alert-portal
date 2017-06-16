import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../utils/Constants';
import { AlertMessageType, ResponsePlanSectors } from '../../../utils/Enums';
import { RxHelper } from '../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../model/alert-message.model';
import { DisplayError } from "../../../errors/display.error";
import { UserService } from "../../../services/user.service";
import { AgencyService } from "../../../services/agency-service.service";
import { ModelAgency } from "../../../model/agency.model";
import { CoordinationArrangementService } from "../../../services/coordination-arrangement.service";
import { CoordinationArrangementModel } from "../../../model/coordination-arrangement.model";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-coordination',
  templateUrl: './coordination.component.html',
  styleUrls: ['./coordination.component.css'],
  providers: [AgencyService]
})

export class CountryOfficeCoordinationComponent implements OnInit, OnDestroy {
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private countryId: string;
  private agencyId: string;
  private agency: ModelAgency;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  responsePlansSectors = ResponsePlanSectors;
  responsePlansSectorsSelection = Constants.RESPONSE_PLANS_SECTORS;
  
  // Models
  private alertMessage: AlertMessageModel = null;
  private coordinationArrangements: CoordinationArrangementModel[];
  
  // Helpers  
  constructor(private _userService: UserService,
              private _agencyService: AgencyService,
              private _coordinationArrangementService: CoordinationArrangementService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper){
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  ngOnInit() {
    const authSubscription = this._userService.getAuthUser().subscribe(user => {
      if (!user) {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
        return;
      }

      this.uid = user.uid;

      this._userService.getCountryAdminUser(this.uid).subscribe(countryAdminUser => {
        this.countryId = countryAdminUser.countryId;
        this.agencyId = countryAdminUser.agencyAdmin ? Object.keys(countryAdminUser.agencyAdmin)[0] : '';

        this._agencyService.getAgency(this.agencyId)
              .map(agency => {
                return agency as ModelAgency;
              })
              .subscribe(agency => {
                this.agency = agency;

                this._coordinationArrangementService.getCoordinationArrangements(this.countryId)
                        .subscribe(coordinationArrangements => { this.coordinationArrangements = coordinationArrangements; });
              });
        });
    });
    this.subscriptions.add(authSubscription);
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-staff');
  }

  editCoordinationArrangement() {
    this.isEdit = true;
  }

  showCoordinationArrangement() {
    this.isEdit = false;
  }

  getStaffName(id) {
    let staffName = '';

    if (!id) {
      return staffName;
    }

    this._userService.getUser(id).subscribe(user => {
      if (user) {
        staffName = user.firstName + ' ' + user.lastName;
      }
    });

    return staffName;
  }
  addEditCoordinationArrangement(coordinationArrangementId?: string) {
    if(coordinationArrangementId)
    {
      this.router.navigate(['/country-admin/country-office-profile/coordination/add-edit-coordination',
                                  {id: coordinationArrangementId}], {skipLocationChange: true});
    }else{
      this.router.navigateByUrl('/country-admin/country-office-profile/coordination/add-edit-coordination');
    }
  }
}