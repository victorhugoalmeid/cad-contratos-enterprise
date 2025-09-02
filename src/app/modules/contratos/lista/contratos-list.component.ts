
import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ContratosApi } from '../../../shared/services/contratos.api';
import { ContratoCreate } from '../../../shared/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <div class="container">
    <h2>Meus Contratos</h2>
    <div class="actions">
      <a mat-stroked-button color="primary" routerLink="/contratos">Novo Contrato</a>
      <mat-form-field appearance="outline" style="margin-left:auto;max-width:320px;">
        <mat-label>Filtrar</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="pesquisar por número, objeto, status...">
      </mat-form-field>
    </div>

    <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z1" *ngIf="dataSource">
      <ng-container matColumnDef="numero">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Número</th>
        <td mat-cell *matCellDef="let c">{{ c.identificacao?.numero }}</td>
      </ng-container>

      <ng-container matColumnDef="ano">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Ano</th>
        <td mat-cell *matCellDef="let c">{{ c.identificacao?.ano }}</td>
      </ng-container>

      <ng-container matColumnDef="objeto">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Objeto</th>
        <td mat-cell *matCellDef="let c">{{ c.identificacao?.objeto }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
        <td mat-cell *matCellDef="let c">{{ c.status }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator [pageSize]="5" [pageSizeOptions]="[5,10,25]" aria-label="Paginação"></mat-paginator>
  </div>
  `,
  styles: [`.container{padding:16px}.actions{display:flex;gap:12px;margin:12px 0}`]
})
export class ContratosListComponent implements AfterViewInit {
  private api = inject(ContratosApi);
  dataSource = new MatTableDataSource<ContratoCreate>([]);
  displayedColumns = ['numero', 'ano', 'objeto', 'status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(){
    this.api.listContratos().subscribe(list => {
      this.dataSource = new MatTableDataSource(list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: ContratoCreate, filter: string) => {
        const term = filter.trim().toLowerCase();
        const numero = data.identificacao?.numero?.toLowerCase() || '';
        const objeto = data.identificacao?.objeto?.toLowerCase() || '';
        const status = (data.status || '').toLowerCase();
        return numero.includes(term) || objeto.includes(term) || status.includes(term);
      };
    });
  }

  applyFilter(event: Event){
    const input = event.target as HTMLInputElement;
    this.dataSource.filter = input.value.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
}
