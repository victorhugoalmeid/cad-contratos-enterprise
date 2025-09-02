import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IdentificacaoStepComponent } from './steps/identificacao.step';
import { PartesStepComponent } from './steps/partes.step';
import { ObrigacoesStepComponent } from './steps/obrigacoes.step';
import { ValoresStepComponent } from './steps/valores.step';
import { FiscalizacaoStepComponent } from './steps/fiscalizacao.step';
import { ContratosApi } from '../../shared/services/contratos.api';
import { existeElementoNoArray, dataValidaValidator, normalizarData } from '../../shared/validators/validators';
import type { ContratoCreate } from '../../shared/models';

@Component({
  selector: 'app-contratos-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatStepperModule, MatButtonModule, MatIconModule, MatCardModule,
    IdentificacaoStepComponent, PartesStepComponent, ObrigacoesStepComponent, ValoresStepComponent, FiscalizacaoStepComponent
  ],
  templateUrl: './contratos.page.html',
  styleUrls: ['./contratos.page.css']
})
export class ContratosPageComponent {
  private fb = inject(FormBuilder);
  private api = inject(ContratosApi);
  private snack = inject(MatSnackBar);
  contratosCount = 0;

  form = this.fb.group({
    identificacao: this.fb.group({
      numero: [null, Validators.required],
      ano: [new Date().getFullYear(), [Validators.required]],
      dataAssinatura: [null, [Validators.required, dataValidaValidator()]],
      objeto: [null, [Validators.required, Validators.maxLength(500)]],
      fornecedorId: [null, Validators.required],
      endereco: this.fb.group({
        cep: [null],
        uf: [null],
        cidade: [null],
        logradouro: [null],
        numero: [null],
        complemento: [null],
        bairro: [null],
      })
    }),
    partes: this.fb.group({
      fiscais: this.fb.control<number[]>([]),
      prepostoId: [null],
      representantes: this.fb.control<number[]>([]),
    }),
    obrigacoes: this.fb.array<FormControl<string>>([]),
    valores: this.fb.group({
      valorGlobal: [null, [Validators.required, Validators.min(0.01)]],
      permiteReajuste: [true, Validators.required],
      reajuste: this.fb.group({
        indiceId: [null, Validators.required],
        periodoMes: [12, [Validators.required, Validators.min(1), Validators.max(60)]],
        dataInicioContagem: [null, [Validators.required, dataValidaValidator()]],
        percentual: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      }),
    }),
    fiscalizacao: this.fb.group({
      acordos: this.fb.control<any[]>([]),
      glosas: this.fb.array<{ descricaoGlosa: string; acordoId: number }>([], [existeElementoNoArray()]),
    }),
    status: this.fb.control<ContratoCreate['status']>('rascunho', { nonNullable: true })
  });

  ngOnInit() {
    const valores = this.form.get('valores') as any;
    if (valores && !valores.get('reajuste')) {
      valores.addControl('reajuste', this.fb.group({
        indiceId: [null, Validators.required],
        periodoMes: [12, [Validators.required, Validators.min(1), Validators.max(60)]],
        dataInicioContagem: [null, [Validators.required, dataValidaValidator()]],
        percentual: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      }));
    }
    const fiscalizacao = this.form.get('fiscalizacao') as any;
    if (fiscalizacao && !fiscalizacao.get('glosas')) {
      fiscalizacao.addControl('glosas', this.fb.array([]));
    }
    if (fiscalizacao && !fiscalizacao.get('acordos')) {
      fiscalizacao.addControl('acordos', this.fb.control<any[]>([]));
    }
  }

  ngAfterViewInit(){
    this.api.listContratos().subscribe(list => this.contratosCount = list.length);
  }

  get obrigacoesArray() { return this.form.get('obrigacoes') as FormArray; }

  salvarRascunho() {
    const payload = this.form.getRawValue() as any;
    if (payload?.identificacao?.dataAssinatura)
      payload.identificacao.dataAssinatura = normalizarData(payload.identificacao.dataAssinatura);
    if (payload?.valores?.reajuste?.dataInicioContagem)
      payload.valores.reajuste.dataInicioContagem = normalizarData(payload.valores.reajuste.dataInicioContagem);
    this.api.createContrato(payload).subscribe(() => {
      this.api.listContratos().subscribe(list => this.contratosCount = list.length);
      this.snack.open('Rascunho salvo com sucesso.', 'OK', { duration: 2500 });
    });
  }

  enviarAprovacao() {
    this.form.patchValue({ status: 'enviado' });
    const payload = this.form.getRawValue() as any;
    if (payload?.identificacao?.dataAssinatura)
      payload.identificacao.dataAssinatura = normalizarData(payload.identificacao.dataAssinatura);
    if (payload?.valores?.reajuste?.dataInicioContagem)
      payload.valores.reajuste.dataInicioContagem = normalizarData(payload.valores.reajuste.dataInicioContagem);
    this.api.createContrato(payload).subscribe(() => {
      this.api.listContratos().subscribe(list => this.contratosCount = list.length);
      this.snack.open('Contrato enviado para aprovação e salvo.', 'OK', { duration: 2500 });
    });
  }
}

