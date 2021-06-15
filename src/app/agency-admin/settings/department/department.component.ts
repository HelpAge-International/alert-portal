
import {timer as observableTimer, Observable, Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/database";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {UserType} from "../../../utils/Enums";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ModelDepartment} from "../../../model/department.model";
import {UserService} from "../../../services/user.service";
import {GenericActionModel} from "../../../network-admin/network-mpa/network-add-generic-action/generic-action.model";
import {Action} from "../../../model/action";
import {ModelCountryOffice} from "../../../model/countryoffice.model";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent implements OnInit, OnDestroy {

  private uid: string = "";
  private agencyId: string;
  private deleting: boolean = false;
  private editing: boolean = false;
  private saved: boolean = false;
  private departmentName: string = "";
  private deleteCandidates: any = {};
  private depts: ModelDepartmentCanDelete[] = [];
  private editDepts: ModelDepartment[] = [];
  private UserType = UserType;
  private userType: number;
  public canDeleteItem: Map<string, boolean> = new Map<string, boolean>();
  private alerts = {};
  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;

  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() isLocalAgency: boolean;
  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private afd: AngularFireDatabase, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.userType = userType;
      if(this.isLocalAgency){
        this.initDepartmentsLocalAgency();
      } else{
        this.initDepartments();
      }

    });
  }

  ngOnDestroy() {
    try {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    } catch (e) {
      console.log('Unable to releaseAll');
    }
  }

  private initDepartments() {
    this.afd.object<any>(Constants.APP_STATUS + "/administratorAgency/" + this.uid)
      .snapshotChanges()
      .map((val) => {
        console.log(val.payload.val());
        return val.payload.val().agencyId;
      })
      .flatMap((agencyId: string) => {
        this.agencyId = agencyId;
        console.log(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments");
        return this.afd.object<ModelDepartment>(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments").snapshotChanges();
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((snapshot) => {
        this.depts = [];
        this.editDepts = [];
        console.log(snapshot.payload.val());
        let x: ModelDepartmentCanDelete = new ModelDepartmentCanDelete(snapshot.key, snapshot.payload.val().name);
        this.depts.push(x);
        let y: ModelDepartment = new ModelDepartment();
        y.id = snapshot.key;
        y.name = snapshot.payload.val().name;
        this.editDepts.push(y);
        this.initCanDeleteDepartments();
      });
  }

  private initDepartmentsLocalAgency() {
    this.afd.object<any>(Constants.APP_STATUS + "/administratorLocalAgency/" + this.uid)
      .snapshotChanges()
      .map((val) => {
        console.log(val.payload.val());
        return val.payload.val().agencyId;
      })
      .flatMap((agencyId:string) => {
        this.agencyId = agencyId;
        console.log(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments");
        return this.afd.object<ModelDepartment>(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments").snapshotChanges();
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((snap) => {
        this.depts = [];
        this.editDepts = [];
        console.log(snap.payload.val());
          let x: ModelDepartmentCanDelete = new ModelDepartmentCanDelete(snap.key, snap.payload.val().name);
          this.depts.push(x);
          let y: ModelDepartment = new ModelDepartment();
          y.id = snap.key;
          y.name = snap.payload.val().name;
          this.editDepts.push(y);
        this.initCanDeleteDepartments();
      });
  }

  private initCanDeleteDepartments() {
    this.afd.list<Action>(Constants.APP_STATUS + "/actionMandated/" + this.agencyId)
      .snapshotChanges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((snap) => {
        snap.forEach((snapshot) => {
          if (snapshot.payload.val().hasOwnProperty('department')) {
            this.canDeleteItem.set(snapshot.payload.val().department, true);
          }
        });
      });
    this.afd.list<ModelCountryOffice>(Constants.APP_STATUS + "/countryOffice/" + this.agencyId)
      .snapshotChanges()
      .map((snap) => {
        let ids: string[] = [];
        for (let x of snap) {
          ids.push(x.key);
        }
        return ids;
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((countryOffices) => {
        console.log(countryOffices);
        for (let x of countryOffices) {
          this.afd.list<Action>(Constants.APP_STATUS + "/action/" + x)
            .snapshotChanges()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((snap) => {
              for (let x of snap) {
                if (x.payload.val().hasOwnProperty('department')) {
                  this.canDeleteItem.set(x.payload.val().department, true);
                }
              }
            });
        }
      });
  }

  deleteDepartments() {
    this.deleting = !this.deleting;
    console.log(this.canDeleteItem);
    console.log(this.canDeleteItem.get('Dep21'));
  }

  cancelDeleteDepartments() {
    this.deleting = !this.deleting;
    this.deleteCandidates = {};
  }

  deleteSelectedDepartments() {
    this.deleting = !this.deleting;
    for (let x in this.deleteCandidates) {
      this.afd.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments/" + x).set(null).then(_ => {
          if (!this.alertShow){
            this.saved = true;
            this.alertSuccess = true;
            this.alertShow = true;
            this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_REMOVED_SUCCESS";
          }
        })
        .catch(_ => {
          if (!this.alertShow){
            this.saved = true;
            this.alertSuccess = false;
            this.alertShow = true;
            this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_DELETING_ERROR";
          }
        });
    }
    // for (var item in this.deleteCandidates)
    //   this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments/' + item)
    // .remove()
    // .then(_ => {
    //   if (!this.alertShow){
    //     this.saved = true;
    //     this.alertSuccess = true;
    //     this.alertShow = true;
    //     this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_REMOVED_SUCCESS";
    //   }
    // })
    // .catch(err => console.log(err, 'You do not have access!'));
  }

  onDepartmentSelected(department) {
    if (department in this.deleteCandidates)
      delete this.deleteCandidates[department];
    else
      this.deleteCandidates[department] = true;
  }

  flipEditDepartments() {
    this.editing = !this.editing;
  }

  saveEditedDepartments() {
    let temps: ModelDepartmentCanDelete[] = [];
    for (let x of this.depts) {
      temps.push(new ModelDepartmentCanDelete(x.id, x.name));
    }
    for (let i = 0; i < temps.length; i++) {
      // A change has happened! Update this item
      let updateObj = {
        name: temps[i].name
      };
      this.afd.object(Constants.APP_STATUS + '/agency/' + this.agencyId + "/departments/" + temps[i].id).update(updateObj).then(_ => {
        if (!this.alertShow){
          this.flipEditDepartments();
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_SAVED_SUCCESS";
        }
      });
    }
  }

  addDepartment() {

    if (this.validateNewDepartment()) {
      let updateObj = {
        name: this.departmentName
      };
      this.afd.list(Constants.APP_STATUS + '/agency/' + this.agencyId + '/departments').push(updateObj).then(_ => {
        if (!this.alertShow){
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";
        }
        this.departmentName = "";
      });
    } else {
      this.showAlert();
    }
  }

  private showAlert() {

    this.newDepartmentErrorInactive = false;
    observableTimer(Constants.ALERT_DURATION).pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.newDepartmentErrorInactive = true;
    });
  }

  /**
   * Returns false and specific error messages-
   * @returns {boolean}
   */
  private validateNewDepartment() {

    this.alerts = {};

    if (!(this.departmentName)) {
      this.alerts[this.departmentName] = true;
      this.alertSuccess = false;
      this.alertShow = true;
      this.alertMessage = "AGENCY_ADMIN.MANDATED_PA.NO_DEPARTMENT_NAME";
      return false;
    }
    return true;
  }

  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }
}

export class ModelDepartmentCanDelete {
  public canDelete: boolean = false;
  public id: string;
  public name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
