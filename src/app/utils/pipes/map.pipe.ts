import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertMapToList'
})
export class ConvertMapToListPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(value[key]);
    }
    return keys;
  }
}
