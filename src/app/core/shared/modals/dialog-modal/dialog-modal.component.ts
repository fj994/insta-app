import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html'
})
export class DialogModalComponent implements OnInit {
  message: string;
  constructor() { }

  ngOnInit() {
    this.message = this['inputs'].message;
  }

  destroyModal(): void {
    this['inputs'].destroy();
  }
}
