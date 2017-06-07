import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-director-overview',
  templateUrl: './director-overview.component.html',
  styleUrls: ['./director-overview.component.css']
})
export class DirectorOverviewComponent implements OnInit {

  private menuTab = "officeProfile";

  constructor() { }

  ngOnInit() {
  }

  menuSelection(menuName:string) {
    console.log(menuName);
  }

}
