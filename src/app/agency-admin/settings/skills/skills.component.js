"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../../../utils/Constants");
var Enums_1 = require("../../../utils/Enums");
var rxjs_1 = require("rxjs");
var SkillsComponent = (function () {
    function SkillsComponent(af, router) {
        this.af = af;
        this.router = router;
        this.uid = "";
        this.deleting = false;
        this.editing = false;
        this.skillName = [];
        this.deleteCandidates = {};
        this.skills = {};
        this.skillKeys = [];
        this.editedSkills = [];
        this.SupportSkill = Enums_1.SkillType.Support;
        this.TechSkill = Enums_1.SkillType.Tech;
        this.alertMessage = "Message";
        this.alertSuccess = true;
        this.alertShow = false;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    SkillsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.af.auth.takeUntil(this.ngUnsubscribe).subscribe(function (auth) {
            if (auth) {
                _this.uid = auth.uid;
                _this.af.database.list(Constants_1.Constants.APP_STATUS + '/agency/' + _this.uid + '/skills')
                    .takeUntil(_this.ngUnsubscribe)
                    .subscribe(function (_) {
                    _.filter(function (skill) { return skill.$value; }).map(function (skill) {
                        _this.af.database.list(Constants_1.Constants.APP_STATUS + '/skill/', {
                            query: {
                                orderByKey: true,
                                equalTo: skill.$key
                            }
                        })
                            .takeUntil(_this.ngUnsubscribe)
                            .subscribe(function (_skill) {
                            if (_skill[0] != undefined)
                                _this.skills[_skill[0].$key] = _skill[0];
                            else
                                delete _this.skills[skill.$key];
                            _this.skillKeys = Object.keys(_this.skills);
                        });
                    });
                });
            }
            else {
                // user is not logged in
                console.log('Error occurred - User is not logged in');
                _this.navigateToLogin();
            }
        });
    };
    SkillsComponent.prototype.ngOnDestroy = function () {
        try {
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
        }
        catch (e) {
            console.log('Unable to releaseAll');
        }
    };
    SkillsComponent.prototype.navigateToLogin = function () {
        this.router.navigateByUrl(Constants_1.Constants.LOGIN_PATH);
    };
    SkillsComponent.prototype.deleteSkills = function (event) {
        this.deleting = !this.deleting;
    };
    SkillsComponent.prototype.cancelDeleteSkills = function (event) {
        this.deleting = !this.deleting;
        this.deleteCandidates = {};
    };
    SkillsComponent.prototype.deleteSelectedSkills = function (event) {
        var _this = this;
        this.deleting = !this.deleting;
        for (var item in this.deleteCandidates) {
            this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + this.uid + '/skills/' + item).remove();
            this.af.database.object(Constants_1.Constants.APP_STATUS + '/skill/' + item)
                .remove()
                .then(function (_) {
                if (!_this.alertShow) {
                    _this.alertSuccess = true;
                    _this.alertShow = true;
                    _this.alertMessage = "Skills succesfully removed!";
                }
            })
                .catch(function (err) { return console.log(err, 'You do not have access!'); });
        }
    };
    SkillsComponent.prototype.onSkillSelected = function (skill) {
        if (skill in this.deleteCandidates)
            delete this.deleteCandidates[skill];
        else
            this.deleteCandidates[skill] = true;
    };
    SkillsComponent.prototype.editSkills = function (event) {
        this.editing = !this.editing;
    };
    SkillsComponent.prototype.cancelEditSkills = function (event) {
        this.editing = !this.editing;
        this.editedSkills = [];
        this.deleteCandidates = {};
    };
    SkillsComponent.prototype.saveEditedSkills = function (event) {
        var _this = this;
        this.editing = !this.editing;
        for (var skill in this.editedSkills)
            this.af.database.object(Constants_1.Constants.APP_STATUS + '/skill/' + skill)
                .update(this.editedSkills[skill])
                .then(function (_) {
                if (!_this.alertShow) {
                    _this.alertSuccess = true;
                    _this.alertShow = true;
                    _this.alertMessage = "Skills succesfully saved!";
                }
            })
                .catch(function (err) { return console.log(err, 'You do not have access!'); });
    };
    SkillsComponent.prototype.setSkillValue = function (prop, value) {
        this.editedSkills[prop] = { name: value };
    };
    SkillsComponent.prototype.onAlertHidden = function (hidden) {
        this.alertShow = !hidden;
        this.alertSuccess = true;
        this.alertMessage = "";
    };
    SkillsComponent.prototype.addSkill = function (event, type) {
        var _this = this;
        var skill = { name: this.skillName[type], type: type };
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/skill/').push(skill).then(function (item) {
            var key = item.key;
            var agencySkills = _this.af.database.object(Constants_1.Constants.APP_STATUS + '/agency/' + _this.uid + '/skills/' + key)
                .set(true)
                .then(function (_) {
                if (!_this.alertShow) {
                    _this.alertSuccess = true;
                    _this.alertShow = true;
                    _this.alertMessage = "Skill succesfully added!";
                }
            })
                .catch(function (err) { return console.log(err, 'You do not have access!'); });
        });
        this.skillName = [];
    };
    return SkillsComponent;
}());
SkillsComponent = __decorate([
    core_1.Component({
        selector: 'app-skills',
        templateUrl: './skills.component.html',
        styleUrls: ['./skills.component.css']
    })
], SkillsComponent);
exports.SkillsComponent = SkillsComponent;
