import {Component, OnInit, OnDestroy} from '@angular/core';
import {RxHelper} from "../../../utils/RxHelper";
import {AngularFire} from "angularfire2";
import {Router, ActivatedRoute} from "@angular/router";
import {Constants} from "../../../utils/Constants";
import {PersonTitle} from "../../../utils/Enums";

@Component({
  selector: 'app-create-edit-staff',
  templateUrl: 'create-edit-staff.component.html',
  styleUrls: ['create-edit-staff.component.css']
})
export class CreateEditStaffComponent implements OnInit,OnDestroy {
  subscriptions: RxHelper;
  PERSON_TITLE = Constants.PERSON_TITLE;
  PERSON_TITLE_SELECTION = Constants.PERSON_TITLE_SELECTION;
  title: number;
  firstName: string;
  lastName: string;
  userType: number;
  countryOffice: string;
  position: number;
  officeType: number;
  email: string;
  phone: string;
  trainingNeeds: string;
  notifications: number[] = [];
  isResponseMember: boolean;


  constructor(private af: AngularFire, private router: Router, private route: ActivatedRoute) {
    this.subscriptions = new RxHelper();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.releaseAll();
  }

  submit() {
    console.log("submit")
  }

  cancel() {
    this.router.navigateByUrl(Constants.AGENCY_ADMIN_STARFF);
  }
}
