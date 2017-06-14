import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from '../../../utils/Constants';
import { AlertMessageType, StockType } from '../../../utils/Enums';
import { RxHelper } from '../../../utils/RxHelper';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { AlertMessageModel } from '../../../model/alert-message.model';
import { DisplayError } from "../../../errors/display.error";
import { UserService } from "../../../services/user.service";
import { StockCapacityModel } from "../../../model/stock-capacity.model";
import { StockService } from "../../../services/stock.service";
import { NoteModel } from "../../../model/note.model";
import { NoteService } from "../../../services/note.service";
declare var jQuery: any;

@Component({
  selector: 'app-country-office-stock-capacity',
  templateUrl: './stock-capacity.component.html',
  styleUrls: ['./stock-capacity.component.css']
})

export class CountryOfficeStockCapacityComponent implements OnInit, OnDestroy {
  private isEdit = false;
  private canEdit = true; // TODO check the user type and see if he has editing permission
  private uid: string;
  private countryId: string;
  private agencyId: string;

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
   
  constructor(private _userService: UserService,
              private _stockService: StockService,
              private _noteService: NoteService,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptions: RxHelper) {
                this.newNote = [];
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
        this.agencyId = Object.keys(countryAdminUser.agencyAdmin)[0];

        this._stockService.getStockCapacities(this.agencyId, this.countryId).subscribe(stockCapacities => {
            this.stockCapacitiesIN = stockCapacities.filter(x => x.type == StockType.Country);
            this.stockCapacitiesOUT = stockCapacities.filter(x => x.type == StockType.External);
            
            // Get notes
            stockCapacities.forEach(stockCapacity => {
              const stockCapacityNode = Constants.STOCK_CAPACITY_NODE
                                                    .replace('{agencyId}', this.agencyId)
                                                    .replace('{countryId}', this.countryId)
                                                    .replace('{id}', stockCapacity.id);
              this._noteService.getNotes(stockCapacityNode).subscribe(notes => {
                      stockCapacity.notes = notes;

                      // Create the new note model for partner organisation
                      this.newNote[stockCapacity.id] = new NoteModel();
                      this.newNote[stockCapacity.id].uploadedBy = this.uid;
                    });
            })
        })
      });
    });
    this.subscriptions.add(authSubscription);
  }

  goBack() {
    this.router.navigateByUrl('/country-admin/country-office-profile/stock-capacity');
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
    if(stockCapacityId)
    {
      this.router.navigate(['/country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity',
                                  {id: stockCapacityId, stockType: stockType}], {skipLocationChange: true});
    }else{
      this.router.navigate(['/country-admin/country-office-profile/stock-capacity/add-edit-stock-capacity',
                                  {stockType: stockType}], {skipLocationChange: true});
    }
  }

  validateNote(note: NoteModel): boolean {
    this.alertMessage = note.validate();

    return !this.alertMessage;
  }

  addNote(stockCapacity: StockCapacityModel, note: NoteModel)
  {
    if(this.validateNote(note))
    {
      const stockCapacityNode = Constants.STOCK_CAPACITY_NODE
                                                    .replace('{agencyId}', this.agencyId)
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

    if(this.validateNote(note))
    {
      const stockCapacityNode = Constants.STOCK_CAPACITY_NODE
                                                    .replace('{agencyId}', this.agencyId)
                                                    .replace('{countryId}', this.countryId)
                                                    .replace('{id}', stockCapacity.id);
      this._noteService.saveNote(stockCapacityNode, note).then(() => {
        this.alertMessage = new AlertMessageModel('NOTES.SUCCESS_SAVED', AlertMessageType.Success);
      })
      .catch(err => this.alertMessage = new AlertMessageModel('GLOBAL.GENERAL_ERROR'))
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

    const stockCapacityNode = Constants.STOCK_CAPACITY_NODE
                                                    .replace('{agencyId}', this.agencyId)
                                                    .replace('{countryId}', this.countryId)
                                                    .replace('{id}', stockCapacity.id);

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
}