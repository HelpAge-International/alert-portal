import {Component, OnInit} from '@angular/core';
import {AlertLevels, Country, DurationType, HazardScenario, AlertMessageType} from "../../utils/Enums";
import {Constants} from "../../utils/Constants";
import {RxHelper} from "../../utils/RxHelper";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";
import {CommonService} from "../../services/common.service";
import {OperationAreaModel} from "../../model/operation-area.model";
import {AlertModel} from "../../model/alert.model";
import {AlertMessageModel} from '../../model/alert-message.model';

@Component({
    selector: 'app-create-alert',
    templateUrl: './create-alert.component.html',
    styleUrls: ['./create-alert.component.css']
})
export class CreateAlertRiskMonitoringComponent implements OnInit {


    private alertMessageType = AlertMessageType;
    private alertMessage: AlertMessageModel = null;

    public uid: string;
    public countryID: string;
    private alertData: any;

    private alertLevels = Constants.ALERT_LEVELS;
    private alertColors = Constants.ALERT_COLORS;
    private alertButtonsClass = Constants.ALERT_BUTTON_CLASS;
    private alertLevelsList: number[] = [AlertLevels.Green, AlertLevels.Amber, AlertLevels.Red];

    private durationType = Constants.DURATION_TYPE;
    private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];

    private countries = Constants.COUNTRY;
    private countriesList: number[] = [Country.UK, Country.France, Country.Germany];
    private frequency = new Array(100);

    private countryLevels: any[] = [];
    private countryLevelsValues: any[] = [];

    private hazardScenario = Constants.HAZARD_SCENARIOS;
    private hazardScenariosList: number[] = [
        HazardScenario.HazardScenario0,
        HazardScenario.HazardScenario1,
        HazardScenario.HazardScenario2,
        HazardScenario.HazardScenario3,
        HazardScenario.HazardScenario4,
        HazardScenario.HazardScenario5,
        HazardScenario.HazardScenario6,
        HazardScenario.HazardScenario7,
        HazardScenario.HazardScenario8,
        HazardScenario.HazardScenario9,
        HazardScenario.HazardScenario10,
        HazardScenario.HazardScenario11,
        HazardScenario.HazardScenario12,
        HazardScenario.HazardScenario13,
        HazardScenario.HazardScenario14,
        HazardScenario.HazardScenario15,
        HazardScenario.HazardScenario16,
        HazardScenario.HazardScenario17,
        HazardScenario.HazardScenario18,
        HazardScenario.HazardScenario19,
        HazardScenario.HazardScenario20,
        HazardScenario.HazardScenario21,
        HazardScenario.HazardScenario22,
        HazardScenario.HazardScenario23,
        HazardScenario.HazardScenario24,
        HazardScenario.HazardScenario25,
        HazardScenario.HazardScenario26,
    ];

    constructor(private subscriptions: RxHelper, private af: AngularFire, private router: Router, private _commonService: CommonService) {
        this.initAlertData();
    }

    initAlertData() {
        this.alertData = new AlertModel();
        this.addAnotherAreas();
    }

    addAnotherAreas() {
        this.alertData.affectedAreas.push(new OperationAreaModel());
    }

    ngOnInit() {
        let subscription = this.af.auth.subscribe(auth => {
            if (auth) {
                this.uid = auth.uid;
                this.getCountryID();

                // get the country levels values
                this._commonService.getJsonContent(Constants.COUNTRY_LEVELS_VALUES_FILE)
                    .subscribe(content => {
                        this.countryLevelsValues = content;
                        err => console.log(err);
                    });

            } else {
                this.navigateToLogin();
            }
        });
        this.subscriptions.add(subscription);
    }

    getCountryID() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/countryId').subscribe((countryID: any) => {
                this.countryID = countryID.$value ? countryID.$value : "";
                res(true);
            });
            this.subscriptions.add(subscription);
        });
        return promise;
    }

    saveAlert() {
        this._validateData().then((isValid: boolean) => {
            if (isValid) {
                console.log('!!!!!!!!!!!!!!!');
            }
        });
    }

    _validateOperationArea(operationArea: OperationAreaModel): AlertMessageModel {
        let excludeFields = [];
        let countryLevel1Exists = operationArea.country
            && this.countryLevelsValues[operationArea.country].levelOneValues
            && this.countryLevelsValues[operationArea.country].levelOneValues.length > 0;
        if (!countryLevel1Exists) {
            excludeFields.push("level1", "level2");
        } else if (countryLevel1Exists && operationArea.level1
            && (!this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].levelTwoValues
                || this.countryLevelsValues[operationArea.country].levelOneValues[operationArea.level1].length < 1)) {
            excludeFields.push("level2");
        }
        this.alertMessage = operationArea.validate(excludeFields);
        return this.alertMessage;
    }

    _validateData() {
        let promise = new Promise((res, rej) => {
            this.alertMessage = this.alertData.validate();
            if (this.alertMessage) {
                res(false);
            }
            if (!this.alertMessage) {
                if (!this.alertMessage) {
                    this.alertData.affectedAreas.forEach((val, key) => {
                        this._validateOperationArea(val);
                        if (this.alertMessage) {
                            res(false);
                        }
                    });
                }

                if (!this.alertMessage) {
                    res(true);
                }

            }
        });
        return promise;
    }

    private navigateToLogin() {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
    }

}
