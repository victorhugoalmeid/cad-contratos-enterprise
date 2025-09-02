
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const msg = err?.error?.title || err?.message || 'Erro inesperado';
      snack.open(`Erro HTTP: ${msg}`, 'Fechar', { duration: 3500 });
      return throwError(() => err);
    })
  );
};
