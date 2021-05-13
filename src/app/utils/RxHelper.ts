import {Subscription} from "rxjs";
import { Injectable } from "@angular/core";
/**
 * Created by Fei on 16/03/2017.
 */

@Injectable()
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
