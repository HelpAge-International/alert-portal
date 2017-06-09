"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angularfire2_1 = require("angularfire2");
var Constants_1 = require("../utils/Constants");
var rxjs_1 = require("rxjs");
var app_module_1 = require("../app.module");
var UUID_1 = require("../utils/UUID");
var firebase = require("firebase");
var partner_model_1 = require("../model/partner.model");
var user_public_model_1 = require("../model/user-public.model");
var display_error_1 = require("../errors/display.error");
var Enums_1 = require("../utils/Enums");
var UserService = (function () {
    function UserService(af, subscriptions) {
        this.af = af;
        this.subscriptions = subscriptions;
        this.secondApp = firebase.initializeApp(app_module_1.firebaseConfig, UUID_1.UUID.createUUID());
    }
    // FIREBASE
    UserService.prototype.getAuthUser = function () {
        var _this = this;
        var userAuthSubscription = this.af.auth.map(function (user) {
            _this.authState = user;
            return user.auth;
        });
        return userAuthSubscription;
    };
    UserService.prototype.createNewFirebaseUser = function (email, password) {
        var _this = this;
        return this.secondApp.auth().createUserWithEmailAndPassword(email, password)
            .then(function (newUser) {
            _this.secondApp.auth().signOut();
            return newUser;
        });
    };
    // PUBLIC USER
    UserService.prototype.getUser = function (uid) {
        if (!uid) {
            return null;
        }
        ;
        var userSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/userPublic/' + uid)
            .map(function (user) {
            if (user.$key) {
                var userPublic = new user_public_model_1.ModelUserPublic(null, null, null, null);
                userPublic.id = uid;
                userPublic.mapFromObject(user);
                return userPublic;
            }
            return null;
        });
        return userSubscription;
    };
    UserService.prototype.getUserByEmail = function (email) {
        if (!email) {
            return null;
        }
        ;
        var userSubscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/userPublic', {
            query: {
                orderByChild: "email",
                equalTo: email
            }
        })
            .first()
            .map(function (item) {
            if (item.length > 0) {
                var userPublic = new user_public_model_1.ModelUserPublic(null, null, null, null);
                userPublic.id = item.$key;
                userPublic.mapFromObject(item);
                return userPublic;
            }
            else {
                return null;
            }
        });
        return userSubscription;
    };
    UserService.prototype.saveUserPublic = function (userPublic) {
        var _this = this;
        var userPublicData = {};
        var uid = userPublic.id;
        // if (!uid) {
        //   // return this.createNewFirebaseUser(userPublic.email, Constants.TEMP_PASSWORD)
        //   //   .then(newUser => {
        //   //     partner.id = newUser.uid;
        //   //     return this.savePartnerUser(partner, userPublic);
        //   //   })
        //   //   .catch(err => {
        //   //     throw new DisplayError('FIREBASE.' + (err as firebase.FirebaseError).code);
        //   //   });
        // } else {
        this.getUser(uid).subscribe(function (oldUser) {
            if (oldUser.email && oldUser.email !== userPublic.email) {
                _this.getAuthUser();
                return _this.authState.auth.updateEmail(userPublic.email).then(function (bool) {
                    return _this.saveUserPublic(userPublic);
                }, function (error) { return function () {
                    throw new Error('Cannot update user email');
                }; })
                    .catch(function (err) {
                    throw new Error(err.message);
                });
            }
        });
        userPublicData['/userPublic/' + uid + '/'] = userPublic;
        return this.af.database.object(Constants_1.Constants.APP_STATUS).update(userPublicData);
        //}
    };
    UserService.prototype.changePassword = function (email, password) {
        var _this = this;
        return this.af.auth.login({
            email: email,
            password: password.currentPassword
        }, {
            provider: angularfire2_1.AuthProviders.Password,
            method: angularfire2_1.AuthMethods.Password,
        })
            .then(function () {
            _this.authState.auth.updatePassword(password.newPassword).then(function () {
            }, function (error) {
                throw new Error('Cannot update password');
            });
        }, function (error) {
            throw new display_error_1.DisplayError('GLOBAL.ACCOUNT_SETTINGS.INCORRECT_CURRENT_PASSWORD');
        });
    };
    // COUNTRY ADMIN USER
    UserService.prototype.getCountryAdminUser = function (uid) {
        if (!uid) {
            return null;
        }
        var countryAdminSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/administratorCountry/' + uid)
            .map(function (item) {
            if (item.$key) {
                return item;
            }
            return null;
        });
        return countryAdminSubscription;
    };
    // PARTNER USER
    UserService.prototype.getPartnerUser = function (uid) {
        if (!uid) {
            return null;
        }
        var partnerUserSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/partner/' + uid)
            .map(function (item) {
            if (item.$key) {
                var partner = new partner_model_1.PartnerModel();
                partner.mapFromObject(item);
                partner.id = uid;
                return partner;
            }
            return null;
        });
        return partnerUserSubscription;
    };
    UserService.prototype.getCountryOfficePartnerUsers = function (agencyId, countryId) {
        var _this = this;
        var partners = [];
        var partnerUsersSubscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/countryOffice/' + agencyId + '/' + countryId + '/partners')
            .flatMap(function (partners) {
            return rxjs_1.Observable.from(partners.map(function (partner) { return partner.$key; }));
        })
            .flatMap(function (partnerId) {
            partners = []; // reinitialize list to prevent duplication
            return _this.getPartnerUser(partnerId);
        })
            .map(function (partner) {
            partners.push(partner);
            return partners;
        });
        return partnerUsersSubscription;
    };
    UserService.prototype.getPartnerUsers = function () {
        var partnerUsersSubscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/partner')
            .map(function (items) {
            var partners = [];
            items.forEach(function (item) {
                // Add the organisation ID
                var partner = item;
                partner.id = item.$key;
                partners.push(partner);
            });
            return partners;
        });
        return partnerUsersSubscription;
    };
    UserService.prototype.savePartnerUser = function (partner, userPublic) {
        var _this = this;
        var partnerData = {};
        var uid = partner.id || userPublic.id;
        if (!uid) {
            return this.createNewFirebaseUser(userPublic.email, Constants_1.Constants.TEMP_PASSWORD)
                .then(function (newUser) {
                partner.id = newUser.uid;
                partner.createdAt = Date.now();
                return _this.savePartnerUser(partner, userPublic);
            })
                .catch(function (err) {
                throw new display_error_1.DisplayError('FIREBASE.' + err.code);
            });
        }
        else {
            this.getUser(uid).subscribe(function (oldUser) {
                if (oldUser.email && oldUser.email !== userPublic.email) {
                    return _this.deletePartnerUser(uid).then(function (bool) {
                        if (bool) {
                            partner.id = null; // force new user creation
                            return _this.savePartnerUser(partner, userPublic);
                        }
                    })
                        .catch(function (err) {
                        throw new Error(err.message);
                    });
                }
            });
            partner.modifiedAt = Date.now();
            partnerData['/userPublic/' + uid + '/'] = userPublic;
            partnerData['/partner/' + uid + '/'] = partner;
            return this.af.database.object(Constants_1.Constants.APP_STATUS).update(partnerData);
        }
    };
    UserService.prototype.deletePartnerUser = function (uid) {
        var partnerData = {};
        if (!uid) {
            throw new Error('User id not present');
        }
        partnerData['/userPublic/' + uid + '/'] = null;
        partnerData['/partner/' + uid + '/'] = null;
        return this.af.database.object(Constants_1.Constants.APP_STATUS).update(partnerData);
    };
    //return current user type enum number
    UserService.prototype.getUserType = function (uid) {
        var _this = this;
        var paths = [Constants_1.Constants.APP_STATUS + "/administratorCountry", Constants_1.Constants.APP_STATUS + "/directorCountry",
            Constants_1.Constants.APP_STATUS + "/directorRegion"];
        if (!uid) {
            return null;
        }
        var userTypeSubscription = this.af.database.object(paths[0])
            .flatMap(function (adminCountry) {
            if (adminCountry.$key) {
                return rxjs_1.Observable.of(Enums_1.UserType.CountryAdmin);
            }
            else {
                _this.af.database.object(paths[1])
                    .flatMap(function (directorCountry) {
                    if (directorCountry.$key) {
                        return rxjs_1.Observable.of(Enums_1.UserType.CountryDirector);
                    }
                    else {
                        _this.af.database.object(paths[2])
                            .flatMap(function (regionDirector) {
                            if (regionDirector.$key) {
                                return rxjs_1.Observable.of(Enums_1.UserType.RegionalDirector);
                            }
                            else {
                                return rxjs_1.Observable.empty();
                            }
                        });
                    }
                });
            }
        });
        return userTypeSubscription;
    };
    //get user country id
    UserService.prototype.getCountryId = function (userType, uid) {
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + userType + "/" + uid + "/countryId")
            .map(function (countryId) {
            if (countryId.$value) {
                return countryId.$value;
            }
        });
    };
    UserService.prototype.getAgencyId = function (userType, uid) {
        var subscription = this.af.database.list(Constants_1.Constants.APP_STATUS + "/" + userType + "/" + uid + '/agencyAdmin')
            .map(function (agencyIds) {
            if (agencyIds.length > 0 && agencyIds[0].$value) {
                return agencyIds[0].$value;
            }
        });
        return subscription;
    };
    UserService.prototype.getOrganisationName = function (id) {
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/partnerOrganisation/" + id);
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable()
], UserService);
exports.UserService = UserService;
