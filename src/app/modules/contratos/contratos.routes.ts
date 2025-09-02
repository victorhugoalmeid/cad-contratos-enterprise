import { Routes } from '@angular/router';
import { pendingChangesGuard } from '../../shared/guards/pending-changes.guard';
import { ContratosListComponent } from './lista/contratos-list.component';
import { ContratosPageComponent } from './contratos.page';
export const CONTRATOS_ROUTES: Routes = [
  { path: '', component: ContratosPageComponent, canDeactivate: [pendingChangesGuard] },
  { path: 'lista', component: ContratosListComponent }
];
