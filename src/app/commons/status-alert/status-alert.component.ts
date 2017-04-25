import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-status-alert',
  templateUrl: './status-alert.component.html',
  styleUrls: ['./status-alert.component.css']
})
export class StatusAlertComponent implements OnInit {
  private _show: boolean = false;
  @Input() message: string;
  @Input() success: boolean;

  constructor() {
  }

  @Input()
  set show(show: boolean) {
    this._show = show;
  }

  ngOnInit() {
  }

  cancelChanges(){
  	this.show = false;
  }

}
