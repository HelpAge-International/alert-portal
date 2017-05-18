import {Subscription} from "rxjs";
/**
 * Created by Fei on 16/03/2017.
 */

export class RxHelper {
  subscriptions: Array<Subscription> = [];

  add(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  releaseAll() {
    this.subscriptions.forEach(result => {
      if (!result.closed) {
        result.unsubscribe();
      }
    });
  }
}
