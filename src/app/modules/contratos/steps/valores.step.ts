import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PercentagemDirective } from '../../../shared/directives/percentagem.directive';

@Component({
  selector: 'app-valores-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, PercentagemDirective],
  template: `
  <form *ngIf="group as g" [formGroup]="g" class="grid">
    <mat-form-field appearance="outline">
      <mat-label>Valor Global</mat-label>
      <input matInput type="number" step="0.01" formControlName="valorGlobal">
    </mat-form-field>

    <ng-container *ngIf="g.get('reajuste') as reajuste">
      <div [formGroup]="reajuste">
        <mat-form-field appearance="outline">
          <mat-label>Índice</mat-label>
          <input matInput formControlName="indiceId" placeholder="Ex.: 1">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Período (meses)</mat-label>
          <input matInput type="number" formControlName="periodoMes">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Data início contagem</mat-label>
          <input matInput formControlName="dataInicioContagem" placeholder="YYYY-MM-DD">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Percentual</mat-label>
          <input matInput appPercentagem formControlName="percentual" placeholder="Ex.: 3%">
        </mat-form-field>
      </div>
    </ng-container>
  </form>
`,
})
export class ValoresStepComponent{
  @Input({ required: true }) group!: FormGroup;
}
