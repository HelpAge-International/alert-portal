import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {Constants} from "../../../utils/Constants";
import {AlertMessageType, StockType, UserType} from "../../../utils/Enums";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AlertMessageModel} from "../../../model/alert-message.model";
import {UserService} from "../../../services/user.service";
import {StockCapacityModel} from "../../../model/stock-capacity.model";
import {StockService} from "../../../services/stock.service";
import {NoteModel} from "../../../model/note.model";
import {NoteService} from "../../../services/note.service";
import {CountryPermissionsMatrix, PageControlService} from "../../../services/pagecontrol.service";
import {Subject} from "rxjs/Subject";
import {AngularFire} from "angularfire2";
import {AgencyService} from "../../../services/agency-service.service";
import {CommonService} from "../../../services/common.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-stock-capacity',
  templateUrl: './stock-capacity.component.html',
  styleUrls: ['./stock-capacity.component.css']
})

export class CountryOfficeStockCapacityComponent implements OnInit, OnDestroy {
  private USER_TYPE = UserType;
  private userType: UserType;
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private countryId: string;
  private agencyId: string;
  private isViewing: boolean;

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
  private userAgencyId: string;
  private countries = Constants.COUNTRIES;
  private locationObjs: any[] = [];

  @Input() isLocalAgency: boolean;

  constructor(private pageControl: PageControlService, private _userService: UserService,
              private _stockService: StockService,
              private _noteService: NoteService,
              private agencyService: AgencyService,
              private router: Router,
              private af: AngularFire,
              private jsonService: CommonService,
              private route: ActivatedRoute) {
    this.newNote = [];
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.isLocalAgency ? this.initLocalAgency() : this.initCountryOffice()
  }

