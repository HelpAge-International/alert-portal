"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SubscriptionHandler = (function () {
    function SubscriptionHandler(subscription) {
        this.subscription = subscription;
        this.dependentSubscriptions = [];
    }
    SubscriptionHandler.prototype.add = function (subscriptionHandler) {
        this.dependentSubscriptions.push(subscriptionHandler);
    };
    SubscriptionHandler.prototype.unregister = function () {
        this.subscription.unsubscribe();
        for (var _i = 0, _a = this.dependentSubscriptions; _i < _a.length; _i++) {
            var s = _a[_i];
            s.unregister();
        }
    };
    SubscriptionHandler.prototype.unregisterChildren = function () {
        for (var _i = 0, _a = this.dependentSubscriptions; _i < _a.length; _i++) {
            var s = _a[_i];
            s.unregister();
        }
    };
    return SubscriptionHandler;
}());
exports.SubscriptionHandler = SubscriptionHandler;
var FirebaseWrapper = (function () {
    function FirebaseWrapper() {
    }
    FirebaseWrapper.objectAndSubscribe = function (parentSubHandler, path, callback) {
        var mSubHandler = new SubscriptionHandler(path.subscribe(function (value) {
            if (parentSubHandler != null) {
                parentSubHandler.unregisterChildren();
            }
            callback(mSubHandler, value);
        }));
        if (parentSubHandler != null) {
            parentSubHandler.add(mSubHandler);
        }
        return mSubHandler;
    };
    return FirebaseWrapper;
}());
exports.FirebaseWrapper = FirebaseWrapper;
// export class SubscriptionHandler {
//
//   subscription: Subscription;
//
//   dependentSubscriptions: Array<SubscriptionHandler>;
//
//   constructor(subscription: Subscription) {
//     this.subscription = subscription;
//     this.dependentSubscriptions = [];
//   }
//
//   add(subscriptionHandler: SubscriptionHandler) {
//     this.dependentSubscriptions.push(subscriptionHandler);
//   }
//
//   unregister() {
//     this.subscription.unsubscribe();
//     for (let s of this.dependentSubscriptions) {
//       s.unregister();
//     }
//   }
//
//   unregisterChildren() {
//     for (let s of this.dependentSubscriptions) {
//       s.unregister();
//     }
//   }
// }
//
// export class FirebaseWrapper {
//   public static objectAndSubscribe(parentSubHandler: SubscriptionHandler,
//                                    path: FirebaseObjectObservable<any>,
//                                    callback: (value) => void) {
//     let sub = path.subscribe(value => {
//       if (parentSubHandler != null)
//         parentSubHandler.unregisterChildren();
//       callback(value);
//     });
//
//     let newSubHandler = new SubscriptionHandler(sub);
//
//     if (parentSubHandler != null)
//       parentSubHandler.add(newSubHandler);
//
//     return newSubHandler;
//   }
// }
