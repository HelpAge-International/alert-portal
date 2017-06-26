/**
 * Created by jordan on 24/06/2017.
 */
import { Pipe, PipeTransform } from '@angular/core';
import {Actions} from "../../preparedness/advanced/advanced.component";

@Pipe({
  name: 'prepFilter',
  pure: false
})
export class PreparednessFilter implements PipeTransform {
  transform(items: any[], filter: Actions): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Actions) => this.applyFilter(item, filter));
  }

  applyFilter(act: Actions, filter: Actions): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (act[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (act[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
