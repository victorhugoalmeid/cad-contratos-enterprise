import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'contratos', pathMatch: 'full' },
  { path: 'contratos', loadChildren: () => import('./modules/contratos/contratos.routes').then(m => m.CONTRATOS_ROUTES) },
  { path: '**', redirectTo: 'contratos' }
];
