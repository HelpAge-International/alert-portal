import { Component, OnInit } from '@angular/core';
import {Constants} from "../../../utils/Constants";
import {Subject} from "rxjs/Subject";
import {PageControlService} from "../../../services/pagecontrol.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'app-system-settings-coc',
  templateUrl: './system-settings-coc.component.html',
  styleUrls: ['./system-settings-coc.component.scss']
})
export class SystemSettingsCocComponent implements OnInit {

  private isEditing: boolean = false;
  private cocText: string = "";
  private uid: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private pageControl: PageControlService, private route: ActivatedRoute, private af: AngularFire, private router: Router) {
  }

  ngOnInit() {
    this.pageControl.auth(this.ngUnsubscribe, this.route, this.router, (user, userType) => {
      this.uid = user.uid;
      this.downloadCoC();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private downloadCoC(){
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid)
      .takeUntil(this.ngUnsubscribe).subscribe(x => {
      this.cocText = x.coc;
    });
  }

  edit(event) {
    this.isEditing = true;
  }

  cancelEdit(event) {
    this.isEditing = false;
  }

  saveEdited() {
    this.isEditing = false;
    this.af.database.object(Constants.APP_STATUS + "/system/" + this.uid +"/coc").set(this.cocText);
  }
}
