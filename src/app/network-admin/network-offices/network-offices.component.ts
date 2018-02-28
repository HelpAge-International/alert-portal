import {Component, OnDestroy, OnInit} from '@angular/core';
import {NetworkService} from "../../services/network.service";
import {Subject} from "rxjs/Subject";
import {AlertMessageModel} from "../../model/alert-message.model";
import {AlertMessageType} from "../../utils/Enums";
import {PageControlService} from "../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {NetworkOfficeModel} from "./add-edit-network-office/network-office.model";
import {Constants} from "../../utils/Constants";
import {UserService} from "../../services/user.service";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'app-network-offices',
  templateUrl: './network-offices.component.html',
  styleUrls: ['./network-offices.component.css'],
  providers: [NetworkService]
})
export class NetworkOfficesComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //constants and enums
  private Countries = Constants.COUNTRIES;

  //models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;

  //logic info
  private uid: string;
  private networkId: string;
  private networkOffices: Observable<NetworkOfficeModel[]>;
  private showLoader:boolean;
  private showCoCBanner: boolean;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private userService: UserService,
              private networkService: NetworkService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user,) => {
      this.uid = user.uid;
      this.checkCoCUpdated();

      //get network id
      this.networkOffices = this.networkService.getSelectedIdObj(this.uid)
        .flatMap((idObj: {}) => {
          this.networkId = idObj["id"];
          this.showLoader = true;
          return this.networkService.getNetworkOffices(idObj["id"])
            .do((offices: NetworkOfficeModel[]) => {
              offices.forEach(office => {
                office.adminName = this.userService.getUserName(office.adminId);
              });
              this.showLoader = false;
            });
        })
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private checkCoCUpdated(){
    this.af.database.object(Constants.APP_STATUS + "/userPublic/" + this.uid + "/latestCoCAgreed", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        if(snap.val() == false){
          this.showCoCBanner = true;
        }
      });
  }

  toggleOfficeActive(office: NetworkOfficeModel) {
    let data = {};
    data["/networkCountry/" + this.networkId + "/" + office.id + "/isActive"] = !office.isActive;
    this.networkService.updateNetworkField(data);
  }

  editOffice(id) {
    this.router.navigate(["/network/network-offices/add-edit-network-office", {id: id}]);
  }

}
