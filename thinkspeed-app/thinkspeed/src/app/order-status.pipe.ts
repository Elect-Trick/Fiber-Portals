import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: number) :string {
    let status='';
  return value==1?"Pending": value==2?"Awaiting Install": value==3?"Cancelled":"Active";
  }
}
