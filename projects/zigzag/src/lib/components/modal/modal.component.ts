import { Component, InjectionToken, NgModule } from '@angular/core';

@Component({
  selector: 'wfh-modal',
  template: ``,
})
export class ModalComponent {}

@NgModule({
  declarations: [ModalComponent],
  exports: [ModalComponent],
})
export class ModalModule {}

export const MODAL_DATA = new InjectionToken<unknown>('Modal Data');
