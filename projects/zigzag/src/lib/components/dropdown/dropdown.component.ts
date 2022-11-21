import {
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
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
          'dropdown absolute z-50 border border-slate-200 bg-white p-2 max-h-[300px] overflow-y-auto ' +
          'rounded=' +
          this.dropdownConfig.rounded +
          ' ' +
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

  constructor(@Inject(DROPDOWN_CONFIG) public readonly dropdownConfig: DropdownGlobalConfig) {}
}

@Component({
  selector: '[zzDropdownItem]',
  template: ` <ng-content></ng-content>`,
  standalone: true,
})
export class DropdownItemComponent {
  constructor(@Inject(DROPDOWN_CONFIG) private readonly dropdownConfig: DropdownGlobalConfig) {}

  @HostBinding('class')
  get classes() {
    return `hover:bg-slate-100 px-2 py-1 cursor-pointer rounded-${this.dropdownConfig.rounded} text-base border border-transparent hover:border-slate-200`;
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

  dropdownEl?: HTMLElement | null;
  dropdownRef?: EmbeddedViewRef<HTMLDivElement>;
  isOpen = false;

  constructor(
    private readonly vcr: ViewContainerRef,
    private readonly elRef: ElementRef,
    private readonly cd: ChangeDetectorRef
  ) {}

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
    this.dropdownRef?.destroy();
  };

  private async showDropdown() {
    if (this.el) {
      this.dropdownRef = this.vcr.createEmbeddedView(this.dropdown.dropdown);
      const elRef: HTMLElement = this.dropdownRef.rootNodes[0];
      if (!elRef) {
        return;
      }
      elRef.style.minWidth = '8rem';
      document.body.appendChild(elRef);
      this.dropdownRef.detectChanges();
      const { x, y } = await computePosition(this.el, elRef, {
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
      });
      if (elRef) {
        elRef.style.left = `${x}px`;
        elRef.style.top = `${y}px`;
        elRef.classList.add('open');
        this.isOpen = true;
        this.dropdownEl = elRef;
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

export interface DropdownGlobalConfig {
  rounded: 'sm' | 'md' | 'lg' | 'full' | 'none';
}

export const DROPDOWN_CONFIG = new InjectionToken<DropdownGlobalConfig>(
  'Global Dropdown Configuration',
  {
    providedIn: 'root',
    factory: () => ({
      rounded: 'md',
    }),
  }
);
