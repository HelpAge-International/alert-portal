import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumKeys'
})
export class EnumKeysPipe implements PipeTransform {

  transform(value, args:string[]) : any {
    let keys = Object.keys(value);
    
    return keys.slice(keys.length / 2);
  }

}