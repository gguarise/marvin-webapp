import { AbstractControl, ValidationErrors } from '@angular/forms';

export function duplicateTableValueValidator(
  formControlName: string,
  fieldLabel: string = 'Valor',
  isLabelFeminina: boolean = false
) {
  return (abstractControl: AbstractControl): ValidationErrors | null => {
    if (!!abstractControl && !!abstractControl.value) {
      if (hasDuplicate(abstractControl, formControlName)) {
        return {
          custom: {
            message: `${fieldLabel} já utilizad${
              isLabelFeminina ? 'a' : 'o'
            } em outra linha.`,
          },
        };
      }
    }
    return null;
  };
}

export function hasDuplicate(
  abstractControl: AbstractControl,
  formControlName: string
) {
  const formArrayTable = abstractControl.parent?.parent?.getRawValue();
  const keyValuesArray = formArrayTable.map((item: any) => {
    if (!!item[formControlName]) {
      return item[formControlName]
        .toString()
        .trim()
        .toUpperCase()
        .replace(/[^\w\s]/gi, '');
    }
  });

  const a =
    keyValuesArray.filter(
      (x: any) =>
        x ===
        abstractControl.value
          .toString()
          .trim()
          .toUpperCase()
          .replace(/[^\w\s]/gi, '')
    ).length > 1;
  return a;
}
