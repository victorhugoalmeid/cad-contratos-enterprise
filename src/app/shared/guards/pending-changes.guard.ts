
import { CanDeactivateFn } from '@angular/router';
export interface DirtyForm { form?: { dirty?: boolean }; }
export const pendingChangesGuard: CanDeactivateFn<DirtyForm> = (component, currentRoute, currentState, nextState) => {
  const dirty = !!component?.form?.dirty;
  if (!dirty) return true;
  return confirm('Existem alterações não salvas. Deseja realmente sair?');
};
