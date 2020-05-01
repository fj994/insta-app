import { Injectable } from '@angular/core';
import { DomService } from './dom.service';
import { UploadImageModalComponent } from './upload-image-modal/upload-image-modal.component';
import { DialogModalComponent } from './dialog-modal/dialog-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private domService: DomService) { }

  init(component: any, inputs: object, outputs: object) {
    const destroy = () => {
      this.destroy();
    }

    let componentConfig = {
      inputs: {...inputs, destroy: destroy},
      outputs: outputs
    }

    this.domService.appendComponent(component, componentConfig);
  }

  initUploadImageModal(inputs) {
    this.init(UploadImageModalComponent, inputs, {});
  }

  initDialogModal(inputs) {
    this.init(DialogModalComponent, inputs, {});
  }

  destroy() {
    this.domService.removeComponent();
  }
}
