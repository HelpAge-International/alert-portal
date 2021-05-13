
import {takeUntil} from 'rxjs/operators';
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, Privacy, StockType, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {NetworkService} from "../../../services/network.service";
import {StockCapacityModel} from "../../../model/stock-capacity.model";
import {StockService} from "../../../services/stock.service";
import {UserService} from "../../../services/user.service";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs";
import {AngularFire} from "angularfire2";
import {LocalStorageService} from "angular-2-local-storage";
import {ModelAgencyPrivacy} from "../../../model/agency-privacy.model";
import {SettingsService} from "../../../services/settings.service";

declare var jQuery: any;

@Component({
  selector: 'app-local-network-profile-stock-capacity',
  templateUrl: './local-network-profile-stock-capacity.component.html',
  styleUrls: ['./local-network-profile-stock-capacity.component.css']
})
export class LocalNetworkProfileStockCapacityComponent implements OnInit, OnDestroy {

  private USER_TYPE = UserType;
  private userType: UserType;
  private isEdit = false;
  private showNetwork = true;
  private showAgency = true;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private networkId: string;
  private isViewing: boolean;
  private agencies = [];
  private agencyStocksIN = [];
  private agencyStocksOUT = [];
  private activeAgency: string;
  private networkViewValues: {};
  private agencyId: string;
  private countryId: string;

  // Constants and enums
  private alertMessageType = AlertMessageType;
  STOCK_TYPE = StockType;

  // Models
  private alertMessage: AlertMessageModel = null;
  private stockCapacitiesIN: StockCapacityModel[];
  private stockCapacitiesOUT: StockCapacityModel[];

  // Helpers
  private newNote: NoteModel[];
  private activeNote: NoteModel;
  private activeStockCapacity: StockCapacityModel;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryPermissionsMatrix: CountryPermissionsMatrix = new CountryPermissionsMatrix();


  private agencyCountryMap = new Map<string, string>();
  private countryInMap = new Map<string, any>();
  private countryExtMap = new Map<string, any>();

  //network country re-use
  @Input() isNetworkCountry: boolean;
  private networkCountryId: string;
  private isViewingFromExternal: boolean;

  private agencyCountryPrivacyMap = new Map<string, ModelAgencyPrivacy>()
  private Privacy = Privacy


