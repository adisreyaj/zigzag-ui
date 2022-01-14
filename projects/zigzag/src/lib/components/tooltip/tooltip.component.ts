import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';

@Component({
  selector: '[zzTooltip]',
  template: `
    <ng-content></ng-content>
    <div #tooltip>
      {{ zzTooltip }}
    </div>
  `,
})
export class TooltipComponent implements OnChanges, AfterViewInit {
  @Input()
  zzTooltip: string = '';

  @ViewChild('tooltip', { static: true })
  private readonly tooltip!: ElementRef<HTMLDivElement>;

  constructor(private el: ElementRef) {}
  ngAfterViewInit(): void {
    computePosition(this.el.nativeElement, this.tooltip.nativeElement, {
      placement: 'top',
      middleware: [offset(6), flip(), shift({ padding: 5 })],
    }).then(({ x, y, placement, middlewareData }) => {});
  }

  ngOnChanges(changes: SimpleChanges): void {}
}

@NgModule({
  declarations: [TooltipComponent],
  imports: [],
  exports: [TooltipComponent],
})
export class TooltipModule {}
