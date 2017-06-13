import {Pipe, PipeTransform} from '@angular/core';
 
@Pipe({
    name : "replace"
})
 
export class ReplacePipe implements PipeTransform{
	transform(value, replaceFrom, replaceTo){
            return value.replace(replaceFrom, replaceTo);
	}
}