  constructor(private pageControl: PageControlService, private _stockService: StockService,
              private _noteService: NoteService, private networkService: NetworkService,
              private _userService: UserService,
              private router: Router,
              private af: AngularFire,
              private storageService: LocalStorageService,
              private settingService: SettingsService,
              private route: ActivatedRoute) {
    this.newNote = [];
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
        if (params['uid']) {
          this.uid = params['uid'];
        }
        if (params['isViewingFromExternal']) {
          this.isViewingFromExternal = params['isViewingFromExternal'];
        }


        this.isNetworkCountry ? this.networkCountryAccess() : this.localNetworkAdminAccess();
      })

  };

  private networkCountryAccess() {
    if (this.isViewing) {

      this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(map => {
          console.log(map);
          this.agencyCountryMap = map;

          let i = 0;
          this.agencyCountryMap.forEach((countryId, agencyId) => {
            this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agency => {
                this.agencies.push(agency)
              })

            //get privacy for country
            this.settingService.getPrivacySettingForCountry(countryId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(privacy => {
                this.agencyCountryPrivacyMap.set(agencyId, privacy)
              })

            const path = countryId !== agencyId ? Constants.APP_STATUS + "/countryOfficeProfile/capacity/stockCapacity/" + countryId : Constants.APP_STATUS + "/localAgencyProfile/capacity/stockCapacity/" + agencyId
            this.af.database.list(path)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agencyStocks => {
                console.log(agencyStocks)
                this.agencyStocksIN[i] = []
                this.agencyStocksOUT[i] = []
                agencyStocks.forEach(stock => {

                  if (stock.stockType == StockType.Country || stock.stockType == StockType.Agency) {
                    this.agencyStocksIN[i].push(stock)
                    this.countryInMap.set(countryId, this.agencyStocksIN[i]);
                    console.log(this.countryInMap.get(countryId));
                    console.log(this.agencyStocksIN[i]);
                  } else if (stock.stockType == StockType.External || stock.stockType == StockType.AgencyExternal) {
                    this.agencyStocksOUT[i].push(stock)
                    this.countryExtMap.set(countryId, this.agencyStocksOUT[i]);
                    console.log(this.countryExtMap);
                    console.log(this.agencyStocksOUT[i])
                  }

                  const notePath = countryId !== agencyId ? "/countryOfficeProfile/capacity/stockCapacity/" + countryId + "/" + stock.$key + "/notes" : "/localAgencyProfile/capacity/stockCapacity/" + agencyId + "/" + stock.$key + "/notes"
                  this._noteService.getNotes(notePath).pipe(takeUntil(this.ngUnsubscribe)).subscribe(notes => {

                    stock.notes = notes;

                    // Create the new note model for partner organisation
                    this.newNote[stock.$key] = new NoteModel();
                    this.newNote[stock.$key].uploadedBy = this.uid;

                  });

                });
                i++;
              })
          })

          this._stockService.getStockCapacitiesLocalNetworkCountry(this.networkCountryId).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(stockCapacities => {
              this.stockCapacitiesIN = stockCapacities.filter(x => x.stockType == StockType.Network);
              this.stockCapacitiesOUT = stockCapacities.filter(x => x.stockType == StockType.External);

              console.log('hi' + this.stockCapacitiesIN)
              console.log(this.stockCapacitiesOUT)
              // Get notes
              stockCapacities.forEach(stockCapacity => {
                const stockCapacityNode = "/networkCountryOfficeProfile/capacity/stockCapacity/" + this.networkCountryId + "/" + stockCapacity.id + "/notes"
                this._noteService.getNotes(stockCapacityNode).pipe(takeUntil(this.ngUnsubscribe)).subscribe(notes => {
                  stockCapacity.notes = notes;

                  // Create the new note model for partner organisation
                  this.newNote[stockCapacity.id] = new NoteModel();
                  this.newNote[stockCapacity.id].uploadedBy = this.uid;
                });
              })
            });

        });

    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;

        this.networkService.getSelectedIdObj(this.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];
            this.networkCountryId = selection["networkCountryId"];

            this.networkService.mapAgencyCountryForNetworkCountry(this.networkId, this.networkCountryId).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(map => {
                console.log(map);
                this.agencyCountryMap = map;

                let i = 0;
                if (this.agencyCountryMap != null) {
                  this.agencyCountryMap.forEach((countryId, agencyId) => {
                    this.af.database.object(Constants.APP_STATUS + "/agency/" + agencyId)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(agency => {
                        this.agencies.push(agency)
                      });

                    //get privacy for country
                    this.settingService.getPrivacySettingForCountry(countryId).pipe(
                      takeUntil(this.ngUnsubscribe))
                      .subscribe(privacy => {
                        this.agencyCountryPrivacyMap.set(agencyId, privacy)
                      });

                    this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/stockCapacity/" + countryId)
                      .takeUntil(this.ngUnsubscribe)
                      .subscribe(agencyStocks => {
                        this.agencyStocksIN[i] = []
                        agencyStocks.forEach(stock => {
                          if (stock.stockType == StockType.Country) {

                            this.agencyStocksIN[i].push(stock)
                            this.countryInMap.set(countryId, this.agencyStocksIN[i]);
                            console.log(this.countryInMap.get(countryId));
                            console.log(this.agencyStocksIN[i]);
                          } else if (stock.stockType == StockType.External) {
                            this.agencyStocksOUT[i] = []
                            this.agencyStocksOUT[i].push(stock)
                            this.countryExtMap.set(countryId, this.agencyStocksOUT[i]);
                            console.log(this.countryExtMap);
                          }

                          this._noteService.getNotes("/countryOfficeProfile/capacity/stockCapacity/" + countryId + "/" + stock.$key + "/notes").pipe(takeUntil(this.ngUnsubscribe)).subscribe(notes => {

                            console.log("/countryOfficeProfile/capacity/stockCapacity/" + countryId + "/" + stock.$key + "/notes")
                            stock.notes = notes;

                            // Create the new note model for partner organisation
                            this.newNote[stock.$key] = new NoteModel();
                            this.newNote[stock.$key].uploadedBy = this.uid;

                          });

                        });
                        i++;
                      })
                  });
                }

                this._stockService.getStockCapacitiesLocalNetworkCountry(this.networkCountryId).pipe(
                  takeUntil(this.ngUnsubscribe))
                  .subscribe(stockCapacities => {
                    this.stockCapacitiesIN = stockCapacities.filter(x => x.stockType == StockType.Network);
                    this.stockCapacitiesOUT = stockCapacities.filter(x => x.stockType == StockType.External);

                    console.log('hi' + this.stockCapacitiesIN)
                    console.log(this.stockCapacitiesOUT)
                    // Get notes
                    stockCapacities.forEach(stockCapacity => {
                      const stockCapacityNode = "/networkCountryOfficeProfile/capacity/stockCapacity/" + this.networkCountryId + "/" + stockCapacity.id + "/notes"
                      this._noteService.getNotes(stockCapacityNode).pipe(takeUntil(this.ngUnsubscribe)).subscribe(notes => {
                        stockCapacity.notes = notes;

                        // Create the new note model for partner organisation
                        this.newNote[stockCapacity.id] = new NoteModel();
                        this.newNote[stockCapacity.id].uploadedBy = this.uid;
                      });
                    })
                  });

              });
          });
      });
    }
  }


  private localNetworkAdminAccess() {
    if (this.isViewing || this.isViewingFromExternal) {
      console.log("local viewing from external")
      this._stockService.getStockCapacitiesLocalNetwork(this.networkId).subscribe(stockCapacities => {
        this.stockCapacitiesIN = stockCapacities.filter(x => x.stockType == StockType.Network);
        this.stockCapacitiesOUT = stockCapacities.filter(x => x.stockType == StockType.External);

        console.log('hi' + this.stockCapacitiesIN)
        console.log(this.stockCapacitiesOUT)
        // Get notes
        stockCapacities.forEach(stockCapacity => {
          const stockCapacityNode = "/localNetworkProfile/capacity/stockCapacity/" + this.networkId + "/" + stockCapacity.id + "/notes"
          this._noteService.getNotes(stockCapacityNode).subscribe(notes => {
            stockCapacity.notes = notes;

            // Create the new note model for partner organisation
            this.newNote[stockCapacity.id] = new NoteModel();
            this.newNote[stockCapacity.id].uploadedBy = this.uid;
          });
        })
      });

      this.af.database.list(Constants.APP_STATUS + "/network/" + this.networkId + "/agencies")
        .takeUntil(this.ngUnsubscribe)
        .subscribe(agencies => {
          let i = 0;
          agencies.forEach(agency => {
            this.agencyCountryMap.set(agency.$key, agency.countryCode);
            console.log(this.agencyCountryMap)
            this.af.database.object(Constants.APP_STATUS + "/agency/" + agency.$key)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agency => {
                this.agencies.push(agency)
              })

            //get privacy for country
            this.settingService.getPrivacySettingForCountry(agency.countryCode).pipe(
              takeUntil(this.ngUnsubscribe))
              .subscribe(privacy => {
                this.agencyCountryPrivacyMap.set(agency.$key, privacy)
              })

            const path = agency.$key !== agency.countryCode ? Constants.APP_STATUS + "/countryOfficeProfile/capacity/stockCapacity/" + agency.countryCode : Constants.APP_STATUS + "/localAgencyProfile/capacity/stockCapacity/" + agency.$key
            this.af.database.list(path)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agencyStocks => {
                this.agencyStocksIN[i] = []
                this.agencyStocksOUT[i] = []
                agencyStocks.forEach(stock => {
                  if (stock.stockType == StockType.Country || stock.stockType == StockType.Agency) {
                    this.agencyStocksIN[i].push(stock)
                    this.countryInMap.set(agency.countryCode, this.agencyStocksIN[i]);
                    console.log(this.countryInMap.get(agency.countryCode));
                    console.log(this.agencyStocksIN[i]);
                  } else if (stock.stockType == StockType.External || stock.stockType == StockType.AgencyExternal) {
                    this.agencyStocksOUT[i].push(stock)
                    this.countryExtMap.set(agency.countryCode, this.agencyStocksOUT[i]);
                    console.log(this.countryExtMap);
                  }

                  const notePath = agency.$key !== agency.countryCode ? "/countryOfficeProfile/capacity/stockCapacity/" + agency.countryCode + "/" + stock.$key + "/notes" : "/localAgencyProfile/capacity/stockCapacity/" + agency.$key + "/" + stock.$key + "/notes"
                  this._noteService.getNotes(notePath).pipe(takeUntil(this.ngUnsubscribe)).subscribe(notes => {

                    stock.notes = notes;

                    // Create the new note model for partner organisation
                    this.newNote[stock.$key] = new NoteModel();
                    this.newNote[stock.$key].uploadedBy = this.uid;

                  });

                });
                i++;
              })
          })
        })

    } else {
      this.pageControl.networkAuth(this.ngUnsubscribe, this.route, this.router, (user) => {
        this.uid = user.uid;

        this.networkService.getSelectedIdObj(user.uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(selection => {
            this.networkId = selection["id"];


            this._stockService.getStockCapacitiesLocalNetwork(this.networkId).subscribe(stockCapacities => {
              this.stockCapacitiesIN = stockCapacities.filter(x => x.stockType == StockType.Network);
              this.stockCapacitiesOUT = stockCapacities.filter(x => x.stockType == StockType.External);

              console.log('hi' + this.stockCapacitiesIN)
              console.log(this.stockCapacitiesOUT)
              // Get notes
              stockCapacities.forEach(stockCapacity => {
                const stockCapacityNode = "/localNetworkProfile/capacity/stockCapacity/" + this.networkId + "/" + stockCapacity.id + "/notes"
                this._noteService.getNotes(stockCapacityNode).subscribe(notes => {
                  stockCapacity.notes = notes;

                  // Create the new note model for partner organisation
                  this.newNote[stockCapacity.id] = new NoteModel();
                  this.newNote[stockCapacity.id].uploadedBy = this.uid;
                });
              })
            });

            this.af.database.list(Constants.APP_STATUS + "/network/" + this.networkId + "/agencies")
              .takeUntil(this.ngUnsubscribe)
              .subscribe(agencies => {
                let i = 0;
                agencies.forEach(agency => {
                  this.agencyCountryMap.set(agency.$key, agency.countryCode);
                  console.log(this.agencyCountryMap)
                  this.af.database.object(Constants.APP_STATUS + "/agency/" + agency.$key)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agency => {
                      this.agencies.push(agency)

                    })

                  //get privacy for country
                  this.settingService.getPrivacySettingForCountry(agency.countryCode).pipe(
                    takeUntil(this.ngUnsubscribe))
                    .subscribe(privacy => {
                      this.agencyCountryPrivacyMap.set(agency.$key, privacy)
                    })

                  this.af.database.list(Constants.APP_STATUS + "/countryOfficeProfile/capacity/stockCapacity/" + agency.countryCode)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(agencyStocks => {
                      this.agencyStocksIN[i] = []
                      agencyStocks.forEach(stock => {
                        if (stock.stockType == StockType.Country) {

                          this.agencyStocksIN[i].push(stock)
                          this.countryInMap.set(agency.countryCode, this.agencyStocksIN[i]);
                          console.log(this.countryInMap.get(agency.countryCode));
                          console.log(this.agencyStocksIN[i]);
                        } else if (stock.stockType == StockType.External) {
                          this.agencyStocksOUT[i] = []
                          this.agencyStocksOUT[i].push(stock)
                          this.countryExtMap.set(agency.countryCode, this.agencyStocksOUT[i]);
                          console.log(this.countryExtMap);
                        }

                        this._noteService.getNotes("/countryOfficeProfile/capacity/stockCapacity/" + agency.countryCode + "/" + stock.$key + "/notes").subscribe(notes => {

                          console.log("/countryOfficeProfile/capacity/stockCapacity/" + agency.countryCode + "/" + stock.$key + "/notes")
                          stock.notes = notes;

                          // Create the new note model for partner organisation
                          this.newNote[stock.$key] = new NoteModel();
                          this.newNote[stock.$key].uploadedBy = this.uid;

                        });

                      });
                      i++;
                    })
                })
              })
          });
      })
    }

  }

  editStockCapacity() {
    this.isEdit = true;
  }

  viewStockCapacity() {
    this.isEdit = false;
  }

  showNetworkOwned() {
    this.showNetwork = true;
  }

  hideNetworkOwned() {
    this.showNetwork = false;
  }

  showAgencyOwned() {
    this.showAgency = true;
  }

  hideAgencyOwned() {
    this.showAgency = false;
  }

  addEditStockCapacity(stockType: StockType, stockCapacityId?: string) {
    console.log('addEdit')
    if (this.networkViewValues) {

      if (stockCapacityId) {
        this.networkViewValues['id'] = stockCapacityId;
        this.networkViewValues['stockType'] = stockType;
        if (this.isNetworkCountry) {
          this.networkViewValues['isNetworkCountry'] = true;
        }
        this.router.navigate(['/network/local-network-office-profile/stock-capacity/add-edit',
          this.networkViewValues], {skipLocationChange: true});
      } else {
        this.networkViewValues['stockType'] = stockType;
        if (this.isNetworkCountry) {
          this.networkViewValues['isNetworkCountry'] = true;
        }
        this.router.navigate(['/network/local-network-office-profile/stock-capacity/add-edit',
          this.networkViewValues], {skipLocationChange: true});
      }
    } else {
      if (stockCapacityId) {
        this.router.navigate(['/network/local-network-office-profile/stock-capacity/add-edit',
          this.isNetworkCountry ? {
            id: stockCapacityId,
            stockType: stockType,
            isNetworkCountry: true
          } : {id: stockCapacityId, stockType: stockType}], {skipLocationChange: true});
      } else {
        this.router.navigate(['/network/local-network-office-profile/stock-capacity/add-edit',
          this.isNetworkCountry ? {
            stockType: stockType,
            isNetworkCountry: true
          } : {stockType: stockType}], {skipLocationChange: true});
      }
    }
  }

  validateNote(note: NoteModel): boolean {
    this.alertMessage = note.validate();

    return !this.alertMessage;
  }

  addNote(stockCapacity: StockCapacityModel, note: NoteModel) {
    console.log("/networkCountryOfficeProfile/capacity/stockCapacity/" + this.networkCountryId + "/" + stockCapacity.id + "/notes")
    if (this.validateNote(note)) {
      const stockCapacityNode = this.isNetworkCountry ? "/networkCountryOfficeProfile/capacity/stockCapacity/" + this.networkCountryId + "/" + stockCapacity.id + "/notes" : "/localNetworkProfile/capacity/stockCapacity/" + this.networkId + "/" + stockCapacity.id + "/notes"
      this._noteService.saveNote(stockCapacityNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  addNoteAgency(stockCapacity: any, note: NoteModel, countryCode: any) {
    console.log(countryCode)
    if (this.validateNote(note)) {
      const stockCapacityNode = Constants.STOCK_CAPACITY_NODE
        .replace('{countryId}', countryCode)
        .replace('{id}', stockCapacity.$key);
      this._noteService.saveNote(stockCapacityNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  editNote(stockCapacity: StockCapacityModel, note: NoteModel) {
    console.log(stockCapacity)
    jQuery('#edit-action').modal('show');
    this.activeStockCapacity = stockCapacity;
    this.activeNote = note;
  }

  editNoteAgency(stockCapacity: StockCapacityModel, note: NoteModel, agency: any) {
    console.log(stockCapacity)
    jQuery('#edit-action-agency').modal('show');
    this.activeStockCapacity = stockCapacity;
    this.activeAgency = this.agencyCountryMap.get(agency.$key);
    this.activeNote = note;
  }


  editAction(stockCapacity: StockCapacityModel, note: NoteModel) {
    this.closeEditModal();

    if (this.validateNote(note)) {
      const stockCapacityNode = this.isNetworkCountry ? "/networkCountryOfficeProfile/capacity/stockCapacity/" + this.networkCountryId + "/" + stockCapacity.id + "/notes" : "/localNetworkProfile/capacity/stockCapacity/" + this.networkId + "/" + stockCapacity.id + "/notes"
      this._noteService.saveNote(stockCapacityNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  editActionAgency(stockCapacity: any, note: NoteModel) {
    this.closeEditModalAgency();

    if (this.validateNote(note)) {
      const stockCapacityNode = "/countryOfficeProfile/capacity/stockCapacity/" + this.activeAgency + "/" + stockCapacity.$key + "/notes"
      this._noteService.saveNote(stockCapacityNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }


  closeEditModal() {
    jQuery('#edit-action').modal('hide');
  }

  closeEditModalAgency() {
    jQuery('#edit-action-agency').modal('hide');
  }

  deleteNote(stockCapacity: StockCapacityModel, note: NoteModel) {
    console.log(stockCapacity)
    jQuery('#delete-action').modal('show');
    this.activeStockCapacity = stockCapacity;
    this.activeNote = note;
  }

  deleteNoteAgency(stockCapacity: StockCapacityModel, note: NoteModel, agency: any) {
    console.log(this.agencyCountryMap.get(agency.$key))
    jQuery('#delete-action-agency').modal('show');
    this.activeStockCapacity = stockCapacity;
    this.activeAgency = this.agencyCountryMap.get(agency.$key);
    this.activeNote = note;
  }

  deleteAction(stockCapacity: StockCapacityModel, note: NoteModel) {
    this.closeDeleteModal();

    const stockCapacityNode = this.isNetworkCountry ? "/networkCountryOfficeProfile/capacity/stockCapacity/" + this.networkCountryId + "/" + stockCapacity.id + "/notes" : "/localNetworkProfile/capacity/stockCapacity/" + this.networkId + "/" + stockCapacity.id + "/notes"

    this._noteService.deleteNote(stockCapacityNode, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  deleteActionAgency(stockCapacity: any, note: NoteModel) {
    this.closeDeleteModalAgency();
    console.log(stockCapacity.$key)

    const stockCapacityNode = "/countryOfficeProfile/capacity/stockCapacity/" + this.activeAgency + "/" + stockCapacity.$key + "/notes"

    this._noteService.deleteNote(stockCapacityNode, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeDeleteModal() {
    jQuery('#delete-action').modal('hide');
  }

  closeDeleteModalAgency() {
    jQuery('#delete-action-agency').modal('hide');
  }

  getUserName(userId) {
    let userName = "";

    this._userService.getUser(userId).subscribe(user => {
      userName = user.firstName + ' ' + user.lastName;
    });

    return userName;
  }


}
