
import {takeUntil} from 'rxjs/operators';
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {ResponsePlanSectors} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AgencyService} from "../../../services/agency-service.service";
import {NetworkService} from "../../../services/network.service";
import {CoordinationArrangementService} from "../../../services/coordination-arrangement.service";
import {CoordinationArrangementNetworkModel} from "../../../model/coordination-arrangement-network.model";
import {PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage";

declare var jQuery: any;

@Component({
  selector: 'app-local-network-profile-coordination',
  templateUrl: './local-network-profile-coordination.component.html',
  styleUrls: ['./local-network-profile-coordination.component.css'],
  providers: [AgencyService]
})
export class LocalNetworkProfileCoordinationComponent implements OnInit, OnDestroy {
  countryId: any;
  agencyId: any;

  private networkViewValues: {};

  private isViewing = false;
  private isEdit = false;
  private canEdit = true;
  private uid: string;
  private networkId: string;
  private coordinationAgenciesNames = [];


  // Constants and enums
  responsePlansSectors = ResponsePlanSectors;
  responsePlansSectorsSelection = Constants.RESPONSE_PLANS_SECTORS;

  // Models
  private coordinationArrangements: CoordinationArrangementNetworkModel[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //network country re-use
  @Input() isNetworkCountry: boolean;
  private networkCountryId: string;
  private isViewingFromExternal: boolean;


  // Helpers
  constructor(private pageControl: PageControlService, private _agencyService: AgencyService,
              private networkService: NetworkService,
              private _coordinationArrangementService: CoordinationArrangementService,
              private router: Router,
              private storageService: LocalStorageService,
              private route: ActivatedRoute) {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

    this.networkViewValues = this.storageService.get(Constants.NETWORK_VIEW_VALUES);
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params: Params) => {
        if (params['isViewing']) {
          this.isViewing = params['isViewing'];
        }
        if (params['agencyId']) {
          this.agencyId = params['agencyId'];
        }
        if (params['countryId']) {
          this.countryId = params['countryId'];
        }
        if (params['networkId']) {
          this.networkId = params['networkId'];
        }
        if (params['networkCountryId']) {
          this.networkCountryId = params['networkCountryId'];
        }
        if (params['isViewingFromExternal']) {
          this.isViewingFromExternal = params['isViewingFromExternal'];
        }
        if (params['uid']) {
          this.uid = params['uid'];
        }


      })

    console.log(this.isNetworkCountry)
    this.isNetworkCountry ? this.networkCountryAccess() : this.localNetworkAdminAccess();
  }

  private networkCountryAccess() {

    if (this.isViewing) {
      // this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      //   this.uid = user.uid;
      //   console.log(this.uid)

        this._coordinationArrangementService.getCoordinationArrangementsNetworkCountry(this.networkCountryId).pipe(
          takeUntil(this.ngUnsubscribe))
          .subscribe(coordinationArrangements => {

            coordinationArrangements.forEach(coordinationArrangement => {
              let tempArray = []
              for (var key in coordinationArrangement.agencies) {

                this._agencyService.getAgency(key)
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(agency => {

                    tempArray.push(agency.name)
                  })


              }
              this._coordinationArrangementService.getCoordinationArrangementNonAlertMembersCountry(this.networkCountryId, coordinationArrangement.id)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(coordinationArrangementNonAlert => {
                  if (coordinationArrangementNonAlert.nonAlertMembers) {
                    Object.keys(coordinationArrangementNonAlert.nonAlertMembers)
                      .map(key => {

                        tempArray.push(coordinationArrangementNonAlert.nonAlertMembers[key].name)

                      })
                  }
                })
              this.coordinationAgenciesNames.push(tempArray);
              console.log(this.coordinationAgenciesNames)
            })
            this.coordinationArrangements = coordinationArrangements
            console.log(this.coordinationArrangements)

          });

      // });
    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;

        this.networkService.getSelectedIdObj(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            console.log(selection)
            this.networkId ? console.log(true) : console.log(false)
            this.networkId = selection["id"];
            this.networkCountryId = selection["networkCountryId"];

            this._coordinationArrangementService.getCoordinationArrangementsNetworkCountry(this.networkCountryId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(coordinationArrangements => {

                coordinationArrangements.forEach(coordinationArrangement => {
                  let tempArray = []
                  for (var key in coordinationArrangement.agencies) {

                    this._agencyService.getAgency(key)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(agency => {

                        tempArray.push(agency.name)
                      })


                  }
                  this._coordinationArrangementService.getCoordinationArrangementNonAlertMembersCountry(this.networkCountryId, coordinationArrangement.id)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(coordinationArrangementNonAlert => {
                      if (coordinationArrangementNonAlert.nonAlertMembers) {
                        Object.keys(coordinationArrangementNonAlert.nonAlertMembers)
                          .map(key => {

                            tempArray.push(coordinationArrangementNonAlert.nonAlertMembers[key].name)

                          })


                      }
                    })

                  this.coordinationAgenciesNames.push(tempArray);
                  console.log(this.coordinationAgenciesNames)
                })
                this.coordinationArrangements = coordinationArrangements
                console.log(this.coordinationArrangements)

              });

          });
      });
    }

  }

  private localNetworkAdminAccess() {

    if (this.isViewing) {
      this._coordinationArrangementService.getCoordinationArrangementsNetwork(this.networkId).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(coordinationArrangements => {

          coordinationArrangements.forEach(coordinationArrangement => {
            let tempArray = []
            for (var key in coordinationArrangement.agencies) {

              this._agencyService.getAgency(key)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(agency => {

                  tempArray.push(agency.name)
                })


            }
            this._coordinationArrangementService.getCoordinationArrangementNonAlertMembers(this.networkId, coordinationArrangement.id)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(coordinationArrangementNonAlert => {
                if (coordinationArrangementNonAlert.nonAlertMembers) {
                  Object.keys(coordinationArrangementNonAlert.nonAlertMembers)
                    .map(key => {

                      tempArray.push(coordinationArrangementNonAlert.nonAlertMembers[key].name)

                    })


                }
              })

            this.coordinationAgenciesNames.push(tempArray);
            console.log(this.coordinationAgenciesNames)
          })
          this.coordinationArrangements = coordinationArrangements
          console.log(this.coordinationArrangements)

        });

    } else {

      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];
            this._coordinationArrangementService.getCoordinationArrangementsNetwork(this.networkId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(coordinationArrangements => {

                coordinationArrangements.forEach(coordinationArrangement => {
                  let tempArray = []
                  for (var key in coordinationArrangement.agencies) {

                    this._agencyService.getAgency(key)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(agency => {

                        tempArray.push(agency.name)
                      })


                  }
                  this._coordinationArrangementService.getCoordinationArrangementNonAlertMembers(this.networkId, coordinationArrangement.id)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(coordinationArrangementNonAlert => {
                      if (coordinationArrangementNonAlert.nonAlertMembers) {
                        Object.keys(coordinationArrangementNonAlert.nonAlertMembers)
                          .map(key => {

                            tempArray.push(coordinationArrangementNonAlert.nonAlertMembers[key].name)

                          })


                      }
                    })

                  this.coordinationAgenciesNames.push(tempArray);
                  console.log(this.coordinationAgenciesNames)
                })
                this.coordinationArrangements = coordinationArrangements
                console.log(this.coordinationArrangements)

              });
          });
      });
    }
  }

  editCoordinationArrangement() {
    this.isEdit = true;
  }

  showCoordinationArrangement() {
    this.isEdit = false;
  }


  addEditCoordinationArrangement(coordinationArrangementId?: string) {
    if (this.networkViewValues) {
      if (coordinationArrangementId) {
        if (this.isNetworkCountry) {
          this.networkViewValues['id'] = coordinationArrangementId;
          this.networkViewValues['isNetworkCountry'] = true;
        } else {
          this.networkViewValues['id'] = coordinationArrangementId;
        }
        this.router.navigate(['/network/local-network-office-profile/coordination/add-edit', this.networkViewValues], {skipLocationChange: true});
      } else {
        if (this.isNetworkCountry) {
          this.networkViewValues['isNetworkCountry'] = true;
        }
        this.router.navigate(['/network/local-network-office-profile/coordination/add-edit', this.networkViewValues]);
      }
    } else {
      if (coordinationArrangementId) {

        this.router.navigate(['/network/local-network-office-profile/coordination/add-edit',
          this.isNetworkCountry ? {
            id: coordinationArrangementId,
            isNetworkCountry: true
          } : {id: coordinationArrangementId}], {skipLocationChange: true});
      } else {
        console.log()
        this.router.navigate(['/network/local-network-office-profile/coordination/add-edit', this.isNetworkCountry ? {isNetworkCountry: true} : {}]);
      }
    }
  }

}
