import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'splitOnCaps'})
export class SplitOnCapsPipe implements PipeTransform {
  transform(value:string, exponent): string  {
    return value.match(/[A-Z][a-z]+/g).join(" ");
  }
}
