import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cep',
})
export class CepPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value?.length === 8) {
      return value.replace(/(\d{2})(\d{3})(\d{3})/g, '$1.$2-$3');
    }
    return value;
  }
}
