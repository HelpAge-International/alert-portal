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
  private depts: ModelDepartment[] = [];
  private editDepts: ModelDepartment[] = [];
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
              let x: ModelDepartment = new ModelDepartment();
              x.id = snap.key;
              x.name = snap.val().name;
              this.depts.push(x);
              this.editDepts.push(x);
            });
          });
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

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  deleteDepartments(event) {
    this.deleting = !this.deleting;
  }

  cancelDeleteDepartments(event) {
    this.deleting = !this.deleting; 
    this.deleteCandidates = {};
  }

  deleteSelectedDepartments(event) {
    this.deleting = !this.deleting;

    for (var item in this.deleteCandidates)
      this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments/' + item)
    .remove()
    .then(_ => {
      if (!this.alertShow){
        this.saved = true;
        this.alertSuccess = true;
        this.alertShow = true;
        this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_REMOVED_SUCCESS";
      }
    })
    .catch(err => console.log(err, 'You do not have access!'));
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
    console.log("Edited Departments");
    console.log("HERE!");

    console.log(this.depts);
    console.log(this.editDepts);
    for (let i = 0; i < this.depts.length; i++) {
      console.log("A:" + this.depts[i].name);
      console.log("E:" + this.editDepts[i].name);
      if (this.editDepts[i].name != this.depts[i].name) {
        // A change has happened! Update this item
        let updateObj = {
          name: this.depts[i].name
        };
        this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyId + "/departments/" + this.depts[i].id).update(updateObj).then(_ => {
          if (!this.alertShow){
            this.saved = true;
            this.alertSuccess = true;
            this.alertShow = true;
            this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_SAVED_SUCCESS";
          }
        });
      }
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
