/**
 * Created by jordan on 06/07/2017.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumBudgetPipe'
})
export class SumPipe implements PipeTransform {
  transform(items: Map<string, number>, attr: string): any {
    let total = 0;
    console.log("HERE!");
    console.log(items.size);
    items.forEach((value, key) => {
      total = total + value;
    });
    return total;
  }
}
