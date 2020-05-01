import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auto-closing-dialog-modal',
  templateUrl: './auto-closing-dialog-modal.component.html'
})
export class AutoClosingDialogModalComponent implements OnInit {
  message: string;
  constructor() { }

  ngOnInit() {
    this.message = this['inputs'].message;

    setTimeout(() => {
      this.destroyModal();
    }, 2400);
  }

  destroyModal() {
    this['inputs'].destroy();
  }
}
