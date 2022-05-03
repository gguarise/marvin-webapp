import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FieldValidators {
  static CNPJ(control: AbstractControl): ValidationErrors | null {
    return FieldValidators.CNPJValidator()(control);
  }

  static CPF(control: AbstractControl): ValidationErrors | null {
    return FieldValidators.CPFValidator()(control);
  }

  // Validações e mensagens de erro
  private static CNPJValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        !!control &&
        !!control.value &&
        !FieldValidators.isValidCNPJ(control.value)
      ) {
        return { custom: { message: 'CNPJ Inválido.' } };
      }
      return null;
    };
  }

  private static CPFValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        !!control &&
        !!control.value &&
        !FieldValidators.isValidCPF(control.value)
      ) {
        return { custom: { message: 'CPF Inválido.' } };
      }
      return null;
    };
  }

  // Lógica das Validações
  private static isValidCNPJ(cnpj: string) {
    const multCNPJ1 = [6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9];
    const multCNPJ2 = [5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8];

    cnpj = (cnpj || '').replace(/\D+/g, '');
    if (cnpj.length !== 14) {
      return false;
    }

    let soma1 = 0;
    let soma2 = 0;
    for (let i = 0; i < 12; i++) {
      soma1 += multCNPJ1[i] * parseInt(cnpj.charAt(i), 10);
      soma2 += multCNPJ2[i] * parseInt(cnpj.charAt(i), 10);
    }
    const dv1 = (soma1 % 11) % 10;
    soma2 += dv1 * 9;
    const dv2 = (soma2 % 11) % 10;

    const dvInformado = cnpj.substring(cnpj.length - 2, cnpj.length);
    const dvCalculado = `${dv1}${dv2}`;
    return dvInformado === dvCalculado;
  }

  private static isValidCPF(cpf: string) {
    cpf = (cpf || '').replace(/\D+/g, '');

    // Elimina CPFs invalidos conhecidos
    if (
      Number(cpf.length) !== 11 ||
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    ) {
      return false;
    }

    // Valida 1º digito
    let add = 0;
    for (let i = 0; i < 9; i++) {
      add += Number(cpf.charAt(i)) * (10 - i);
    }
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != Number(cpf.charAt(9))) {
      return false;
    }
    // Valida 2º digito
    add = 0;
    for (let i = 0; i < 10; i++) {
      add += Number(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
      rev = 0;
    }
    if (rev != Number(cpf.charAt(10))) {
      return false;
    }
    return true;
  }
}
