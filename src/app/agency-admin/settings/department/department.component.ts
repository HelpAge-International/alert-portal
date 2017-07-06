import {Component, OnDestroy, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
import Promise = firebase.Promise;
import {ModelDepartment} from "../../../model/department.model";
import {UserService} from "../../../services/user.service";

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
  public canDeleteItem: Map<string, boolean> = new Map<string, boolean>();
  private alerts = {};
  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;

  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.initDepartments();
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
    this.af.database.object(Constants.APP_STATUS + "/administratorAgency/" + this.uid, {preserveSnapshot: true})
      .map((val) => {
        console.log(val.val());
        return val.val().agencyId;
      })
      .flatMap((agencyId) => {
        this.agencyId = agencyId;
        console.log(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments");
        return this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true});
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snapshot) => {
        this.depts = [];
        this.editDepts = [];
        console.log(snapshot.val());
        snapshot.forEach((snap) => {
          let x: ModelDepartmentCanDelete = new ModelDepartmentCanDelete(snap.key, snap.val().name);
          this.depts.push(x);
          let y: ModelDepartment = new ModelDepartment();
          y.id = snap.key;
          y.name = snap.val().name;
          this.editDepts.push(y);
        });
        this.initCanDeleteDepartments();
      });
  }

  private initCanDeleteDepartments() {
    // TODO: Agency Mandated Departments
    // TODO: Delete all actions because I deleted the ones that weren't assigned
    this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyId, {preserveSnapshot: true})
      .map((snap) => {
        let ids: string[] = [];
        for (let x of snap) {
          ids.push(x.key);
        }
        return ids;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe((countryOffices) => {
        console.log(countryOffices);
        for (let x of countryOffices) {
          this.af.database.list(Constants.APP_STATUS + "/action/" + x, {preserveSnapshot: true})
            .takeUntil(this.ngUnsubscribe)
            .subscribe((snap) => {
              for (let x of snap) {
                if (x.val().hasOwnProperty('department')) {
                  console.log("Marking " + x.val().department + " as true");
                  this.canDeleteItem.set(x.val().department, true);
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
      this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments/" + x).set(null).then(_ => {
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
      this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId + "/departments/" + temps[i].id).update(updateObj).then(_ => {
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
      this.af.database.list(Constants.APP_STATUS + '/agency/' + this.uid + '/departments').push(updateObj).then(_ => {
        if (!this.alertShow){
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_NEW_SUCCESS";
        }
        this.departmentName = "";
      });
    } else {
      this.showAlert();
    }
  }

  private showAlert() {

    this.newDepartmentErrorInactive = false;
    Observable.timer(Constants.ALERT_DURATION)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
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
