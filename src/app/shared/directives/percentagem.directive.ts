import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[appPercentagem]',
  standalone: true,
})
export class PercentagemDirective {
  private el = inject(ElementRef<HTMLInputElement>);
  private ngControl = inject(NgControl);
  @HostListener('input', ['$event'])
  onInput() {
    const input = this.el.nativeElement;
    const raw = (input.value || '').replace(/[^0-9]/g, '');
    const num = Math.min(10000, Number(raw));
    const value = (num / 100).toFixed(2);
    input.value = value.replace('.', ',') + '%';
    this.ngControl.control?.setValue(parseFloat(value), { emitEvent: true, emitModelToViewChange: false });
  }
  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    if (!input.value) this.ngControl.control?.setValue(null);
  }
}
