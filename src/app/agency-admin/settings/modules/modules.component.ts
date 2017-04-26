import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from 'rxjs';
import {RxHelper} from '../../../utils/RxHelper';
import {Privacy} from "../../../utils/Enums";

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit, OnDestroy {

  MODULE_NAME = Constants.MODULE_NAME;
  private Public = Privacy.Public;
  private Private = Privacy.Private;
  private Network = Privacy.Network;

  private uid: string = "";
  private subscriptions: RxHelper;
  private modules: any[] = [];
  private saved: boolean = false;

  private alertMessage: string = "Message";
  private alertSuccess: boolean = true;
  private alertShow: boolean = false;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper;
  }

  ngOnInit() {
  	let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        let skillsSubscription = this.af.database.list(Constants.APP_STATUS+'/module/' + this.uid).subscribe(_ => {
        	this.modules = _;
        	_.map(module => {
        	});
        });

        this.subscriptions.add(skillsSubscription);
		this.subscriptions.add(subscription);
      } else {
        // user is not logged in
        console.log('Error occurred - User is not logged in');
        this.navigateToLogin();
      }
    });
  }

  ngOnDestroy() {
	try{
  		this.subscriptions.releaseAll();
  	} catch(e){
  		console.log('Unable to releaseAll');
  	}
  }

  private navigateToLogin() {
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private changePrivacy(moduleId, privacy) {
  	this.modules[moduleId].privacy = privacy;
  }

  private changeStatus(moduleId, status) {
  	this.modules[moduleId].status = status;
  }

  private cancelChanges() {
	  this.ngOnInit();
  }

  private saveChanges(){
  	var moduleItems = {};
  	var modules = this.modules.map((module, index) => {
  		
  		moduleItems[index] = this.modules[index];
  		
  		return this.modules[index];
  	});

  	this.af.database.list(Constants.APP_STATUS+'/module/')
  	.update(this.uid, moduleItems)
  	.then(_ => {
      if (!this.alertShow){
        this.saved = true;
        this.alertSuccess = true;
        this.alertShow = true;
        this.alertMessage = "Module Settings succesfully saved!"
      }
    })
  	.catch(err => console.log(err, 'You do not have access!'));
  }


  onAlertHidden(hidden: boolean) {
    this.alertShow = !hidden;
    this.alertSuccess = true;
    this.alertMessage = "";
  }

}
