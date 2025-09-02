import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-obrigacoes-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule],
  template: `
  <div class="grid">
    <mat-form-field appearance="outline">
      <mat-label>Nova obrigação</mat-label>
      <input matInput #obg>
      <button mat-button matSuffix (click)="add(obg.value); obg.value=''">Adicionar</button>
    </mat-form-field>

    <mat-list>
      <mat-list-item *ngFor="let item of array.controls; let i = index">
        {{ item.value }}
        <button mat-button color="warn" (click)="remove(i)">Remover</button>
      </mat-list-item>
    </mat-list>
  </div>
  `,
  styles: [`.grid{display:grid;gap:12px}`]
})
export class ObrigacoesStepComponent{
  @Input({ required: true }) array!: FormArray<FormControl<string>>;

  add(text: string){
    if(!text?.trim()) return;
    this.array.push(new FormControl<string>(text, { nonNullable: true }));
  }
  remove(i: number){
    this.array.removeAt(i);
  }
}
