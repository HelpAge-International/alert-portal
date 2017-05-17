import {Component, OnInit} from '@angular/core';
import {Indicator} from "../../model/indicator";
import {AlertLevels, GeoLocation, Countries} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {RxHelper} from "../../utils/RxHelper";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";

@Component({
    selector: 'app-add-indicator',
    templateUrl: './add-indicator.component.html',
    styleUrls: ['./add-indicator.component.css']
})
export class AddIndicatorRiskMonitoringComponent implements OnInit {

    public uid: string;

    public indicatorData: any;

    private alertLevels = Constants.ALERT_LEVELS;
    private alertColors = Constants.ALERT_COLORS;
    private alertLevelsList: number[] = [AlertLevels.Green, AlertLevels.Amber, AlertLevels.Red];

    private geoLocation = Constants.GEO_LOCATION;
    private geoLocationList: number[] = [GeoLocation.national, GeoLocation.subnational];


    private countries = Constants.COUNTRIES;
    private countriesList = Object.keys(Countries).map(k => Countries[k]).filter(v => typeof v === "string") as string[];

    constructor(private subscriptions: RxHelper, private af: AngularFire, private router: Router) {
        this.indicatorData = new Indicator();
        this.addAnotherSource();
        this.addAnotherLocation();
    }

    ngOnInit() {
        let subscription = this.af.auth.subscribe(auth => {
            if (auth) {
                this.uid = auth.uid;
            } else {
                this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    }

    stateGeoLocation(event: any) {
        var geoLocation = parseInt(event.target.value);
        this.indicatorData.geoLocation = geoLocation;
        console.log(this.indicatorData);

    }


    addAnotherSource() {
        var indicatorSource = new Array();
        indicatorSource['name'] = '';
        indicatorSource['link'] = '';
        this.indicatorData.source.push(indicatorSource);
    }

    addAnotherLocation() {
        var locations = new Array();
        locations['level1location'] = '';
        locations['level2location'] = '';
        this.indicatorData.affectedLocation.push(locations);
    }
    
    setCountryValue(locationKey: number, event: any) {
        
        
        //console.log(event.target.value);
        
        this.indicatorData.affectedLocation[locationKey]['level1location'] = event.target.value;
        
        console.log(this.indicatorData);
    }

 
    private navigateToLogin() {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
    }

}
