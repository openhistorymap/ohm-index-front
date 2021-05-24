import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'treelabel'
})
export class TreelabelPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let val = ""+value;
    val = val.replace('geonames:', '');
    try {
      return args[0][val].name;
    } catch (ex) {
      return ""+value;
    }
  }

}
