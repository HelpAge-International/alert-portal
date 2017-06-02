import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";
@Component({
    selector: 'app-country-admin-menu',
    templateUrl: './country-admin-menu.component.html',
    styleUrls: ['./country-admin-menu.component.css']
})
export class CountryAdminMenuComponent implements OnInit {

    private isAnonym: boolean = false;

    constructor(private af: AngularFire) {}

    ngOnInit() {
        this.af.auth.subscribe(user => {
            this.isAnonym = user.anonymous ? user.anonymous : false;
        });
    }

}
