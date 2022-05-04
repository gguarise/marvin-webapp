import { FormControl } from '@angular/forms';

export class FormHelper {
  public static getErrorMessage(control: FormControl): string {
    if (control) {
      if (control.hasError('email')) {
        return 'Email inválido.';
      } else if (control.hasError('minlength')) {
        return `Mínimo: ${
          control.getError('minlength').requiredLength
        } caracter${
          control.getError('minlength').requiredLength > 1 ? 'es' : ''
        }.`;
      } else if (control.hasError('maxlength')) {
        return `Máximo: ${
          control.getError('maxlength').requiredLength
        } caracter${
          control.getError('maxlength').requiredLength > 1 ? 'es' : ''
        }.`;
      } else if (control.hasError('min')) {
        if (control.getError('min').min === 0) {
          return `Não pode ser negativo.`;
        } else {
          return `Mínimo: ${control.getError('min').min}.`;
        }
      } else if (control.hasError('max')) {
        return `Máximo: ${control.getError('max').max}.`;
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

  public static getTextMask(mask: string, text: string = '') {
    switch (mask) {
      case 'cnpj':
        return {
          mask: [
            /[0-9]/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '/',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
          ],
        };
      case 'cpf':
        return {
          mask: [
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
          ],
        };
      case 'cep':
        return {
          mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
        };
      case 'telefone':
        const numero = text?.replace(/\D/g, '');
        // Verifica se o primeiro digito é de telefone fixo
        if (!!numero && !!numero[2] && Number(numero[2]) >= 2 && Number(numero[2]) <= 5) {
          return {
            mask: [
              '(',
              /[1-9]/,
              /[1-9]/,
              ')',
              ' ',
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ],
          };
        }
        return {
          mask: [
            '(',
            /[1-9]/,
            /[1-9]/,
            ')',
            ' ',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ],
        };
      case 'placa':
        return {
          mask: [
            /[a-zA-Z]/,
            /[a-zA-Z]/,
            /[a-zA-Z]/,
            '-',
            /\d/,
            /\w/,
            /\d/,
            /\d/,
          ],
        };
      case 'codigoNCM':
        return {
          mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        };
      default:
        return { mask: [] };
    }
  }

  public static getNumericMask(type: string) {
    switch (type) {
      case 'integer':
        return {
          prefix: '',
          thousands: '',
          decimal: '',
          allowNegative: false,
          precision: 0,
        };
      case 'currency':
        return {
          prefix: 'R$ ',
          thousands: '.',
          decimal: ',',
          allowNegative: false,
          precision: 2,
        };
      case 'numeric':
        return {
          prefix: '',
          thousands: '.',
          decimal: ',',
          allowNegative: false,
          precision: 2,
        };
      case 'integer-thousands':
        return {
          prefix: '',
          thousands: '.',
          decimal: '',
          allowNegative: false,
          precision: 0,
        };
      default:
        return {};
    }
  }
}
