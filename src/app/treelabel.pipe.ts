import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'treelabel'
})
export class TreelabelPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const val = ""+value;
    return args[0][val].name;
  }

}
