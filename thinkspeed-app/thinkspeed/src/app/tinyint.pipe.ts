import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tinyint'
})
export class TinyintPipe implements PipeTransform {

  transform(value: number | undefined) {
    return value==0?false:true;
  }

}
