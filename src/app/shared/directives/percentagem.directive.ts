import { Directive, HostListener, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
@Directive({
  selector: '[appPercentagem]',
  standalone: true,
})
export class PercentagemDirective implements OnInit, OnDestroy {
  private subscription?: Subscription;

  constructor(
    private readonly ngControl: NgControl,
    private readonly elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.ngControl.valueChanges?.subscribe(valor => {
      if (valor !== null && valor !== undefined && valor !== '') {
        this.formataValorPercentual();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private formataValorPercentual(): void {
    const input = this.elementRef.nativeElement as HTMLInputElement;
    if (!input) return;

    const valorPercentual = this.ngControl.value;
    if (typeof valorPercentual === 'string') {
      const n = parseFloat(valorPercentual.replace(',', '.'));
      if (!Number.isNaN(n) && n > 100) {
        this.ngControl.control?.setValue('100', { emitEvent: false });
        input.value = '100%';
        return;
      }
      if (!valorPercentual.includes('%')) {
        const v = valorPercentual.replace('.', ',') + '%';
        input.value = v;
      }
      return;
    }

    if (typeof valorPercentual === 'number') {
      const n = Math.min(valorPercentual, 100);
      const v = n.toString().replace('.', ',') + '%';
      input.value = v;
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value;

    rawValue = rawValue.replace('%', '').trim();
    rawValue = rawValue.replace(/[^0-9,]/g, '');

    const numericValue = rawValue.replace(',', '.');

    const n = parseFloat(numericValue);
    if (!Number.isNaN(n) && n > 100) {
      this.ngControl.control?.setValue('100');
      input.value = '100%';
      return;
    }

    this.ngControl.control?.setValue(numericValue);
    this.formataValorPercentual();
  }

  /**
   * Move o cursor para a esquerda quando o usuário pressiona a tecla Backspace evitando bugs ao editar o valor do percentual
   * @param event Evento de teclado
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && input.selectionStart === input.value.length) {
      const novaPosicao = input.value.length - 1;
      if (novaPosicao >= 0) {
        input.setSelectionRange(novaPosicao, novaPosicao);
      }
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.value === '%') {
      this.ngControl.control?.setValue('');
      input.value = '';
    }
  }
}
