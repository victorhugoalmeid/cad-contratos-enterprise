
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ContratosApi } from '../../../shared/services/contratos.api';
import { Fornecedor } from '../../../shared/models';

@Component({
  selector: 'app-identificacao-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
  <form *ngIf="group as g" [formGroup]="g" class="grid">
    <mat-form-field appearance="outline">
      <mat-label>Número</mat-label>
      <input matInput formControlName="numero" placeholder="Ex.: 2025-001">
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>Ano</mat-label>
      <input matInput type="number" formControlName="ano">
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>Data de Assinatura</mat-label>
      <input matInput formControlName="dataAssinatura" placeholder="YYYY-MM-DD ou DD/MM/AAAA">
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>Objeto</mat-label>
      <textarea matInput rows="3" formControlName="objeto" maxlength="500"></textarea>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Fornecedor</mat-label>
      <mat-select formControlName="fornecedorId">
        <mat-option *ngFor="let f of fornecedores" [value]="f.id">{{ f.nomeRazaoSocial }} ({{ f.tipo }})</mat-option>
      </mat-select>
    </mat-form-field>
  </form>
  `,
  styles: [`.grid{display:grid;gap:12px}`]
})
export class IdentificacaoStepComponent {
  @Input({ required: true }) group!: FormGroup;
  private api = inject(ContratosApi);
  fornecedores: Fornecedor[] = [];

  ngOnInit(){
    this.api.listFornecedores().subscribe(f => this.fornecedores = f);
  }
}
