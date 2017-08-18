import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {Constants} from "../../utils/Constants";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {RxHelper} from '../../utils/RxHelper';
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-status-alert',
  templateUrl: './status-alert.component.html',
  styleUrls: ['./status-alert.component.css']
})
export class StatusAlertComponent implements OnInit {
  private _show: boolean = false;
  @Input() message: string;
  @Input() success: boolean;
  @Output() onAlertHidden = new EventEmitter<boolean>();

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
  }


  @Input()
  set show(show: boolean) {
  	this._show = show;

    if (this._show)
  		TimerObservable.create(Constants.ALERT_DURATION).takeUntil(this.ngUnsubscribe).subscribe(t => {
  	      this._show = false;
  	      this.onAlertHidden.emit(true);
  	    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
