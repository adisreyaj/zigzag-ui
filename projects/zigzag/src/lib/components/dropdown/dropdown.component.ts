import {
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  NgModule,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { computePosition, flip, offset, Placement, shift } from '@floating-ui/dom';

@Component({
  selector: 'zz-dropdown',
  template: `
    <ng-template #dropdown>
      <div class="p-2 dropdown rounded-md border border-slate-200 absolute z-50 bg-white">
        <ul>
          <ng-content></ng-content>
        </ul>
      </div>
    </ng-template>
  `,
})
export class DropdownComponent {
  @ViewChild('dropdown', { read: TemplateRef })
  public readonly dropdown!: TemplateRef<any>;
}

@Component({
  selector: 'zz-dropdown-item',
  template: `
    <li
      #dropdownItem
      class="hover:bg-slate-100 px-2 py-1 cursor-pointer rounded-md text-base border border-transparent hover:border-slate-200"
    >
      <ng-content></ng-content>
    </li>
  `,
})
export class DropdownItemComponent {}

@Directive({
  selector: '[zzDropdownTrigger]',
})
export class DropdownTriggerDirective {
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

  @HostListener('document:click', ['$event'])
  onWindowClick(event: MouseEvent) {
    if (this.isOpen && this.dropdownEl && !this.dropdownEl.contains(event.target as Node)) {
      this.dropdownEl.remove();
      this.isOpen = false;
      this.dropdownEl = null;
    } else if (this.el.contains(event.target as Node)) {
      this.showDropdown();
    }
  }

  ngOnInit() {
    setTimeout(() => {
      console.log(this.dropdown?.dropdown);
    }, 0);
  }

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

@NgModule({
  declarations: [DropdownComponent, DropdownItemComponent, DropdownTriggerDirective],
  exports: [DropdownComponent, DropdownItemComponent, DropdownTriggerDirective],
})
export class DropdownModule {}
