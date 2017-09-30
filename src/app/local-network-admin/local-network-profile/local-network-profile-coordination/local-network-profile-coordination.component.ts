import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, ResponsePlanSectors, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {UserService} from "../../../services/user.service";
import {AgencyService} from "../../../services/agency-service.service";
import {NetworkService} from "../../../services/network.service";
import {ModelAgency} from "../../../model/agency.model";
import {CoordinationArrangementService} from "../../../services/coordination-arrangement.service";
import {CoordinationArrangementNetworkModel} from "../../../model/coordination-arrangement-network.model";
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


  // Helpers
  constructor(private pageControl: PageControlService, private _agencyService: AgencyService,
              private networkService: NetworkService,
              private _coordinationArrangementService: CoordinationArrangementService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {

        this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
            this.uid = user.uid;
            this.networkService.getSelectedIdObj(user.uid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(selection => {
              this.networkId = selection["id"];
              this._coordinationArrangementService.getCoordinationArrangementsNetwork(this.networkId)
                .subscribe(coordinationArrangements => {

                  coordinationArrangements.forEach(coordinationArrangement => {
                    let tempArray = []
                    for( var key in coordinationArrangement.agencies){

                      this._agencyService.getAgency(key)
                        .subscribe(agency => {

                          tempArray.push(agency.name)
                        })


                    }
                    this._coordinationArrangementService.getCoordinationArrangementNonAlertMembers(this.networkId, coordinationArrangement.id)
                    .subscribe( coordinationArrangementNonAlert => {
                      if(coordinationArrangementNonAlert.nonAlertMembers){
                        Object.keys(coordinationArrangementNonAlert.nonAlertMembers)
                          .map( key => {
                            
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



  editCoordinationArrangement() {
    this.isEdit = true;
  }

  showCoordinationArrangement() {
    this.isEdit = false;
  }


  addEditCoordinationArrangement(coordinationArrangementId?: string) {
    if (coordinationArrangementId) {
      console.log('test')
      this.router.navigate(['/network/local-network-office-profile/coordination/add-edit',
        {id: coordinationArrangementId}], {skipLocationChange: true});
    } else {
      this.router.navigateByUrl('/network/local-network-office-profile/coordination/add-edit');
    }
  }

}
