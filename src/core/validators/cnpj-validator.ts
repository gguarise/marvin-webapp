import { AbstractControl } from '@angular/forms';

export function CNPJValidator(ctrl: AbstractControl) {
  if (!!ctrl && !!ctrl.value && !isValidCNPJ(ctrl.value)) {
    return { custom: { message: 'CNPJ Inválido.' } };
  }
  return null;
}

const multCNPJ1 = [6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9];
const multCNPJ2 = [5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8];

export function isValidCNPJ(cnpj: string) {
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

  const dvInformado = cnpj.substr(cnpj.length - 2, cnpj.length);
  const dvCalculado = `${dv1}${dv2}`;
  return dvInformado === dvCalculado;
}
