import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
export function existeElementoNoArray(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const arr = control as FormArray;
    return arr && arr.length > 0 ? null : { requiredArray: true };
  };
}
export function cpfCnpjValidator(): ValidatorFn {
  const onlyDigits = (v: string) => (v || '').replace(/\D/g, '');
  return (control: AbstractControl): ValidationErrors | null => {
    const v = onlyDigits(control.value || '');
    if (!v) return null;
    if (v.length === 11) return /^[0-9]{11}$/.test(v) ? null : { cpfInvalido: true };
    if (v.length === 14) return /^[0-9]{14}$/.test(v) ? null : { cnpjInvalido: true };
    return { cpfCnpjTamanhoInvalido: true };
  };
}
