
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

/** Aceita 'YYYYMMDD', 'YYYY-MM-DD', 'DD/MM/YYYY' e retorna 'YYYY-MM-DD'. */
export function normalizarData(input: string | null | undefined): string | null {
  if (!input) return null;
  const v = ('' + input).trim();
  if (!v) return null;

  const yyyy_mm_dd = /^\d{4}-\d{2}-\d{2}$/;
  const yyyymmdd = /^(\d{4})(\d{2})(\d{2})$/;
  const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  const valid = (y: number, m: number, d: number) => {
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === (m - 1) && dt.getUTCDate() === d;
  };

  if (yyyy_mm_dd.test(v)) {
    const [y, m, d] = v.split('-').map(Number);
    return valid(y, m, d) ? v : null;
  }

  const m1 = yyyymmdd.exec(v);
  if (m1) {
    const y = parseInt(m1[1], 10);
    const mo = parseInt(m1[2], 10);
    const d = parseInt(m1[3], 10);
    return valid(y, mo, d) ? `${y}-${pad(mo)}-${pad(d)}` : null;
  }

  const m2 = ddmmyyyy.exec(v);
  if (m2) {
    const d = parseInt(m2[1], 10);
    const mo = parseInt(m2[2], 10);
    const y = parseInt(m2[3], 10);
    return valid(y, mo, d) ? `${y}-${pad(mo)}-${pad(d)}` : null;
  }

  return null;
}

export function dataValidaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value ?? '').toString().trim();
    if (!v) return null;
    const iso = normalizarData(v);
    return iso ? null : { dataInvalida: true };
  };
}
