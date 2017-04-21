import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-response-plans',
  templateUrl: './response-plans.component.html',
  styleUrls: ['./response-plans.component.css']
})

export class ResponsePlansComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToNewOrEditPlan() {
    this.router.navigateByUrl('response-plans/create-edit-response-plan');
  }

}
