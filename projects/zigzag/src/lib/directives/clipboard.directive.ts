import { Directive, HostListener, Input, NgModule } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Directive({
  selector: '[zzClipboard]',
  standalone: true,
})
export class ClipboardDirective {
  @Input('zzClipboard') text!: string;

  @HostListener('click')
  onClick() {
    this.clipboard.copy(this.text);
  }

  constructor(private clipboard: Clipboard) {}
}

@NgModule({
  declarations: [ClipboardDirective],
  exports: [ClipboardDirective],
})
export class ClipboardDirectiveModule {}
