import { FormControl } from '@angular/forms';

export class FormHelper {
  public static getErrorMessage(control: FormControl): string {
    if (control) {
      if (control.hasError('email')) {
        return 'Email inválido.';
      } else if (control.hasError('minlength')) {
        return `Tamanho mínimo de ${
          control.getError('minlength').requiredLength
        } caracter${
          control.getError('minlength').requiredLength > 1 ? 'es' : ''
        }.`;
      } else if (control.hasError('maxlength')) {
        return `Tamanho máximo de ${
          control.getError('maxlength').requiredLength
        } caracter${
          control.getError('maxlength').requiredLength > 1 ? 'es' : ''
        }.`;
      } else if (control.hasError('min')) {
        if (control.getError('min').min === 0) {
          return `Valor não pode ser negativo.`;
        } else {
          return `Valor mínimo de ${control.getError('min').min}.`;
        }
      } else if (control.hasError('max')) {
        return `Valor máximo de ${control.getError('max').max}.`;
      } else if (control.hasError('custom')) {
        return control.getError('custom').message;
      } else if (control.hasError('required')) {
        return 'Campo obrigatório.';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}
