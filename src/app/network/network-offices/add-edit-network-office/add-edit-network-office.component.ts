import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {NetworkOfficeModel} from "./network-office.model";
import {ModelUserPublic} from "../../../model/user-public.model";
import {AlertMessageType} from "../../../utils/Enums";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {Location} from "@angular/common";
import {NetworkService} from "../../../services/network.service";
import {SettingsService} from "../../../services/settings.service";
import {ModuleSettingsModel} from "../../../model/module-settings.model";
import {UUID} from "../../../utils/UUID";
import {NetworkOfficeAdminModel} from "./network-office-admin.model";

@Component({
  selector: 'app-add-edit-network-office',
  templateUrl: './add-edit-network-office.component.html',
  styleUrls: ['./add-edit-network-office.component.css']
})
export class AddEditNetworkOfficeComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  //constants and enums
  private COUNTRIES = Constants.COUNTRIES;
  private COUNTRY_SELECTION = Constants.COUNTRY_SELECTION;
  private PERSON_TITLE = Constants.PERSON_TITLE;
  private PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;

  //models
  private alertMessage: AlertMessageModel = null;
  private alertMessageType = AlertMessageType;
  private networkOffice = new NetworkOfficeModel();
  private networkCountryUser = new ModelUserPublic("", "", undefined, "");
  private networkCountryAdmin = new NetworkOfficeAdminModel();

  //logic info
  private uid: string;
  private network: any;
  private networkModuleSetting: ModuleSettingsModel[];
  private isEditing: boolean;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private networkService: NetworkService,
              private location: Location,
              private settingService: SettingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user,) => {
      this.uid = user.uid;

      //get network id
      this.networkService.getSelectedIdObj(this.uid)
        .flatMap((idObj: {}) => {
          //get network detail
          return this.networkService.getNetworkDetail(idObj["id"]);
        })
        .subscribe(network => {
          console.log(network);
          this.network = network;

          //get network module setting
          this.settingService.getCountryModulesSettings(network.$key)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((networkModuleSetting: ModuleSettingsModel[]) => {
              this.networkModuleSetting = networkModuleSetting;
            });

        })
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submit() {
    console.log("submit");
    this.alertMessage = this.networkOffice.validate();
    if (!this.alertMessage) {
      this.alertMessage = this.networkCountryUser.validate(["phone", "city"]);
    }
    if (!this.alertMessage) {
      //create new network country with all data
      if (!this.networkModuleSetting) {
        this.alertMessage = new AlertMessageModel("Module settings is not ready, please try again later!");
        return;
      }

      let data = this.isEditing ? this.updateNetworkOffice() : this.createNetworkOffice();
      console.log(data);

      //actual database update
      this.networkService.updateNetworkField(data).then(() => {
        this.back();
      }).catch(error => {
        console.log(error.message);
        this.alertMessage = new AlertMessageModel(error.message);
      });
    }
  }

  private createNetworkOffice() {
    //generate all keys
    const keyNetworkCountry = this.networkService.generateKeyForNetworkCountry();
    const keyUser = this.networkService.generateKeyUserPublic();

    //set network office data
    this.networkOffice.isActive = true;
    this.networkOffice.adminId = keyUser;
    this.networkOffice.clockSettings = this.network.clockSettings;

    //set network office admin data
    this.networkCountryAdmin.firstLogin = true;
    let networkCountryIds = {};
    networkCountryIds[keyNetworkCountry] = true;
    this.networkCountryAdmin.networkCountryIds = networkCountryIds;

    //root update data
    let data = {};
    data["/networkCountry/" + keyNetworkCountry] = this.networkOffice;
    data["/module/" + keyNetworkCountry] = this.networkModuleSetting;
    data["/userPublic/" + keyUser] = this.networkCountryUser;
    data["/networkCountryAdmin/" + keyUser] = this.networkCountryAdmin;

    return data;
  }

  //TODO UPDATE THIS METHOD WHEN DO EDITING
  private updateNetworkOffice() {
    //generate all keys
    const keyNetworkCountry = this.networkService.generateKeyForNetworkCountry();
    const keyUser = this.networkService.generateKeyUserPublic();

    //set network office data
    this.networkOffice.isActive = true;
    this.networkOffice.adminId = keyUser;
    this.networkOffice.clockSettings = this.network.clockSettings;

    //set network office admin data
    this.networkCountryAdmin.firstLogin = true;
    let networkCountryIds = {};
    networkCountryIds[keyNetworkCountry] = true;
    this.networkCountryAdmin.networkCountryIds = networkCountryIds;

    //root update data
    let data = {};
    data["/networkCountry/" + keyNetworkCountry] = this.networkOffice;
    data["/module/" + keyNetworkCountry] = this.networkModuleSetting;
    data["/userPublic/" + keyUser] = this.networkCountryUser;
    data["/networkCountryAdmin/" + keyUser] = this.networkCountryAdmin;

    return data;
  }

  back() {
    this.location.back();
  }

}
