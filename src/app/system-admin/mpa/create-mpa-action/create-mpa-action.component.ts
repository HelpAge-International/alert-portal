import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-mpa-action',
  templateUrl: './create-mpa-action.component.html',
  styleUrls: ['./create-mpa-action.component.css']
})
export class CreateMpaActionComponent implements OnInit {
  actionDetail: string;
  mpa: boolean = true;

  constructor(private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
  }

  selectMpa() {
    console.log()
  }

  selectApa() {
    console.log()
  }

  back() {
    this.router.navigateByUrl("/system-admin/mpa")
  }

}
