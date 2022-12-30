import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewOrder'
})
export class ViewOrderPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
