
import {timer as observableTimer} from 'rxjs';

import {takeUntil} from 'rxjs/operators/takeUntil';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserType} from "../../../utils/Enums";
import {ModelDepartmentCanDelete} from "../../../agency-admin/settings/department/department.component";
import {ModelDepartment} from "../../../model/department.model";
import {Observable, Subject} from "rxjs";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFire} from "angularfire2";
import {Constants} from "../../../utils/Constants";
import {SettingsService} from "../../../services/settings.service";
import {AlertMessageModel} from "../../../model/alert-message.model";

@Component({
  selector: 'app-country-departments',
  templateUrl: './country-departments.component.html',
  styleUrls: ['./country-departments.component.scss']
})
export class CountryDepartmentsComponent implements OnInit, OnDestroy {

  // Models
  // private alertMessage = null
  private deleting: boolean;
  private depts = [];
  public agencyDepts = [];

  //copied over
  private uid: string = "";
  private agencyId: string;
  private editing: boolean = false;
  private saved: boolean = false;
  private departmentName: string = "";
  private deleteCandidates: any = {};
  private editDepts: ModelDepartment[] = [];
  public canDeleteItem: Map<string, boolean> = new Map<string, boolean>();
  private alerts = {};
  private newDepartmentErrorInactive: boolean = true;
  private newDepartmentErrorMessage: string;

  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private countryId: string;
  private UserType: UserType;
  private systemId: string;

  constructor(private pageControl: PageControlService,
              private route: ActivatedRoute,
              private af: AngularFire,
              private settingService: SettingsService,
              private router: Router) {
  }

  ngOnInit() {
    this.pageControl.authUser(this.ngUnsubscribe, this.route, this.router, (user, userType, countryId, agencyId, systemId) => {
      this.uid = user.uid;
      this.UserType = userType;
      this.countryId = countryId;
      this.agencyId = agencyId;
      this.systemId = systemId;
      this.initDepartments();
      this.initAgencyDepartments();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initDepartments() {

    this.settingService.getCountryLocalDepartments(this.agencyId, this.countryId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(departments => {
        console.log(departments)
        this.depts = departments
        this.editDepts = departments
        this.initCanDeleteDepartments()
      })
  }

  private initAgencyDepartments(){
    this.af.database.object(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snapshot) => {
        console.log(snapshot.val());
        snapshot.forEach((snap) => {
          let x: ModelDepartmentCanDelete = new ModelDepartmentCanDelete(snap.key, snap.val().name);
          this.agencyDepts.push(x);

        });
      })
  }

  private initCanDeleteDepartments() {
    this.af.database.list(Constants.APP_STATUS + "/action/" + this.countryId, {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe((snap) => {
        for (let x of snap) {
          if (x.val().hasOwnProperty('department')) {
            this.canDeleteItem.set(x.val().department, true);
          }
        }
      });
  }

  deleteDepartments() {
    this.deleting = !this.deleting;
  }

  cancelDeleteDepartments() {
    this.deleting = !this.deleting;
    this.deleteCandidates = {};
  }

  deleteSelectedDepartments() {
    this.deleting = !this.deleting;
    for (let x in this.deleteCandidates) {
      this.af.database.object(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId + "/departments/" + x).set(null).then(_ => {
        if (!this.alertShow) {
          this.saved = true;
          this.alertSuccess = true;
          this.alertShow = true;
          this.alertMessage = "AGENCY_ADMIN.SETTINGS.DEPARTMENTS.DEPARTMENT_REMOVED_SUCCESS";
        }
      })
        .catch(_ => {
          if (!this.alertShow) {
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
      this.af.database.object(Constants.APP_STATUS + '/countryOffice/' + this.agencyId + "/" + this.countryId + "/departments/" + temps[i].id).update(updateObj).then(_ => {
        if (!this.alertShow) {
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
    if(this.depts.filter(x => x.name == this.departmentName).length > 0 || this.agencyDepts.filter(x => x.name == this.departmentName).length > 0){
      this.alertSuccess = false;
      this.alertShow = true;
      this.alertMessage = "Department already exists!";
    } else {
      if (this.validateNewDepartment()) {
        //check name in agency
        this.af.database.list(Constants.APP_STATUS + "/agency/" + this.agencyId + "/departments", {
          query: {
            orderByChild: "name",
            equalTo: this.departmentName.trim()
          }
        })
          .first()
          .subscribe(departments => {
            if (departments.length == 0) {

              //check name in country level
              this.af.database.list(Constants.APP_STATUS + "/countryOffice/" + this.agencyId + "/" + this.countryId + "/departments", {
                query: {
                  orderByChild: "name",
                  equalTo: this.departmentName.trim()
                }
              })
                .first()
                .subscribe(depts =>{
                  if (depts.length == 0) {

                    let updateObj = {
                      name: this.departmentName.trim()
                    };
                    this.af.database.list(Constants.APP_STATUS + '/countryOffice/' + this.agencyId + '/' + this.countryId + '/departments').push(updateObj).then(_ => {
                      if (!this.alertShow) {
                        this.saved = true;
                        this.alertSuccess = true;
                        this.alertShow = true;
                        this.alertMessage = "AGENCY_ADMIN.MANDATED_PA.NEW_DEPARTMENT_SUCCESS";
                      }
                      this.departmentName = "";
                    });

                  } else {
                    this.alertSuccess = false;
                    this.alertShow = true;
                    this.alertMessage = "Department name already exists in this country!";
                  }
                })
            } else {
              console.log("name already exist")
              this.alertSuccess = false;
              this.alertShow = true;
              this.alertMessage = "Department name already exists in agency!";
            }
          })

      } else {
        this.showAlert();
      }
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
