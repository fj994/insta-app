import { Injectable } from '@angular/core';
import { DomService } from './dom.service';
import { UploadImageModalComponent } from './upload-image-modal/upload-image-modal.component';
import { DialogModalComponent } from './dialog-modal/dialog-modal.component';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { AutoClosingDialogModalComponent } from './auto-closing-dialog-modal/auto-closing-dialog-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private domService: DomService) { }

  init(component: any, inputs: object, outputs: object): void {
    const destroy = () => {
      this.destroy();
    }

    let componentConfig = {
      inputs: {...inputs, destroy: destroy},
      outputs: outputs
    }

    this.domService.appendComponent(component, componentConfig);
  }

  initUploadImageModal(inputs): void {
    this.init(UploadImageModalComponent, inputs, {});
  }

  initDialogModal = (inputs): void => {
    this.init(DialogModalComponent, inputs, {});
  }

  initEditProfileModal(inputs): void {
    this.init(EditProfileModalComponent, inputs, {});
  }

  initAutoClosingDialogModal = (inputs): void => {
    this.init(AutoClosingDialogModalComponent, inputs, {});
  }

  destroy(): void {
    this.domService.removeComponent();
  }
}
