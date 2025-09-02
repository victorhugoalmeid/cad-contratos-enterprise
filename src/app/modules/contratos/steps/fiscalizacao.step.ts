import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ContratosApi } from '../../../shared/services/contratos.api';
import { AcordoMinimo } from '../../../shared/models';

@Component({
  selector: 'app-fiscalizacao-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatTableModule, MatButtonModule],
  template: `
  <form *ngIf="group as g" [formGroup]="g" class="grid">
    <mat-form-field appearance="outline">
      <mat-label>Acordos mínimos de serviço</mat-label>
      <mat-select (selectionChange)="onSelectAcordo($event.value)">
        <mat-option *ngFor="let a of acordos" [value]="a">{{ a.nome }}</mat-option>
      </mat-select>
    </mat-form-field>

    <table mat-table [dataSource]="g.value.acordos || []" class="mat-elevation-z1">
      <ng-container matColumnDef="nome">
        <th mat-header-cell *matHeaderCellDef>Acordo</th>
        <td mat-cell *matCellDef="let a">{{ a.nome }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="['nome']"></tr>
      <tr mat-row *matRowDef="let row; columns: ['nome'];"></tr>
    </table>

    <ng-container *ngIf="g.get('glosas') as glosas">
      <div formArrayName="glosas" class="grid">
        <div *ngFor="let _ of glosas.controls; let i = index" [formGroupName]="i" class="glosa">
          <mat-form-field appearance="outline">
            <mat-label>Descrição da Glosa</mat-label>
            <input matInput formControlName="descricaoGlosa">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Acordo Id</mat-label>
            <input matInput type="number" formControlName="acordoId">
          </mat-form-field>
          <button mat-button color="warn" (click)="removeGlosa(i)">Remover</button>
        </div>
        <button mat-stroked-button color="primary" (click)="addGlosa()">Adicionar Glosa</button>
      </div>
    </ng-container>
  </form>
  `,
  styles: [`.grid{display:grid;gap:12px}.glosa{display:grid;gap:8px;grid-template-columns:1fr 1fr auto;align-items:center}`]
})
export class FiscalizacaoStepComponent {
  @Input({ required: true }) group!: FormGroup;
  private api = inject(ContratosApi);
  private fb = inject(FormBuilder);
  acordos: AcordoMinimo[] = [];

  get glosas() { return this.group.get('glosas') as FormArray; }

  ngOnInit(){
    this.api.listAcordosMinimos().subscribe(a => this.acordos = a);
    const g: any = this.group;
    if (g && !g.get('glosas')) {
      g.addControl('glosas', this.fb.array([]));
    }
    if (g && !g.get('acordos')) {
      g.addControl('acordos', this.fb.control<any[]>([]));
    }
  }

  onSelectAcordo(a: AcordoMinimo){
    const arr = this.group.get('acordos');
    const value = (arr?.value || []) as AcordoMinimo[];
    (arr as any).setValue([...value, a]);
  }

  addGlosa(){
    this.glosas.push(this.fb.group({
      descricaoGlosa: [''],
      acordoId: [null]
    }));
  }

  removeGlosa(i: number){
    this.glosas.removeAt(i);
  }
}
