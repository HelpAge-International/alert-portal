import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumKeyValues'
})
export class EnumKeyValuesPipe implements PipeTransform {

  transform(value, args:string[]) : any {
    let keys = Object.keys(value);
    keys = keys.slice(keys.length / 2);

    let keyValues = [];
    for (let key in keys) {
      keyValues.push({ key: key, value: value[key]});
    }

    return keyValues;
  }

}