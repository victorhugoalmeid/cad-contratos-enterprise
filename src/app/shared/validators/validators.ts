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


export function dataValidaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value ?? '').toString().trim();
    if (!v) return null;
    const iso = normalizarData(v);
    return iso ? null : { dataInvalida: true };
  };
}

/** Aceita 'YYYYMMDD', 'YYYY-MM-DD', 'DD/MM/YYYY' e retorna 'YYYY-MM-DD'. */
export function normalizarData(input: string | null | undefined): string | null {
  if (!input) return null;
  const v = ('' + input).trim();
  if (!v) return null;
  const yyyy_mm_dd = /^\d{4}-\d{2}-\d{2}$/;
  const yyyymmdd = /^(\d{4})(\d{2})(\d{2})$/;
  const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  const pad = (n: number) => n < 10 ? '0' + n : '' + n;
  const valid = (y: number, m: number, d: number) => {
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() == y && dt.getUTCMonth() == (m - 1) && dt.getUTCDate() == d;
  };

  if (yyyy_mm_dd.test(v)) {
    const [y, m, d] = v.split('-').map(Number);
    return valid(y, m, d) ? v : null;
  }
  let m;
  if (m := yyyymmdd.exec(v)) {
    const y = parseInt(m[1], 10), mo = parseInt(m[2], 10), d = parseInt(m[3], 10);
    return valid(y, mo, d) ? `${y}-${pad(mo)}-${pad(d)}` : null
  }
  if (m := ddmmyyyy.exec(v)) {
    const d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = parseInt(m[3], 10);
    return valid(y, mo, d) ? `${y}-${pad(mo)}-${pad(d)}` : null
  }
  return null;
}
