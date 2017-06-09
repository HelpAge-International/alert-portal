"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Fei on 16/03/2017.
 */
var RxHelper = (function () {
    function RxHelper() {
        this.subscriptions = [];
    }
    RxHelper.prototype.add = function (subscription) {
        this.subscriptions.push(subscription);
    };
    RxHelper.prototype.releaseAll = function () {
        this.subscriptions.forEach(function (result) {
            if (!result.closed) {
                result.unsubscribe();
            }
        });
    };
    return RxHelper;
}());
exports.RxHelper = RxHelper;
