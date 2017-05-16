import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {Constants} from "../../utils/Constants";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {RxHelper} from '../../utils/RxHelper';

@Component({
  selector: 'app-status-alert',
  templateUrl: './status-alert.component.html',
  styleUrls: ['./status-alert.component.css']
})
export class StatusAlertComponent implements OnInit {
  private _show: boolean = false;
  private _subscriptions: RxHelper;
  @Input() message: string;
  @Input() success: boolean;
  @Output() onAlertHidden = new EventEmitter<boolean>();

  constructor() {
  	this._subscriptions = new RxHelper;
  }


  @Input()
  set show(show: boolean) {
  	this._show = show;

  	this._subscriptions.add(
		TimerObservable.create(Constants.ALERT_DURATION).subscribe(t => {
	      this._show = false;
	      this.onAlertHidden.emit(true);
	    })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
	try{
		this._subscriptions.releaseAll();
	} catch(e){
		console.log('Unable to releaseAll');
	}
  }

}
