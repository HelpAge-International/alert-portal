import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp} from "angularfire2";
import {Router} from "@angular/router";
import {Constants} from "../../utils/Constants";
import {ActionType, ActionLevel, ActionStatus, SizeType, DocumentType} from "../../utils/Enums";
import {Observable, Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RxHelper} from '../../utils/RxHelper';
import {Frequency} from "../../utils/Frequency";
import * as firebase from 'firebase';
declare var jQuery: any;
import { MinimumPreparednessComponent } from '../minimum/minimum.component';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})
export class AdvancedPreparednessComponent extends MinimumPreparednessComponent implements OnInit {

	protected actionLevel = ActionLevel.APA;
  	firebase: any;

  	constructor(@Inject(FirebaseApp) firebaseApp: any, protected af: AngularFire, protected router: Router) {
  		super(firebaseApp, af, router);
		this.subscriptions = new RxHelper;
		this.firebase = firebaseApp;

		this.docFilterSubject = new BehaviorSubject(undefined);
		this.docFilter = {
			query: {
	          orderByChild: "module",
	          equalTo: this.docFilterSubject
	        }
		}
	}


}
