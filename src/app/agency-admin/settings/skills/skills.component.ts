import { Component, OnInit, OnDestroy } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {Observable} from 'rxjs';
import {RxHelper} from '../../../utils/RxHelper';
import Promise = firebase.Promise;
import {SkillType} from "../../../utils/Enums";

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnDestroy {

  private uid: string = "qbyONHp4xqZy2eUw0kQHU7BAcov1";//TODO remove hard coded agency ID
  private skillsObservable: FirebaseListObservable<any>;
  private subscriptions: RxHelper;
  private deleting: boolean = false;
  private editing: boolean = false;
  private skillName: string[] = [];
  private deleteCandidates: any = {};
  private skills: any = [];
  private editedSkills: any = [];
  private SupportSkill = SkillType.Support;
  private TechSkill = SkillType.Tech;

  constructor(private af: AngularFire, private router: Router) {
    this.subscriptions = new RxHelper;
  }


  ngOnInit() {
  	let subscription = this.af.auth.subscribe(auth => {
      if (auth) {
      	// console.log(this.skills);
        // this.uid = auth.uid; //TODO remove comment
        let skillsSubscription = this.af.database.list(Constants.APP_STATUS+'/agency/' + this.uid + '/skills').subscribe(_ => {
        	// this.skills = _;
        	
        	this.skills = [];
        	_.filter(skill => skill.$value).map(skill => {
        		this.subscriptions.add(this.af.database.list(Constants.APP_STATUS + '/skill/', {
			      query: {
			        orderByKey: true,
			        equalTo: skill.$key
			      }
			    }).subscribe(_skill => {
        			this.skills.push(_skill[0]);
        			console.log(this.skills);
        		}));
        	});
			Object.keys(_.filter(skl => skl.$value)).forEach((skill) => {
				// console.log(skill);
				
			});        		
        })
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

  deleteSkills(event){
  	this.deleting = !this.deleting;
  }

  cancelDeleteSkills(event){
  	this.deleting = !this.deleting;
  	this.deleteCandidates = {};
  }

  deleteSelectedSkills(event){
  	for(var item in this.deleteCandidates)
  		this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/skills/' + item).remove();
  }

  onSkillSelected(skill){
  	if (skill in this.deleteCandidates)
    	delete this.deleteCandidates[skill];
	else
		this.deleteCandidates[skill] = true;
  }

  editSkills(event){
  	this.editing = !this.editing;
  }

  cancelEditSkills(event){
  	this.editing = !this.editing;
  	// this.editDepts = {};
  	// this.deleteCandidates = {};
  	// let deptsSubscription = this.af.database.object(Constants.APP_STATUS+'/agency/' + this.uid + '/skills').subscribe(_ => {
   //  	this.depts = _;
   //  })
   //  this.subscriptions.add(deptsSubscription);
  }

  saveEditedSkills(event){
  	this.editing = !this.editing;

  	for (let skill in this.editedSkills){
  		this.af.database.object(Constants.APP_STATUS + '/skill/' + skill).update(this.editedSkills[skill]);	
  	}
  }

  setSkillValue(prop, value){
  	this.editedSkills[prop] = {name: value};
  }

  addSkill(event, type) {
  	let skill = {name:this.skillName[type], type:type};

  	this.af.database.list(Constants.APP_STATUS + '/skill/').push(
			skill
	).then((item) => { 
		let key = item.key;
		let agencySkills = this.af.database.object(Constants.APP_STATUS + '/agency/' + this.uid + '/skills/' + key).set(true);
	});
	
  	this.skillName = []; 	
  }
}
