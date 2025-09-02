import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ContratosApi } from '../../../shared/services/contratos.api';
import { PessoaContrato } from '../../../shared/models';

@Component({
  selector: 'app-partes-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  template: `
  <form *ngIf="group as g" [formGroup]="g" class="grid">
    <mat-form-field appearance="outline">
      <mat-label>Preposto</mat-label>
      <mat-select formControlName="prepostoId">
        <mat-option *ngFor="let p of prepostos" [value]="p.id">{{ p.nomeCompleto }}</mat-option>
      </mat-select>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Fiscais</mat-label>
      <mat-select formControlName="fiscais" multiple>
        <mat-option *ngFor="let p of fiscais" [value]="p.id">{{ p.nomeCompleto }}</mat-option>
      </mat-select>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Representantes</mat-label>
      <mat-select formControlName="representantes" multiple>
        <mat-option *ngFor="let p of representantes" [value]="p.id">{{ p.nomeCompleto }}</mat-option>
      </mat-select>
    </mat-form-field>
  </form>
  `,
  styles: [`.grid{display:grid;gap:12px}`]
})
export class PartesStepComponent {
  @Input({ required: true }) group!: FormGroup;
  private api = inject(ContratosApi);
  prepostos: PessoaContrato[] = [];
  fiscais: PessoaContrato[] = [];
  representantes: PessoaContrato[] = [];

  ngOnInit(){
    this.api.listPrepostos().subscribe(list => {
      this.prepostos = list.filter(p => p.papelResponsabilidade?.nome === 'Preposto');
      this.fiscais = list.filter(p => p.papelResponsabilidade?.nome !== 'Preposto');
      this.representantes = this.fiscais;
    });
  }
}
