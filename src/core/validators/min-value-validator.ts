import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minValueValidator(
  minimalValueFormControlName: string,
  minimalValueLabel: string
) {
  return (abstractControl: AbstractControl): ValidationErrors | null => {
    if (!!abstractControl) {
      const value = Number(abstractControl.value);
      const formLine = abstractControl.parent?.getRawValue();
      if (!!formLine) {
        const minValue = Number(formLine[minimalValueFormControlName]);
        if (minValue > value) {
          return {
            custom: {
              message: `Valor deve ser igual ou superior ao campo ${minimalValueLabel}`,
            },
          };
        }
      }
    }
    return null;
  };
}