  private initLocalAgency(){


        this.pageControl.authUserObj(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
          this.uid = user.uid;
          this.userType = userType;
          this.agencyId = agencyId

            this._stockService.getStockCapacitiesLocalAgency(this.agencyId).subscribe(stockCapacities => {
              this.stockCapacitiesIN = stockCapacities.filter(x => x.stockType == StockType.Agency);
              this.stockCapacitiesOUT = stockCapacities.filter(x => x.stockType == StockType.AgencyExternal);
              this.generateLocations();

              // Get notes
              stockCapacities.forEach(stockCapacity => {
                const stockCapacityNode = Constants.STOCK_CAPACITY_NODE_LOCAL_AGENCY
                  .replace('{agencyId}', this.agencyId)
                  .replace('{id}', stockCapacity.id);
                this._noteService.getNotes(stockCapacityNode).subscribe(notes => {
                  stockCapacity.notes = notes;

                  // Create the new note model for partner organisation
                  this.newNote[stockCapacity.id] = new NoteModel();
                  this.newNote[stockCapacity.id].uploadedBy = this.uid;
                });
              })
            });
        });
  }

  private initCountryOffice(){

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
          this.userAgencyId = agencyId;

          if (this.countryId && this.agencyId && this.isViewing) {
            this._stockService.getStockCapacities(this.countryId).subscribe(stockCapacities => {
              this.stockCapacitiesIN = stockCapacities.filter(x => x.stockType == StockType.Country);
              this.stockCapacitiesOUT = stockCapacities.filter(x => x.stockType == StockType.External);
              this.generateLocations();

              // Get notes
              stockCapacities.forEach(stockCapacity => {
                const stockCapacityNode = Constants.STOCK_CAPACITY_NODE
                  .replace('{countryId}', this.countryId)
                  .replace('{id}', stockCapacity.id);
                this._noteService.getNotes(stockCapacityNode).subscribe(notes => {
                  notes.forEach( note => {
                    if(this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)){
                      this.agencyService.getAgency(note.agencyId)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe( agency => {
                          note.agencyName = agency.name;
                        })
                    }
                  })
                  stockCapacity.notes = notes;

                  // Create the new note model for partner organisation
                  this.newNote[stockCapacity.id] = new NoteModel();
                  this.newNote[stockCapacity.id].uploadedBy = this.uid;
                });
              })
            });
          } else {
            this.countryId = countryId;
            this.agencyId = agencyId;

            this._stockService.getStockCapacities(this.countryId).subscribe(stockCapacities => {
              this.stockCapacitiesIN = stockCapacities.filter(x => x.stockType == StockType.Country);
              this.stockCapacitiesOUT = stockCapacities.filter(x => x.stockType == StockType.External);
              this.generateLocations();

              // Get notes
              stockCapacities.forEach(stockCapacity => {
                const stockCapacityNode = Constants.STOCK_CAPACITY_NODE
                  .replace('{countryId}', this.countryId)
                  .replace('{id}', stockCapacity.id);
                this._noteService.getNotes(stockCapacityNode).subscribe(notes => {
                  notes.forEach( note => {
                    if(this.agencyId && (note.agencyId && note.agencyId != this.agencyId) || !this.agencyId && (note.agencyId != this.userAgencyId)){
                      this.agencyService.getAgency(note.agencyId)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe( agency => {
                          note.agencyName = agency.name;
                        })
                    }
                  })
                  stockCapacity.notes = notes;

                  // Create the new note model for partner organisation
                  this.newNote[stockCapacity.id] = new NoteModel();
                  this.newNote[stockCapacity.id].uploadedBy = this.uid;
                });
              })
            });
            //     });
            // });
          }

          PageControlService.countryPermissionsMatrix(this.af, this.ngUnsubscribe, this.uid, userType, (isEnabled => {
            this.countryPermissionsMatrix = isEnabled;
          }));
        });

      });

  }

  goBack() {
    if (this.isLocalAgency) {
      this.router.navigateByUrl('/local-agency/profile/stock-capacity');
    }else{
      this.router.navigateByUrl('/country-admin/country-office-profile/stock-capacity');
    }
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

  addEditStockCapacity(stockType: StockType, stockCapacityId?: string) {
    console.log(stockType)
    if(this.isLocalAgency){
      if (stockCapacityId) {
        this.router.navigate(['/local-agency/profile/stock-capacity/add-edit-stock-capacity',
          {id: stockCapacityId, stockType: stockType}], {skipLocationChange: true});
      } else {
        this.router.navigate(['/local-agency/profile/stock-capacity/add-edit-stock-capacity',
          {stockType: stockType}], {skipLocationChange: true});
      }
    }else{
      if (stockCapacityId) {
        this.router.navigate(['/country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity',
          {id: stockCapacityId, stockType: stockType}], {skipLocationChange: true});
      } else {
        this.router.navigate(['/country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity',
          {stockType: stockType}], {skipLocationChange: true});
      }
    }
  }

  validateNote(note: NoteModel): boolean {
    this.alertMessage = note.validate();

    return !this.alertMessage;
  }

  addNote(stockCapacity: StockCapacityModel, note: NoteModel) {
    if (this.validateNote(note)) {
      note.agencyId = this.userAgencyId
      const stockCapacityNode = this.isLocalAgency ? Constants.STOCK_CAPACITY_NODE_LOCAL_AGENCY
        .replace('{agencyId}', this.agencyId)
        .replace('{id}', stockCapacity.id) :
        Constants.STOCK_CAPACITY_NODE
          .replace('{countryId}', this.countryId)
          .replace('{id}', stockCapacity.id);

      this._noteService.saveNote(stockCapacityNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
        .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
    }
  }

  editNote(stockCapacity: StockCapacityModel, note: NoteModel) {
    jQuery('#edit-action').modal('show');
    this.activeStockCapacity = stockCapacity;
    this.activeNote = note;
  }

  editAction(stockCapacity: StockCapacityModel, note: NoteModel) {
    this.closeEditModal();

    if(this.isLocalAgency){
      if (this.validateNote(note)) {
        const stockCapacityNode = Constants.STOCK_CAPACITY_NODE_LOCAL_AGENCY
          .replace('{agencyId}', this.agencyId)
          .replace('{id}', stockCapacity.id);
        this._noteService.saveNote(stockCapacityNode, note).then(() => {
          this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
        })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
      }
    }else{
      if (this.validateNote(note)) {
        const stockCapacityNode = Constants.STOCK_CAPACITY_NODE
          .replace('{countryId}', this.countryId)
          .replace('{id}', stockCapacity.id);
        this._noteService.saveNote(stockCapacityNode, note).then(() => {
          this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
        })
          .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
      }
    }
  }

  closeEditModal() {
    jQuery('#edit-action').modal('hide');
  }

  deleteNote(stockCapacity: StockCapacityModel, note: NoteModel) {
    jQuery('#delete-action').modal('show');
    this.activeStockCapacity = stockCapacity;
    this.activeNote = note;
  }

  deleteAction(stockCapacity: StockCapacityModel, note: NoteModel) {
    this.closeDeleteModal();

    const stockCapacityNode = this.isLocalAgency ? Constants.STOCK_CAPACITY_NODE_LOCAL_AGENCY
      .replace('{agencyId}', this.agencyId)
      .replace('{id}', stockCapacity.id) :
      Constants.STOCK_CAPACITY_NODE
        .replace('{countryId}', this.countryId)
        .replace('{id}', stockCapacity.id)

    this._noteService.deleteNote(stockCapacityNode, note)
      .then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_DELETED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'));
  }

  closeDeleteModal() {
    jQuery('#delete-action').modal('hide');
  }

  getUserName(userId) {
    let userName = "";

    this._userService.getUser(userId).subscribe(user => {
      userName = user.firstName + ' ' + user.lastName;
    });

    return userName;
  }

  generateLocations(){
    console.log(this.stockCapacitiesIN);

    this.jsonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE).subscribe((json) => {
      console.log(this.stockCapacitiesIN);
      this.stockCapacitiesIN.forEach(stockCapacity => {
        let obj = {
          country: "",
          areas: ""
        };
        if (stockCapacity.location && stockCapacity.location > -1) {
          obj.country = this.countries[stockCapacity.location];
        }
        if (stockCapacity.level1 && stockCapacity.level1 > -1) {
          obj.areas = ", " + json[stockCapacity.location].levelOneValues[stockCapacity.level1].value
        }
        if (stockCapacity.level2) {
          obj.areas = obj.areas + ", " + json[stockCapacity.location].levelOneValues[stockCapacity.level1].levelTwoValues[stockCapacity.level2].value;
        }
        this.locationObjs.push(obj);
      });
    });
  }
}
