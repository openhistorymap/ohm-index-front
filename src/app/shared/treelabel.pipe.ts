import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'treelabel',
  standalone: true,
})
export class TreelabelPipe implements PipeTransform {
  transform(value: unknown, ...args: any[]): unknown {
    let val = '' + value;
    val = val.replace('geonames:', '');
    try {
      return args[0][val].name;
    } catch {
      return '' + value;
    }
  }
}
