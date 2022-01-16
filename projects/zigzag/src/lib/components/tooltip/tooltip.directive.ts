import { Directive, ElementRef, HostListener, Inject, Input, NgModule } from '@angular/core';
import { computePosition, flip, offset, Placement, shift } from '@floating-ui/dom';
import { CommonModule, DOCUMENT } from '@angular/common';

@Directive({
  selector: '[zzTooltip]',
})
export class TooltipDirective {
  @Input()
  zzTooltip: string = '';

  @Input()
  placement: Placement = 'top';

  private tooltipRef!: HTMLDivElement;

  constructor(
    private readonly elRef: ElementRef,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    console.log(this.elRef);
  }

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

  @HostListener('mouseenter')
  // @HostListener('focus')
  async onMouseEnter() {
    await this.showTooltip();
  }

  @HostListener('mouseleave')
  // @HostListener('blur')
  onMouseLeave() {
    this.hideTooltip();
  }

  private async showTooltip() {
    if (this.el) {
      this.cleanupTooltips();
      this.createToolTip();
    }
    const clientRect = this.el.getBoundingClientRect();
    if (this.el && this.tooltipRef) {
      this.tooltipRef.style.display = 'block';
      const { x, y } = await computePosition(
        {
          getBoundingClientRect: () => {
            return clientRect;
          },
        },
        this.tooltipRef,
        {
          placement: this.placement,
          middleware: [
            flip(),
            offset({
              mainAxis: 10,
            }),
            shift({ padding: 0 }),
          ],
        }
      );
      if (this.tooltipRef) {
        this.tooltipRef.style.left = `${x}px`;
        this.tooltipRef.style.top = `${y}px`;
        this.tooltipRef.classList.add('open');
      }
    }
  }

  private hideTooltip() {
    this.tooltipRef.style.display = 'none';
    this.tooltipRef.remove();
    this.tooltipRef.classList.remove('open');
  }

  private createToolTip() {
    const tooltip = this.document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.innerHTML = this.zzTooltip;
    tooltip.id = 'zz-tooltip';
    tooltip.style.display = 'none';
    this.tooltipRef = this.document.body.appendChild(tooltip);
  }

  private cleanupTooltips() {
    const tooltips = this.document.querySelectorAll('.tooltip');
    tooltips.forEach((tooltip) => {
      tooltip.remove();
    });
  }
}

@NgModule({
  declarations: [TooltipDirective],
  imports: [CommonModule],
  exports: [TooltipDirective],
})
export class TooltipModule {}
