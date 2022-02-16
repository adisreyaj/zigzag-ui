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
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

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

  open<ModalData extends unknown, AfterCloseData extends unknown>(
    component: Type<any>,
    options: Partial<ModalOptions<ModalData>>
  ) {
    let componentRef: ComponentRef<any>;
    let element: HTMLElement;
    const internalModalRef = new InternalModalRef<ModalData>();
    const afterClosedSubject = new Subject<AfterCloseData>();
    const injector = Injector.create({
      providers: [
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
    const clickListener = () => {
      internalModalRef.close();
    };
    internalModalRef.setProps({
      element,
      container,
      componentRef,
      clickListener,
      afterClosedSubject,
      data: options.data,
    });
    const closeButton = this.getCloseButton();
    closeButton.addEventListener('click', clickListener);
    element.appendChild(closeButton);
    return { componentRef, afterClosed$: afterClosedSubject.asObservable() };
  }

  private getCloseButton() {
    const button = this.document.createElement('div');
    button.classList.add('zz-modal-close');
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="m12 10.586 4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>`;
    return button;
  }
}

export class ModalRef<T = unknown> {
  public readonly element!: HTMLElement;
  public readonly data!: T;
  private readonly container!: HTMLElement;
  private readonly componentRef!: ComponentRef<any>;
  private readonly clickListener!: () => void;
  private readonly afterClosedSubject!: Subject<unknown>;

  constructor() {}

  close(value?: unknown) {
    this.element.removeEventListener('click', this.clickListener);
    this.element.remove();
    this.container.remove();
    this.componentRef.destroy();
    this.afterClosedSubject.next(value);
  }
}

export class InternalModalRef<T> extends ModalRef<T> {
  setProps(props: any) {
    Object.assign(this, props);
  }
}

export interface ModalOptions<T> {
  data: T;
  size: ModalSize;
}

export type ModalSize = 'sm' | 'md' | 'lg';
