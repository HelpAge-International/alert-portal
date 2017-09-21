import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, ResponsePlanSectors, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {UserService} from "../../../services/user.service";
import {AgencyService} from "../../../services/agency-service.service";
import {ModelAgency} from "../../../model/agency.model";
import {CoordinationArrangementService} from "../../../services/coordination-arrangement.service";
import {CoordinationArrangementModel} from "../../../model/coordination-arrangement.model";
import {PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
declare var jQuery: any;

@Component({
  selector: 'app-local-network-profile-coordination',
  templateUrl: './local-network-profile-coordination.component.html',
  styleUrls: ['./local-network-profile-coordination.component.css'],
  providers: [AgencyService]
})
export class LocalNetworkProfileCoordinationComponent implements OnInit, OnDestroy {

  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private countryId: string;
  private agencyId: string;
  private isViewing: boolean;
  private agency: ModelAgency;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  responsePlansSectors = ResponsePlanSectors;
  responsePlansSectorsSelection = Constants.RESPONSE_PLANS_SECTORS;

  // Models
  private alertMessage: AlertMessageModel = null;
  private coordinationArrangements: CoordinationArrangementModel[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private userType: UserType;

  // Helpers
  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _agencyService: AgencyService,
              private _coordinationArrangementService: CoordinationArrangementService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: Params) => {
        if (params["countryId"]) {
          this.countryId = params["countryId"];
        }
        if (params["isViewing"]) {
          this.isViewing = params["isViewing"];
        }
        if (params["agencyId"]) {
          this.agencyId = params["agencyId"];
        }

        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.userType = userType;

          if (this.countryId && this.agencyId && this.isViewing) {
            this._agencyService.getAgency(this.agencyId)
              .map(agency => {
                return agency as ModelAgency;
              })
              .subscribe(agency => {
                this.agency = agency;

                this._coordinationArrangementService.getCoordinationArrangements(this.countryId)
                  .subscribe(coordinationArrangements => {
                    this.coordinationArrangements = coordinationArrangements;
                  });
              });
          } else {
            // this._userService.getAgencyId(Constants.USER_PATHS[this.userType], this.uid)
            //   .takeUntil(this.ngUnsubscribe)
            //   .subscribe(agencyId => {
            //     this.agencyId = agencyId;
            //
            //     this._userService.getCountryId(Constants.USER_PATHS[this.userType], this.uid)
            //       .takeUntil(this.ngUnsubscribe)
            //       .subscribe(countryId => {
            //         this.countryId = countryId;
            this.countryId = countryId;
            this.agencyId = agencyId;
            this._agencyService.getAgency(this.agencyId)
              .map(agency => {
                return agency as ModelAgency;
              })
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agency => {
                this.agency = agency;

                this._coordinationArrangementService.getCoordinationArrangements(this.countryId)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(coordinationArrangements => {
                    this.coordinationArrangements = coordinationArrangements;
                  });
              });
            //     });
            // });
          }
        });
      });
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
    if (coordinationArrangementId) {
      this.router.navigate(['/network/local-network-office-profile/coordination/add-edit',
        {id: coordinationArrangementId}], {skipLocationChange: true});
    } else {
      this.router.navigateByUrl('/network/local-network-office-profile/coordination/add-edit');
    }
  }

}
