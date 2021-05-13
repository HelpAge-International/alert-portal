import {Subscription, TeardownLogic} from "rxjs";
import {RxHelper} from "./RxHelper";
import {AngularFireDatabase, FirebaseObjectObservable} from "angularfire2";

export class SubscriptionHandler {

  subscription: Subscription;

  dependentSubscriptions: Array<SubscriptionHandler>;

  constructor(subscription: Subscription) {
    this.subscription = subscription;
    this.dependentSubscriptions = [];
  }

  add(subscriptionHandler: SubscriptionHandler) {
    this.dependentSubscriptions.push(subscriptionHandler);
  }

  unregister() {
    this.subscription.unsubscribe();
    for (let s of this.dependentSubscriptions) {
      s.unregister();
    }
  }

  unregisterChildren() {
    for (let s of this.dependentSubscriptions) {
      s.unregister();
    }
  }
}

export class FirebaseWrapper {
  public static objectAndSubscribe(parentSubHandler: SubscriptionHandler,
                            path: FirebaseObjectObservable<any>,
                            callback: (thisHandler, value) => void) {

    let mSubHandler = new SubscriptionHandler(path.subscribe((value) => {
      if (parentSubHandler != null) {
        parentSubHandler.unregisterChildren();
      }
      callback(mSubHandler, value);
    }));

    if (parentSubHandler != null) {
      parentSubHandler.add(mSubHandler);
    }

    return mSubHandler;
  }
}



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
