import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import { MODAL_DATA } from './modal.component';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private readonly injector: Injector,
    private readonly appRef: ApplicationRef,
    private readonly cfr: ComponentFactoryResolver,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  open(component: Type<any>, options: Partial<ModalOptions<unknown>>) {
    let componentRef: ComponentRef<any>;
    let element: HTMLElement;
    const internalModalRef = new InternalModalRef();
    const injector = Injector.create({
      providers: [
        { provide: MODAL_DATA, useValue: options.data ?? null },
        {
          provide: ModalRef,
          useValue: internalModalRef,
        },
      ],
      parent: this.injector,
    });
    const modalSize = options.size ?? 'sm';
    const componentFactory = this.cfr.resolveComponentFactory(component);
    componentRef = componentFactory.create(injector);
    this.appRef.attachView(componentRef.hostView);
    element = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    element.classList.add(`zz-modal`);
    setTimeout(() => {
      element.classList.add(`open`);
    }, 0);
    element.classList.add(modalSize);
    const container = this.document.createElement('div');
    container.classList.add('zz-modal-container');
    container.appendChild(element);
    this.document.body.appendChild(container);
    internalModalRef.setProps({ element, container, componentRef });

    return componentRef;
  }
}

export class ModalRef {
  private readonly element!: HTMLElement;
  private readonly container!: HTMLElement;
  private readonly componentRef!: ComponentRef<any>;

  constructor() {}

  close() {
    this.element.remove();
    this.container.remove();
    this.componentRef.destroy();
  }
}

export class InternalModalRef extends ModalRef {
  setProps(props: any) {
    Object.assign(this, props);
  }
}

export interface ModalOptions<T> {
  data: T;
  size: ModalSize;
}

export type ModalSize = 'sm' | 'md' | 'lg';
