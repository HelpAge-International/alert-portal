import {Component, OnDestroy, OnInit} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, StockType, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {NetworkService} from "../../../services/network.service";
import {StockCapacityModel} from "../../../model/stock-capacity.model";
import {StockService} from "../../../services/stock.service";
import {UserService} from "../../../services/user.service";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";
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


  private agencyCountryMap = new Map<string,string>();
  private countryInMap = new Map<string,any>();
  private countryExtMap = new Map<string,any>();


  constructor(private pageControl: PageControlService, private _stockService: StockService,
              private _noteService: NoteService, private networkService: NetworkService,
              private _userService: UserService,
              private router: Router,
              private af: AngularFire,
              private route: ActivatedRoute) {
    this.newNote = [];
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


                this._stockService.getStockCapacitiesLocalNetwork(this.networkId).subscribe(stockCapacities => {
                  this.stockCapacitiesIN = stockCapacities.filter(x => x.stockType == StockType.Network);
                  this.stockCapacitiesOUT = stockCapacities.filter(x => x.stockType == StockType.External);

                  console.log('hi'+ this.stockCapacitiesIN)
                  console.log(this.stockCapacitiesOUT)
                  // Get notes
                  stockCapacities.forEach(stockCapacity => {
                    const stockCapacityNode = "/localNetworkProfile/capacity/stockCapacity/" + this.networkId + "/" +  stockCapacity.id + "/notes"
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
                  .subscribe( agencies => {
                    let i = 0;
                    agencies.forEach( agency => {
                      this.agencyCountryMap.set(agency.$key, agency.countryCode);
                      console.log(this.agencyCountryMap)
                      this.af.database.object( Constants.APP_STATUS + "/agency/" + agency.$key)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(agency => {
                          this.agencies.push(agency)

                        })
                      this.af.database.list( Constants.APP_STATUS + "/countryOfficeProfile/capacity/stockCapacity/" + agency.countryCode)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(agencyStocks => {
                          this.agencyStocksIN[i] = []
                          agencyStocks.forEach( stock => {
                            if(stock.stockType == StockType.Country){

                              this.agencyStocksIN[i].push(stock)
                              this.countryInMap.set(agency.countryCode, this.agencyStocksIN[i]);
                              console.log(this.countryInMap.get(agency.countryCode));
                              console.log(this.agencyStocksIN[i]);
                            } else if(stock.stockType == StockType.External) {
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

      };





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
    if (stockCapacityId) {
      this.router.navigate(['/network/local-network-office-profile/stock-capacity/add-edit',
        {id: stockCapacityId, stockType: stockType}], {skipLocationChange: true});
    } else {
      this.router.navigate(['/network/local-network-office-profile/stock-capacity/add-edit',
        {stockType: stockType}], {skipLocationChange: true});
    }
  }

  validateNote(note: NoteModel): boolean {
    this.alertMessage = note.validate();

    return !this.alertMessage;
  }

  addNote(stockCapacity: StockCapacityModel, note: NoteModel) {
    if (this.validateNote(note)) {
      const stockCapacityNode = "/localNetworkProfile/capacity/stockCapacity/" + this.networkId + "/" +  stockCapacity.id + "/notes"
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
      const stockCapacityNode = "/localNetworkProfile/capacity/stockCapacity/" + this.networkId + "/" +  stockCapacity.id + "/notes"
      this._noteService.saveNote(stockCapacityNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  editActionAgency(stockCapacity: any, note: NoteModel) {
    this.closeEditModalAgency();

    if (this.validateNote(note)) {
      const stockCapacityNode = "/countryOfficeProfile/capacity/stockCapacity/" + this.activeAgency + "/" +  stockCapacity.$key + "/notes"
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

    const stockCapacityNode = "/localNetworkProfile/capacity/stockCapacity/" + this.networkId + "/" +  stockCapacity.id + "/notes"

    this._noteService.deleteNote(stockCapacityNode, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  deleteActionAgency(stockCapacity: any, note: NoteModel) {
    this.closeDeleteModalAgency();
    console.log(stockCapacity.$key)

    const stockCapacityNode = "/countryOfficeProfile/capacity/stockCapacity/" + this.activeAgency + "/" +  stockCapacity.$key + "/notes"

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