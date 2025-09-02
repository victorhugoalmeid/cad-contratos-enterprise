import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcordoMinimo, Fornecedor, PessoaContrato, ContratoCreate } from '../models';
@Injectable({ providedIn: 'root' })
export class ContratosApi {
  private http = inject(HttpClient);
  private jsonServer = 'http://localhost:3001';
  private prism = 'http://localhost:4010';
  private contratosJson = 'http://localhost:3001/contratos';

  listFornecedores(tipo?: 'PF'|'PJ'): Observable<Fornecedor[]> {
    const url = `${this.jsonServer}/fornecedores` + (tipo ? `?tipo=${tipo}` : '');
    return this.http.get<Fornecedor[]>(url);
  }
  listPrepostos(idContrato?: number): Observable<PessoaContrato[]> {
    const qs = idContrato ? `?idContrato=${idContrato}` : '';
    return this.http.get<PessoaContrato[]>(`${this.jsonServer}/pessoas_prepostos${qs}`);
  }
  listAcordosMinimos(): Observable<AcordoMinimo[]> {
    return this.http.get<AcordoMinimo[]>(`${this.jsonServer}/acordos-minimos`);
  }
  // Persistente via json-server
  createContrato(payload: ContratoCreate) {
    return this.http.post(this.contratosJson, payload);
  }
  listContratos() {
    return this.http.get<ContratoCreate[]>(this.contratosJson);
  }
}
