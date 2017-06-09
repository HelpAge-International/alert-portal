import {Component, Inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/platform-browser";

@Component({
  selector: 'app-director-menu',
  templateUrl: './director-menu.component.html',
  styleUrls: ['./director-menu.component.css']
})
export class DirectorMenuComponent implements OnInit {

  constructor(private route: Router, @Inject(DOCUMENT) private document: any) {
    console.log(this.document.location.href);
  }

  ngOnInit() {
  }

  toMap() {
    this.route.navigate(["/map", {"isDirector": true}]);
  }
}
