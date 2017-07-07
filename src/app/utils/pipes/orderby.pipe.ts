/**
 * Created by jordan on 24/06/2017.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'orderByPipe'
})
export class OrderByPipe implements PipeTransform {

  transform(array: Array<string>, args: string): Array<string> {

    if (!array || array === undefined || array.length === 0) {
      return null;
    }

    array.sort((a: any, b: any) => {
      if (a.dueDate < b.dueDate) {
        return -1;
      } else if (a.dueDate > b.dueDate) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}
