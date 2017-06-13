"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Constants_1 = require("../utils/Constants");
var rxjs_1 = require("rxjs");
var external_recipient_model_1 = require("../model/external-recipient.model");
var message_model_1 = require("../model/message.model");
var Enums_1 = require("../utils/Enums");
var MessageService = (function () {
    function MessageService(af, subscriptions) {
        this.af = af;
        this.subscriptions = subscriptions;
        this.ngUnsubscribe = new rxjs_1.Subject();
    }
    // COUNTRY ADMIN
    MessageService.prototype.getCountryExternalRecipients = function (countryId) {
        var externalRecipientSubscription = this.af.database.list(Constants_1.Constants.APP_STATUS + '/externalRecipient/' + countryId)
            .map(function (items) {
            var externalRecipients = [];
            items.forEach(function (item) {
                var externalRecipient = new external_recipient_model_1.ExternalRecipientModel();
                externalRecipient.mapFromObject(item);
                externalRecipient.id = item.$key;
                externalRecipients.push(externalRecipient);
            });
            return externalRecipients;
        });
        return externalRecipientSubscription;
    };
    MessageService.prototype.getCountryExternalRecipient = function (countryId, recipientId) {
        if (!countryId || !recipientId) {
            throw new Error('No countryID or recipientID');
        }
        var externalRecipientSubscription = this.af.database.object(Constants_1.Constants.APP_STATUS + '/externalRecipient/' + countryId + '/' + recipientId)
            .map(function (item) {
            var externalRecipient = new external_recipient_model_1.ExternalRecipientModel();
            if (item.$key) {
                externalRecipient.mapFromObject(item);
                externalRecipient.id = item.$key;
            }
            return externalRecipient;
        });
        return externalRecipientSubscription;
    };
    MessageService.prototype.saveCountryExternalRecipient = function (externalRecipient, countryId) {
        var externalRecipientData = {};
        if (!countryId) {
            throw new Error('No countryID');
        }
        var uid = externalRecipient.id;
        if (!uid) {
            var recipientList = this.af.database.list(Constants_1.Constants.APP_STATUS + '/externalRecipient/' + countryId + '/');
            return recipientList.push(externalRecipient);
        }
        else {
            externalRecipientData['/externalRecipient/' + countryId + '/' + uid] = externalRecipient;
            return this.af.database.object(Constants_1.Constants.APP_STATUS).update(externalRecipientData);
        }
    };
    MessageService.prototype.deleteCountryExternalRecipient = function (countryId, uid) {
        var externalRecipientData = {};
        if (!uid || !countryId) {
            throw new Error('UserID or countryID not present');
        }
        externalRecipientData['/externalRecipient/' + countryId + '/' + uid] = null;
        return this.af.database.object(Constants_1.Constants.APP_STATUS).update(externalRecipientData);
    };
    MessageService.prototype.getCountrySentMessages = function (countryId) {
        var _this = this;
        if (!countryId) {
            throw new Error('No countryID');
        }
        var countrySentMessagesSubsciption = this.af.database.list(Constants_1.Constants.APP_STATUS + '/administratorCountry/' + countryId + '/sentmessages')
            .map(function (items) {
            var sentMessages = [];
            if (items) {
                items.forEach(function (item) {
                    _this.af.database.object(Constants_1.Constants.APP_STATUS + '/message/' + item.$key)
                        .subscribe(function (message) {
                        if (message.content) {
                            var sentMessage = new message_model_1.MessageModel();
                            sentMessage.mapFromObject(message);
                            sentMessage.id = message.$key;
                            sentMessages.push(sentMessage);
                        }
                        return sentMessages;
                    }, function (err) { return console.log('Could not find message'); });
                });
            }
            return sentMessages;
        });
        return countrySentMessagesSubsciption;
    };
    MessageService.prototype.saveCountryMessage = function (countryId, agencyId, message) {
        var _this = this;
        return this.af.database.list(Constants_1.Constants.APP_STATUS + '/message').push(message)
            .then(function (msgId) {
            var messageRefData = {};
            messageRefData['/administratorCountry/' + countryId + '/sentmessages/' + msgId.key] = true;
            if (message.userType[Enums_1.UserType.All]) {
                _this.saveCountryUserTypeMessage(countryId, message, msgId.key, 'countryallusersgroup', messageRefData)
                    .subscribe(function (messageRef) { messageRefData = messageRef; console.log('assign routes'); });
                if (message.userType[Enums_1.UserType.CountryAdmin]) {
                    _this.saveAgencyUserTypeMessage(countryId, message, msgId.key, 'countryadmins', messageRefData);
                }
                if (message.userType[Enums_1.UserType.CountryDirector]) {
                    _this.saveAgencyUserTypeMessage(countryId, message, msgId.key, 'countrydirectors', messageRefData);
                }
                return _this.af.database.object(Constants_1.Constants.APP_STATUS).update(messageRefData);
            }
            else {
                return _this.buildMessageRef(countryId, message, msgId.key, messageRefData)
                    .then(function (messageRef) {
                    return _this.af.database.object(Constants_1.Constants.APP_STATUS).update(messageRef);
                });
            }
        });
    };
    MessageService.prototype.deleteCountryMessage = function (countryId, agencyId, messageId) {
        var _this = this;
        console.log(messageId);
        var messageRefData = {};
        messageRefData['/message/' + messageId] = null;
        messageRefData['/administratorCountry/' + countryId + '/sentmessages/' + messageId] = null;
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/message/' + messageId)
            .subscribe(function (userMessage) {
            var message = new message_model_1.MessageModel();
            message.mapFromObject(userMessage);
            message.userType.forEach(function (item, index) {
                switch (index) {
                    case Enums_1.UserType.CountryAdmin:
                        _this.deleteAgencyUserTypeMessage(countryId, messageId, 'countryadmins', messageRefData);
                        break;
                    case Enums_1.UserType.CountryDirector:
                        _this.deleteAgencyUserTypeMessage(countryId, messageId, 'countrydirectors', messageRefData);
                        break;
                    case Enums_1.UserType.ErtLeader:
                        _this.deleteCountryUserTypeMessage(countryId, messageId, 'ertleads', messageRefData);
                        break;
                    case Enums_1.UserType.Ert:
                        _this.deleteCountryUserTypeMessage(countryId, messageId, 'erts', messageRefData);
                        break;
                    case Enums_1.UserType.Donor:
                        _this.deleteCountryUserTypeMessage(countryId, messageId, 'donor', messageRefData);
                        break;
                    case Enums_1.UserType.NonAlert:
                        _this.deleteCountryUserTypeMessage(countryId, messageId, 'partner', messageRefData);
                        break;
                }
            });
        });
        return this.af.database.object(Constants_1.Constants.APP_STATUS).update(messageRefData);
    };
    MessageService.prototype.saveCountryUserTypeMessage = function (countryId, message, messageKey, userType, messageRefData) {
        return this.af.database.list(Constants_1.Constants.APP_STATUS + '/group/country/' + countryId + '/' + userType)
            .map(function (items) {
            items.forEach(function (item) {
                messageRefData['/messageRef/country/' + countryId + '/' + userType + '/' + item.$key + '/' + messageKey] = message.time;
            });
            return messageRefData;
        });
    };
    MessageService.prototype.saveAgencyUserTypeMessage = function (agencyId, message, messageKey, userType, messageRefData) {
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/group/agency/' + agencyId + '/' + userType)
            .map(function (items) {
            items.forEach(function (item) {
                messageRefData['/messageRef/agency/' + agencyId + '/' + userType + '/' + item.$key + '/' + messageKey] = message.time;
            });
            return messageRefData;
        });
    };
    MessageService.prototype.deleteCountryUserTypeMessage = function (countryId, messageKey, userType, messageRefData) {
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/group/country/' + countryId + '/' + userType)
            .subscribe(function (items) {
            items.forEach(function (item) {
                messageRefData['/messageRef/country/' + countryId + '/' + userType + '/' + item.$key + '/' + messageKey] = null;
            });
        });
    };
    MessageService.prototype.deleteAgencyUserTypeMessage = function (agencyId, messageKey, userType, messageRefData) {
        this.af.database.list(Constants_1.Constants.APP_STATUS + '/group/agency/' + agencyId + '/' + userType)
            .subscribe(function (items) {
            items.forEach(function (item) {
                messageRefData['/messageRef/agency/' + agencyId + '/' + userType + '/' + item.$key + '/' + messageKey] = null;
            });
        });
    };
    MessageService.prototype.buildMessageRef = function (countryId, message, messageId, messageRefData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var i = 0;
            message.userType.forEach(function (item, index) {
                switch (index) {
                    case Enums_1.UserType.CountryAdmin:
                        _this.saveAgencyUserTypeMessage(countryId, message, messageId, 'countryadmins', messageRefData);
                        break;
                    case Enums_1.UserType.CountryDirector:
                        _this.saveAgencyUserTypeMessage(countryId, message, messageId, 'countrydirectors', messageRefData);
                        break;
                    case Enums_1.UserType.ErtLeader:
                        _this.saveCountryUserTypeMessage(countryId, message, messageId, 'ertleads', messageRefData);
                        break;
                    case Enums_1.UserType.Ert:
                        _this.saveCountryUserTypeMessage(countryId, message, messageId, 'erts', messageRefData);
                        break;
                    case Enums_1.UserType.Donor:
                        _this.saveCountryUserTypeMessage(countryId, message, messageId, 'donor', messageRefData);
                        break;
                    case Enums_1.UserType.NonAlert:
                        _this.saveCountryUserTypeMessage(countryId, message, messageId, 'partner', messageRefData);
                        break;
                }
                i++;
                if (i == Object.keys(message.userType).length) {
                    resolve(messageRefData);
                }
            });
        });
    };
    return MessageService;
}());
MessageService = __decorate([
    core_1.Injectable()
], MessageService);
exports.MessageService = MessageService;
