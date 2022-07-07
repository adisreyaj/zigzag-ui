import {
  Component,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  NgModule,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { computePosition, flip, offset, Placement, shift } from '@floating-ui/dom';

@Component({
  selector: 'zz-dropdown',
  template: `
    <ng-template #dropdown>
      <div
        [class]="
          'dropdown absolute z-50 rounded-md border border-slate-200 bg-white p-2 max-h-[300px] overflow-y-auto ' +
          this.defaultClasses
        "
        [style]="defaultStyles"
      >
        <ul>
          <ng-content></ng-content>
        </ul>
      </div>
    </ng-template>
  `,
  standalone: true,
})
export class DropdownComponent {
  @ViewChild('dropdown', { read: TemplateRef })
  public readonly dropdown!: TemplateRef<any>;

  @Input('class')
  defaultClasses: string = '';

  @Input('style')
  defaultStyles: string = '';
}

@Component({
  selector: '[zzDropdownItem]',
  template: ` <ng-content></ng-content>`,
  standalone: true,
})
export class DropdownItemComponent {
  @HostBinding('class')
  get classes() {
    return 'hover:bg-slate-100 px-2 py-1 cursor-pointer rounded-md text-base border border-transparent hover:border-slate-200';
  }
}

@Directive({
  selector: '[zzDropdownTrigger]',
  standalone: true,
})
export class DropdownTriggerDirective implements OnDestroy {
  @Input('zzDropdownTrigger')
  dropdown!: DropdownComponent;

  @Input()
  placement: Placement = 'bottom-end';

  dropdownEl: HTMLElement | null = null;
  isOpen = false;

  constructor(private readonly vcr: ViewContainerRef, private readonly elRef: ElementRef<any>) {}

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }

  ngOnDestroy() {
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onWindowClick(event: MouseEvent) {
    if (this.isOpen && this.dropdownEl && !this.dropdownEl.contains(event.target as Node)) {
      this.close();
    } else if (this.el.contains(event.target as Node)) {
      this.showDropdown();
    }
  }

  public close = () => {
    this.dropdownEl?.remove();
    this.isOpen = false;
    this.dropdownEl = null;
  };

  private async showDropdown() {
    const clientRect = this.el.getBoundingClientRect();
    if (this.el) {
      this.dropdownEl = this.vcr.createEmbeddedView(this.dropdown.dropdown).rootNodes[0];
      if (!this.dropdownEl) {
        return;
      }
      this.dropdownEl.style.minWidth = '8rem';
      document.body.appendChild(this.dropdownEl);
      const { x, y } = await computePosition(
        {
          getBoundingClientRect: () => {
            return clientRect;
          },
        },
        this.dropdownEl,
        {
          placement: this.placement,
          middleware: [
            flip(),
            offset({
              mainAxis: 10,
            }),
            shift({
              padding: 10,
            }),
          ],
        }
      );
      if (this.dropdownEl) {
        this.dropdownEl.style.left = `${x}px`;
        this.dropdownEl.style.top = `${y}px`;
        this.dropdownEl.classList.add('open');
        this.isOpen = true;
      }
    }
  }
}

@Directive({
  selector: '[zzDropdownCloseOnClick]',
  standalone: true,
})
export class DropdownCloseOnClickDirective {
  constructor(private readonly dropdownTrigger: DropdownTriggerDirective) {}

  @HostListener('click')
  onClick() {
    this.dropdownTrigger.close();
  }
}

@NgModule({
  imports: [
    DropdownComponent,
    DropdownItemComponent,
    DropdownTriggerDirective,
    DropdownCloseOnClickDirective,
  ],
  exports: [
    DropdownComponent,
    DropdownItemComponent,
    DropdownTriggerDirective,
    DropdownCloseOnClickDirective,
  ],
})
export class DropdownModule {}

export const DROPDOWN_COMPONENTS = [
  DropdownComponent,
  DropdownItemComponent,
  DropdownTriggerDirective,
  DropdownCloseOnClickDirective,
] as const;
