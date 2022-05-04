import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'celular',
})
export class CelularPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value?.length === 11) {
      return value.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
    }
    if (value?.length === 10) {
      return value.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2-$3');
    }
    return value;
  }
}
