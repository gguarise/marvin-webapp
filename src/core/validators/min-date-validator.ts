import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minDateValidator(
  minimalDateFormControlName: string,
  minimalDateLabel: string
) {
  return (abstractControl: AbstractControl): ValidationErrors | null => {
    if (!!abstractControl) {
      const a = abstractControl.value;
      // const value = Date();
      // const formLine = abstractControl.parent?.getRawValue();
      // if (!!formLine) {
      //   const minValue = Number(formLine[minimalValueFormControlName]);
      //   if (minValue > value) {
      //     return {
      //       custom: {
      //         message: `Valor deve ser igual ou superior ao campo ${minimalValueLabel}`,
      //       },
      //     };
      //   }
      // }
    }
    return null;
  };
}
