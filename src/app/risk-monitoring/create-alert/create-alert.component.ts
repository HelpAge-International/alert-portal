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
import {ModelHazard} from '../../model/hazard.model';

@Component({
    selector: 'app-create-alert',
    templateUrl: './create-alert.component.html',
    styleUrls: ['./create-alert.component.css']
})
export class CreateAlertRiskMonitoringComponent implements OnInit {


    private alertMessageType = AlertMessageType;
    private alertMessage: AlertMessageModel = null;

    public uid: string;
    private countryID: string;
    private directorCountryID: string;
    private alertData: any;

    private alertLevels = Constants.ALERT_LEVELS;
    private alertColors = Constants.ALERT_COLORS;
    private alertButtonsClass = Constants.ALERT_BUTTON_CLASS;
    private alertLevelsList: number[] = [AlertLevels.Amber, AlertLevels.Red];

    private durationType = Constants.DURATION_TYPE;
    private durationTypeList: number[] = [DurationType.Week, DurationType.Month, DurationType.Year];

    private countries = Constants.COUNTRY;
    private countriesList: number[] = [Country.UK, Country.France, Country.Germany];
    private frequency = new Array(100);

    private countryLevels: any[] = [];
    private countryLevelsValues: any[] = [];

    private hazardScenario = Constants.HAZARD_SCENARIOS;

    private hazards: any[] = [];

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

    removeAnotherArea(key: number, ) {
        this.alertData.affectedAreas.splice(key, 1);
    }

    ngOnInit() {
        let subscription = this.af.auth.subscribe(auth => {
            if (auth) {
                this.uid = auth.uid;
                this._getCountryID().then(() => {
                    this._getHazards();
                    this._getDirectorCountryID();
                });

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

    saveAlert() {

        if (!this.directorCountryID) {
            this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_ALERT.NO_DIRECTOR_COUNTRY_ID');
            return false;
        }

        this._validateData().then((isValid: boolean) => {
            if (isValid) {

                this.alertData.createdBy = this.uid;
                this.alertData.timeCreated = this._getCurrentTimestamp();
                this.alertData.approval['countryDirector'] = [];
                this.alertData.approval['countryDirector'][this.directorCountryID] = 0;


                var dataToSave = this.alertData;

                this.af.database.list(Constants.APP_STATUS + '/alert/' + this.countryID)
                    .push(dataToSave)
                    .then(() => {
                        this.alertMessage = new AlertMessageModel('RISK_MONITORING.ADD_ALERT.SUCCESS_MESSAGE_ADD_ALERT', AlertMessageType.Success);
                        this.initAlertData();
                    }).catch((error: any) => {
                        console.log(error, 'You do not have access!')
                    });
                //
            }
        });
    }

    _getCountryID() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.object(Constants.APP_STATUS + "/administratorCountry/" + this.uid + '/countryId').subscribe((countryID: any) => {
                this.countryID = countryID.$value ? countryID.$value : "";
                res(true);
            });
            this.subscriptions.add(subscription);
        });
        return promise;
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

            var excludedFields = [];
            if (typeof (this.alertData.alertLevel) == 'undefined' || this.alertData.alertLevel == 1) {
                excludedFields.push('reasonForRedAlert');
            }

            this.alertMessage = this.alertData.validate(excludedFields);
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

    _getHazards() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.object(Constants.APP_STATUS + "/hazard/" + this.countryID).subscribe((hazards: any) => {
                this.hazards = [];
                for (let hazard in hazards) {
                    this.hazards.push(hazards[hazard]);
                }
            });
            this.subscriptions.add(subscription);
        });
    }

    _getDirectorCountryID() {
        let promise = new Promise((res, rej) => {
            let subscription = this.af.database.object(Constants.APP_STATUS + "/directorCountry/" + this.countryID).subscribe((directorCountryID: any) => {
                this.directorCountryID = directorCountryID.$value ? directorCountryID.$value : false;

            });
            this.subscriptions.add(subscription);
        });
        return promise;
    }

    _getCurrentTimestamp() {
        var currentTimeStamp = new Date().getTime();
        return currentTimeStamp;
    }

    private navigateToLogin() {
        this.router.navigateByUrl(Constants.LOGIN_PATH);
    }

}
