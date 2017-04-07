import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from 'rxjs';
import {RxHelper} from '../../../utils/RxHelper';
import Promise = firebase.Promise;


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit, OnDestroy {

  private uid: string = "qbyONHp4xqZy2eUw0kQHU7BAcov1";//TODO remove hard coded agency ID
  private departments: FirebaseListObservable<any>;
  private subscriptions: RxHelper;
  private deleting: boolean = false;
  private departmentName: string = "";
  private deleteCandidates: any = {};

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper;
  }

  ngOnInit() {

    let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        // this.uid = auth.uid; //TODO remove comment
        this.departments = this.af.database.list(Constants.APP_STATUS+'/agency/' + this.uid + '/departments');

      } else {
        // user is not logged in
        console.log('Error occurred - User is not logged in');
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {

  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  deleteDepartments(event){
  	this.deleting = !this.deleting;
  }

  cancelDeleteDepartments(event){
  	this.deleting = !this.deleting;
  }

  deleteSelectedDepartments(event){
  	console.log("delete selected");

  	for(var item in this.deleteCandidates)
  		this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments/' + item).remove();
  }

  onDepartmentSelected(department){
  	if (department.$key in this.deleteCandidates)
    	delete this.deleteCandidates[department.$key];
	else
		this.deleteCandidates[department.$key] = true;
  		
	
	console.log(this.deleteCandidates);
  }

  addDepartment(event) {
  	console.log(this.departmentName);
  	let departments = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/departments');

	var newDepartment = {};
  	newDepartment[this.departmentName] = true;
  	departments.update(newDepartment);

  	this.departmentName = "";
  }

}
