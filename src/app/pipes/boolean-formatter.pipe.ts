import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolFormatter'
})
export class BooleanFormatPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'כן' : 'לא';
  }
}