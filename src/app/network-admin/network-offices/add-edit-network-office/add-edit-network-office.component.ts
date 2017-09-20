import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
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
import {UserService} from "../../../services/user.service";
import {first} from "rxjs/operator/first";
import {NetworkCountryService} from "../../../services/network-country.service";

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
  private networkId: string;
  private network: any;
  private networkModuleSetting: ModuleSettingsModel[];
  private isEditing: boolean;
  private existingUser: ModelUserPublic;
  private networkCountryId: string;
  private showLoader: boolean;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private networkService: NetworkService,
              private networkCountryService: NetworkCountryService,
              private userService: UserService,
              private location: Location,
              private settingService: SettingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user,) => {
      this.uid = user.uid;

      this.route.params
        .takeUntil(this.ngUnsubscribe)
        .subscribe((params: Params) => {
          if (params["id"]) {
            this.networkCountryId = params["id"];
            this.isEditing = true;
            this.showLoader = true;
          }

          //get network id
          this.networkService.getSelectedIdObj(this.uid)
            .flatMap((idObj: {}) => {
              //get network detail
              this.networkId = idObj["id"];
              return this.networkService.getNetworkDetail(idObj["id"]);
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(network => {
              console.log(network);
              this.network = network;

              this.isEditing ? this.initEditOffice() : this.initCreateOffice();

              //filter out used countries
              this.networkCountryService.getAssignedCountries(this.networkId, this.networkCountryId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(assignedLocations => {
                  const isavailable = country => assignedLocations.indexOf(country) == -1;
                  this.COUNTRY_SELECTION = this.COUNTRY_SELECTION.filter(isavailable);
                });
            });
        });
    });
  }

  private initCreateOffice() {

    //get network module setting
    this.settingService.getCountryModulesSettings(this.networkId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((networkModuleSetting: ModuleSettingsModel[]) => {
        this.networkModuleSetting = networkModuleSetting;
      });
  }

  private initEditOffice() {

    this.networkCountryService.getNetworkCountryDetail(this.networkId, this.networkCountryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(networkOffice => {
        this.networkOffice = networkOffice;

        this.userService.getUser(networkOffice.adminId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(user => {
            this.networkCountryUser = user;
            this.showLoader = false;
          })

      });


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
      if (!this.isEditing && !this.networkModuleSetting) {
        this.alertMessage = new AlertMessageModel("Module settings is not ready, please try again later!");
        return;
      }

      this.userService.getUserByEmail(this.networkCountryUser.email)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((user: ModelUserPublic) => {
          console.log(user);
          if (user) {
            this.existingUser = user;

            let data = this.isEditing ? this.updateNetworkOffice(user) : this.createNetworkOffice(user);
            console.log(data);

            //actual database update
            this.networkService.updateNetworkField(data).then(() => {
              this.back();
            }).catch(error => {
              console.log(error.message);
              this.alertMessage = new AlertMessageModel(error.message);
            });
          }
        });
    }
  }

  private createNetworkOffice(existingUser) {

    //generate all keys
    const keyNetworkCountry = this.networkService.generateKeyForNetworkCountry();
    const keyUser = existingUser ? existingUser.id : this.networkService.generateKeyUserPublic();

    //set network office data
    this.networkOffice.isActive = true;
    this.networkOffice.adminId = keyUser;
    this.networkOffice.clockSettings = this.network.clockSettings;

    //set network office admin data
    existingUser ? this.networkCountryAdmin.firstLogin = true : this.networkCountryAdmin.firstLogin = false;
    let networkCountryIds = {};
    networkCountryIds[keyNetworkCountry] = true;
    this.networkCountryAdmin.networkCountryIds = networkCountryIds;
    this.networkCountryAdmin.networkId = this.networkId;

    //root update data
    let data = {};
    data["/networkCountry/" + this.networkId + "/" + keyNetworkCountry] = this.networkOffice;
    data["/module/" + keyNetworkCountry] = this.networkModuleSetting;
    data["/userPublic/" + keyUser] = this.networkCountryUser;
    // data["/networkCountryAdmin/" + keyUser] = this.networkCountryAdmin;
    data["/administratorNetworkCountry/" + keyUser + "/firstLogin"] = this.networkCountryAdmin.firstLogin;
    data["/administratorNetworkCountry/" + keyUser + "/networkCountryIds/" + keyNetworkCountry] = true;
    data["/administratorNetworkCountry/" + keyUser + "/networkId"] = this.networkCountryAdmin.networkId;
    //update group


    //create gourp node
    data["/group/network/" + this.networkId + "/networkallusersgroup/" + keyUser] = true;
    data["/group/network/" + this.networkId + "/networkcountryadmins/" + keyUser] = true;

    console.log(data);

    return data;
  }

  //TODO UPDATE THIS METHOD WHEN DO EDITING
  private updateNetworkOffice(existingUser) {
    console.log("update");
    //generate all keys
    const keyNetworkCountry = this.networkCountryId;
    const keyUser = existingUser ? existingUser.id : this.networkService.generateKeyUserPublic();

    //set network office data
    this.networkOffice.adminId = keyUser;

    //set network office admin data
    let networkCountryIds = {};
    networkCountryIds[keyNetworkCountry] = true;
    this.networkCountryAdmin.networkCountryIds = networkCountryIds;
    this.networkCountryAdmin.networkId = this.networkId;

    //root update data
    let data = {};
    data["/networkCountry/" + this.networkId + "/" + keyNetworkCountry] = this.networkOffice;
    data["/userPublic/" + keyUser] = this.networkCountryUser;
    // data["/networkCountryAdmin/" + keyUser] = this.networkCountryAdmin;
    data["/administratorNetworkCountry/" + keyUser + "/networkCountryIds/" + keyNetworkCountry] = true;

    return data;
  }

  back() {
    this.location.back();
  }

}
