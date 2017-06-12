import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-director-menu',
  templateUrl: './director-menu.component.html',
  styleUrls: ['./director-menu.component.css']
})
export class DirectorMenuComponent implements OnInit {

  constructor(private route: Router) {
  }

  ngOnInit() {
  }

  toMap() {
    this.route.navigate(["/map", {"isDirector": true}]);
  }

}
