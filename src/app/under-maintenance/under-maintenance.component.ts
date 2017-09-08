import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Constants} from "../utils/Constants";

@Component({
  selector: 'app-under-maintenance',
  templateUrl: './under-maintenance.component.html',
  styleUrls: ['./under-maintenance.component.css']
})
export class UnderMaintenanceComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if (!Constants.SHOW_MAINTENANCE_PAGE) {
      this.router.navigateByUrl("/login");
    }
  }

}
